/**
 * Offers Section 1 - Rooms & Capacity Display
 * Simplified mobile-first design with clean hide/show navigation
 * Optimized for lead generation pages
 */

window.Offers1Section = class Offers1Section extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.currentRoomIndex = 0;
        this.imageSliders = new Map();
        this.initializeOffers();
    }

    /**
     * Initialize Offers section
     */
    initializeOffers() {
        if (!this.container) {
            console.error('Offers section container not found');
            return;
        }

        this.container.classList.add('offers1-enhanced');
        this.generateHTML();
        this.initializeNavigation();
        this.initializeImageSliders();
        this.setupEventTracking();
        this.onResize();
    }

    /**
     * Generate HTML structure
     */
    generateHTML() {
        const { hero, offerBanner, rooms, cta, trustBadges, display } = this.config;

        this.container.innerHTML = `
            <div class="offers1-wrapper">
                <!-- Hero Section -->
                <div class="offers1-hero">
                    <h2 class="offers1-headline">${hero.headline}</h2>
                    <p class="offers1-subheadline">${hero.subheadline}</p>
                </div>

                <!-- Offer Banner -->
                ${offerBanner?.enabled ? `
                    <div class="offers1-banner">
                        <div class="offers1-banner-content">
                            <div class="offers1-banner-icon">
                                <i class="${offerBanner.icon}"></i>
                            </div>
                            <div class="offers1-banner-text">
                                <div class="offers1-banner-title">${offerBanner.title}</div>
                                <div class="offers1-banner-subtitle">${offerBanner.text}</div>
                                ${offerBanner.validUntil ? `
                                    <div class="offers1-banner-validity">
                                        Gültig bis ${offerBanner.validUntil}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Room Navigation -->
                <div class="offers1-nav-desktop">
                    ${rooms.map((room, index) => `
                        <button class="offers1-tab ${index === 0 ? 'active' : ''}" 
                                data-index="${index}"
                                aria-label="View ${room.name}">
                            <span class="tab-name">${room.name}</span>
                            <span class="tab-capacity">
                                <i class="fas fa-users"></i> ${room.capacity.displayText}
                            </span>
                        </button>
                    `).join('')}
                </div>

                <!-- Room Cards -->
                <div class="offers1-rooms">
                    ${rooms.map((room, index) => this.generateRoomCard(room, index)).join('')}
                </div>

                <!-- Trust Badges -->
                ${trustBadges?.enabled ? `
                    <div class="offers1-trust">
                        ${trustBadges.badges.map(badge => `
                            <div class="offers1-trust-badge">
                                <i class="${badge.icon}"></i>
                                <span>${badge.text}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- CTA Section -->
                <div class="offers1-cta-section">
                    <div class="offers1-cta-main" id="offers1-main-cta"></div>
                    ${cta.phoneNumber ? `
                        <div class="offers1-cta-phone">
                            <span>${cta.phoneText || 'Oder anrufen:'}</span>
                            <a href="tel:${cta.phoneNumber.replace(/\s/g, '')}" class="offers1-phone-link">
                                <i class="fas fa-phone"></i> ${cta.phoneNumber}
                            </a>
                        </div>
                    ` : ''}
                    ${cta.secondaryLink ? `
                        <a href="${cta.secondaryLink}" class="offers1-secondary-link">
                            ${cta.secondaryText} <i class="fas fa-arrow-right"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        this.addMainCTAButton();
    }

    /**
     * Generate room card
     */
    generateRoomCard(room, index) {
        const { display } = this.config;
        const isActive = index === 0 ? 'active' : '';

        return `
            <div class="offers1-room-card ${isActive}" data-room-index="${index}" data-room-id="${room.id}">
                <!-- Image Section -->
                <div class="offers1-room-images">
                    ${room.images && room.images.length > 0 ? `
                        <div class="offers1-image-slider" data-slider-index="${index}">
                            ${room.images.map((image, imgIndex) => `
                                <div class="offers1-slide ${imgIndex === 0 ? 'active' : ''}" 
                                     style="background-image: url('${image}')">
                                </div>
                            `).join('')}
                        </div>
                        ${room.images.length > 1 ? `
                            <div class="offers1-slider-dots">
                                ${room.images.map((_, imgIndex) => `
                                    <button class="offers1-dot ${imgIndex === 0 ? 'active' : ''}" 
                                            data-slide="${imgIndex}"
                                            aria-label="Go to slide ${imgIndex + 1}">
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    ` : `
                        <div class="offers1-no-image">
                            <i class="fas fa-door-open"></i>
                        </div>
                    `}
                    
                    ${display.showCapacityBadge ? `
                        <div class="offers1-capacity-badge">
                            <i class="fas fa-users"></i>
                            <span>${room.capacity.displayText}</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Content Section -->
                <div class="offers1-room-content">
                    <div class="offers1-room-header">
                        <h3 class="offers1-room-name">${room.name}</h3>
                        ${room.tagline ? `<p class="offers1-room-tagline">${room.tagline}</p>` : ''}
                        ${display.showPricing && room.pricing ? `
                            <div class="offers1-room-price">
                                <span class="price-from">ab</span>
                                <span class="price-amount">${room.pricing.from}${room.pricing.currency}</span>
                                <span class="price-period">/${room.pricing.period}</span>
                            </div>
                        ` : ''}
                    </div>

                    <p class="offers1-room-description">${room.description}</p>

                    ${display.showFeatures && room.features ? `
                        <div class="offers1-features">
                            ${room.features.map(feature => `
                                <div class="offers1-feature">
                                    <i class="${feature.icon}"></i>
                                    <span>${feature.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${display.showHighlights && room.highlights ? `
                        <ul class="offers1-highlights">
                            ${room.highlights.map(highlight => `
                                <li><i class="fas fa-check"></i> ${highlight}</li>
                            `).join('')}
                        </ul>
                    ` : ''}

                    <div class="offers1-room-cta">
                        <button class="offers1-room-button" 
                                data-room-id="${room.id}"
                                data-room-name="${room.name}">
                            ${room.ctaText || 'Anfragen'}
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Add main CTA button
     */
    addMainCTAButton() {
        const ctaContainer = this.container.querySelector('#offers1-main-cta');
        if (!ctaContainer) return;

        if (window.ButtonManager) {
            const btnManager = new window.ButtonManager();
            const mainButton = btnManager.createButton(
                this.config.cta.mainButtonType || 'MainButton1',
                {
                    text: this.config.cta.mainButtonText,
                    onClick: (e) => {
                        e.preventDefault();
                        this.handleMainCTAClick();
                    }
                }
            );
            ctaContainer.appendChild(mainButton);
        } else {
            ctaContainer.innerHTML = `
                <button class="offers1-fallback-cta">
                    ${this.config.cta.mainButtonText}
                </button>
            `;
            ctaContainer.querySelector('button').addEventListener('click', () => {
                this.handleMainCTAClick();
            });
        }
    }

    /**
     * Initialize navigation
     */
    initializeNavigation() {
        const tabs = this.container.querySelectorAll('.offers1-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const index = parseInt(tab.dataset.index);
                this.showRoom(index);
            });
        });

        const roomButtons = this.container.querySelectorAll('.offers1-room-button');
        roomButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleRoomCTAClick(btn.dataset.roomId, btn.dataset.roomName);
            });
        });
    }

    /**
     * Show specific room
     */
    showRoom(index) {
        this.container.querySelectorAll('.offers1-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        this.container.querySelectorAll('.offers1-room-card').forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        this.currentRoomIndex = index;

        if (this.config.tracking?.enabled && this.config.tracking.onRoomClick) {
            const room = this.config.rooms[index];
            this.config.tracking.onRoomClick(room.id, room.name);
        }
    }

    /**
     * Initialize image sliders
     */
    initializeImageSliders() {
        if (!this.config.display.enableImageCarousel) return;

        this.config.rooms.forEach((room, roomIndex) => {
            if (room.images && room.images.length > 1) {
                const sliderElement = this.container.querySelector(`[data-slider-index="${roomIndex}"]`);
                if (sliderElement) {
                    const slider = new RoomImageSlider(sliderElement, roomIndex);
                    this.imageSliders.set(roomIndex, slider);
                }
            }
        });
    }

    /**
     * Handle main CTA click
     */
    handleMainCTAClick() {
        if (this.config.tracking?.enabled && window.gtag) {
            window.gtag('event', 'generate_lead', {
                event_category: 'Conversion',
                event_label: 'Main CTA - Offers Section',
                value: 1
            });
        }

        const formSection = document.querySelector('[data-title="SectionApplication"]');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Handle room CTA click
     */
    handleRoomCTAClick(roomId, roomName) {
        if (this.config.tracking?.enabled && this.config.tracking.onCTAClick) {
            this.config.tracking.onCTAClick(roomId, roomName);
        }

        this.handleMainCTAClick();
    }

    /**
     * Setup event tracking
     */
    setupEventTracking() {
        if (this.config.tracking?.enabled && window.gtag) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        window.gtag('event', 'view_item_list', {
                            event_category: 'Engagement',
                            event_label: 'Offers Section Viewed',
                            items: this.config.rooms.map(r => ({ id: r.id, name: r.name }))
                        });
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(this.container);
        }
    }

    /**
     * Handle responsive updates
     */
    onResize() {
        const breakpoint = this.getCurrentBreakpoint();
        this.container.classList.remove('offers1-mobile', 'offers1-tablet', 'offers1-desktop');
        this.container.classList.add(`offers1-${breakpoint}`);
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        return {
            sectionType: 'offers1',
            currentRoom: this.currentRoomIndex,
            totalRooms: this.config.rooms.length,
            hasOfferBanner: this.config.offerBanner?.enabled,
            hasTrustBadges: this.config.trustBadges?.enabled
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        this.imageSliders.forEach(slider => {
            if (slider.destroy) slider.destroy();
        });
        this.imageSliders.clear();
        super.destroy();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        const defaultConfig = Offers1Section.getDefaultConfig();
        const mergedConfig = { ...defaultConfig, ...config };
        return new Offers1Section(mergedConfig, containerId);
    }

    /**
     * Get default configuration
     */
    static getDefaultConfig() {
        return {
            hero: {
                headline: "Choose Your Space",
                subheadline: "Find the perfect room for your needs"
            },
            offerBanner: {
                enabled: false
            },
            rooms: [],
            cta: {
                mainButtonText: "Get Started",
                mainButtonType: "MainButton1"
            },
            trustBadges: {
                enabled: true,
                badges: []
            },
            display: {
                showCapacityBadge: true,
                showPricing: true,
                showFeatures: true,
                showHighlights: true,
                enableImageCarousel: true
            },
            tracking: {
                enabled: true
            }
        };
    }
}

/**
 * Room Image Slider Component
 */
class RoomImageSlider {
    constructor(container, roomIndex) {
        this.container = container;
        this.roomIndex = roomIndex;
        this.currentSlide = 0;
        this.slides = container.querySelectorAll('.offers1-slide');
        this.dots = container.parentElement.querySelectorAll('.offers1-dot');
        this.autoplayInterval = null;
        this.init();
    }

    init() {
        if (this.slides.length <= 1) return;

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        this.startAutoplay();
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    startAutoplay() {
        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), 4000);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this.pauseAutoplay();
    }
}
