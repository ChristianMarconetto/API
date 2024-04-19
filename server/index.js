const express = require("express");
const server = express();

server.listen(3000, () => {
  //console.log("Server connesso su http://localhost:3000");
});

const path = "data.csv";
function fromCsvToJsonSync(path) {
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
        //console.log("Obiettivo 1 - Ciclo di 8 ore con la media più alta di ozono:");
        //console.log(highestAverageCycle);
    
        // Obiettivo 2: Calcola la media oraria più alta del giorno e altri dettagli
        let hourlyAverages = Array(24).fill(0);
        let hourExceedancesDetails = [];
        let minOzoneLevel = Number.MAX_SAFE_INTEGER;
        let maxOzoneLevel = 0;

        for (let i = 0; i < jsonArray.length; i++) {
          var dataString = jsonArray[i].data;
          var giorno = parseInt(dataString.substring(0, 2));
          var mese = parseInt(dataString.substring(3, 5)) - 1;
          var anno = parseInt(dataString.substring(6, 10));
          var ora = parseInt(dataString.substring(11, 13));
          var minuto = parseInt(dataString.substring(14, 16));
          var secondo = parseInt(dataString.substring(17, 19));
      
          var data = new Date(anno, mese, giorno, ora, minuto, secondo);
          const hour = data.getHours();
      
          hourlyAverages[hour] += parseInt(jsonArray[i].ozono) / 2; // Dividi per 2 per mantenere l'ozono nella stessa unità di misura
      
          if (parseInt(jsonArray[i].ozono) > maxOzoneLevel) {
              maxOzoneLevel = parseInt(jsonArray[i].ozono) / 2; // Dividi per 2 per mantenere l'ozono nella stessa unità di misura
          }
          if (parseInt(jsonArray[i].ozono) < minOzoneLevel) {
              minOzoneLevel = parseInt(jsonArray[i].ozono) / 2; // Dividi per 2 per mantenere l'ozono nella stessa unità di misura
          }
          if (parseInt(jsonArray[i].ozono) > 60 /* superamenti 120 µg/m3 */) {
              hourExceedancesDetails.push({
                  data: jsonArray[i].data,
                  ozoneValue: parseInt(jsonArray[i].ozono) / 2 // Dividi per 2 per mantenere l'ozono nella stessa unità di misura
              });
          }
      }
      
      
        let highestHourlyAverage = 0;
        let highestHour = 0;
        for (let hour = 0; hour < hourlyAverages.length; hour++) {
          let average = hourlyAverages[hour];
          let count = 0;
          for (let i = 0; i < jsonArray.length; i++) {
              const dataPoint = jsonArray[i];
              const data = new Date(dataPoint.data);
              if (data.getHours() === hour) {
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
    
        console.log("Obiettivo 2 - Media oraria più alta del giorno:", highestHourlyAverage, "all'ora", highestHour);
        console.log("Numero di superamenti giornalieri:", hourExceedancesDetails.length);
        console.log(hourExceedancesDetails);
        console.log("Livello minimo di ozono durante il giorno:", minOzoneLevel, "µg/m3");
        console.log("Livello massimo di ozono durante il giorno:", maxOzoneLevel, "µg/m3");
      });
    // Funzione per calcolare la media dei livelli di ozono
    
  } catch (error) {
    //console.error("Errore durante l'elaborazione:", error);
  }
}

// Eseguire la funzione sincrona
fromCsvToJsonSync(path);