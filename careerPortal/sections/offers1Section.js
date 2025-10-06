/* ====================================================================
   OFFERS SECTION 1 - ROOMS & CAPACITY DISPLAY
   Mobile-first responsive design optimized with root variables
   ==================================================================== */

/* Container overrides for ClickFunnels */
div[data-title='SectionOffers1'],
div[data-title='RowOffers1'],
div[data-title='RowOffers1'] .container {
    overflow: visible !important;
    position: relative !important;
    width: 100% !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
}

/* Main wrapper */
.offers1-enhanced {
    width: 100%;
    position: relative;
}

.offers1-wrapper {
    background: linear-gradient(135deg, var(--primary-bg) 0%, var(--secondary-bg) 100%);
    padding: 48px 20px;
    position: relative;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    font-family: var(--font-family);
}

/* Hero Section */
.offers1-hero {
    text-align: center;
    margin-bottom: 32px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
}

.offers1-headline {
    font-size: var(--font-2xl);
    font-weight: 800;
    color: var(--heading-text);
    margin: 0 0 12px 0;
    line-height: 1.1;
    letter-spacing: -0.02em;
}

.offers1-subheadline {
    font-size: var(--font-md);
    color: var(--secondary-text);
    margin: 0 0 20px 0;
    line-height: 1.5;
}

.offers1-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 107, 53, 0.1);
    border: 1px solid var(--primary-color);
    border-radius: 999px;
    padding: 8px 16px;
    color: var(--primary-color);
    font-size: var(--font-xs);
    font-weight: 600;
    transition: all 0.3s ease;
}

.offers1-badge:hover {
    background: rgba(255, 107, 53, 0.2);
    transform: scale(1.05);
}

.offers1-badge i {
    font-size: var(--font-sm);
}

/* Offer Banner */
.offers1-banner {
    background: var(--button-primary);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 28px;
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.25);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease 0.1s forwards;
}

.offers1-banner-content {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--primary-text);
}

.offers1-banner-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.offers1-banner-icon i {
    font-size: var(--font-lg);
}

.offers1-banner-text {
    flex: 1;
}

.offers1-banner-title {
    font-size: var(--font-md);
    font-weight: 700;
    margin-bottom: 2px;
}

.offers1-banner-subtitle {
    font-size: var(--font-sm);
    opacity: 0.95;
}

.offers1-banner-validity {
    font-size: var(--font-xs);
    opacity: 0.85;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 8px;
    width: 100%;
}

/* Navigation - Mobile */
.offers1-nav-mobile {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
    overflow: hidden;
}

.offers1-nav-arrow {
    background: var(--card-bg);
    border: 1px solid var(--border-light);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.3s ease;
    color: var(--secondary-text);
}

.offers1-nav-arrow:hover {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-text);
    transform: scale(1.1);
}

.offers1-nav-arrow:active {
    transform: scale(0.95);
}

.offers1-nav-pills {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    flex: 1;
    padding: 4px 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.offers1-nav-pills::-webkit-scrollbar {
    display: none;
}

.offers1-nav-pill {
    background: var(--card-bg);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 130px;
}

.offers1-nav-pill.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    transform: scale(1.05);
}

.offers1-nav-pill:hover:not(.active) {
    border-color: var(--primary-color);
    background: var(--secondary-bg);
    transform: translateY(-2px);
}

.pill-name {
    font-size: var(--font-xs);
    font-weight: 600;
    color: var(--primary-text);
}

.pill-capacity {
    font-size: 0.75rem;
    color: var(--secondary-text);
}

.offers1-nav-pill.active .pill-name,
.offers1-nav-pill.active .pill-capacity {
    color: var(--primary-text);
}

/* Navigation - Desktop */
.offers1-nav-desktop {
    display: none;
    gap: 6px;
    margin-bottom: 32px;
    background: var(--card-bg);
    border-radius: 14px;
    padding: 6px;
    border: 1px solid var(--border-light);
}

