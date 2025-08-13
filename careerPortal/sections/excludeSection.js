/**
 * Exclude Section
 * Rejection page with compassionate messaging and alternative paths
 */

window.ExcludeSection = class ExcludeSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.modalOpen = false;
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
        
        // Generate talent pool button if enabled
        let talentPoolButton = '';
        if (config.talentPool.enabled) {
            talentPoolButton = `
                <button class="exclude-talent-pool-btn" id="excludeTalentPool">
                    <i class="fa-solid fa-user-plus"></i>
                    <span>${config.talentPool.buttonText}</span>
                </button>
            `;
        }

        // Generate alternative paths HTML
        let alternativePathsHTML = '';
        if (config.alternativePaths && config.alternativePaths.length > 0) {
            alternativePathsHTML = config.alternativePaths.map(path => `
                <div class="exclude-path">
                    <div class="exclude-path-icon">
                        <i class="${path.icon}"></i>
                    </div>
                    <div class="exclude-path-content">
                        <h3>${path.title}</h3>
                        <p>${path.description}</p>
                        ${path.linkUrl ? `
                            <a href="${path.linkUrl}" class="exclude-path-link" target="_blank" rel="noreferrer noopener">
                                ${path.linkText} <i class="fa-solid fa-arrow-right"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }

        // Generate tips HTML
        let tipsHTML = '';
        if (config.improvementTips && config.improvementTips.length > 0) {
            tipsHTML = `
                <section class="exclude-section fade-in-up slow">
                    <h3 class="exclude-section-title">${config.improvementHeadline}</h3>
                    <div class="exclude-tips">
                        ${config.improvementTips.map((tip, index) => `
                            <div class="exclude-tip">
                                <div class="exclude-tip-index">${index + 1}</div>
                                <p>${tip}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }

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
                        
                        ${talentPoolButton}
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

                    <!-- Alternative paths grid -->
                    ${alternativePathsHTML ? `
                        <div class="exclude-paths-container fade-in-up slow">
                            <h2 class="exclude-paths-title">${config.alternativePathsTitle}</h2>
                            <div class="exclude-paths-grid">
                                ${alternativePathsHTML}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Improvement tips -->
                    ${tipsHTML}

                    <!-- Footer section with social -->
                    <div class="exclude-footer fade-in-up slow">
                        <div class="exclude-footer-content">
                            <p class="exclude-footer-text">${config.footerText}</p>
                            <div class="exclude-social-links">
                                ${config.socialMedia.linkedin.enabled ? `
                                    <a href="${config.socialMedia.linkedin.url}" class="exclude-social-link" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                                        <i class="fab fa-linkedin-in"></i>
                                    </a>
                                ` : ''}
                                ${config.socialMedia.facebook.enabled ? `
                                    <a href="${config.socialMedia.facebook.url}" class="exclude-social-link" target="_blank" rel="noreferrer noopener" aria-label="Facebook">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                ` : ''}
                                ${config.socialMedia.instagram.enabled ? `
                                    <a href="${config.socialMedia.instagram.url}" class="exclude-social-link" target="_blank" rel="noreferrer noopener" aria-label="Instagram">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                ` : ''}
                                ${config.socialMedia.xing.enabled ? `
                                    <a href="${config.socialMedia.xing.url}" class="exclude-social-link" target="_blank" rel="noreferrer noopener" aria-label="XING">
                                        <i class="fab fa-xing"></i>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Talent Pool Modal -->
            ${config.talentPool.enabled ? `
                <div class="exclude-modal-overlay" id="excludeTalentModal">
                    <div class="exclude-modal">
                        <button class="exclude-modal-close" id="excludeModalClose" aria-label="Modal schließen">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        
                        <div class="exclude-modal-content">
                            <div class="exclude-modal-header">
                                <div class="exclude-modal-icon">
                                    <i class="fa-solid fa-users"></i>
                                </div>
                                <h2 class="exclude-modal-title">${config.talentPool.modalTitle}</h2>
                                <p class="exclude-modal-subtitle">${config.talentPool.modalDescription}</p>
                            </div>
                            
                            <form class="exclude-talent-form" id="excludeTalentForm">
                                <div class="exclude-form-group">
                                    <label for="talentEmail">E-Mail-Adresse</label>
                                    <input type="email" id="talentEmail" name="email" required placeholder="deine@email.de">
                                </div>
                                
                                <div class="exclude-form-group">
                                    <label for="talentPhone">Telefonnummer (optional)</label>
                                    <input type="tel" id="talentPhone" name="phone" placeholder="+49 123 456789">
                                </div>
                                
                                <div class="exclude-form-group">
                                    <label for="talentInterests">Interessensbereiche</label>
                                    <select id="talentInterests" name="interests" multiple>
                                        ${config.talentPool.interests.map(interest => `
                                            <option value="${interest}">${interest}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                
                                <div class="exclude-form-checkbox">
                                    <input type="checkbox" id="talentConsent" name="consent" required>
                                    <label for="talentConsent">
                                        Ich stimme zu, dass meine Daten für zukünftige Stellenangebote gespeichert werden.
                                    </label>
                                </div>
                                
                                <button type="submit" class="exclude-form-submit">
                                    <i class="fa-solid fa-paper-plane"></i>
                                    <span>In Talentpool aufnehmen</span>
                                </button>
                            </form>
                            
                            <div class="exclude-form-success" id="excludeFormSuccess" style="display: none;">
                                <i class="fa-solid fa-check-circle"></i>
                                <h3>Erfolgreich registriert!</h3>
                                <p>Wir haben deine Daten erhalten und melden uns bei passenden Positionen.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Talent pool button
        const talentPoolBtn = this.container.querySelector('#excludeTalentPool');
        if (talentPoolBtn) {
            talentPoolBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Modal close button
        const modalCloseBtn = this.container.querySelector('#excludeModalClose');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        // Modal overlay click
        const modalOverlay = this.container.querySelector('#excludeTalentModal');
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

        // Talent pool form submission
        const talentForm = this.container.querySelector('#excludeTalentForm');
        if (talentForm) {
            talentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTalentPoolSubmit(e.target);
            });
        }

        // Track alternative path clicks
        const pathLinks = this.container.querySelectorAll('.exclude-path-link');
        pathLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const pathTitle = link.closest('.exclude-path').querySelector('h3').textContent;
                this.trackPathClick(pathTitle);
            });
        });

        // Track social media clicks
        const socialLinks = this.container.querySelectorAll('.exclude-social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = link.getAttribute('aria-label');
                this.trackSocialClick(platform);
            });
        });
    }

    /**
     * Handle talent pool form submission
     */
    async handleTalentPoolSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Get selected interests
        const selectElement = form.querySelector('#talentInterests');
        const selectedOptions = Array.from(selectElement.selectedOptions);
        data.interests = selectedOptions.map(option => option.value);

        // Show loading state
        const submitBtn = form.querySelector('.exclude-form-submit');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Wird gesendet...</span>';
        submitBtn.disabled = true;

        try {
            // Call custom handler if provided
            if (this.config.talentPool.onSubmit && typeof this.config.talentPool.onSubmit === 'function') {
                await this.config.talentPool.onSubmit(data);
            }

            // Track submission
            this.trackTalentPoolSubmit(data);

            // Show success message
            form.style.display = 'none';
            const successMsg = this.container.querySelector('#excludeFormSuccess');
            if (successMsg) {
                successMsg.style.display = 'block';
            }

            // Close modal after delay
            setTimeout(() => {
                this.closeModal();
                // Reset form for next use
                form.reset();
                form.style.display = 'block';
                successMsg.style.display = 'none';
            }, 3000);

        } catch (error) {
            console.error('Error submitting talent pool form:', error);
            // Reset button
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            alert('Es gab einen Fehler. Bitte versuche es später erneut.');
        }
    }

    /**
     * Open modal
     */
    openModal() {
        const modal = this.container.querySelector('#excludeTalentModal');
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
        const modal = this.container.querySelector('#excludeTalentModal');
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
                event_category: 'Exclude Page',
                event_label: 'Talent Pool Button',
                value: 1
            });
        }
    }

    /**
     * Track talent pool submission
     */
    trackTalentPoolSubmit(data) {
        if (window.gtag) {
            window.gtag('event', 'submit', {
                event_category: 'Exclude Page',
                event_label: 'Talent Pool Registration',
                value: 1
            });
        }
    }

    /**
     * Track alternative path click
     */
    trackPathClick(pathTitle) {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Exclude Page',
                event_label: `Alternative Path - ${pathTitle}`,
                value: 1
            });
        }

        // Custom handler if provided
        if (this.config.onPathClick && typeof this.config.onPathClick === 'function') {
            this.config.onPathClick(pathTitle);
        }
    }

    /**
     * Track social click
     */
    trackSocialClick(platform) {
        if (window.gtag) {
            window.gtag('event', 'click', {
                event_category: 'Exclude Page',
                event_label: `Social Media - ${platform}`,
                value: 1
            });
        }

        // Custom handler if provided
        if (this.config.onSocialClick && typeof this.config.onSocialClick === 'function') {
            this.config.onSocialClick(platform);
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

        // Add gentle pulse to talent pool button if enabled
        const talentPoolBtn = this.container.querySelector('.exclude-talent-pool-btn');
        if (talentPoolBtn && this.config.talentPool.enabled) {
            talentPoolBtn.classList.add('pulse-animation');
        }
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        const required = ['statusBadgeText', 'mainHeadline', 'mainDescription', 'messageTitle', 'messageText'];
        const missing = required.filter(field => !this.config[field]);

        if (missing.length > 0) {
            console.error(`Exclude section missing required fields: ${missing.join(', ')}`);
            return false;
        }

        // Validate talent pool if enabled
        if (this.config.talentPool && this.config.talentPool.enabled) {
            const talentRequired = ['buttonText', 'modalTitle', 'modalDescription'];
            const talentMissing = talentRequired.filter(field => !this.config.talentPool[field]);
            
            if (talentMissing.length > 0) {
                console.error(`Exclude section talent pool missing required fields: ${talentMissing.join(', ')}`);
                return false;
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
            modalOpen: this.modalOpen,
            talentPoolEnabled: this.config.talentPool.enabled,
            alternativePathsCount: this.config.alternativePaths ? this.config.alternativePaths.length : 0,
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
            alternativePathsTitle: "Alternative Möglichkeiten",
            alternativePaths: [
                {
                    icon: "fa-solid fa-bell",
                    title: "Job-Alerts aktivieren",
                    description: "Erhalte Benachrichtigungen über neue Stellen, die zu deinem Profil passen.",
                    linkText: "Alerts einrichten",
                    linkUrl: "#job-alerts"
                },
                {
                    icon: "fa-solid fa-graduation-cap",
                    title: "Weiterbildung",
                    description: "Erweitere deine Fähigkeiten mit unseren empfohlenen Kursen und Zertifizierungen.",
                    linkText: "Kurse entdecken",
                    linkUrl: "#courses"
                },
                {
                    icon: "fa-solid fa-network-wired",
                    title: "Netzwerk erweitern",
                    description: "Vernetze dich mit Professionals aus deiner Branche und bleibe über Chancen informiert.",
                    linkText: "Zum Netzwerk",
                    linkUrl: "#network"
                }
            ],
            improvementHeadline: "Tipps für deine nächste Bewerbung",
            improvementTips: [
                "Passe deinen Lebenslauf gezielt auf die jeweilige Stellenausschreibung an",
                "Erweitere deine Qualifikationen durch relevante Weiterbildungen oder Zertifikate",
                "Sammle praktische Erfahrung durch Praktika oder Freelance-Projekte",
                "Optimiere dein LinkedIn-Profil und baue dein berufliches Netzwerk aus"
            ],
            footerText: "Wir wünschen dir viel Erfolg für deinen weiteren Werdegang! Folge uns auf Social Media für Updates zu neuen Positionen.",
            talentPool: {
                enabled: true,
                buttonText: "In Talentpool aufnehmen",
                modalTitle: "Bleib mit uns in Kontakt",
                modalDescription: "Lass uns deine Daten speichern und wir informieren dich, sobald eine passende Position frei wird.",
                interests: ["Vertrieb", "Marketing", "IT", "Operations", "Finance", "HR", "Andere"],
                onSubmit: null // Custom handler function
            },
            socialMedia: {
                linkedin: {
                    enabled: false,
                    url: "#",
                    icon: "fab fa-linkedin-in"
                },
                facebook: {
                    enabled: false,
                    url: "#",
                    icon: "fab fa-facebook-f"
                },
                instagram: {
                    enabled: false,
                    url: "#",
                    icon: "fab fa-instagram"
                },
                xing: {
                    enabled: false,
                    url: "#",
                    icon: "fab fa-xing"
                }
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
        const mergedConfig = { ...ExcludeSection.getDefaultConfig(), ...config };
        return new ExcludeSection(mergedConfig, containerId);
    }
};