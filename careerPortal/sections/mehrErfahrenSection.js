/**
 * Mehr Erfahren Section
 * Sticky scroll section with stacking cards
 */

window.MehrErfahrenSection = class MehrErfahrenSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.currentCardIndex = 0;
        this.isScrolling = false;
        this.cards = [];
        this.sectionHeight = 0;
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
        this.setupScrollObserver();
        this.initializeAnimations();
        this.bindEvents();
    }

    /**
     * Create the HTML structure
     */
    createMehrErfahrenHTML() {
        const orderedCards = this.getOrderedCards();
        
        this.container.innerHTML = `
            <div class="mehr-erfahren-wrapper">
                <div class="mehr-erfahren-container">
                    <!-- Header -->
                    <div class="mehr-erfahren-header">
                        <h2 class="mehr-erfahren-title">
                            Warum <span class="title-highlight">${this.config.companyPlaceholder || 'UNTERNEHMEN'}</span>?
                        </h2>
                        <h3 class="mehr-erfahren-subtitle">Viele ziemlich gute Gründe.</h3>
                    </div>
                    
                    <!-- Cards Container -->
                    <div class="mehr-erfahren-cards" id="mehrErfahrenCards">
                        ${orderedCards.map((card, index) => this.createCardHTML(card, index)).join('')}
                    </div>
                    
                    <!-- Progress Indicator -->
                    <div class="scroll-progress">
                        <div class="progress-bar" id="progressBar"></div>
                        <div class="progress-dots" id="progressDots">
                            ${orderedCards.map((_, index) => `<div class="progress-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.cards = document.querySelectorAll('.mehr-card');
        this.calculateSectionHeight();
    }

    /**
     * Get ordered cards based on configuration
     */
    getOrderedCards() {
        const allCards = [
            { type: 'about', ...this.config.aboutCard },
            { type: 'benefits', ...this.config.benefitsCard },
            { type: 'faq', ...this.config.faqCard }
        ];

        // Filter enabled cards
        const enabledCards = allCards.filter(card => card.enabled !== false);

        // Sort by order if specified
        enabledCards.sort((a, b) => (a.order || 0) - (b.order || 0));

        return enabledCards;
    }

    /**
     * Create HTML for individual card
     */
    createCardHTML(card, index) {
        const zIndex = 100 - index;
        
        switch (card.type) {
            case 'about':
                return this.createAboutCardHTML(card, index, zIndex);
            case 'benefits':
                return this.createBenefitsCardHTML(card, index, zIndex);
            case 'faq':
                return this.createFAQCardHTML(card, index, zIndex);
            default:
                return '';
        }
    }

    /**
     * Create About card HTML
     */
    createAboutCardHTML(card, index, zIndex) {
        return `
            <div class="mehr-card about-card" data-index="${index}" style="z-index: ${zIndex};">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="${card.icon || 'fas fa-building'}"></i>
                        </div>
                        <img src="${card.imageUrl || 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image'}" 
                             alt="${card.title || 'About Us'}" class="card-image">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${card.title || 'Über Uns'}</h3>
                        <p class="card-text">${card.text || 'Beschreibungstext hier...'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create Benefits card HTML
     */
    createBenefitsCardHTML(card, index, zIndex) {
        const benefits = card.benefits || [];
        const benefitsList = benefits.map(benefit => 
            `<li class="benefit-item">
                <span class="benefit-emoji">${benefit.emoji || '✨'}</span>
                <span class="benefit-text">${benefit.text || 'Benefit text'}</span>
            </li>`
        ).join('');

        return `
            <div class="mehr-card benefits-card" data-index="${index}" style="z-index: ${zIndex};">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="${card.icon || 'fas fa-star'}"></i>
                        </div>
                        <img src="${card.imageUrl || 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image'}" 
                             alt="${card.title || 'Benefits'}" class="card-image">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${card.title || 'Deine Vorteile'}</h3>
                        <ul class="benefits-list">
                            ${benefitsList}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create FAQ card HTML
     */
    createFAQCardHTML(card, index, zIndex) {
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
            <div class="mehr-card faq-card" data-index="${index}" style="z-index: ${zIndex};">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="${card.icon || 'fas fa-question-circle'}"></i>
                        </div>
                        <img src="${card.imageUrl || 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image'}" 
                             alt="${card.title || 'FAQ'}" class="card-image">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${card.title || 'Häufige Fragen'}</h3>
                        <div class="faq-list">
                            ${faqsList}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup scroll observer for sticky behavior
     */
    setupScrollObserver() {
        this.scrollHandler = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        
        // Setup intersection observer for section detection
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isInSection = true;
                } else {
                    this.isInSection = false;
                }
            });
        }, { threshold: 0.1 });

        this.observer.observe(this.container);
    }

    /**
     * Handle scroll events for sticky card behavior
     */
    handleScroll() {
        if (!this.isInSection || this.isScrolling) return;

        const containerRect = this.container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within section
        const sectionTop = containerRect.top;
        const sectionHeight = containerRect.height;
        const scrollProgress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - viewportHeight)));
        
        // Update cards based on scroll progress
        this.updateCardsPosition(scrollProgress);
        this.updateProgressIndicator(scrollProgress);
    }

    /**
     * Update card positions based on scroll
     */
    updateCardsPosition(progress) {
        const totalCards = this.cards.length;
        const cardProgress = progress * (totalCards - 1);
        const currentIndex = Math.floor(cardProgress);
        const cardTransition = cardProgress - currentIndex;

        this.cards.forEach((card, index) => {
            const cardElement = card;
            let translateY = 0;
            let scale = 1;
            let opacity = 1;

            if (index < currentIndex) {
                // Cards that have been scrolled past
                translateY = -100 * (currentIndex - index);
                scale = 0.95;
                opacity = 0.7;
            } else if (index === currentIndex && cardTransition > 0) {
                // Current card being scrolled
                translateY = -100 * cardTransition;
                scale = 1 - (cardTransition * 0.05);
                opacity = 1 - (cardTransition * 0.3);
            } else if (index === currentIndex + 1 && cardTransition > 0) {
                // Next card coming into view
                translateY = 100 * (1 - cardTransition);
                scale = 0.95 + (cardTransition * 0.05);
                opacity = 0.7 + (cardTransition * 0.3);
            } else if (index > currentIndex + 1) {
                // Cards still waiting
                translateY = 100;
                scale = 0.95;
                opacity = 0.7;
            }

            cardElement.style.transform = `translateY(${translateY}%) scale(${scale})`;
            cardElement.style.opacity = opacity;
        });

        this.currentCardIndex = currentIndex;
    }

    /**
     * Update progress indicator
     */
    updateProgressIndicator(progress) {
        const progressBar = document.getElementById('progressBar');
        const progressDots = document.querySelectorAll('.progress-dot');

        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }

        progressDots.forEach((dot, index) => {
            const cardProgress = progress * (this.cards.length - 1);
            dot.classList.toggle('active', index <= Math.floor(cardProgress));
        });
    }

    /**
     * Calculate section height for proper sticky behavior
     */
    calculateSectionHeight() {
        const cardCount = this.cards.length;
        const baseHeight = window.innerHeight;
        this.sectionHeight = baseHeight * (cardCount + 1); // Extra height for smooth scrolling
        
        this.container.style.height = `${this.sectionHeight}px`;
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

        // Progress dot navigation
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('progress-dot')) {
                const targetIndex = parseInt(e.target.getAttribute('data-index'));
                this.scrollToCard(targetIndex);
            }
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.calculateSectionHeight();
        }, 250));
    }

    /**
     * Toggle FAQ accordion
     */
    toggleFAQ(faqItem) {
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs in the same card
        const faqCard = faqItem.closest('.faq-card');
        faqCard.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });

        // Toggle current FAQ
        faqItem.classList.toggle('active', !isActive);
    }

    /**
     * Scroll to specific card
     */
    scrollToCard(cardIndex) {
        if (cardIndex < 0 || cardIndex >= this.cards.length) return;

        this.isScrolling = true;
        const targetProgress = cardIndex / (this.cards.length - 1);
        const containerRect = this.container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const targetScroll = window.pageYOffset + containerRect.top + (targetProgress * (containerRect.height - viewportHeight));

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        if (window.AnimationController) {
            this.animationController = new window.AnimationController();
            
            // Animate header on load
            const header = this.container.querySelector('.mehr-erfahren-header');
            if (header) {
                this.animationController.animateEntrance([header], 'slideUp', { startDelay: 200 });
            }

            // Set initial positions for cards
            this.cards.forEach((card, index) => {
                if (index === 0) {
                    card.style.transform = 'translateY(0%) scale(1)';
                    card.style.opacity = '1';
                } else {
                    card.style.transform = 'translateY(100%) scale(0.95)';
                    card.style.opacity = '0.7';
                }
            });
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
            currentCardIndex: this.currentCardIndex,
            totalCards: this.cards.length,
            sectionHeight: this.sectionHeight,
            isInSection: this.isInSection || false
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }

        if (this.animationController) {
            this.animationController.destroy();
        }

        super.destroy();
    }

    /**
     * Static method to create section easily
     */
    static create(containerId, config) {
        return new MehrErfahrenSection(config, containerId);
    }
};