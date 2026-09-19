/**
 * IntroScreen Component
 * Renders the introductory opening animation, then triggers a callback to reveal the app.
 */
export default class IntroScreen {
    constructor(containerId, onComplete) {
        this.container = document.getElementById(containerId);
        this.onComplete = onComplete;
        this.duration = 3500; // 3.5 seconds
    }

    init() {
        // Check if intro has already run in this session
        const hasSeenIntro = sessionStorage.getItem('autoguard_intro_seen');
        
        if (hasSeenIntro) {
            // Immediately bypass the intro screen
            this.container.style.display = 'none';
            if (this.onComplete) this.onComplete();
            return;
        }

        // Otherwise, render and run the intro
        this.render();
        this.startTimeout();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="intro-content">
                <div class="intro-left">
                    <img src="assets/car_visual.png" alt="Premium Luxury Car Graphic">
                </div>
                <div class="intro-right">
                    <div class="intro-brand-wrapper">
                        <svg class="intro-logo-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 18c-3.75-1-6.5-4.81-6.5-8.5V8.3l6.5-3.61 6.5 3.61v3.59c0 3.69-2.75 7.5-6.5 8.5z"/>
                            <path d="M11 14h2v2h-2zm0-6h2v4h-2z"/>
                        </svg>
                        <h1 class="intro-title">AUTOGUARD AI</h1>
                    </div>
                    <div class="intro-subtitle">Vehicle Insurance Intelligence</div>
                    <blockquote class="intro-quote">
                        "Smarter claim analysis.<br>
                        AI-assisted fraud detection."
                    </blockquote>
                </div>
            </div>
        `;
    }

    startTimeout() {
        setTimeout(() => {
            // Fade out the intro screen container
            this.container.classList.add('intro-screen-fadeout');
            
            // Mark as seen in sessionStorage
            sessionStorage.setItem('autoguard_intro_seen', 'true');
            
            // Wait for fade transition (800ms in CSS) to complete, then reveal app
            setTimeout(() => {
                this.container.style.display = 'none';
                if (this.onComplete) this.onComplete();
            }, 800);
        }, this.duration);
    }
}
