/**
 * Positions Section
 * Job listings with filtering, search, and modal details
 */

window.PositionsSection = class PositionsSection extends window.BaseSec {
    constructor(config, containerId) {
        super(config, containerId);
        
        // Initialize state
        this.state = {
            view: window.innerWidth < 640 ? config.defaultView?.mobile || 'grid' : config.defaultView?.desktop || 'grid',
            search: '',
            bereich: '',
            art: '',
            region: '',
            zeitraum: 'Alle',
            sort: 'new',
            filtersCollapsed: true,
            active: null
        };
        
        // Data
        this.cardsData = config.positions || [];
        this.activeData = [];
        this.filtered = [];
        
        // LocalStorage keys
        this.PREFS_KEY = 'careerPortalPrefs_v3';
        this.SAVED_KEY = 'careerPortalSaved_v1';
        
        this.initializePositions();
    }

    /**
     * Initialize Positions section
     */
    initializePositions() {
        if (!this.container) {
            console.error('Positions section container not found');
            return;
        }

        // Filter active positions
        this.activeData = this.cardsData.filter(c => c.status === 'on');
        
        // Load preferences
        this.loadPrefs();
        
        // Create HTML structure
        this.createPositionsHTML();
        
        // Setup components
        this.setupFilters();
        this.setupEventHandlers();
        
        // Initial render
        this.render();
    }

    /**
     * Create the HTML structure
     */
    createPositionsHTML() {
        const config = this.config;
        
        this.container.innerHTML = `
            <div class="positions-wrapper">
                <div class="positions-container">
                    <!-- Header -->
                    <header class="positions-header">
                        <div>
                            <h1 class="positions-h-underline">${config.headline || 'Entdecke unsere offenen Stellen'}</h1>
                            <p class="positions-muted">${config.subtext || 'Finde die passende Position und bewirb dich direkt.'}</p>
                        </div>
                        
                        <div class="positions-view-switcher" role="group" aria-label="Ansicht umschalten">
                            <span class="positions-vs-label">Ansicht</span>
                            <button class="positions-chip-btn" id="view-grid" aria-pressed="false">
                                <i class="fa-light fa-grid-2"></i> Grid
                            </button>
                            <button class="positions-chip-btn" id="view-list" aria-pressed="false">
                                <i class="fa-light fa-list"></i> Liste
                            </button>
                            <button class="positions-chip-btn" id="view-table" aria-pressed="false">
                                <i class="fa-light fa-table"></i> Tabelle
                            </button>
                        </div>
                    </header>

                    <!-- Search (if enabled) -->
                    ${config.filters?.search?.enabled ? `
                        <section class="positions-search-row" aria-label="Suche">
                            <div class="positions-search-head">
                                <div class="positions-search-title">
                                    <i class="fa-light fa-magnifying-glass"></i> Suche
                                </div>
                            </div>
                            <input id="q" class="positions-search-input" 
                                   placeholder="${config.filters.search.placeholder || 'Titel, Bereich oder Stadt …'}" />
                        </section>
                    ` : ''}

                    <!-- Filters -->
                    <section class="positions-filters is-collapsed" aria-label="Filter" id="filters">
                        <div class="positions-filters-head">
                            <div class="positions-filters-title">
                                <i class="fa-light fa-sliders-simple"></i> Filter
                            </div>
                            <button class="positions-filters-toggle" id="filters-toggle" aria-expanded="false">
                                <i class="fa-light fa-chevron-down"></i> Anzeigen
                            </button>
                        </div>
                        <div class="positions-filters-grid" id="filters-grid">
                            <!-- Filters will be added dynamically -->
                        </div>
                    </section>

                    <!-- Count -->
                    <div id="count" class="positions-count"></div>

                    <!-- Results -->
                    <section id="results" class="positions-grid" aria-live="polite"></section>
                </div>
            </div>

            <!-- Modal -->
            <div id="modal" class="positions-modal-root" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="positions-modal-backdrop" id="modal-backdrop"></div>
                <div class="positions-modal-card" id="modal-card">
                    <div class="positions-modal-header">
                        <div>
                            <div class="positions-modal-title-wrapper">
                                <h3 id="modal-title" class="positions-modal-title"></h3>
                                ${config.features?.savedPositions ? `
                                    <button class="positions-modal-close" id="modal-save" aria-label="Position speichern">
                                        <i class="fa-light fa-bookmark" style="font-size:18px;"></i>
                                    </button>
                                ` : ''}
                            </div>
                            <div class="positions-pills" id="modal-pills"></div>
                        </div>
                        <button class="positions-modal-close" id="modal-close" aria-label="Modal schließen">
                            <i class="fa-light fa-xmark" style="font-size: 18px;"></i>
                        </button>
                    </div>

                    <div class="positions-blocks">
                        <section class="positions-block">
                            <header><i class="fa-light fa-badge-check"></i><h4>Erforderliche Qualifikationen</h4></header>
                            <ul id="m-mandatory"></ul>
                        </section>
                        <section class="positions-block">
                            <header><i class="fa-light fa-stars"></i><h4>Wünschenswerte Qualifikationen</h4></header>
                            <ul id="m-optional"></ul>
                        </section>
                        <section class="positions-block">
                            <header><i class="fa-light fa-list-check"></i><h4>Aufgaben</h4></header>
                            <ul id="m-tasks"></ul>
                        </section>
                        <section class="positions-block">
                            <header><i class="fa-light fa-gift"></i><h4>Benefits</h4></header>
                            <ul id="m-benefits"></ul>
                        </section>
                    </div>

                    <div class="positions-modal-footer">
                        <div data-title="MainButton1" id="m-apply-wrapper">
                            <button class="positions-btn positions-btn-primary" id="m-apply">
                                <i class="fa-light fa-paper-plane"></i> Jetzt bewerben
                            </button>
                        </div>
                        <button class="positions-btn positions-btn-ghost" id="m-close-2">
                            <i class="fa-light fa-xmark"></i> Schließen
                        </button>
                        <div class="positions-footer-meta" id="m-meta">
                            <i class="fa-light fa-calendar" aria-hidden="true"></i><span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup filters based on config
     */
    setupFilters() {
        const filtersGrid = document.getElementById('filters-grid');
        const config = this.config;
        
        if (!filtersGrid) return;
        
        // Build filter elements based on config
        if (config.filters?.bereich?.enabled) {
            this.addFilterElement(filtersGrid, 'bereich', config.filters.bereich);
        }
        
        if (config.filters?.art?.enabled) {
            this.addFilterElement(filtersGrid, 'art', config.filters.art);
        }
        
        if (config.filters?.region?.enabled) {
            this.addFilterElement(filtersGrid, 'region', config.filters.region);
        }
        
        if (config.filters?.zeitraum?.enabled) {
            this.addFilterElement(filtersGrid, 'zeitraum', config.filters.zeitraum);
        }
        
        if (config.filters?.sort?.enabled) {
            this.addFilterElement(filtersGrid, 'sort', config.filters.sort);
        }
        
        // Build filter options from data
        this.buildFilterOptions();
        
        // Hide filters section if none enabled
        const hasFilters = filtersGrid.children.length > 0;
        if (!hasFilters) {
            document.getElementById('filters').style.display = 'none';
        }
    }

    /**
     * Add filter element to grid
     */
    addFilterElement(grid, type, filterConfig) {
        const div = document.createElement('div');
        
        if (type === 'zeitraum') {
            div.innerHTML = `
                <div class="positions-filter-label">
                    <i class="${filterConfig.icon}" aria-hidden="true"></i>
                    <span>${filterConfig.label}</span>
                </div>
                <select id="f-${type}" class="positions-control">
                    ${filterConfig.options.map(opt => `<option>${opt}</option>`).join('')}
                </select>
            `;
        } else if (type === 'sort') {
            div.innerHTML = `
                <div class="positions-filter-label">
                    <i class="${filterConfig.icon}" aria-hidden="true"></i>
                    <span>${filterConfig.label}</span>
                </div>
                <select id="f-${type}" class="positions-control">
                    ${filterConfig.options.map(opt => 
                        `<option value="${opt.value}">${opt.text}</option>`
                    ).join('')}
                    ${this.config.features?.savedPositions ? 
                        '<option value="saved">Gespeicherte</option>' : ''}
                </select>
            `;
        } else {
            div.innerHTML = `
                <div class="positions-filter-label">
                    <i class="${filterConfig.icon}" aria-hidden="true"></i>
                    <span>${filterConfig.label}</span>
                </div>
                <select id="f-${type}" class="positions-control"></select>
            `;
        }
        
        grid.appendChild(div);
    }

    /**
     * Build filter options from data
     */
    buildFilterOptions() {
        const buildOpts = (select, values) => {
            if (!select) return;
            select.innerHTML = '<option value="">Alle</option>';
            Array.from(new Set(values))
                .sort((a, b) => String(a).localeCompare(String(b), 'de'))
                .forEach(v => {
                    const opt = document.createElement('option');
                    opt.value = v;
                    opt.textContent = v;
                    select.appendChild(opt);
                });
        };

        buildOpts(document.getElementById('f-bereich'), this.activeData.map(c => c.area));
        buildOpts(document.getElementById('f-art'), this.activeData.flatMap(c => c.workCapacity));
        buildOpts(document.getElementById('f-region'), this.activeData.map(c => c.region));
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Search
        const searchInput = document.getElementById('q');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.state.search = searchInput.value;
                this.render();
            });
        }

        // Filters
        ['bereich', 'art', 'region', 'zeitraum', 'sort'].forEach(filter => {
            const element = document.getElementById(`f-${filter}`);
            if (element) {
                element.addEventListener('change', () => {
                    this.state[filter] = element.value;
                    this.render();
                });
            }
        });

        // View switcher
        ['grid', 'list', 'table'].forEach(view => {
            const btn = document.getElementById(`view-${view}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.state.view = view;
                    this.render();
                });
            }
        });

        // Filter toggle
        const filtersToggle = document.getElementById('filters-toggle');
        if (filtersToggle) {
            filtersToggle.addEventListener('click', () => {
                const filters = document.getElementById('filters');
                const isCollapsed = filters.classList.contains('is-collapsed');
                filters.classList.toggle('is-collapsed');
                filtersToggle.innerHTML = isCollapsed
                    ? '<i class="fa-light fa-chevron-up"></i> Ausblenden'
                    : '<i class="fa-light fa-chevron-down"></i> Anzeigen';
                filtersToggle.setAttribute('aria-expanded', String(isCollapsed));
            });
        }

        // Modal handlers
        this.setupModalHandlers();
    }

    /**
     * Setup modal event handlers
     */
    setupModalHandlers() {
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalClose = document.getElementById('modal-close');
        const modalClose2 = document.getElementById('m-close-2');
        const modalSave = document.getElementById('modal-save');

        [modalBackdrop, modalClose, modalClose2].forEach(el => {
            if (el) {
                el.addEventListener('click', () => this.closeModal());
            }
        });

        if (modalSave && this.config.features?.savedPositions) {
            modalSave.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.state.active) {
                    this.toggleSaved(this.state.active.id);
                    this.updateModalSaveIcon(this.state.active.id);
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.active) {
                this.closeModal();
            }
        });
    }

    /**
     * Filter and render positions
     */
    render() {
        // Sync filter values
        Object.keys(this.state).forEach(key => {
            const element = document.getElementById(`f-${key}`);
            if (element) element.value = this.state[key];
        });

        // Get filtered data
        const data = this.getFiltered();
        
        // Update count
        const count = document.getElementById('count');
        if (count) {
            count.textContent = `${data.length} ${data.length === 1 ? 'Position' : 'Positionen'} gefunden`;
        }

        // Render results
        const results = document.getElementById('results');
        if (!results) return;

        results.innerHTML = '';
        results.className = `positions-${this.state.view}`;

        if (this.state.view === 'table') {
            this.renderTable(data, results);
        } else {
            data.forEach(card => {
                results.appendChild(this.renderCard(card));
            });
        }

        // Update view switcher
        ['grid', 'list', 'table'].forEach(view => {
            const btn = document.getElementById(`view-${view}`);
            if (btn) {
                btn.classList.toggle('is-active', this.state.view === view);
                btn.setAttribute('aria-pressed', String(this.state.view === view));
            }
        });

        // Save preferences
        this.savePrefs();
    }

    /**
     * Get filtered data
     */
    getFiltered() {
        const { search, bereich, art, region, zeitraum, sort } = this.state;
        const searchLower = search.trim().toLowerCase();

        // Handle saved positions mode
        if (this.config.features?.savedPositions && sort === 'saved') {
            const savedIds = this.getSavedSet();
            return this.cardsData
                .filter(c => savedIds.has(c.id))
                .filter(c => this.applyFilters(c, searchLower, bereich, art, region, zeitraum))
                .sort((a, b) => this.parseGermanDate(b.datum) - this.parseGermanDate(a.datum));
        }

        // Normal filtering
        let filtered = this.activeData
            .filter(c => this.applyFilters(c, searchLower, bereich, art, region, zeitraum));

        // Sorting
        return this.sortData(filtered, sort);
    }

    /**
     * Apply filters to a card
     */
    applyFilters(card, searchLower, bereich, art, region, zeitraum) {
        // Bereich filter
        if (bereich && card.area !== bereich) return false;
        
        // Art filter
        if (art && !card.workCapacity?.includes(art)) return false;
        
        // Region filter
        if (region && card.region !== region) return false;
        
        // Zeitraum filter
        if (!this.withinZeitraum(card.datum, zeitraum)) return false;
        
        // Search filter
        if (searchLower) {
            const title = this.ensureMWD(card.position).toLowerCase();
            const matches = title.includes(searchLower) || 
                           card.area.toLowerCase().includes(searchLower) || 
                           card.region.toLowerCase().includes(searchLower);
            if (!matches) return false;
        }
        
        return true;
    }

    /**
     * Sort data
     */
    sortData(arr, sortType) {
        const copy = arr.slice();
        switch (sortType) {
            case 'az':
                return copy.sort((a, b) => 
                    this.ensureMWD(a.position).localeCompare(this.ensureMWD(b.position), 'de'));
            case 'za':
                return copy.sort((a, b) => 
                    this.ensureMWD(b.position).localeCompare(this.ensureMWD(a.position), 'de'));
            case 'old':
                return copy.sort((a, b) => 
                    this.parseGermanDate(a.datum) - this.parseGermanDate(b.datum));
            case 'new':
            default:
                return copy.sort((a, b) => 
                    this.parseGermanDate(b.datum) - this.parseGermanDate(a.datum));
        }
    }

    /**
     * Render card
     */
    renderCard(card) {
        const isCompact = window.innerWidth < 640 && this.state.view === 'grid';
        const savedMode = this.config.features?.savedPositions && this.state.sort === 'saved';

        const el = document.createElement('article');
        el.className = 'positions-card' + (isCompact ? ' compact' : '');
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Details zu ${this.ensureMWD(card.position)} öffnen`);

        // Header
        const head = document.createElement('div');
        head.className = 'positions-card-head';

        const title = document.createElement('h3');
        title.className = 'positions-card-title';
        title.textContent = this.ensureMWD(card.position);
        head.appendChild(title);

        if (!isCompact) {
            const meta = document.createElement('div');
            meta.className = 'positions-card-meta';
            meta.innerHTML = `
                <div>${card.datum}</div>
                <div class="italic">vor ${this.daysSince(card.datum)} Tagen</div>
            `;
            head.appendChild(meta);
        }

        el.appendChild(head);

        // Offline notice for saved mode
        if (savedMode && card.status === 'off') {
            const notice = document.createElement('div');
            notice.setAttribute('role', 'status');
            notice.className = 'positions-offline-notice';
            notice.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Diese Position ist nicht mehr online.';
            el.appendChild(notice);
        }

        // Pills
        const pills = document.createElement('div');
        pills.className = 'positions-pills';
        pills.appendChild(this.createPill(`<i class="fa-light fa-location-dot"></i>${card.region}`, true));
        pills.appendChild(this.createPill(`<i class="fa-light fa-layer-group"></i>${card.area}`));
        if (!isCompact) {
            (card.workCapacity || []).forEach(w => 
                pills.appendChild(this.createPill(`<i class="fa-light fa-briefcase"></i>${w}`)));
            if (card.startDateVisible) {
                pills.appendChild(this.createPill(`<i class="fa-light fa-calendar"></i>Start: ${card.startDate}`));
            }
        }
        el.appendChild(pills);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'positions-card-actions';

        const applyBtn = document.createElement('button');
        applyBtn.className = 'positions-btn positions-btn-primary';
        applyBtn.innerHTML = '<i class="fa-light fa-paper-plane"></i> Jetzt bewerben';
        applyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(card.applicationUrl, '_blank');
        });

        const quickBtn = document.createElement('button');
        quickBtn.className = 'positions-btn positions-btn-ghost';
        quickBtn.innerHTML = '<i class="fa-light fa-eye"></i> Schnellansicht';
        quickBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal(card);
        });

        actions.appendChild(applyBtn);
        actions.appendChild(quickBtn);
        el.appendChild(actions);

        // Card click handler
        el.addEventListener('click', () => this.openModal(card));
        el.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault();
                this.openModal(card);
            }
        });

        return el;
    }

    /**
     * Render table view
     */
    renderTable(data, container) {
        const wrap = document.createElement('div');
        wrap.className = 'positions-table-wrap';
        
        const table = document.createElement('table');
        table.className = 'positions-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Titel</th>
                <th>Bereich</th>
                <th>Stadt</th>
                <th>Datum</th>
                <th>Art</th>
                <th>Aktionen</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <button class="positions-btn positions-btn-ghost" style="padding:6px 8px">
                        ${this.ensureMWD(card.position)}
                    </button>
                </td>
                <td>${card.area}</td>
                <td>${card.region}</td>
                <td>${card.datum}</td>
                <td>${(card.workCapacity || []).join(', ')}</td>
                <td>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="positions-btn positions-btn-primary btn-apply">
                            <i class="fa-light fa-paper-plane"></i>
                        </button>
                        <button class="positions-btn positions-btn-ghost btn-open">
                            <i class="fa-light fa-eye"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tr.querySelector('button.positions-btn-ghost').addEventListener('click', () => this.openModal(card));
            tr.querySelector('button.btn-apply').addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(card.applicationUrl, '_blank');
            });
            tr.querySelector('button.btn-open').addEventListener('click', () => this.openModal(card));
            
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        wrap.appendChild(table);
        container.appendChild(wrap);
    }

    /**
     * Open modal
     */
    openModal(card) {
        this.state.active = card;

        const modalTitle = document.getElementById('modal-title');
        const modalPills = document.getElementById('modal-pills');
        const mMandatory = document.getElementById('m-mandatory');
        const mOptional = document.getElementById('m-optional');
        const mTasks = document.getElementById('m-tasks');
        const mBenefits = document.getElementById('m-benefits');
        const mMeta = document.getElementById('m-meta')?.querySelector('span');
        const mApply = document.getElementById('m-apply');

        if (modalTitle) modalTitle.textContent = this.ensureMWD(card.position);

        if (modalPills) {
            modalPills.innerHTML = '';
            modalPills.appendChild(this.createPill(`<i class="fa-light fa-location-dot"></i>${card.region}`, true));
            (card.workCapacity || []).forEach(w => 
                modalPills.appendChild(this.createPill(`<i class="fa-light fa-briefcase"></i>${w}`)));
            if (card.startDateVisible) {
                modalPills.appendChild(this.createPill(`<i class="fa-light fa-calendar"></i>Start: ${card.startDate}`));
            }
        }

        this.fillList(mMandatory, card.qualifications?.mandatory || []);
        this.fillList(mOptional, card.qualifications?.optional || []);
        this.fillList(mTasks, card.tasks || []);
        this.fillList(mBenefits, card.benefits || []);

        if (mMeta) {
            mMeta.textContent = `Veröffentlicht am ${card.datum} · vor ${this.daysSince(card.datum)} Tagen`;
        }

        if (mApply) {
            mApply.onclick = () => window.open(card.applicationUrl, '_blank');
        }

        // Update save icon if enabled
        if (this.config.features?.savedPositions) {
            this.updateModalSaveIcon(card.id);
            const modalSave = document.getElementById('modal-save');
            if (modalSave && window.innerWidth >= 768) {
                modalSave.style.display = '';
            }
        }

        // Prevent body scroll
        this.lockBodyScroll();

        // Show modal
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('is-open');
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        this.state.active = null;
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('is-open');
        }
        const modalCard = document.getElementById('modal-card');
        if (modalCard) {
            modalCard.style.transform = '';
        }
        
        // Restore body scroll
        this.unlockBodyScroll();
    }

    /**
     * Create pill element
     */
    createPill(html, accent = false) {
        const span = document.createElement('span');
        span.className = 'positions-pill' + (accent ? ' positions-pill-accent' : '');
        span.innerHTML = html;
        return span;
    }

    /**
     * Fill list with items
     */
    fillList(ul, items) {
        if (!ul) return;
        ul.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-light fa-circle-small" aria-hidden="true"></i><span>${item}</span>`;
            ul.appendChild(li);
        });
    }

    /**
     * Lock body scroll when modal is open
     */
    lockBodyScroll() {
        // Store current scroll position
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Create or update viewport meta for mobile
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            this.originalViewport = viewportMeta.content;
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Apply styles to prevent scrolling - enhanced for mobile
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // iOS specific fixes
        document.body.style.touchAction = 'none';
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Add class to body for additional CSS control
        document.body.classList.add('modal-open');
        
        // Ensure modal can scroll
        const modalCard = document.getElementById('modal-card');
        if (modalCard) {
            modalCard.style.overflowY = 'auto';
            modalCard.style.webkitOverflowScrolling = 'touch';
            modalCard.style.touchAction = 'pan-y';
        }
    }

    /**
     * Unlock body scroll when modal is closed
     */
    unlockBodyScroll() {
        // Restore viewport meta
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta && this.originalViewport) {
            viewportMeta.content = this.originalViewport;
        }
        
        // Remove all scroll lock styles
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.touchAction = '';
        document.body.style.webkitOverflowScrolling = '';
        
        // Remove class
        document.body.classList.remove('modal-open');
        
        // Restore scroll position
        if (this.scrollPosition) {
            window.scrollTo(0, this.scrollPosition);
        }
    }

    /**
     * Utility functions
     */
    ensureMWD(title) {
        const lower = String(title || '').toLowerCase();
        return lower.includes('(m/w/d)') ? title : title + ' (m/w/d)';
    }

    parseGermanDate(ddmmyyyy) {
        const parts = String(ddmmyyyy || '').split('.').map(Number);
        const dd = parts[0] || 1;
        const mm = (parts[1] || 1) - 1;
        const yyyy = parts[2] || new Date().getFullYear();
        return new Date(yyyy, mm, dd);
    }

    daysSince(ddmmyyyy) {
        const d = this.parseGermanDate(ddmmyyyy);
        const today = new Date();
        const ms = today.getTime() - d.getTime();
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        return days < 0 ? 0 : days;
    }

    withinZeitraum(ddmmyyyy, zeitraum) {
        if (zeitraum === 'Alle') return true;
        const days = this.daysSince(ddmmyyyy);
        if (zeitraum === 'Letzte 7 Tage') return days <= 7;
        if (zeitraum === 'Letzte 30 Tage') return days <= 30;
        return true;
    }

    /**
     * Saved positions functionality
     */
    getSavedSet() {
        if (!this.config.features?.savedPositions) return new Set();
        try {
            const raw = localStorage.getItem(this.SAVED_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            return new Set(Array.isArray(arr) ? arr : []);
        } catch (e) {
            return new Set();
        }
    }

    setSavedSet(set) {
        if (!this.config.features?.savedPositions) return;
        try {
            localStorage.setItem(this.SAVED_KEY, JSON.stringify(Array.from(set)));
        } catch (e) {}
    }

    isSaved(id) {
        if (!this.config.features?.savedPositions) return false;
        return this.getSavedSet().has(id);
    }

    toggleSaved(id) {
        if (!this.config.features?.savedPositions) return;
        const set = this.getSavedSet();
        if (set.has(id)) {
            set.delete(id);
        } else {
            set.add(id);
        }
        this.setSavedSet(set);
        if (this.state.sort === 'saved') {
            this.render();
        }
    }

    updateModalSaveIcon(cardId) {
        if (!this.config.features?.savedPositions) return;
        const modalSave = document.getElementById('modal-save');
        if (!modalSave) return;
        const icon = modalSave.querySelector('i');
        if (!icon) return;
        
        if (this.isSaved(cardId)) {
            icon.className = 'fa-solid fa-bookmark';
        } else {
            icon.className = 'fa-light fa-bookmark';
        }
    }

    /**
     * Preferences
     */
    savePrefs() {
        const prefs = {
            view: this.state.view,
            search: this.state.search,
            bereich: this.state.bereich,
            art: this.state.art,
            region: this.state.region,
            zeitraum: this.state.zeitraum,
            sort: this.state.sort,
            filtersCollapsed: document.getElementById('filters')?.classList.contains('is-collapsed')
        };
        try {
            localStorage.setItem(this.PREFS_KEY, JSON.stringify(prefs));
        } catch (e) {}
    }

    loadPrefs() {
        try {
            const raw = localStorage.getItem(this.PREFS_KEY);
            if (!raw) return;
            const prefs = JSON.parse(raw);
            Object.keys(prefs).forEach(key => {
                if (key !== 'filtersCollapsed' && prefs[key] !== undefined) {
                    this.state[key] = prefs[key];
                }
            });
        } catch (e) {}
    }

    /**
     * Get metrics
     */
    getMetrics() {
        return {
            sectionType: 'positions',
            config: this.config,
            totalPositions: this.cardsData.length,
            activePositions: this.activeData.length,
            filteredPositions: this.filtered.length,
            currentView: this.state.view,
            savedEnabled: this.config.features?.savedPositions,
            isVisible: this.isInViewport(this.container)
        };
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        if (!this.config.positions || !Array.isArray(this.config.positions)) {
            console.error('Positions section: positions array is required');
            return false;
        }
        return super.validateConfig();
    }

    /**
     * Handle responsive updates
     */
    onResize() {
        // Update default view based on screen size
        const isMobile = window.innerWidth < 640;
        const filters = document.getElementById('filters');
        
        // Collapse filters on mobile
        if (isMobile && filters && !filters.classList.contains('is-collapsed')) {
            filters.classList.add('is-collapsed');
            const toggle = document.getElementById('filters-toggle');
            if (toggle) {
                toggle.innerHTML = '<i class="fa-light fa-chevron-down"></i> Anzeigen';
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        // Ensure body scroll is unlocked if modal was open
        this.unlockBodyScroll();
        
        // Remove event listeners
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('is-open');
        }
        super.destroy();
    }

    /**
     * Reinitialize section
     */
    reinitialize() {
        this.destroy();
        this.initializePositions();
    }

    /**
     * Static factory method
     */
    static create(containerId, config) {
        return new PositionsSection(config, containerId);
    }
};
