/**
 * Career Portal Loader - Main Entry Point
 * Dynamically loads CSS and JavaScript modules and initializes sections
 * Now includes Cookie Banner support
 */

class CareerPortalLoader {
    constructor() {
        this.baseURL = 'https://raw.githubusercontent.com/niemeyerdigital/careerportal/main/careerPortal/';
        this.loadedModules = new Map();
        this.loadedStyles = new Map();
        this.initializationQueue = [];
        this.cookieBannerLoaded = false;
    }

    /**
     * Load CSS file by fetching as text and injecting as style element
     */
    async loadCSS(path) {
        const url = this.baseURL + path;
        
        // Check if already loaded
        if (this.loadedStyles.has(path)) {
            console.log(`✅ CSS already loaded: ${path}`);
            return true;
        }
        
        try {
            // Fetch CSS as text
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cssText = await response.text();
            
            // Create and inject style element
            const style = document.createElement('style');
            style.textContent = cssText;
            style.setAttribute('data-source', path);
            document.head.appendChild(style);
            
            this.loadedStyles.set(path, true);
            console.log(`✅ CSS loaded: ${path}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to load CSS: ${path}`, error);
            return false;
        }
    }

    /**
     * Load a JavaScript module dynamically
     */
    async loadModule(path) {
        if (this.loadedModules.has(path)) {
            return this.loadedModules.get(path);
        }

        try {
            const response = await fetch(this.baseURL + path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const code = await response.text();
            
            // Create a script element and execute it
            const script = document.createElement('script');
            script.textContent = code;
            script.setAttribute('data-source', path);
            document.head.appendChild(script);
            
            this.loadedModules.set(path, true);
            console.log(`✅ Module loaded: ${path}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to load module: ${path}`, error);
            return false;
        }
    }

    /**
     * Load cookie banner module
     */
    async loadCookieBanner() {
        if (this.cookieBannerLoaded) {
            console.log('✅ Cookie banner already loaded');
            return true;
        }

        try {
            console.log('🍪 Loading cookie banner module...');
            
            // Load cookie banner CSS
            await this.loadCSS('styles/cookieBanner.css');
            
            // Load cookie banner JS
            await this.loadModule('cookieBanner.js');
            
            // Initialize if config exists
            if (window.COOKIE_BANNER_CONFIG && window.CookieBannerModule) {
                window.CookieBanner = new window.CookieBannerModule(window.COOKIE_BANNER_CONFIG);
                console.log('🎉 Cookie banner initialized successfully!');
            } else {
                console.log('ℹ️ Cookie banner module loaded, waiting for config');
            }
            
            this.cookieBannerLoaded = true;
            return true;
        } catch (error) {
            console.error('❌ Failed to load cookie banner:', error);
            return false;
        }
    }

    /**
     * Load all required CSS files
     */
    async loadAllCSS() {
        const cssFiles = [
            'styles/components/buttons.css',
            'styles/sections/welcome.css',
            'styles/sections/mehrErfahren.css',
            'styles/sections/process.css',
            'styles/sections/positions.css',
            'styles/sections/footer.css'
        ];
        
        console.log('📦 Loading CSS files...');
        for (const cssFile of cssFiles) {
            await this.loadCSS(cssFile);
        }
        console.log('✅ All CSS files loaded');
    }

    /**
     * Initialize a specific section
     */
    async initializeSection(sectionType, config, containerId) {
        try {
            // Load base section first
            await this.loadModule('sections/baseSec.js');
            
            // Load required UI components
            await Promise.all([
                this.loadModule('ui/components/videoWistia.js'),
                this.loadModule('ui/components/buttonManager.js'),
                this.loadModule('ui/components/badgeComponent.js'),
                this.loadModule('ui/animations/slideUp.js'),
                this.loadModule('ui/animations/animationController.js')
            ]);

            // Load config validator
            await this.loadModule('configValidator.js');

            // Load section-specific module
            await this.loadModule(`sections/${sectionType}Section.js`);

            // Validate configuration
            if (window.ConfigValidator) {
                const validatedConfig = window.ConfigValidator.validate(config, sectionType);
                if (!validatedConfig.isValid) {
                    console.error(`Invalid config for ${sectionType}:`, validatedConfig.errors);
                    return false;
                }
            }

            // Initialize the section
            const sectionClass = window[`${this.capitalize(sectionType)}Section`];
            if (sectionClass) {
                new sectionClass(config, containerId);
                console.log(`🎉 ${this.capitalize(sectionType)} section initialized successfully!`);
                return true;
            } else {
                console.error(`Section class ${sectionType}Section not found`);
                return false;
            }

        } catch (error) {
            console.error(`Failed to initialize ${sectionType} section:`, error);
            return false;
        }
    }

    /**
     * Queue section for initialization (useful when DOM isn't ready)
     */
    queueSection(sectionType, config, containerId) {
        this.initializationQueue.push({ sectionType, config, containerId });
    }

    /**
     * Process all queued sections
     */
    async processQueue() {
        for (const item of this.initializationQueue) {
            await this.initializeSection(item.sectionType, item.config, item.containerId);
        }
        this.initializationQueue = [];
    }

    /**
     * Auto-initialize sections based on data attributes
     */
    async autoInitialize() {
        // First check and load cookie banner if config exists
        if (window.COOKIE_BANNER_CONFIG) {
            await this.loadCookieBanner();
        }
        
        // Then load all CSS
        await this.loadAllCSS();
        
        // Then find and initialize sections
        const sections = document.querySelectorAll('[data-career-section]');
        
        for (const section of sections) {
            const sectionType = section.getAttribute('data-career-section');
            const configName = section.getAttribute('data-config') || `${sectionType.toUpperCase()}_CONFIG`;
            const config = window[configName];

            if (config) {
                await this.initializeSection(sectionType, config, section.id);
            } else {
                console.warn(`Config ${configName} not found for section ${sectionType}`);
            }
        }
    }

    /**
     * Utility function to capitalize first letter
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Set custom base URL for loading modules
     */
    setBaseURL(url) {
        this.baseURL = url.endsWith('/') ? url : url + '/';
    }

    /**
     * Check if root variables are available
     */
    checkRootVariables() {
        const testVar = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        if (!testVar) {
            console.warn('⚠️ Root variables not found. Ensure they are defined in the funnel header.');
            return false;
        }
        console.log('✅ Root variables detected');
        return true;
    }
}

// Create global loader instance
window.CareerPortalLoader = new CareerPortalLoader();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.CareerPortalLoader.autoInitialize();
    });
} else {
    // DOM is already ready
    window.CareerPortalLoader.autoInitialize();
}

