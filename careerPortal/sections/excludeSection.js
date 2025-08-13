/* ====================================================================
   EXCLUDE SECTION (SectionExclude)
   Rejection page with compassionate messaging - 1.5X SPACIOUS UI
   Using root variables from theme
   ==================================================================== */

/* Reset and normalize for ClickFunnels containers */
div[data-title='SectionExclude'],
div[data-title='RowExclude'],
div[data-title='RowExclude'] .container {
    overflow: visible !important;
    position: relative !important;
    width: 100% !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    box-sizing: border-box !important;
}

/* Desktop: Make ClickFunnels containers 15% wider */
@media (min-width: 769px) {
    div[data-title='RowExclude'] {
        width: 115% !important;
        max-width: 115% !important;
        margin-left: -7.5% !important;
        margin-right: -7.5% !important;
    }
    
    div[data-title='SectionExclude'] {
        overflow: visible !important;
        width: 100vw !important;
        position: relative !important;
        left: 50% !important;
        right: 50% !important;
        margin-left: -50vw !important;
        margin-right: -50vw !important;
    }
    
    div[data-title='SectionExclude'] .innerContent,
    div[data-title='RowExclude'] .innerContent {
        max-width: none !important;
        width: 100% !important;
    }
}

/* Main wrapper - 1.5x spacious with subtle gradient */
.exclude-wrapper {
    min-height: 100vh;
    background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
    padding: 6rem 1.5rem; /* 1.5x padding */
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    position: relative;
    font-family: var(--font-family);
    color: #111827;
    box-sizing: border-box;
}

.exclude-container {
    width: 100%;
    max-width: 67.5rem; /* 1.5x of 45rem */
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
}

/* Header section */
.exclude-center {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4.5rem; /* 1.5x spacing */
}

/* Status chip - Neutral styling - 1.5x bigger */
.exclude-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem; /* 1.5x gap */
    padding: 0.75rem 1.5rem; /* 1.5x padding */
    background: #ffffff;
    border: 1.5px solid #e5e5e5; /* 1.5x border */
    border-radius: 999px;
    box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.06); /* 1.5x shadow */
    font-size: 1.3125rem; /* 1.5x of 0.875rem */
    font-weight: 600;
    color: #6b7280;
    font-family: var(--font-family);
    margin-bottom: 2.25rem; /* 1.5x spacing */
}

.exclude-chip i {
    font-size: 1.5rem; /* 1.5x icon */
}

/* Title - 1.5x larger */
.exclude-title {
    margin: 0 0 1.5rem 0; /* 1.5x space below */
    font-size: clamp(2.8125rem, 4vw + 1.5rem, 4.5rem); /* 1.5x size */
    line-height: 1.1;
    font-weight: 700;
    font-family: var(--font-family);
    color: #111827;
    text-wrap: balance;
}

/* Subtitle - 1.5x bigger */
.exclude-subtitle {
    margin: 0 0 3rem 0; /* 1.5x space below */
    font-size: 1.6875rem; /* 1.5x of 1.125rem */
    color: #6b7280;
    font-family: var(--font-family);
    line-height: 1.6;
    max-width: 900px;
}

/* Other Positions Button - 1.5x bigger with orange gradient */
.exclude-other-positions-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem; /* 1.5x gap */
    padding: 1.3125rem 2.625rem; /* 1.5x padding */
    background: var(--button-primary);
    border: none;
    border-radius: 999px;
    color: #ffffff;
    font-weight: 600;
    font-size: 1.5rem; /* 1.5x font size */
    font-family: var(--font-family);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 12px 36px -18px rgba(255, 107, 53, 0.3); /* 1.5x shadow */
    position: relative;
    outline: none;
    text-decoration: none;
}

.exclude-other-positions-btn.pulse-animation {
    animation: gentlePulse 3s ease-in-out infinite;
}

@keyframes gentlePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
}

.exclude-other-positions-btn:hover {
    background: var(--button-primary-hover);
    transform: translateY(-1.5px); /* 1.5x lift */
    animation: none;
    box-shadow: 0 18px 42px -15px rgba(255, 107, 53, 0.35); /* 1.5x shadow */
}

.exclude-other-positions-btn:active {
    transform: translateY(0);
}

.exclude-other-positions-btn i {
    font-size: 1.6875rem; /* 1.5x icon */
}

/* Message card - 1.5x bigger */
.exclude-message-card {
    background: #ffffff;
    border-radius: 1.5rem; /* 1.5x radius */
    padding: 3rem; /* 1.5x padding */
    box-shadow: 0 1.5px 4.5px rgba(0, 0, 0, 0.1); /* 1.5x shadow */
    margin-bottom: 4.5rem; /* 1.5x space below */
    display: flex;
    align-items: flex-start;
    gap: 2.25rem; /* 1.5x gap */
}

