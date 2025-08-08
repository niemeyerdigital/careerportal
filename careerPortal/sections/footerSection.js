/**
 * Footer Section
 * Company footer with configurable content, social media, and legal links
 */

window.FooterSection = class FooterSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.initializeFooter();
    }

    /**
     * Initialize Footer section specific functionality
     */
    initializeFooter() {
        if (!this.container) {
            console.error('Footer section container not found');
            return;
        }

        this.createFooterHTML();
        this.setupEventHandlers();
        this.initializeAnimations();
    }

    /**
     * Create the HTML structure for Footer section
     */
    createFooterHTML() {
        const config = this.config;
        
        // Generate social media icons HTML
        let socialIconsHTML = '';
        if (config.socialMedia) {
            const socialLinks = [];
            for (const [platform, settings] of Object.entries(config.socialMedia)) {
                if (settings.enabled) {
                    socialLinks.push(`
                        <a href="${settings.url}" target="_blank" class="footer-social-icon" aria-label="${platform}">
                            <i class="${settings.icon}"></i>
                        </a>
                    `);
                }
            }
            if (socialLinks.length > 0) {
                socialIconsHTML = `<div class="footer-social-icons">${socialLinks.join('')}</div>`;
            }
        }
        
        // Generate complete footer HTML
        this.container.innerHTML = `
            <div class="footer-wrapper">
                <div class="footer-container">
                    <!-- Logo -->
                    <div class="footer-logo-section">
                        <img src="${config.logoUrl}" alt="${config.businessName} Logo" class="footer-logo">
                    </div>

                    <!-- Company Info -->
                    <div class="footer-company-info">
                        <div class="footer-company-name">${config.businessName}</div>
                        <div class="footer-address">${config.streetAddress}</div>
                        <div class="footer-address">${config.zipCode} ${config.city}</div>
                    </div>

                    <!-- Website Link -->
                    <a href="${config.websiteUrl}" class="footer-website-link">Unsere Website</a>

                    <!-- Scroll to Top Button -->
                    <div class="footer-scroll-top-wrapper">
                        <button class="footer-scroll-top" id="footerScrollTop" aria-label="Nach oben scrollen">
                            Hier geht's wieder nach oben
                        </button>
                    </div>

                    <!-- Social Media Icons -->
                    ${socialIconsHTML}

                    <!-- Employer Badge -->
                    <div class="footer-employer-badge">
                        <div class="footer-employer-badge-text">
                            Employer Branding Maßnahmen erstellt und betreut durch 
                            <a href="https://www.niemeyerdigital.de" target="_blank" class="footer-employer-badge-company">Niemeyer Digital GmbH</a>
                        </div>
                    </div>

                    <!-- Legal Links -->
                    <div class="footer-legal-links">
                        <a href="${config.impressumUrl}">Impressum</a>
                        <a href="${config.datenschutzUrl}">Datenschutz</a>
                    </div>

                    <!-- Copyright -->
                    <div class="footer-copyright">
                        Copyright © ${config.copyrightYear} ${config.businessName}. Alle Rechte vorbehalten
                    </div>

                    <!-- Disclaimer -->
                    <div class="footer-disclaimer">
                        Diese Seite ist nicht Teil der Facebook™-Website oder von Facebook™ Inc. 
                        Darüber hinaus wird diese Seite in keiner Weise von Facebook™ unterstützt. 
                        FACEBOOK™ ist eine Marke von FACEBOOK™, Inc.
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Track social media clicks
        const socialLinks = this.container.querySelectorAll('.footer-social-icon');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = link.getAttribute('aria-label');
                this.trackSocialClick(platform);
            });
        });

        // Track legal link clicks
        const legalLinks = this.container.querySelectorAll('.footer-legal-links a');
        legalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const linkText = link.textContent;
                this.trackLegalClick(linkText);
            });
        });

        // Track website link click
        const websiteLink = this.container.querySelector('.footer-website-link');
        if (websiteLink) {
            websiteLink.addEventListener('click', (e) => {
                this.trackWebsiteClick();
            });
        }

        // Track Niemeyer Digital click
        const niemeyerLink = this.container.querySelector('.footer-employer-badge-company');
        if (niemeyerLink) {
            niemeyerLink.addEventListener('click', (e) => {
                this.trackNiemeyerClick();
            });
        }

        // Setup scroll to top button
        const scrollTopBtn = this.container.querySelector('#footerScrollTop');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    }

    /**
     * Track social media click
     */
    trackSocialClick(platform) {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Social Media',
                event_label: `Footer - ${platform}`,
                value: 1
            });
        }

        // Custom handler if provided
        if (this.config.onSocialClick && typeof this.config.onSocialClick === 'function') {
            this.config.onSocialClick(platform);
        }
    }

    /**
     * Track legal link click
     */
    trackLegalClick(linkText) {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Legal',
                event_label: `Footer - ${linkText}`,
                value: 1
            });
        }
    }

    /**
     * Track website link click
     */
    trackWebsiteClick() {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Navigation',
                event_label: 'Footer - Website Link',
                value: 1
            });
        }
    }

    /**
     * Track Niemeyer Digital click
     */
    trackNiemeyerClick() {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'External',
                event_label: 'Footer - Niemeyer Digital GmbH',
                value: 1
            });
        }
    }

    /**
     * Scroll to top functionality
     */
    scrollToTop() {
        // Track scroll to top click
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Navigation',
                event_label: 'Footer - Scroll to Top',
                value: 1
            });
        }

        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Fade in animation on scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('footer-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            const wrapper = this.container.querySelector('.footer-wrapper');
            if (wrapper) {
                observer.observe(wrapper);
            }
        } else {
            // Fallback for older browsers
            const wrapper = this.container.querySelector('.footer-wrapper');
            if (wrapper) {
                wrapper.classList.add('footer-visible');
            }
        }

        // Add hover animations to badge
        const badge = this.container.querySelector('.footer-employer-badge');
        if (badge) {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'rotate(-3deg) translateY(-2px)';
            });
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'rotate(-3deg)';
            });
        }
    }

    /**
     * Update footer configuration
     */
    updateFooterConfig(newConfig) {
        this.updateConfig(newConfig);
        this.reinitialize();
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        const enabledSocial = Object.entries(this.config.socialMedia || {})
            .filter(([_, settings]) => settings.enabled)
            .map(([platform]) => platform);
        
        return {
            sectionType: 'footer',
            config: this.config,
            socialPlatforms: enabledSocial,
            hasLogo: !!this.config.logoUrl,
            isVisible: this.isInViewport(this.container)
        };
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        const required = ['businessName', 'streetAddress', 'zipCode', 'city', 'copyrightYear'];
        const missing = required.filter(field => !this.config[field]);

        if (missing.length > 0) {
            console.error(`Footer section missing required fields: ${missing.join(', ')}`);
            return false;
        }

        // Validate social media configuration
        if (this.config.socialMedia) {
            for (const [platform, settings] of Object.entries(this.config.socialMedia)) {
                if (settings.enabled && !settings.url) {
                    console.error(`Footer section: ${platform} is enabled but URL is missing`);
                    return false;
                }
            }
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
            this.container.classList.add('footer-mobile');
        } else {
            this.container.classList.remove('footer-mobile');
        }
    }

    /**
     * Apply default configuration values
     */
    static getDefaultConfig() {
        return {
            logoUrl: "https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image",
            businessName: "Muster GmbH",
            streetAddress: "Musterstraße 123",
            zipCode: "12345",
            city: "Musterstadt",
            websiteUrl: "#",
            socialMedia: {
                linkedin: {
                    enabled: true,
                    url: "https://linkedin.com",
                    icon: "fab fa-linkedin-in"
                },
                facebook: {
                    enabled: true,
                    url: "https://facebook.com",
                    icon: "fab fa-facebook-f"
                },
                instagram: {
                    enabled: true,
                    url: "https://instagram.com",
                    icon: "fab fa-instagram"
                }
            },
            impressumUrl: "#",
            datenschutzUrl: "#",
            copyrightYear: new Date().getFullYear().toString()
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        // Remove event listeners
        const socialLinks = this.container.querySelectorAll('.footer-social-icon');
        socialLinks.forEach(link => {
            link.replaceWith(link.cloneNode(true));
        });

        super.destroy();
    }

    /**
     * Reinitialize section
     */
    reinitialize() {
        this.destroy();
        this.initializeFooter();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        const mergedConfig = { ...FooterSection.getDefaultConfig(), ...config };
        return new FooterSection(mergedConfig, containerId);
    }
};
