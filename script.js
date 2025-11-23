document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.card, h2, p, .button, #newsletter');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Progress Bar Logic (Demo)
    const goal = 50000;
    let raised = 12500; // Starting amount for demo

    const updateProgress = () => {
        const percentage = Math.min((raised / goal) * 100, 100);
        const progressBar = document.getElementById('progressBar');
        const raisedAmount = document.getElementById('raisedAmount');

        if (progressBar && raisedAmount) {
            progressBar.style.width = percentage + '%';
            raisedAmount.textContent = raised.toLocaleString();
        }
    };

    // Simulate donations coming in
    setInterval(() => {
        if (raised < goal) {
            raised += Math.floor(Math.random() * 200);
            updateProgress();
        }
    }, 3000);

    updateProgress();

    // Newsletter Form Logic
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            const button = newsletterForm.querySelector('button');

            button.disabled = true;
            button.textContent = 'Subscribing...';

            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    // Show success message
                    newsletterForm.style.display = 'none';
                    const successMsg = document.getElementById('newsletterSuccess');
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.classList.add('fade-in', 'visible');
                    }
                } else {
                    const data = await response.json();
                    alert(data.error || 'Something went wrong. Please try again.');
                    button.disabled = false;
                    button.textContent = 'Subscribe';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to connect to the server.');
                button.disabled = false;
                button.textContent = 'Subscribe';
            }
        });
    }
});

// Stripe Checkout Function
async function checkout(amount) {
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        });

        const session = await response.json();

        if (session.error) {
            alert('Error: ' + session.error);
            return;
        }

        const stripe = Stripe('pk_test_placeholder'); // Replace with your publishable key
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to initiate checkout.');
    }
}