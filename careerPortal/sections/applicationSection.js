/**
 * Application Section
 * Handles styling and enhancement of ClickFunnels application forms
 * Includes phone/email validation and prompt banner
 */

window.ApplicationSection = class ApplicationSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.phoneValidator = null;
        this.emailValidator = null;
        this.validationStates = {
            phone: false,
            email: false
        };
        this.initializeApplication();
    }

    /**
     * Initialize Application section specific functionality
     */
    initializeApplication() {
        if (!this.container) {
            console.error('Application section container not found');
            return;
        }

        // Apply styling enhancements
        this.enhanceFormStyling();
        
        // Create and insert prompt banner if enabled
        if (this.config.showPromptBanner) {
            this.createPromptBanner();
        }

        // Initialize validation if enabled
        if (this.config.enableValidation) {
            this.initializeValidation();
        }

        // Setup form progress tracking
        this.setupProgressTracking();
        
        // Initialize animations
        this.initializeAnimations();
    }

    /**
     * Enhance ClickFunnels form styling
     */
    enhanceFormStyling() {
        // Add class to main container for CSS targeting
        this.container.classList.add('application-enhanced');

        // Find and enhance the ApplicationForm
        const applicationForm = this.container.querySelector('[data-title="ApplicationForm"]');
        if (applicationForm) {
            applicationForm.classList.add('enhanced-form');
        }

        // Enhance position header
        const positionHeader = this.container.querySelector('[data-title="PositionApplication"]');
        if (positionHeader) {
            positionHeader.classList.add('enhanced-position-header');
        }

        // Enhance input containers
        const inputContainers = this.container.querySelectorAll('.elInput');
        inputContainers.forEach(input => {
            input.classList.add('enhanced-input');
        });

        // Enhance form headers
        const formHeaders = this.container.querySelectorAll('[data-title="HeaderForm"]');
        formHeaders.forEach(header => {
            header.classList.add('enhanced-form-header');
        });

        // Enhance submit button
        const submitButton = this.container.querySelector('[data-title="button_form"]');
        if (submitButton) {
            submitButton.classList.add('enhanced-submit-button');
        }

        // Enhance progress counter
        const progressCounter = this.container.querySelector('.surveyStepProgressCounter');
        if (progressCounter) {
            progressCounter.classList.add('enhanced-progress');
        }
    }

    /**
     * Create prompt banner
     */
    createPromptBanner() {
        const applicationForm = this.container.querySelector('[data-title="ApplicationForm"]');
        if (!applicationForm) {
            console.warn('ApplicationForm not found for prompt banner');
            return;
        }

        // Check if banner already exists
        if (applicationForm.querySelector('.application-prompt-banner')) {
            return;
        }

        const banner = document.createElement('div');
        banner.className = 'application-prompt-banner';
        banner.innerHTML = `
            <div class="prompt-banner-content">
                <div class="prompt-icon">
                    <i class="fa-solid fa-sparkles"></i>
                </div>
                <div class="prompt-text">
                    <span class="prompt-title">${this.config.promptBanner.title}</span>
                    <span class="prompt-subtitle">${this.config.promptBanner.subtitle}</span>
                </div>
                <button class="prompt-close" aria-label="Banner schließen">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;

        // Insert banner at the top of the form
        applicationForm.insertBefore(banner, applicationForm.firstChild);

        // Add close functionality
        const closeBtn = banner.querySelector('.prompt-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                banner.classList.add('hiding');
                setTimeout(() => banner.remove(), 300);
            });
        }

        // Auto-hide after delay if configured
        if (this.config.promptBanner.autoHideAfter > 0) {
            setTimeout(() => {
                if (banner && banner.parentNode) {
                    banner.classList.add('hiding');
                    setTimeout(() => banner.remove(), 300);
                }
            }, this.config.promptBanner.autoHideAfter * 1000);
        }
    }

    /**
     * Initialize validation system
     */
    initializeValidation() {
        // Initialize validators
        this.phoneValidator = new GermanPhoneValidator();
        this.emailValidator = new EmailValidator();

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupValidation());
        } else {
            this.setupValidation();
        }
    }

    /**
     * Setup validation for inputs
     */
    setupValidation() {
        // Setup phone validation
        if (this.config.validation.validatePhone) {
            this.setupPhoneValidation();
        }

        // Setup email validation
        if (this.config.validation.validateEmail) {
            this.setupEmailValidation();
        }

        // Initialize submit button control
        this.initializeSubmitButton();
    }

    /**
     * Setup phone number validation
     */
    setupPhoneValidation() {
        const phoneSelectors = this.config.validation.phoneSelectors;
        
        phoneSelectors.forEach(selector => {
            const phoneContainer = this.container.querySelector(selector);
            if (!phoneContainer) {
                console.warn(`Phone container not found: ${selector}`);
                return;
            }

            const phoneInput = phoneContainer.querySelector('input');
            if (!phoneInput) {
                console.warn(`Phone input not found in: ${selector}`);
                return;
            }

            // Add enhanced class
            phoneInput.classList.add('enhanced-phone-input');

            const feedbackEl = this.createFeedbackElement();
            phoneContainer.appendChild(feedbackEl);

            // Debounced validation
            let timeout;
            phoneInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.validatePhoneInput(e.target, feedbackEl);
                }, 300);
            });

            phoneInput.addEventListener('blur', (e) => {
                this.validatePhoneInput(e.target, feedbackEl);
            });
        });
    }

    /**
     * Setup email validation
     */
    setupEmailValidation() {
        const emailSelectors = this.config.validation.emailSelectors;
        
        emailSelectors.forEach(selector => {
            const emailContainer = this.container.querySelector(selector);
            if (!emailContainer) {
                console.warn(`Email container not found: ${selector}`);
                return;
            }

            const emailInput = emailContainer.querySelector('input');
            if (!emailInput) {
                console.warn(`Email input not found in: ${selector}`);
                return;
            }

            // Add enhanced class
            emailInput.classList.add('enhanced-email-input');

            const feedbackEl = this.createFeedbackElement();
            emailContainer.appendChild(feedbackEl);

            // Debounced validation
            let timeout;
            emailInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.validateEmailInput(e.target, feedbackEl);
                }, 300);
            });

            emailInput.addEventListener('blur', (e) => {
                this.validateEmailInput(e.target, feedbackEl);
            });
        });
    }

    /**
     * Create feedback element for validation messages
     */
    createFeedbackElement() {
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'validation-feedback';
        return feedbackEl;
    }

    /**
     * Validate phone input and update UI
     */
    validatePhoneInput(input, feedbackEl) {
        const value = input.value.trim();
        
        if (value.length === 0) {
            this.resetInputState(input, feedbackEl);
            this.validationStates.phone = false;
            this.updateSubmitButton();
            return;
        }

        const validation = this.phoneValidator.validate(value);
        
        if (validation.isValid) {
            this.setInputValid(input, feedbackEl, 
                `<i class="fa-regular fa-circle-check"></i> Gültige Handynummer: ${validation.formatted}`
            );
            this.validationStates.phone = true;
        } else {
            this.setInputInvalid(input, feedbackEl, 
                `<i class="fa-light fa-triangle-exclamation"></i> ${validation.error}`
            );
            this.validationStates.phone = false;
        }
        
        this.updateSubmitButton();
    }

    /**
     * Validate email input and update UI
     */
    validateEmailInput(input, feedbackEl) {
        const value = input.value.trim();
        
        if (value.length === 0) {
            this.resetInputState(input, feedbackEl);
            this.validationStates.email = false;
            this.updateSubmitButton();
            return;
        }

        const validation = this.emailValidator.validate(value);
        
        if (validation.isValid) {
            let message = `<i class="fa-regular fa-circle-check"></i> Gültige E-Mail-Adresse`;
            if (validation.warnings.length > 0) {
                message += ` <span style="color: var(--secondary-color);">⚠ ${validation.warnings[0]}</span>`;
            }
            this.setInputValid(input, feedbackEl, message);
            this.validationStates.email = true;
        } else {
            this.setInputInvalid(input, feedbackEl, 
                `<i class="fa-light fa-triangle-exclamation"></i> ${validation.error}`
            );
            this.validationStates.email = false;
        }
        
        this.updateSubmitButton();
    }

    /**
     * Set input to valid state
     */
    setInputValid(input, feedbackEl, message) {
        input.classList.add('input-valid');
        input.classList.remove('input-invalid');
        feedbackEl.innerHTML = message;
        feedbackEl.className = 'validation-feedback feedback-valid';
        input.setCustomValidity('');
    }

    /**
     * Set input to invalid state
     */
    setInputInvalid(input, feedbackEl, message) {
        input.classList.add('input-invalid');
        input.classList.remove('input-valid');
        feedbackEl.innerHTML = message;
        feedbackEl.className = 'validation-feedback feedback-invalid';
        input.setCustomValidity('Invalid');
    }

    /**
     * Reset input to neutral state
     */
    resetInputState(input, feedbackEl) {
        input.classList.remove('input-valid', 'input-invalid');
        feedbackEl.innerHTML = '';
        feedbackEl.className = 'validation-feedback';
        input.setCustomValidity('');
    }

    /**
     * Initialize submit button reference
     */
    initializeSubmitButton() {
        const submitButton = this.container.querySelector(this.config.validation.submitButtonSelector);
        if (!submitButton) {
            console.warn('Submit button not found');
            return;
        }
        
        this.submitButton = submitButton;
        this.updateSubmitButton();
    }

    /**
     * Update submit button state based on validation
     */
    updateSubmitButton() {
        if (!this.submitButton || !this.config.validation.disableSubmitUntilValid) return;

        const allValid = Object.values(this.validationStates).every(state => state);
        
        if (allValid) {
            this.submitButton.classList.remove('button-disabled');
            this.submitButton.removeAttribute('disabled');
        } else {
            this.submitButton.classList.add('button-disabled');
            this.submitButton.setAttribute('disabled', 'disabled');
        }
    }

    /**
     * Setup progress tracking
     */
    setupProgressTracking() {
        const progressCounter = this.container.querySelector('.surveyStepProgressCounter');
        if (!progressCounter) return;

        // Track form changes
        const form = this.container.querySelector('[data-title="ApplicationForm"]');
        if (!form) return;

        form.addEventListener('change', () => {
            this.updateProgressAnimation();
        });
    }

    /**
     * Update progress animation
     */
    updateProgressAnimation() {
        const progressBar = this.container.querySelector('.surveyStepProgressCounter .progress-bar');
        if (!progressBar) return;

        // Add pulse animation on progress
        progressBar.classList.add('progress-pulse');
        setTimeout(() => {
            progressBar.classList.remove('progress-pulse');
        }, 600);
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Add fade-in animation to form elements
        const animatedElements = this.container.querySelectorAll('.elInput, [data-title="HeaderForm"]');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 50}ms`;
            el.classList.add('fade-in-up');
        });
    }

    /**
     * Handle responsive updates
     */
    onResize() {
        const breakpoint = this.getCurrentBreakpoint();
        
        if (breakpoint === 'mobile') {
            this.container.classList.add('application-mobile');
        } else {
            this.container.classList.remove('application-mobile');
        }
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        if (!this.config) {
            console.error('No configuration provided for application section');
            return false;
        }

        return super.validateConfig();
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        return {
            sectionType: 'application',
            config: this.config,
            validationEnabled: this.config.enableValidation,
            promptBannerShown: this.config.showPromptBanner,
            validationStates: this.validationStates
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        // Remove event listeners
        const form = this.container.querySelector('[data-title="ApplicationForm"]');
        if (form) {
            form.removeEventListener('change', this.updateProgressAnimation);
        }

        super.destroy();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        const defaultConfig = ApplicationSection.getDefaultConfig();
        const mergedConfig = { ...defaultConfig, ...config };
        return new ApplicationSection(mergedConfig, containerId);
    }

    /**
     * Get default configuration
     */
    static getDefaultConfig() {
        return {
            showPromptBanner: true,
            promptBanner: {
                title: "Schnell & Einfach",
                subtitle: "Beantworte nur 5 kurze Fragen",
                autoHideAfter: 10 // seconds, 0 to never auto-hide
            },
            enableValidation: true,
            validation: {
                validatePhone: true,
                validateEmail: true,
                phoneSelectors: ['div[data-title="phone_number_input"]', '.elInput[data-input-type="phone"]'],
                emailSelectors: ['div[data-title="email_input"]', '.elInput[data-input-type="email"]'],
                submitButtonSelector: '[data-title="button_form"]',
                disableSubmitUntilValid: true
            }
        };
    }
}

