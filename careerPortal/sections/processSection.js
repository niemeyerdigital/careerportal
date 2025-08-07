/**
 * Process Section
 * Application process steps with carousel on mobile
 */

window.ProcessSection = class ProcessSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.initializeProcess();
    }

    /**
     * Initialize Process section
     */
    initializeProcess() {
        if (!this.container) {
            console.error('Process section container not found');
            return;
        }

        this.createProcessHTML();
        this.setupCarousel();
        this.setupEventHandlers();
        this.initializeAnimations();
    }

    /**
     * Create the HTML structure for Process section
     */
    createProcessHTML() {
        const { sectionHeadline, cards, showEmojiContainers, showEmojiBackground } = this.config;
        
        this.container.innerHTML = `
            <div class="process-wrapper">
                <div class="process-container">
                    <!-- Section Header -->
                    <div class="process-section-header">
                        <h2>${sectionHeadline}</h2>
                    </div>

                    <!-- Desktop Cards Row -->
                    <div class="process-cards-wrapper" id="desktop-cards">
                        ${this.generateDesktopCards(cards, showEmojiContainers, showEmojiBackground)}
                    </div>

                    <!-- Mobile Carousel -->
                    <div class="process-carousel-container">
                        <div class="process-carousel-controls-top">
                            <button class="process-carousel-btn" id="prevBtn">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="process-carousel-btn" id="nextBtn">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <div class="process-carousel-wrapper">
                            <div class="process-carousel-track" id="carouselTrack">
                                ${this.generateMobileSlides(cards, showEmojiContainers, showEmojiBackground)}
                            </div>
                        </div>

                        <div class="process-carousel-indicators" id="indicators"></div>
                    </div>
                </div>
            </div>
        `;

        // Add dynamic styles for emoji container colors
        this.addDynamicStyles(cards, showEmojiContainers, showEmojiBackground);
    }

    /**
     * Generate desktop cards HTML
     */
    generateDesktopCards(cards, showEmojiContainers, showEmojiBackground) {
        return cards.map((card, index) => {
            const emojiHtml = this.generateEmojiHtml(card, index, showEmojiContainers, showEmojiBackground);
            const cardClass = showEmojiContainers ? 'process-card has-emoji-container' : 'process-card';
            
            return `
                <div class="${cardClass}">
                    ${emojiHtml}
                    <h3>${card.title}</h3>
                    <p>${card.text}</p>
                </div>
            `;
        }).join('');
    }

    /**
     * Generate mobile carousel slides HTML
     */
    generateMobileSlides(cards, showEmojiContainers, showEmojiBackground) {
        return cards.map((card, index) => {
            const emojiHtml = this.generateEmojiHtml(card, index, showEmojiContainers, showEmojiBackground);
            const slideClass = showEmojiContainers ? 'process-carousel-slide has-emoji-container' : 'process-carousel-slide';
            const activeClass = index === 0 ? ' active' : '';
            
            return `
                <div class="${slideClass}${activeClass}">
                    ${emojiHtml}
                    <h3>${card.title}</h3>
                    <p>${card.text}</p>
                </div>
            `;
        }).join('');
    }

    /**
     * Generate emoji container HTML
     */
    generateEmojiHtml(card, index, showEmojiContainers, showEmojiBackground) {
        if (!showEmojiContainers) return '';
        
        const bgClass = showEmojiBackground ? '' : 'no-background';
        const colorClass = `color-${index + 1}`;
        
        return `
            <div class="process-emoji-container ${bgClass} ${colorClass}">
                <span>${card.emoji}</span>
            </div>
        `;
    }

    /**
     * Add dynamic styles for emoji container colors
     */
    addDynamicStyles(cards, showEmojiContainers, showEmojiBackground) {
        if (!showEmojiContainers || !showEmojiBackground) return;

        const styleId = 'process-emoji-styles';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const styles = cards.map((card, index) => `
            .process-emoji-container.color-${index + 1}::before {
                background: ${card.emojiContainerColor};
            }
        `).join('\n');

        styleElement.textContent = styles;
    }

    /**
     * Setup carousel functionality
     */
    setupCarousel() {
        const track = document.getElementById('carouselTrack');
        const indicatorsContainer = document.getElementById('indicators');
        
        if (!track || !indicatorsContainer) return;

        this.slides = track.querySelectorAll('.process-carousel-slide');
        
        // Create indicators
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'process-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        this.indicators = indicatorsContainer.querySelectorAll('.process-indicator');
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isInViewport(this.container)) return;
            
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    /**
     * Update slide position
     */
    updateSlidePosition() {
        const track = document.getElementById('carouselTrack');
        if (!track) return;

        // Progressive gap adjustment
        let gapAdjustment = 0;
        for (let i = 1; i <= this.currentSlide; i++) {
            gapAdjustment += 2 + (i * 0.3);
        }
        
        track.style.transform = `translateX(-${(this.currentSlide * 100) + gapAdjustment}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update active slide class for animation
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Track carousel navigation
        if (window.gtag) {
            window.gtag('event', 'carousel_navigate', {
                event_category: 'Process',
                event_label: `Slide ${this.currentSlide + 1}`,
                value: this.currentSlide
            });
        }
    }

    /**
     * Go to specific slide
     */
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlidePosition();
    }

    /**
     * Navigate to next slide
     */
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlidePosition();
    }

    /**
     * Navigate to previous slide
     */
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        // Animate cards on load
        const cards = this.container.querySelectorAll('.process-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
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
     * Handle responsive updates
     */
    onResize() {
        const breakpoint = this.getCurrentBreakpoint();
        
        // Reset carousel position on resize
        if (breakpoint === 'mobile' && this.currentSlide !== 0) {
            this.goToSlide(0);
        }
    }

    /**
     * Update configuration
     */
    updateProcessConfig(newConfig) {
        this.updateConfig(newConfig);
        this.reinitialize();
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        return {
            sectionType: 'process',
            config: this.config,
            totalCards: this.config.cards.length,
            currentSlide: this.currentSlide,
            showEmojiContainers: this.config.showEmojiContainers,
            showEmojiBackground: this.config.showEmojiBackground,
            isVisible: this.isInViewport(this.container)
        };
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        if (!this.config.sectionHeadline) {
            console.error('Process section: sectionHeadline is required');
            return false;
        }

        if (!this.config.cards || !Array.isArray(this.config.cards) || this.config.cards.length === 0) {
            console.error('Process section: cards array is required and cannot be empty');
            return false;
        }

        // Validate each card
        const invalidCards = this.config.cards.filter(card => 
            !card.title || !card.text || !card.emoji || !card.emojiContainerColor
        );

        if (invalidCards.length > 0) {
            console.error('Process section: All cards must have title, text, emoji, and emojiContainerColor');
            return false;
        }

        return super.validateConfig();
    }

    /**
     * Cleanup
     */
    destroy() {
        // Remove dynamic styles
        const styleElement = document.getElementById('process-emoji-styles');
        if (styleElement) {
            styleElement.remove();
        }

        // Remove event listeners
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));
        if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));

        super.destroy();
    }

    /**
     * Reinitialize section
     */
    reinitialize() {
        this.destroy();
        this.currentSlide = 0;
        this.initializeProcess();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        return new ProcessSection(config, containerId);
    }
};