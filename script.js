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
    const animatedElements = document.querySelectorAll('.card, h2, p, .button');
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
        
        if(progressBar && raisedAmount) {
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
});