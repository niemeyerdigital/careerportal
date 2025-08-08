/**
 * Career Portal Loader - Main Entry Point
 * Dynamically loads required modules and initializes sections
 * Works with ClickFunnels via fetch+eval CSP workaround.
 *
 * Supports sections:
 *  - welcome         -> window.WelcomeSection       -> window.WELCOME_CONFIG
 *  - mehrErfahren    -> window.MehrErfahrenSection  -> window.MEHR_ERFAHREN_CONFIG
 *  - process         -> window.ProcessSection       -> window.PROCESS_CONFIG
 *  - footer          -> window.FooterSection        -> window.FOOTER_CONFIG
 *  - positions       -> window.PositionsSection     -> window.POSITIONS_CONFIG  (NEW)
 */

class CareerPortalLoader {
  constructor() {
    this.baseURL = 'https://raw.githubusercontent.com/niemeyerdigital/careerportal/main/careerPortal/';
    this.loadedModules = new Map();
    this.initializationQueue = [];
    this.coreLoaded = false;
  }

  /* -----------------------------------------------------------
   * Low-level loader
   * --------------------------------------------------------- */
  async loadModule(path) {
    const key = String(path);
    if (this.loadedModules.has(key)) return this.loadedModules.get(key);

    const url = this.baseURL + key.replace(/^\//, '');
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) {
      throw new Error(`Failed to load module: ${key} (${resp.status})`);
    }
    const code = await resp.text();
    // eslint-disable-next-line no-eval
    eval(code);
    this.loadedModules.set(key, true);
    console.log(`✅ Loaded: ${key}`);
    return true;
  }

  async loadCoreOnce() {
    if (this.coreLoaded) return;
    // Base & shared UI
    await this.loadModule('baseSec.js');
    await Promise.all([
      this.loadModule('ui/components/videoWistia.js'),
      this.loadModule('ui/components/buttonManager.js'),
      this.loadModule('ui/components/badgeComponent.js'),
      this.loadModule('ui/animations/slideUp.js'),
      this.loadModule('ui/animations/animationController.js')
    ]);
    // Validator
    await this.loadModule('configValidator.js');
    this.coreLoaded = true;
    console.log('🧩 Core modules ready');
  }

  /* -----------------------------------------------------------
   * Section loading
   * --------------------------------------------------------- */
  sectionTypeToFile(sectionType) {
    // Follows your repo naming: sections/<type>Section.js
    // e.g., welcome -> sections/welcomeSection.js
    return `sections/${sectionType}Section.js`;
  }

  sectionTypeToClassName(sectionType) {
    switch (sectionType) {
      case 'welcome': return 'WelcomeSection';
      case 'mehrErfahren': return 'MehrErfahrenSection';
      case 'process': return 'ProcessSection';
      case 'footer': return 'FooterSection';
      case 'positions': return 'PositionsSection'; // NEW
      default: return null;
    }
  }

  sectionTypeToConfigName(sectionType) {
    switch (sectionType) {
      case 'welcome': return 'WELCOME_CONFIG';
      case 'mehrErfahren': return 'MEHR_ERFAHREN_CONFIG';
      case 'process': return 'PROCESS_CONFIG';
      case 'footer': return 'FOOTER_CONFIG';
      case 'positions': return 'POSITIONS_CONFIG'; // NEW
      default: return null;
    }
  }

  async loadSection(sectionType) {
    const file = this.sectionTypeToFile(sectionType);
    await this.loadModule(file);
  }

