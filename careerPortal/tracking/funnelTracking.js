/**
 * Funnel Tracking Module
 * Comprehensive tracking system for career portal with cookie consent integration
 * Location: careerPortal/tracking/funnelTracking.js
 */

window.FunnelTracking = class FunnelTracking {
    constructor(config) {
        this.config = this.mergeConfig(config);
        this.constants = window.TrackingConstants || this.getDefaultConstants();
        this.initialized = false;
        this.trackedEvents = new Set();
        this.sessionData = this.loadSessionData();
        
        // Initialize tracking based on config and consent
        this.init();
    }

    /**
     * Get default constants if TrackingConstants not loaded
     */
    getDefaultConstants() {
        return {
            PREFIXES: {
                Landing: 'LP',
                Formular: 'FB',
                Ausschluss: 'UQ',
                Danke: 'QA'
            },
            STEP_EVENTS: {
                Landing: 'Landingpage',
                Formular: 'ViewContent',
                Ausschluss: 'Unqualifiziert',
                Danke: 'CompleteRegistration'
            },
            SCROLL_DEPTHS: [25, 50, 75, 100],
            DWELL_CATEGORIES: [
                { name: 'VeryShortInteraction0-10Sek', min: 0, max: 10 },
                { name: 'ShortInteraction10-30Sek', min: 10, max: 30 },
                { name: 'MiddleInteraction30-120Sek', min: 30, max: 120 },
                { name: 'LongInteraction120-240Sek', min: 120, max: 240 },
                { name: 'ExtendedInteraction240SekAndMore', min: 240, max: Infinity }
            ],
            STORAGE_KEYS: {
                origin: 'origin',
                contentId: 'contentId',
                positionData: 'selectedPosition'
            }
        };
    }

    /**
     * Merge user config with defaults
     */
    mergeConfig(userConfig) {
        const defaults = {
            funnelStep: 'Landing', // Landing, Formular, Ausschluss, Danke
            tracking: {
                scrollDepth: {
                    enabled: true,
                    depths: [25, 50, 75, 100]
                },
                browserType: {
                    enabled: true
                },
                deviceType: {
                    enabled: true
                },
                activityStatus: {
                    enabled: true,
                    inactivityThreshold: 30000 // 30 seconds
                },
                dwellTime: {
                    enabled: true,
                    checkInterval: 1000 // Check every second
                }
            },
            contentId: {
                autoGenerate: true,
                fallback: 'unknown_origin'
            },
            debug: false
        };

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
     * Initialize tracking
     */
    init() {
        if (this.initialized) return;

        this.log('Initializing funnel tracking for step:', this.config.funnelStep);

        // Setup content ID and origin tracking (always on)
        this.setupContentTracking();

        // Fire PageView event (always on if consent given)
        this.firePageView();

        // Fire step-specific event
        this.fireStepEvent();

        // Initialize optional tracking based on config and consent
        if (this.hasAnalyticsConsent()) {
            if (this.config.tracking.scrollDepth.enabled) {
                this.setupScrollTracking();
            }

            if (this.config.tracking.browserType.enabled) {
                this.trackBrowserType();
            }

            if (this.config.tracking.deviceType.enabled) {
                this.trackDeviceType();
            }

            if (this.config.tracking.activityStatus.enabled || this.config.tracking.dwellTime.enabled) {
                this.setupDwellTimeTracking();
            }
        }

        // Listen for consent changes
        this.listenForConsentChanges();

        this.initialized = true;
        this.log('Funnel tracking initialized');
    }

    /**
     * Setup content ID and origin tracking
     */
    setupContentTracking() {
        const origin = this.getOrigin();
        const contentId = this.getContentId();

        this.log('Content tracking setup:', { origin, contentId });

        // Store in session for next steps
        if (contentId && contentId !== this.config.contentId.fallback) {
            this.sessionData.contentId = contentId;
            this.sessionData.origin = origin;
            this.saveSessionData();

            // Fire content ID event if we have valid data
            if (this.hasMarketingConsent() || this.hasAnalyticsConsent()) {
                this.fireContentIdEvent(contentId);
            }
        }
    }

    /**
     * Get origin from URL or session
     */
    getOrigin() {
        // 1. Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        let origin = urlParams.get('origin') || urlParams.get('contentId');

        // 2. Check session storage
        if (!origin) {
            origin = sessionStorage.getItem(this.constants.STORAGE_KEYS.origin);
        }

        // 3. Check position data in session
        if (!origin) {
            const positionData = this.getPositionData();
            if (positionData) {
                origin = positionData.contentId;
            }
        }

        // 4. Use fallback
        if (!origin) {
            origin = this.config.contentId.fallback;
        }

        // Store in session for consistency
        if (origin && origin !== this.config.contentId.fallback) {
            sessionStorage.setItem(this.constants.STORAGE_KEYS.origin, origin);
        }

        return origin;
    }

    /**
     * Get content ID (formatted origin)
     */
    getContentId() {
        const origin = this.getOrigin();
        if (!origin || origin === this.config.contentId.fallback) {
            return this.config.contentId.fallback;
        }

        // Format: position_region_capacity -> PositionRegionCapacity
        return this.formatContentId(origin);
    }

    /**
     * Format content ID to PascalCase
     */
    formatContentId(origin) {
        if (!origin || origin === this.config.contentId.fallback) return 'UnknownOrigin';

        return origin
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }

    /**
     * Get position data from session or URL
     */
    getPositionData() {
        // 1. Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const positionId = urlParams.get('positionId');
        const contentId = urlParams.get('contentId');

        if (positionId || contentId) {
            return {
                id: positionId,
                contentId: contentId || positionId
            };
        }

        // 2. Check session storage
        try {
            const stored = sessionStorage.getItem(this.constants.STORAGE_KEYS.positionData);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            this.log('Error reading position data:', e);
        }

        // 3. Check global positions registry
        if (window.POSITIONS_REGISTRY && positionId) {
            return window.POSITIONS_REGISTRY[positionId];
        }

        return null;
    }

    /**
     * Fire PageView event (always if marketing consent)
     */
    firePageView() {
        if (!this.hasMarketingConsent()) {
            this.log('PageView not fired - no marketing consent');
            return;
        }

        if (window.fbq) {
            fbq('track', 'PageView');
            this.log('PageView event fired');
        }
    }

    /**
     * Fire step-specific event
     */
    fireStepEvent() {
        if (!this.hasMarketingConsent()) {
            this.log('Step event not fired - no marketing consent');
            return;
        }

        const eventName = this.constants.STEP_EVENTS[this.config.funnelStep];
        if (!eventName) {
            this.log('No step event defined for:', this.config.funnelStep);
            return;
        }

        if (window.fbq) {
            if (eventName === 'Landingpage' || eventName === 'Unqualifiziert') {
                // Custom events
                fbq('trackCustom', eventName);
            } else {
                // Standard events
                fbq('track', eventName);
            }
            this.log(`Step event fired: ${eventName}`);
        }
    }

    /**
     * Fire content ID based event
     */
    fireContentIdEvent(contentId) {
        const prefix = this.constants.PREFIXES[this.config.funnelStep];
        if (!prefix) {
            this.log('No prefix defined for step:', this.config.funnelStep);
            return;
        }

        const eventName = `${prefix}_${contentId}`;

        // Prevent duplicate events
        if (this.trackedEvents.has(eventName)) {
            this.log('Event already tracked:', eventName);
            return;
        }

        if (window.fbq) {
            fbq('trackCustom', eventName);
            this.trackedEvents.add(eventName);
            this.log(`Content ID event fired: ${eventName}`);
        }
    }

    /**
     * Setup scroll depth tracking
     */
    setupScrollTracking() {
        const depths = this.config.tracking.scrollDepth.depths;
        const triggered = {};
        const prefix = this.constants.PREFIXES[this.config.funnelStep];

        const trackScroll = () => {
            if (!this.hasAnalyticsConsent()) return;

            const scrollPosition = window.scrollY + window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;
            const percentageScrolled = (scrollPosition / totalHeight) * 100;

            depths.forEach(depth => {
                if (percentageScrolled >= depth && !triggered[depth]) {
                    triggered[depth] = true;
                    const eventName = `${prefix}_ScrolledTo${depth}Percent`;
                    
                    if (window.fbq) {
                        fbq('trackCustom', eventName);
                        this.log(`Scroll depth event: ${eventName}`);
                    }
                }
            });
        };

        // Debounced scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScroll, 150);
        });

        // Check initial scroll position
        trackScroll();

        this.log('Scroll tracking initialized');
    }

    /**
     * Track browser type
     */
    trackBrowserType() {
        if (!this.hasAnalyticsConsent()) return;

        const prefix = this.constants.PREFIXES[this.config.funnelStep];
        const browserType = this.detectBrowser();
        const eventName = `${prefix}_Browser${browserType}`;

        if (window.fbq) {
            fbq('trackCustom', eventName);
            this.log(`Browser type event: ${eventName}`);
        }
    }

    /**
     * Detect browser type
     */
    detectBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        
        if (ua.indexOf("chrome") > -1 && ua.indexOf("edg") === -1) {
            return "GoogleChrome";
        } else if (ua.indexOf("firefox") > -1) {
            return "MozillaFirefox";
        } else if (ua.indexOf("safari") > -1 && ua.indexOf("chrome") === -1) {
            return "AppleSafari";
        } else if (ua.indexOf("edg") > -1) {
            return "MicrosoftEdge";
        } else if (ua.indexOf("opr") > -1 || ua.indexOf("opera") > -1) {
            return "Opera";
        }
        
        return "Unknown";
    }

    /**
     * Track device type
     */
    trackDeviceType() {
        if (!this.hasAnalyticsConsent()) return;

        const prefix = this.constants.PREFIXES[this.config.funnelStep];
        const deviceType = this.detectDevice();
        const eventName = `${prefix}_${deviceType}`;

        if (window.fbq) {
            fbq('trackCustom', eventName);
            this.log(`Device type event: ${eventName}`);
        }
    }

    /**
     * Detect device type
     */
    detectDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const screenWidth = window.innerWidth;

        if (/android/i.test(userAgent)) {
            return /mobile/i.test(userAgent) ? "MobileAndroidPhone" : "MobileAndroidTablet";
        } else if (/iPad/i.test(userAgent)) {
            return "MobileAppleiPad";
        } else if (/iPhone/i.test(userAgent)) {
            return "MobileAppleiPhone";
        } else if (/Win/.test(userAgent)) {
            return (navigator.maxTouchPoints > 0) ? "DesktopLaptopWindows" : "DesktopComputerWindows";
        } else if (/Mac/.test(userAgent)) {
            return (navigator.maxTouchPoints > 0) ? "DesktopComputerMacOS" : "DesktopLaptopMacOS";
        } else if (/Linux/.test(userAgent)) {
            return (screenWidth < 1400) ? "DesktopLaptopLinux" : "DesktopComputerLinux";
        }

        return "UnknownDevice";
    }

    /**
     * Setup dwell time and activity tracking
     */
    setupDwellTimeTracking() {
        const startTime = Date.now();
        const prefix = this.constants.PREFIXES[this.config.funnelStep];
        let interactionCount = 0;
        let isTracked = false;
        let milestoneLogged = {};
        let lastActivityTime = Date.now();

        // Track user interactions
        const userInteraction = () => {
            interactionCount++;
            lastActivityTime = Date.now();
        };

        // Add interaction listeners
        ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'touchmove', 'touchend'].forEach(event => {
            document.addEventListener(event, userInteraction);
        });

        // Check milestones
        const checkMilestones = () => {
            if (!this.hasAnalyticsConsent()) return;

            const timeSpent = (Date.now() - startTime) / 1000;
            const timeSinceLastActivity = Date.now() - lastActivityTime;
            const activityStatus = timeSinceLastActivity < this.config.tracking.activityStatus.inactivityThreshold ? "Act" : "Inact";

            // Check dwell time categories
            if (this.config.tracking.dwellTime.enabled) {
                this.constants.DWELL_CATEGORIES.forEach(category => {
                    if (timeSpent >= category.min && timeSpent < category.max && !milestoneLogged[category.name]) {
                        const eventName = `${prefix}_${category.name}_${activityStatus}`;
                        
                        if (window.fbq) {
                            fbq('trackCustom', eventName);
                            this.log(`Dwell time event: ${eventName}`);
                        }
                        
                        milestoneLogged[category.name] = true;
                    }
                });
            }

            // Continue checking if not all milestones logged
            if (!isTracked) {
                setTimeout(checkMilestones, this.config.tracking.dwellTime.checkInterval);
            }
        };

        // Send final tracking on page unload
        const sendFinalTracking = () => {
            if (isTracked || !this.hasAnalyticsConsent()) return;
            isTracked = true;

            const timeSpent = (Date.now() - startTime) / 1000;
            const timeSinceLastActivity = Date.now() - lastActivityTime;
            const activityStatus = timeSinceLastActivity < this.config.tracking.activityStatus.inactivityThreshold ? "Act" : "Inact";

            // Special bounce event for very short visits
            if (timeSpent < 10 && activityStatus === "Inact") {
                const eventName = `${prefix}_Bounce0-10Sek_Inact`;
                if (window.fbq) {
                    fbq('trackCustom', eventName);
                    this.log(`Bounce event: ${eventName}`);
                }
            }
        };

        window.addEventListener('beforeunload', sendFinalTracking);

        // Start milestone checking
        setTimeout(checkMilestones, this.config.tracking.dwellTime.checkInterval);

        this.log('Dwell time tracking initialized');
    }

    /**
     * Check for analytics consent
     */
    hasAnalyticsConsent() {
        // Check localStorage directly
        const analyticsConsent = localStorage.getItem('analyticsConsent') === 'true' ||
                                  localStorage.getItem('cookie_consent_analytics') === 'true';
        
        // Also check if cookie banner instance exists
        if (window.CookieBanner && typeof window.CookieBanner.hasConsent === 'function') {
            return window.CookieBanner.hasConsent('analytics');
        }

        return analyticsConsent;
    }

    /**
     * Check for marketing consent
     */
    hasMarketingConsent() {
        // Check localStorage directly
        const marketingConsent = localStorage.getItem('marketingConsent') === 'true' ||
                                  localStorage.getItem('cookie_consent_marketing') === 'true';
        
        // Also check if cookie banner instance exists
        if (window.CookieBanner && typeof window.CookieBanner.hasConsent === 'function') {
            return window.CookieBanner.hasConsent('marketing');
        }

        return marketingConsent;
    }

    /**
     * Listen for consent changes
     */
    listenForConsentChanges() {
        window.addEventListener('cookieConsentUpdated', (event) => {
            this.log('Consent updated:', event.detail);
            
            // Reinitialize tracking based on new consent
            if (event.detail.analytics && !this.initialized) {
                this.init();
            }
        });

        window.addEventListener('consentUpdated', () => {
            this.log('Consent updated (legacy event)');
            
            // Check and reinitialize if needed
            if (this.hasAnalyticsConsent() && !this.initialized) {
                this.init();
            }
        });
    }

    /**
     * Load session data
     */
    loadSessionData() {
        const data = {};
        
        try {
            // Load content ID
            data.contentId = sessionStorage.getItem(this.constants.STORAGE_KEYS.contentId);
            data.origin = sessionStorage.getItem(this.constants.STORAGE_KEYS.origin);
            
            // Load position data
            const positionData = sessionStorage.getItem(this.constants.STORAGE_KEYS.positionData);
            if (positionData) {
                data.positionData = JSON.parse(positionData);
            }
        } catch (e) {
            this.log('Error loading session data:', e);
        }

        return data;
    }

    /**
     * Save session data
     */
    saveSessionData() {
        try {
            if (this.sessionData.contentId) {
                sessionStorage.setItem(this.constants.STORAGE_KEYS.contentId, this.sessionData.contentId);
            }
            if (this.sessionData.origin) {
                sessionStorage.setItem(this.constants.STORAGE_KEYS.origin, this.sessionData.origin);
            }
            if (this.sessionData.positionData) {
                sessionStorage.setItem(this.constants.STORAGE_KEYS.positionData, JSON.stringify(this.sessionData.positionData));
            }
        } catch (e) {
            this.log('Error saving session data:', e);
        }
    }

    /**
     * Update position data (public method for other modules)
     */
    updatePositionData(positionData) {
        this.sessionData.positionData = positionData;
        
        if (positionData.contentId) {
            this.sessionData.contentId = positionData.contentId;
            this.sessionData.origin = positionData.contentId;
        }
        
        this.saveSessionData();
        this.log('Position data updated:', positionData);
    }

    /**
     * Pass data to next step via URL
     */
    prepareNextStepUrl(targetUrl) {
        try {
            const url = new URL(targetUrl, window.location.origin);
            
            // Add content tracking parameters
            if (this.sessionData.contentId) {
                url.searchParams.set('contentId', this.sessionData.contentId);
            }
            if (this.sessionData.origin) {
                url.searchParams.set('origin', this.sessionData.origin);
            }
            if (this.sessionData.positionData) {
                url.searchParams.set('positionId', this.sessionData.positionData.id);
            }
            
            return url.toString();
        } catch (e) {
            this.log('Error preparing next step URL:', e);
            return targetUrl;
        }
    }

    /**
     * Manual event trigger (public method)
     */
    trackEvent(eventName, parameters) {
        if (!parameters) parameters = {};
        
        // Check consent based on event type
        const requiresMarketing = eventName.includes('Content') || eventName.includes('Registration');
        if (requiresMarketing && !this.hasMarketingConsent()) {
            this.log(`Event ${eventName} not tracked - no marketing consent`);
            return;
        }
        
        if (!requiresMarketing && !this.hasAnalyticsConsent()) {
            this.log(`Event ${eventName} not tracked - no analytics consent`);
            return;
        }

        if (window.fbq) {
            fbq('trackCustom', eventName, parameters);
            this.log(`Manual event tracked: ${eventName}`, parameters);
        }
    }

    /**
     * Get tracking status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            config: this.config,
            sessionData: this.sessionData,
            hasAnalyticsConsent: this.hasAnalyticsConsent(),
            hasMarketingConsent: this.hasMarketingConsent(),
            trackedEvents: Array.from(this.trackedEvents)
        };
    }

    /**
     * Debug logging
     */
    log() {
        if (this.config.debug) {
            const args = Array.prototype.slice.call(arguments);
            args.unshift('[FunnelTracking]');
            console.log.apply(console, args);
        }
    }

    /**
     * Destroy tracking
     */
    destroy() {
        this.initialized = false;
        this.trackedEvents.clear();
        this.log('Tracking destroyed');
    }
}

// Auto-initialize if config exists
if (window.TRACKING_CONFIG) {
    window.FunnelTracker = new window.FunnelTracking(window.TRACKING_CONFIG);
}