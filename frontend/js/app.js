/**
 * AutoGuard AI - Main Orchestrator App
 * Coordinates application state, mounts JS components, and runs predictions.
 */

// Import components
import IntroScreen from './components/IntroScreen.js';
import Navbar from './components/Navbar.js';
import Hero from './components/Hero.js';
import ClaimForm from './components/ClaimForm.js';
import PredictionResult from './components/PredictionResult.js';
import HowItWorks from './components/HowItWorks.js';
import About from './components/About.js';
import Footer from './components/Footer.js';

class App {
    constructor() {
        this.state = {
            isIntroFinished: false,
            simulatedOutcome: 'safe', // 'safe' or 'fraud' - controlled by dev toolbar
            latestFormData: null
        };
        
        // Component instances
        this.navbar = null;
        this.hero = null;
        this.claimForm = null;
        this.predictionResult = null;
        this.howItWorks = null;
        this.about = null;
        this.footer = null;
    }

    init() {
        // 1. Initialize and run the Intro Screen first
        const intro = new IntroScreen('intro-screen-container', () => {
            this.handleIntroComplete();
        });
        intro.init();
    }

    /**
     * Executes when the intro screen finishes animation.
     * Reveals the main container and initializes the core site sections.
     */
    handleIntroComplete() {
        this.state.isIntroFinished = true;
        
        // Reveal main container
        const mainApp = document.getElementById('main-app-container');
        if (mainApp) {
            mainApp.classList.remove('hidden');
        }

        // Initialize and render all sub-components
        this.navbar = new Navbar('header-container');
        this.navbar.render();

        this.hero = new Hero('hero-container');
        this.hero.render();

        this.claimForm = new ClaimForm(
            'claim-form-container', 
            'progress-indicator-container', 
            (formData) => this.handleClaimSubmit(formData)
        );
        this.claimForm.init();

        this.predictionResult = new PredictionResult(
            'prediction-result-container',
            () => this.handleResetClaimWizard()
        );

        this.howItWorks = new HowItWorks('how-it-works');
        this.howItWorks.render();

        this.about = new About('about');
        this.about.render();

        this.footer = new Footer('footer-container');
        this.footer.render();

        // Initialize simulation/dev toolbar bindings
        this.setupDevToolbar();
    }

    /**
     * Triggered when the adjuster completes Step 7 (Review) and submits the claim.
     */
    handleClaimSubmit(formData) {
        this.state.latestFormData = formData;

        // Hide form fields section temporarily to focus on results, or keep it.
        // The user request says: "Then show a DEMO result state only if necessary... show loading state... then show result"
        // Let's show the loading state in the result section and scroll to it.
        this.predictionResult.showLoading(() => {
            // Once loading completes, invoke model classification (mocked)
            this.executePrediction(formData);
        });
    }

    /**
     * Simulated Prediction Executor.
     * This mimics the backend payload transmission and classification result.
     */
    executePrediction(formData) {
        // Output clean log of features for developer debugging
        console.log('--- TRANSMITTING PAYLOAD TO API https://vehicle-insurance-fraud-detection-gdp7.onrender.com/predict ---');
        console.table(formData);
        
        this.predictClaim(formData)
            .then(result => {
                // Render outcome in result card
                this.predictionResult.showResult(result.outcome, formData, result.risk_score);
            })
            .catch(err => {
                console.error('Prediction failed:', err);
            });
    }

    /**
     * Real Flask Backend API Connector
     * Sends the 24 claim fields to https://vehicle-insurance-fraud-detection-gdp7.onrender.com/predict
     */
    async predictClaim(claimPayload) {
        try {
            const response = await fetch('https://vehicle-insurance-fraud-detection-gdp7.onrender.com/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(claimPayload)
            });

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return {
                outcome: data.outcome || (data.prediction === 1 ? 'fraud' : 'safe'),
                risk_score: data.fraud_probability !== undefined ? data.fraud_probability : null
            };
        } catch (err) {
            console.warn('Flask Backend API unreachable, falling back to simulated toolbar outcome:', err);
            return {
                outcome: this.state.simulatedOutcome,
                risk_score: null
            };
        }
    }

    /**
     * Triggered when "Analyze Another Claim" is clicked.
     * Resets form wizard back to Step 1 and scroll back to claim section.
     */
    handleResetClaimWizard() {
        this.state.latestFormData = null;
        if (this.claimForm) {
            this.claimForm.currentStep = 1;
            // Clear inputs
            Object.keys(this.claimForm.formData).forEach(key => {
                this.claimForm.formData[key] = '';
            });
            this.claimForm.init();
        }

        // Scroll back to form
        const targetEl = document.getElementById('claim-analysis');
        if (targetEl) {
            const headerHeight = this.navbar?.container?.offsetHeight || 70;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }

    /**
     * Sets up the sticky developer mock toolbar buttons.
     * Allows seamless swappings between 'Fraud' and 'Safe' prediction outcomes for demonstration.
     */
    setupDevToolbar() {
        const btnSafe = document.getElementById('btn-toggle-fraud'); // Safe trigger
        const btnFraud = document.getElementById('btn-toggle-safe'); // Fraud trigger

        if (!btnSafe || !btnFraud) return;

        btnSafe.addEventListener('click', () => {
            this.state.simulatedOutcome = 'safe';
            
            btnSafe.className = 'btn-dev-toggle active-green';
            btnFraud.className = 'btn-dev-toggle';
        });

        btnFraud.addEventListener('click', () => {
            this.state.simulatedOutcome = 'fraud';
            
            btnSafe.className = 'btn-dev-toggle';
            btnFraud.className = 'btn-dev-toggle active-red';
        });
    }
}

// Instantiate and kick off application when page DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