/**
 * German Phone Number Validator
 * Comprehensive validation for German mobile numbers
 */
class GermanPhoneValidator {
    constructor() {
        // German mobile prefixes (comprehensive list)
        this.mobilePrefixes = [
            '150', '151', '152', '153', '154', '155', '156', '157', '158', '159',
            '160', '161', '162', '163', '164', '165', '166', '167', '168', '169',
            '170', '171', '172', '173', '174', '175', '176', '177', '178', '179'
        ];
        
        // Major German area codes for landlines
        this.landlineAreaCodes = [
            '30', '40', '69', '89', // Major cities
            '201', '202', '203', '204', '205', '206', '207', '208', '209',
            '221', '228', '231', '234', '251', '261', '271',
            '341', '351', '371', '381', '391'
        ];
    }

    cleanPhoneNumber(rawInput) {
        if (!rawInput || typeof rawInput !== 'string') return '';
        
        let cleaned = rawInput.trim().replace(/[^\d+]/g, '');
        
        if (cleaned.startsWith('0049')) {
            cleaned = '+49' + cleaned.slice(4);
        } else if (cleaned.startsWith('049')) {
            cleaned = '+49' + cleaned.slice(3);
        } else if (cleaned.startsWith('49') && !cleaned.startsWith('+49')) {
            cleaned = '+49' + cleaned.slice(2);
        } else if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
            cleaned = '+49' + cleaned.slice(1);
        } else if (!cleaned.startsWith('+') && !cleaned.startsWith('49')) {
            cleaned = '+49' + cleaned;
        }
        
