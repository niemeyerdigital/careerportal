/**
 * Button Manager Component
 * Handles MainButton1-3 creation and styling
 */

window.ButtonManager = class ButtonManager {
    constructor() {
        this.buttonTypes = ['MainButton1', 'MainButton2', 'MainButton3'];
    }

    /**
     * Create a button with specified type and configuration
     */
    createButton(type, config = {}) {
        const {
            text = 'Button',
            href = '#',
            icon = null,
            className = '',
            onClick = null,
            id = null
        } = config;

        // Validate button type
        if (!this.buttonTypes.includes(type)) {
            console.error(`Invalid button type: ${type}. Valid types: ${this.buttonTypes.join(', ')}`);
            return null;
        }

        // Create container div with data-title attribute
        const container = document.createElement('div');
        container.setAttribute('data-title', type);
        if (className) container.className = className;

        // Create the button/anchor element
        const element = href === '#' || onClick ? document.createElement('button') : document.createElement('a');
        
        if (id) element.id = id;
        if (href && !onClick) element.href = href;
        
        // Set text content
        element.textContent = text;
        
        // Add icon if specified
        if (icon) {
            const iconElement = document.createElement('i');
            iconElement.className = icon;
            element.appendChild(iconElement);
        }

        // Add click handler if specified
        if (onClick && typeof onClick === 'function') {
            element.addEventListener('click', (e) => {
                if (href === '#') e.preventDefault();
                onClick(e);
            });
        }

        container.appendChild(element);
        return container;
    }

    /**
     * Create a primary CTA button (MainButton1)
     */
    createPrimaryButton(config) {
        return this.createButton('MainButton1', config);
    }

    /**
     * Create a light button (MainButton2)
     */
    createLightButton(config) {
        return this.createButton('MainButton2', config);
    }

    /**
     * Create a dark button (MainButton3)
     */
    createDarkButton(config) {
        return this.createButton('MainButton3', config);
    }

    /**
     * Update button text and maintain existing functionality
     */
    updateButton(buttonElement, newText, newIcon = null) {
        const button = buttonElement.querySelector('button, a');
        if (!button) return;

        // Store existing icon if any
        const existingIcon = button.querySelector('i');
        
        // Update text
        button.textContent = newText;
        
        // Re-add icon (existing or new)
        const iconToAdd = newIcon || (existingIcon ? existingIcon.className : null);
        if (iconToAdd) {
            const iconElement = document.createElement('i');
            iconElement.className = typeof iconToAdd === 'string' ? iconToAdd : iconToAdd.className;
            button.appendChild(iconElement);
        }
    }

    /**
     * Apply button type to existing element
     */
    applyButtonType(containerElement, buttonType) {
        if (!containerElement || !this.buttonTypes.includes(buttonType)) {
            console.error(`Invalid container or button type: ${buttonType}`);
            return;
        }

        containerElement.setAttribute('data-title', buttonType);
    }

    /**
     * Create a secondary link button (transparent with underline)
     */
    createSecondaryLink(config = {}) {
        const {
            text = 'Learn More',
            onClick = null,
            className = '',
            id = null
        } = config;

        const button = document.createElement('button');
        button.textContent = text;
        button.className = `secondary-link ${className}`.trim();
        
        if (id) button.id = id;

        // Apply inline styles for secondary link
        button.style.cssText = `
            font-family: var(--font-family);
            font-size: var(--font-md);
            font-weight: 500;
            color: var(--primary-text);
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.9;
            padding: 8px 0;
        `;

        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.color = 'var(--primary-color)';
            button.style.textDecorationColor = 'var(--primary-color)';
            button.style.opacity = '1';
            button.style.transform = 'translateY(-1px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.color = 'var(--primary-text)';
            button.style.textDecorationColor = '';
            button.style.opacity = '0.9';
            button.style.transform = 'translateY(0)';
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0)';
        });

        // Add click handler
        if (onClick && typeof onClick === 'function') {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    /**
     * Create button group container
     */
    createButtonGroup(buttons = [], config = {}) {
        const {
            direction = 'column', // 'column' or 'row'
            gap = '16px',
            align = 'center',
            className = ''
        } = config;

        const container = document.createElement('div');
        container.className = `button-group ${className}`.trim();
        container.style.cssText = `
            display: flex;
            flex-direction: ${direction};
            align-items: ${align};
            gap: ${gap};
        `;

        buttons.forEach(button => {
            if (button) {
                container.appendChild(button);
            }
        });

        return container;
    }

    /**
     * Get button type from element
     */
    getButtonType(buttonElement) {
        const container = buttonElement.closest('[data-title]');
        return container ? container.getAttribute('data-title') : null;
    }

    /**
     * Check if element is a career portal button
     */
    isCareerPortalButton(element) {
        const container = element.closest('[data-title]');
        return container && this.buttonTypes.includes(container.getAttribute('data-title'));
    }
};