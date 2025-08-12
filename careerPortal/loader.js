/**
 * Career Portal Loader - Main Entry Point
 * Dynamically loads CSS and JavaScript modules and initializes sections
 */

class CareerPortalLoader {
    constructor() {
        this.baseURL = 'https://raw.githubusercontent.com/niemeyerdigital/careerportal/main/careerPortal/';
        this.loadedModules = new Map();
        this.initializationQueue = [];
    }

    /**
     * Load CSS file
     */
    async loadCSS(path) {
        const url = this.baseURL + path;
        
        // Check if already loaded
        if (document.querySelector(`link[href="${url}"]`)) {
            console.log(`✅ CSS already loaded: ${path}`);
            return true;
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        
        return new Promise((resolve, reject) => {
            link.onload = () => {
                console.log(`✅ CSS loaded: ${path}`);
                resolve(true);
            };
            link.onerror = () => {
                console.error(`❌ Failed to load CSS: ${path}`);
                reject(new Error(`Failed to load CSS: ${path}`));
            };
            document.head.appendChild(link);
        });
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
            const code = await response.text();
            
            // Create a script element and execute it
            const script = document.createElement('script');
            script.textContent = code;
            document.head.appendChild(script);
            
            this.loadedModules.set(path, true);
            return true;
        } catch (error) {
            console.error(`Failed to load module: ${path}`, error);
            return false;
        }
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
// MANUAL INITIALIZATION FOR CLICKFUNNELS (CSP WORKAROUND)
// ====================================================================

(function() {
    const GITHUB_USERNAME = 'niemeyerdigital';
    const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/careerportal/main/careerPortal/`;
    
    console.log('🚀 Loading Career Portal via fetch method...');
    
    // Load modules sequentially via fetch to avoid CSP issues
    async function loadCareerPortal() {
        try {
            // 1. Load CSS files dynamically (more reliable than @import)
            const cssFiles = [
                'styles/components/buttons.css',
                'styles/sections/welcome.css',
                'styles/sections/mehrErfahren.css',
                'styles/sections/process.css',
                'styles/sections/positions.css',
                'styles/sections/footer.css'
            ];
            
            for (const cssFile of cssFiles) {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = BASE_URL + cssFile;
                document.head.appendChild(cssLink);
                console.log(`✅ CSS loaded: ${cssFile}`);
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
            
            // 6. Load welcome section
            const welcomeResponse = await fetch(BASE_URL + 'sections/welcomeSection.js');
            const welcomeCode = await welcomeResponse.text();
            eval(welcomeCode);
            console.log('✅ Welcome section loaded');
            
            // 7. Load mehr erfahren section
            const mehrErfahrenResponse = await fetch(BASE_URL + 'sections/mehrErfahrenSection.js');
            const mehrErfahrenCode = await mehrErfahrenResponse.text();
            eval(mehrErfahrenCode);
            console.log('✅ Mehr Erfahren section loaded');
            
            // 8. Load process section
            const processResponse = await fetch(BASE_URL + 'sections/processSection.js');
            const processCode = await processResponse.text();
            eval(processCode);
            console.log('✅ Process section loaded');
            
            // 9. Load footer section
            const footerResponse = await fetch(BASE_URL + 'sections/footerSection.js');
            const footerCode = await footerResponse.text();
            eval(footerCode);
            console.log('✅ Footer section loaded');
            
            // 10. Load positions section
            const positionsResponse = await fetch(BASE_URL + 'sections/positionsSection.js');
            const positionsCode = await positionsResponse.text();
            eval(positionsCode);
            console.log('✅ Positions section loaded');
            
            // 11. Initialize sections that exist on the page
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
        'AnimationController'
    ];
    
    console.log('=== Career Portal Debug Info ===');
    components.forEach(component => {
        const loaded = !!window[component];
        console.log(`${component}: ${loaded ? '✅ Loaded' : '❌ Missing'}`);
    });
    
    // Check CSS
    const cssLoaded = document.querySelector(`link[href*="styles/base.css"]`);
    console.log(`CSS: ${cssLoaded ? '✅ Loaded' : '❌ Missing'}`);
    
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
    console.log('Welcome Config:', window.WELCOME_CONFIG);
    console.log('Mehr Erfahren Config:', window.MEHR_ERFAHREN_CONFIG);
    console.log('Process Config:', window.PROCESS_CONFIG);
    console.log('Footer Config:', window.FOOTER_CONFIG);
    console.log('Positions Config:', window.POSITIONS_CONFIG);
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
