// Firebase configuration handled in firebase-config.js
// database is already initialized in firebase-config.js






// Inizializzazione all'avvio
function init() {


    // Altri inizializzazioni se necessario
    loadUpcomingTournaments();
}

// Carica tornei imminenti da Firebase (se disponibili)
function loadUpcomingTournaments() {
    const container = document.getElementById('nextTournaments');
    if (!container) return;

    // Mostra un indicatore di caricamento
    container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Caricamento tornei in corso...</div>';

    // Controlla se Firebase è disponibile
    if (!database) {
        console.error("Database Firebase non disponibile");
        // Fallback ai dati statici già presenti nell'HTML
        container.innerHTML = '';

        // Ricrea le card statiche degli eventi
        const torneiStatici = [
            {
                data: "22 Dicembre 2023",
                nome: "Torneo Regionale Messina",
                luogo: "Games Academy Messina",
                formato: "Swiss + Top 8",
                quota: "€20",
                premi: "Montepremi €800 e premi esclusivi"
            },
            {
                data: "15 Gennaio 2024",
                nome: "Qualificazioni Reggio Calabria",
                luogo: "Game Time, Reggio Calabria",
                formato: "Swiss + Top 4",
                quota: "€15",
                premi: "Qualificazione al Championship regionale per i primi 4 classificati"
            },
            {
                data: "5 Febbraio 2024",
                nome: "Championship Messina",
                luogo: "Centro Commerciale Messina",
                formato: "Swiss + Top 8",
                quota: "€25",
                premi: "Montepremi €1500 e ospiti speciali"
            }
        ];

        torneiStatici.forEach(torneo => {
            const tournamentCard = document.createElement('div');
            tournamentCard.className = 'tournament-card';
            tournamentCard.innerHTML = `
                <div class="tournament-date">
                    <i class="far fa-calendar"></i> ${torneo.data}
                </div>
                <h4 class="tournament-title">${torneo.nome}</h4>
                <div class="tournament-location">
                    <i class="fas fa-map-marker-alt"></i> ${torneo.luogo}
                </div>
                <div class="tournament-details">
                    <p><strong>Formato:</strong> ${torneo.formato}</p>
                    <p><strong>Iscrizione:</strong> ${torneo.quota}</p>
                    <p><strong>Premi:</strong> ${torneo.premi}</p>
                </div>
                <div class="tournament-action">
                    <a href="eventi.html" class="btn btn-primary">Dettagli e Iscrizione</a>
                </div>
            `;
            container.appendChild(tournamentCard);
        });

        return;
    }

    // Se Firebase è disponibile, carica i dati
    database.ref('eventi').once('value')
        .then(snapshot => {
            const eventi = snapshot.val() || {};
            const eventiArray = Object.entries(eventi);

            // Se non ci sono eventi, mostra un messaggio
            if (eventiArray.length === 0) {
                container.innerHTML = `
                    <div class="no-data">
                        <i class="fas fa-calendar-times"></i>
                        <p>Nessun torneo programmato</p>
                    </div>`;
                return;
            }

            // Filtra solo gli eventi futuri
            const oggi = new Date();
            oggi.setHours(0, 0, 0, 0); // Reset dell'ora per confrontare solo le date

            const eventiFuturi = eventiArray
                .filter(([_, evento]) => {
                    if (!evento.data) return false;

                    try {
                        const dataEvento = new Date(evento.data);
                        return dataEvento >= oggi;
                    } catch (e) {
                        console.error("Errore nel parsing della data:", e);
                        return false;
                    }
                })
                .sort((a, b) => new Date(a[1].data) - new Date(b[1].data)); // Ordina per data

            // Se non ci sono eventi futuri, mostra un messaggio
            if (eventiFuturi.length === 0) {
                container.innerHTML = `
                    <div class="no-data">
                        <i class="fas fa-calendar-times"></i>
                        <p>Nessun torneo futuro programmato</p>
                    </div>`;
                return;
            }

            // Crea le card per ogni evento futuro
            container.innerHTML = '';
            eventiFuturi.slice(0, 3).forEach(([eventoId, evento]) => {
                const dataEvento = new Date(evento.data);
                const formattedData = dataEvento.toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                // Crea una card per ogni evento
                const tournamentCard = document.createElement('div');
                tournamentCard.className = 'tournament-card';
                tournamentCard.innerHTML = `
                    <div class="tournament-date">
                        <i class="far fa-calendar"></i> ${formattedData}
                    </div>
                    <h4 class="tournament-title">${evento.nome}</h4>
                    <div class="tournament-location">
                        <i class="fas fa-map-marker-alt"></i> ${evento.luogo || 'Luogo da definire'}
                    </div>
                    <div class="tournament-details">
                        <p><strong>Formato:</strong> ${evento.formato || 'Swiss + Top 8'}</p>
                        <p><strong>Iscrizione:</strong> ${evento.quota || '€15'}</p>
                        <p><strong>Premi:</strong> ${evento.premi || 'Carte promo esclusive, tappetini di gioco ufficiali'}</p>
                    </div>
                    <div class="tournament-action">
                        <a href="eventi.html" class="btn btn-primary">Dettagli e Iscrizione</a>
                    </div>
                `;

                container.appendChild(tournamentCard);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento degli eventi:", error);
            // In caso di errore, mostra i dati statici
            container.innerHTML = '';

            // Ricrea le card statiche degli eventi
            const torneiStatici = [
                {
                    data: "22 Dicembre 2023",
                    nome: "Torneo Regionale Messina",
                    luogo: "Games Academy Messina",
                    formato: "Swiss + Top 8",
                    quota: "€20",
                    premi: "Montepremi €800 e premi esclusivi"
                },
                {
                    data: "15 Gennaio 2024",
                    nome: "Qualificazioni Reggio Calabria",
                    luogo: "Game Time, Reggio Calabria",
                    formato: "Swiss + Top 4",
                    quota: "€15",
                    premi: "Qualificazione al Championship regionale per i primi 4 classificati"
                },
                {
                    data: "5 Febbraio 2024",
                    nome: "Championship Messina",
                    luogo: "Centro Commerciale Messina",
                    formato: "Swiss + Top 8",
                    quota: "€25",
                    premi: "Montepremi €1500 e ospiti speciali"
                }
            ];

            torneiStatici.forEach(torneo => {
                const tournamentCard = document.createElement('div');
                tournamentCard.className = 'tournament-card';
                tournamentCard.innerHTML = `
                    <div class="tournament-date">
                        <i class="far fa-calendar"></i> ${torneo.data}
                    </div>
                    <h4 class="tournament-title">${torneo.nome}</h4>
                    <div class="tournament-location">
                        <i class="fas fa-map-marker-alt"></i> ${torneo.luogo}
                    </div>
                    <div class="tournament-details">
                        <p><strong>Formato:</strong> ${torneo.formato}</p>
                        <p><strong>Iscrizione:</strong> ${torneo.quota}</p>
                        <p><strong>Premi:</strong> ${torneo.premi}</p>
                    </div>
                    <div class="tournament-action">
                        <a href="eventi.html" class="btn btn-primary">Dettagli e Iscrizione</a>
                    </div>
                `;
                container.appendChild(tournamentCard);
            });
        });
}

// Inizializza la pagina quando il DOM è caricato
document.addEventListener('DOMContentLoaded', init);