        return cleaned;
    }

    validate(phoneNumber) {
        const result = {
            isValid: false,
            type: null,
            formatted: null,
            error: null
        };

        try {
            const cleaned = this.cleanPhoneNumber(phoneNumber);
            
            if (!cleaned.startsWith('+49')) {
                result.error = 'Muss eine deutsche Telefonnummer sein (+49)';
                return result;
            }

            const nationalNumber = cleaned.replace(/^\+49/, '');
            
            if (nationalNumber.length < 6) {
                result.error = 'Telefonnummer zu kurz';
                return result;
            }

            if (nationalNumber.length > 12) {
                result.error = 'Telefonnummer zu lang';
                return result;
            }

            if (this.isLandlineNumber(nationalNumber)) {
                result.error = 'Bitte gib eine Handynummer ein (keine Festnetznummer)';
                return result;
            }

            if (this.isServiceNumber(nationalNumber)) {
                result.error = 'Service-Nummern sind nicht erlaubt. Bitte gib eine Handynummer ein';
                return result;
            }

            if (nationalNumber.length < 10) {
                result.error = 'Handynummer zu kurz - deutsche Handynummern haben 10-11 Ziffern';
                return result;
            }

            if (nationalNumber.length > 11) {
                result.error = 'Handynummer zu lang - deutsche Handynummern haben 10-11 Ziffern';
                return result;
            }

            if (this.isMobileNumber(nationalNumber)) {
                result.isValid = true;
                result.type = 'mobile';
                result.formatted = this.formatMobileNumber(nationalNumber);
                return result;
            }

            result.error = 'Ungültige deutsche Handynummer. Handynummern beginnen mit 015, 016 oder 017';
            return result;

        } catch (error) {
            result.error = 'Fehler bei der Validierung';
            return result;
        }
    }

    isMobileNumber(nationalNumber) {
        if (nationalNumber.length < 10 || nationalNumber.length > 11) return false;
        
        const prefix = nationalNumber.substring(0, 3);
        return this.mobilePrefixes.includes(prefix);
    }

    isLandlineNumber(nationalNumber) {
        if (!/^[2-9]/.test(nationalNumber)) return false;
        if (nationalNumber.length < 6 || nationalNumber.length > 11) return false;
        
        for (let areaCode of this.landlineAreaCodes) {
            if (nationalNumber.startsWith(areaCode)) {
                const subscriberLength = nationalNumber.length - areaCode.length;
                return subscriberLength >= 3 && subscriberLength <= 8;
            }
        }
        
        return /^[2-9]\d{5,10}$/.test(nationalNumber);
    }

    isServiceNumber(nationalNumber) {
        return /^(800|900|180|137|118)\d{3,7}$/.test(nationalNumber);
    }

    formatMobileNumber(nationalNumber) {
        if (nationalNumber.length === 10) {
            return `+49 ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`;
        } else if (nationalNumber.length === 11) {
            return `+49 ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 7)} ${nationalNumber.slice(7)}`;
        } else {
            return `+49 ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3)}`;
        }
    }
}

