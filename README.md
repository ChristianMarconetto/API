Analisi dei dati sull'ozono (feat. chatGPT)
Questo programma è progettato per analizzare i dati sull'ozono da un file CSV e fornire alcune statistiche rilevanti.

Dipendenze
Il programma richiede l'installazione delle seguenti dipendenze:

express: Utilizzato per creare un server Express per eseguire il programma.
csv-parser: Utilizzato per analizzare il file CSV e convertirlo in oggetti JavaScript.
Installare le dipendenze eseguendo il comando:

Copy code
npm install express csv-parser
Utilizzo
Assicurarsi che il file CSV sia disponibile nel percorso specificato nel codice (data.csv per impostazione predefinita).
Eseguire il programma con il comando:
Copy code
node nome_del_programma.js
Descrizione del Programma
Il programma svolge le seguenti azioni:

Connessione al Server: Avvia un server Express sulla porta 3000.
Lettura del File CSV: Legge il file CSV specificato e lo analizza per estrarre i dati sull'ozono.
Obiettivo 1: Ciclo di 8 Ore con Media più Alta: Trova il ciclo di 8 ore con la media più alta di ozono.
Obiettivo 2: Media Oraria più Alta del Giorno e Altri Dettagli:
Calcola la media oraria più alta del giorno e altri dettagli, come il numero di superamenti giornalieri e i livelli minimo e massimo di ozono durante il giorno.
Registra gli superamenti orari di 60 µg/m³ con i dettagli dell'orario e del valore.
Personalizzazione
Il programma può essere personalizzato modificando le seguenti variabili:

path: Il percorso del file CSV da analizzare. Modificare questa variabile per adattarla al percorso del proprio file CSV.
Contributi
Per segnalare bug, problemi o per proporre miglioramenti, si prega di aprire un ticket su GitHub nell'apposita sezione.

Licenza
Questo programma è distribuito con la licenza MIT. Consultare il file LICENSE per ulteriori informazioni sulla licenza.