// ====================================================================
// COOKIE BANNER STANDALONE LOADER (FOR FUNNEL HEADER)
// ====================================================================

(function() {
    const GITHUB_USERNAME = 'niemeyerdigital';
    const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/careerportal/main/careerPortal/`;
    
    // Only load cookie banner if config exists and loader hasn't already handled it
    if (window.COOKIE_BANNER_CONFIG && !window.CareerPortalLoader?.cookieBannerLoaded) {
        console.log('🍪 Loading Cookie Banner (standalone)...');
        
        async function loadCookieBanner() {
            try {
                // Fetch and inject CSS
                const cssResponse = await fetch(BASE_URL + 'styles/cookieBanner.css');
                if (!cssResponse.ok) throw new Error('Failed to load cookie banner CSS');
                const cssText = await cssResponse.text();
                
                // Check if already loaded
                if (!document.querySelector('style[data-source="cookieBanner.css"]')) {
                    const style = document.createElement('style');
                    style.textContent = cssText;
                    style.setAttribute('data-source', 'cookieBanner.css');
                    document.head.appendChild(style);
                    console.log('✅ Cookie banner CSS loaded');
                }
                
                // Fetch and execute JS
                const jsResponse = await fetch(BASE_URL + 'cookieBanner.js');
                if (!jsResponse.ok) throw new Error('Failed to load cookie banner JS');
                const jsCode = await jsResponse.text();
                
                // Execute the code
                eval(jsCode);
                console.log('✅ Cookie banner JS loaded');
                
                // Initialize with config
                if (window.CookieBannerModule && !window.CookieBanner) {
                    window.CookieBanner = new window.CookieBannerModule(window.COOKIE_BANNER_CONFIG);
                    console.log('🎉 Cookie banner initialized successfully!');
                }
                
            } catch (error) {
                console.error('❌ Failed to load cookie banner:', error);
            }
        }
        
        // Load immediately for GDPR compliance
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadCookieBanner);
        } else {
            loadCookieBanner();
        }
    }
})();

// ====================================================================
// MANUAL INITIALIZATION FOR CLICKFUNNELS (CSP WORKAROUND)
// ====================================================================

(function() {
    const GITHUB_USERNAME = 'niemeyerdigital';
    const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/careerportal/main/careerPortal/`;
    
    console.log('🚀 Loading Career Portal via fetch method...');
    
    // Helper function to load CSS as text and inject as style
    async function loadCSSAsStyle(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cssText = await response.text();
            
            // Check if style already exists
            if (document.querySelector(`style[data-source="${filename}"]`)) {
                console.log(`✅ CSS already loaded: ${filename}`);
                return true;
            }
            
            const style = document.createElement('style');
            style.textContent = cssText;
            style.setAttribute('data-source', filename);
            document.head.appendChild(style);
            console.log(`✅ CSS loaded: ${filename}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to load CSS: ${filename}`, error);
            return false;
        }
    }
    
    // Load modules sequentially via fetch to avoid CSP issues
    async function loadCareerPortal() {
        try {
            // Check for root variables first
            const rootVarsExist = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
            if (!rootVarsExist) {
                console.warn('⚠️ Root variables not detected. Waiting 100ms and retrying...');
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // 0. Load Cookie Banner first if config exists
            if (window.COOKIE_BANNER_CONFIG && !window.CookieBanner) {
                console.log('🍪 Loading cookie banner...');
                await loadCSSAsStyle(BASE_URL + 'styles/cookieBanner.css', 'cookieBanner.css');
                
                const cookieBannerResponse = await fetch(BASE_URL + 'cookieBanner.js');
                const cookieBannerCode = await cookieBannerResponse.text();
                eval(cookieBannerCode);
                
                if (window.CookieBannerModule) {
                    window.CookieBanner = new window.CookieBannerModule(window.COOKIE_BANNER_CONFIG);
                    console.log('🎉 Cookie banner initialized!');
                }
            }
            
            // 1. Load CSS files by fetching as text and injecting as style elements
            const cssFiles = [
                'styles/components/buttons.css',
                'styles/sections/welcome.css',
                'styles/sections/mehrErfahren.css',
                'styles/sections/process.css',
                'styles/sections/positions.css',
                'styles/sections/footer.css'
            ];
            
            console.log('📦 Loading CSS files...');
            for (const cssFile of cssFiles) {
                await loadCSSAsStyle(BASE_URL + cssFile, cssFile);
            }
            console.log('✅ All CSS files loaded');
            
            // 2. Load and execute loader.js (already loaded, so skip)
            console.log('✅ Loader already loaded');
            
            // Set the base URL
            if (window.CareerPortalLoader) {
                window.CareerPortalLoader.setBaseURL(BASE_URL);
                console.log('✅ Base URL set to:', BASE_URL);
            }
            
            // 3. Load and execute config validator
            const validatorResponse = await fetch(BASE_URL + 'configValidator.js');
            const validatorCode = await validatorResponse.text();
            eval(validatorCode);
            console.log('✅ Config validator loaded');
            
            // 4. Load base section
            const baseSecResponse = await fetch(BASE_URL + 'sections/baseSec.js');
            const baseSecCode = await baseSecResponse.text();
            eval(baseSecCode);
            console.log('✅ Base section loaded');
            
            // 5. Load UI components
            const components = [
                'ui/components/videoWistia.js',
                'ui/components/buttonManager.js',
                'ui/components/badgeComponent.js',
                'ui/animations/slideUp.js',
                'ui/animations/animationController.js'
            ];
            
            for (const component of components) {
                const response = await fetch(BASE_URL + component);
                const code = await response.text();
                eval(code);
                console.log('✅ Loaded:', component);
            }
            
            // 6. Load all section modules
            const sections = ['welcome', 'mehrErfahren', 'process', 'footer', 'positions'];
            
            for (const section of sections) {
                const response = await fetch(BASE_URL + `sections/${section}Section.js`);
                const code = await response.text();
                eval(code);
                console.log(`✅ ${section} section loaded`);
            }
            
            // 7. Initialize sections that exist on the page
            if (window.WelcomeSection && document.getElementById('welcome-section') && window.WELCOME_CONFIG) {
                new window.WelcomeSection(window.WELCOME_CONFIG, 'welcome-section');
                console.log('🎉 Welcome section initialized successfully!');
            }
            
            if (window.MehrErfahrenSection && document.getElementById('mehr-erfahren-section') && window.MEHR_ERFAHREN_CONFIG) {
                new window.MehrErfahrenSection(window.MEHR_ERFAHREN_CONFIG, 'mehr-erfahren-section');
                console.log('🎉 Mehr Erfahren section initialized successfully!');
            }
            
            if (window.ProcessSection && document.getElementById('process-section') && window.PROCESS_CONFIG) {
                new window.ProcessSection(window.PROCESS_CONFIG, 'process-section');
                console.log('🎉 Process section initialized successfully!');
            }
            
            if (window.FooterSection && document.getElementById('footer-section') && window.FOOTER_CONFIG) {
                new window.FooterSection(window.FOOTER_CONFIG, 'footer-section');
                console.log('🎉 Footer section initialized successfully!');
            }
            
            if (window.PositionsSection && document.getElementById('positions-section') && window.POSITIONS_CONFIG) {
                new window.PositionsSection(window.POSITIONS_CONFIG, 'positions-section');
                console.log('🎉 Positions section initialized successfully!');
            }
            
        } catch (error) {
            console.error('❌ Failed to load Career Portal:', error);
        }
    }
    
    // Start loading when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCareerPortal);
    } else {
        loadCareerPortal();
    }
})();