.offers1-tab {
    flex: 1;
    background: transparent;
    border: none;
    border-radius: 10px;
    padding: 14px 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    color: var(--secondary-text);
}

.offers1-tab.active {
    background: var(--primary-color);
    color: var(--primary-text);
}

.offers1-tab:hover:not(.active) {
    background: var(--secondary-bg);
    color: var(--primary-text);
}

.tab-name {
    font-size: var(--font-sm);
    font-weight: 600;
}

.tab-capacity {
    font-size: var(--font-xs);
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0.9;
}

/* Room Cards Container */
.offers1-rooms {
    position: relative;
    margin-bottom: 40px;
}

/* Room Card */
.offers1-room-card {
    display: none;
    background: var(--card-bg);
    border: 1px solid var(--border-light);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px var(--shadow-light);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease 0.2s forwards;
    transition: all 0.3s ease;
}

.offers1-room-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px var(--shadow-medium);
    border-color: var(--border-medium);
}

.offers1-room-card.active {
    display: block;
}

/* Room Images */
.offers1-room-images {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: var(--secondary-bg);
}

.offers1-image-slider {
    position: relative;
    width: 100%;
    height: 100%;
}

.offers1-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.offers1-slide.active {
    opacity: 1;
}

.offers1-no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--muted-text);
    font-size: 48px;
}

/* Slider Dots */
.offers1-slider-dots {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 2;
}

.offers1-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
}

.offers1-dot:hover {
    background: rgba(255, 255, 255, 0.8);
}

.offers1-dot.active {
    width: 20px;
    border-radius: 3px;
    background: var(--primary-text);
}

/* Capacity Badge */
.offers1-capacity-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--primary-color);
    color: var(--primary-text);
    padding: 6px 12px;
    border-radius: 999px;
    font-size: var(--font-xs);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 2;
}

.offers1-capacity-badge i {
    font-size: var(--font-xs);
}

/* Room Content */
.offers1-room-content {
    padding: 24px 20px;
}

.offers1-room-header {
    margin-bottom: 16px;
}

.offers1-room-name {
    font-size: var(--font-xl);
    font-weight: 700;
    color: var(--heading-text);
    margin: 0 0 6px 0;
    line-height: 1.2;
}

.offers1-room-tagline {
    font-size: var(--font-sm);
    color: var(--primary-color);
    margin: 0 0 12px 0;
    font-weight: 500;
}

.offers1-room-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-top: 10px;
}

.price-from {
    font-size: var(--font-xs);
    color: var(--secondary-text);
}

.price-amount {
    font-size: var(--font-xl);
    font-weight: 700;
    color: var(--primary-color);
}

.price-period {
    font-size: var(--font-xs);
    color: var(--secondary-text);
}

.offers1-room-description {
    font-size: var(--font-sm);
    color: var(--secondary-text);
    line-height: 1.6;
    margin: 0 0 20px 0;
}

/* Features Grid */
.offers1-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.offers1-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: var(--secondary-bg);
    border-radius: 10px;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.offers1-feature:hover {
    background: var(--accent-bg);
    transform: translateX(4px);
    border-color: var(--border-light);
}

.offers1-feature i {
    font-size: var(--font-md);
    color: var(--primary-color);
    width: 20px;
    text-align: center;
    flex-shrink: 0;
}

.offers1-feature span {
    font-size: var(--font-xs);
    color: var(--primary-text);
    flex: 1;
    line-height: 1.4;
}

/* Highlights List */
.offers1-highlights {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
}

.offers1-highlights li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    font-size: var(--font-sm);
    color: var(--primary-text);
}

.offers1-highlights li i {
    color: #10b981;
    font-size: var(--font-xs);
    flex-shrink: 0;
}

/* Room CTA Button */
.offers1-room-cta {
    margin-top: 24px;
}

