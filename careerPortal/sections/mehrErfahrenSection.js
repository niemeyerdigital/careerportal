/**
 * Mehr Erfahren Section
 * Sticky scroll section with stacking cards - based on SalesHAX pattern
 */

window.MehrErfahrenSection = class MehrErfahrenSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.cards = [];
        this.stickyContainer = null;
        this.stickyWrapper = null;
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
        this.setupScrollHandler();
        this.initializeAnimations();
        this.bindEvents();
    }

    /**
     * Create the HTML structure based on SalesHAX pattern
     */
    createMehrErfahrenHTML() {
        const orderedCards = this.getOrderedCards();
        
        this.container.innerHTML = `
            <div class="mehr-erfahren-wrapper">
                <!-- Static Header -->
                <div class="static-header">
                    <div class="static-header-content">
                        <h1>Warum <span class="title-highlight">${this.config.companyPlaceholder || 'UNTERNEHMEN'}</span>?</h1>
                        <p>Viele ziemlich gute Gründe.</p>
                    </div>
                </div>

                <!-- Sticky Scroll Section -->
                <section class="sticky-container">
                    <div class="sticky-wrapper">
                        ${orderedCards.map((card, index) => this.createCardHTML(card, index)).join('')}
                    </div>
                </section>
            </div>
        `;

        this.stickyContainer = this.container.querySelector('.sticky-container');
        this.stickyWrapper = this.container.querySelector('.sticky-wrapper');
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
            <div class="card" data-card="${index}">
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
            <div class="card" data-card="${index}">
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
            <div class="card" data-card="${index}">
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
     * Setup scroll handler for sticky behavior (SalesHAX pattern)
     */
    setupScrollHandler() {
        this.handleScroll = this.debounce(() => {
            this.updateCards();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', this.handleScroll);
        
        // Initialize cards on load
        setTimeout(() => this.updateCards(), 100);
    }

    /**
     * Update cards based on scroll position (SalesHAX pattern)
     */
    updateCards() {
        if (!this.stickyContainer || !this.cards.length) return;

        const scrollTop = window.pageYOffset;
        const containerTop = this.stickyContainer.offsetTop;
        const containerHeight = this.stickyContainer.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate progress through the sticky section (0 to 1)
        const progress = Math.max(0, Math.min(1, 
            (scrollTop - containerTop) / (containerHeight - viewportHeight)
        ));
        
        // Calculate which card should be active based on scroll progress
        const totalCards = this.cards.length;
        const cardProgress = progress * totalCards;
        const activeIndex = Math.min(Math.floor(cardProgress), totalCards - 1);
        const transitionProgress = cardProgress - activeIndex;
        
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'stacked', 'transitioning-out', 'transitioning-in');
            
            if (index === activeIndex) {
                if (transitionProgress > 0.3) {
                    card.classList.add('transitioning-out');
                    // Current card fading out
                    const fadeProgress = (transitionProgress - 0.3) / 0.7;
                    card.style.transform = `translateY(${-50 * fadeProgress}px) scale(${1 - fadeProgress * 0.1})`;
                    card.style.opacity = 1 - fadeProgress * 0.6;
                    card.style.zIndex = totalCards;
                } else {
                    card.classList.add('active');
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.opacity = '1';
                    card.style.zIndex = totalCards + 1;
                }
            } else if (index === activeIndex + 1 && transitionProgress > 0.3) {
                card.classList.add('transitioning-in');
                // Next card fading in
                const fadeProgress = (transitionProgress - 0.3) / 0.7;
                card.style.transform = `translateY(${50 * (1 - fadeProgress)}px) scale(${0.9 + fadeProgress * 0.1})`;
                card.style.opacity = fadeProgress;
                card.style.zIndex = totalCards + 2;
            } else if (index < activeIndex) {
                card.classList.add('stacked');
                const stackOffset = (activeIndex - index) * -10;
                card.style.transform = `translateY(${stackOffset}px) scale(${0.95 - (activeIndex - index) * 0.02})`;
                card.style.zIndex = totalCards - (activeIndex - index);
                card.style.opacity = '0.8';
            } else {
                card.style.transform = 'translateY(100px) scale(0.9)';
                card.style.zIndex = 1;
                card.style.opacity = '0';
            }
        });
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

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.updateCards();
        }, 250));
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
            
            // Animate static header
            const staticHeader = this.container.querySelector('.static-header');
            if (staticHeader) {
                this.animationController.animateSection(staticHeader, 'welcome');
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
        if (this.handleScroll) {
            window.removeEventListener('scroll', this.handleScroll);
        }

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
