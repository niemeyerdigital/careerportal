/**
 * Badge Component
 * Creates reusable badge/pill components for career portal
 */

window.BadgeComponent = class BadgeComponent {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.container = null;
        this.config = {
            logoSrc: '',
            logoAlt: 'Logo',
            text: 'Badge Text',
            logoSize: '32px',
            fontSize: 'var(--font-sm)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '12px 20px',
            borderRadius: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'var(--primary-text)',
            gap: '12px',
            hoverTransform: 'translateY(-2px)',
            hoverBackground: 'rgba(255, 255, 255, 0.15)',
            className: '',
            ...config
        };
        
        this.init();
    }

    /**
     * Initialize the badge component
     */
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found`);
            return;
        }

        this.createBadge();
    }

    /**
     * Create the badge element
     */
    createBadge() {
        const badge = document.createElement('div');
        badge.className = `career-badge ${this.config.className}`.trim();
        
        // Apply base styles
        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: ${this.config.gap};
            background: ${this.config.backgroundColor};
            backdrop-filter: ${this.config.backdropFilter};
            border: ${this.config.border};
            border-radius: ${this.config.borderRadius};
            padding: ${this.config.padding};
            transition: all 0.3s ease;
            cursor: default;
            font-family: var(--font-family);
        `;

        // Add hover effects
        badge.addEventListener('mouseenter', () => {
            badge.style.background = this.config.hoverBackground;
            badge.style.transform = this.config.hoverTransform;
            badge.style.boxShadow = '0 10px 30px var(--shadow-medium)';
        });

        badge.addEventListener('mouseleave', () => {
            badge.style.background = this.config.backgroundColor;
            badge.style.transform = 'translateY(0)';
            badge.style.boxShadow = '';
        });

        // Create logo if provided
        if (this.config.logoSrc) {
            const logo = this.createLogo();
            badge.appendChild(logo);
        }

        // Create text element
        const text = this.createText();
        badge.appendChild(text);

        // Add to container
        this.container.appendChild(badge);
        this.badgeElement = badge;
    }

    /**
     * Create logo element
     */
    createLogo() {
        const logo = document.createElement('img');
        logo.src = this.config.logoSrc;
        logo.alt = this.config.logoAlt;
        logo.className = 'badge-logo';
        logo.style.cssText = `
            width: ${this.config.logoSize};
            height: ${this.config.logoSize};
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
        `;
        
        return logo;
    }

    /**
     * Create text element
     */
    createText() {
        const textElement = document.createElement('p');
        textElement.className = 'badge-text';
        textElement.textContent = this.config.text;
        textElement.style.cssText = `
            font-size: ${this.config.fontSize};
            font-weight: ${this.config.fontWeight};
            color: ${this.config.color};
            margin: 0;
            text-transform: ${this.config.textTransform};
            letter-spacing: ${this.config.letterSpacing};
            white-space: nowrap;
        `;
        
        return textElement;
    }

    /**
     * Update badge content
     */
    update(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        if (this.badgeElement) {
            this.container.removeChild(this.badgeElement);
        }
        
        this.createBadge();
    }

    /**
     * Update just the text
     */
    updateText(newText) {
        const textElement = this.badgeElement?.querySelector('.badge-text');
        if (textElement) {
            textElement.textContent = newText;
            this.config.text = newText;
        }
    }

    /**
     * Update just the logo
     */
    updateLogo(newSrc, newAlt = '') {
        const logoElement = this.badgeElement?.querySelector('.badge-logo');
        if (logoElement) {
            logoElement.src = newSrc;
            if (newAlt) logoElement.alt = newAlt;
            this.config.logoSrc = newSrc;
            if (newAlt) this.config.logoAlt = newAlt;
        }
    }

    /**
     * Make badge clickable
     */
    makeClickable(onClick) {
        if (!this.badgeElement || typeof onClick !== 'function') return;
        
        this.badgeElement.style.cursor = 'pointer';
        this.badgeElement.addEventListener('click', onClick);
        
        // Add active state
        this.badgeElement.addEventListener('mousedown', () => {
            this.badgeElement.style.transform = 'translateY(0) scale(0.98)';
        });
        
        this.badgeElement.addEventListener('mouseup', () => {
            this.badgeElement.style.transform = this.config.hoverTransform;
        });
    }

    /**
     * Add animation to badge
     */
    animate(animationType = 'slideUp', delay = 0) {
        if (!this.badgeElement) return;
        
        const animations = {
            slideUp: {
                initial: 'opacity: 0; transform: translateY(30px);',
                final: 'opacity: 1; transform: translateY(0);'
            },
            fadeIn: {
                initial: 'opacity: 0;',
                final: 'opacity: 1;'
            },
            scaleIn: {
                initial: 'opacity: 0; transform: scale(0.8);',
                final: 'opacity: 1; transform: scale(1);'
            }
        };
        
        const animation = animations[animationType] || animations.slideUp;
        
        // Set initial state
        this.badgeElement.style.cssText += animation.initial;
        
        // Trigger animation after delay
        setTimeout(() => {
            this.badgeElement.style.transition = 'all 0.6s ease-out';
            this.badgeElement.style.cssText = this.badgeElement.style.cssText.replace(
                animation.initial, 
                animation.final
            );
        }, delay);
    }

    /**
     * Destroy the badge
     */
    destroy() {
        if (this.badgeElement && this.container) {
            this.container.removeChild(this.badgeElement);
            this.badgeElement = null;
        }
    }

    /**
     * Create work-at style badge (specific for career portal)
     */
    static createWorkAtBadge(containerId, config = {}) {
        const workAtConfig = {
            text: `${config.workAt || 'Work at'} ${config.companyName || 'Company'}`,
            logoSrc: config.logoSrc || '',
            logoAlt: config.companyName || 'Company Logo',
            ...config
        };
        
        return new BadgeComponent(containerId, workAtConfig);
    }
};