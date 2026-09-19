/**
 * ClaimForm Component
 * Manages the multi-step claim analysis form wizard, progress indicator sidebar, and review page.
 */
import { renderInputField, renderSelectField, renderToggleField, setFieldError, formatCurrencyValue } from './FormFields.js';

export default class ClaimForm {
    constructor(formContainerId, progressContainerId, onSubmit) {
        this.formContainer = document.getElementById(formContainerId);
        this.progressContainer = document.getElementById(progressContainerId);
        this.onSubmitCallback = onSubmit;
        
        this.currentStep = 1;
        this.totalSteps = 7; // Steps 1-6 are inputs, Step 7 is Review
        
        // Initial form state storing all 24 features
        this.formData = {
            // Step 1: Driver
            age_of_driver: '',
            gender: '',
            marital_status: '',
            safety_rating: '',
            annual_income: '',
            higher_education: '',
            
            // Step 2: Property
            address_change: '',
            property_status: '',
            
            // Step 3: Vehicle
            age_of_vehicle: '',
            vehicle_category: '',
            vehicle_price: '',
            
            // Step 4: Claim
            claim_day_of_week: '',
            total_claim: '',
            injury_claim: '',
            policy_deductible: '',
            annual_premium: '',
            days_open: '',
            form_defects: '',
            
            // Step 5: Incident
            accident_site: '',
            police_report: '',
            witness_present: '',
            liability_pct: '',
            channel: '',
            
            // Step 6: History
            past_num_claims: ''
        };
        
        this.stepMetadata = [
            { id: 1, name: 'Driver', desc: 'Driver profile parameters' },
            { id: 2, name: 'Property', desc: 'Location and address history' },
            { id: 3, name: 'Vehicle', desc: 'Automotive details' },
            { id: 4, name: 'Claim', desc: 'Insurance policy and claims data' },
            { id: 5, name: 'Incident', desc: 'Accident and response information' },
            { id: 6, name: 'History', desc: 'Prior insurance record' },
            { id: 7, name: 'Review', desc: 'Verify inputs before prediction' }
        ];
    }

    init() {
        this.renderProgressSidebar();
        this.renderActiveStep();
    }

