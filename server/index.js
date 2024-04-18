const express = require("express");
const server = express();
const path = "data.csv";
const csv = require('csvtojson');

server.listen(3000, () => {
  console.log("Server connesso su http://localhost:3000");
});

function fromCsvToJsonSync(path) {
  try {
    const jsonArray = csv().fromFile(path);

    // Funzione per calcolare la media dei livelli di ozono
    function calculateOzoneAverage(data) {
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += parseInt(data[i].ozono);
      }
      return sum / data.length;
    }

    // Obiettivo 1: Trova il ciclo di 8 ore con la media più alta di ozono
    let highestAverage = 0;
    let highestAverageCycle = [];
    for (let i = 0; i <= jsonArray.length - 8; i++) {
      const cycleData = jsonArray.slice(i, i + 8);
      const average = calculateOzoneAverage(cycleData);
      if (average > highestAverage) {
        highestAverage = average;
        highestAverageCycle = cycleData;
      }
    }
    console.log("Obiettivo 1 - Ciclo di 8 ore con la media più alta di ozono:");
    console.log(highestAverageCycle);

    // Obiettivo 2: Calcola la media oraria più alta del giorno e altri dettagli
    let hourlyAverages = Array(24).fill(0);
    let ozoneExceedances = 0;
    let minOzoneLevel = Number.MAX_SAFE_INTEGER;
    let maxOzoneLevel = 0;

    jsonArray.forEach(dataPoint => {
      const hour = new Date(dataPoint.data).getHours();
      hourlyAverages[hour] += parseInt(dataPoint.ozono);
      if (parseInt(dataPoint.ozono) > maxOzoneLevel) {
        maxOzoneLevel = parseInt(dataPoint.ozono);
      }
      if (parseInt(dataPoint.ozono) < minOzoneLevel) {
        minOzoneLevel = parseInt(dataPoint.ozono);
      }
      if (parseInt(dataPoint.ozono) > YOUR_THRESHOLD) {
        ozoneExceedances++;
      }
    });

    let highestHourlyAverage = 0;
    let highestHour = 0;
    hourlyAverages.forEach((average, hour) => {
      average /= jsonArray.filter(dataPoint => new Date(dataPoint.data).getHours() === hour).length;
      hourlyAverages[hour] = average;
      if (average > highestHourlyAverage) {
        highestHourlyAverage = average;
        highestHour = hour;
      }
    });

    console.log("Obiettivo 2 - Media oraria più alta del giorno:", highestHourlyAverage, "all'ora", highestHour);
    console.log("Numero di superamenti giornalieri:", ozoneExceedances);
    console.log("Livello minimo di ozono durante il giorno:", minOzoneLevel);
    console.log("Livello massimo di ozono durante il giorno:", maxOzoneLevel);
  } catch (error) {
    console.error("Errore durante l'elaborazione:", error);
  }
}

// Eseguire la funzione sincrona
fromCsvToJsonSync(path);