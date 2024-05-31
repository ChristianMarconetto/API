@echo off
REM Naviga alla directory in cui è stato avviato lo script .bat
cd /d "%~dp0"

REM Spostati nella cartella "server"
cd server

REM Installa i pacchetti con npm
npm install

REM Avvia il server con node index.js
start cmd /k "node index.js"

REM Attendi 5 secondi per permettere al server di avviarsi (puoi regolare il tempo se necessario)
timeout /t 5 /nobreak

REM Apri il browser e visita localhost:3000
start "" "http://localhost:3000"
