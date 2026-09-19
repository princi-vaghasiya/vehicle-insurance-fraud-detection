/**
 * Hero Component
 * Renders the hero intro section with branding, tagline, and call-to-action.
 */
export default class Hero {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.className = 'hero';
        this.container.innerHTML = `
            <div class="container hero-layout">
                <div class="hero-text-content">
                    <div class="hero-tagline">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 18c-3.75-1-6.5-4.81-6.5-8.5V8.3l6.5-3.61 6.5 3.61v3.59c0 3.69-2.75 7.5-6.5 8.5z"/>
                        </svg>
                        Trustworthy Insurance intelligence
                    </div>
                    <h1 class="hero-title">Vehicle Insurance<br>Fraud Detection</h1>
                    <p class="hero-subtitle">
                        Analyze insurance claims with an AI-powered machine-learning model. Input details across the 24 standard dataset parameters to calculate instant risk assessment.
                    </p>
                    <div class="hero-actions">
                        <a href="#claim-analysis" class="btn-primary" id="btn-start-analysis">
                            Start Claim Analysis
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                        <a href="#how-it-works" class="btn-secondary" id="btn-learn-more">
                            How It Works
                        </a>
                    </div>
                </div>
                
                <div class="hero-visual-wrapper">
                    <div class="hero-image-bg"></div>
                    <img src="assets/car_visual.png" alt="AutoGuard Premium Car Visual" class="hero-image">
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const startBtn = this.container.querySelector('#btn-start-analysis');
        const learnBtn = this.container.querySelector('#btn-learn-more');

        // Scroll to claim form wizard
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetEl = document.getElementById('claim-analysis');
            if (targetEl) {
                const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });

        // Scroll to How it Works
        learnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetEl = document.getElementById('how-it-works');
            if (targetEl) {
                const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    }
}
