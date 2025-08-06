/**
 * Mehr Erfahren Section
 * Simple sticky card stack - based on vertical stack pattern
 */

window.MehrErfahrenSection = class MehrErfahrenSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.cards = [];
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
        this.initializeAnimations();
        this.bindEvents();
    }

    /**
     * Create the HTML structure based on simple sticky stack pattern
     */
    createMehrErfahrenHTML() {
        const orderedCards = this.getOrderedCards();
        
        this.container.innerHTML = `
            <div class="mehr-erfahren-wrapper">
                <!-- Static Header -->
                <div class="section-header">
                    <h1>Warum <span class="title-highlight">${this.config.companyPlaceholder || 'UNTERNEHMEN'}</span>?</h1>
                    <p>Viele ziemlich gute Gründe.</p>
                </div>

                <!-- Sticky Cards Container -->
                <div class="cards-wrapper">
                    ${orderedCards.map((card, index) => this.createCardHTML(card, index)).join('')}
                </div>
            </div>
        `;

        // Cache DOM elements
        this.cards = this.container.querySelectorAll('.card');
    }

    /**
     * Get ordered cards based on configuration
     */
    getOrderedCards() {
        const allCards = [];
        
        if (this.config.aboutCard && this.config.aboutCard.enabled !== false) {
            allCards.push({ type: 'about', ...this.config.aboutCard });
        }
        
        if (this.config.benefitsCard && this.config.benefitsCard.enabled !== false) {
            allCards.push({ type: 'benefits', ...this.config.benefitsCard });
        }
        
        if (this.config.faqCard && this.config.faqCard.enabled !== false) {
            allCards.push({ type: 'faq', ...this.config.faqCard });
        }

        // Sort by order if specified
        allCards.sort((a, b) => (a.order || 0) - (b.order || 0));

        return allCards;
    }

    /**
     * Create HTML for individual card
     */
    createCardHTML(card, index) {
        switch (card.type) {
            case 'about':
                return this.createAboutCardHTML(card, index);
            case 'benefits':
                return this.createBenefitsCardHTML(card, index);
            case 'faq':
                return this.createFAQCardHTML(card, index);
            default:
                return '';
        }
    }

    /**
     * Create About card HTML
     */
    createAboutCardHTML(card, index) {
        return `
            <div class="card" data-index="${index}">
                <div class="card-content">
                    <i class="${card.icon || 'fas fa-building'} card-icon"></i>
                    <h2>${card.title || 'Über Uns'}</h2>
                    <p>${card.text || 'Beschreibungstext hier...'}</p>
                </div>
                <div class="card-image">
                    <img src="${card.imageUrl || 'https://placehold.co/350x250/e1e5e6/6d7b8b?text=Demo+Image'}" 
                         alt="${card.title || 'About Us'}">
                </div>
            </div>
        `;
    }

    /**
     * Create Benefits card HTML
     */
    createBenefitsCardHTML(card, index) {
        const benefits = card.benefits || [];
        const benefitsList = benefits.map(benefit => 
            `<li><i class="fas fa-check"></i> ${benefit.emoji || '✨'} ${benefit.text || 'Benefit text'}</li>`
        ).join('');

        return `
            <div class="card" data-index="${index}">
                <div class="card-content">
                    <i class="${card.icon || 'fas fa-star'} card-icon"></i>
                    <h2>${card.title || 'Deine Vorteile'}</h2>
                    <ul class="card-features">
                        ${benefitsList}
                    </ul>
                </div>
                <div class="card-image">
                    <img src="${card.imageUrl || 'https://placehold.co/350x250/e1e5e6/6d7b8b?text=Demo+Image'}" 
                         alt="${card.title || 'Benefits'}">
                </div>
            </div>
        `;
    }

    /**
     * Create FAQ card HTML
     */
    createFAQCardHTML(card, index) {
        const faqs = card.faqs || [];
        const faqsList = faqs.map((faq, faqIndex) => 
            `<div class="faq-item" data-faq="${faqIndex}">
                <button class="faq-question" type="button">
                    <span class="faq-question-text">${faq.question || 'FAQ Question'}</span>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </button>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        <p>${faq.answer || 'FAQ Answer'}</p>
                    </div>
                </div>
            </div>`
        ).join('');

        return `
            <div class="card" data-index="${index}">
                <div class="card-content">
                    <i class="${card.icon || 'fas fa-question-circle'} card-icon"></i>
                    <h2>${card.title || 'Häufige Fragen'}</h2>
                    <div class="faq-container">
                        ${faqsList}
                    </div>
                </div>
                <div class="card-image">
                    <img src="${card.imageUrl || 'https://placehold.co/350x250/e1e5e6/6d7b8b?text=Demo+Image'}" 
                         alt="${card.title || 'FAQ'}">
                </div>
            </div>
        `;
    }

    /**
     * Bind events for interactive elements
     */
    bindEvents() {
        // FAQ accordion functionality
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                this.toggleFAQ(e.target.closest('.faq-item'));
            }
        });

        // Card hover effects
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = card.style.transform + ' scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = card.style.transform.replace(' scale(1.02)', '');
            });
        });
    }

    /**
     * Toggle FAQ accordion
     */
    toggleFAQ(faqItem) {
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs in the same card
        const faqCard = faqItem.closest('.card');
        faqCard.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });

        // Toggle current FAQ
        faqItem.classList.toggle('active', !isActive);
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        if (window.AnimationController) {
            this.animationController = new window.AnimationController();
            
            // Animate header
            const header = this.container.querySelector('.section-header');
            if (header) {
                this.animationController.animateSection(header, 'welcome');
            }
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
        return {
            sectionType: 'mehrErfahren',
            config: this.config,
            totalCards: this.cards.length
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
     * Static method to create section easily
     */
    static create(containerId, config) {
        return new MehrErfahrenSection(config, containerId);
    }
};
