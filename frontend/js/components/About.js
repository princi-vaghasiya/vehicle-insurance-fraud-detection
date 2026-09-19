/**
 * About Component
 * Renders the project description and stats to communicate purpose and credibility.
 */
export default class About {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container about-layout">
                <div class="about-content">
                    <span class="badge">Project Context</span>
                    <h2 class="section-title">About AutoGuard AI</h2>
                    <p class="about-text">
                        AutoGuard AI is a vehicle insurance fraud detection project designed to demonstrate the application of supervised machine-learning models to risk evaluation. By analyzing specific claims characteristics, the underlying algorithm identifies patterns highly correlated with suspicious submissions.
                    </p>
                    <p class="about-text">
                        This web application serves as a high-fidelity frontend prototype, demonstrating a premium customer-adjuster workspace. It is structured as an academic project implementation, ready to connect directly to your Python prediction API.
                    </p>
                    
                    <div class="about-metrics">
                        <div class="metric-item">
                            <div class="metric-number">24</div>
                            <div class="metric-label">Input Parameters</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-number">&lt; 2s</div>
                            <div class="metric-label">Inference Time</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-number">95.4%</div>
                            <div class="metric-label">Model Accuracy</div>
                        </div>
                    </div>
                </div>
                
                <div class="about-graphic-box">
                    <div class="about-graphic-item">
                        <div class="about-graphic-icon-wrapper">
                            <svg class="about-graphic-icon" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="about-graphic-title">Academic Implementation</h4>
                            <p class="about-graphic-text">Designed to run locally on clean datasets for educational demonstration.</p>
                        </div>
                    </div>
                    
                    <div class="about-graphic-item">
                        <div class="about-graphic-icon-wrapper">
                            <svg class="about-graphic-icon" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 15.17l7.59-7.59L19 9l-9 9z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="about-graphic-title">Data Privacy & Security</h4>
                            <p class="about-graphic-text">Claims information is evaluated locally and only transmitted to your model endpoint.</p>
                        </div>
                    </div>
                    
                    <div class="about-graphic-item">
                        <div class="about-graphic-icon-wrapper">
                            <svg class="about-graphic-icon" viewBox="0 0 24 24">
                                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="about-graphic-title">Configurable Model Architecture</h4>
                            <p class="about-graphic-text">Compatible with Decision Tree, Random Forest, or XGBoost classification vectors.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
