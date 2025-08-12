/**
 * Thanks Section
 * Thank you confirmation page with contact modal
 */

window.ThanksSection = class ThanksSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.modalOpen = false;
        this.initializeThanks();
    }

    /**
     * Initialize Thanks section specific functionality
     */
    initializeThanks() {
        if (!this.container) {
            console.error('Thanks section container not found');
            return;
        }

        this.createThanksHTML();
        this.setupEventHandlers();
        this.initializeAnimations();
    }

    /**
     * Create the HTML structure for Thanks section
     */
    createThanksHTML() {
        const config = this.config;
        
        // Generate contact avatar HTML
        let avatarHTML = '';
        if (config.contact.showPortrait && config.contact.portraitUrl) {
            avatarHTML = `<img src="${config.contact.portraitUrl}" alt="Portrait" />`;
        } else {
            // Show initials if no portrait
            const initials = this.getInitials(config.contact.name);
            avatarHTML = initials;
        }

        // Generate complete thanks HTML
        this.container.innerHTML = `
            <div class="thanks-wrapper">
                <div class="thanks-container">
                    <!-- Attention banner -->
                    <div class="thanks-banner fade-in-down mb-6">${config.bannerText}</div>

                    <!-- Success header -->
                    <div class="thanks-center fade-in-up">
                        <div class="thanks-chip" aria-label="${config.confirmationBadgeText}">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>${config.confirmationBadgeText}</span>
                        </div>

                        <h1 class="thanks-title">${config.mainHeadline}</h1>
                        <p class="thanks-subtitle">${config.mainDescription}</p>
                        
                        <button class="thanks-quick-action-btn" id="thanksQuickAction">
                            <i class="fa-solid fa-bolt"></i>
                            <span>${config.quickActionButtonText}</span>
                        </button>
                    </div>

                    <!-- Key info grid -->
                    <div class="thanks-grid fade-in-up slow">
                        <!-- Email check -->
                        <div class="thanks-card">
                            <div class="thanks-card-content">
                                <div class="thanks-media">
                                    <div class="thanks-media-icon" aria-hidden="true">
                                        <i class="fa-solid fa-envelope"></i>
                                    </div>
                                    <div>
                                        <h2>Bitte E-Mails prüfen</h2>
                                        <p>Bitte überprüfe deine E-Mails <span class="thanks-highlight">(auch den Spam-Ordner)</span> für weitere Informationen.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- We will reach out -->
                        <div class="thanks-card">
                            <div class="thanks-card-content">
                                <div class="thanks-media">
                                    <div class="thanks-media-icon" aria-hidden="true">
                                        <i class="fa-solid fa-phone"></i>
                                    </div>
                                    <div>
                                        <h2>Wir melden uns bei dir</h2>
                                        <p>Wir werden uns <span class="thanks-highlight">schnellstmöglich</span> nach Prüfung deiner Daten telefonisch, per Nachricht/WhatsApp oder per E‑Mail bei dir melden.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Social media -->
                        <div class="thanks-card">
                            <div class="thanks-card-content">
                                <div class="thanks-media">
                                    <div class="thanks-media-icon" aria-hidden="true">
                                        <i class="fa-solid fa-share-nodes"></i>
                                    </div>
                                    <div>
                                        <h2>Folge uns auf Social Media</h2>
                                        <p>Bei weiteren Fragen besuche gerne unseren Social‑Media‑Kanal <span class="thanks-highlight">${config.socialMedia.channelName}</span>.</p>
                                    </div>
                                </div>
                                <div class="thanks-btn-wrapper">
                                    <a class="thanks-btn" href="${config.socialMedia.channelUrl}" target="_blank" rel="noreferrer noopener" aria-label="Social-Media-Kanal öffnen">
                                        Zu unseren Socials
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- What to expect section -->
                    <section class="thanks-section fade-in-up slow">
                        <h3 class="thanks-section-title">Was du jetzt erwarten kannst</h3>
                        <div class="thanks-steps">
                            <div class="thanks-step">
                                <div class="thanks-step-index">1</div>
                                <p>Wir prüfen deine Angaben sorgfältig.</p>
                            </div>
                            <div class="thanks-step">
                                <div class="thanks-step-index">2</div>
                                <p>Wir melden uns telefonisch, per Nachricht/WhatsApp oder per E‑Mail bei dir.</p>
                            </div>
                            <div class="thanks-step">
                                <div class="thanks-step-index">3</div>
                                <p>Du erhältst alle nächsten Schritte transparent erklärt.</p>
                            </div>
                        </div>
                    </section>

                    <!-- Subtle footnote -->
                    <p class="thanks-footnote">Tipp: Wenn du keine E‑Mail findest, suche nach unserer Domain und markiere uns als "Kein Spam".</p>
                </div>
            </div>

            <!-- Contact Modal -->
            <div class="thanks-modal-overlay" id="thanksContactModal">
                <div class="thanks-modal">
                    <button class="thanks-modal-close" id="thanksModalClose" aria-label="Modal schließen">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    
                    <div class="thanks-modal-content">
                        <div class="thanks-modal-header">
                            <div class="thanks-modal-icon">
                                <i class="fa-solid fa-rocket fa-lg"></i>
                            </div>
                            <h2 class="thanks-modal-title">Schneller vorankommen?</h2>
                            <p class="thanks-modal-subtitle">
                                Du willst direkt Kontakt aufnehmen oder uns weitere Unterlagen zusenden? Melde dich gerne bei uns!
                            </p>
                        </div>
                        
                        <div class="thanks-contact-person">
                            <div class="thanks-contact-avatar ${!config.contact.showPortrait || !config.contact.portraitUrl ? 'no-image' : ''}">
                                ${avatarHTML}
                            </div>
                            <div class="thanks-contact-info">
                                <p class="thanks-contact-name">${config.contact.name}</p>
                                <p class="thanks-contact-position">${config.contact.position}</p>
                            </div>
                        </div>
                        
                        <div class="thanks-contact-actions">
                            <a href="mailto:${config.contact.email}" class="thanks-contact-button">
                                <i class="fa-solid fa-envelope"></i>
                                <div class="thanks-contact-button-text">
                                    <p class="thanks-contact-button-label">E-Mail senden</p>
                                    <p class="thanks-contact-button-value">${config.contact.email}</p>
                                </div>
                            </a>
                            
                            <a href="tel:${config.contact.phone}" class="thanks-contact-button">
                                <i class="fa-solid fa-phone"></i>
                                <div class="thanks-contact-button-text">
                                    <p class="thanks-contact-button-label">Anrufen</p>
                                    <p class="thanks-contact-button-value">${config.contact.phone}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get initials from name
     */
    getInitials(name) {
        if (!name) return 'KP';
        
        const cleanName = name.replace(/\[.*?\]/g, '').trim();
        const words = cleanName.split(' ');
        const initials = words
            .map(word => word[0])
            .filter(char => char && char !== '[')
            .join('')
            .slice(0, 2)
            .toUpperCase();
        
        return initials || 'KP';
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Quick action button
        const quickActionBtn = this.container.querySelector('#thanksQuickAction');
        if (quickActionBtn) {
            quickActionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Modal close button
        const modalCloseBtn = this.container.querySelector('#thanksModalClose');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        // Modal overlay click
        const modalOverlay = this.container.querySelector('#thanksContactModal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Escape key handler
        this.escapeHandler = (e) => {
            if (e.key === 'Escape' && this.modalOpen) {
                this.closeModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);

        // Track social media click
        const socialBtn = this.container.querySelector('.thanks-btn');
        if (socialBtn) {
            socialBtn.addEventListener('click', (e) => {
                this.trackSocialClick();
            });
        }

        // Track contact button clicks
        const contactButtons = this.container.querySelectorAll('.thanks-contact-button');
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const isEmail = button.href.startsWith('mailto:');
                this.trackContactClick(isEmail ? 'email' : 'phone');
            });
        });
    }

    /**
     * Open modal
     */
    openModal() {
        const modal = this.container.querySelector('#thanksContactModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.modalOpen = true;
            this.trackModalOpen();
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = this.container.querySelector('#thanksContactModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.modalOpen = false;
        }
    }

    /**
     * Track modal open
     */
    trackModalOpen() {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Thanks Page',
                event_label: 'Quick Action Button',
                value: 1
            });
        }

        // Custom handler if provided
        if (this.config.onQuickActionClick && typeof this.config.onQuickActionClick === 'function') {
            this.config.onQuickActionClick();
        }
    }

    /**
     * Track social click
     */
    trackSocialClick() {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Thanks Page',
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
     * Track contact click
     */
    trackContactClick(type) {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Thanks Page',
                event_label: `Contact - ${type}`,
                value: 1
            });
        }

        // Custom handler if provided
        if (this.config.onContactClick && typeof this.config.onContactClick === 'function') {
            this.config.onContactClick(type);
        }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Add animation classes
        requestAnimationFrame(() => {
            const fadeElements = this.container.querySelectorAll('.fade-in-up, .fade-in-down');
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 50);
            });
        });

        // Bounce animation for quick action button
        const quickActionBtn = this.container.querySelector('.thanks-quick-action-btn');
        if (quickActionBtn) {
            quickActionBtn.classList.add('bounce-animation');
        }
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        const required = ['bannerText', 'confirmationBadgeText', 'mainHeadline', 'mainDescription', 'quickActionButtonText'];
        const missing = required.filter(field => !this.config[field]);

        if (missing.length > 0) {
            console.error(`Thanks section missing required fields: ${missing.join(', ')}`);
            return false;
        }

        // Validate contact configuration
        if (!this.config.contact) {
            console.error('Thanks section: contact configuration is required');
            return false;
        }

        const contactRequired = ['name', 'position', 'email', 'phone'];
        const contactMissing = contactRequired.filter(field => !this.config.contact[field]);
        
        if (contactMissing.length > 0) {
            console.error(`Thanks section contact missing required fields: ${contactMissing.join(', ')}`);
            return false;
        }

        // Validate social media configuration
        if (!this.config.socialMedia || !this.config.socialMedia.channelName || !this.config.socialMedia.channelUrl) {
            console.error('Thanks section: socialMedia configuration is required');
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
            this.container.classList.add('thanks-mobile');
        } else {
            this.container.classList.remove('thanks-mobile');
        }
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        return {
            sectionType: 'thanks',
            config: this.config,
            modalOpen: this.modalOpen,
            hasPortrait: this.config.contact.showPortrait && !!this.config.contact.portraitUrl,
            isVisible: this.isInViewport(this.container)
        };
    }

    /**
     * Apply default configuration values
     */
    static getDefaultConfig() {
        return {
            bannerText: "STOPP, schließe noch nicht diese Seite 👇",
            confirmationBadgeText: "Erfolgreich übermittelt",
            mainHeadline: "Vielen Dank für deine Anfrage!",
            mainDescription: "Dein Formular wurde erfolgreich übermittelt.",
            quickActionButtonText: "Schneller vorankommen",
            contact: {
                showPortrait: true,
                portraitUrl: "https://via.placeholder.com/80x80/ff6b35/ffffff?text=MN",
                name: "[NAME_PLACEHOLDER]",
                position: "[POSITION_PLACEHOLDER]",
                email: "[EMAIL_PLACEHOLDER]",
                phone: "[PHONE_PLACEHOLDER]"
            },
            socialMedia: {
                channelName: "PLACEHOLDER",
                channelUrl: "#PLACEHOLDER"
            }
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        // Remove event listeners
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
        }

        // Reset body overflow if modal was open
        if (this.modalOpen) {
            document.body.style.overflow = '';
        }

        super.destroy();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        const mergedConfig = { ...ThanksSection.getDefaultConfig(), ...config };
        return new ThanksSection(mergedConfig, containerId);
    }
};