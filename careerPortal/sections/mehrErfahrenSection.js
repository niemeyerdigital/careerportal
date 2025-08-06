/**
 * Mehr Erfahren Section
 * Sticky scroll cards section with About, Benefits, and FAQ cards
 */

window.MehrErfahrenSection = class MehrErfahrenSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.activeAccordionIndex = 0;
        this.initializeMehrErfahren();
    }

    /**
     * Initialize the Mehr Erfahren section
     */
    initializeMehrErfahren() {
        if (!this.container) {
            console.error('Mehr Erfahren section container not found');
            return;
        }

        this.createMehrErfahrenHTML();
        this.setupAccordions();
        this.initializeAnimations();
    }

    /**
     * Create the HTML structure
     */
    createMehrErfahrenHTML() {
        const { companyPlaceholder, aboutCard, benefitsCard, faqCard } = this.config;

        // Sort cards by order
        const cards = [];
        if (aboutCard?.enabled) cards.push({ ...aboutCard, type: 'about' });
        if (benefitsCard?.enabled) cards.push({ ...benefitsCard, type: 'benefits' });
        if (faqCard?.enabled) cards.push({ ...faqCard, type: 'faq' });
        
        cards.sort((a, b) => (a.order || 0) - (b.order || 0));

        const cardsHTML = cards.map((card, index) => this.createCardHTML(card, index)).join('');

        this.container.innerHTML = `
            <div class="mehr-erfahren-wrapper">
                <div class="static-header">
                    <div class="static-header-content">
                        <h1>Warum <span class="company-highlight">${companyPlaceholder || 'UNTERNEHMEN'}</span>?</h1>
                        <p>Entdecke, was uns besonders macht</p>
                    </div>
                </div>
                <div class="sticky-wrapper">
                    ${cardsHTML}
                </div>
            </div>
        `;
    }

    /**
     * Create individual card HTML based on type
     */
    createCardHTML(card, index) {
        const topOffset = 100 + (index * 30); // Progressive offset for stacking
        const zIndex = 10 - index;
        
        switch (card.type) {
            case 'about':
                return this.createAboutCard(card, topOffset, zIndex);
            case 'benefits':
                return this.createBenefitsCard(card, topOffset, zIndex);
            case 'faq':
                return this.createFAQCard(card, topOffset, zIndex);
            default:
                return '';
        }
    }

    /**
     * Create About card HTML
     */
    createAboutCard(card, topOffset, zIndex) {
        return `
            <div class="card card-about" style="top: ${topOffset}px; z-index: ${zIndex};">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="${card.icon || 'fas fa-building'}"></i>
                        </div>
                        <h2>${card.title || 'Über Uns'}</h2>
                    </div>
                    <p>${card.text || 'Beschreibung...'}</p>
                </div>
                <div class="card-image">
                    <img src="${card.imageUrl || 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Image'}" 
                         alt="${card.title || 'About'}" 
                         loading="lazy">
                </div>
            </div>
        `;
    }

    /**
     * Create Benefits card HTML
     */
    createBenefitsCard(card, topOffset, zIndex) {
        const benefitsHTML = (card.benefits || []).map(benefit => `
            <li>
                <span class="benefit-emoji">${benefit.emoji || '✓'}</span>
                <span class="benefit-text">${benefit.text || ''}</span>
            </li>
        `).join('');

        return `
            <div class="card card-benefits" style="top: ${topOffset}px; z-index: ${zIndex};">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="${card.icon || 'fas fa-star'}"></i>
                        </div>
                        <h2>${card.title || 'Deine Vorteile'}</h2>
                    </div>
                    <ul class="card-features">
                        ${benefitsHTML}
                    </ul>
                </div>
                <div class="card-image">
                    <img src="${card.imageUrl || 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Benefits'}" 
                         alt="${card.title || 'Benefits'}" 
                         loading="lazy">
                </div>
            </div>
        `;
    }

    /**
     * Create FAQ card HTML
     */
    createFAQCard(card, topOffset, zIndex) {
        const faqsHTML = (card.faqs || []).map((faq, index) => `
            <div class="faq-item ${index === 0 ? 'active' : ''}" data-faq-index="${index}">
                <div class="faq-question">
                    <span>${faq.question || 'Frage...'}</span>
                    <i class="faq-icon fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <p>${faq.answer || 'Antwort...'}</p>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="card card-faq" style="top: ${topOffset}px; z-index: ${zIndex};">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="${card.icon || 'fas fa-question-circle'}"></i>
                        </div>
                        <h2>${card.title || 'Häufige Fragen'}</h2>
                    </div>
                    <div class="faq-container">
                        ${faqsHTML}
                    </div>
                </div>
                <div class="card-image">
                    <img src="${card.imageUrl || 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=FAQ'}" 
                         alt="${card.title || 'FAQ'}" 
                         loading="lazy">
                </div>
            </div>
        `;
    }

    /**
     * Setup accordion functionality for FAQ
     */
    setupAccordions() {
        const faqItems = this.container.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAccordion(index);
            });
        });
    }

    /**
     * Toggle accordion item
     */
    toggleAccordion(clickedIndex) {
        const faqItems = this.container.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            if (index === clickedIndex) {
                // Toggle clicked item
                const isActive = item.classList.contains('active');
                item.classList.toggle('active');
                
                // Update icon rotation
                const icon = item.querySelector('.faq-icon');
                if (icon) {
                    icon.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            } else {
                // Close all other items
                item.classList.remove('active');
                const icon = item.querySelector('.faq-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        if (!window.AnimationController) {
            console.warn('AnimationController not loaded, skipping animations');
            return;
        }

        this.animationController = new window.AnimationController();

        // Animate header
        const header = this.container.querySelector('.static-header');
        if (header) {
            this.animationController.animateEntrance([header], 'slideUp', {
                startDelay: 100
            });
        }

        // Animate cards on scroll
        const cards = this.container.querySelectorAll('.card');
        this.animationController.animateOnScroll(Array.from(cards), {
            animationType: 'slideUp',
            threshold: 0.2,
            staggerDelay: 150
        });
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
        const enabledCards = [];
        if (this.config.aboutCard?.enabled) enabledCards.push('about');
        if (this.config.benefitsCard?.enabled) enabledCards.push('benefits');
        if (this.config.faqCard?.enabled) enabledCards.push('faq');

        return {
            sectionType: 'mehrErfahren',
            companyName: this.config.companyPlaceholder,
            enabledCards: enabledCards,
            benefitsCount: this.config.benefitsCard?.benefits?.length || 0,
            faqCount: this.config.faqCard?.faqs?.length || 0,
            isVisible: this.isInViewport(this.container)
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.animationController) {
            this.animationController.destroy();
        }
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
     * Validate configuration
     */
    validateConfig() {
        if (!this.config.companyPlaceholder) {
            console.warn('Mehr Erfahren section: companyPlaceholder not provided');
        }

        const hasAtLeastOneCard = 
            this.config.aboutCard?.enabled || 
            this.config.benefitsCard?.enabled || 
            this.config.faqCard?.enabled;

        if (!hasAtLeastOneCard) {
            console.error('Mehr Erfahren section: At least one card must be enabled');
            return false;
        }

        return super.validateConfig();
    }

    /**
     * Static creation method
     */
    static create(containerId, config) {
        return new MehrErfahrenSection(config, containerId);
    }
};
