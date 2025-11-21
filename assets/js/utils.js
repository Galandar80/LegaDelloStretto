// Funzione per caricare il footer
document.addEventListener('DOMContentLoaded', function () {
    // Seleziona tutti gli elementi con classe include-footer
    const footerElements = document.querySelectorAll('.include-footer');

    // Per ogni elemento trovato, inserisci il contenuto del footer direttamente
    if (footerElements.length > 0) {
        const footerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="assets/img/onepiece-logo.webp" alt="Logo One Piece" class="footer-logo-img">
                    <p>La community di Messina più grande del Sud Italia</p>
                </div>
                <div class="footer-links">
                    <h4>Links Utili</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="tornei.html">Tornei</a></li>
                        <li><a href="classifica.html">Classifiche</a></li>
                        <li><a href="eventi.html">Eventi</a></li>
                        <li><a href="regolamento.html">Regolamento</a></li>
                        <li><a href="partners.html">Partner</a></li>
                        <li><a href="deck-viewer.html">Invia il tuo Deck</a></li>
                        <li><a href="contatti.html">Contatti</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Social</h4>
                    <ul>
                        <li><a href="https://www.instagram.com/redshift_gaming/" target="_blank">Instagram</a></li>
                        <li><a href="https://www.facebook.com/RedShiftGaming" target="_blank">Facebook</a></li>
                    </ul>
                </div>
                <div class="footer-newsletter">
                    <h4>Resta Aggiornato</h4>
                    <p>Iscriviti alla nostra newsletter per ricevere aggiornamenti sui prossimi eventi e le ultime novità.</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="La tua email" required>
                        <button type="submit" class="btn btn-primary">Iscriviti</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2023 Lega dello Stretto. Tutti i diritti riservati.</p>
            </div>
        </div>`;

        footerElements.forEach(function (element) {
            element.innerHTML = footerHTML;
        });
    }

    // Mobile menu logic
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('mainNav');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Theme toggle logic
    const themeToggleBtn = document.getElementById('themeToggle');

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('darkTheme', 'true');
            } else {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('darkTheme', 'false');
            }
        });
    }
});