// ====================================================================
// DEBUG HELPER FUNCTIONS
// ====================================================================

// Function to check if all components loaded correctly
window.debugCareerPortal = function() {
    const components = [
        'CareerPortalLoader',
        'ConfigValidator', 
        'BaseSec',
        'WelcomeSection',
        'MehrErfahrenSection',
        'ProcessSection',
        'FooterSection',
        'PositionsSection',
        'VideoWistia',
        'ButtonManager',
        'BadgeComponent',
        'SlideUpAnimation',
        'AnimationController',
        'CookieBannerModule'
    ];
    
    console.log('=== Career Portal Debug Info ===');
    components.forEach(component => {
        const loaded = !!window[component];
        console.log(`${component}: ${loaded ? '✅ Loaded' : '❌ Missing'}`);
    });
    
    // Check CSS
    const cssStyles = document.querySelectorAll('style[data-source]');
    console.log(`CSS Styles Loaded: ${cssStyles.length} files`);
    cssStyles.forEach(style => {
        console.log(`  - ${style.getAttribute('data-source')}`);
    });
    
    // Check root variables
    const rootVars = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    console.log(`Root Variables: ${rootVars ? '✅ Available' : '❌ Missing'}`);
    
    // Check cookie banner
    console.log(`Cookie Banner Instance: ${window.CookieBanner ? '✅ Initialized' : '❌ Not initialized'}`);
    if (window.CookieBanner) {
        console.log('Cookie Banner Status:', window.CookieBanner.getStatus());
    }
    
    // Check sections
    const welcomeElement = document.getElementById('welcome-section');
    const mehrErfahrenElement = document.getElementById('mehr-erfahren-section');
    const processElement = document.getElementById('process-section');
    const footerElement = document.getElementById('footer-section');
    const positionsElement = document.getElementById('positions-section');
    
    console.log(`Welcome Section Element: ${welcomeElement ? '✅ Found' : '❌ Missing'}`);
    console.log(`Mehr Erfahren Section Element: ${mehrErfahrenElement ? '✅ Found' : '❌ Missing'}`);
    console.log(`Process Section Element: ${processElement ? '✅ Found' : '❌ Missing'}`);
    console.log(`Footer Section Element: ${footerElement ? '✅ Found' : '❌ Missing'}`);
    console.log(`Positions Section Element: ${positionsElement ? '✅ Found' : '❌ Missing'}`);
    
    // Check configs
    console.log('Cookie Banner Config:', window.COOKIE_BANNER_CONFIG);
    console.log('Welcome Config:', window.WELCOME_CONFIG);
    console.log('Mehr Erfahren Config:', window.MEHR_ERFAHREN_CONFIG);
    console.log('Process Config:', window.PROCESS_CONFIG);
    console.log('Footer Config:', window.FOOTER_CONFIG);
    console.log('Positions Config:', window.POSITIONS_CONFIG);
};

