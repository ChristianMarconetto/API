const express = require("express");
const server = express();

server.listen(3000, () => {
  console.log("Server connesso su http://localhost:3000");
});

const path = "data.csv";

function main(path) {
  let jsonArray = [];
  try {
    const csv = require('csv-parser');
    const fs = require('fs');
    
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => {
        if (Object.keys(row).length != 0){
          jsonArray.push(row);
        }
      })
      .on('end', () => {
        console.log("Data getted correctly");
        calculateMetrics(jsonArray);
      });

  } catch (error) {
    console.error("Errore durante l'elaborazione:", error);
  }
}

function calculateMetrics(data) {
  let highestAverageCycle = findHighestAverageCycle(data);
  let { highestHourlyAverage, hourExceedancesDetails, minOzoneLevel, maxOzoneLevel } = calculateHourlyMetrics(data);
  let { cycleExceedancesDetails } = calculateCycleExceedances(data);

  console.log("Obiettivo 1 - Ciclo di 8 ore con la media più alta di ozono:");
  console.log(highestAverageCycle);
  console.log("Obiettivo 2 - Media oraria più alta del giorno:", highestHourlyAverage);
  console.log("Numero di superamenti giornalieri:", hourExceedancesDetails.length);
  console.log(hourExceedancesDetails);
  console.log("Livello minimo di ozono durante il giorno:", minOzoneLevel, "µg/m3");
  console.log("Livello massimo di ozono durante il giorno:", maxOzoneLevel, "µg/m3");
  console.log("Superamenti ciclici di 240 µg/m3 ogni 8 ore:");
  console.log(cycleExceedancesDetails);
}

function findHighestAverageCycle(data) {
  let highestAverage = 0;
  let highestAverageCycle = [];

  for (let i = 0; i <= data.length - 8; i++) {
    const cycleData = data.slice(i, i + 8);
    const average = calculateOzoneAverage(cycleData);
    
    if (average > highestAverage) {
      highestAverage = average;
      highestAverageCycle = cycleData;
    }
  }

  return highestAverageCycle;
}

function calculateOzoneAverage(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += parseInt(data[i].ozono);
  }
  return (sum / data.length) * 2;
}

function calculateHourlyMetrics(data) {
  let hourlyAverages = Array(24).fill(0);
  let hourExceedancesDetails = [];
  let minOzoneLevel = Number.MAX_SAFE_INTEGER;
  let maxOzoneLevel = 0;

  for (let i = 0; i < data.length; i++) {
    var dataString = data[i].data;
    var giorno = parseInt(dataString.substring(0, 2));
    var mese = parseInt(dataString.substring(3, 5)) - 1;
    var anno = parseInt(dataString.substring(6, 10));
    var ora = parseInt(dataString.substring(11, 13));
    var minuto = parseInt(dataString.substring(14, 16));
    var secondo = parseInt(dataString.substring(17, 19));

    var dataObj = new Date(anno, mese, giorno, ora, minuto, secondo);
    const hour = dataObj.getHours();

    hourlyAverages[hour] += parseInt(data[i].ozono) * 2;

    if (parseInt(data[i].ozono) > maxOzoneLevel) {
        maxOzoneLevel = parseInt(data[i].ozono) * 2;
    }
    if (parseInt(data[i].ozono) < minOzoneLevel) {
        minOzoneLevel = parseInt(data[i].ozono) * 2;
    }
    if (parseInt(data[i].ozono) > 60 /* superamenti 120 µg/m3 */) {
        hourExceedancesDetails.push({
            data: data[i].data,
            ozoneValue: parseInt(data[i].ozono) * 2
        });
    }
  }

  let highestHourlyAverage = 0;
  let highestHour = 0;
  for (let hour = 0; hour < hourlyAverages.length; hour++) {
    let average = hourlyAverages[hour];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        const dataPoint = data[i];
        const dataObj = new Date(dataPoint.data);
        if (dataObj.getHours() === hour) {
            count++;
        }
    }

    if (count !== 0) {
        average /= count;
        hourlyAverages[hour] = average;
        if (average > highestHourlyAverage) {
            highestHourlyAverage = average;
            highestHour = hour;
        }
    }
  }

  return { highestHourlyAverage, hourExceedancesDetails, minOzoneLevel, maxOzoneLevel };
}

function calculateCycleExceedances(data) {
  let cycleExceedancesDetails = [];

  for (let i = 0; i <= data.length - 24; i++) {
    const cycleData = data.slice(i, i + 24);
    const exceedances = cycleData.filter(point => parseInt(point.ozono) > 120).length;
    const cycleStartTime = cycleData[0].data;

    if (exceedances >= 8) {
      cycleExceedancesDetails.push({
        startTime: cycleStartTime,
        exceedancesCount: exceedances
      });
    }
  }

  return { cycleExceedancesDetails };
}
console.log(main(path))