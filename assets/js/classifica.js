// Firebase configuration handled in firebase-config.js
// database is already initialized in firebase-config.js
let torneiData = {};

// Toggle tema chiaro/scuro


// Toggle menu mobile


// Funzione per aggiornare la Classifica Torneo
function updateClassificaTorneo() {
    const torneoId = document.getElementById('selectTorneo').value;
    const tableBody = document.getElementById('classificaTorneoBody');
    const linksContainer = document.getElementById('torneoLinks');
    tableBody.innerHTML = '';
    linksContainer.innerHTML = '';

    if (torneoId && torneiData[torneoId]) {
        const torneo = torneiData[torneoId];

        // Aggiungi il link al bracket Challonge se disponibile
        if (torneo.linkChallonge) {
            linksContainer.innerHTML = `
                <a href="${torneo.linkChallonge}" target="_blank" class="challonge-link">
                    <i class="fas fa-trophy"></i> Visualizza Bracket Challonge
                </a>
            `;
        }

        const giocatori = Object.values(torneo.giocatori || {});
        giocatori.sort((a, b) => a.posizione - b.posizione)
            .forEach(giocatore => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${giocatore.posizione}°</td>
                    <td class="player-name" onclick="showUserProfile(null, '${giocatore.nome}')">${giocatore.nome}</td>
                    <td>${giocatore.punti}</td>
                `;
                tableBody.appendChild(row);
            });
    }
}

// Funzione per aggiornare lo Storico Giocatori
function updateStoricoGiocatori() {
    const container = document.getElementById('storicoBody');
    container.innerHTML = '';

    // Oggetto per memorizzare lo storico partecipazioni
    const giocatoriStorico = {};

    // Scorro tutti i tornei e raccolgo le posizioni
    Object.values(torneiData).forEach(torneo => {
        // Converti i giocatori in array e ordinali per posizione
        const giocatoriArray = Object.values(torneo.giocatori || {});
        giocatoriArray.sort((a, b) => a.posizione - b.posizione);

        // Assegna posizione corretta a ciascun giocatore
        giocatoriArray.forEach((giocatore, index) => {
            const nome = giocatore.nome;
            const posizione = parseInt(giocatore.posizione) || (index + 1);

            // Inizializza l'array delle partecipazioni se è la prima volta
            if (!giocatoriStorico[nome]) {
                giocatoriStorico[nome] = [];
            }

            // Aggiungi questo torneo allo storico del giocatore
            giocatoriStorico[nome].push({
                torneo: torneo.nome,
                posizione: posizione
            });
        });
    });

    // Crea una riga per ogni giocatore
    Object.entries(giocatoriStorico).forEach(([nome, partecipazioni]) => {
        const row = document.createElement('tr');

        // Formatta le partecipazioni come solo posizioni
        const posizioni = partecipazioni.map(p => `${p.posizione}°`).join(' - ');

        row.innerHTML = `
            <td class="player-name" onclick="showUserProfile(null, '${nome}')">${nome}</td>
            <td>${posizioni}</td>
        `;

        container.appendChild(row);
    });
}

// Funzione per aggiornare i Punti Totali
function updatePuntiTotali() {
    const container = document.getElementById('puntiTotaliBody');
    container.innerHTML = '';

    // Oggetto per memorizzare i punti totali per ogni giocatore
    const giocatoriPunti = {};

    // Raccolgo tutti i dati dai tornei
    Object.values(torneiData).forEach(torneo => {
        // Raccolgo tutti i giocatori di questo torneo
        Object.values(torneo.giocatori || {}).forEach(giocatore => {
            const nome = giocatore.nome;
            const punti = parseInt(giocatore.punti) || 0;

            // Se è la prima volta che vedo questo giocatore, inizializzo il contatore
            if (!giocatoriPunti[nome]) {
                giocatoriPunti[nome] = 0;
            }

            // Aggiungo i punti di questo torneo
            giocatoriPunti[nome] += punti;
        });
    });

    // Creo una riga per ogni giocatore, ordinati per punti totali
    Object.entries(giocatoriPunti)
        .sort((a, b) => b[1] - a[1]) // Ordino per punti totali (dal più alto al più basso)
        .forEach(([nome, punti]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="player-name" onclick="showUserProfile(null, '${nome}')">${nome}</td>
                <td>${punti}</td>
            `;
            container.appendChild(row);
        });
}

