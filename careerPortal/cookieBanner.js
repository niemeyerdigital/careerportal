/**
 * Cookie Banner Module
 * GDPR-compliant cookie consent management with Facebook Pixel integration
 */

window.CookieBannerModule = class CookieBannerModule {
    constructor(config) {
        this.config = this.mergeConfig(config);
        this.consentState = this.loadConsentState();
        this.bannerId = 'cookie-banner-module';
        this.initialized = false;
        
        // Initialize immediately for GDPR compliance
        this.init();
    }

    /**
     * Merge user config with defaults
     */
    mergeConfig(userConfig) {
        const defaults = {
            facebook: {
                pixelId: null,
                enabled: false,
                events: {
                    pageView: true,
                    viewContent: true,
                    search: true,
                    lead: true,
                    completeRegistration: true
                }
            },
            banner: {
                headline: "Mehr Relevanz, mehr Möglichkeiten",
                description: "Wir nutzen Cookies, um unsere Karriereseite optimal für dich zu gestalten. Einige sind essenziell, andere verbessern dein Nutzungserlebnis.",
                privacyPolicyUrl: "#datenschutz",
                cookiePolicyUrl: "#cookie-richtlinien",
                position: "bottom-left",
                showOverlay: true,
                animation: "slide",
                autoShowDelay: 500,
                iconType: "animated" // "animated", "static", or "none"
            },
            categories: {
                essential: {
                    label: "Essenziell",
                    description: "Diese Cookies sind für den Betrieb der Webseite erforderlich.",
                    required: true,
                    icon: "fa-solid fa-shield-halved"
                },
                analytics: {
                    label: "Analyse",
                    description: "Diese Cookies helfen uns, die Nutzung der Seite zu verstehen.",
                    defaultEnabled: false,
                    icon: "fa-solid fa-chart-line"
                },
                marketing: {
                    label: "Marketing",
                    description: "Diese Cookies ermöglichen personalisierte Werbung.",
                    defaultEnabled: false,
                    icon: "fa-solid fa-bullhorn"
                }
            },
            buttons: {
                acceptAll: {
                    text: "Ja, alle zustimmen",
                    style: "primary"
                },
                saveSettings: {
                    text: "Einstellung speichern",
                    style: "secondary"
                },
                decline: {
                    text: "Nur Essenzielle",
                    style: "tertiary",
                    enabled: false
                }
            },
            tracking: {
                onConsentGiven: true,
                onBannerDismissed: true,
                onSettingsChanged: true
            },
            advanced: {
                cookieLifetime: 365, // days
                reShowAfterDays: null, // null = never, number = days
                debugMode: false
            }
        };

        // Deep merge
        return this.deepMerge(defaults, userConfig || {});
    }

    /**
     * Deep merge utility
     */
    deepMerge(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    /**
     * Check if value is object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Initialize cookie banner
     */
    init() {
        if (this.initialized) return;
        
        // Always create the banner elements (including collapsed button)
        this.createBanner();
        this.setupEventListeners();
        
        // Check if we should show the full banner or just the collapsed button
        if (this.shouldShowBanner()) {
            this.showBanner();
        } else {
            // Show collapsed button and initialize tracking
            this.showCollapsedOnly();
            this.initializeTracking();
        }
        
        this.initialized = true;
        this.log('Cookie banner initialized');
    }

    /**
     * Check if banner should be shown
     */
    shouldShowBanner() {
        const hasSetPreferences = localStorage.getItem('cookiePreferencesSet') === 'true';
        
        // Check if we should re-show after certain days
        if (hasSetPreferences && this.config.advanced.reShowAfterDays) {
            const lastShown = localStorage.getItem('cookiePreferencesDate');
            if (lastShown) {
                const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
                if (daysSince >= this.config.advanced.reShowAfterDays) {
                    return true;
                }
            }
        }
        
        return !hasSetPreferences;
    }

    /**
     * Create banner HTML
     */
    createBanner() {
        // Remove existing banner if any
        const existing = document.getElementById(this.bannerId);
        if (existing) existing.remove();

        // Create container
        const container = document.createElement('div');
        container.id = this.bannerId;
        container.className = `cookie-banner-module cookie-position-${this.config.banner.position}`;
        
        // Build HTML
        container.innerHTML = this.getBannerHTML();
        
        // Add to body
        document.body.appendChild(container);
        
        // Add overlay if configured
        if (this.config.banner.showOverlay) {
            const overlay = document.createElement('div');
            overlay.id = 'cookie-banner-overlay';
            overlay.className = 'cookie-banner-overlay';
            document.body.appendChild(overlay);
        }

        // Add collapsed button
        const collapsedBtn = document.createElement('div');
        collapsedBtn.id = 'cookie-banner-collapsed';
        collapsedBtn.className = 'cookie-banner-collapsed';
        collapsedBtn.innerHTML = `
            <div class="cookie-collapsed-icon">
                <i class="fa-solid fa-cookie-bite"></i>
            </div>
            <span class="cookie-collapsed-tooltip">Cookie-Einstellungen</span>
        `;
        document.body.appendChild(collapsedBtn);
    }

    /**
     * Get banner HTML
     */
    getBannerHTML() {
        const categories = this.getCategoriesHTML();
        const buttons = this.getButtonsHTML();
        const icon = this.getIconHTML();
        
        return `
            <div class="cookie-banner-container">
                ${icon}
                <div class="cookie-banner-content">
                    <h2 class="cookie-banner-headline">${this.config.banner.headline}</h2>
                    <p class="cookie-banner-description">${this.config.banner.description}</p>
                    <div class="cookie-banner-links">
                        <a href="${this.config.banner.privacyPolicyUrl}" target="_blank" class="cookie-banner-link">
                            Datenschutzerklärung
                        </a>
                    </div>
                    <div class="cookie-categories-section">
                        ${categories}
                    </div>
                    <div class="cookie-banner-actions">
                        ${buttons}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get icon HTML
     */
    getIconHTML() {
        if (this.config.banner.iconType === 'none') return '';
        
        if (this.config.banner.iconType === 'animated') {
            return `
                <div class="cookie-banner-icon-wrapper">
                    <div class="cookie-icon-animated">
                        <div class="cookie-bite"></div>
                        <i class="fa-solid fa-cookie-bite"></i>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="cookie-banner-icon-wrapper">
                <i class="fa-solid fa-cookie-bite cookie-icon-static"></i>
            </div>
        `;
    }

    /**
     * Get categories HTML
     */
    getCategoriesHTML() {
        let html = '';
        
        for (const [key, category] of Object.entries(this.config.categories)) {
            const isChecked = this.consentState[key] || category.required;
            const isDisabled = category.required;
            
            html += `
                <div class="cookie-category-row" data-category="${key}">
                    <div class="cookie-category-header">
                        <div class="cookie-category-info">
                            <i class="${category.icon || 'fa-solid fa-caret-right'} cookie-category-icon"></i>
                            <h3 class="cookie-category-label">${category.label}</h3>
                        </div>
                        <div class="cookie-toggle-switch ${isDisabled ? 'disabled' : ''}" data-category="${key}">
                            <input type="checkbox" 
                                   id="cookie-${key}-toggle" 
                                   ${isChecked ? 'checked' : ''} 
                                   ${isDisabled ? 'disabled' : ''}>
                            <span class="cookie-toggle-slider"></span>
                        </div>
                    </div>
                    <p class="cookie-category-description">${category.description}</p>
                </div>
            `;
        }
        
        return html;
    }

    /**
     * Get buttons HTML
     */
    getButtonsHTML() {
        let html = '';
        
        // Decline button (if enabled)
        if (this.config.buttons.decline.enabled) {
            html += `
                <button class="cookie-btn cookie-btn-decline" id="cookie-decline-btn">
                    ${this.config.buttons.decline.text}
                </button>
            `;
        }
        
        // Save settings button
        html += `
            <button class="cookie-btn cookie-btn-save" id="cookie-save-btn">
                ${this.config.buttons.saveSettings.text}
            </button>
        `;
        
        // Accept all button
        html += `
            <button class="cookie-btn cookie-btn-accept" id="cookie-accept-btn">
                ${this.config.buttons.acceptAll.text}
            </button>
        `;
        
        return html;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Accept all button
        const acceptBtn = document.getElementById('cookie-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }

        // Save settings button
        const saveBtn = document.getElementById('cookie-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        // Decline button
        const declineBtn = document.getElementById('cookie-decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineAll());
        }

        // Toggle switches
        document.querySelectorAll('.cookie-toggle-switch:not(.disabled)').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const checkbox = toggle.querySelector('input');
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                this.updateToggleVisual(toggle, checkbox.checked);
            });
        });

        // Category rows (accordion)
        document.querySelectorAll('.cookie-category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (!e.target.closest('.cookie-toggle-switch')) {
                    this.toggleAccordion(header);
                }
            });
        });

        // Collapsed button
        const collapsedBtn = document.getElementById('cookie-banner-collapsed');
        if (collapsedBtn) {
            collapsedBtn.addEventListener('click', () => this.showBanner());
        }

        // Overlay click
        const overlay = document.getElementById('cookie-banner-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.hideBanner(false));
        }
    }

    /**
     * Toggle accordion
     */
    toggleAccordion(header) {
        const row = header.parentElement;
        const description = row.querySelector('.cookie-category-description');
        const icon = header.querySelector('.cookie-category-icon');
        
        row.classList.toggle('expanded');
        
        if (row.classList.contains('expanded')) {
            description.style.display = 'block';
            if (icon && icon.classList.contains('fa-caret-right')) {
                icon.style.transform = 'rotate(90deg)';
            }
        } else {
            description.style.display = 'none';
            if (icon && icon.classList.contains('fa-caret-right')) {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    }

    /**
     * Update toggle visual
     */
    updateToggleVisual(toggle, checked) {
        if (checked) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    }

    /**
     * Accept all cookies
     */
    acceptAll() {
        this.log('Accept all clicked');
        
        // Set all non-essential categories to true
        for (const key of Object.keys(this.config.categories)) {
            this.consentState[key] = true;
        }
        
        this.saveConsentState();
        this.initializeTracking();
        this.hideBanner(true);
        this.trackEvent('ConsentGiven', { type: 'accept_all' });
    }

    /**
     * Save current settings
     */
    saveSettings() {
        this.log('Save settings clicked');
        
        // Read current toggle states
        for (const key of Object.keys(this.config.categories)) {
            if (!this.config.categories[key].required) {
                const toggle = document.getElementById(`cookie-${key}-toggle`);
                if (toggle) {
                    this.consentState[key] = toggle.checked;
                }
            } else {
                this.consentState[key] = true;
            }
        }
        
        this.saveConsentState();
        this.initializeTracking();
        this.hideBanner(true);
        this.trackEvent('ConsentGiven', { type: 'custom_settings' });
    }

    /**
     * Decline all non-essential cookies
     */
    declineAll() {
        this.log('Decline all clicked');
        
        // Set only essential to true
        for (const [key, category] of Object.entries(this.config.categories)) {
            this.consentState[key] = category.required || false;
        }
        
        this.saveConsentState();
        this.hideBanner(true);
        this.trackEvent('ConsentGiven', { type: 'decline_all' });
    }

    /**
     * Show collapsed button only (when preferences already set)
     */
    showCollapsedOnly() {
        const banner = document.getElementById(this.bannerId);
        const overlay = document.getElementById('cookie-banner-overlay');
        const collapsed = document.getElementById('cookie-banner-collapsed');
        
        // Hide main banner and overlay
        if (banner) {
            banner.classList.remove('show');
            banner.style.display = 'none';
        }
        if (overlay) {
            overlay.classList.remove('show');
            overlay.style.display = 'none';
        }
        
        // Show collapsed button
        if (collapsed) {
            setTimeout(() => {
                collapsed.classList.add('show');
            }, 500);
        }
        
        this.log('Showing collapsed button only (preferences already set)');
    }

    /**
     * Show banner
     */
    showBanner() {
        const banner = document.getElementById(this.bannerId);
        const overlay = document.getElementById('cookie-banner-overlay');
        const collapsed = document.getElementById('cookie-banner-collapsed');
        
        if (banner) {
            // Make sure banner is visible
            banner.style.display = 'block';
            
            // Reset toggle states
            for (const [key, state] of Object.entries(this.consentState)) {
                const toggle = document.getElementById(`cookie-${key}-toggle`);
                if (toggle && !this.config.categories[key].required) {
                    toggle.checked = state;
                    this.updateToggleVisual(toggle.parentElement, state);
                }
            }
            
            // Hide collapsed button first
            if (collapsed) collapsed.classList.remove('show');
            
            setTimeout(() => {
                banner.classList.add('show');
                if (overlay) {
                    overlay.style.display = 'block';
                    setTimeout(() => overlay.classList.add('show'), 10);
                }
            }, this.config.banner.autoShowDelay || 100);
        }
    }

    /**
     * Hide banner
     */
    hideBanner(showCollapsed = true) {
        const banner = document.getElementById(this.bannerId);
        const overlay = document.getElementById('cookie-banner-overlay');
        const collapsed = document.getElementById('cookie-banner-collapsed');
        
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 500);
        }
        
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
        
        if (showCollapsed && collapsed) {
            setTimeout(() => {
                collapsed.classList.add('show');
            }, 600);
        }
        
        if (this.config.tracking.onBannerDismissed) {
            this.trackEvent('BannerDismissed');
        }
    }

    /**
     * Load consent state from localStorage
     */
    loadConsentState() {
        const state = {};
        
        for (const key of Object.keys(this.config.categories)) {
            const stored = localStorage.getItem(`cookie_consent_${key}`);
            if (stored !== null) {
                state[key] = stored === 'true';
            } else if (this.config.categories[key].required) {
                state[key] = true;
            } else {
                state[key] = this.config.categories[key].defaultEnabled || false;
            }
        }
        
        return state;
    }

    /**
     * Save consent state to localStorage
     */
    saveConsentState() {
        for (const [key, value] of Object.entries(this.consentState)) {
            localStorage.setItem(`cookie_consent_${key}`, value);
        }
        
        localStorage.setItem('cookiePreferencesSet', 'true');
        localStorage.setItem('cookiePreferencesDate', Date.now().toString());
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: this.consentState
        }));
        
        this.log('Consent state saved:', this.consentState);
    }

    /**
     * Initialize tracking based on consent
     */
    initializeTracking() {
        // Initialize Facebook Pixel if marketing consent is given
        if (this.consentState.marketing && this.config.facebook.enabled && this.config.facebook.pixelId) {
            this.initFacebookPixel();
        }
        
        // Initialize analytics if analytics consent is given
        if (this.consentState.analytics) {
            this.initAnalytics();
        }
    }

    /**
     * Initialize Facebook Pixel
     */
    initFacebookPixel() {
        if (window.fbq) {
            this.log('Facebook Pixel already initialized');
            return;
        }
        
        try {
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', this.config.facebook.pixelId);
            
            if (this.config.facebook.events.pageView) {
                fbq('track', 'PageView');
            }
            
            this.log('Facebook Pixel initialized with ID:', this.config.facebook.pixelId);
            
            // Set global flag
            window.cookieBannerFBPixelReady = true;
            
            // Dispatch event for other modules
            window.dispatchEvent(new CustomEvent('fbPixelReady'));
            
        } catch (error) {
            console.error('Failed to initialize Facebook Pixel:', error);
        }
    }

    /**
     * Initialize analytics
     */
    initAnalytics() {
        // Google Analytics or other analytics initialization
        this.log('Analytics initialized');
        
        // Set global flag
        window.cookieBannerAnalyticsReady = true;
        
        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('analyticsReady'));
    }

    /**
     * Track event (public method for other modules)
     */
    trackEvent(eventName, parameters = {}) {
        // Only track if we have consent
        if (!this.consentState.marketing) {
            this.log(`Event '${eventName}' not tracked - no marketing consent`);
            return;
        }
        
        // Track with Facebook Pixel if available
        if (window.fbq && this.config.facebook.enabled) {
            const fbEventMap = {
                'Lead': 'Lead',
                'CompleteRegistration': 'CompleteRegistration',
                'ViewContent': 'ViewContent',
                'Search': 'Search',
                'InitiateCheckout': 'InitiateCheckout',
                'ConsentGiven': 'CustomEvent',
                'BannerDismissed': 'CustomEvent'
            };
            
            const fbEvent = fbEventMap[eventName] || 'CustomEvent';
            
            try {
                if (fbEvent === 'CustomEvent') {
                    fbq('trackCustom', eventName, parameters);
                } else {
                    fbq('track', fbEvent, parameters);
                }
                this.log(`FB Pixel event tracked: ${eventName}`, parameters);
            } catch (error) {
                console.error(`Failed to track event ${eventName}:`, error);
            }
        }
        
        // Track with Google Analytics if available
        if (window.gtag && this.consentState.analytics) {
            try {
                gtag('event', eventName, parameters);
                this.log(`GA event tracked: ${eventName}`, parameters);
            } catch (error) {
                console.error(`Failed to track GA event ${eventName}:`, error);
            }
        }
    }

    /**
     * Check if consent is given for a category
     */
    hasConsent(category) {
        return this.consentState[category] || false;
    }

    /**
     * Update consent programmatically
     */
    updateConsent(category, value) {
        if (this.config.categories[category]) {
            this.consentState[category] = value;
            this.saveConsentState();
            this.initializeTracking();
            this.log(`Consent updated: ${category} = ${value}`);
        }
    }

    /**
     * Reset all preferences
     */
    resetPreferences() {
        localStorage.removeItem('cookiePreferencesSet');
        localStorage.removeItem('cookiePreferencesDate');
        
        for (const key of Object.keys(this.config.categories)) {
            localStorage.removeItem(`cookie_consent_${key}`);
        }
        
        this.consentState = this.loadConsentState();
        this.showBanner();
    }

    /**
     * Debug logging
     */
    log(...args) {
        if (this.config.advanced.debugMode) {
            console.log('[CookieBanner]', ...args);
        }
    }

    /**
     * Get banner status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            consentState: this.consentState,
            fbPixelReady: !!window.fbq,
            config: this.config
        };
    }

    /**
     * Destroy banner
     */
    destroy() {
        const banner = document.getElementById(this.bannerId);
        const overlay = document.getElementById('cookie-banner-overlay');
        const collapsed = document.getElementById('cookie-banner-collapsed');
        
        if (banner) banner.remove();
        if (overlay) overlay.remove();
        if (collapsed) collapsed.remove();
        
        this.initialized = false;
    }
}

// Create global instance
window.CookieBanner = null;

// Auto-initialize if config exists
if (window.COOKIE_BANNER_CONFIG) {
    window.CookieBanner = new window.CookieBannerModule(window.COOKIE_BANNER_CONFIG);
}
