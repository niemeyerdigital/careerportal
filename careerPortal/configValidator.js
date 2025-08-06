/**
 * Configuration Validator
 * Validates section configurations to prevent runtime errors
 */

window.ConfigValidator = {
    /**
     * Section schemas define required and optional fields
     */
    schemas: {
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
            optional: ['aboutCard', 'benefitsCard', 'faqCard'],
            types: {
                companyPlaceholder: 'string'
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
                if (schema.enums[field] && !schema.enums[field].includes(value)) {
                    errors.push(`Field '${field}' should be one of: ${schema.enums[field].join(', ')}`);
                }
            }
        }

        // Special validations
        if (config.mainAsset === 'video' && !config.videoId) {
            errors.push('videoId is required when mainAsset is "video"');
        }

        if (config.mainAsset === 'image' && !config.mainImageLink) {
            errors.push('mainImageLink is required when mainAsset is "image"');
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
                aboutCard: {
                    enabled: true,
                    order: 1,
                    icon: 'fas fa-building',
                    title: 'Über Uns',
                    text: 'Beschreibungstext...',
                    imageUrl: 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image'
                },
                benefitsCard: {
                    enabled: true,
                    order: 2,
                    icon: 'fas fa-star',
                    title: 'Deine Vorteile',
                    imageUrl: 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image',
                    benefits: []
                },
                faqCard: {
                    enabled: true,
                    order: 3,
                    icon: 'fas fa-question-circle',
                    title: 'Häufige Fragen',
                    imageUrl: 'https://placehold.co/350x150/e1e5e6/6d7b8b?text=Demo+Image',
                    faqs: []
                }
            }
        };

        const sectionDefaults = defaults[sectionType] || {};
        return { ...sectionDefaults, ...config };
    },

    /**
     * Sanitize configuration values
     */
    sanitize(config) {
        const sanitized = { ...config };

        // Sanitize URLs
        const urlFields = ['logoLink', 'mainImageLink', 'ctaLink'];
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
        const textFields = ['workAt', 'companyName', 'mainHeadline', 'subText', 'ctaText', 'secondaryText'];
        for (const field of textFields) {
            if (sanitized[field] && typeof sanitized[field] === 'string') {
                sanitized[field] = sanitized[field]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .trim();
            }
        }

        return sanitized;
    },

    /**
     * Complete validation workflow
     */
    process(config, sectionType) {
        // 1. Apply defaults
        let processedConfig = this.applyDefaults(config, sectionType);
        
        // 2. Sanitize
        processedConfig = this.sanitize(processedConfig);
        
        // 3. Validate
        const validation = this.validate(processedConfig, sectionType);
        
        return {
            ...validation,
            config: processedConfig
        };
    }
};