.exclude-message-icon {
    flex-shrink: 0;
    width: 4.5rem; /* 1.5x size */
    height: 4.5rem; /* 1.5x size */
    background: rgba(239, 68, 68, 0.1);
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
}

.exclude-message-icon i {
    font-size: 2.25rem; /* 1.5x icon */
}

.exclude-message-content h2 {
    margin: 0 0 1.125rem 0; /* 1.5x space below */
    font-size: 2.25rem; /* 1.5x size */
    font-weight: 600;
    color: #111827;
    font-family: var(--font-family);
    position: relative;
    display: inline-block;
}

/* Text marker effect for rejection message - subtle but clear */
.exclude-message-content h2::after {
    content: '';
    position: absolute;
    left: -0.25rem;
    right: -0.25rem;
    bottom: 0.125rem;
    height: 0.875rem;
    background: rgba(239, 68, 68, 0.15); /* Light red marker effect */
    z-index: -1;
    transform: skewY(-1deg);
    border-radius: 2px;
}

.exclude-message-content p {
    margin: 0;
    font-size: 1.5rem; /* 1.5x size */
    color: #6b7280;
    line-height: 1.6;
    font-family: var(--font-family);
}

/* Grid layout - 1.5x spacious */
.exclude-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.875rem; /* 1.5x gap */
    margin-bottom: 3rem; /* 1.5x space below */
}

/* Cards - 1.5x bigger with soft elevated design (like Thanks) */
.exclude-card {
    border: 3px solid #e5e5e5; /* 1.5x border */
    border-radius: 1.5rem; /* 1.5x radius */
    background: #ffffff;
    box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.08); /* 1.5x shadow */
    height: 100%;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
}

.exclude-card:hover {
    transform: translateY(-3px); /* 1.5x lift */
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); /* 1.5x shadow */
}

.exclude-card-content {
    padding: 2.25rem; /* 1.5x padding */
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Media object inside cards - 1.5x bigger */
.exclude-media {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem; /* 1.5x gap */
    flex: 1;
}

.exclude-media-icon {
    background: #f3f4f6;
    border-radius: 1.5rem; /* 1.5x radius */
    padding: 1.125rem; /* 1.5x padding */
    display: inline-flex;
    color: var(--primary-color);
    flex-shrink: 0;
}

.exclude-media-icon i {
    font-size: 1.875rem; /* 1.5x icon */
}

.exclude-media h2 {
    font-size: 1.875rem; /* 1.5x size */
    margin: 0 0 0.75rem 0; /* 1.5x spacing */
    font-family: var(--font-family);
    color: #111827;
    font-weight: 600;
    line-height: 1.3;
}

.exclude-media p {
    margin: 0;
    color: #6b7280;
    font-size: 1.3125rem; /* 1.5x size */
    font-family: var(--font-family);
    line-height: 1.6;
}

.exclude-highlight {
    font-weight: 600;
    color: #4b5563;
}

/* Social button wrapper - 1.5x spacing */
.exclude-btn-wrapper {
    text-align: center;
    margin-top: 1.875rem; /* 1.5x spacing */
    padding-top: 1.5rem; /* 1.5x padding */
}

/* Social button - 1.5x bigger (exactly like Thanks) */
.exclude-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem; /* 1.5x gap */
    padding: 1.125rem 2.25rem; /* 1.5x padding */
    border-radius: 1.125rem; /* 1.5x radius */
    border: 3px solid var(--primary-color); /* 1.5x border */
    color: var(--primary-color);
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 90, 0.05));
    text-decoration: none;
    font-weight: 600;
    font-size: 1.5rem; /* 1.5x size */
    font-family: var(--font-family);
    transition: all 0.2s ease;
    width: auto;
    outline: none;
}

.exclude-btn:hover {
    background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-1.5px); /* 1.5x lift */
    box-shadow: 0 12px 36px -18px rgba(255, 107, 53, 0.15); /* 1.5x shadow */
}

.exclude-btn:active {
    transform: translateY(1.5px); /* 1.5x press */
}

/* Footnote - 1.5x bigger */
.exclude-footnote {
    text-align: center;
    font-size: 1.125rem; /* 1.5x of 0.75rem */
    color: #6b7280;
    font-family: var(--font-family);
    line-height: 1.6;
    padding: 0 1.5rem; /* 1.5x padding */
    margin-top: 3rem; /* 1.5x space above */
}

/* Animations */
.fade-in-up {
    opacity: 0;
    transform: translateY(12px); /* 1.5x movement */
    animation: fadeUp 400ms ease forwards;
}

.fade-in-up.slow {
    animation-duration: 500ms;
    animation-delay: 150ms;
}

