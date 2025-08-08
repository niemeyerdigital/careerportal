/**
 * Career Portal Loader - Main Entry Point
 * (with static setBaseURL helper for CSP boot code)
 */

class CareerPortalLoader {
  // --- NEW: default base URL lives on the class so we can override it early
  static BASE_URL = 'https://raw.githubusercontent.com/niemeyerdigital/careerportal/main/careerPortal/';

  // --- NEW: public static setter used by your tracking code
  static setBaseURL(url) {
    if (typeof url === 'string' && url.trim()) {
      CareerPortalLoader.BASE_URL = url.trim();
      // Update a live instance if one exists
      if (window.CareerPortalLoaderInstance) {
        window.CareerPortalLoaderInstance.baseURL = CareerPortalLoader.BASE_URL;
      }
      console.log('🔧 CareerPortalLoader baseURL set to:', CareerPortalLoader.BASE_URL);
    } else {
      console.warn('setBaseURL expected a non-empty string. Ignored.');
    }
  }

  // --- (optional) getter
  static getBaseURL() {
    return CareerPortalLoader.BASE_URL;
  }

  constructor() {
    // --- CHANGED: read from static (and allow global override variable)
    this.baseURL = window.CAREER_PORTAL_BASE_URL || CareerPortalLoader.BASE_URL;
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
    await this.loadModule('baseSec.js');
    await Promise.all([
      this.loadModule('ui/components/videoWistia.js'),
      this.loadModule('ui/components/buttonManager.js'),
      this.loadModule('ui/components/badgeComponent.js'),
      this.loadModule('ui/animations/slideUp.js'),
      this.loadModule('ui/animations/animationController.js')
    ]);
    await this.loadModule('configValidator.js');
    this.coreLoaded = true;
    console.log('🧩 Core modules ready');
  }

  sectionTypeToFile(sectionType) {
    return `sections/${sectionType}Section.js`;
  }
  sectionTypeToClassName(sectionType) {
    switch (sectionType) {
      case 'welcome': return 'WelcomeSection';
      case 'mehrErfahren': return 'MehrErfahrenSection';
      case 'process': return 'ProcessSection';
      case 'footer': return 'FooterSection';
      case 'positions': return 'PositionsSection';
      default: return null;
    }
  }
  sectionTypeToConfigName(sectionType) {
    switch (sectionType) {
      case 'welcome': return 'WELCOME_CONFIG';
      case 'mehrErfahren': return 'MEHR_ERFAHREN_CONFIG';
      case 'process': return 'PROCESS_CONFIG';
      case 'footer': return 'FOOTER_CONFIG';
      case 'positions': return 'POSITIONS_CONFIG';
      default: return null;
    }
  }

  async loadSection(sectionType) {
    const file = this.sectionTypeToFile(sectionType);
    await this.loadModule(file);
  }

  initializeSection(sectionType, configObjOrName, containerId) {
    const className = this.sectionTypeToClassName(sectionType);
    if (!className || !window[className]) {
      console.error(`[Loader] Section class missing for type "${sectionType}"`);
      return null;
    }
    let config = null;
    if (typeof configObjOrName === 'string' && configObjOrName.trim()) {
      config = window[configObjOrName] || window[this.sectionTypeToConfigName(sectionType)];
    } else if (configObjOrName && typeof configObjOrName === 'object') {
      config = configObjOrName;
    } else {
      config = window[this.sectionTypeToConfigName(sectionType)];
    }
    if (!config) {
      console.warn(`[Loader] No config found for "${sectionType}". Proceeding with empty config.`);
      config = {};
    }
    if (window.ConfigValidator?.validate) {
      const errors = window.ConfigValidator.validate(sectionType, config);
      if (errors?.length) {
        console.group(`[Loader] Config validation errors for "${sectionType}"`);
        errors.forEach(e => console.error('•', e));
        console.groupEnd();
      }
    }
    let container = null;
    if (containerId) container = document.getElementById(containerId);
    if (!container) container = document.getElementById(`${sectionType}-section`);
    if (!container) container = document.querySelector(`[data-career-section="${sectionType}"]`);
    if (!container) {
      console.error(`[Loader] Container for section "${sectionType}" not found`);
      return null;
    }
    const instance = new window[className](
      config,
      container.id || this.ensureElementId(container, `${sectionType}-section`)
    );
    console.log(`🎯 Initialized section "${sectionType}"`, { container: container.id, config });
    return instance;
  }

  ensureElementId(el, fallbackId) {
    if (el.id) return el.id;
    let id = fallbackId; let i = 1;
    while (document.getElementById(id)) id = `${fallbackId}-${i++}`;
    el.id = id;
    return el.id;
  }

  async autoInitialize() {
    await this.loadCoreOnce();
    const nodes = Array.from(document.querySelectorAll('[data-career-section]'));
    if (!nodes.length) {
      console.info('[Loader] No [data-career-section] nodes found; nothing to initialize.');
      return;
    }
    const uniqueTypes = Array.from(new Set(
      nodes.map(n => n.getAttribute('data-career-section')?.trim()).filter(Boolean)
    ));
    await Promise.all(uniqueTypes.map(t => this.loadSection(t)));
    nodes.forEach(node => {
      const type = node.getAttribute('data-career-section')?.trim();
      const cfgName = (node.getAttribute('data-config') || '').trim();
      const id = this.ensureElementId(node, `${type}-section`);
      this.initializeSection(type, cfgName || undefined, id);
    });
    console.log('🚀 Auto-initialization complete');
  }

  async manualBoot() {
    await this.loadCoreOnce();
    const toLoad = ['welcome', 'mehrErfahren', 'process', 'footer', 'positions'];
    for (const type of toLoad) {
      try { await this.loadSection(type); }
      catch (e) { console.warn(`[Loader] Failed loading section "${type}"`, e); }
    }
    if (document.getElementById('welcome-section') || document.querySelector('[data-career-section="welcome"]')) {
      this.initializeSection('welcome', 'WELCOME_CONFIG', 'welcome-section');
    }
    if (document.getElementById('mehr-erfahren-section') || document.querySelector('[data-career-section="mehrErfahren"]')) {
      this.initializeSection('mehrErfahren', 'MEHR_ERFAHREN_CONFIG', 'mehr-erfahren-section');
    }
    if (document.getElementById('process-section') || document.querySelector('[data-career-section="process"]')) {
      this.initializeSection('process', 'PROCESS_CONFIG', 'process-section');
    }
    if (document.getElementById('footer-section') || document.querySelector('[data-career-section="footer"]')) {
      this.initializeSection('footer', 'FOOTER_CONFIG', 'footer-section');
    }
    if (document.getElementById('positions-section') || document.querySelector('[data-career-section="positions"]')) {
      this.initializeSection('positions', 'POSITIONS_CONFIG', 'positions-section');
    }
    console.log('🧭 Manual boot complete');
  }
}

/* Globals */
window.CareerPortalLoader = CareerPortalLoader;

// --- NEW: legacy/alias helpers your code might call -------------------
window.setCareerPortalBaseURL = function(url){ CareerPortalLoader.setBaseURL(url); };

// Boot helper (unchanged)
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

// Debug helpers (unchanged)
window.debugWelcome = function () { /* ... keep your existing debug code ... */ };
window.debugMehr = function () { /* ... */ };
window.debugProcess = function () { /* ... */ };
window.debugPositions = function () { /* ... */ };
window.debugFooter = function () { /* ... */ };
