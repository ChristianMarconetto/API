const express = require("express");
const fs = require("fs");
const path = require("path");
const { Server } = require("ws");
const csv = require("csv-parser");

const app = express();
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/home.html"));
});

const server = app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
}).listen(3000, () => console.log("Listening on http://localhost:3000"));

const wsServer = new Server({ server });
const dataPath = "data.csv";


async function readCsv(path) {
  return new Promise((resolve, reject) => {
    const jsonArray = [];
    const filteredData = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        if (Object.keys(row).length !== 0) {
          jsonArray.push(row);
        }
      })
      .on("end", () => {
        console.log("Data retrieved correctly");

        const groupedData = {};
        jsonArray.forEach((row) => {
          if (!groupedData[row.Time] || groupedData[row.Time] < parseInt(row.o3)) {
            groupedData[row.Time] = parseInt(row.o3);
          }
        });

        Object.keys(groupedData).forEach((time) => {
          filteredData.push({ Time: time, o3: groupedData[time] });
        });

        resolve(filteredData);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function convertPpbToNgPerM3(ppb) {
  return ppb * 2;
}

function calcolaSuperamenti(arrayDati) {
  const datiMoltiplicati = arrayDati.map((dato) => ({
    Time: dato.Time,
    o3: parseInt(dato.o3) * 2,
  }));

  const soglieSuperamento = [120, 180, 240];
  const superamenti = new Map();

  datiMoltiplicati.forEach((dato) => {
    soglieSuperamento.forEach((soglia) => {
      if (dato.o3 > soglia) {
        if (!superamenti.has(soglia)) {
          superamenti.set(soglia, []);
        }
        superamenti.get(soglia).push(dato.Time);
      }
    });
  });

  const risultati = {};
  superamenti.forEach((tempi, soglia) => {
    risultati[`${soglia} superamenti`] = tempi;
  });

  return risultati;
}

function calcolaMediaO3Su8Ore(data) {
  let media = []
  let intervalli = []
  let superamenti = 0

  for (let i = 0; i <= data.length - 8; i++) {
    const intervallo = data.slice(i, i + 8);
    const somma = intervallo.reduce((acc, curr) => acc + curr.o3, 0);
    const media = somma / 8;
    if (media>120){
      intervalli.push(intervallo)
      media.push(media)
      superamenti++
    }
    
  }
  if (superamenti <= 0){
    return { superamenti:"Non ci sono superamenti",intervalli:"Dati indisponibile" ,media:"Dati indisponibile" };
  }
  return { superamenti:superamenti,intervalli:intervalli ,media: media };
}

(async () => {
  try {
    const data = await readCsv(dataPath);
    const exceedances120 = calcolaSuperamenti(data);
    const exceedances180 = calcolaSuperamenti(data);
    const exceedances240 = calcolaSuperamenti(data);
    
    const mediaPiuAlta = calcolaMediaO3Su8Ore(data);

    wsServer.on("connection", (ws) => {
      console.log("New client connected!");

      ws.send(JSON.stringify({
        measurements: data,
        exceedances120: exceedances120,
        exceedances180: exceedances180,
        exceedances240: exceedances240,
        highest8HourAverage: mediaPiuAlta
      }));

      ws.on("close", () => console.log("Client has disconnected!"));
    });
  } catch (error) {
    console.error("Error retrieving data from CSV:", error);
  }
})();
