/**
 * Footer Component
 * Renders the bottom footer with branding and copyright information.
 */
export default class Footer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.className = 'footer';
        this.container.innerHTML = `
            <div class="container">
                <a href="#" class="footer-logo" id="footer-brand-logo">
                    <svg class="brand-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 18c-3.75-1-6.5-4.81-6.5-8.5V8.3l6.5-3.61 6.5 3.61v3.59c0 3.69-2.75 7.5-6.5 8.5z"/>
                        <path d="M11 14h2v2h-2zm0-6h2v4h-2z"/>
                    </svg>
                    <span class="brand-text">AUTOGUARD AI</span>
                </a>
                
                <ul class="footer-links">
                    <li><a href="#" data-target="hero-container">Home</a></li>
                    <li><a href="#claim-analysis" data-target="claim-analysis">Claim Analysis</a></li>
                    <li><a href="#how-it-works" data-target="how-it-works">How It Works</a></li>
                    <li><a href="#about" data-target="about">About</a></li>
                </ul>
                
                <div class="footer-copyright">
                    <p>&copy; ${new Date().getFullYear()} AutoGuard AI. All rights reserved.</p>
                    <p style="margin-top: 6px; font-size: 0.72rem; opacity: 0.6; max-width: 480px;">
                        This platform is a mockup implementation of a vehicle insurance fraud detection machine learning dashboard. All evaluations are simulated.
                    </p>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const logoLink = this.container.querySelector('#footer-brand-logo');
        const links = this.container.querySelectorAll('.footer-links a');

        // Scroll to top
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Smooth scroll for footer links
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);

                if (targetEl) {
                    const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        });
    }
}
