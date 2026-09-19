/**
 * HowItWorks Component
 * Renders an educational visual pipeline detailing the frontend-to-backend model flow.
 */
export default class HowItWorks {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <span class="badge">Pipeline Overview</span>
                    <h2 class="section-title">How AutoGuard AI Works</h2>
                    <p class="section-subtitle">A professional division of labor between browser data entry and ML model inference.</p>
                </div>
                
                <div class="pipeline-layout">
                    <!-- Step 1 -->
                    <div class="pipeline-step">
                        <div class="pipeline-number">01</div>
                        <h4 class="pipeline-title">Enter Claim Details</h4>
                        <p class="pipeline-desc">
                            Adjusters enter parameter data covering the exact 24 driver, property, vehicle, and incident features used to train the dataset.
                        </p>
                    </div>
                    
                    <!-- Step 2 -->
                    <div class="pipeline-step">
                        <div class="pipeline-number">02</div>
                        <h4 class="pipeline-title">Data Sanitization</h4>
                        <p class="pipeline-desc">
                            The frontend sanitizes, parses, and structures inputs into a JSON payload representing the model's standardized feature vector.
                        </p>
                    </div>
                    
                    <!-- Step 3 -->
                    <div class="pipeline-step">
                        <div class="pipeline-number">03</div>
                        <h4 class="pipeline-title">Model Evaluation</h4>
                        <p class="pipeline-desc">
                            The structured data is dispatched to a Python API (Flask/FastAPI) hosting the trained ensemble classifier for real-time inference.
                        </p>
                    </div>
                    
                    <!-- Step 4 -->
                    <div class="pipeline-step">
                        <div class="pipeline-number">04</div>
                        <h4 class="pipeline-title">Fraud Risk Classification</h4>
                        <p class="pipeline-desc">
                            The API responds with a class label (Fraud / Safe) and confidence percentages, which are immediately rendered on the UI dashboard.
                        </p>
                    </div>
                </div>
                
                <div class="pipeline-note text-center" style="margin-top: 36px; font-size: 0.85rem; color: var(--light-text); font-style: italic;">
                    * Currently, Step 3 & Step 4 are mock simulated. The frontend exports a clean <strong>predictClaim()</strong> hook to easily hook into your custom python prediction service.
                </div>
            </div>
        `;
    }
}
