/**
 * Career Portal Loader - Main Entry Point
 * Dynamically loads required modules and initializes sections
 */

class CareerPortalLoader {
    constructor() {
        this.baseURL = 'https://raw.githubusercontent.com/niemeyerdigital/careerportal/main/careerPortal/';
        this.loadedModules = new Map();
        this.initializationQueue = [];
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
