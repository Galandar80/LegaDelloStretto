// Firebase configuration handled in firebase-config.js
// database is already initialized in firebase-config.js



// Inizializzazione tema
document.addEventListener('DOMContentLoaded', () => {




    // Gestione FAQ
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Chiudi tutti gli altri elementi FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Attiva/disattiva l'elemento corrente
            item.classList.toggle('active');
        });
    });
});
