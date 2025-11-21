// Script specifico per la pagina premi
document.addEventListener('DOMContentLoaded', function () {
    // Carica la classifica punti
    loadPuntiTotaliConPosizione();
});

// Funzione per caricare i punti totali con posizione
function loadPuntiTotaliConPosizione() {
    if (typeof database === 'undefined') {
        console.error("Firebase database non inizializzato.");
        return;
    }

    database.ref('tornei').once('value')
        .then(snapshot => {
            const tornei = snapshot.val() || {};
            const giocatoriPunti = {};

            // Calcola i punti totali per ogni giocatore
            Object.values(tornei).forEach(torneo => {
                const giocatori = torneo.giocatori || {};
                Object.keys(giocatori).forEach(giocatoreId => {
                    const giocatore = giocatori[giocatoreId];
                    if (!giocatoriPunti[giocatoreId]) {
                        giocatoriPunti[giocatoreId] = {
                            nome: giocatore.nome,
                            punti: 0
                        };
                    }
                    giocatoriPunti[giocatoreId].punti += giocatore.punti || 0;
                });
            });

            // Converti in array e ordina
            const giocatoriArray = Object.keys(giocatoriPunti).map(id => {
                return {
                    id: id,
                    nome: giocatoriPunti[id].nome,
                    punti: giocatoriPunti[id].punti
                };
            });

            giocatoriArray.sort((a, b) => b.punti - a.punti);

            // Aggiorna la tabella
            const tbody = document.getElementById('puntiTotaliBody');

            if (!tbody) return;

            if (giocatoriArray.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3" class="no-data">Nessun dato disponibile</td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = '';
            giocatoriArray.forEach((giocatore, index) => {
                const row = document.createElement('tr');

                // Aggiungi classe speciale per i primi 3 posti
                if (index < 3) {
                    row.classList.add(`position-${index + 1}`);
                }

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td class="player-name" onclick="showUserProfile('${giocatore.id}', '${giocatore.nome}')">${giocatore.nome}</td>
                    <td>${giocatore.punti}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento dei punti totali:", error);
            const tbody = document.getElementById('puntiTotaliBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3" class="error">Errore nel caricamento dei dati</td>
                    </tr>
                `;
            }
        });
}

// Funzione placeholder per showUserProfile se non definita altrove (o in utils.js)
// Se è definita in utils.js o altrove, questa potrebbe non servire o essere ridondante.
// Controllo se esiste già.
if (typeof showUserProfile !== 'function') {
    window.showUserProfile = function (id, nome) {
        console.log("Visualizza profilo per:", nome, id);
        // Implementazione base o redirect se necessario
        // Potrebbe aprire il modale definito in frontend.html se presente, ma qui siamo su premi.html
        // premi.html non sembra avere il modale userProfileModal.
    };
}