  /* -----------------------------------------------------------
   * Initialization
   * --------------------------------------------------------- */
  initializeSection(sectionType, configObjOrName, containerId) {
    const className = this.sectionTypeToClassName(sectionType);
    if (!className || !window[className]) {
      console.error(`[Loader] Section class missing for type "${sectionType}"`);
      return null;
    }

    // Resolve config (string name or direct object)
    let config = null;
    if (typeof configObjOrName === 'string' && configObjOrName.trim()) {
      // Direct name passed via data-config (e.g., "WELCOME_CONFIG")
      config = window[configObjOrName];
      if (!config) {
        // Try conventional name if data-config used a shorthand
        const conventional = this.sectionTypeToConfigName(sectionType);
        config = window[conventional];
      }
    } else if (configObjOrName && typeof configObjOrName === 'object') {
      config = configObjOrName;
    }

    // Fallback to conventional CONFIG var if still not found
    if (!config) {
      const conventional = this.sectionTypeToConfigName(sectionType);
      config = window[conventional];
    }

    if (!config) {
      console.warn(`[Loader] No config found for "${sectionType}". Proceeding with empty config.`);
      config = {};
    }

    // Validate config (if validator present)
    if (window.ConfigValidator && typeof window.ConfigValidator.validate === 'function') {
      const errors = window.ConfigValidator.validate(sectionType, config);
      if (errors && errors.length) {
        console.group(`[Loader] Config validation errors for "${sectionType}"`);
        errors.forEach(e => console.error('•', e));
        console.groupEnd();
      }
    }

    // Container resolution:
    // 1) Explicit containerId (preferred)
    // 2) Fallback to element with id derived from type: "<type>-section"
    // 3) Fallback to first element with [data-career-section="<type>"]
    let container = null;
    if (containerId) container = document.getElementById(containerId);
    if (!container) container = document.getElementById(`${sectionType}-section`);
    if (!container) container = document.querySelector(`[data-career-section="${sectionType}"]`);
    if (!container) {
      console.error(`[Loader] Container for section "${sectionType}" not found`);
      return null;
    }

    // Instantiate
    const instance = new window[className](config, container.id || this.ensureElementId(container, `${sectionType}-section`));
    console.log(`🎯 Initialized section "${sectionType}"`, { container: container.id, config });
    return instance;
  }

  ensureElementId(el, fallbackId) {
    if (el.id) return el.id;
    let id = fallbackId;
    let i = 1;
    while (document.getElementById(id)) {
      id = `${fallbackId}-${i++}`;
    }
    el.id = id;
    return el.id;
  }

  /* -----------------------------------------------------------
   * Auto bootstrapping from DOM
   * <div data-career-section="welcome" data-config="WELCOME_CONFIG"></div>
   * --------------------------------------------------------- */
  async autoInitialize() {
    await this.loadCoreOnce();

    const nodes = Array.from(document.querySelectorAll('[data-career-section]'));
    if (!nodes.length) {
      console.info('[Loader] No [data-career-section] nodes found; nothing to initialize.');
      return;
    }

    // Collect unique section types to load their modules once
    const uniqueTypes = Array.from(new Set(nodes.map(n => n.getAttribute('data-career-section').trim()).filter(Boolean)));
    await Promise.all(uniqueTypes.map(t => this.loadSection(t)));

    // Instantiate sections
    nodes.forEach(node => {
      const type = node.getAttribute('data-career-section').trim();
      const cfgName = (node.getAttribute('data-config') || '').trim();
      const id = this.ensureElementId(node, `${type}-section`);
      this.initializeSection(type, cfgName || undefined, id);
    });

    console.log('🚀 Auto-initialization complete');
  }

