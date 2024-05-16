const express = require("express");
const fs = require("fs");
const path = require("path");
const { Server } = require("ws");
const csv = require("csv-parser");
const { DateTime } = require("luxon");
const mysql = require("mysql");

const app = express();
app.get("/home",(req,res) =>{
  res.sendFile(path.join(__dirname, "../client/home.html"))
})
const server = app.get("/",(req,res) =>{
  res.sendFile(path.join(__dirname, "../client/index.html"))
}).listen(3000, () => console.log("Listening on http://localhost:3000"));
const wsServer = new Server({ server });
const dataPath = "data.csv";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "api",
});

con.connect();

async function readCsv(path) {
  return new Promise((resolve, reject) => {
    const jsonArray = [];
    const filteredData = []; // Array per memorizzare i dati filtrati
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        if (Object.keys(row).length !== 0) {
          jsonArray.push(row);
        }
      })
      .on("end", () => {
        console.log("Data retrieved correctly");
        
        // Filtraggio dei dati in base alla condizione specificata
        const groupedData = {};
        jsonArray.forEach((row) => {
          if (!groupedData[row.Time] || groupedData[row.Time] < parseInt(row.o3)) {
            groupedData[row.Time] = parseInt(row.o3);
          }
        });

        // Costruzione dell'array di dati filtrati
        Object.keys(groupedData).forEach((time) => {
          filteredData.push({ Time: time, o3: groupedData[time] });
        });

        resolve(filteredData); // Risolvi con i dati filtrati
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
  // Moltiplica i livelli di o3 per 2
  const datiMoltiplicati = arrayDati.map((dato) => ({
    Time: dato.Time,
    o3: parseInt(dato.o3) * 2,
  }));

  // Conta i superamenti per i valori specificati (120, 180, 240)
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

  // Restituisci i risultati
  const risultati = {};
  superamenti.forEach((tempi, soglia) => {
    risultati[`${soglia} superamenti`] = tempi;
  });

  return risultati;
}

(async () => {
  try {
    const data = await readCsv(dataPath);
    console.log(data)
    const exceedances120 = calcolaSuperamenti(data);
    const exceedances180 = calcolaSuperamenti(data);
    const exceedances240 = calcolaSuperamenti(data);

    wsServer.on("connection", (ws) => {
      console.log("New client connected!");

      ws.send(JSON.stringify({
        measurements: data,
        exceedances120: exceedances120,
        exceedances180: exceedances180,
        exceedances240: exceedances240
      }));

      ws.on("close", () => console.log("Client has disconnected!"));
    });
  } catch (error) {
    console.error("Error retrieving data from CSV:", error);
  }
})();
