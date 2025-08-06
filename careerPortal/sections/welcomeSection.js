/**
 * Welcome Section
 * Specific business logic for the career portal welcome section
 */

window.WelcomeSection = class WelcomeSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.components = {};
        this.initializeWelcome();
    }

    /**
     * Initialize welcome section specific functionality
     */
    initializeWelcome() {
        if (!this.container) {
            console.error('Welcome section container not found');
            return;
        }

        this.createWelcomeHTML();
        this.setupComponents();
        this.setupWelcomeEvents();
        this.initializeAnimations();
    }

    /**
     * Create the HTML structure for welcome section
     */
    createWelcomeHTML() {
        this.container.innerHTML = `
            <div class="welcome-wrapper">
                <div class="welcome-container">
                    <!-- Badge will be created by component -->
                    <div id="welcome-badge-container"></div>
                    
                    <!-- Main Headlines -->
                    <h1 class="welcome-headline" id="mainHeadline"></h1>
                    <p class="welcome-subtext" id="subText"></p>
                    
                    <!-- CTA Buttons Container -->
                    <div class="welcome-cta" id="welcomeCTAContainer">
                        <!-- Buttons will be created by component -->
                    </div>
                    
                    <!-- Media Container -->
                    <div class="welcome-media">
                        <div id="welcome-media-container"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup all components
     */
    setupComponents() {
        this.setupContent();
        this.setupBadge();
        this.setupButtons();
        this.setupMedia();
    }

    /**
     * Setup text content
     */
    setupContent() {
        const headline = document.getElementById('mainHeadline');
        const subText = document.getElementById('subText');

        if (headline) headline.textContent = this.config.mainHeadline || '';
        if (subText) subText.textContent = this.config.subText || '';
    }

    /**
     * Setup badge component
     */
    setupBadge() {
        if (!window.BadgeComponent) {
            console.warn('BadgeComponent not loaded');
            return;
        }

        this.components.badge = window.BadgeComponent.createWorkAtBadge(
            'welcome-badge-container',
            {
                workAt: this.config.workAt || 'Work at',
                companyName: this.config.companyName || 'Company',
                logoSrc: this.config.logoLink || '',
                logoAlt: `${this.config.companyName || 'Company'} Logo`
            }
        );
    }

    /**
     * Setup button components
     */
    setupButtons() {
        if (!window.ButtonManager) {
            console.warn('ButtonManager not loaded');
            return;
        }

        const buttonManager = new window.ButtonManager();
        const ctaContainer = document.getElementById('welcomeCTAContainer');

        if (!ctaContainer) return;

        // Create primary CTA button
        const primaryButton = buttonManager.createButton(
            this.config.buttonType || 'MainButton1',
            {
                text: this.config.ctaText || 'Apply Now',
                href: this.config.ctaLink || '#',
                icon: 'fas fa-arrow-right',
                id: 'welcomePrimaryBtn'
            }
        );

        // Create secondary link button
        const secondaryButton = buttonManager.createSecondaryLink({
            text: this.config.secondaryText || 'Learn More',
            id: 'welcomeSecondaryBtn',
            onClick: () => this.handleSecondaryClick()
        });

        // Create button group
        const buttonGroup = buttonManager.createButtonGroup(
            [primaryButton, secondaryButton],
            { direction: 'column', gap: '16px', align: 'center' }
        );

        ctaContainer.appendChild(buttonGroup);
        this.components.buttonManager = buttonManager;
    }

    /**
     * Setup media component (video or image)
     */
    setupMedia() {
        const mediaContainer = document.getElementById('welcome-media-container');
        if (!mediaContainer) return;

        if (this.config.mainAsset === 'video' && this.config.videoId) {
            this.setupVideo(mediaContainer);
        } else if (this.config.mainAsset === 'image' && this.config.mainImageLink) {
            this.setupImage(mediaContainer);
        }
    }

    /**
     * Setup video component
     */
    setupVideo(container) {
        if (!window.VideoWistia) {
            console.warn('VideoWistia component not loaded');
            return;
        }

        // Create video container with proper styling
        container.innerHTML = `
            <div class="welcome-video-wrapper">
                <div id="wistia-video-container"></div>
            </div>
        `;

        this.components.video = new window.VideoWistia(
            'wistia-video-container',
            this.config.videoId,
            {
                responsive: true,
                borderRadius: '20px',
                autoplay: false
            }
        );
    }

    /**
     * Setup image component
     */
    setupImage(container) {
        container.innerHTML = `
            <div class="welcome-image-wrapper">
                <img class="welcome-image" 
                     src="${this.config.mainImageLink}" 
                     alt="${this.config.companyName} - ${this.config.mainHeadline}"
                     loading="lazy">
            </div>
        `;
    }

    /**
     * Setup welcome section specific events
     */
    setupWelcomeEvents() {
        // Handle primary button click
        const primaryBtn = document.getElementById('welcomePrimaryBtn');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', (e) => {
                this.handlePrimaryClick(e);
            });
        }
    }

    /**
     * Handle primary button click
     */
    handlePrimaryClick(event) {
        // Track the click if analytics is available
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'CTA',
                event_label: 'Welcome Primary Button',
                value: this.config.ctaText
            });
        }

        // Custom click handler can be added here
        if (this.config.onPrimaryClick && typeof this.config.onPrimaryClick === 'function') {
            this.config.onPrimaryClick(event);
        }
    }

    /**
     * Handle secondary button click
     */
    handleSecondaryClick() {
        if (this.config.secondaryTarget) {
            // Scroll to target section
            this.scrollToSection(this.config.secondaryTarget);
        }

        // Track the click if analytics is available
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Navigation',
                event_label: 'Welcome Secondary Button',
                value: this.config.secondaryText
            });
        }

        // Custom click handler
        if (this.config.onSecondaryClick && typeof this.config.onSecondaryClick === 'function') {
            this.config.onSecondaryClick();
        }
    }

    /**
     * Scroll to target section
     */
    scrollToSection(targetSection) {
        const targetElement = document.querySelector(`div[data-title='${targetSection}']`);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        } else {
            console.warn(`Target section 'div[data-title='${targetSection}']' not found`);
        }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        if (!window.AnimationController) {
            console.warn('AnimationController not loaded');
            return;
        }

        this.animationController = new window.AnimationController();

        // Animate welcome section with predefined sequence
        setTimeout(() => {
            this.animationController.animateSection(this.container, 'welcome');
        }, 100);
    }

    /**
     * Update welcome section configuration
     */
    updateWelcomeConfig(newConfig) {
        const oldConfig = { ...this.config };
        this.updateConfig(newConfig);

        // Update specific components if they changed
        if (oldConfig.mainHeadline !== this.config.mainHeadline) {
            const headline = document.getElementById('mainHeadline');
            if (headline) headline.textContent = this.config.mainHeadline;
        }

        if (oldConfig.subText !== this.config.subText) {
            const subText = document.getElementById('subText');
            if (subText) subText.textContent = this.config.subText;
        }

        if (oldConfig.logoLink !== this.config.logoLink && this.components.badge) {
            this.components.badge.updateLogo(this.config.logoLink, `${this.config.companyName} Logo`);
        }

        if (oldConfig.companyName !== this.config.companyName && this.components.badge) {
            this.components.badge.updateText(`${this.config.workAt} ${this.config.companyName}`);
        }

        if (oldConfig.ctaText !== this.config.ctaText && this.components.buttonManager) {
            const primaryBtn = document.querySelector('#welcomePrimaryBtn');
            if (primaryBtn) {
                this.components.buttonManager.updateButton(
                    primaryBtn.closest('[data-title]'), 
                    this.config.ctaText,
                    'fas fa-arrow-right'
                );
            }
        }

        if (oldConfig.videoId !== this.config.videoId && this.components.video) {
            this.components.video.updateVideo(this.config.videoId);
        }
    }

    /**
     * Get welcome section metrics
     */
    getMetrics() {
        return {
            sectionType: 'welcome',
            config: this.config,
            components: Object.keys(this.components),
            isVisible: this.isInViewport(this.container),
            hasVideo: this.config.mainAsset === 'video' && !!this.config.videoId,
            hasImage: this.config.mainAsset === 'image' && !!this.config.mainImageLink
        };
    }

    /**
     * Cleanup welcome section
     */
    destroy() {
        // Cleanup components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });

        // Cleanup animation controller
        if (this.animationController) {
            this.animationController.destroy();
        }

        // Call parent cleanup
        super.destroy();
    }

    /**
     * Reinitialize welcome section
     */
    reinitialize() {
        this.destroy();
        this.initializeWelcome();
    }

    /**
     * Static method to create welcome section easily
     */
    static create(containerId, config) {
        return new WelcomeSection(config, containerId);
    }

    /**
     * Validate welcome-specific configuration
     */
    validateConfig() {
        const required = ['mainHeadline', 'subText', 'ctaText', 'companyName'];
        const missing = required.filter(field => !this.config[field]);

        if (missing.length > 0) {
            console.error(`Welcome section missing required fields: ${missing.join(', ')}`);
            return false;
        }

        if (this.config.mainAsset === 'video' && !this.config.videoId) {
            console.error('Welcome section: videoId required when mainAsset is "video"');
            return false;
        }

        if (this.config.mainAsset === 'image' && !this.config.mainImageLink) {
            console.error('Welcome section: mainImageLink required when mainAsset is "image"');
            return false;
        }

        return super.validateConfig();
    }
};