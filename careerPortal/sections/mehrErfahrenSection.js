/**
 * Mehr Erfahren Section
 * Sticky scroll cards section with About, Benefits, and FAQ cards
 * Now includes bottom CTA with fade-up animation and dynamic position redirect
 */

window.MehrErfahrenSection = class MehrErfahrenSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.cards = [];
        this.ctaObserver = null;
        this.buttonManager = null;
        this.initializeMehrErfahren();
    }

    /**
     * Initialize Mehr Erfahren section specific functionality
     */
    initializeMehrErfahren() {
        if (!this.container) {
            console.error('Mehr Erfahren section container not found');
            return;
        }

        this.createMehrErfahrenHTML();
        this.setupEventHandlers();
        this.initializeAnimations();
        this.setupCTAObserver();
    }

    /**
     * Create the HTML structure for Mehr Erfahren section
     */
    createMehrErfahrenHTML() {
        // Update headline with company placeholder
        const mainHeadline = `Wieso ${this.config.companyPlaceholder}?`;
        
        // Create cards array from config
        const cards = this.buildCardsArray();
        
        // CTA configuration with defaults
        const ctaConfig = {
            headline: this.config.ctaHeadline || "Klingt gut?",
            subtext: this.config.ctaSubtext || "Lass uns gemeinsam durchstarten!",
            buttonText: this.config.ctaButtonText || "Jetzt bewerben",
            buttonLink: this.config.ctaButtonLink || "#bewerbung",
            buttonType: this.config.ctaButtonType || "MainButton1"
        };
        
        // Generate HTML
        this.container.innerHTML = `
            <div class="mehr-wrapper">
                <div class="mehr-container">
                    <h1 class="mehr-headline">${mainHeadline}</h1>
                    <p class="mehr-subheadline">Ziemlich viele gute Gründe.</p>
                    
                    <div class="mehr-cards-wrapper" id="mehr-cards-vertical">
                        ${cards.map(card => this.generateCardHTML(card)).join('')}
                    </div>
                    
                    <!-- Bottom CTA Section -->
                    <div class="mehr-bottom-cta" id="mehr-cta-section">
                        <h2 class="mehr-cta-headline">${ctaConfig.headline}</h2>
                        <p class="mehr-cta-subtext">${ctaConfig.subtext}</p>
                        <div class="mehr-cta-button-wrapper" id="mehr-cta-button-container">
                            <!-- Button will be created here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Setup CTA button after HTML is created
        this.setupCTAButton(ctaConfig);
    }

    /**
     * Setup CTA button using ButtonManager with dynamic position redirect
     */
    setupCTAButton(ctaConfig) {
        const buttonContainer = document.getElementById('mehr-cta-button-container');
        if (!buttonContainer) return;

        // Check if ButtonManager is available
        if (window.ButtonManager) {
            this.buttonManager = new window.ButtonManager();
            
            // Create the CTA button with position redirect logic
            const ctaButton = this.buttonManager.createButton(
                ctaConfig.buttonType,
                {
                    text: ctaConfig.buttonText,
                    href: ctaConfig.buttonLink,
                    icon: 'fas fa-arrow-right',
                    id: 'mehrCTABtn',
                    usePositionRedirect: true, // Enable position redirect
                    fallbackSection: 'positions-section' // Fallback to positions section if no position data
                }
            );
            
            buttonContainer.appendChild(ctaButton);
            
            // Log position redirect status
            const hasRedirect = this.buttonManager.hasPositionRedirect();
            const positionData = this.buttonManager.getPositionData();
            
            console.log('Mehr Erfahren Section - Position redirect active:', hasRedirect);
            if (positionData) {
                console.log('Mehr Erfahren Section - Using position:', positionData.position);
                console.log('Mehr Erfahren Section - ContentId:', positionData.contentId);
            } else {
                console.log('Mehr Erfahren Section - No position data, button will use fallback');
            }
            
            // Add custom click handler if provided
            if (this.config.onCTAClick && typeof this.config.onCTAClick === 'function') {
                const btn = ctaButton.querySelector('button, a');
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        // Don't prevent default as ButtonManager handles navigation
                        this.config.onCTAClick(e);
                    });
                }
            }
        } else {
            // Fallback if ButtonManager not loaded (shouldn't happen)
            console.warn('ButtonManager not available, using fallback button');
            buttonContainer.innerHTML = `
                <div data-title="${ctaConfig.buttonType}">
                    <a href="${ctaConfig.buttonLink}" id="mehrCTABtn">
                        ${ctaConfig.buttonText} <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }

    /**
     * Setup intersection observer for CTA animation
     */
    setupCTAObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show CTA immediately if IntersectionObserver not supported
            const ctaSection = document.getElementById('mehr-cta-section');
            if (ctaSection) {
                ctaSection.classList.add('visible');
            }
            return;
        }

        const ctaSection = document.getElementById('mehr-cta-section');
        if (!ctaSection) return;

        // Create observer for CTA section
        this.ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class to trigger animation
                    entry.target.classList.add('visible');
                    
                    // Stagger animations for elements
                    const headline = entry.target.querySelector('.mehr-cta-headline');
                    const subtext = entry.target.querySelector('.mehr-cta-subtext');
                    const button = entry.target.querySelector('.mehr-cta-button-wrapper');
                    
                    if (headline) headline.classList.add('fade-up-1');
                    if (subtext) subtext.classList.add('fade-up-2');
                    if (button) button.classList.add('fade-up-3');
                    
                    // Stop observing after animation triggers
                    this.ctaObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Start observing
        this.ctaObserver.observe(ctaSection);
    }

    /**
     * Build cards array from config
     */
    buildCardsArray() {
        const cards = [];
        
        if (this.config.aboutCard && this.config.aboutCard.enabled) {
            cards.push({
                order: this.config.aboutCard.order,
                type: 'about',
                data: this.config.aboutCard
            });
        }
        
        if (this.config.benefitsCard && this.config.benefitsCard.enabled) {
            cards.push({
                order: this.config.benefitsCard.order,
                type: 'benefits',
                data: this.config.benefitsCard
            });
        }
        
        if (this.config.faqCard && this.config.faqCard.enabled) {
            cards.push({
                order: this.config.faqCard.order,
                type: 'faq',
                data: this.config.faqCard
            });
        }
        
        // Sort cards by order
        cards.sort((a, b) => a.order - b.order);
        this.cards = cards;
        
        return cards;
    }

    /**
     * Generate HTML for a single card
     */
    generateCardHTML(card) {
        let contentHTML = '';
        
        switch (card.type) {
            case 'about':
                contentHTML = this.generateAboutCardContent(card.data);
                break;
            case 'benefits':
                contentHTML = this.generateBenefitsCardContent(card.data);
                break;
            case 'faq':
                contentHTML = this.generateFAQCardContent(card.data);
                break;
        }
        
        return `
            <div class="mehr-card" data-card-type="${card.type}">
                <div class="mehr-card-content">
                    <i class="mehr-card-icon ${card.data.icon}"></i>
                    <h2>${card.data.title}</h2>
                    ${contentHTML}
                </div>
                <div class="mehr-card-image">
                    <img src="${card.data.imageUrl}" alt="${card.data.title}">
                </div>
            </div>
        `;
    }

    /**
     * Generate About card content
     */
    generateAboutCardContent(data) {
        return `<p>${data.text}</p>`;
    }

    /**
     * Generate Benefits card content with scrolling list
     */
    generateBenefitsCardContent(data) {
        const benefitsList = data.benefits.map(benefit => 
            `<li>${benefit.emoji} ${benefit.text}</li>`
        ).join('');
        
        return `
            <div class="mehr-bullet-list-container">
                <ul class="mehr-bullet-list">
                    ${benefitsList}
                </ul>
                <ul class="mehr-bullet-list" aria-hidden="true">
                    ${benefitsList}
                </ul>
            </div>
        `;
    }

    /**
     * Generate FAQ card content with accordions
     */
    generateFAQCardContent(data) {
        const faqItems = data.faqs.map((faq, index) => `
            <div class="mehr-accordion-item" data-faq-index="${index}">
                <button class="mehr-accordion-header">
                    <span>${faq.question}</span>
                    <span class="mehr-accordion-icon">+</span>
                </button>
                <div class="mehr-accordion-content">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="mehr-accordion-container">
                ${faqItems}
            </div>
        `;
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Card click animations
        const cards = this.container.querySelectorAll('.mehr-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger card animation if clicking accordion
                if (!e.target.closest('.mehr-accordion-header')) {
                    this.animateCardClick(card);
                }
            });
        });

        // Accordion functionality
        const accordionHeaders = this.container.querySelectorAll('.mehr-accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleAccordion(header);
            });
        });
    }

    /**
     * Animate card click
     */
    animateCardClick(card) {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
    }

    /**
     * Toggle accordion item
     */
    toggleAccordion(header) {
        const accordionItem = header.parentElement;
        const wasActive = accordionItem.classList.contains('active');
        
        // Close all accordion items
        this.container.querySelectorAll('.mehr-accordion-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current item
        if (!wasActive) {
            accordionItem.classList.add('active');
        }

        // Track accordion interaction
        if (window.gtag) {
            const question = header.querySelector('span').textContent;
            window.gtag('event', 'accordion_toggle', {
                event_category: 'FAQ',
                event_label: question,
                value: wasActive ? 0 : 1
            });
        }
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Cards fade in on load
        const cards = this.container.querySelectorAll('.mehr-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 * (index + 1));
        });

        // Observe for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => observer.observe(card));
        }
    }

    /**
     * Refresh position data for button
     * Can be called to update button behavior after positions load
     */
    refreshPositionData() {
        if (this.buttonManager) {
            // Re-initialize position data
            this.buttonManager.initializePositionData();
            
            // Log updated status
            const hasRedirect = this.buttonManager.hasPositionRedirect();
            console.log('Mehr Erfahren Section - Position data refreshed, redirect active:', hasRedirect);
        }
    }

    /**
     * Update configuration
     */
    updateMehrErfahrenConfig(newConfig) {
        this.updateConfig(newConfig);
        this.reinitialize();
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        const enabledCards = this.cards.filter(card => card.data.enabled);
        const positionData = this.buttonManager ? 
            this.buttonManager.getPositionData() : null;
        
        return {
            sectionType: 'mehrErfahren',
            config: this.config,
            totalCards: this.cards.length,
            enabledCards: enabledCards.length,
            cardTypes: enabledCards.map(c => c.type),
            isVisible: this.isInViewport(this.container),
            hasAccordions: this.container.querySelectorAll('.mehr-accordion-item').length > 0,
            ctaVisible: this.container.querySelector('.mehr-bottom-cta.visible') !== null,
            hasPositionRedirect: !!(positionData && positionData.applicationUrl),
            positionId: positionData?.id || null,
            contentId: positionData?.contentId || null
        };
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        if (!this.config.companyPlaceholder) {
            console.error('Mehr Erfahren section: companyPlaceholder is required');
            return false;
        }

        // Check at least one card is enabled
        const hasEnabledCard = 
            (this.config.aboutCard && this.config.aboutCard.enabled) ||
            (this.config.benefitsCard && this.config.benefitsCard.enabled) ||
            (this.config.faqCard && this.config.faqCard.enabled);

        if (!hasEnabledCard) {
            console.error('Mehr Erfahren section: At least one card must be enabled');
            return false;
        }

        return super.validateConfig();
    }

    /**
     * Handle responsive updates
     */
    onResize() {
        const breakpoint = this.getCurrentBreakpoint();
        
        // Adjust card layout for mobile
        if (breakpoint === 'mobile') {
            this.container.classList.add('mobile-view');
        } else {
            this.container.classList.remove('mobile-view');
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        // Remove event listeners
        const cards = this.container.querySelectorAll('.mehr-card');
        cards.forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });

        // Cleanup CTA observer
        if (this.ctaObserver) {
            this.ctaObserver.disconnect();
            this.ctaObserver = null;
        }

        // Cleanup button manager reference
        this.buttonManager = null;

        super.destroy();
    }

    /**
     * Reinitialize section
     */
    reinitialize() {
        this.destroy();
        this.initializeMehrErfahren();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        return new MehrErfahrenSection(config, containerId);
    }
};
