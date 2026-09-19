/**
 * FormFields Utility Module
 * Exports helper functions to render premium-styled form inputs, select dropdowns, and toggles.
 */

/**
 * Renders a premium text or number input field.
 * Supports currency prefixing (e.g. ₹), minimum/maximum values, required markers, and validation subtexts.
 */
export function renderInputField({ id, label, type = 'text', value = '', placeholder = '', min = null, max = null, required = true, helpText = '', isCurrency = false }) {
    const requiredIndicator = required ? '<span class="required-indicator">*</span>' : '';
    const prefixClass = isCurrency ? 'input-control-prefix-padding' : '';
    
    return `
        <div class="form-field" id="field-wrapper-${id}">
            <label class="form-label" for="${id}">
                <span>${label}${requiredIndicator}</span>
            </label>
            <div class="input-wrapper">
                ${isCurrency ? '<span class="input-icon-prefix">₹</span>' : ''}
                <input 
                    type="${type}" 
                    id="${id}" 
                    name="${id}" 
                    value="${value}"
                    placeholder="${placeholder}"
                    class="input-control ${prefixClass}"
                    ${min !== null ? `min="${min}"` : ''}
                    ${max !== null ? `max="${max}"` : ''}
                    ${required ? 'required' : ''}
                    data-currency="${isCurrency}"
                >
            </div>
            <span class="field-help-text">${helpText}</span>
            <span class="field-error-text" id="error-${id}">This field is required and must be valid.</span>
        </div>
    `;
}

/**
 * Renders a premium styled select dropdown menu.
 */
export function renderSelectField({ id, label, choices = [], value = '', required = true, helpText = '' }) {
    const requiredIndicator = required ? '<span class="required-indicator">*</span>' : '';
    
    const optionsHtml = choices.map(choice => {
        const optionVal = typeof choice === 'object' ? choice.value : choice;
        const optionLabel = typeof choice === 'object' ? choice.label : choice;
        const selected = String(optionVal) === String(value) ? 'selected' : '';
        return `<option value="${optionVal}" ${selected}>${optionLabel}</option>`;
    }).join('');

    return `
        <div class="form-field" id="field-wrapper-${id}">
            <label class="form-label" for="${id}">
                <span>${label}${requiredIndicator}</span>
            </label>
            <div class="select-wrapper">
                <select id="${id}" name="${id}" class="select-control" ${required ? 'required' : ''}>
                    <option value="" disabled ${value === '' ? 'selected' : ''}>Select option ▼</option>
                    ${optionsHtml}
                </select>
            </div>
            <span class="field-help-text">${helpText}</span>
            <span class="field-error-text" id="error-${id}">Please select an option.</span>
        </div>
    `;
}

/**
 * Renders a premium segmented toggle control (Yes/No, 0/1 representation).
 */
export function renderToggleField({ id, label, choices = [], value = '', required = true, helpText = '' }) {
    const requiredIndicator = required ? '<span class="required-indicator">*</span>' : '';
    
    const togglesHtml = choices.map((choice, index) => {
        const optionVal = typeof choice === 'object' ? choice.value : choice;
        const optionLabel = typeof choice === 'object' ? choice.label : choice;
        const isChecked = String(optionVal) === String(value) ? 'checked' : '';
        
        return `
            <div class="segmented-option">
                <input 
                    type="radio" 
                    id="${id}-${index}" 
                    name="${id}" 
                    value="${optionVal}" 
                    class="segmented-input"
                    ${isChecked}
                    ${required && index === 0 ? 'required' : ''}
                >
                <label for="${id}-${index}" class="segmented-label">${optionLabel}</label>
            </div>
        `;
    }).join('');

    return `
        <div class="form-field" id="field-wrapper-${id}">
            <label class="form-label">
                <span>${label}${requiredIndicator}</span>
            </label>
            <div class="segmented-control-wrapper">
                ${togglesHtml}
            </div>
            <span class="field-help-text">${helpText}</span>
            <span class="field-error-text" id="error-${id}">Please select one option.</span>
        </div>
    `;
}

/**
 * Standard client-side formatting for currencies with commas.
 */
export function formatCurrencyValue(val) {
    if (val === '' || val === null || val === undefined || isNaN(val)) return '';
    return Number(val).toLocaleString('en-IN');
}

/**
 * Sets validation error states on fields.
 */
export function setFieldError(id, hasError, errorMessage = '') {
    const fieldWrapper = document.getElementById(`field-wrapper-${id}`);
    const errorEl = document.getElementById(`error-${id}`);
    const inputControl = document.getElementById(id) || document.querySelector(`input[name="${id}"]`);

    if (!fieldWrapper) return;

    if (hasError) {
        fieldWrapper.classList.add('has-error');
        if (inputControl) inputControl.classList.add('error');
        if (errorEl && errorMessage) errorEl.textContent = errorMessage;
    } else {
        fieldWrapper.classList.remove('has-error');
        if (inputControl) inputControl.classList.remove('error');
    }
}