@keyframes fadeUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Desktop overrides - 35% bigger than base (1.35x of original) */
@media (min-width: 769px) {
    .exclude-wrapper {
        padding: 5.4rem 1.8rem; /* 1.35x */
        width: 100vw;
        margin-left: calc(-50vw + 50%);
    }
    
    .exclude-container {
        width: 100%;
        max-width: 81rem; /* 1.35x wider on desktop */
        margin: 0 auto;
        padding: 0 2rem;
    }

    .exclude-center {
        margin-bottom: 4.05rem; /* 1.35x */
    }

    .exclude-chip {
        gap: 0.675rem; /* 1.35x */
        padding: 0.675rem 1.35rem; /* 1.35x */
        font-size: 1.18125rem; /* 1.35x of 0.875rem */
        margin-bottom: 2.025rem; /* 1.35x */
    }

    .exclude-chip i {
        font-size: 1.35rem; /* 1.35x */
    }

    .exclude-title {
        font-size: clamp(2.53125rem, 3.6vw + 1.35rem, 4.05rem); /* 1.35x */
        margin-bottom: 1.35rem; /* 1.35x */
    }

    .exclude-subtitle {
        font-size: 1.51875rem; /* 1.35x of 1.125rem */
        margin-bottom: 2.7rem; /* 1.35x */
    }

    .exclude-other-positions-btn {
        gap: 0.675rem; /* 1.35x */
        padding: 1.18125rem 2.3625rem; /* 1.35x */
        font-size: 1.35rem; /* 1.35x */
    }

    .exclude-other-positions-btn i {
        font-size: 1.51875rem; /* 1.35x */
    }

    .exclude-message-card {
        padding: 2.7rem; /* 1.35x */
        border-radius: 1.35rem; /* 1.35x */
        margin-bottom: 4.05rem; /* 1.35x */
        gap: 2.025rem; /* 1.35x */
    }

    .exclude-message-icon {
        width: 4.05rem; /* 1.35x */
        height: 4.05rem; /* 1.35x */
    }

    .exclude-message-icon i {
        font-size: 2.025rem; /* 1.35x */
    }

    .exclude-message-content h2 {
        font-size: 2.025rem; /* 1.35x of 1.5rem */
        margin-bottom: 1.0125rem; /* 1.35x */
    }
    
    .exclude-message-content h2::after {
        height: 0.7875rem; /* 1.35x */
        bottom: 0.1125rem; /* 1.35x */
    }

    .exclude-message-content p {
        font-size: 1.35rem; /* 1.35x of 1rem */
    }

    .exclude-grid {
        gap: 1.6875rem; /* 1.35x */
        margin-bottom: 2.7rem; /* 1.35x */
    }

    .exclude-card {
        border-width: 2.7px; /* 1.35x */
        border-radius: 1.35rem; /* 1.35x */
    }

    .exclude-card-content {
        padding: 2.025rem; /* 1.35x */
    }

    .exclude-media {
        gap: 1.35rem; /* 1.35x */
    }

    .exclude-media-icon {
        border-radius: 1.35rem; /* 1.35x */
        padding: 1.0125rem; /* 1.35x */
    }

    .exclude-media-icon i {
        font-size: 1.6875rem; /* 1.35x */
    }

    .exclude-media h2 {
        font-size: 1.6875rem; /* 1.35x of 1.25rem */
        margin-bottom: 0.675rem; /* 1.35x */
    }

    .exclude-media p {
        font-size: 1.18125rem; /* 1.35x of 0.875rem */
    }

    .exclude-btn-wrapper {
        margin-top: 1.6875rem; /* 1.35x */
        padding-top: 1.35rem; /* 1.35x */
    }

    .exclude-btn {
        gap: 0.675rem; /* 1.35x */
        padding: 1.0125rem 2.025rem; /* 1.35x */
        border-radius: 1.0125rem; /* 1.35x */
        border-width: 2.7px; /* 1.35x */
        font-size: 1.35rem; /* 1.35x */
    }

    .exclude-footnote {
        font-size: 1.0125rem; /* 1.35x of 0.75rem */
        margin-top: 2.7rem; /* 1.35x */
    }
}

