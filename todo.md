-[data extrapolation]
    funzione che prenda il csv e lo trascriva in un json indicizzato

-[data manipulation] 
    trovare fascia oraria di 8h con media maggiore
    funzione che calcoli media di o3 in una fascia oraria di 8h
    funzione che iteri tutto il dataset in gruppi di 8 ore a scalare di un h alla volta
    e restituisca la fascia oraria con il livello di o3 in media maggiore
    
    
    funzione che restituisca il numero di volte che l'ozono si è alzato sopra il livello massimo in un giorno
    
----------
create table misurazioni ( id int PRIMARY KEY AUTO_INCREMENT, time Date, ozono int );