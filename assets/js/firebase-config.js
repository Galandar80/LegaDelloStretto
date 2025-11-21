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

// Inizializzazione Firebase
let app;
let database;

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    database = firebase.database();
} else {
    console.error("Firebase SDK non caricato!");
}
