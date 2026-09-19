/**
 * PredictionResult Component
 * Manages the loading screen animations and prediction outcomes (Not Fraud / Potential Fraud) states.
 */
export default class PredictionResult {
    constructor(containerId, onReset) {
        this.container = document.getElementById(containerId);
        this.onResetCallback = onReset;
    }

    /**
     * Renders a simulated analysis loader.
     * Takes a callback that executes when the mock loading finishes.
     */
    showLoading(onLoaded) {
        if (!this.container) return;

        this.container.classList.remove('hidden');
        this.container.innerHTML = `
            <div class="container text-center">
                <div class="result-card-wrapper">
                    <div class="result-card">
                        <div class="loading-wrapper">
                            <div class="loading-spinner-circle"></div>
                            <div class="loading-text" id="spinner-status">Analyzing claim data...</div>
                            <p class="loading-subtext" id="spinner-substatus">Parsing 24 dataset parameters</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Smooth scroll to the results section
        this.scrollToContainer();

        // Simulate step-by-step API loading
        const statuses = [
            { text: 'Sanitizing input parameters...', sub: 'Validating value bounds' },
            { text: 'Running ML model inference...', sub: 'Invoking random forest ensemble' },
            { text: 'Calculating risk thresholds...', sub: 'Finalizing classification indices' }
        ];

        let currentIdx = 0;
        const interval = setInterval(() => {
            if (currentIdx < statuses.length) {
                const statusEl = this.container.querySelector('#spinner-status');
                const substatusEl = this.container.querySelector('#spinner-substatus');
                if (statusEl) statusEl.textContent = statuses[currentIdx].text;
                if (substatusEl) substatusEl.textContent = statuses[currentIdx].sub;
                currentIdx++;
            } else {
                clearInterval(interval);
                if (onLoaded) onLoaded();
            }
        }, 600);
    }

    /**
     * Renders the final evaluation screen based on the simulated outcome.
     * @param {string} outcome - 'safe' or 'fraud'
     * @param {Object} inputData - Original data inputs for future payload reference
     */
    showResult(outcome, inputData, riskScore) {
        if (!this.container) return;

        const isFraud = outcome === 'fraud';
        const cardClass = isFraud ? 'fraud' : 'safe';
        
        const iconHtml = isFraud 
            ? `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 6h2v6h-2V8zm0 8h2v2h-2v-2z"/>
               </svg>`
            : `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l7.59-7.59L19 9l-9 9z"/>
               </svg>`;

        const titleText = isFraud ? 'Potential Fraud Detected' : 'No Fraud Detected';
        const descText = isFraud
            ? 'The claim has been flagged as potentially suspicious by the Decision Tree machine-learning model.'
            : 'The claim does not appear suspicious based on the Decision Tree machine-learning model prediction.';

        const riskBadgeText = isFraud ? 'High Risk Indicator' : 'Normal Risk Range';

        const displayRisk = (riskScore !== null && riskScore !== undefined)
            ? `${Math.round(riskScore * 100)}%`
            : '--%';

        this.container.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <span class="badge">Inference Complete</span>
                    <h2 class="section-title">Analysis Output</h2>
                </div>
                
                <div class="result-card-wrapper">
                    <div class="result-card ${cardClass}">
                        <div class="result-icon-container">
                            ${iconHtml}
                        </div>
                        
                        <div class="result-header-wrapper">
                            <span class="result-header">CLAIM ANALYSIS COMPLETE</span>
                            <h3 class="result-title">${titleText}</h3>
                        </div>
                        
                        <p class="result-desc">${descText}</p>
                        
                        <div class="result-gauge-box">
                            <span class="result-gauge-label">Classification Output</span>
                            <div class="result-gauge-value">Fraud Probability: ${displayRisk}</div>
                            <span class="result-gauge-badge">${riskBadgeText}</span>
                        </div>
                        
                        <div class="result-disclaimer">
                            <strong>Note on ML evaluation:</strong> Real-time decision tree classification processed by Python Flask service at <code>http://127.0.0.1:5000/predict</code>.
                        </div>
                        
                        <button class="btn-primary" id="btn-analyze-another">
                            Analyze Another Claim
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M23 4v6h-6M1 20v-6h6"></path>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.scrollToContainer();
        this.setupEventListeners();
    }

    scrollToContainer() {
        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const elementPosition = this.container.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    setupEventListeners() {
        const resetBtn = this.container.querySelector('#btn-analyze-another');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Hide results section
                this.container.classList.add('hidden');
                
                // Fire reset callback
                if (this.onResetCallback) {
                    this.onResetCallback();
                }
            });
        }
    }
}
