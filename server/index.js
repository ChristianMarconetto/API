const express = require("express");
const server = express();
const path = "data.csv";
server.listen(3000,()=>{
  console.log("server connesso su http://localhost:3000");
})<
async function fromCsvToJson(path){
    var csv = require("csvtojson");
    csv()
    .fromFile(path)
    .then(function(jsonArrayObj){ 
        console.log(jsonArrayObj);
        // ---



        // ---
    })
    csv()
    .subscribe(function(jsonObj){ 
        return new Promise(function(resolve,reject){
            asyncStoreToDb(json,function(){resolve()})
        })
    }) 
    const jsonArray=await csv().fromFile(path);
}
fromCsvToJson(path)
  /*obb 1 
quale ciclo di 8 ore (su tutti i cicli da 8 che ci sono in 24 ore) 
ha la media più alta di livello di o3
obb 2 
media oraria più alta del giorno
dettagli aggiuntivi:  numero di superamenti giornalieri,
 liv min,liv max,livello inferiore/maggiore di una certa 
 soglia scelta,o rispetto i livelli standard  */