/**
 * Mehr Erfahren Section
 * Sticky scroll cards implementation for career portal
 */

window.MehrErfahrenSection = class MehrErfahrenSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
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

        this.createHTML();
        this.setupFAQAccordion();
        this.initializeAnimations();
    }

    /**
     * Create the HTML structure
     */
    createHTML() {
        // Create wrapper with gradient background
        const wrapper = document.createElement('div');
        wrapper.className = 'mehr-erfahren-wrapper';
        
        // Create static header
        const staticHeader = document.createElement('div');
        staticHeader.className = 'static-header';
        staticHeader.innerHTML = `
            <div class="static-header-content">
                <h1>Warum ${this.config.companyPlaceholder || 'UNTERNEHMEN'}?</h1>
                <p>Entdecke was uns besonders macht</p>
            </div>
        `;
        
        // Create sticky wrapper for cards
        const stickyWrapper = document.createElement('div');
        stickyWrapper.className = 'sticky-wrapper';
        
        // Sort cards by order
        const cards = this.getEnabledCards();
        
        cards.forEach((cardConfig, index) => {
            const card = this.createCard(cardConfig, index);
            stickyWrapper.appendChild(card);
        });
        
        // Assemble the structure
        wrapper.appendChild(staticHeader);
        wrapper.appendChild(stickyWrapper);
        this.container.appendChild(wrapper);
    }

    /**
     * Get enabled cards sorted by order
     */
    getEnabledCards() {
        const cards = [];
        
        if (this.config.aboutCard?.enabled) {
            cards.push({ ...this.config.aboutCard, type: 'about' });
        }
        if (this.config.benefitsCard?.enabled) {
            cards.push({ ...this.config.benefitsCard, type: 'benefits' });
        }
        if (this.config.faqCard?.enabled) {
            cards.push({ ...this.config.faqCard, type: 'faq' });
        }
        
        return cards.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    /**
     * Create individual card based on type
     */
    createCard(cardConfig, index) {
        const card = document.createElement('div');
        card.className = `card card-${index + 1} card-${cardConfig.type}`;
        card.setAttribute('data-card-type', cardConfig.type);
        
        switch(cardConfig.type) {
            case 'about':
                card.innerHTML = this.createAboutCard(cardConfig);
                break;
            case 'benefits':
                card.innerHTML = this.createBenefitsCard(cardConfig);
                break;
            case 'faq':
                card.innerHTML = this.createFAQCard(cardConfig);
                break;
        }
        
        return card;
    }

    /**
     * Create About Card HTML
     */
    createAboutCard(config) {
        return `
            <div class="card-content">
                <div class="card-icon">
                    <i class="${config.icon || 'fas fa-building'}"></i>
                </div>
                <h2>${config.title || 'Über Uns'}</h2>
                <p>${config.text || 'Beschreibung hier...'}</p>
            </div>
            <div class="card-image">
                <img src="${config.imageUrl || 'https://placehold.co/350x150'}" 
                     alt="${config.title || 'About'}" 
                     loading="lazy">
            </div>
        `;
    }

    /**
     * Create Benefits Card HTML
     */
    createBenefitsCard(config) {
        const benefitsList = (config.benefits || []).map(benefit => `
            <li>
                <span class="benefit-emoji">${benefit.emoji || '✓'}</span>
                <span class="benefit-text">${benefit.text || ''}</span>
            </li>
        `).join('');
        
        return `
            <div class="card-content">
                <div class="card-icon">
                    <i class="${config.icon || 'fas fa-star'}"></i>
                </div>
                <h2>${config.title || 'Deine Vorteile'}</h2>
                <ul class="card-features">
                    ${benefitsList}
                </ul>
            </div>
            <div class="card-image">
                <img src="${config.imageUrl || 'https://placehold.co/350x150'}" 
                     alt="${config.title || 'Benefits'}" 
                     loading="lazy">
            </div>
        `;
    }

    /**
     * Create FAQ Card HTML
     */
    createFAQCard(config) {
        const faqItems = (config.faqs || []).map((faq, index) => `
            <div class="faq-item ${index === 0 ? 'active' : ''}" data-faq-index="${index}">
                <div class="faq-question">
                    <span>${faq.question || 'Frage?'}</span>
                    <div class="faq-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6 8L10 12L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <p>${faq.answer || 'Antwort...'}</p>
                    </div>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="card-content">
                <div class="card-icon">
                    <i class="${config.icon || 'fas fa-question-circle'}"></i>
                </div>
                <h2>${config.title || 'Häufige Fragen'}</h2>
                <div class="faq-container">
                    ${faqItems}
                </div>
            </div>
            <div class="card-image">
                <img src="${config.imageUrl || 'https://placehold.co/350x150'}" 
                     alt="${config.title || 'FAQ'}" 
                     loading="lazy">
            </div>
        `;
    }

    /**
     * Setup FAQ accordion functionality
     */
    setupFAQAccordion() {
        const faqItems = this.container.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question?.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        if (!window.AnimationController) {
            return;
        }

        const animationController = new window.AnimationController();
        const cards = this.container.querySelectorAll('.card');
        
        // Animate cards on scroll
        animationController.animateOnScroll(Array.from(cards), {
            threshold: 0.2,
            animationType: 'fadeIn',
            staggerDelay: 150
        });
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        if (!this.config.companyPlaceholder) {
            console.warn('Mehr Erfahren: companyPlaceholder not provided, using default');
            this.config.companyPlaceholder = 'UNTERNEHMEN';
        }
        
        // Ensure at least one card is enabled
        const hasEnabledCard = 
            this.config.aboutCard?.enabled || 
            this.config.benefitsCard?.enabled || 
            this.config.faqCard?.enabled;
        
        if (!hasEnabledCard) {
            console.error('Mehr Erfahren: No cards enabled');
            return false;
        }
        
        return super.validateConfig();
    }

    /**
     * Update configuration
     */
    updateMehrErfahrenConfig(newConfig) {
        this.updateConfig(newConfig);
        this.container.innerHTML = '';
        this.initializeMehrErfahren();
    }

    /**
     * Cleanup
     */
    destroy() {
        // Remove event listeners
        const faqQuestions = this.container.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.replaceWith(question.cloneNode(true));
        });
        
        super.destroy();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        return new MehrErfahrenSection(config, containerId);
    }
};
