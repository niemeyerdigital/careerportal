/**
 * Configuration Validator
 * Validates section configurations to prevent runtime errors
 * Includes Cookie Banner, Thanks Section, Exclude Section, Offers1, and Tracking validation
 */

window.ConfigValidator = {
    /**
     * Section schemas define required and optional fields
     */
    schemas: {
        tracking: {
            required: ['funnelStep'],
            optional: ['tracking', 'contentId', 'debug'],
            types: {
                funnelStep: 'string',
                tracking: 'object',
                contentId: 'object',
                debug: 'boolean'
            },
            enums: {
                funnelStep: ['Landing', 'Formular', 'Ausschluss', 'Danke']
            },
            defaults: {
                tracking: {
                    scrollDepth: {
                        enabled: true,
                        depths: [25, 50, 75, 100]
                    },
                    browserType: {
                        enabled: true
                    },
                    deviceType: {
                        enabled: true
                    },
                    activityStatus: {
                        enabled: true,
                        inactivityThreshold: 30000
                    },
                    dwellTime: {
                        enabled: true,
                        checkInterval: 1000
                    }
                },
                contentId: {
                    autoGenerate: true,
                    fallback: 'unknown_origin'
                },
                debug: false
            },
            subSchemas: {
                tracking: {
                    optional: ['scrollDepth', 'browserType', 'deviceType', 'activityStatus', 'dwellTime'],
                    types: {
                        scrollDepth: 'object',
                        browserType: 'object',
                        deviceType: 'object',
                        activityStatus: 'object',
                        dwellTime: 'object'
                    },
                    customValidation: (tracking) => {
                        const errors = [];
                        
                        // Validate scroll depth
                        if (tracking.scrollDepth) {
                            if (typeof tracking.scrollDepth.enabled !== 'boolean') {
                                errors.push('tracking.scrollDepth.enabled must be a boolean');
                            }
                            if (tracking.scrollDepth.depths && !Array.isArray(tracking.scrollDepth.depths)) {
                                errors.push('tracking.scrollDepth.depths must be an array');
                            } else if (tracking.scrollDepth.depths) {
                                tracking.scrollDepth.depths.forEach((depth, i) => {
                                    if (typeof depth !== 'number' || depth < 0 || depth > 100) {
                                        errors.push(`tracking.scrollDepth.depths[${i}] must be a number between 0 and 100`);
                                    }
                                });
                            }
                        }
                        
                        // Validate activity status
                        if (tracking.activityStatus) {
                            if (typeof tracking.activityStatus.enabled !== 'boolean') {
                                errors.push('tracking.activityStatus.enabled must be a boolean');
                            }
                            if (tracking.activityStatus.inactivityThreshold && 
                                (typeof tracking.activityStatus.inactivityThreshold !== 'number' || 
                                 tracking.activityStatus.inactivityThreshold < 1000)) {
                                errors.push('tracking.activityStatus.inactivityThreshold must be at least 1000ms');
                            }
                        }
                        
                        // Validate dwell time
                        if (tracking.dwellTime) {
                            if (typeof tracking.dwellTime.enabled !== 'boolean') {
                                errors.push('tracking.dwellTime.enabled must be a boolean');
                            }
                            if (tracking.dwellTime.checkInterval && 
                                (typeof tracking.dwellTime.checkInterval !== 'number' || 
                                 tracking.dwellTime.checkInterval < 100)) {
                                errors.push('tracking.dwellTime.checkInterval must be at least 100ms');
                            }
                        }
                        
                        return errors;
                    }
                },
                contentId: {
                    required: ['autoGenerate', 'fallback'],
                    types: {
                        autoGenerate: 'boolean',
                        fallback: 'string'
                    }
                }
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate funnel step
                if (!config.funnelStep) {
                    errors.push('funnelStep is required');
                } else if (!['Landing', 'Formular', 'Ausschluss', 'Danke'].includes(config.funnelStep)) {
                    errors.push(`Invalid funnelStep: ${config.funnelStep}. Must be one of: Landing, Formular, Ausschluss, Danke`);
                }
                
                // Validate content ID fallback format
                if (config.contentId && config.contentId.fallback) {
                    if (!/^[a-z0-9_]+$/.test(config.contentId.fallback)) {
                        errors.push('contentId.fallback must contain only lowercase letters, numbers, and underscores');
                    }
                }
                
                return errors;
            }
        },
        cookieBanner: {
            required: [],
            optional: ['facebook', 'banner', 'categories', 'buttons', 'tracking', 'advanced'],
            types: {
                facebook: 'object',
                banner: 'object',
                categories: 'object',
                buttons: 'object',
                tracking: 'object',
                advanced: 'object'
            },
            subSchemas: {
                facebook: {
                    required: ['pixelId', 'enabled'],
                    optional: ['events'],
                    types: {
                        pixelId: 'string',
                        enabled: 'boolean',
                        events: 'object'
                    }
                },
                banner: {
                    required: [],
                    optional: ['headline', 'description', 'privacyPolicyUrl', 'cookiePolicyUrl', 'position', 'showOverlay', 'animation', 'autoShowDelay', 'iconType'],
                    types: {
                        headline: 'string',
                        description: 'string',
                        privacyPolicyUrl: 'string',
                        cookiePolicyUrl: 'string',
                        position: 'string',
                        showOverlay: 'boolean',
                        animation: 'string',
                        autoShowDelay: 'number',
                        iconType: 'string'
                    },
                    enums: {
                        position: ['bottom-left', 'bottom-right', 'center'],
                        animation: ['slide', 'fade', 'pop'],
                        iconType: ['animated', 'static', 'none']
                    }
                },
                categories: {
                    customValidation: (categories) => {
                        const errors = [];
                        let hasEssential = false;
                        
                        for (const [key, category] of Object.entries(categories)) {
                            if (!category.label) {
                                errors.push(`categories.${key}.label is required`);
                            }
                            if (!category.description) {
                                errors.push(`categories.${key}.description is required`);
                            }
                            if (category.required === true) {
                                hasEssential = true;
                            }
                        }
                        
                        if (!hasEssential) {
                            errors.push('At least one category must be marked as required (essential)');
                        }
                        
                        return errors;
                    }
                },
                buttons: {
                    customValidation: (buttons) => {
                        const errors = [];
                        
                        if (!buttons.acceptAll || !buttons.acceptAll.text) {
                            errors.push('buttons.acceptAll.text is required');
                        }
                        if (!buttons.saveSettings || !buttons.saveSettings.text) {
                            errors.push('buttons.saveSettings.text is required');
                        }
                        
                        // Check button styles
                        const validStyles = ['primary', 'secondary', 'tertiary'];
                        for (const [key, button] of Object.entries(buttons)) {
                            if (button.style && !validStyles.includes(button.style)) {
                                errors.push(`buttons.${key}.style must be one of: ${validStyles.join(', ')}`);
                            }
                        }
                        
                        return errors;
                    }
                }
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate Facebook Pixel ID format if enabled
                if (config.facebook && config.facebook.enabled && config.facebook.pixelId) {
                    // Basic check for pixel ID format (should be numeric)
                    if (!/^\d{15,16}$/.test(config.facebook.pixelId.replace(/\s/g, ''))) {
                        console.warn('Facebook Pixel ID format may be incorrect');
                    }
                }
                
                // Validate URLs
                if (config.banner) {
                    if (config.banner.privacyPolicyUrl && !config.banner.privacyPolicyUrl.startsWith('http') && !config.banner.privacyPolicyUrl.startsWith('#')) {
                        errors.push('banner.privacyPolicyUrl must be a valid URL or anchor link');
                    }
                    if (config.banner.cookiePolicyUrl && !config.banner.cookiePolicyUrl.startsWith('http') && !config.banner.cookiePolicyUrl.startsWith('#')) {
                        errors.push('banner.cookiePolicyUrl must be a valid URL or anchor link');
                    }
                }
                
                // Validate advanced settings
                if (config.advanced) {
                    if (config.advanced.cookieLifetime && config.advanced.cookieLifetime < 1) {
                        errors.push('advanced.cookieLifetime must be at least 1 day');
                    }
                    if (config.advanced.reShowAfterDays && config.advanced.reShowAfterDays < 1) {
                        errors.push('advanced.reShowAfterDays must be at least 1 day');
                    }
                }
                
                return errors;
            }
        },
        thanks: {
            required: ['bannerText', 'confirmationBadgeText', 'mainHeadline', 'mainDescription', 'quickActionButtonText', 'contact', 'socialMedia'],
            optional: ['onQuickActionClick', 'onSocialClick', 'onContactClick'],
            types: {
                bannerText: 'string',
                confirmationBadgeText: 'string',
                mainHeadline: 'string',
                mainDescription: 'string',
                quickActionButtonText: 'string',
                contact: 'object',
                socialMedia: 'object',
                onQuickActionClick: 'function',
                onSocialClick: 'function',
                onContactClick: 'function'
            },
            defaults: {
                bannerText: "STOPP, schließe noch nicht diese Seite 👇",
                confirmationBadgeText: "Erfolgreich übermittelt",
                mainHeadline: "Vielen Dank für deine Anfrage!",
                mainDescription: "Dein Formular wurde erfolgreich übermittelt.",
                quickActionButtonText: "Schneller vorankommen",
                contact: {
                    showPortrait: true,
                    portraitUrl: "https://via.placeholder.com/80x80/ff6b35/ffffff?text=MN",
                    name: "[NAME_PLACEHOLDER]",
                    position: "[POSITION_PLACEHOLDER]",
                    email: "[EMAIL_PLACEHOLDER]",
                    phone: "[PHONE_PLACEHOLDER]"
                },
                socialMedia: {
                    channelName: "PLACEHOLDER",
                    channelUrl: "#PLACEHOLDER"
                }
            },
            subSchemas: {
                contact: {
                    required: ['name', 'position', 'email', 'phone'],
                    optional: ['showPortrait', 'portraitUrl'],
                    types: {
                        showPortrait: 'boolean',
                        portraitUrl: 'string',
                        name: 'string',
                        position: 'string',
                        email: 'string',
                        phone: 'string'
                    }
                },
                socialMedia: {
                    required: ['channelName', 'channelUrl'],
                    types: {
                        channelName: 'string',
                        channelUrl: 'string'
                    }
                }
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate email format if not a placeholder
                if (config.contact && config.contact.email && !config.contact.email.includes('PLACEHOLDER')) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(config.contact.email)) {
                        errors.push('contact.email must be a valid email address');
                    }
                }
                
                // Validate portrait URL if enabled
                if (config.contact && config.contact.showPortrait && !config.contact.portraitUrl) {
                    errors.push('contact.portraitUrl is required when showPortrait is true');
                }
                
                // Validate social media URL
                if (config.socialMedia && config.socialMedia.channelUrl && 
                    !config.socialMedia.channelUrl.startsWith('#') && 
                    !config.socialMedia.channelUrl.startsWith('http')) {
                    errors.push('socialMedia.channelUrl must be a valid URL or anchor link');
                }
                
                return errors;
            }
        },
        exclude: {
            required: ['statusBadgeText', 'mainHeadline', 'mainDescription', 'messageTitle', 'messageText'],
            optional: ['alternativePathsTitle', 'alternativePaths', 'improvementHeadline', 'improvementTips', 'footerText', 'talentPool', 'socialMedia', 'onPathClick', 'onSocialClick'],
            types: {
                statusBadgeText: 'string',
                mainHeadline: 'string',
                mainDescription: 'string',
                messageTitle: 'string',
                messageText: 'string',
                alternativePathsTitle: 'string',
                alternativePaths: 'object',
                improvementHeadline: 'string',
                improvementTips: 'object',
                footerText: 'string',
                talentPool: 'object',
                socialMedia: 'object',
                onPathClick: 'function',
                onSocialClick: 'function'
            },
            defaults: {
                statusBadgeText: "Bewerbung abgeschlossen",
                mainHeadline: "Vielen Dank für dein Interesse",
                mainDescription: "Wir haben deine Bewerbung sorgfältig geprüft.",
                messageTitle: "Leider passt es diesmal nicht",
                messageText: "Nach eingehender Prüfung deiner Unterlagen müssen wir dir mitteilen, dass dein Profil aktuell nicht zu unseren Anforderungen passt.",
                alternativePathsTitle: "Alternative Möglichkeiten",
                alternativePaths: [],
                improvementHeadline: "Tipps für deine nächste Bewerbung",
                improvementTips: [],
                footerText: "Wir wünschen dir viel Erfolg für deinen weiteren Werdegang!",
                talentPool: {
                    enabled: false,
                    buttonText: "In Talentpool aufnehmen",
                    modalTitle: "Bleib mit uns in Kontakt",
                    modalDescription: "Lass uns deine Daten speichern und wir informieren dich, sobald eine passende Position frei wird.",
                    interests: [],
                    onSubmit: null
                },
                socialMedia: {
                    linkedin: { enabled: false, url: "#", icon: "fab fa-linkedin-in" },
                    facebook: { enabled: false, url: "#", icon: "fab fa-facebook-f" },
                    instagram: { enabled: false, url: "#", icon: "fab fa-instagram" },
                    xing: { enabled: false, url: "#", icon: "fab fa-xing" }
                }
            },
            subSchemas: {
                talentPool: {
                    required: ['enabled'],
                    optional: ['buttonText', 'modalTitle', 'modalDescription', 'interests', 'onSubmit'],
                    types: {
                        enabled: 'boolean',
                        buttonText: 'string',
                        modalTitle: 'string',
                        modalDescription: 'string',
                        interests: 'object',
                        onSubmit: 'function'
                    }
                }
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate alternative paths if provided
                if (config.alternativePaths && Array.isArray(config.alternativePaths)) {
                    config.alternativePaths.forEach((path, index) => {
                        if (!path.icon) errors.push(`alternativePaths[${index}].icon is required`);
                        if (!path.title) errors.push(`alternativePaths[${index}].title is required`);
                        if (!path.description) errors.push(`alternativePaths[${index}].description is required`);
                        
                        // If link URL is provided, validate it
                        if (path.linkUrl && !path.linkUrl.startsWith('#') && !path.linkUrl.startsWith('http')) {
                            errors.push(`alternativePaths[${index}].linkUrl must be a valid URL or anchor link`);
                        }
                    });
                }
                
                // Validate improvement tips if provided
                if (config.improvementTips && !Array.isArray(config.improvementTips)) {
                    errors.push('improvementTips must be an array');
                }
                
                // Validate talent pool configuration if enabled
                if (config.talentPool && config.talentPool.enabled) {
                    if (!config.talentPool.buttonText) {
                        errors.push('talentPool.buttonText is required when enabled');
                    }
                    if (!config.talentPool.modalTitle) {
                        errors.push('talentPool.modalTitle is required when enabled');
                    }
                    if (!config.talentPool.modalDescription) {
                        errors.push('talentPool.modalDescription is required when enabled');
                    }
                    if (!Array.isArray(config.talentPool.interests)) {
                        errors.push('talentPool.interests must be an array');
                    }
                }
                
                return errors;
            }
        },
        offers1: {
            required: ['hero', 'rooms', 'cta'],
            optional: ['offerBanner', 'trustBadges', 'display', 'tracking'],
            types: {
                hero: 'object',
                offerBanner: 'object',
                rooms: 'object',
                cta: 'object',
                trustBadges: 'object',
                display: 'object',
                tracking: 'object'
            },
            defaults: {
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
                    enabled: false,
                    icon: "fas fa-tag",
                    title: "Special Offer",
                    text: "Book now and save",
                    validUntil: null
                },
                rooms: [],
                cta: {
                    mainButtonText: "Get Started",
                    mainButtonType: "MainButton1",
                    phoneNumber: null,
                    phoneText: "Or call:",
                    secondaryLink: null,
                    secondaryText: "Learn more"
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
                    enabled: true,
                    onRoomClick: null,
                    onCTAClick: null
                }
            },
            subSchemas: {
                hero: {
                    required: ['headline', 'subheadline'],
                    optional: ['badge'],
                    types: {
                        headline: 'string',
                        subheadline: 'string',
                        badge: 'object'
                    }
                },
                offerBanner: {
                    required: ['enabled'],
                    optional: ['icon', 'title', 'text', 'validUntil'],
                    types: {
                        enabled: 'boolean',
                        icon: 'string',
                        title: 'string',
                        text: 'string',
                        validUntil: 'string'
                    }
                },
                cta: {
                    required: ['mainButtonText'],
                    optional: ['mainButtonType', 'phoneNumber', 'phoneText', 'secondaryLink', 'secondaryText'],
                    types: {
                        mainButtonText: 'string',
                        mainButtonType: 'string',
                        phoneNumber: 'string',
                        phoneText: 'string',
                        secondaryLink: 'string',
                        secondaryText: 'string'
                    }
                },
                trustBadges: {
                    required: ['enabled'],
                    optional: ['badges'],
                    types: {
                        enabled: 'boolean',
                        badges: 'object'
                    }
                },
                display: {
                    optional: ['showCapacityBadge', 'showPricing', 'showFeatures', 'showHighlights', 'enableImageCarousel'],
                    types: {
                        showCapacityBadge: 'boolean',
                        showPricing: 'boolean',
                        showFeatures: 'boolean',
                        showHighlights: 'boolean',
                        enableImageCarousel: 'boolean'
                    }
                },
                tracking: {
                    optional: ['enabled', 'onRoomClick', 'onCTAClick'],
                    types: {
                        enabled: 'boolean',
                        onRoomClick: 'function',
                        onCTAClick: 'function'
                    }
                }
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate rooms array
                if (!Array.isArray(config.rooms)) {
                    errors.push('rooms must be an array');
                } else if (config.rooms.length === 0) {
                    errors.push('rooms array cannot be empty');
                } else {
                    // Validate each room
                    config.rooms.forEach((room, index) => {
                        if (!room.id) errors.push(`Room ${index + 1}: id is required`);
                        if (!room.name) errors.push(`Room ${index + 1}: name is required`);
                        if (!room.description) errors.push(`Room ${index + 1}: description is required`);
                        if (!room.capacity || !room.capacity.displayText) {
                            errors.push(`Room ${index + 1}: capacity.displayText is required`);
                        }
                        
                        // Validate images if provided
                        if (room.images && !Array.isArray(room.images)) {
                            errors.push(`Room ${index + 1}: images must be an array`);
                        }
                        
                        // Validate features if provided
                        if (room.features && !Array.isArray(room.features)) {
                            errors.push(`Room ${index + 1}: features must be an array`);
                        } else if (room.features) {
                            room.features.forEach((feature, fIndex) => {
                                if (!feature.icon || !feature.text) {
                                    errors.push(`Room ${index + 1}, Feature ${fIndex + 1}: icon and text are required`);
                                }
                            });
                        }
                        
                        // Validate highlights if provided
                        if (room.highlights && !Array.isArray(room.highlights)) {
                            errors.push(`Room ${index + 1}: highlights must be an array`);
                        }
                        
                        // Validate pricing if provided
                        if (room.pricing) {
                            if (!room.pricing.from) errors.push(`Room ${index + 1}: pricing.from is required`);
                            if (!room.pricing.currency) errors.push(`Room ${index + 1}: pricing.currency is required`);
                            if (!room.pricing.period) errors.push(`Room ${index + 1}: pricing.period is required`);
                        }
                    });
                }
                
                // Validate trust badges if enabled
                if (config.trustBadges && config.trustBadges.enabled) {
                    if (!Array.isArray(config.trustBadges.badges)) {
                        errors.push('trustBadges.badges must be an array');
                    } else {
                        config.trustBadges.badges.forEach((badge, index) => {
                            if (!badge.icon || !badge.text) {
                                errors.push(`Trust badge ${index + 1}: icon and text are required`);
                            }
                        });
                    }
                }
                
                // Validate phone number format if provided
                if (config.cta && config.cta.phoneNumber) {
                    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                    if (!phoneRegex.test(config.cta.phoneNumber)) {
                        errors.push('cta.phoneNumber contains invalid characters');
                    }
                }
                
                // Validate button type
                if (config.cta && config.cta.mainButtonType) {
                    const validTypes = ['MainButton1', 'MainButton2', 'MainButton3'];
                    if (!validTypes.includes(config.cta.mainButtonType)) {
                        errors.push(`cta.mainButtonType must be one of: ${validTypes.join(', ')}`);
                    }
                }
                
                return errors;
            }
        },
        welcome: {
            required: ['workAt', 'companyName', 'mainHeadline', 'subText', 'ctaText', 'buttonType'],
            optional: ['logoLink', 'mainAsset', 'videoId', 'mainImageLink', 'ctaLink', 'secondaryText', 'secondaryTarget'],
            types: {
                workAt: 'string',
                companyName: 'string',
                mainHeadline: 'string',
                subText: 'string',
                ctaText: 'string',
                buttonType: 'string',
                logoLink: 'string',
                mainAsset: 'string',
                videoId: 'string',
                mainImageLink: 'string',
                ctaLink: 'string',
                secondaryText: 'string',
                secondaryTarget: 'string'
            },
            enums: {
                mainAsset: ['video', 'image'],
                buttonType: ['MainButton1', 'MainButton2', 'MainButton3']
            }
        },
        mehrErfahren: {
            required: ['companyPlaceholder'],
            optional: ['aboutCard', 'benefitsCard', 'faqCard', 'ctaHeadline', 'ctaSubtext', 'ctaButtonText', 'ctaButtonLink', 'ctaButtonType', 'onCTAClick'],
            types: {
                companyPlaceholder: 'string',
                aboutCard: 'object',
                benefitsCard: 'object',
                faqCard: 'object',
                ctaHeadline: 'string',
                ctaSubtext: 'string',
                ctaButtonText: 'string',
                ctaButtonLink: 'string',
                ctaButtonType: 'string',
                onCTAClick: 'function'
            },
            enums: {
                ctaButtonType: ['MainButton1', 'MainButton2', 'MainButton3']
            },
            defaults: {
                ctaHeadline: 'Klingt gut?',
                ctaSubtext: 'Lass uns gemeinsam durchstarten!',
                ctaButtonText: 'Jetzt bewerben',
                ctaButtonLink: '#bewerbung',
                ctaButtonType: 'MainButton1'
            },
            subSchemas: {
                aboutCard: {
                    required: ['enabled', 'order', 'icon', 'title', 'text', 'imageUrl'],
                    types: {
                        enabled: 'boolean',
                        order: 'number',
                        icon: 'string',
                        title: 'string',
                        text: 'string',
                        imageUrl: 'string'
                    }
                },
                benefitsCard: {
                    required: ['enabled', 'order', 'icon', 'title', 'imageUrl', 'benefits'],
                    types: {
                        enabled: 'boolean',
                        order: 'number',
                        icon: 'string',
                        title: 'string',
                        imageUrl: 'string',
                        benefits: 'object'
                    }
                },
                faqCard: {
                    required: ['enabled', 'order', 'icon', 'title', 'imageUrl', 'faqs'],
                    types: {
                        enabled: 'boolean',
                        order: 'number',
                        icon: 'string',
                        title: 'string',
                        imageUrl: 'string',
                        faqs: 'object'
                    }
                }
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate CTA subtext length (should be under 12 words)
                if (config.ctaSubtext) {
                    const wordCount = config.ctaSubtext.trim().split(/\s+/).length;
                    if (wordCount > 12) {
                        errors.push(`CTA subtext should be under 12 words (currently ${wordCount} words)`);
                    }
                }
                
                return errors;
            }
        },
        process: {
            required: ['sectionHeadline', 'cards'],
            optional: ['showEmojiContainers', 'showEmojiBackground'],
            types: {
                sectionHeadline: 'string',
                showEmojiContainers: 'boolean',
                showEmojiBackground: 'boolean',
                cards: 'object'
            },
            defaults: {
                showEmojiContainers: true,
                showEmojiBackground: true
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate cards array
                if (!Array.isArray(config.cards)) {
                    errors.push('cards must be an array');
                } else if (config.cards.length === 0) {
                    errors.push('cards array cannot be empty');
                } else {
                    // Validate each card
                    config.cards.forEach((card, index) => {
                        if (!card.emoji) errors.push(`Card ${index + 1}: emoji is required`);
                        if (!card.title) errors.push(`Card ${index + 1}: title is required`);
                        if (!card.text) errors.push(`Card ${index + 1}: text is required`);
                        if (!card.emojiContainerColor) errors.push(`Card ${index + 1}: emojiContainerColor is required`);
                        
                        // Validate color format (basic check)
                        if (card.emojiContainerColor && !card.emojiContainerColor.match(/^#[0-9A-Fa-f]{6}$/)) {
                            errors.push(`Card ${index + 1}: emojiContainerColor must be a valid hex color`);
                        }
                    });
                }
                
                return errors;
            }
        },
        positions: {
            required: ['headline', 'subtext', 'positions'],
            optional: ['defaultView', 'features', 'filters'],
            types: {
                headline: 'string',
                subtext: 'string',
                defaultView: 'object',
                features: 'object',
                filters: 'object',
                positions: 'object'
            },
            defaults: {
                headline: 'Entdecke unsere offenen Stellen',
                subtext: 'Finde die passende Position und bewirb dich direkt.',
                defaultView: {
                    desktop: 'grid',
                    mobile: 'grid'
                },
                features: {
                    savedPositions: true
                },
                filters: {
                    search: {
                        enabled: true,
                        placeholder: 'Titel, Bereich oder Stadt …'
                    },
                    bereich: {
                        enabled: true,
                        label: 'Bereich',
                        icon: 'fa-light fa-layer-group'
                    },
                    art: {
                        enabled: true,
                        label: 'Anstellungsart',
                        icon: 'fa-light fa-briefcase'
                    },
                    region: {
                        enabled: true,
                        label: 'Stadt',
                        icon: 'fa-light fa-location-dot'
                    },
                    zeitraum: {
                        enabled: true,
                        label: 'Zeitraum',
                        icon: 'fa-light fa-calendar',
                        options: ['Alle', 'Letzte 7 Tage', 'Letzte 30 Tage']
                    },
                    sort: {
                        enabled: true,
                        label: 'Sortierung',
                        icon: 'fa-light fa-arrow-down-a-z',
                        options: [
                            { value: 'new', text: 'Neueste zuerst' },
                            { value: 'old', text: 'Älteste zuerst' },
                            { value: 'az', text: 'A–Z (Titel)' },
                            { value: 'za', text: 'Z–A (Titel)' }
                        ]
                    }
                }
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate positions array
                if (!Array.isArray(config.positions)) {
                    errors.push('positions must be an array');
                } else if (config.positions.length === 0) {
                    errors.push('positions array cannot be empty');
                } else {
                    // Validate each position
                    config.positions.forEach((position, index) => {
                        if (!position.id) errors.push(`Position ${index + 1}: id is required`);
                        if (!position.position) errors.push(`Position ${index + 1}: position title is required`);
                        if (!position.area) errors.push(`Position ${index + 1}: area is required`);
                        if (!position.region) errors.push(`Position ${index + 1}: region is required`);
                        if (!position.datum) errors.push(`Position ${index + 1}: datum is required`);
                        if (!position.applicationUrl) errors.push(`Position ${index + 1}: applicationUrl is required`);
                        
                        // Validate status
                        if (position.status && !['on', 'off'].includes(position.status)) {
                            errors.push(`Position ${index + 1}: status must be 'on' or 'off'`);
                        }
                        
                        // Validate date format (DD.MM.YYYY)
                        if (position.datum && !position.datum.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
                            errors.push(`Position ${index + 1}: datum must be in format DD.MM.YYYY`);
                        }
                    });
                }
                
                // Validate default view values
                if (config.defaultView) {
                    const validViews = ['grid', 'list', 'table'];
                    if (config.defaultView.desktop && !validViews.includes(config.defaultView.desktop)) {
                        errors.push(`defaultView.desktop must be one of: ${validViews.join(', ')}`);
                    }
                    if (config.defaultView.mobile && !validViews.includes(config.defaultView.mobile)) {
                        errors.push(`defaultView.mobile must be one of: ${validViews.join(', ')}`);
                    }
                }
                
                // Validate filter configuration
                if (config.filters) {
                    // Check zeitraum options if enabled
                    if (config.filters.zeitraum?.enabled && config.filters.zeitraum.options) {
                        if (!Array.isArray(config.filters.zeitraum.options)) {
                            errors.push('filters.zeitraum.options must be an array');
                        }
                    }
                    
                    // Check sort options if enabled
                    if (config.filters.sort?.enabled && config.filters.sort.options) {
                        if (!Array.isArray(config.filters.sort.options)) {
                            errors.push('filters.sort.options must be an array');
                        } else {
                            config.filters.sort.options.forEach((opt, i) => {
                                if (!opt.value || !opt.text) {
                                    errors.push(`filters.sort.options[${i}] must have value and text properties`);
                                }
                            });
                        }
                    }
                }
                
                return errors;
            }
        },
        footer: {
            required: ['businessName', 'streetAddress', 'zipCode', 'city', 'copyrightYear'],
            optional: ['logoUrl', 'websiteUrl', 'socialMedia', 'impressumUrl', 'datenschutzUrl', 'onSocialClick'],
            types: {
                logoUrl: 'string',
                businessName: 'string',
                streetAddress: 'string',
                zipCode: 'string',
                city: 'string',
                websiteUrl: 'string',
                socialMedia: 'object',
                impressumUrl: 'string',
                datenschutzUrl: 'string',
                copyrightYear: 'string',
                onSocialClick: 'function'
            },
            defaults: {
                logoUrl: 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image',
                websiteUrl: '#',
                impressumUrl: '#',
                datenschutzUrl: '#',
                copyrightYear: new Date().getFullYear().toString()
            },
            customValidation: (config) => {
                const errors = [];
                
                // Validate social media configuration
                if (config.socialMedia) {
                    for (const [platform, settings] of Object.entries(config.socialMedia)) {
                        if (typeof settings !== 'object') {
                            errors.push(`socialMedia.${platform} must be an object`);
                            continue;
                        }
                        
                        if (!settings.hasOwnProperty('enabled')) {
                            errors.push(`socialMedia.${platform}.enabled is required`);
                        }
                        
                        if (settings.enabled && !settings.url) {
                            errors.push(`socialMedia.${platform}.url is required when enabled`);
                        }
                        
                        if (settings.enabled && !settings.icon) {
                            errors.push(`socialMedia.${platform}.icon is required when enabled`);
                        }
                    }
                }
                
                // Validate copyright year format
                if (config.copyrightYear && !/^\d{4}$/.test(config.copyrightYear)) {
                    errors.push('copyrightYear should be a 4-digit year string');
                }
                
                return errors;
            }
        }
    },

    /**
     * Validate a configuration object
     */
    validate(config, sectionType) {
        const schema = this.schemas[sectionType];
        if (!schema) {
            return {
                isValid: false,
                errors: [`Unknown section type: ${sectionType}`]
            };
        }

        const errors = [];

        // Check required fields
        for (const field of schema.required) {
            if (!config.hasOwnProperty(field) || config[field] === undefined || config[field] === null) {
                errors.push(`Required field missing: ${field}`);
            }
        }

        // Check field types and enums
        for (const [field, value] of Object.entries(config)) {
            if (value !== undefined && value !== null) {
                // Type checking
                if (schema.types[field]) {
                    const expectedType = schema.types[field];
                    const actualType = typeof value;
                    
                    if (actualType !== expectedType) {
                        errors.push(`Field '${field}' should be ${expectedType}, got ${actualType}`);
                    }
                }

                // Enum checking
                if (schema.enums && schema.enums[field] && !schema.enums[field].includes(value)) {
                    errors.push(`Field '${field}' should be one of: ${schema.enums[field].join(', ')}`);
                }

                // Sub-schema validation
                if (schema.subSchemas && schema.subSchemas[field] && typeof value === 'object') {
                    const subSchema = schema.subSchemas[field];
                    
                    // Check for custom validation in sub-schema
                    if (subSchema.customValidation && typeof subSchema.customValidation === 'function') {
                        const subErrors = subSchema.customValidation(value);
                        errors.push(...subErrors);
                    } else {
                        // Standard sub-schema validation
                        for (const subField of (subSchema.required || [])) {
                            if (!value.hasOwnProperty(subField)) {
                                errors.push(`${field}.${subField} is required`);
                            } else if (subSchema.types && subSchema.types[subField]) {
                                const expectedType = subSchema.types[subField];
                                const actualType = typeof value[subField];
                                if (actualType !== expectedType) {
                                    errors.push(`${field}.${subField} should be ${expectedType}, got ${actualType}`);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Run custom validation if exists
        if (schema.customValidation && typeof schema.customValidation === 'function') {
            const customErrors = schema.customValidation(config);
            errors.push(...customErrors);
        }

        // Special validations for welcome section
        if (sectionType === 'welcome') {
            if (config.mainAsset === 'video' && !config.videoId) {
                errors.push('videoId is required when mainAsset is "video"');
            }

            if (config.mainAsset === 'image' && !config.mainImageLink) {
                errors.push('mainImageLink is required when mainAsset is "image"');
            }
        }

        // Special validations for mehrErfahren section
        if (sectionType === 'mehrErfahren') {
            // Check if at least one card is enabled
            const hasEnabledCard = 
                (config.aboutCard && config.aboutCard.enabled) ||
                (config.benefitsCard && config.benefitsCard.enabled) ||
                (config.faqCard && config.faqCard.enabled);

            if (!hasEnabledCard) {
                errors.push('At least one card must be enabled in mehrErfahren section');
            }

            // Validate benefits array
            if (config.benefitsCard && config.benefitsCard.enabled && config.benefitsCard.benefits) {
                if (!Array.isArray(config.benefitsCard.benefits)) {
                    errors.push('benefitsCard.benefits must be an array');
                } else if (config.benefitsCard.benefits.length === 0) {
                    errors.push('benefitsCard.benefits cannot be empty');
                }
            }

            // Validate FAQs array
            if (config.faqCard && config.faqCard.enabled && config.faqCard.faqs) {
                if (!Array.isArray(config.faqCard.faqs)) {
                    errors.push('faqCard.faqs must be an array');
                } else if (config.faqCard.faqs.length === 0) {
                    errors.push('faqCard.faqs cannot be empty');
                }
            }
        }

        // Special validations for positions section
        if (sectionType === 'positions') {
            // Check if at least one filter is enabled
            if (config.filters) {
                const hasEnabledFilter = Object.values(config.filters).some(filter => 
                    filter && typeof filter === 'object' && filter.enabled
                );
                
                if (!hasEnabledFilter) {
                    console.warn('Positions section: No filters are enabled');
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            config: config
        };
    },

    /**
     * Apply default values to configuration
     */
    applyDefaults(config, sectionType) {
        const defaults = {
            tracking: {
                tracking: {
                    scrollDepth: {
                        enabled: true,
                        depths: [25, 50, 75, 100]
                    },
                    browserType: {
                        enabled: true
                    },
                    deviceType: {
                        enabled: true
                    },
                    activityStatus: {
                        enabled: true,
                        inactivityThreshold: 30000
                    },
                    dwellTime: {
                        enabled: true,
                        checkInterval: 1000
                    }
                },
                contentId: {
                    autoGenerate: true,
                    fallback: 'unknown_origin'
                },
                debug: false
            },
            cookieBanner: {
                facebook: {
                    pixelId: null,
                    enabled: false,
                    events: {
                        pageView: true,
                        viewContent: true,
                        search: true,
                        lead: true,
                        completeRegistration: true
                    }
                },
                banner: {
                    headline: "Mehr Relevanz, mehr Möglichkeiten",
                    description: "Wir nutzen Cookies, um unsere Karriereseite optimal für dich zu gestalten.",
                    privacyPolicyUrl: "#datenschutz",
                    position: "bottom-left",
                    showOverlay: true,
                    animation: "slide",
                    autoShowDelay: 500,
                    iconType: "animated"
                },
                categories: {
                    essential: {
                        label: "Essenziell",
                        description: "Diese Cookies sind für den Betrieb der Webseite erforderlich.",
                        required: true
                    },
                    analytics: {
                        label: "Analyse",
                        description: "Diese Cookies helfen uns, die Nutzung der Seite zu verstehen.",
                        defaultEnabled: false
                    },
                    marketing: {
                        label: "Marketing",
                        description: "Diese Cookies ermöglichen personalisierte Werbung.",
                        defaultEnabled: false
                    }
                },
                buttons: {
                    acceptAll: {
                        text: "Ja, alle zustimmen",
                        style: "primary"
                    },
                    saveSettings: {
                        text: "Einstellung speichern",
                        style: "secondary"
                    },
                    decline: {
                        text: "Nur Essenzielle",
                        style: "tertiary",
                        enabled: false
                    }
                },
                tracking: {
                    onConsentGiven: true,
                    onBannerDismissed: true,
                    onSettingsChanged: true
                },
                advanced: {
                    cookieLifetime: 365,
                    reShowAfterDays: null,
                    debugMode: false
                }
            },
            thanks: {
                bannerText: "STOPP, schließe noch nicht diese Seite 👇",
                confirmationBadgeText: "Erfolgreich übermittelt",
                mainHeadline: "Vielen Dank für deine Anfrage!",
                mainDescription: "Dein Formular wurde erfolgreich übermittelt.",
                quickActionButtonText: "Schneller vorankommen",
                contact: {
                    showPortrait: true,
                    portraitUrl: "https://via.placeholder.com/80x80/ff6b35/ffffff?text=MN",
                    name: "[NAME_PLACEHOLDER]",
                    position: "[POSITION_PLACEHOLDER]",
                    email: "[EMAIL_PLACEHOLDER]",
                    phone: "[PHONE_PLACEHOLDER]"
                },
                socialMedia: {
                    channelName: "PLACEHOLDER",
                    channelUrl: "#PLACEHOLDER"
                }
            },
            exclude: {
                statusBadgeText: "Bewerbung abgeschlossen",
                mainHeadline: "Vielen Dank für dein Interesse",
                mainDescription: "Wir haben deine Bewerbung sorgfältig geprüft.",
                messageTitle: "Leider passt es diesmal nicht",
                messageText: "Nach eingehender Prüfung deiner Unterlagen müssen wir dir mitteilen, dass dein Profil aktuell nicht zu unseren Anforderungen passt.",
                alternativePathsTitle: "Alternative Möglichkeiten",
                alternativePaths: [],
                improvementHeadline: "Tipps für deine nächste Bewerbung",
                improvementTips: [],
                footerText: "Wir wünschen dir viel Erfolg für deinen weiteren Werdegang!",
                talentPool: {
                    enabled: false,
                    buttonText: "In Talentpool aufnehmen",
                    modalTitle: "Bleib mit uns in Kontakt",
                    modalDescription: "Lass uns deine Daten speichern und wir informieren dich, sobald eine passende Position frei wird.",
                    interests: [],
                    onSubmit: null
                },
                socialMedia: {
                    linkedin: { enabled: false, url: "#", icon: "fab fa-linkedin-in" },
                    facebook: { enabled: false, url: "#", icon: "fab fa-facebook-f" },
                    instagram: { enabled: false, url: "#", icon: "fab fa-instagram" },
                    xing: { enabled: false, url: "#", icon: "fab fa-xing" }
                }
            },
            offers1: {
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
                    enabled: false,
                    icon: "fas fa-tag",
                    title: "Special Offer",
                    text: "Book now and save",
                    validUntil: null
                },
                rooms: [],
                cta: {
                    mainButtonText: "Get Started",
                    mainButtonType: "MainButton1",
                    phoneNumber: null,
                    phoneText: "Or call:",
                    secondaryLink: null,
                    secondaryText: "Learn more"
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
                    enabled: true,
                    onRoomClick: null,
                    onCTAClick: null
                }
            },
            welcome: {
                logoLink: 'https://placehold.co/32x32/cccccc/666666?text=Logo',
                mainAsset: 'video',
                ctaLink: '#',
                buttonType: 'MainButton1',
                secondaryText: 'Mehr erfahren',
                secondaryTarget: 'SectionMehrErfahren'
            },
            mehrErfahren: {
                companyPlaceholder: 'UNTERNEHMEN',
                ctaHeadline: 'Klingt gut?',
                ctaSubtext: 'Lass uns gemeinsam durchstarten!',
                ctaButtonText: 'Jetzt bewerben',
                ctaButtonLink: '#bewerbung',
                ctaButtonType: 'MainButton1',
                aboutCard: {
                    enabled: true,
                    order: 1,
                    icon: 'fas fa-building',
                    title: 'Über Uns',
                    text: 'Beschreibungstext...',
                    imageUrl: 'https://placehold.co/250x200/e1e5e6/6d7b8b?text=Demo+Image'
                },
                benefitsCard: {
                    enabled: true,
                    order: 2,
                    icon: 'fas fa-star',
                    title: 'Deine Vorteile',
                    imageUrl: 'https://placehold.co/250x200/e1e5e6/6d7b8b?text=Demo+Image',
                    benefits: []
                },
                faqCard: {
                    enabled: true,
                    order: 3,
                    icon: 'fas fa-question-circle',
                    title: 'Häufige Fragen',
                    imageUrl: 'https://placehold.co/250x200/e1e5e6/6d7b8b?text=Demo+Image',
                    faqs: []
                }
            },
            process: {
                showEmojiContainers: true,
                showEmojiBackground: true
            },
            positions: {
                headline: 'Entdecke unsere offenen Stellen',
                subtext: 'Finde die passende Position und bewirb dich direkt.',
                defaultView: {
                    desktop: 'grid',
                    mobile: 'grid'
                },
                features: {
                    savedPositions: true
                },
                filters: {
                    search: {
                        enabled: true,
                        placeholder: 'Titel, Bereich oder Stadt …'
                    },
                    bereich: {
                        enabled: true,
                        label: 'Bereich',
                        icon: 'fa-light fa-layer-group'
                    },
                    art: {
                        enabled: true,
                        label: 'Anstellungsart',
                        icon: 'fa-light fa-briefcase'
                    },
                    region: {
                        enabled: true,
                        label: 'Stadt',
                        icon: 'fa-light fa-location-dot'
                    },
                    zeitraum: {
                        enabled: true,
                        label: 'Zeitraum',
                        icon: 'fa-light fa-calendar',
                        options: ['Alle', 'Letzte 7 Tage', 'Letzte 30 Tage']
                    },
                    sort: {
                        enabled: true,
                        label: 'Sortierung',
                        icon: 'fa-light fa-arrow-down-a-z',
                        options: [
                            { value: 'new', text: 'Neueste zuerst' },
                            { value: 'old', text: 'Älteste zuerst' },
                            { value: 'az', text: 'A–Z (Titel)' },
                            { value: 'za', text: 'Z–A (Titel)' }
                        ]
                    }
                },
                positions: []
            },
            footer: {
                logoUrl: 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image',
                websiteUrl: '#',
                impressumUrl: '#',
                datenschutzUrl: '#',
                copyrightYear: new Date().getFullYear().toString(),
                socialMedia: {
                    linkedin: {
                        enabled: false,
                        url: '#',
                        icon: 'fab fa-linkedin-in'
                    },
                    facebook: {
                        enabled: false,
                        url: '#',
                        icon: 'fab fa-facebook-f'
                    },
                    instagram: {
                        enabled: false,
                        url: '#',
                        icon: 'fab fa-instagram'
                    }
                }
            }
        };

        const sectionDefaults = defaults[sectionType] || {};
        
        // Apply schema defaults if they exist
        const schema = this.schemas[sectionType];
        if (schema && schema.defaults) {
            Object.assign(sectionDefaults, schema.defaults);
        }
        
        return { ...sectionDefaults, ...config };
    },

    /**
     * Sanitize configuration values
     */
    sanitize(config, sectionType) {
        const sanitized = { ...config };

        // Sanitize URLs
        const urlFields = ['logoLink', 'mainImageLink', 'ctaLink', 'ctaButtonLink', 'imageUrl', 
                          'websiteUrl', 'impressumUrl', 'datenschutzUrl', 'applicationUrl',
                          'privacyPolicyUrl', 'cookiePolicyUrl', 'portraitUrl', 'channelUrl', 'linkUrl',
                          'secondaryLink'];
        for (const field of urlFields) {
            if (sanitized[field] && typeof sanitized[field] === 'string') {
                // Basic URL validation
                try {
                    new URL(sanitized[field]);
                } catch {
                    if (!sanitized[field].startsWith('#') && !sanitized[field].startsWith('/')) {
                        console.warn(`Invalid URL for ${field}: ${sanitized[field]}`);
                    }
                }
            }
        }

        // Sanitize text fields (remove script tags, etc.)
        const textFields = ['workAt', 'companyName', 'mainHeadline', 'subText', 'ctaText', 
                           'secondaryText', 'companyPlaceholder', 'title', 'text',
                           'ctaHeadline', 'ctaSubtext', 'ctaButtonText', 'sectionHeadline',
                           'businessName', 'streetAddress', 'city', 'zipCode', 'headline', 
                           'subheadline', 'position', 'area', 'region', 'description', 'label',
                           'bannerText', 'confirmationBadgeText', 'mainDescription', 
                           'quickActionButtonText', 'name', 'channelName',
                           'statusBadgeText', 'messageTitle', 'messageText', 'alternativePathsTitle',
                           'improvementHeadline', 'footerText', 'buttonText', 'modalTitle', 
                           'modalDescription', 'linkText', 'fallback', 'funnelStep',
                           'mainButtonText', 'phoneText', 'secondaryText', 'tagline', 'validUntil'];
        for (const field of textFields) {
            if (sanitized[field] && typeof sanitized[field] === 'string') {
                sanitized[field] = sanitized[field]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .trim();
            }
        }

        // Special sanitization for tracking section
        if (sectionType === 'tracking') {
            // Sanitize funnel step
            if (sanitized.funnelStep && !['Landing', 'Formular', 'Ausschluss', 'Danke'].includes(sanitized.funnelStep)) {
                console.warn(`Invalid funnelStep: ${sanitized.funnelStep}, defaulting to Landing`);
                sanitized.funnelStep = 'Landing';
            }
            
            // Sanitize content ID fallback
            if (sanitized.contentId?.fallback) {
                sanitized.contentId.fallback = sanitized.contentId.fallback
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, '_')
                    .replace(/_+/g, '_')
                    .replace(/^_+|_+$/g, '');
            }
            
            // Sanitize scroll depths
            if (sanitized.tracking?.scrollDepth?.depths) {
                sanitized.tracking.scrollDepth.depths = sanitized.tracking.scrollDepth.depths
                    .filter(d => typeof d === 'number' && d >= 0 && d <= 100)
                    .sort((a, b) => a - b);
            }
        }

        // Special sanitization for offers1 section
        if (sectionType === 'offers1') {
            // Sanitize hero
            if (sanitized.hero) {
                ['headline', 'subheadline'].forEach(field => {
                    if (sanitized.hero[field]) {
                        sanitized.hero[field] = sanitized.hero[field]
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                });
                
                if (sanitized.hero.badge) {
                    if (sanitized.hero.badge.text) {
                        sanitized.hero.badge.text = sanitized.hero.badge.text
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                }
            }
            
            // Sanitize offer banner
            if (sanitized.offerBanner) {
                ['title', 'text', 'validUntil'].forEach(field => {
                    if (sanitized.offerBanner[field]) {
                        sanitized.offerBanner[field] = sanitized.offerBanner[field]
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                });
            }
            
            // Sanitize rooms
            if (sanitized.rooms && Array.isArray(sanitized.rooms)) {
                sanitized.rooms = sanitized.rooms.map(room => {
                    const cleanRoom = { ...room };
                    
                    // Sanitize text fields
                    ['name', 'description', 'tagline', 'ctaText'].forEach(field => {
                        if (cleanRoom[field]) {
                            cleanRoom[field] = cleanRoom[field]
                                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                .trim();
                        }
                    });
                    
                    // Sanitize capacity
                    if (cleanRoom.capacity && cleanRoom.capacity.displayText) {
                        cleanRoom.capacity.displayText = cleanRoom.capacity.displayText
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                    
                    // Sanitize features
                    if (cleanRoom.features && Array.isArray(cleanRoom.features)) {
                        cleanRoom.features = cleanRoom.features.map(feature => ({
                            ...feature,
                            text: feature.text?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                        }));
                    }
                    
                    // Sanitize highlights
                    if (cleanRoom.highlights && Array.isArray(cleanRoom.highlights)) {
                        cleanRoom.highlights = cleanRoom.highlights.map(highlight =>
                            highlight.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                        );
                    }
                    
                    // Sanitize pricing
                    if (cleanRoom.pricing) {
                        ['currency', 'period'].forEach(field => {
                            if (cleanRoom.pricing[field]) {
                                cleanRoom.pricing[field] = cleanRoom.pricing[field]
                                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                    .trim();
                            }
                        });
                    }
                    
                    return cleanRoom;
                });
            }
            
            // Sanitize trust badges
            if (sanitized.trustBadges && sanitized.trustBadges.badges && Array.isArray(sanitized.trustBadges.badges)) {
                sanitized.trustBadges.badges = sanitized.trustBadges.badges.map(badge => ({
                    ...badge,
                    text: badge.text?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                }));
            }
            
            // Sanitize phone number
            if (sanitized.cta && sanitized.cta.phoneNumber) {
                sanitized.cta.phoneNumber = sanitized.cta.phoneNumber
                    .replace(/[^\d\s\-\+\(\)]/g, '')
                    .trim();
            }
        }

        // Special sanitization for thanks section
        if (sectionType === 'thanks') {
            if (sanitized.contact) {
                ['name', 'position', 'email', 'phone'].forEach(field => {
                    if (sanitized.contact[field]) {
                        sanitized.contact[field] = sanitized.contact[field]
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                });
            }
            
            if (sanitized.socialMedia) {
                if (sanitized.socialMedia.channelName) {
                    sanitized.socialMedia.channelName = sanitized.socialMedia.channelName
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .trim();
                }
                if (sanitized.socialMedia.channelUrl) {
                    sanitized.socialMedia.channelUrl = sanitized.socialMedia.channelUrl.trim();
                }
            }
        }

        // Special sanitization for exclude section
        if (sectionType === 'exclude') {
            // Sanitize alternative paths
            if (sanitized.alternativePaths && Array.isArray(sanitized.alternativePaths)) {
                sanitized.alternativePaths = sanitized.alternativePaths.map(path => ({
                    ...path,
                    title: path.title?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim(),
                    description: path.description?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim(),
                    linkText: path.linkText?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                }));
            }
            
            // Sanitize improvement tips
            if (sanitized.improvementTips && Array.isArray(sanitized.improvementTips)) {
                sanitized.improvementTips = sanitized.improvementTips.map(tip => 
                    tip.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                );
            }
            
            // Sanitize talent pool
            if (sanitized.talentPool) {
                ['buttonText', 'modalTitle', 'modalDescription'].forEach(field => {
                    if (sanitized.talentPool[field]) {
                        sanitized.talentPool[field] = sanitized.talentPool[field]
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                });
                
                if (sanitized.talentPool.interests && Array.isArray(sanitized.talentPool.interests)) {
                    sanitized.talentPool.interests = sanitized.talentPool.interests.map(interest =>
                        interest.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                    );
                }
            }
        }

        // Special sanitization for cookie banner
        if (sectionType === 'cookieBanner') {
            // Sanitize Facebook Pixel ID
            if (sanitized.facebook && sanitized.facebook.pixelId) {
                sanitized.facebook.pixelId = sanitized.facebook.pixelId
                    .replace(/[^\d]/g, '') // Remove non-numeric characters
                    .trim();
            }
            
            // Sanitize category texts
            if (sanitized.categories) {
                for (const [key, category] of Object.entries(sanitized.categories)) {
                    if (category.label) {
                        category.label = category.label
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                    if (category.description) {
                        category.description = category.description
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                }
            }
            
            // Sanitize button texts
            if (sanitized.buttons) {
                for (const [key, button] of Object.entries(sanitized.buttons)) {
                    if (button.text) {
                        button.text = button.text
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                }
            }
        }

        // Recursively sanitize card objects (for mehrErfahren)
        if (sectionType === 'mehrErfahren') {
            ['aboutCard', 'benefitsCard', 'faqCard'].forEach(cardType => {
                if (sanitized[cardType]) {
                    // Sanitize card fields
                    if (sanitized[cardType].title) {
                        sanitized[cardType].title = sanitized[cardType].title
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                    if (sanitized[cardType].text) {
                        sanitized[cardType].text = sanitized[cardType].text
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }

                    // Sanitize benefits
                    if (sanitized[cardType].benefits && Array.isArray(sanitized[cardType].benefits)) {
                        sanitized[cardType].benefits = sanitized[cardType].benefits.map(benefit => ({
                            ...benefit,
                            text: benefit.text
                                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                .trim()
                        }));
                    }

                    // Sanitize FAQs
                    if (sanitized[cardType].faqs && Array.isArray(sanitized[cardType].faqs)) {
                        sanitized[cardType].faqs = sanitized[cardType].faqs.map(faq => ({
                            question: faq.question
                                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                .trim(),
                            answer: faq.answer
                                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                .trim()
                        }));
                    }
                }
            });
        }

        // Sanitize process cards
        if (sectionType === 'process' && sanitized.cards && Array.isArray(sanitized.cards)) {
            sanitized.cards = sanitized.cards.map(card => ({
                ...card,
                title: card.title
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .trim(),
                text: card.text
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .trim()
            }));
        }

        // Sanitize positions
        if (sectionType === 'positions' && sanitized.positions && Array.isArray(sanitized.positions)) {
            sanitized.positions = sanitized.positions.map(position => {
                const cleanPosition = { ...position };
                
                // Sanitize text fields
                ['position', 'area', 'region', 'startDate'].forEach(field => {
                    if (cleanPosition[field]) {
                        cleanPosition[field] = cleanPosition[field]
                            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .trim();
                    }
                });
                
                // Sanitize arrays
                ['qualifications', 'tasks', 'benefits'].forEach(field => {
                    if (cleanPosition[field]) {
                        if (field === 'qualifications' && typeof cleanPosition[field] === 'object') {
                            ['mandatory', 'optional'].forEach(subField => {
                                if (Array.isArray(cleanPosition[field][subField])) {
                                    cleanPosition[field][subField] = cleanPosition[field][subField].map(item =>
                                        item.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                                    );
                                }
                            });
                        } else if (Array.isArray(cleanPosition[field])) {
                            cleanPosition[field] = cleanPosition[field].map(item =>
                                item.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim()
                            );
                        }
                    }
                });
                
                return cleanPosition;
            });
        }

        // Sanitize footer social media URLs
        if (sectionType === 'footer' && sanitized.socialMedia) {
            for (const [platform, settings] of Object.entries(sanitized.socialMedia)) {
                if (settings.url && typeof settings.url === 'string') {
                    // Basic URL sanitization
                    settings.url = settings.url.trim();
                }
            }
        }

        return sanitized;
    }

    /**
     * Complete validation workflow
     */
    process(config, sectionType) {
        // 1. Apply defaults
        let processedConfig = this.applyDefaults(config, sectionType);
        
        // 2. Sanitize
        processedConfig = this.sanitize(processedConfig, sectionType);
        
        // 3. Validate
        const validation = this.validate(processedConfig, sectionType);
        
        return {
            ...validation,
            config: processedConfig
        };
    }
};