  /* -----------------------------------------------------------
   * Manual boot sequence (for CSP tracking-code block)
   * Call this if you want explicit control/order.
   * --------------------------------------------------------- */
  async manualBoot() {
    await this.loadCoreOnce();

    // Load all known sections you plan to use on the page
    const toLoad = ['welcome', 'mehrErfahren', 'process', 'footer', 'positions']; // include NEW positions
    for (const type of toLoad) {
      try {
        await this.loadSection(type);
      } catch (e) {
        console.warn(`[Loader] Failed loading section "${type}"`, e);
      }
    }

    // Initialize if containers + configs exist
    // Welcome
    if (document.getElementById('welcome-section') || document.querySelector('[data-career-section="welcome"]')) {
      this.initializeSection('welcome', 'WELCOME_CONFIG', 'welcome-section');
    }
    // Mehr Erfahren
    if (document.getElementById('mehr-erfahren-section') || document.querySelector('[data-career-section="mehrErfahren"]')) {
      this.initializeSection('mehrErfahren', 'MEHR_ERFAHREN_CONFIG', 'mehr-erfahren-section');
    }
    // Process
    if (document.getElementById('process-section') || document.querySelector('[data-career-section="process"]')) {
      this.initializeSection('process', 'PROCESS_CONFIG', 'process-section');
    }
    // Footer
    if (document.getElementById('footer-section') || document.querySelector('[data-career-section="footer"]')) {
      this.initializeSection('footer', 'FOOTER_CONFIG', 'footer-section');
    }
    // Positions (NEW)
    if (document.getElementById('positions-section') || document.querySelector('[data-career-section="positions"]')) {
      this.initializeSection('positions', 'POSITIONS_CONFIG', 'positions-section');
    }

    console.log('🧭 Manual boot complete');
  }
}

/* -------------------------------------------------------------------
 * Global helpers
 * ----------------------------------------------------------------- */
window.CareerPortalLoader = CareerPortalLoader;
window.careerPortalStart = async function (mode = 'auto') {
  try {
    const loader = new CareerPortalLoader();
    window.CareerPortalLoaderInstance = loader;
    if (mode === 'manual') {
      await loader.manualBoot();
    } else {
      await loader.autoInitialize();
    }
  } catch (err) {
    console.error('[Loader] Startup error', err);
  }
};

/* -------------------------------------------------------------------
 * Debug helpers (optional)
 * ----------------------------------------------------------------- */
// Welcome
window.debugWelcome = function () {
  console.log('=== Welcome Section Debug ===');
  console.log('Loaded:', !!window.WelcomeSection);
  console.log('Container present:', !!(document.getElementById('welcome-section') || document.querySelector('[data-career-section="welcome"]')));
  console.log('Config:', window.WELCOME_CONFIG);
};

// Mehr Erfahren
window.debugMehr = function () {
  console.log('=== MehrErfahren Section Debug ===');
  console.log('Loaded:', !!window.MehrErfahrenSection);
  console.log('Container present:', !!(document.getElementById('mehr-erfahren-section') || document.querySelector('[data-career-section="mehrErfahren"]')));
  console.log('Config:', window.MEHR_ERFAHREN_CONFIG);
};

// Process
window.debugProcess = function () {
  console.log('=== Process Section Debug ===');
  console.log('Loaded:', !!window.ProcessSection);
  console.log('Container present:', !!(document.getElementById('process-section') || document.querySelector('[data-career-section="process"]')));
  console.log('Config:', window.PROCESS_CONFIG);
};

// Positions (NEW)
window.debugPositions = function () {
  console.log('=== Positions Section Debug ===');
  console.log('Loaded:', !!window.PositionsSection);
  console.log('Container present:', !!(document.getElementById('positions-section') || document.querySelector('[data-career-section="positions"]')));
  console.log('Config:', window.POSITIONS_CONFIG);
};

// Footer
window.debugFooter = function () {
  console.log('=== Footer Section Debug Info ===');
  console.log('FooterSection loaded:', !!window.FooterSection);
  console.log('Container present:', !!(document.getElementById('footer-section') || document.querySelector('[data-career-section="footer"]')));
  console.log('Config:', window.FOOTER_CONFIG);

  if (window.FOOTER_CONFIG && window.FOOTER_CONFIG.socialMedia) {
    const enabledSocial = Object.entries(window.FOOTER_CONFIG.socialMedia)
      .filter(([_, settings]) => settings.enabled)
      .map(([platform]) => platform);
    console.log('Enabled social platforms:', enabledSocial);
  }
};
