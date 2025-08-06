/**
 * Base Section Class
 * Provides common functionality for all career portal sections
 */

window.BaseSec = class BaseSec {
    constructor(config, containerId) {
        this.config = config;
        this.containerId = containerId;
        this.container = null;
        this.initialized = false;
        
        this.init();
    }

    /**
     * Initialize the base section
     */
    init() {
        this.findContainer();
        this.validateConfig();
        this.setupEventListeners();
        this.initialized = true;
    }

    /**
     * Find the container element
     */
    findContainer() {
        if (this.containerId) {
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                console.error(`Container with ID '${this.containerId}' not found`);
                return;
            }
        }
    }

    /**
     * Validate configuration (to be implemented by child classes)
     */
    validateConfig() {
        // Base validation - child classes can override
        if (!this.config) {
            console.error('No configuration provided for section');
            return false;
        }
        return true;
    }

    /**
     * Setup common event listeners
     */
    setupEventListeners() {
        // Window resize handler for responsive adjustments
        this.handleResize = this.debounce(() => {
            this.onResize();
        }, 250);
        
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * Handle window resize (to be overridden by child classes)
     */
    onResize() {
        // Base implementation - child classes can override
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Create DOM element with attributes
     */
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    /**
     * Utility: Smooth scroll to element
     */
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
            return;
        }

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const targetPosition = elementPosition - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Utility: Wait for element to exist in DOM
     */
    waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    /**
     * Utility: Load external script
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                resolve(existingScript);
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            document.head.appendChild(script);
        });
    }

    /**
     * Utility: Apply CSS variables from config
     */
    applyCSSVariables(variables) {
        const root = document.documentElement;
        Object.entries(variables).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });
    }

    /**
     * Utility: Get current breakpoint
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile';
        if (width <= 768) return 'tablet';
        return 'desktop';
    }

    /**
     * Utility: Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top + threshold <= windowHeight &&
            rect.left <= windowWidth &&
            rect.bottom - threshold >= 0 &&
            rect.right >= 0
        );
    }

    /**
     * Cleanup method
     */
    destroy() {
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
        }
        this.initialized = false;
    }

    /**
     * Update configuration and reinitialize
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.reinitialize();
    }

    /**
     * Reinitialize the section
     */
    reinitialize() {
        if (this.initialized) {
            this.destroy();
        }
        this.init();
    }
};