    renderProgressSidebar() {
        if (!this.progressContainer) return;

        const stepsHtml = this.stepMetadata.map(step => {
            let stateClass = '';
            if (step.id === this.currentStep) {
                stateClass = 'active';
            } else if (step.id < this.currentStep) {
                stateClass = 'completed';
            }
            
            return `
                <li class="progress-step-item ${stateClass}" data-step="${step.id}" id="sidebar-step-${step.id}">
                    <span class="progress-step-dot">${step.id}</span>
                    <span class="progress-step-name">${step.name}</span>
                </li>
            `;
        }).join('');

        this.progressContainer.className = 'progress-sidebar';
        this.progressContainer.innerHTML = `
            <div class="progress-sidebar-title">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                Progress Checklist
            </div>
            <ul class="progress-steps-list">
                ${stepsHtml}
            </ul>
        `;

        // Allow navigation back to already-visited or validated steps
        this.progressContainer.querySelectorAll('.progress-step-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetStep = parseInt(item.getAttribute('data-step'));
                // Save current step's state before jumping
                const form = this.formContainer.querySelector('#wizard-step-form');
                if (form) {
                    this.saveStepState(form);
                }
                // Users can click on steps <= currentStep, or jump around if validated
                if (targetStep < this.currentStep || this.validateStep(this.currentStep)) {
                    this.goToStep(targetStep);
                }
            });
        });
    }

    updateProgressUI() {
        this.stepMetadata.forEach(step => {
            const stepItem = document.getElementById(`sidebar-step-${step.id}`);
            if (stepItem) {
                stepItem.className = 'progress-step-item';
                if (step.id === this.currentStep) {
                    stepItem.classList.add('active');
                } else if (step.id < this.currentStep) {
                    stepItem.classList.add('completed');
                }
            }
        });
    }

    renderActiveStep() {
        if (!this.formContainer) return;
        
        let fieldsHtml = '';
        const meta = this.stepMetadata[this.currentStep - 1];

        // Reset scroll position to top of claim analysis section
        const sectionHeader = document.getElementById('claim-analysis');
        if (sectionHeader && this.currentStep > 1) {
            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 70;
            const elementPosition = sectionHeader.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }

        if (this.currentStep <= 6) {
            fieldsHtml = `<div class="form-grid">${this.getFieldsForStep(this.currentStep)}</div>`;
        } else {
            fieldsHtml = this.renderReviewStep();
        }

        this.formContainer.innerHTML = `
            <div class="form-card">
                <div class="form-step-panel">
                    <div class="form-step-header">
                        <svg class="form-step-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            ${this.getStepIcon(this.currentStep)}
                        </svg>
                        <h3 class="form-step-title">Step ${this.currentStep} — ${meta.name}</h3>
                    </div>
                    <p class="form-step-desc">${meta.desc}</p>
                    
                    <form id="wizard-step-form" novalidate>
                        ${fieldsHtml}
                        
                        <div class="form-navigation-actions">
                            ${this.currentStep === 7 
                                ? `<button type="button" class="btn-form-prev" id="btn-wizard-edit-details">Edit Details</button>` 
                                : (this.currentStep > 1 ? `<button type="button" class="btn-form-prev" id="btn-wizard-prev">← Back</button>` : '')
                            }
                            ${this.currentStep < this.totalSteps 
                                ? `<button type="submit" class="btn-form-next" id="btn-wizard-next">Next step →</button>` 
                                : `<button type="submit" class="btn-form-next" id="btn-wizard-submit" style="background-color: var(--rich-brown);">Analyze Claim 🛡</button>`
                            }
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.setupStepEventListeners();
    }

    getFieldsForStep(step) {
        const s = this.formData;
        switch (step) {
            case 1: // DRIVER
                return `
                    ${renderInputField({ id: 'age_of_driver', label: 'Age of Driver', type: 'number', value: s.age_of_driver, placeholder: 'e.g. 35', min: 18, max: 100, helpText: 'Driver must be at least 18 years old.' })}
                    ${renderSelectField({ id: 'gender', label: 'Gender', choices: ['M', 'F'], value: s.gender, helpText: 'Cleaned model categorical value.' })}
                    ${renderToggleField({ id: 'marital_status', label: 'Marital Status', choices: [{value: '0', label: 'Single/Other (0)'}, {value: '1', label: 'Married (1)'}], value: s.marital_status, helpText: 'Dataset binary marital status representation.' })}
                    ${renderInputField({ id: 'safety_rating', label: 'Safety Rating', type: 'number', value: s.safety_rating, placeholder: 'e.g. 85', min: 1, max: 100, helpText: 'Dataset driver safety rating score (1-100).' })}
                    ${renderInputField({ id: 'annual_income', label: 'Annual Income', type: 'number', value: s.annual_income, placeholder: 'e.g. 50000', min: 0, helpText: 'Gross annual income of the driver.', isCurrency: true })}
                    ${renderToggleField({ id: 'higher_education', label: 'Higher Education (Academic degree)', choices: [{value: '0', label: 'No (0)'}, {value: '1', label: 'Yes (1)'}], value: s.higher_education, helpText: 'Binary feature for college degree.' })}
                `;
            case 2: // PROPERTY
                return `
                    ${renderToggleField({ id: 'address_change', label: 'Address Change (Last 12 Months)', choices: [{value: '0', label: 'No (0)'}, {value: '1', label: 'Yes (1)'}], value: s.address_change, helpText: 'Has the policyholder moved recently?' })}
                    ${renderSelectField({ id: 'property_status', label: 'Property Status', choices: ['Own', 'Rent'], value: s.property_status, helpText: 'Residency status of the claim applicant.' })}
                `;
            case 3: // VEHICLE
                return `
                    ${renderInputField({ id: 'age_of_vehicle', label: 'Age of Vehicle', type: 'number', value: s.age_of_vehicle, placeholder: 'e.g. 5', min: 0, max: 14, helpText: 'Vehicle age must be between 0 and 14 years.' })}
                    ${renderSelectField({ id: 'vehicle_category', label: 'Vehicle Category', choices: ['Compact', 'Large', 'Medium'], value: s.vehicle_category, helpText: 'Model-compliant size grouping.' })}
                    ${renderInputField({ id: 'vehicle_price', label: 'Vehicle Price', type: 'number', value: s.vehicle_price, placeholder: 'e.g. 1200000', min: 0, helpText: 'Original purchase or market value.', isCurrency: true })}
                `;
            case 4: // CLAIM
                return `
                    ${renderSelectField({ id: 'claim_day_of_week', label: 'Claim Day of Week', choices: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], value: s.claim_day_of_week, helpText: 'Day of the week the claim was officially filed.' })}
                    ${renderInputField({ id: 'total_claim', label: 'Total Claim Amount', type: 'number', value: s.total_claim, placeholder: 'e.g. 50000', min: 0, helpText: 'Aggregated claimed insurance payout.', isCurrency: true })}
                    ${renderInputField({ id: 'injury_claim', label: 'Injury Claim Amount', type: 'number', value: s.injury_claim, placeholder: 'e.g. 15000', min: 0, helpText: 'Claimed medical or injury compensation.', isCurrency: true })}
                    ${renderInputField({ id: 'policy_deductible', label: 'Policy Deductible', type: 'number', value: s.policy_deductible, placeholder: 'e.g. 10000', min: 0, helpText: 'Deductible threshold set on the policy.', isCurrency: true })}
                    ${renderInputField({ id: 'annual_premium', label: 'Annual Premium', type: 'number', value: s.annual_premium, placeholder: 'e.g. 35000', min: 0, helpText: 'Annual cost paid for policy coverage.', isCurrency: true })}
                    ${renderInputField({ id: 'days_open', label: 'Days Open', type: 'number', value: s.days_open, placeholder: 'e.g. 45', min: 0, helpText: 'Days the claim file has remained active or open.' })}
                    ${renderInputField({ id: 'form_defects', label: 'Form Defects (Count)', type: 'number', value: s.form_defects, placeholder: 'e.g. 0', min: 0, helpText: 'Cleaned dataset defect representation (numerical count, 0+).' })}
                `;
            case 5: // INCIDENT
                return `
                    ${renderSelectField({ id: 'accident_site', label: 'Accident Site', choices: ['Highway', 'Local', 'Parking Lot'], value: s.accident_site, helpText: 'Exact type of road site where accident occurred.' })}
                    ${renderToggleField({ id: 'police_report', label: 'Police Report Filed', choices: [{value: '0', label: 'No (0)'}, {value: '1', label: 'Yes (1)'}], value: s.police_report, helpText: 'Was a formal police report submitted?' })}
                    ${renderToggleField({ id: 'witness_present', label: 'Witness Present', choices: [{value: '0', label: 'No (0)'}, {value: '1', label: 'Yes (1)'}], value: s.witness_present, helpText: 'Binary feature for third-party eyewitnesses.' })}
                    
                    <div class="form-field">
                        <label class="form-label" for="liability_pct">
                            <span>Liability Percentage (0-100%)</span>
                        </label>
                        <div class="range-slider-wrapper">
                            <input 
                                type="range" 
                                id="liability_pct" 
                                name="liability_pct" 
                                min="0" 
                                max="100" 
                                value="${s.liability_pct || '0'}" 
                                class="range-slider"
                            >
                            <div class="range-value-bubble" id="liability-pct-val">${s.liability_pct || '0'}%</div>
                        </div>
                        <span class="field-help-text">Assigned degree of fault in the collision.</span>
                    </div>

                    ${renderSelectField({ id: 'channel', label: 'Filing Channel', choices: ['Broker', 'Online', 'Phone'], value: s.channel, helpText: 'Method used to submit the claim.' })}
                `;
            case 6: // HISTORY
                return `
                    ${renderInputField({ id: 'past_num_claims', label: 'Past Number of Claims', type: 'number', value: s.past_num_claims, placeholder: 'e.g. 1', min: 0, helpText: 'Number of insurance claims filed in previous years.' })}
                `;
            default:
                return '';
        }
    }

    renderReviewStep() {
        const s = this.formData;
        
        // Define groupings for review cards
        const groups = [
            {
                title: 'Driver Information',
                icon: this.getStepIcon(1),
                fields: [
                    { label: 'Age of Driver', value: s.age_of_driver },
                    { label: 'Gender', value: s.gender },
                    { label: 'Marital Status', value: s.marital_status === '1' ? 'Married (1)' : 'Single/Other (0)' },
                    { label: 'Safety Rating', value: s.safety_rating },
                    { label: 'Annual Income', value: `₹ ${formatCurrencyValue(s.annual_income)}` },
                    { label: 'Higher Education', value: s.higher_education === '1' ? 'Yes (1)' : 'No (0)' }
                ]
            },
            {
                title: 'Property & Region',
                icon: this.getStepIcon(2),
                fields: [
                    { label: 'Address Change', value: s.address_change === '1' ? 'Yes (1)' : 'No (0)' },
                    { label: 'Property Status', value: s.property_status }
                ]
            },
            {
                title: 'Vehicle Information',
                icon: this.getStepIcon(3),
                fields: [
                    { label: 'Age of Vehicle', value: `${s.age_of_vehicle} Years` },
                    { label: 'Vehicle Category', value: s.vehicle_category },
                    { label: 'Vehicle Price', value: `₹ ${formatCurrencyValue(s.vehicle_price)}` }
                ]
            },
            {
                title: 'Claim Information',
                icon: this.getStepIcon(4),
                fields: [
                    { label: 'Claim Day of Week', value: s.claim_day_of_week },
                    { label: 'Total Claim Amount', value: `₹ ${formatCurrencyValue(s.total_claim)}` },
                    { label: 'Injury Claim Amount', value: `₹ ${formatCurrencyValue(s.injury_claim)}` },
                    { label: 'Policy Deductible', value: `₹ ${formatCurrencyValue(s.policy_deductible)}` },
                    { label: 'Annual Premium', value: `₹ ${formatCurrencyValue(s.annual_premium)}` },
                    { label: 'Days Open', value: `${s.days_open} Days` },
                    { label: 'Form Defects Count', value: s.form_defects }
                ]
            },
            {
                title: 'Incident Information',
                icon: this.getStepIcon(5),
                fields: [
                    { label: 'Accident Site', value: s.accident_site },
                    { label: 'Police Report Filed', value: s.police_report === '1' ? 'Yes (1)' : 'No (0)' },
                    { label: 'Witness Present', value: s.witness_present === '1' ? 'Yes (1)' : 'No (0)' },
                    { label: 'Liability Percentage', value: `${s.liability_pct || 0}%` },
                    { label: 'Filing Channel', value: s.channel }
                ]
            },
            {
                title: 'Prior History',
                icon: this.getStepIcon(6),
                fields: [
                    { label: 'Past Number of Claims', value: s.past_num_claims }
                ]
            }
        ];

        const cardsHtml = groups.map((g, index) => {
            const listHtml = g.fields.map(f => `
                <li class="review-data-item">
                    <span class="review-data-label">${f.label}</span>
                    <span class="review-data-value">${f.value || 'Not provided'}</span>
                </li>
            `).join('');

            // Open the first card by default, others collapsed
            const activeClass = index === 0 ? 'active' : '';

            return `
                <div class="review-accordion-card ${activeClass}" id="review-card-${index}">
                    <div class="review-accordion-header">
                        <div class="review-accordion-title-wrapper">
                            <svg class="review-accordion-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                ${g.icon}
                            </svg>
                            <h4 class="review-accordion-title">${g.title}</h4>
                        </div>
                        <svg class="review-accordion-chevron" viewBox="0 0 24 24">
                            <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="review-accordion-content">
                        <ul class="review-data-list">
                            ${listHtml}
                        </ul>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="review-panel">
                ${cardsHtml}
                <div class="review-note" style="margin-top: 16px; padding: 16px; background-color: var(--cream); border: 1px solid var(--soft-beige); border-radius: var(--border-radius-md); font-size: 0.82rem; color: var(--light-text); display: flex; align-items: flex-start; gap: 10px;">
                    <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: var(--medium-brown); flex-shrink: 0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    <span>Click on sections above to expand and check individual parameter binds. Select **Edit Details** to make corrections, or select **Analyze Claim** to feed this 24-feature dataset directly to the machine learning engine.</span>
                </div>
            </div>
        `;
    }

    setupStepEventListeners() {
        const form = this.formContainer ? this.formContainer.querySelector('#wizard-step-form') : null;
        if (!form) return;

        // Slider real-time bubble updating
        const slider = form.querySelector('#liability_pct');
        const sliderBubble = form.querySelector('#liability-pct-val');
        if (slider && sliderBubble) {
            slider.addEventListener('input', (e) => {
                sliderBubble.textContent = `${e.target.value}%`;
                this.formData.liability_pct = e.target.value;
            });
        }

        // Setup input formatting & state bindings for numeric/text controls
        form.querySelectorAll('.input-control, .select-control, .segmented-input').forEach(control => {
            const bindState = () => {
                const name = control.name;
                let val = control.value;
                if (control.type === 'radio') {
                    const checkedRadio = form.querySelector(`input[name="${name}"]:checked`);
                    val = checkedRadio ? checkedRadio.value : '';
                }
                this.formData[name] = val;
            };

            // Bind values on input change
            control.addEventListener('input', bindState);
            control.addEventListener('change', bindState);
        });

        // Review step accordion listeners
        if (this.currentStep === 7) {
            const cards = form.querySelectorAll('.review-accordion-card');
            cards.forEach(card => {
                const header = card.querySelector('.review-accordion-header');
                if (header) {
                    header.addEventListener('click', () => {
                        card.classList.toggle('active');
                    });
                }
            });
        }

        // Submit listener for Wizard navigation or submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Save state of current page
            this.saveStepState(form);
            
            if (this.validateStep(this.currentStep)) {
                if (this.currentStep < this.totalSteps) {
                    this.goToStep(this.currentStep + 1);
                } else {
                    if (this.onSubmitCallback) {
                        this.onSubmitCallback(this.formData);
                    }
                }
            }
        });

        // Back button navigation
        const prevBtn = form.querySelector('#btn-wizard-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.saveStepState(form);
                if (this.currentStep > 1) {
                    this.goToStep(this.currentStep - 1);
                }
            });
        }

        // Edit Details button navigation (Step 7 Review only)
        const editDetailsBtn = form.querySelector('#btn-wizard-edit-details');
        if (editDetailsBtn) {
            editDetailsBtn.addEventListener('click', () => {
                this.goToStep(1);
            });
        }
    }

    /**
     * Saves all input element states on the active panel to this.formData.
     * Prevents data loss during step jumps or navigation submissions.
     */
    saveStepState(form) {
        if (!form) return;
        
        form.querySelectorAll('.input-control, .select-control, .segmented-input, .range-slider').forEach(control => {
            const name = control.name;
            if (!name) return;
            
            let val = control.value;
            if (control.type === 'radio') {
                const checkedRadio = form.querySelector(`input[name="${name}"]:checked`);
                val = checkedRadio ? checkedRadio.value : '';
            }
            this.formData[name] = val;
        });
    }

    validateStep(step) {
        let isValid = true;
        const form = this.formContainer.querySelector('#wizard-step-form');
        if (!form) return false;

        // Extract inputs belonging to this step
        const stepControls = form.querySelectorAll('.input-control, .select-control, .segmented-input');
        
        // Track radio groups checked status to avoid double flags
        const checkedRadioGroups = new Set();

        stepControls.forEach(control => {
            const id = control.name || control.id;
            
            // Handle radio controls validation
            if (control.type === 'radio') {
                if (checkedRadioGroups.has(id)) return;
                checkedRadioGroups.add(id);

                const checkedRadio = form.querySelector(`input[name="${id}"]:checked`);
                if (!checkedRadio) {
                    setFieldError(id, true, 'Please select one option.');
                    isValid = false;
                } else {
                    setFieldError(id, false);
                }
                return;
            }

            // Handle standard inputs & dropdowns
            let value = control.value.trim();
            if (control.required && value === '') {
                setFieldError(id, true, 'This field is required.');
                isValid = false;
                return;
            }

            // Numbers bounds validation
            if (control.type === 'number' && value !== '') {
                const numVal = Number(value);
                const min = control.min !== '' ? Number(control.min) : null;
                const max = control.max !== '' ? Number(control.max) : null;

                if (min !== null && numVal < min) {
                    setFieldError(id, true, `Value must be at least ${min}.`);
                    isValid = false;
                    return;
                }
                if (max !== null && numVal > max) {
                    setFieldError(id, true, `Value cannot exceed ${max}.`);
                    isValid = false;
                    return;
                }
            }

            // If passes all checks
            setFieldError(id, false);
        });

        return isValid;
    }

    goToStep(stepNum) {
        if (stepNum < 1 || stepNum > this.totalSteps) return;
        this.currentStep = stepNum;
        this.updateProgressUI();
        this.renderActiveStep();
    }

    // SVG icons helper per step
    getStepIcon(step) {
        switch (step) {
            case 1: // Driver
                return `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>`;
            case 2: // Property
                return `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`;
            case 3: // Vehicle
                return `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.27-3.82c.14-.4.52-.68.96-.68h9.54c.44 0 .82.28.96.68L19 11H5z"/>`;
            case 4: // Claim
                return `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z"/>`;
            case 5: // Incident
                return `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>`;
            case 6: // History
                return `<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 18.04 10.51 19 13 19c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>`;
            case 7: // Review
                return `<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>`;
            default:
                return '';
        }
    }
}
