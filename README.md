### Server

Il server è responsabile per l'elaborazione e la gestione dei dati di monitoraggio delle arnie per le api. Il progetto prevede la creazione di un algoritmo di gestione automatica di tali dati, che sono raccolti attraverso un file CSV contenente informazioni sull'ozono nell'ambiente circostante.

#### Struttura del Server

Il server è implementato utilizzando Express.js, un framework web per Node.js. La sua struttura è divisa nelle seguenti parti:

1. **Connessione al Server**: Il server si connette alla porta 3000 utilizzando il metodo `listen()` di Express.

2. **Lettura del File CSV**: Il server legge il file CSV specificato per estrarre i dati sull'ozono. Questo viene fatto utilizzando `fs.createReadStream()` e `csv-parser`, che analizza il file e lo converte in oggetti JavaScript.

3. **Obiettivo 1: Ciclo di 8 Ore con Media più Alta**: Il server calcola il ciclo di 8 ore con la media più alta di ozono. Questo viene fatto attraverso un algoritmo che itera sui dati per trovare il ciclo desiderato.

4. **Obiettivo 2: Media Oraria più Alta del Giorno e Altri Dettagli**: Il server calcola la media oraria più alta del giorno e altri dettagli correlati all'ozono. Viene calcolato il numero di superamenti giornalieri, così come i livelli minimo e massimo di ozono durante il giorno.

Il server esegue queste operazioni in modo sincrono utilizzando una funzione principale chiamata `fromCsvToJsonSync()`. Le funzioni ausiliarie vengono utilizzate per calcolare le medie e per estrarre le informazioni di interesse dai dati.

### Client

(Il client è lasciato incompleto)
