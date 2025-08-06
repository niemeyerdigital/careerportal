/**
 * Slide Up Animation
 * Creates smooth slide-up entrance animations for elements
 */

window.SlideUpAnimation = class SlideUpAnimation {
    constructor() {
        this.animatedElements = new Set();
        this.observer = null;
        this.setupIntersectionObserver();
    }

    /**
     * Setup intersection observer for automatic animations
     */
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px 0px -50px 0px'
            });
        }
    }

    /**
     * Animate a single element with slide up effect
     */
    animateElement(element, options = {}) {
        if (this.animatedElements.has(element)) return;

        const config = {
            duration: '0.6s',
            easing: 'ease-out',
            delay: '0s',
            distance: '30px',
            ...options
        };

        // Set initial state
        element.style.cssText += `
            opacity: 0;
            transform: translateY(${config.distance});
            transition: opacity ${config.duration} ${config.easing} ${config.delay}, 
                       transform ${config.duration} ${config.easing} ${config.delay};
        `;

        // Mark as animated
        this.animatedElements.add(element);

        // Trigger animation
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Animate multiple elements with staggered delays
     */
    animateSequence(elements, options = {}) {
        const config = {
            staggerDelay: 200, // ms between each element
            startDelay: 0,
            ...options
        };

        elements.forEach((element, index) => {
            const delay = `${config.startDelay + (index * config.staggerDelay)}ms`;
            this.animateElement(element, { ...options, delay });
        });
    }

    /**
     * Auto-animate elements with specific selectors
     */
    autoAnimate(selector, options = {}) {
        const elements = document.querySelectorAll(selector);
        
        if (this.observer) {
            // Use intersection observer for viewport-based animation
            elements.forEach(element => {
                // Prepare element for animation
                element.style.cssText += `
                    opacity: 0;
                    transform: translateY(${options.distance || '30px'});
                `;
                
                this.observer.observe(element);
            });
        } else {
            // Fallback: animate immediately with sequence
            this.animateSequence(Array.from(elements), options);
        }
    }

    /**
     * Create CSS keyframes for slide up animation
     */
    createKeyframes(name = 'slideUp', distance = '30px') {
        const keyframes = `
            @keyframes ${name} {
                from {
                    opacity: 0;
                    transform: translateY(${distance});
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        // Add to document if not exists
        const styleId = `animation-${name}`;
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = keyframes;
            document.head.appendChild(style);
        }

        return name;
    }

    /**
     * Apply CSS animation to element
     */
    applyCSSAnimation(element, options = {}) {
        const config = {
            name: 'slideUp',
            duration: '0.6s',
            easing: 'ease-out',
            delay: '0s',
            fillMode: 'both',
            distance: '30px',
            ...options
        };

        // Create keyframes if needed
        this.createKeyframes(config.name, config.distance);

        // Apply animation
        element.style.animation = `${config.name} ${config.duration} ${config.easing} ${config.delay} ${config.fillMode}`;
        
        this.animatedElements.add(element);
    }

    /**
     * Reset element animation state
     */
    resetElement(element) {
        element.style.opacity = '';
        element.style.transform = '';
        element.style.transition = '';
        element.style.animation = '';
        this.animatedElements.delete(element);
    }

    /**
     * Reset all animated elements
     */
    resetAll() {
        this.animatedElements.forEach(element => {
            this.resetElement(element);
        });
        this.animatedElements.clear();
    }

    /**
     * Animate elements on page load
     */
    animateOnLoad(selectors = []) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.executeLoadAnimations(selectors);
            });
        } else {
            this.executeLoadAnimations(selectors);
        }
    }

    /**
     * Execute load animations
     */
    executeLoadAnimations(selectors) {
        selectors.forEach((selectorConfig, index) => {
            const config = typeof selectorConfig === 'string' 
                ? { selector: selectorConfig, delay: index * 200 }
                : selectorConfig;

            setTimeout(() => {
                this.autoAnimate(config.selector, config.options);
            }, config.delay || 0);
        });
    }

    /**
     * Create a slide up animation for a specific section
     */
    animateSection(sectionSelector, elementSelectors = []) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        // Default element selectors if none provided
        if (elementSelectors.length === 0) {
            elementSelectors = [
                { selector: '.badge', delay: 200 },
                { selector: 'h1, .headline', delay: 400 },
                { selector: 'p, .subtext', delay: 600 },
                { selector: '.cta, .button', delay: 800 },
                { selector: '.media, .video, .image', delay: 1000 }
            ];
        }

        elementSelectors.forEach(config => {
            const elements = section.querySelectorAll(config.selector);
            elements.forEach((element, index) => {
                const totalDelay = (config.delay || 0) + (index * (config.stagger || 0));
                setTimeout(() => {
                    this.animateElement(element, config.options);
                }, totalDelay);
            });
        });
    }

    /**
     * Cleanup method
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.resetAll();
    }
};