.offers1-room-button {
    width: 100%;
    padding: 14px 28px;
    background: var(--button-primary);
    color: var(--primary-text);
    border: none;
    border-radius: 10px;
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.25);
}

.offers1-room-button:hover {
    background: var(--button-primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 107, 53, 0.35);
}

.offers1-room-button:active {
    transform: translateY(0);
}

.offers1-room-button i {
    font-size: var(--font-sm);
    transition: transform 0.3s ease;
}

.offers1-room-button:hover i {
    transform: translateX(4px);
}

/* Trust Badges */
.offers1-trust {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.offers1-trust-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 14px;
    background: var(--card-bg);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    min-width: 110px;
    transition: all 0.3s ease;
}

.offers1-trust-badge:hover {
    transform: translateY(-4px);
    border-color: var(--primary-color);
    box-shadow: 0 4px 16px var(--shadow-light);
}

.offers1-trust-badge i {
    font-size: var(--font-xl);
    color: var(--primary-color);
}

.offers1-trust-badge span {
    font-size: var(--font-xs);
    color: var(--secondary-text);
    text-align: center;
    font-weight: 500;
}

/* CTA Section */
.offers1-cta-section {
    text-align: center;
    padding: 28px 20px;
    background: var(--secondary-bg);
    border-radius: 16px;
    border: 1px solid var(--border-light);
}

.offers1-cta-main {
    margin-bottom: 16px;
}

.offers1-cta-phone {
    margin-bottom: 14px;
    font-size: var(--font-sm);
    color: var(--secondary-text);
}

.offers1-phone-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--font-md);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: 6px;
    transition: all 0.3s ease;
}

.offers1-phone-link:hover {
    color: var(--hover-color);
    transform: scale(1.05);
}

.offers1-phone-link i {
    font-size: var(--font-sm);
}

.offers1-secondary-link {
    color: var(--primary-text);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: var(--border-light);
    font-size: var(--font-sm);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
}

.offers1-secondary-link:hover {
    color: var(--primary-color);
    text-decoration-color: var(--primary-color);
    transform: translateX(4px);
}

.offers1-secondary-link i {
    font-size: var(--font-xs);
    transition: transform 0.3s ease;
}

.offers1-secondary-link:hover i {
    transform: translateX(4px);
}

/* Fallback CTA Button */
.offers1-fallback-cta {
    padding: 16px 32px;
    background: var(--button-primary);
    color: var(--primary-text);
    border: none;
    border-radius: 10px;
    font-size: var(--font-md);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.25);
}

.offers1-fallback-cta:hover {
    background: var(--button-primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 107, 53, 0.35);
}

