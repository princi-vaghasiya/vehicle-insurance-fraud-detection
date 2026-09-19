/**
 * Navbar Component
 * Renders the top navigation bar and manages mobile hamburger toggling.
 */
export default class Navbar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isMobileMenuOpen = false;
    }

    render() {
        if (!this.container) return;

        this.container.className = 'navbar';
        this.container.innerHTML = `
            <div class="container">
                <a href="#" class="nav-brand" id="brand-logo-link">
                    <svg class="brand-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 18c-3.75-1-6.5-4.81-6.5-8.5V8.3l6.5-3.61 6.5 3.61v3.59c0 3.69-2.75 7.5-6.5 8.5z"/>
                        <path d="M11 14h2v2h-2zm0-6h2v4h-2z"/>
                    </svg>
                    <span class="brand-text">AUTOGUARD AI</span>
                </a>
                
                <button class="mobile-nav-toggle" id="btn-mobile-toggle" aria-label="Toggle Navigation">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/>
                    </svg>
                </button>

                <ul class="nav-menu" id="nav-menu-list">
                    <li><a href="#" class="nav-link active" data-target="hero-container">Home</a></li>
                    <li><a href="#claim-analysis" class="nav-link" data-target="claim-analysis">Claim Analysis</a></li>
                    <li><a href="#how-it-works" class="nav-link" data-target="how-it-works">How It Works</a></li>
                    <li><a href="#about" class="nav-link" data-target="about">About</a></li>
                    <li><a href="#claim-analysis" class="btn-nav-cta" data-target="claim-analysis">Analyze Claim</a></li>
                </ul>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const toggleBtn = this.container.querySelector('#btn-mobile-toggle');
        const navMenu = this.container.querySelector('#nav-menu-list');
        const logoLink = this.container.querySelector('#brand-logo-link');
        const navLinks = this.container.querySelectorAll('.nav-link, .btn-nav-cta');

        // Toggle mobile menu
        toggleBtn.addEventListener('click', () => {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            navMenu.classList.toggle('mobile-open', this.isMobileMenuOpen);
            
            // Toggle hamburger icon animation/state
            const path = toggleBtn.querySelector('svg path');
            if (this.isMobileMenuOpen) {
                path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            } else {
                path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });

        // Click handler for logo (scroll to top)
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.setActiveLink(navLinks[0]);
            this.closeMobileMenu(navMenu, toggleBtn);
        });

        // Click handler for menu links (smooth scroll & update active state)
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);

                if (targetEl) {
                    // Check if it's the section wrapper and adjust for sticky header
                    const headerHeight = this.container.offsetHeight || 70;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Set active class if it's a regular navigation link (not the CTA button)
                    if (link.classList.contains('nav-link')) {
                        this.setActiveLink(link);
                    }
                }
                
                this.closeMobileMenu(navMenu, toggleBtn);
            });
        });

        // Scroll listener to update active link dynamically based on scroll position
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 200; // Offset for detection
            navLinks.forEach(link => {
                if (!link.classList.contains('nav-link')) return;
                const targetId = link.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                
                if (targetEl) {
                    const top = targetEl.offsetTop;
                    const height = targetEl.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        this.setActiveLink(link);
                    }
                }
            });
        });
    }

    setActiveLink(activeLink) {
        const navLinks = this.container.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    closeMobileMenu(navMenu, toggleBtn) {
        this.isMobileMenuOpen = false;
        navMenu.classList.remove('mobile-open');
        const path = toggleBtn.querySelector('svg path');
        path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    }
}
