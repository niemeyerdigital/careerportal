/**
 * Animation Controller
 * Manages and coordinates animations across the career portal
 */

window.AnimationController = class AnimationController {
    constructor() {
        this.animations = new Map();
        this.globalConfig = {
            duration: '0.6s',
            easing: 'ease-out',
            reducedMotion: this.prefersReducedMotion()
        };
        
        this.setupReducedMotionListener();
    }

    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Setup listener for reduced motion preference changes
     */
    setupReducedMotionListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            mediaQuery.addEventListener('change', (e) => {
                this.globalConfig.reducedMotion = e.matches;
                if (e.matches) {
                    this.disableAllAnimations();
                } else {
                    this.enableAllAnimations();
                }
            });
        }
    }

    /**
     * Register an animation
     */
    registerAnimation(name, animationInstance) {
        this.animations.set(name, animationInstance);
        return animationInstance;
    }

    /**
     * Get animation by name
     */
    getAnimation(name) {
        return this.animations.get(name);
    }

    /**
     * Execute animation with respect for user preferences
     */
    executeAnimation(animationFn, options = {}) {
        if (this.globalConfig.reducedMotion && !options.forceAnimation) {
            // Skip animation, just apply final state
            if (options.finalState && typeof options.finalState === 'function') {
                options.finalState();
            }
            return;
        }

        if (typeof animationFn === 'function') {
            animationFn();
        }
    }

    /**
     * Animate element entrance
     */
    animateEntrance(elements, type = 'slideUp', options = {}) {
        const config = {
            duration: this.globalConfig.duration,
            easing: this.globalConfig.easing,
            staggerDelay: 200,
            startDelay: 0,
            ...options
        };

        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        this.executeAnimation(() => {
            elements.forEach((element, index) => {
                if (!element) return;

                const delay = config.startDelay + (index * config.staggerDelay);
                
                switch (type) {
                    case 'slideUp':
                        this.slideUpElement(element, { ...config, delay });
                        break;
                    case 'fadeIn':
                        this.fadeInElement(element, { ...config, delay });
                        break;
                    case 'scaleIn':
                        this.scaleInElement(element, { ...config, delay });
                        break;
                    default:
                        this.slideUpElement(element, { ...config, delay });
                }
            });
        }, {
            finalState: () => {
                // Just make elements visible without animation
                elements.forEach(element => {
                    if (element) {
                        element.style.opacity = '1';
                        element.style.transform = 'none';
                    }
                });
            }
        });
    }

    /**
     * Slide up animation for single element
     */
    slideUpElement(element, options = {}) {
        const config = {
            duration: this.globalConfig.duration,
            easing: this.globalConfig.easing,
            delay: 0,
            distance: '30px',
            ...options
        };

        // Set initial state
        element.style.cssText += `
            opacity: 0;
            transform: translateY(${config.distance});
            transition: opacity ${config.duration} ${config.easing}, 
                       transform ${config.duration} ${config.easing};
        `;

        // Trigger animation
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, config.delay);
    }

    /**
     * Fade in animation for single element
     */
    fadeInElement(element, options = {}) {
        const config = {
            duration: this.globalConfig.duration,
            easing: this.globalConfig.easing,
            delay: 0,
            ...options
        };

        element.style.cssText += `
            opacity: 0;
            transition: opacity ${config.duration} ${config.easing};
        `;

        setTimeout(() => {
            element.style.opacity = '1';
        }, config.delay);
    }

    /**
     * Scale in animation for single element
     */
    scaleInElement(element, options = {}) {
        const config = {
            duration: this.globalConfig.duration,
            easing: this.globalConfig.easing,
            delay: 0,
            initialScale: '0.8',
            ...options
        };

        element.style.cssText += `
            opacity: 0;
            transform: scale(${config.initialScale});
            transition: opacity ${config.duration} ${config.easing}, 
                       transform ${config.duration} ${config.easing};
        `;

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, config.delay);
    }

    /**
     * Animate section with predefined sequence
     */
    animateSection(sectionElement, sequence = 'welcome') {
        const sequences = {
            welcome: [
                { selector: '.welcome-badge, .badge', delay: 200, type: 'slideUp' },
                { selector: '.welcome-headline, h1', delay: 400, type: 'slideUp' },
                { selector: '.welcome-subtext, .subtext', delay: 600, type: 'slideUp' },
                { selector: '.welcome-cta, .cta', delay: 800, type: 'slideUp' },
                { selector: '.welcome-media, .media', delay: 1000, type: 'slideUp' }
            ],
            default: [
                { selector: 'h1, h2, .headline', delay: 200, type: 'slideUp' },
                { selector: 'p, .text', delay: 400, type: 'slideUp' },
                { selector: '.button, .cta', delay: 600, type: 'slideUp' },
                { selector: '.content, .media', delay: 800, type: 'slideUp' }
            ]
        };

        const animationSequence = sequences[sequence] || sequences.default;

        animationSequence.forEach(step => {
            const elements = sectionElement.querySelectorAll(step.selector);
            if (elements.length > 0) {
                setTimeout(() => {
                    this.animateEntrance(Array.from(elements), step.type, {
                        staggerDelay: 100 // Smaller stagger within groups
                    });
                }, step.delay);
            }
        });
    }

    /**
     * Disable all animations (for reduced motion)
     */
    disableAllAnimations() {
        // Add CSS to disable all transitions and animations
        const style = document.createElement('style');
        style.id = 'reduced-motion-override';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enable all animations
     */
    enableAllAnimations() {
        const existingStyle = document.getElementById('reduced-motion-override');
        if (existingStyle) {
            existingStyle.remove();
        }
    }

    /**
     * Animate on scroll (intersection observer)
     */
    animateOnScroll(elements, options = {}) {
        const config = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px',
            animationType: 'slideUp',
            ...options
        };

        if (!('IntersectionObserver' in window)) {
            // Fallback: animate immediately
            this.animateEntrance(elements, config.animationType);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateEntrance([entry.target], config.animationType, config);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });

        elements.forEach(element => {
            if (element) {
                // Prepare element for animation
                element.style.opacity = '0';
                element.style.transform = config.animationType === 'slideUp' ? 'translateY(30px)' : '';
                observer.observe(element);
            }
        });

        // Store observer for cleanup
        this.registerAnimation('scrollObserver', observer);
    }

    /**
     * Create timeline animation
     */
    createTimeline(steps) {
        let totalDelay = 0;

        steps.forEach(step => {
            setTimeout(() => {
                if (typeof step.action === 'function') {
                    step.action();
                } else if (step.elements && step.type) {
                    this.animateEntrance(step.elements, step.type, step.options);
                }
            }, totalDelay);

            totalDelay += step.delay || 200;
        });
    }

    /**
     * Update global animation config
     */
    updateConfig(newConfig) {
        this.globalConfig = { ...this.globalConfig, ...newConfig };
    }

    /**
     * Cleanup all animations
     */
    destroy() {
        this.animations.forEach((animation, name) => {
            if (animation && typeof animation.destroy === 'function') {
                animation.destroy();
            }
        });
        this.animations.clear();

        // Clean up reduced motion styles
        const reducedMotionStyle = document.getElementById('reduced-motion-override');
        if (reducedMotionStyle) {
            reducedMotionStyle.remove();
        }
    }
};