/**
 * Email Validator
 * Comprehensive email validation
 */
class EmailValidator {
    constructor() {
        this.germanDomains = [
            'gmail.com', 'web.de', 'gmx.de', 't-online.de', 'hotmail.de',
            'yahoo.de', 'freenet.de', 'posteo.de', 'mailbox.org'
        ];
        
        this.disposableDomains = [
            '10minutemail.com', 'guerrillamail.com', 'mailinator.com'
        ];
    }

    validate(email) {
        const result = {
            isValid: false,
            formatted: null,
            warnings: [],
            error: null
        };

        try {
            if (!email || typeof email !== 'string') {
                result.error = 'E-Mail-Adresse ist erforderlich';
                return result;
            }

            const trimmedEmail = email.trim().toLowerCase();
            
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            
            if (!emailRegex.test(trimmedEmail)) {
                result.error = 'Ungültiges E-Mail-Format';
                return result;
            }

            if (trimmedEmail.includes('..')) {
                result.error = 'E-Mail darf keine aufeinanderfolgenden Punkte enthalten';
                return result;
            }

            const [localPart, domain] = trimmedEmail.split('@');
            
            if (localPart.startsWith('.') || localPart.endsWith('.')) {
                result.error = 'E-Mail-Adresse ungültig formatiert';
                return result;
            }

            if (!domain || domain.length < 4) {
                result.error = 'Domain zu kurz';
                return result;
            }

            const tldRegex = /\.[a-zA-Z]{2,}$/;
            if (!tldRegex.test(domain)) {
                result.error = 'Ungültige Top-Level-Domain';
                return result;
            }

            if (this.disposableDomains.includes(domain)) {
                result.warnings.push('Temporäre E-Mail-Adresse erkannt');
            }

            if (trimmedEmail.length > 254) {
                result.error = 'E-Mail-Adresse zu lang';
                return result;
            }

            if (localPart.length > 64) {
                result.error = 'E-Mail-Adresse ungültig (lokaler Teil zu lang)';
                return result;
            }

            result.isValid = true;
            result.formatted = trimmedEmail;
            return result;

        } catch (error) {
            result.error = 'Fehler bei der E-Mail-Validierung';
            return result;
        }
    }
}