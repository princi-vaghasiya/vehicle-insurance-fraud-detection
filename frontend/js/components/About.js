/**
 * About Component
 * Renders the project description, purpose, and Model Performance Evaluation card.
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
                        This web application serves as a high-fidelity frontend prototype, demonstrating a premium customer-adjuster workspace connected directly to our production Decision Tree prediction API.
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
                            <div class="metric-number">36</div>
                            <div class="metric-label">Encoded Features</div>
                        </div>
                    </div>
                </div>
                
                <div class="about-card-column">
                    <!-- Model Performance Card -->
                    <div class="model-performance-card">
                        <div class="model-perf-header">
                            <span class="model-perf-badge">Production Evaluation</span>
                            <h3 class="model-perf-title">Final Model: Tuned Decision Tree Classifier</h3>
                        </div>

                        <div class="model-perf-metrics-grid">
                            <div class="model-perf-metric">
                                <span class="model-perf-val">28.04%</span>
                                <span class="model-perf-lbl">Precision</span>
                            </div>
                            <div class="model-perf-metric highlight">
                                <span class="model-perf-val">98.11%</span>
                                <span class="model-perf-lbl">Recall</span>
                            </div>
                            <div class="model-perf-metric">
                                <span class="model-perf-val">43.61%</span>
                                <span class="model-perf-lbl">F1 Score</span>
                            </div>
                        </div>

                        <div class="model-perf-info">
                            <p class="model-perf-desc">Optimized for effective fraud-claim detection and high fraud-case recall.</p>
                            <div class="model-perf-meta">
                                <strong>Model Optimization:</strong> GridSearchCV with 5-fold cross-validation
                            </div>
                            <div class="model-perf-params">
                                <code>criterion = gini</code>
                                <code>max_depth = 2</code>
                                <code>min_samples_leaf = 8</code>
                                <code>class_weight = balanced</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