/* Mobile responsive - Adjusted sizing */
@media (max-width: 768px) {
    .exclude-wrapper {
        padding: 4.5rem 1.5rem;
        min-height: auto;
    }

    .exclude-center {
        margin-bottom: 3.75rem;
    }

    .exclude-chip {
        font-size: 1.125rem;
        padding: 0.65625rem 1.3125rem;
        margin-bottom: 1.875rem;
    }

    .exclude-chip i {
        font-size: 1.3125rem;
    }

    .exclude-title {
        font-size: 2.8rem; /* 1.4x of 2rem base mobile */
        margin-bottom: 1.125rem;
    }

    .exclude-subtitle {
        font-size: 1.5rem;
        margin-bottom: 2.25rem;
    }

    .exclude-other-positions-btn {
        padding: 1.125rem 2.25rem;
        font-size: 1.40625rem;
    }

    .exclude-other-positions-btn i {
        font-size: 1.5rem;
    }

    .exclude-message-card {
        flex-direction: column;
        text-align: center;
        padding: 2.25rem;
        margin-bottom: 3.75rem;
    }

    .exclude-message-icon {
        margin: 0 auto;
        width: 3.75rem;
        height: 3.75rem;
    }

    .exclude-message-icon i {
        font-size: 1.875rem;
    }

    .exclude-message-content h2 {
        font-size: 1.875rem;
    }
    
    .exclude-message-content h2::after {
        height: 0.75rem;
        bottom: 0.1rem;
    }

    .exclude-message-content p {
        font-size: 1.3125rem;
    }

    .exclude-grid {
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .exclude-card-content {
        padding: 1.875rem;
    }

    .exclude-media-icon {
        padding: 0.9375rem;
    }

    .exclude-media-icon i {
        font-size: 1.5rem;
    }

    .exclude-media h2 {
        font-size: 1.875rem; /* Match message card h2 */
    }

    .exclude-media p {
        font-size: 1.3125rem; /* Match message card p */
    }

    .exclude-btn-wrapper {
        margin-top: 1.5rem;
        padding-top: 1.125rem;
    }

    .exclude-btn {
        padding: 0.9375rem 1.875rem;
        font-size: 1.3125rem;
    }

    .exclude-footnote {
        font-size: 0.9375rem;
        margin-top: 2.25rem;
    }
}

@media (max-width: 480px) {
    .exclude-wrapper {
        padding: 3rem 1rem;
    }

    .exclude-center {
        margin-bottom: 3rem;
    }

    .exclude-title {
        font-size: 2.4rem; /* 1.4x of base */
    }

    .exclude-chip {
        font-size: 0.96875rem;
        padding: 0.5625rem 1.125rem;
        margin-bottom: 1.5rem;
    }

    .exclude-chip i {
        font-size: 1.125rem;
    }

    .exclude-subtitle {
        font-size: 1.3125rem;
        margin-bottom: 1.875rem;
    }

    .exclude-other-positions-btn {
        padding: 0.9375rem 1.875rem;
        font-size: 1.125rem;
    }

    .exclude-other-positions-btn i {
        font-size: 1.3125rem;
    }

    .exclude-message-card {
        padding: 1.875rem;
        margin-bottom: 3rem;
    }

    .exclude-message-icon {
        width: 3rem;
        height: 3rem;
    }

    .exclude-message-icon i {
        font-size: 1.5rem;
    }

    .exclude-message-content h2 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
    }
    
    .exclude-message-content h2::after {
        height: 0.625rem;
        bottom: 0.0625rem;
    }

    .exclude-message-content p {
        font-size: 1.125rem;
    }

    .exclude-grid {
        gap: 1.3125rem;
        margin-bottom: 2.25rem;
    }

    .exclude-card-content {
        padding: 1.5rem;
    }

    .exclude-media-icon {
        padding: 0.75rem;
    }

    .exclude-media-icon i {
        font-size: 1.3125rem;
    }

    .exclude-media h2 {
        font-size: 1.5rem; /* Match message card h2 */
    }

    .exclude-media p {
        font-size: 1.125rem; /* Match message card p */
    }

    .exclude-btn-wrapper {
        margin-top: 1.3125rem;
        padding-top: 0.9375rem;
    }

    .exclude-btn {
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
    }

    .exclude-footnote {
        font-size: 0.84375rem;
        margin-top: 1.875rem;
        padding: 0 0.75rem;
    }
}

/* Ensure proper stacking context */
.exclude-wrapper * {
    box-sizing: border-box;
}

/* Fix for ClickFunnels potential conflicts */
.exclude-wrapper h1,
.exclude-wrapper h2,
.exclude-wrapper h3,
.exclude-wrapper p,
.exclude-wrapper button,
.exclude-wrapper a {
    font-family: var(--font-family) !important;
    letter-spacing: normal !important;
    text-transform: none !important;
}

/* Ensure buttons are clickable */
.exclude-wrapper button,
.exclude-wrapper a {
    position: relative;
    z-index: 1;
}

/* Fix potential overflow issues in ClickFunnels */
#section-exclude {
    overflow: visible !important;
}

/* Ensure proper font weight rendering */
.exclude-wrapper {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Utility classes */
.mb-4 {
    margin-bottom: 2.25rem; /* 1.5x spacing */
}
