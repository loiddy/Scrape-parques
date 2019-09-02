# Scrape-parques

Una mini app para sacar información sobre los parques de Madrid del Portal web del ayuntamiento de Madrid usando la técnica de **web scraping**.

Se ha hecho con node.js y la librería puppeteer. Puppeteer proporciona una API de alto nivel para controlar Chrome o Chromium en headless mode a través del protocolo DevTools. También se puede usar para hacer testing y como servicio (Checkly), pero aquí solo se ha usado para hacer web scraping. Este video explica puppeteer de manera sencilla y directa: https://youtu.be/lhZOFUY1weo .

## Instalación

Para instalar esta mini app, ejecute los siguientes comandos en una terminal

    git clone XXXXXXXXXXXXX
    cd Scrape-parques
    npm install

Esto te instalará la app y la libreria puppeteer.

## ¿Como se usa?

Después de la instalación, puede comenzar la demostración con

    node main.js

Se abrirá la sección de parques de el Portal web del Ayuntamiento de Madrid en Chrome o Chromium y irás viendo el resultado del web scraping en tu terminal.
