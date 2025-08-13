/**
 * Exclude Section
 * Rejection page with compassionate messaging and link to other opportunities
 */

window.ExcludeSection = class ExcludeSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.initializeExclude();
    }

    /**
     * Initialize Exclude section specific functionality
     */
    initializeExclude() {
        if (!this.container) {
            console.error('Exclude section container not found');
            return;
        }

        this.createExcludeHTML();
        this.setupEventHandlers();
        this.initializeAnimations();
    }

    /**
     * Create the HTML structure for Exclude section
     */
    createExcludeHTML() {
        const config = this.config;

        // Generate complete exclude HTML
        this.container.innerHTML = `
            <div class="exclude-wrapper">
                <div class="exclude-container">
                    <!-- Header section -->
                    <div class="exclude-center fade-in-up">
                        <div class="exclude-chip" aria-label="${config.statusBadgeText}">
                            <i class="fa-solid fa-circle-info"></i>
                            <span>${config.statusBadgeText}</span>
                        </div>

                        <h1 class="exclude-title">${config.mainHeadline}</h1>
                        <p class="exclude-subtitle">${config.mainDescription}</p>
                        
                        <a href="${config.otherPositionsLink}" class="exclude-other-positions-btn" target="_blank" rel="noreferrer noopener">
                            <i class="fa-solid fa-briefcase"></i>
                            <span>${config.otherPositionsButtonText}</span>
                        </a>
                    </div>

                    <!-- Main message card -->
                    <div class="exclude-message-card fade-in-up slow">
                        <div class="exclude-message-icon">
                            <i class="fa-solid fa-heart"></i>
                        </div>
                        <div class="exclude-message-content">
                            <h2>${config.messageTitle}</h2>
                            <p>${config.messageText}</p>
                        </div>
                    </div>

                    <!-- Social Media Section -->
                    <div class="exclude-social-section fade-in-up slow">
                        <p class="exclude-social-text">${config.socialMediaText}</p>
                        <a href="${config.socialMedia.channelUrl}" class="exclude-social-btn" target="_blank" rel="noreferrer noopener">
                            ${config.socialMedia.channelName}
                        </a>
                    </div>

                    <!-- Footer text -->
                    <p class="exclude-footnote fade-in-up slow">${config.footerText}</p>
                </div>
            </div>
        `;
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Track other positions button click
        const otherPositionsBtn = this.container.querySelector('.exclude-other-positions-btn');
        if (otherPositionsBtn) {
            otherPositionsBtn.addEventListener('click', (e) => {
                this.trackOtherPositionsClick();
            });
        }

        // Track social media click
        const socialBtn = this.container.querySelector('.exclude-social-btn');
        if (socialBtn) {
            socialBtn.addEventListener('click', (e) => {
                this.trackSocialClick();
            });
        }
    }

    /**
     * Track other positions click
     */
    trackOtherPositionsClick() {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Exclude Page',
                event_label: 'Other Positions Button',
                value: 1
            });
        }

        // Custom handler if provided
        if (this.config.onOtherPositionsClick && typeof this.config.onOtherPositionsClick === 'function') {
            this.config.onOtherPositionsClick();
        }
    }

    /**
     * Track social click
     */
    trackSocialClick() {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Exclude Page',
                event_label: `Social Media - ${this.config.socialMedia.channelName}`,
                value: 1
            });
        }

        // Custom handler if provided
        if (this.config.onSocialClick && typeof this.config.onSocialClick === 'function') {
            this.config.onSocialClick();
        }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Add animation classes
        requestAnimationFrame(() => {
            const fadeElements = this.container.querySelectorAll('.fade-in-up');
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });

        // Add gentle pulse to other positions button
        const otherPositionsBtn = this.container.querySelector('.exclude-other-positions-btn');
        if (otherPositionsBtn) {
            otherPositionsBtn.classList.add('pulse-animation');
        }
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        const required = ['statusBadgeText', 'mainHeadline', 'mainDescription', 'messageTitle', 'messageText', 'otherPositionsButtonText', 'otherPositionsLink'];
        const missing = required.filter(field => !this.config[field]);

        if (missing.length > 0) {
            console.error(`Exclude section missing required fields: ${missing.join(', ')}`);
            return false;
        }

        // Validate social media configuration
        if (!this.config.socialMedia || !this.config.socialMedia.channelName || !this.config.socialMedia.channelUrl) {
            console.error('Exclude section: socialMedia configuration is required');
            return false;
        }

        return super.validateConfig();
    }

    /**
     * Handle responsive updates
     */
    onResize() {
        const breakpoint = this.getCurrentBreakpoint();
        
        // Adjust layout for mobile
        if (breakpoint === 'mobile') {
            this.container.classList.add('exclude-mobile');
        } else {
            this.container.classList.remove('exclude-mobile');
        }
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        return {
            sectionType: 'exclude',
            config: this.config,
            isVisible: this.isInViewport(this.container)
        };
    }

    /**
     * Apply default configuration values
     */
    static getDefaultConfig() {
        return {
            statusBadgeText: "Bewerbung abgeschlossen",
            mainHeadline: "Vielen Dank für dein Interesse",
            mainDescription: "Wir haben deine Bewerbung sorgfältig geprüft.",
            messageTitle: "Leider passt es diesmal nicht",
            messageText: "Nach eingehender Prüfung deiner Unterlagen müssen wir dir mitteilen, dass dein Profil aktuell nicht zu unseren Anforderungen passt. Das bedeutet nicht, dass deine Qualifikationen nicht wertvoll sind – es passt nur gerade nicht zu unseren spezifischen Bedürfnissen.",
            otherPositionsButtonText: "Entdecke weitere Stellen von uns",
            otherPositionsLink: "https://example.com", // Placeholder URL
            socialMediaText: "Folge uns auf Social Media für Updates zu neuen Positionen:",
            socialMedia: {
                channelName: "LinkedIn", // e.g., "Instagram", "Facebook", "LinkedIn"
                channelUrl: "https://linkedin.com/company/placeholder" // Full URL to social media profile
            },
            footerText: "Wir wünschen dir viel Erfolg für deinen weiteren Werdegang!",
            
            // Optional: Custom event handlers
            onOtherPositionsClick: function() {
                // Optional: Add custom tracking
                console.log('Exclude page other positions clicked');
                
                // Example: Track conversion
                if (window.gtag) {
                    window.gtag('event', 'conversion', {
                        event_category: 'Exclude Page',
                        event_label: 'Redirect to Job Board',
                        value: 1
                    });
                }
            },
            
            onSocialClick: function() {
                // Optional: Add custom tracking for social media clicks
                console.log('Exclude page social media clicked');
            }
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        super.destroy();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        const mergedConfig = { ...ExcludeSection.getDefaultConfig(), ...config };
        return new ExcludeSection(mergedConfig, containerId);
    }
};