// Debug helper for Cookie Banner
window.debugCookieBanner = function() {
    console.log('=== Cookie Banner Debug Info ===');
    console.log('CookieBannerModule loaded:', !!window.CookieBannerModule);
    console.log('CookieBanner instance:', !!window.CookieBanner);
    
    if (window.CookieBanner) {
        const status = window.CookieBanner.getStatus();
        console.log('Initialized:', status.initialized);
        console.log('Consent State:', status.consentState);
        console.log('FB Pixel Ready:', status.fbPixelReady);
        console.log('Config:', status.config);
        
        // Check localStorage
        console.log('Preferences Set:', localStorage.getItem('cookiePreferencesSet'));
        console.log('Essential Consent:', localStorage.getItem('cookie_consent_essential'));
        console.log('Analytics Consent:', localStorage.getItem('cookie_consent_analytics'));
        console.log('Marketing Consent:', localStorage.getItem('cookie_consent_marketing'));
    } else {
        console.log('Cookie Banner not initialized');
    }
};

// Reset cookie preferences
window.resetCookiePreferences = function() {
    if (window.CookieBanner) {
        window.CookieBanner.resetPreferences();
        console.log('✅ Cookie preferences reset');
    } else {
        console.error('❌ Cookie banner not initialized');
    }
};

