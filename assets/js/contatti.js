



// Ripristina il tema salvato all'avvio
document.addEventListener('DOMContentLoaded', function () {


    // Controllo se c'è un messaggio di successo nell'URL (reindirizzamento da Formspree)
    const contactForm = document.getElementById('contactForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (contactForm && confirmationMessage && errorMessage) {
        // Se c'è "success=true" nell'URL, mostra il messaggio di conferma
        if (window.location.search.includes('success=true')) {
            contactForm.style.display = 'none';
            errorMessage.style.display = 'none';
            confirmationMessage.style.display = 'block';
            confirmationMessage.scrollIntoView({ behavior: 'smooth' });
        }
        // Se c'è "error=true" nell'URL, mostra il messaggio di errore
        else if (window.location.search.includes('error=true')) {
            errorMessage.style.display = 'block';
            confirmationMessage.style.display = 'none';
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }

        // Gestione form con Formspree
        contactForm.addEventListener('submit', function (e) {
            // La validazione viene gestita dai campi required
            // Formspree si occuperà dell'invio

            // Disabilita il pulsante per evitare invii multipli
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
            }

            // Formspree gestirà il resto (non serve preventDefault)
            // Il browser si occuperà di inviare il form a Formspree
        });
    }
});

// FAQ Toggle
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');

    if (question) {
        question.addEventListener('click', () => {
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle i');
                    if (otherToggle) {
                        otherToggle.classList.remove('fa-minus');
                        otherToggle.classList.add('fa-plus');
                    }
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');

            // Toggle icon
            if (toggle) {
                const icon = toggle.querySelector('i');
                if (icon) {
                    if (item.classList.contains('active')) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                }
            }
        });
    }
});
