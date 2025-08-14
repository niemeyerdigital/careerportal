/**
 * Button Manager Component
 * Handles MainButton1-3 creation and styling
 * Updated with unified tracking data flow integration
 */

window.ButtonManager = class ButtonManager {
    constructor() {
        this.buttonTypes = ['MainButton1', 'MainButton2', 'MainButton3'];
        this.STORAGE_KEY = 'selectedPosition';
        this.positionData = null;
        
        // Initialize position data on construction
        this.initializePositionData();
    }

    /**
     * Initialize position data from URL params, sessionStorage, or referrer
     * Now integrated with FunnelTracking module
     */
    initializePositionData() {
        // 1. Check URL parameters first (highest priority)
        const urlPosition = this.getPositionFromURL();
        if (urlPosition) {
            this.positionData = urlPosition;
            console.log('ButtonManager: Position data loaded from URL params', this.positionData);
            
            // Sync with FunnelTracker if available
            this.syncWithFunnelTracker();
            return;
        }

        // 2. Check sessionStorage (second priority)
        const storedPosition = this.getPositionFromStorage();
        if (storedPosition) {
            this.positionData = storedPosition;
            console.log('ButtonManager: Position data loaded from sessionStorage', this.positionData);
            
            // Sync with FunnelTracker if available
            this.syncWithFunnelTracker();
            return;
        }

        // 3. Check referrer URL (third priority)
        const referrerPosition = this.getPositionFromReferrer();
        if (referrerPosition) {
            this.positionData = referrerPosition;
            console.log('ButtonManager: Position data loaded from referrer', this.positionData);
            
            // Sync with FunnelTracker if available
            this.syncWithFunnelTracker();
            return;
        }

        // 4. Check FunnelTracker for existing data
        if (window.FunnelTracker && window.FunnelTracker.sessionData) {
            const trackerData = window.FunnelTracker.sessionData.positionData;
            if (trackerData) {
                this.positionData = trackerData;
                console.log('ButtonManager: Position data loaded from FunnelTracker', this.positionData);
                return;
            }
        }

        console.log('ButtonManager: No position data found, using default behavior');
    }

    /**
     * Sync position data with FunnelTracker
     */
    syncWithFunnelTracker() {
        if (window.FunnelTracker && typeof window.FunnelTracker.updatePositionData === 'function') {
            window.FunnelTracker.updatePositionData(this.positionData);
            console.log('ButtonManager: Position data synced with FunnelTracker');
        }
    }

    /**
     * Get position data from URL parameters
     */
    getPositionFromURL() {
        const params = new URLSearchParams(window.location.search);
        const positionId = params.get('positionId');
        const contentId = params.get('contentId') || params.get('origin');
        
        if (!positionId && !contentId) return null;

        // Try to get full position data from global positions registry
        if (window.POSITIONS_REGISTRY && positionId && window.POSITIONS_REGISTRY[positionId]) {
            return window.POSITIONS_REGISTRY[positionId];
        }

        // Build position data from URL params
        if (contentId || positionId) {
            return {
                id: positionId || contentId,
                contentId: contentId || positionId,
                applicationUrl: null // Will need to be resolved
            };
        }

        return null;
    }

    /**
     * Get position data from sessionStorage
     */
    getPositionFromStorage() {
        try {
            // Check both possible storage keys
            const stored = sessionStorage.getItem(this.STORAGE_KEY) || 
                          sessionStorage.getItem('origin') || 
                          sessionStorage.getItem('contentId');
            
            if (!stored) return null;

            // If it's JSON, parse it
            if (stored.startsWith('{')) {
                const data = JSON.parse(stored);
                
                // Check if data is still fresh (within 2 hours)
                const TWO_HOURS = 2 * 60 * 60 * 1000;
                if (data.timestamp && (Date.now() - data.timestamp) > TWO_HOURS) {
                    sessionStorage.removeItem(this.STORAGE_KEY);
                    return null;
                }
                
                return data;
            } else {
                // It's a simple contentId string
                return {
                    id: stored,
                    contentId: stored,
                    applicationUrl: null
                };
            }
        } catch (e) {
            console.error('ButtonManager: Error reading from sessionStorage', e);
            return null;
        }
    }

    /**
     * Get position data from referrer URL
     */
    getPositionFromReferrer() {
        if (!document.referrer) return null;

        try {
            const referrerURL = new URL(document.referrer);
            const params = new URLSearchParams(referrerURL.search);
            const positionId = params.get('positionId');
            const contentId = params.get('contentId') || params.get('origin');
            
            if (!positionId && !contentId) return null;

            // Try to get full position data from global positions registry
            if (window.POSITIONS_REGISTRY && positionId && window.POSITIONS_REGISTRY[positionId]) {
                return window.POSITIONS_REGISTRY[positionId];
            }

            // Return partial data if registry not available
            if (contentId || positionId) {
                return {
                    id: positionId || contentId,
                    contentId: contentId || positionId,
                    applicationUrl: null
                };
            }

            return null;
        } catch (e) {
            console.error('ButtonManager: Error parsing referrer URL', e);
            return null;
        }
    }

    /**
     * Store position data in sessionStorage and sync with tracking
     */
    storePositionData(positionData) {
        try {
            const dataToStore = {
                ...positionData,
                timestamp: Date.now()
            };
            
            // Store in multiple formats for compatibility
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToStore));
            
            // Also store contentId and origin separately
            if (positionData.contentId) {
                sessionStorage.setItem('origin', positionData.contentId);
                sessionStorage.setItem('contentId', positionData.contentId);
            }
            
            console.log('ButtonManager: Position data stored', dataToStore);
            
            // Update internal state
            this.positionData = dataToStore;
            
            // Sync with FunnelTracker
            this.syncWithFunnelTracker();
            
        } catch (e) {
            console.error('ButtonManager: Error storing position data', e);
        }
    }

    /**
     * Clear stored position data
     */
    clearPositionData() {
        try {
            sessionStorage.removeItem(this.STORAGE_KEY);
            sessionStorage.removeItem('origin');
            sessionStorage.removeItem('contentId');
            this.positionData = null;
            console.log('ButtonManager: Position data cleared');
        } catch (e) {
            console.error('ButtonManager: Error clearing position data', e);
        }
    }

    /**
     * Create a button with specified type and configuration
     * Now includes dynamic position-based redirect logic with tracking
     */
    createButton(type, config = {}) {
        const {
            text = 'Button',
            href = '#',
            icon = null,
            className = '',
            onClick = null,
            id = null,
            usePositionRedirect = true, // New option to enable/disable position redirect
            fallbackSection = null // Section to scroll to if no position data
        } = config;

        // Validate button type
        if (!this.buttonTypes.includes(type)) {
            console.error(`Invalid button type: ${type}. Valid types: ${this.buttonTypes.join(', ')}`);
            return null;
        }

        // Determine final href and text based on position data
        let finalHref = href;
        let finalText = text;
        let finalOnClick = onClick;

        if (usePositionRedirect && this.positionData && this.positionData.applicationUrl) {
            // Use position-specific application URL
            finalHref = this.positionData.applicationUrl;
            
            // Optionally update button text to include position name
            if (this.positionData.position && text.toLowerCase().includes('bewerben')) {
                // Keep original text, but we could customize it
                // finalText = `Für ${this.positionData.position} bewerben`;
            }

            // Track position-based redirect
            const originalOnClick = onClick;
            finalOnClick = (e) => {
                // Track the position-based redirect with FunnelTracker if available
                if (window.FunnelTracker && typeof window.FunnelTracker.trackEvent === 'function') {
                    window.FunnelTracker.trackEvent('PositionRedirect', {
                        position_id: this.positionData.id,
                        content_id: this.positionData.contentId
                    });
                }
                
                // Also track with gtag if available
                if (window.gtag) {
                    window.gtag('event', 'position_redirect', {
                        event_category: 'CTA',
                        event_label: 'Position-based Application',
                        position_id: this.positionData.id,
                        content_id: this.positionData.contentId
                    });
                }

                // Prepare URL with tracking parameters
                if (finalHref && finalHref !== '#') {
                    // Use FunnelTracker to prepare URL if available
                    if (window.FunnelTracker && typeof window.FunnelTracker.prepareNextStepUrl === 'function') {
                        finalHref = window.FunnelTracker.prepareNextStepUrl(finalHref);
                    } else {
                        // Manual URL preparation
                        try {
                            const url = new URL(finalHref, window.location.origin);
                            url.searchParams.set('ref_position', this.positionData.contentId);
                            url.searchParams.set('ref_id', this.positionData.id);
                            url.searchParams.set('origin', this.positionData.contentId);
                            finalHref = url.toString();
                        } catch (e) {
                            // URL parsing failed, use original
                        }
                    }
                }

                // Call original onClick if provided
                if (originalOnClick && typeof originalOnClick === 'function') {
                    originalOnClick(e);
                }

                // If not preventing default, navigate
                if (!e.defaultPrevented && finalHref && finalHref !== '#') {
                    window.location.href = finalHref;
                }
            };
        } else if (usePositionRedirect && fallbackSection) {
            // No position data, use fallback scroll behavior
            finalOnClick = (e) => {
                e.preventDefault();
                
                // Track fallback action
                if (window.FunnelTracker && typeof window.FunnelTracker.trackEvent === 'function') {
                    window.FunnelTracker.trackEvent('FallbackScroll', {
                        target_section: fallbackSection
                    });
                }
                
                // Also track with gtag if available
                if (window.gtag) {
                    window.gtag('event', 'scroll_to_section', {
                        event_category: 'Navigation',
                        event_label: 'Fallback Scroll',
                        target_section: fallbackSection
                    });
                }

                // Scroll to fallback section
                this.scrollToSection(fallbackSection);

                // Call original onClick if provided
                if (onClick && typeof onClick === 'function') {
                    onClick(e);
                }
            };
            finalHref = '#'; // Override href for scroll behavior
        }

        // Create container div with data-title attribute
        const container = document.createElement('div');
        container.setAttribute('data-title', type);
        if (className) container.className = className;

        // Add data attributes for tracking
        if (this.positionData && usePositionRedirect) {
            container.setAttribute('data-position-id', this.positionData.id);
            container.setAttribute('data-content-id', this.positionData.contentId);
        }

        // Create the button/anchor element
        const element = (finalHref === '#' || finalOnClick) ? 
            document.createElement('button') : 
            document.createElement('a');
        
        if (id) element.id = id;
        if (finalHref && !finalOnClick) element.href = finalHref;
        
        // Set text content
        element.textContent = finalText;
        
        // Add icon if specified
        if (icon) {
            const iconElement = document.createElement('i');
            iconElement.className = icon;
            element.appendChild(iconElement);
        }

        // Add click handler if specified
        if (finalOnClick && typeof finalOnClick === 'function') {
            element.addEventListener('click', finalOnClick);
        }

        container.appendChild(element);
        return container;
    }

    /**
     * Create a primary CTA button (MainButton1) with position redirect
     */
    createPrimaryButton(config) {
        return this.createButton('MainButton1', {
            ...config,
            usePositionRedirect: config.usePositionRedirect !== false // Default true
        });
    }

    /**
     * Create a light button (MainButton2) with position redirect
     */
    createLightButton(config) {
        return this.createButton('MainButton2', {
            ...config,
            usePositionRedirect: config.usePositionRedirect !== false // Default true
        });
    }

    /**
     * Create a dark button (MainButton3) with position redirect
     */
    createDarkButton(config) {
        return this.createButton('MainButton3', {
            ...config,
            usePositionRedirect: config.usePositionRedirect !== false // Default true
        });
    }

    /**
     * Scroll to target section
     */
    scrollToSection(targetSection) {
        // Try different selectors
        let targetElement = document.querySelector(`div[data-title='${targetSection}']`);
        
        if (!targetElement) {
            targetElement = document.getElementById(targetSection);
        }
        
        if (!targetElement) {
            targetElement = document.querySelector(`.${targetSection}`);
        }
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        } else {
            console.warn(`ButtonManager: Target section '${targetSection}' not found`);
        }
    }

    /**
     * Update position data dynamically
     */
    updatePositionData(newPositionData) {
        this.positionData = newPositionData;
        this.storePositionData(newPositionData);
        console.log('ButtonManager: Position data updated', this.positionData);
    }

    /**
     * Check if position redirect is active
     */
    hasPositionRedirect() {
        return !!(this.positionData && this.positionData.applicationUrl);
    }

    /**
     * Get current position data
     */
    getPositionData() {
        return this.positionData;
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

    /**
     * Prepare URL for next step with all tracking parameters
     */
    prepareTrackingUrl(targetUrl) {
        // Use FunnelTracker if available
        if (window.FunnelTracker && typeof window.FunnelTracker.prepareNextStepUrl === 'function') {
            return window.FunnelTracker.prepareNextStepUrl(targetUrl);
        }

        // Fallback to manual preparation
        try {
            const url = new URL(targetUrl, window.location.origin);
            
            // Add position data if available
            if (this.positionData) {
                if (this.positionData.contentId) {
                    url.searchParams.set('contentId', this.positionData.contentId);
                    url.searchParams.set('origin', this.positionData.contentId);
                }
                if (this.positionData.id) {
                    url.searchParams.set('positionId', this.positionData.id);
                }
            }
            
            // Add timestamp
            url.searchParams.set('timestamp', Date.now());
            
            return url.toString();
        } catch (e) {
            console.error('ButtonManager: Error preparing tracking URL', e);
            return targetUrl;
        }
    }
};