// Funzione per mostrare il profilo utente
function showUserProfile(giocatoreId, giocatoreNome) {
    // Imposta il nome del giocatore nel modal
    document.getElementById('modalPlayerName').textContent = giocatoreNome;

    // Carica i dati del giocatore
    database.ref('tornei').once('value')
        .then(snapshot => {
            const tornei = snapshot.val() || {};
            const storicoTornei = [];
            let puntiTotali = 0;
            let migliorPosizione = Infinity;

            // Raccogli i dati del giocatore da tutti i tornei
            Object.keys(tornei).forEach(torneoId => {
                const torneo = tornei[torneoId];
                const giocatori = torneo.giocatori || {};

                // Trova il giocatore per NOME invece che per ID
                const giocatoriArray = Object.values(giocatori);
                const matchingGiocatori = giocatoriArray.filter(g => g.nome === giocatoreNome);

                matchingGiocatori.forEach(giocatore => {
                    const punti = giocatore.punti || 0;
                    puntiTotali += punti;

                    // Calcola la posizione del giocatore in questo torneo
                    const posizione = giocatore.posizione || 0;

                    if (posizione > 0 && posizione < migliorPosizione) {
                        migliorPosizione = posizione;
                    }

                    storicoTornei.push({
                        torneoId: torneoId,
                        torneoNome: torneo.nome,
                        data: torneo.creatoIl || '',
                        posizione: posizione,
                        punti: punti,
                        partecipanti: giocatoriArray.length
                    });
                });
            });

            // Ordina lo storico per data (più recenti prima)
            storicoTornei.sort((a, b) => {
                return new Date(b.data) - new Date(a.data);
            });

            // Aggiorna le statistiche
            document.getElementById('statTornei').textContent = storicoTornei.length;
            document.getElementById('statPuntiTotali').textContent = puntiTotali;
            document.getElementById('statMediaPunti').textContent = storicoTornei.length > 0 ?
                Math.round(puntiTotali / storicoTornei.length) : 0;
            document.getElementById('statMigliorPosizione').textContent =
                migliorPosizione !== Infinity ? `${migliorPosizione}°` : '-';

            // Aggiorna la tabella dello storico tornei
            const tbody = document.getElementById('playerTournamentHistory');

            if (storicoTornei.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="no-data">Nessun torneo giocato</td></tr>`;
                return;
            }

            tbody.innerHTML = '';
            storicoTornei.forEach(torneo => {
                const row = document.createElement('tr');
                const data = torneo.data ? new Date(torneo.data).toLocaleDateString() : '-';

                row.innerHTML = `
                    <td>${torneo.torneoNome}</td>
                    <td>${data}</td>
                    <td>${torneo.posizione}°</td>
                    <td>${torneo.punti}</td>
                    <td>${torneo.partecipanti}</td>
                `;
                tbody.appendChild(row);
            });

            // Mostra il modal
            document.getElementById('userProfileModal').style.display = 'flex';
        })
        .catch(error => {
            console.error("Errore nel caricamento del profilo:", error);
            alert("Errore nel caricamento del profilo utente");
        });
}

// Funzione per chiudere il profilo utente
function closeUserProfile() {
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
// Make closeUserProfile globally available
window.closeUserProfile = closeUserProfile;
window.showUserProfile = showUserProfile;
window.updateClassificaTorneo = updateClassificaTorneo;

// Inizializzazione all'avvio
function init() {


    // Carica i dati dei tornei da Firebase
    database.ref('tornei').once('value')
        .then(snapshot => {
            torneiData = snapshot.val() || {};

            // Popola il dropdown dei tornei
            const select = document.getElementById('selectTorneo');
            select.innerHTML = '<option value="" disabled selected>Seleziona Torneo</option>';

            // Converti in array e ordina per data (più recenti prima)
            Object.entries(torneiData)
                .sort((a, b) => {
                    const dateA = a[1].creatoIl ? new Date(a[1].creatoIl) : new Date(0);
                    const dateB = b[1].creatoIl ? new Date(b[1].creatoIl) : new Date(0);
                    return dateB - dateA;
                })
                .forEach(([id, torneo]) => {
                    const option = document.createElement('option');
                    option.value = id;
                    option.textContent = torneo.nome;
                    select.appendChild(option);
                });

            // Seleziona il primo torneo di default (se esiste)
            if (select.options.length > 1) {
                select.selectedIndex = 1;
            }

            // Inizializza le tabelle con i dati
            updateClassificaTorneo();
            updateStoricoGiocatori();
            updatePuntiTotali();
        })
        .catch(error => {
            console.error("Errore nel caricamento dei dati:", error);
            document.querySelectorAll('.loading-cell').forEach(el => {
                el.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Errore nel caricamento dei dati</p>
                    </div>
                `;
            });
        });
}

// Inizializza la pagina quando il DOM è caricato
document.addEventListener('DOMContentLoaded', init);