.offers1-fallback-cta:active {
    transform: translateY(0);
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.offers1-room-card.animated,
.offers1-trust-badge.animated {
    animation: fadeInUp 0.6s ease forwards;
}

/* Tablet Responsive - 768px+ */
@media (min-width: 768px) {
    .offers1-wrapper {
        padding: 64px 32px;
    }

    .offers1-hero {
        margin-bottom: 40px;
    }

    .offers1-headline {
        font-size: var(--font-3xl);
        margin-bottom: 16px;
    }

    .offers1-subheadline {
        font-size: var(--font-lg);
        margin-bottom: 24px;
    }

    .offers1-badge {
        padding: 10px 20px;
        font-size: var(--font-sm);
    }

    .offers1-banner {
        padding: 20px;
        border-radius: 14px;
        margin-bottom: 32px;
    }

    .offers1-banner-content {
        gap: 16px;
    }

    .offers1-banner-icon {
        width: 48px;
        height: 48px;
    }

    .offers1-banner-title {
        font-size: var(--font-lg);
    }

    .offers1-banner-subtitle {
        font-size: var(--font-md);
    }

    .offers1-nav-mobile {
        display: none;
    }

    .offers1-nav-desktop {
        display: flex;
    }

    .offers1-room-card {
        display: none;
        grid-template-columns: 1fr 1fr;
        gap: 0;
    }

    .offers1-room-card.active {
        display: grid;
    }

    .offers1-room-images {
        height: 360px;
    }

    .offers1-room-content {
        padding: 32px 28px;
    }

    .offers1-room-name {
        font-size: var(--font-2xl);
    }

    .offers1-room-tagline {
        font-size: var(--font-md);
    }

    .offers1-room-description {
        font-size: var(--font-md);
    }

    .offers1-features {
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
    }

    .offers1-feature span {
        font-size: var(--font-sm);
    }

    .offers1-highlights li {
        font-size: var(--font-md);
    }

    .offers1-room-button {
        padding: 16px 32px;
        font-size: var(--font-md);
    }

    .offers1-trust {
        gap: 32px;
        margin-bottom: 48px;
    }

    .offers1-trust-badge {
        padding: 16px 20px;
        min-width: 130px;
    }

    .offers1-trust-badge span {
        font-size: var(--font-sm);
    }

    .offers1-cta-section {
        padding: 36px 32px;
    }

    .offers1-cta-phone {
        font-size: var(--font-md);
    }

    .offers1-phone-link {
        font-size: var(--font-lg);
    }
}

/* Desktop Responsive - 1024px+ */
@media (min-width: 1024px) {
    .offers1-wrapper {
        padding: 80px 48px;
    }

    .offers1-hero {
        margin-bottom: 48px;
    }

    .offers1-headline {
        font-size: var(--font-4xl);
        margin-bottom: 20px;
    }

    .offers1-subheadline {
        font-size: var(--font-xl);
    }

    .offers1-banner {
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 40px;
    }

    .offers1-nav-desktop {
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 40px;
    }

    .offers1-room-images {
        height: 420px;
    }

    .offers1-room-content {
        padding: 40px 36px;
    }

    .offers1-features {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }

    .offers1-feature {
        padding: 12px;
    }

    /* Grid layout for multiple cards */
    .offers1-rooms {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 48px;
    }

    .offers1-room-card {
        display: block !important;
        grid-template-columns: 1fr;
    }

    .offers1-room-card:nth-child(n+3) {
        display: none !important;
    }

    .offers1-desktop .offers1-room-card:nth-child(1),
    .offers1-desktop .offers1-room-card:nth-child(2) {
        display: block !important;
    }

    .offers1-trust {
        gap: 40px;
    }

    .offers1-cta-section {
        padding: 44px 40px;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
    }
}

/* Large Desktop - 1440px+ */
@media (min-width: 1440px) {
    .offers1-wrapper {
        padding: 100px 60px;
    }

    .offers1-headline {
        font-size: var(--font-5xl);
    }

    .offers1-nav-desktop,
    .offers1-banner {
        max-width: 1100px;
    }

    .offers1-rooms {
        max-width: 1400px;
        gap: 32px;
    }

    .offers1-room-images {
        height: 480px;
    }

    .offers1-room-content {
        padding: 48px 40px;
    }

    .offers1-cta-section {
        max-width: 1100px;
    }
}

/* Extra responsive adjustments for small mobile */
@media (max-width: 375px) {
    .offers1-wrapper {
        padding: 40px 16px;
    }

    .offers1-headline {
        font-size: var(--font-xl);
    }

    .offers1-subheadline {
        font-size: var(--font-sm);
    }

    .offers1-banner {
        padding: 14px;
    }

    .offers1-banner-icon {
        width: 36px;
        height: 36px;
    }

    .offers1-banner-title {
        font-size: var(--font-sm);
    }

    .offers1-banner-subtitle {
        font-size: var(--font-xs);
    }

    .offers1-nav-pill {
        min-width: 110px;
        padding: 8px 12px;
    }

    .offers1-room-content {
        padding: 20px 16px;
    }

    .offers1-features {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .offers1-trust {
        gap: 14px;
    }

    .offers1-trust-badge {
        min-width: 100px;
        padding: 12px;
    }
}
