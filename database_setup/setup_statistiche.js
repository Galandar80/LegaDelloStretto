// Script per aggiungere i dati delle statistiche al database Firebase
// Eseguire questo script per inizializzare o aggiornare le statistiche

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBMMyrXGTm7-6jzRK2xQdp98EcJ6zxVgYI",
    authDomain: "lega-dello-stretto.firebaseapp.com",
    databaseURL: "https://lega-dello-stretto-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lega-dello-stretto",
    storageBucket: "lega-dello-stretto.firebasestorage.app",
    messagingSenderId: "340615332224",
    appId: "1:340615332224:web:6ae9b0c7ca1ac1b1068165"
};

// Inizializzazione Firebase (esempio con Node.js)
// Richiede: npm install firebase
const firebase = require('firebase/app');
require('firebase/database');

// Inizializza Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// Dati statistiche reali
const statistiche = {
    giocatori: 120,  // Numero di giocatori registrati
    tornei: 25,      // Numero di tornei organizzati
    citta: 3,        // Numero di città coinvolte
};

// Aggiorna o crea le statistiche nel database
database.ref('statistiche').set(statistiche)
    .then(() => {
        console.log('Statistiche aggiornate con successo nel database!');
        // Chiudi la connessione al database
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    })
    .catch((error) => {
        console.error('Errore durante l\'aggiornamento delle statistiche:', error);
        process.exit(1);
    }); 