// Manually trigger cookie banner
window.showCookieBanner = function() {
    if (window.CookieBanner) {
        window.CookieBanner.showBanner();
        console.log('✅ Cookie banner shown');
    } else {
        console.error('❌ Cookie banner not initialized');
    }
};

// Function to manually reinitialize sections
window.reinitializeWelcomeSection = function() {
    if (window.WelcomeSection && window.WELCOME_CONFIG) {
        return new window.WelcomeSection(WELCOME_CONFIG, 'welcome-section');
    } else {
        console.error('WelcomeSection class or WELCOME_CONFIG not available');
        return false;
    }
};

window.reinitializeMehrErfahrenSection = function() {
    if (window.MehrErfahrenSection && window.MEHR_ERFAHREN_CONFIG) {
        return new window.MehrErfahrenSection(MEHR_ERFAHREN_CONFIG, 'mehr-erfahren-section');
    } else {
        console.error('MehrErfahrenSection class or MEHR_ERFAHREN_CONFIG not available');
        return false;
    }
};

window.reinitializeProcessSection = function() {
    if (window.ProcessSection && window.PROCESS_CONFIG) {
        return new window.ProcessSection(PROCESS_CONFIG, 'process-section');
    } else {
        console.error('ProcessSection class or PROCESS_CONFIG not available');
        return false;
    }
};

window.reinitializeFooterSection = function() {
    if (window.FooterSection && window.FOOTER_CONFIG) {
        return new window.FooterSection(window.FOOTER_CONFIG, 'footer-section');
    } else {
        console.error('FooterSection class or FOOTER_CONFIG not available');
        return false;
    }
};

