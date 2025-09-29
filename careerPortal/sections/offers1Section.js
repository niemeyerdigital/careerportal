/**
 * Offers Section 1 - Rooms & Capacity Display
 * Mobile-first room showcase with capacity badges and booking CTAs
 * Flexible for any business type (venues, restaurants, hotels, etc.)
 */

window.Offers1Section = class Offers1Section extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        this.currentRoomIndex = 0;
        this.imageSliders = new Map();
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.initializeOffers();
    }

    /**
     * Initialize Offers section specific functionality
     */
    initializeOffers() {
        if (!this.container) {
            console.error('Offers section container not found');
            return;
        }

        // Apply section class
        this.container.classList.add('offers1-enhanced');

        // Generate HTML structure
        this.generateHTML();

        // Initialize interactions
        this.initializeNavigation();
        this.initializeImageSliders();
        this.initializeAnimations();
        this.setupEventTracking();

        // Setup responsive behavior
        this.onResize();
    }

    /**
     * Generate complete HTML structure
     */
    generateHTML() {
        const { hero, offerBanner, rooms, cta, trustBadges, display } = this.config;

        this.container.innerHTML = `
            <div class="offers1-wrapper">
                <!-- Hero Section -->
                <div class="offers1-hero">
                    <h2 class="offers1-headline">${hero.headline}</h2>
                    <p class="offers1-subheadline">${hero.subheadline}</p>
                    ${hero.badge?.enabled ? `
                        <div class="offers1-badge">
                            <i class="${hero.badge.icon}"></i>
                            <span>${hero.badge.text}</span>
                        </div>
                    ` : ''}
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
                            </div>
                            ${offerBanner.validUntil ? `
                                <div class="offers1-banner-validity">
                                    <small>Gültig bis ${offerBanner.validUntil}</small>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}

                <!-- Room Navigation (Mobile) -->
                <div class="offers1-nav-mobile">
                    <button class="offers1-nav-arrow offers1-nav-prev" aria-label="Previous room">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="offers1-nav-pills">
                        ${rooms.map((room, index) => `
                            <button class="offers1-nav-pill ${index === 0 ? 'active' : ''}" 
                                    data-index="${index}" 
                                    aria-label="${room.name}">
                                <span class="pill-name">${room.name}</span>
                                <span class="pill-capacity">${room.capacity.displayText}</span>
                            </button>
                        `).join('')}
                    </div>
                    <button class="offers1-nav-arrow offers1-nav-next" aria-label="Next room">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <!-- Room Navigation (Desktop Tabs) -->
                <div class="offers1-nav-desktop">
                    ${rooms.map((room, index) => `
                        <button class="offers1-tab ${index === 0 ? 'active' : ''}" 
                                data-index="${index}">
                            <span class="tab-name">${room.name}</span>
                            <span class="tab-capacity">
                                <i class="fas fa-users"></i> ${room.capacity.displayText}
                            </span>
                        </button>
                    `).join('')}
                </div>

                <!-- Room Cards Container -->
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

        // Add main CTA button using ButtonManager
        this.addMainCTAButton();
    }

    /**
     * Generate individual room card
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
                    
                    <!-- Capacity Badge Overlay -->
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

                    <!-- Features Grid -->
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

                    <!-- Highlights List -->
                    ${display.showHighlights && room.highlights ? `
                        <ul class="offers1-highlights">
                            ${room.highlights.map(highlight => `
                                <li><i class="fas fa-check"></i> ${highlight}</li>
                            `).join('')}
                        </ul>
                    ` : ''}

                    <!-- Room CTA Button -->
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
     * Add main CTA button using ButtonManager
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
            // Fallback button
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
     * Initialize navigation functionality
     */
    initializeNavigation() {
        // Desktop tabs
        const tabs = this.container.querySelectorAll('.offers1-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const index = parseInt(tab.dataset.index);
                this.showRoom(index);
            });
        });

        // Mobile pills
        const pills = this.container.querySelectorAll('.offers1-nav-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const index = parseInt(pill.dataset.index);
                this.showRoom(index);
            });
        });

        // Mobile navigation arrows
        const prevBtn = this.container.querySelector('.offers1-nav-prev');
        const nextBtn = this.container.querySelector('.offers1-nav-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateRooms(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateRooms(1));
        }

        // Touch swipe support for mobile
        this.setupTouchNavigation();

        // Room CTA buttons
        const roomButtons = this.container.querySelectorAll('.offers1-room-button');
        roomButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleRoomCTAClick(btn.dataset.roomId, btn.dataset.roomName);
            });
        });
    }

    /**
     * Setup touch navigation for mobile
     */
    setupTouchNavigation() {
        const roomsContainer = this.container.querySelector('.offers1-rooms');
        if (!roomsContainer) return;

        roomsContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        roomsContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next room
                this.navigateRooms(1);
            } else {
                // Swipe right - previous room
                this.navigateRooms(-1);
            }
        }
    }

    /**
     * Navigate between rooms
     */
    navigateRooms(direction) {
        const totalRooms = this.config.rooms.length;
        let newIndex = this.currentRoomIndex + direction;

        // Wrap around
        if (newIndex < 0) newIndex = totalRooms - 1;
        if (newIndex >= totalRooms) newIndex = 0;

        this.showRoom(newIndex);
    }

    /**
     * Show specific room
     */
    showRoom(index) {
        // Update navigation
        this.container.querySelectorAll('.offers1-tab, .offers1-nav-pill').forEach((nav, i) => {
            nav.classList.toggle('active', i === index);
        });

        // Update room cards
        this.container.querySelectorAll('.offers1-room-card').forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        // Scroll active pill into view on mobile
        this.scrollActivePillIntoView(index);

        this.currentRoomIndex = index;

        // Track room view
        if (this.config.tracking?.enabled && this.config.tracking.onRoomClick) {
            this.config.tracking.onRoomClick(this.config.rooms[index].id, this.config.rooms[index].name);
        }
    }

    /**
     * Scroll active pill into view
     */
    scrollActivePillIntoView(index) {
        const pillsContainer = this.container.querySelector('.offers1-nav-pills');
        const activePill = this.container.querySelectorAll('.offers1-nav-pill')[index];
        
        if (pillsContainer && activePill) {
            const containerRect = pillsContainer.getBoundingClientRect();
            const pillRect = activePill.getBoundingClientRect();
            
            const scrollLeft = pillsContainer.scrollLeft;
            const containerCenter = containerRect.width / 2;
            const pillCenter = pillRect.left - containerRect.left + pillRect.width / 2;
            
            pillsContainer.scrollTo({
                left: scrollLeft + pillCenter - containerCenter,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Initialize image sliders for rooms with multiple images
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
        // Track conversion
        if (this.config.tracking?.enabled) {
            if (window.gtag) {
                window.gtag('event', 'generate_lead', {
                    event_category: 'Conversion',
                    event_label: 'Main CTA - Offers Section',
                    value: 1
                });
            }
        }

        // Scroll to form or navigate
        const formSection = document.querySelector('[data-title="SectionApplication"]');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Handle room-specific CTA click
     */
    handleRoomCTAClick(roomId, roomName) {
        // Track conversion
        if (this.config.tracking?.enabled && this.config.tracking.onCTAClick) {
            this.config.tracking.onCTAClick(roomId, roomName);
        }

        // Could navigate to a room-specific form or booking page
        this.handleMainCTAClick();
    }

    /**
     * Setup event tracking
     */
    setupEventTracking() {
        // Track section view
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
     * Initialize animations
     */
    initializeAnimations() {
        const animatedElements = this.container.querySelectorAll(
            '.offers1-hero, .offers1-banner, .offers1-room-card, .offers1-trust-badge'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Handle responsive updates
     */
    onResize() {
        const breakpoint = this.getCurrentBreakpoint();
        
        // Update container classes
        this.container.classList.remove('offers1-mobile', 'offers1-tablet', 'offers1-desktop');
        this.container.classList.add(`offers1-${breakpoint}`);

        // Adjust display based on breakpoint
        if (breakpoint === 'mobile') {
            // Show mobile navigation
            const mobileNav = this.container.querySelector('.offers1-nav-mobile');
            const desktopNav = this.container.querySelector('.offers1-nav-desktop');
            if (mobileNav) mobileNav.style.display = 'flex';
            if (desktopNav) desktopNav.style.display = 'none';
        } else {
            // Show desktop navigation
            const mobileNav = this.container.querySelector('.offers1-nav-mobile');
            const desktopNav = this.container.querySelector('.offers1-nav-desktop');
            if (mobileNav) mobileNav.style.display = 'none';
            if (desktopNav) desktopNav.style.display = 'flex';
        }
    }

    /**
     * Get section metrics
     */
    getMetrics() {
        return {
            sectionType: 'offers1',
            config: this.config,
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
        // Cleanup image sliders
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
                subheadline: "Find the perfect room for your needs",
                badge: {
                    enabled: true,
                    text: "Flexible Options",
                    icon: "fas fa-check-circle"
                }
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

        // Bind dot clicks
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Start autoplay
        this.startAutoplay();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        // Update slides
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
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
