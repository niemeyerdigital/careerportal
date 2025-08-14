/**
 * Tracking Constants Module
 * Central constants for funnel tracking system
 * Location: careerPortal/tracking/constantsTracking.js
 */

window.TrackingConstants = {
    /**
     * Step prefixes for custom events
     */
    PREFIXES: {
        Landing: 'LP',
        Formular: 'FB',
        Ausschluss: 'UQ',
        Danke: 'QA'
    },

    /**
     * Step-specific default events
     */
    STEP_EVENTS: {
        Landing: 'Landingpage',
        Formular: 'ViewContent',
        Ausschluss: 'Unqualifiziert',
        Danke: 'CompleteRegistration'
    },

    /**
     * Scroll depth milestones
     */
    SCROLL_DEPTHS: [25, 50, 75, 100],

    /**
     * Dwell time categories
     */
    DWELL_CATEGORIES: [
        { 
            name: 'VeryShortInteraction0-10Sek', 
            min: 0, 
            max: 10,
            description: 'Very short interaction (0-10 seconds)'
        },
        { 
            name: 'ShortInteraction10-30Sek', 
            min: 10, 
            max: 30,
            description: 'Short interaction (10-30 seconds)'
        },
        { 
            name: 'MiddleInteraction30-120Sek', 
            min: 30, 
            max: 120,
            description: 'Middle interaction (30-120 seconds)'
        },
        { 
            name: 'LongInteraction120-240Sek', 
            min: 120, 
            max: 240,
            description: 'Long interaction (120-240 seconds)'
        },
        { 
            name: 'ExtendedInteraction240SekAndMore', 
            min: 240, 
            max: Infinity,
            description: 'Extended interaction (240+ seconds)'
        }
    ],

    /**
     * Browser detection mappings
     */
    BROWSER_TYPES: {
        chrome: 'GoogleChrome',
        firefox: 'MozillaFirefox',
        safari: 'AppleSafari',
        edge: 'MicrosoftEdge',
        opera: 'Opera',
        unknown: 'Unknown'
    },

    /**
     * Device detection mappings
     */
    DEVICE_TYPES: {
        // Mobile devices
        mobileAndroidPhone: 'MobileAndroidPhone',
        mobileAndroidTablet: 'MobileAndroidTablet',
        mobileAppleiPad: 'MobileAppleiPad',
        mobileAppleiPhone: 'MobileAppleiPhone',
        
        // Desktop/Laptop
        desktopWindowsComputer: 'DesktopComputerWindows',
        desktopWindowsLaptop: 'DesktopLaptopWindows',
        desktopMacComputer: 'DesktopComputerMacOS',
        desktopMacLaptop: 'DesktopLaptopMacOS',
        desktopLinuxComputer: 'DesktopComputerLinux',
        desktopLinuxLaptop: 'DesktopLaptopLinux',
        
        // Unknown
        unknown: 'UnknownDevice'
    },

    /**
     * Activity status
     */
    ACTIVITY_STATUS: {
        active: 'Act',
        inactive: 'Inact'
    },

    /**
     * Storage keys for session/local storage
     */
    STORAGE_KEYS: {
        // Content tracking
        origin: 'origin',
        contentId: 'contentId',
        
        // Position data
        positionData: 'selectedPosition',
        
        // Consent
        analyticsConsent: 'analyticsConsent',
        marketingConsent: 'marketingConsent',
        cookieConsent: 'cookie_consent_',
        cookiePreferencesSet: 'cookiePreferencesSet',
        
        // Tracking state
        trackedEvents: 'trackedEvents',
        sessionStartTime: 'sessionStartTime',
        lastActivityTime: 'lastActivityTime'
    },

    /**
     * Event categories for grouping
     */
    EVENT_CATEGORIES: {
        PAGE_VIEW: 'PageView',
        SCROLL: 'Scroll',
        DWELL_TIME: 'DwellTime',
        DEVICE: 'Device',
        BROWSER: 'Browser',
        ACTIVITY: 'Activity',
        CONTENT: 'Content',
        CONVERSION: 'Conversion',
        BOUNCE: 'Bounce'
    },

    /**
     * Meta Pixel standard events mapping
     */
    META_PIXEL_EVENTS: {
        // Standard events
        PAGE_VIEW: 'PageView',
        VIEW_CONTENT: 'ViewContent',
        SEARCH: 'Search',
        ADD_TO_CART: 'AddToCart',
        ADD_TO_WISHLIST: 'AddToWishlist',
        INITIATE_CHECKOUT: 'InitiateCheckout',
        ADD_PAYMENT_INFO: 'AddPaymentInfo',
        PURCHASE: 'Purchase',
        LEAD: 'Lead',
        COMPLETE_REGISTRATION: 'CompleteRegistration',
        CONTACT: 'Contact',
        CUSTOMIZE_PRODUCT: 'CustomizeProduct',
        DONATE: 'Donate',
        FIND_LOCATION: 'FindLocation',
        SCHEDULE: 'Schedule',
        START_TRIAL: 'StartTrial',
        SUBMIT_APPLICATION: 'SubmitApplication',
        SUBSCRIBE: 'Subscribe'
    },

    /**
     * Time thresholds (in milliseconds)
     */
    TIME_THRESHOLDS: {
        BOUNCE: 10000, // 10 seconds
        INACTIVITY: 30000, // 30 seconds
        SESSION_TIMEOUT: 1800000, // 30 minutes
        DATA_FRESHNESS: 7200000 // 2 hours
    },

    /**
     * Regular expressions for validation
     */
    REGEX: {
        CONTENT_ID: /^[a-z0-9_]+$/,
        PIXEL_ID: /^\d{15,16}$/,
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_DE: /^(\+49|0049|049|49|0)[1-9]\d{1,14}$/,
        DATE_DE: /^\d{2}\.\d{2}\.\d{4}$/
    },

    /**
     * Default configuration values
     */
    DEFAULTS: {
        SCROLL_DEPTHS: [25, 50, 75, 100],
        INACTIVITY_THRESHOLD: 30000,
        CHECK_INTERVAL: 1000,
        CONTENT_ID_FALLBACK: 'unknown_origin',
        MAX_CONTENT_ID_LENGTH: 30,
        DEBUG_MODE: false
    },

    /**
     * Error messages
     */
    ERROR_MESSAGES: {
        NO_CONSENT: 'Tracking blocked - no consent given',
        NO_PIXEL: 'Meta Pixel not initialized',
        INVALID_CONFIG: 'Invalid tracking configuration',
        STORAGE_ERROR: 'Error accessing browser storage',
        NETWORK_ERROR: 'Network error during tracking'
    },

    /**
     * Debug messages
     */
    DEBUG_MESSAGES: {
        INIT: 'Tracking initialized',
        CONSENT_CHECK: 'Checking consent status',
        EVENT_FIRED: 'Event fired',
        EVENT_BLOCKED: 'Event blocked',
        DATA_STORED: 'Data stored in session',
        DATA_LOADED: 'Data loaded from session'
    },

    /**
     * Content ID formatting rules
     */
    CONTENT_ID_RULES: {
        MAX_LENGTH: 30,
        SEPARATOR: '_',
        CASE: 'PascalCase',
        REMOVE_PATTERNS: [
            /\s*\(m\/w\/d\)/gi,
            /\s*\(w\/m\/d\)/gi,
            /\s*\(d\/w\/m\)/gi
        ],
        UMLAUT_MAP: {
            'ä': 'ae',
            'ö': 'oe',
            'ü': 'ue',
            'ß': 'ss',
            'Ä': 'ae',
            'Ö': 'oe',
            'Ü': 'ue'
        },
        CAPACITY_ABBREVIATIONS: {
            'vollzeit': 'voll',
            'teilzeit': 'teil',
            'minijob': 'mini',
            'praktikum': 'prakt',
            'ausbildung': 'ausb',
            'werkstudent': 'werk',
            'freelance': 'free'
        }
    },

    /**
     * URL parameter names
     */
    URL_PARAMS: {
        ORIGIN: 'origin',
        CONTENT_ID: 'contentId',
        POSITION_ID: 'positionId',
        REF: 'ref',
        REF_POSITION: 'ref_position',
        REF_ID: 'ref_id',
        UTM_SOURCE: 'utm_source',
        UTM_MEDIUM: 'utm_medium',
        UTM_CAMPAIGN: 'utm_campaign',
        UTM_TERM: 'utm_term',
        UTM_CONTENT: 'utm_content'
    },

    /**
     * Event priority levels
     */
    EVENT_PRIORITY: {
        CRITICAL: 1, // Always track if any consent
        HIGH: 2,     // Track with marketing consent
        MEDIUM: 3,   // Track with analytics consent
        LOW: 4       // Track only with full consent
    },

    /**
     * Consent categories
     */
    CONSENT_CATEGORIES: {
        ESSENTIAL: 'essential',
        ANALYTICS: 'analytics',
        MARKETING: 'marketing'
    },

    /**
     * Browser storage types
     */
    STORAGE_TYPES: {
        LOCAL: 'localStorage',
        SESSION: 'sessionStorage',
        COOKIE: 'cookie'
    },

    /**
     * Tracking modes
     */
    TRACKING_MODES: {
        FULL: 'full',
        ANALYTICS_ONLY: 'analytics_only',
        ESSENTIAL_ONLY: 'essential_only',
        DEBUG: 'debug',
        OFF: 'off'
    },

    /**
     * Get prefix for current step
     */
    getPrefix(step) {
        return this.PREFIXES[step] || '';
    },

    /**
     * Get event name for current step
     */
    getStepEvent(step) {
        return this.STEP_EVENTS[step] || null;
    },

    /**
     * Format content ID according to rules
     */
    formatContentId(origin) {
        if (!origin || origin === this.DEFAULTS.CONTENT_ID_FALLBACK) {
            return 'UnknownOrigin';
        }

        // Apply formatting rules
        let formatted = origin.toLowerCase();
        
        // Remove special patterns
        this.CONTENT_ID_RULES.REMOVE_PATTERNS.forEach(pattern => {
            formatted = formatted.replace(pattern, '');
        });
        
        // Replace umlauts
        Object.entries(this.CONTENT_ID_RULES.UMLAUT_MAP).forEach(([umlaut, replacement]) => {
            const regex = new RegExp(umlaut, 'g');
            formatted = formatted.replace(regex, replacement);
        });
        
        // Convert to PascalCase
        formatted = formatted
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        
        // Ensure max length
        if (formatted.length > this.CONTENT_ID_RULES.MAX_LENGTH) {
            formatted = formatted.substring(0, this.CONTENT_ID_RULES.MAX_LENGTH);
        }
        
        return formatted;
    },

    /**
     * Check if event should be tracked based on consent
     */
    shouldTrackEvent(eventCategory, consentState) {
        // PageView and content tracking need at least marketing consent
        if (eventCategory === this.EVENT_CATEGORIES.PAGE_VIEW || 
            eventCategory === this.EVENT_CATEGORIES.CONTENT ||
            eventCategory === this.EVENT_CATEGORIES.CONVERSION) {
            return consentState.marketing === true;
        }
        
        // Analytics events need analytics consent
        if (eventCategory === this.EVENT_CATEGORIES.SCROLL ||
            eventCategory === this.EVENT_CATEGORIES.DWELL_TIME ||
            eventCategory === this.EVENT_CATEGORIES.DEVICE ||
            eventCategory === this.EVENT_CATEGORIES.BROWSER ||
            eventCategory === this.EVENT_CATEGORIES.ACTIVITY ||
            eventCategory === this.EVENT_CATEGORIES.BOUNCE) {
            return consentState.analytics === true;
        }
        
        return false;
    },

    /**
     * Get all active tracking parameters based on config
     */
    getActiveParameters(config) {
        const active = [];
        
        if (config.tracking) {
            if (config.tracking.scrollDepth?.enabled) active.push('scrollDepth');
            if (config.tracking.browserType?.enabled) active.push('browserType');
            if (config.tracking.deviceType?.enabled) active.push('deviceType');
            if (config.tracking.activityStatus?.enabled) active.push('activityStatus');
            if (config.tracking.dwellTime?.enabled) active.push('dwellTime');
        }
        
        // Always active
        active.push('pageView', 'sessionStorage', 'urlParameters');
        
        return active;
    },

    /**
     * Validate tracking configuration
     */
    validateConfig(config) {
        const errors = [];
        
        if (!config.funnelStep) {
            errors.push('funnelStep is required');
        } else if (!Object.keys(this.PREFIXES).includes(config.funnelStep)) {
            errors.push(`Invalid funnelStep: ${config.funnelStep}`);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
};