window.reinitializePositionsSection = function() {
    if (window.PositionsSection && window.POSITIONS_CONFIG) {
        return new window.PositionsSection(window.POSITIONS_CONFIG, 'positions-section');
    } else {
        console.error('PositionsSection class or POSITIONS_CONFIG not available');
        return false;
    }
};

// Debug helper for Mehr Erfahren specifically
window.debugMehrErfahren = function() {
    console.log('=== Mehr Erfahren Debug Info ===');
    console.log('MehrErfahrenSection loaded:', !!window.MehrErfahrenSection);
    console.log('Container found:', !!document.getElementById('mehr-erfahren-section'));
    console.log('Config:', window.MEHR_ERFAHREN_CONFIG);
    
    if (window.MEHR_ERFAHREN_CONFIG) {
        // Check enabled cards
        const enabledCards = Object.entries(window.MEHR_ERFAHREN_CONFIG)
            .filter(([key, value]) => key.includes('Card') && value && value.enabled)
            .map(([key]) => key);
        console.log('Enabled cards:', enabledCards);
        
        // Check CTA configuration
        console.log('CTA Headline:', window.MEHR_ERFAHREN_CONFIG.ctaHeadline);
        console.log('CTA Button:', window.MEHR_ERFAHREN_CONFIG.ctaButtonText);
    }
};

// Debug helper for Process section
window.debugProcess = function() {
    console.log('=== Process Section Debug Info ===');
    console.log('ProcessSection loaded:', !!window.ProcessSection);
    console.log('Container found:', !!document.getElementById('process-section'));
    console.log('Config:', window.PROCESS_CONFIG);
    
    if (window.PROCESS_CONFIG) {
        console.log('Number of cards:', window.PROCESS_CONFIG.cards ? window.PROCESS_CONFIG.cards.length : 0);
        console.log('Show emoji containers:', window.PROCESS_CONFIG.showEmojiContainers);
        console.log('Show emoji background:', window.PROCESS_CONFIG.showEmojiBackground);
    }
};

// Debug helper for Footer section
window.debugFooter = function() {
    console.log('=== Footer Section Debug Info ===');
    console.log('FooterSection loaded:', !!window.FooterSection);
    console.log('Container found:', !!document.getElementById('footer-section'));
    console.log('Config:', window.FOOTER_CONFIG);
    
    if (window.FOOTER_CONFIG && window.FOOTER_CONFIG.socialMedia) {
        const enabledSocial = Object.entries(window.FOOTER_CONFIG.socialMedia)
            .filter(([_, settings]) => settings.enabled)
            .map(([platform]) => platform);
        console.log('Enabled social platforms:', enabledSocial);
    }
};

// Debug helper for Positions section
window.debugPositions = function() {
    console.log('=== Positions Section Debug Info ===');
    console.log('PositionsSection loaded:', !!window.PositionsSection);
    console.log('Container found:', !!document.getElementById('positions-section'));
    console.log('Config:', window.POSITIONS_CONFIG);
    
    if (window.POSITIONS_CONFIG) {
        console.log('Number of positions:', window.POSITIONS_CONFIG.positions ? window.POSITIONS_CONFIG.positions.length : 0);
        console.log('Saved positions enabled:', window.POSITIONS_CONFIG.features?.savedPositions);
        
        // Check active filters
        const activeFilters = Object.entries(window.POSITIONS_CONFIG.filters || {})
            .filter(([key, filter]) => filter && typeof filter === 'object' && filter.enabled)
            .map(([key]) => key);
        console.log('Active filters:', activeFilters);
        
        // Check active positions
        if (window.POSITIONS_CONFIG.positions) {
            const activePositions = window.POSITIONS_CONFIG.positions.filter(p => p.status === 'on');
            console.log('Active positions:', activePositions.length);
            console.log('Inactive positions:', window.POSITIONS_CONFIG.positions.length - activePositions.length);
        }
    }
};
