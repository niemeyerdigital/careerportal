/**
 * Positions Section (SectionPositions)
 * Light, filterable job list (grid/list) + details modal
 * - Targets ClickFunnels containers:
 *   div[data-title='SectionPositions'] and div[data-title='RowPositions']
 * - Uses your root CSS variables (Inter, brand oranges, etc.)
 * - Zero React. Vanilla JS, extends BaseSec (like your other sections)
 */

window.PositionsSection = class PositionsSection extends window.BaseSec {
  constructor(config, containerId) {
    super(config, containerId);
    this.state = {
      view: 'grid',
      search: '',
      bereich: '',
      art: '',
      region: '',
      zeitraum: 'Alle',
      active: null
    };
    this.activeData = [];
    this.filtered = [];
    this.initializePositions();
  }

  initializePositions() {
    if (!this.container) return;
    // Normalize + filter enabled cards only (status === 'on')
    this.activeData = (this.config.items || []).filter(c => c.status === 'on');
    this.render();
    this.setupEvents();
  }

  // ---------- Render ----------
  render() {
    const html = `
      <div class="positions-wrapper">
        <div class="positions-container">
          <!-- Header -->
          <header class="positions-header">
            <div>
              <h1 class="positions-title">Karriereportal</h1>
              <p class="positions-sub">Finde die passende Position und bewirb dich direkt.</p>
            </div>

            <div class="positions-view view-switcher">
              <span class="switcher-label">Ansicht</span>
              <button class="switcher-btn" data-view="grid" aria-pressed="${this.state.view==='grid'}"> 
                <i class="fa-light fa-grid-2"></i> Grid
              </button>
              <button class="switcher-btn" data-view="list" aria-pressed="${this.state.view==='list'}">
                <i class="fa-light fa-list"></i> Liste
              </button>
            </div>
          </header>

          <!-- Filters -->
          <section class="positions-filters">
            <div class="f-item">
              <div class="f-label"><i class="fa-light fa-magnifying-glass"></i> Suche</div>
              <input id="posSearch" class="f-input" placeholder="Titel, Bereich oder Stadt …" />
            </div>
            <div class="f-item">
              <div class="f-label"><i class="fa-light fa-layer-group"></i> Bereich</div>
              <select id="posBereich" class="f-select">
                ${this.optionsHTML(this.unique(this.activeData.map(c=>c.area)))}
              </select>
            </div>
            <div class="f-item">
              <div class="f-label"><i class="fa-light fa-briefcase"></i> Anstellungsart</div>
              <select id="posArt" class="f-select">
                ${this.optionsHTML(this.unique(this.activeData.flatMap(c=>c.workCapacity)))}
              </select>
            </div>
            <div class="f-item">
              <div class="f-label"><i class="fa-light fa-location-dot"></i> Stadt</div>
              <select id="posRegion" class="f-select">
                ${this.optionsHTML(this.unique(this.activeData.map(c=>c.region)))}
              </select>
            </div>
            <div class="f-item">
              <div class="f-label"><i class="fa-light fa-calendar"></i> Zeitraum</div>
              <select id="posZeitraum" class="f-select">
                ${['Alle','Letzte 7 Tage','Letzte 30 Tage'].map(v=>`<option${v===this.state.zeitraum?' selected':''}>${v}</option>`).join('')}
              </select>
            </div>
          </section>

          <!-- Count -->
          <div class="positions-count" id="posCount"></div>

          <!-- Cards -->
          <div id="posCards" class="${this.state.view==='grid' ? 'cards-grid' : 'cards-list'}"></div>
        </div>
      </div>

      <!-- Modal -->
      <div id="posModal" class="pos-modal" aria-hidden="true">
        <div class="pos-modal-backdrop" data-close="modal"></div>
        <div class="pos-modal-dialog">
          <div class="pos-modal-header">
            <h3 id="posModalTitle"></h3>
            <button class="pos-close" data-close="modal" aria-label="Modal schließen"><i class="fa-light fa-xmark"></i></button>
          </div>
          <div class="pos-modal-tags" id="posModalTags"></div>
          <div class="pos-modal-body" id="posModalBody"></div>
          <div class="pos-modal-footer">
            <div class="pos-modal-actions">
              <div data-title="MainButton1" id="posApplyBtnWrap"></div>
              <button class="btn-secondary" data-close="modal"><i class="fa-light fa-xmark"></i> Schließen</button>
            </div>
            <div class="pos-modal-meta" id="posModalMeta"></div>
          </div>
        </div>
      </div>
    `;
    this.container.innerHTML = html;

    // After root render, compute filtered+paint cards
    this.applyFilters();
  }

  optionsHTML(values) {
    const opts = ['Alle', ...values];
    return opts.map(v => `<option value="${v==='Alle'?'':this.escape(v)}">${this.escape(v)}</option>`).join('');
  }

  // ---------- Filtering ----------
  applyFilters() {
    const { search, bereich, art, region, zeitraum } = this.state;
    const q = (search||'').toLowerCase();
    const within = (d) => {
      if (zeitraum==='Alle') return true;
      const diff = this.daysSince(d);
      if (zeitraum==='Letzte 7 Tage') return diff<=7;
      if (zeitraum==='Letzte 30 Tage') return diff<=30;
      return true;
    };
    const ensureMWD = (t)=>t.toLowerCase().includes('(m/w/d)')?t:`${t} (m/w/d)`;

    this.filtered = this.activeData
      .filter(c => !bereich || c.area === bereich)
      .filter(c => !art || (c.workCapacity||[]).includes(art))
      .filter(c => !region || c.region === region)
      .filter(c => within(c.datum))
      .filter(c => !q || ensureMWD(c.position).toLowerCase().includes(q) || c.area.toLowerCase().includes(q) || c.region.toLowerCase().includes(q))
      .sort((a,b)=>this.parseDE(b.datum)-this.parseDE(a.datum));

    // Count
    const countEl = this.container.querySelector('#posCount');
    if (countEl) countEl.textContent = `${this.filtered.length} ${this.filtered.length===1?'Position':'Positionen'} gefunden`;

    // Paint cards
    const cardsEl = this.container.querySelector('#posCards');
    cardsEl.className = this.state.view==='grid' ? 'cards-grid' : 'cards-list';
    cardsEl.innerHTML = this.filtered.map(c=>this.cardHTML(c)).join('');

    // Wire card buttons
    cardsEl.querySelectorAll('[data-action="apply"]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = this.filtered.find(x=>x.id===id);
        if (item) window.open(item.applicationUrl,'_blank');
      });
    });
    cardsEl.querySelectorAll('[data-action="quick"]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = this.filtered.find(x=>x.id===id);
        if (item) this.openModal(item);
      });
    });
    cardsEl.querySelectorAll('.pos-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const id = card.getAttribute('data-id');
        const item = this.filtered.find(x=>x.id===id);
        if (item) this.openModal(item);
      });
    });
  }

  cardHTML(c){
    const ensureMWD = (t)=>t.toLowerCase().includes('(m/w/d)')?t:`${t} (m/w/d)`;
    const tags = [
      `<span class="pill pill-accent"><i class="fa-light fa-location-dot"></i>${this.escape(c.region)}</span>`,
      `<span class="pill"><i class="fa-light fa-layer-group"></i>${this.escape(c.area)}</span>`,
      ...(c.workCapacity||[]).map(w=>`<span class="pill"><i class="fa-light fa-briefcase"></i>${this.escape(w)}</span>`),
      (c.startDateVisible?`<span class="pill"><i class="fa-light fa-calendar"></i>Start: ${this.escape(c.startDate)}</span>`:'')
    ].join('');

    return `
      <article class="pos-card" data-id="${this.escape(c.id)}">
        <div class="pos-card-head">
          <h3 class="pos-card-title">${this.escape(ensureMWD(c.position))}</h3>
          <div class="pos-card-date">
            <div>${this.escape(c.datum)}</div>
            <div class="muted">vor ${this.daysSince(c.datum)} Tagen</div>
          </div>
        </div>
        <div class="pos-card-tags">${tags}</div>
        <div class="pos-card-actions">
          <div data-title="MainButton1">
            <a data-action="apply" data-id="${this.escape(c.id)}"><i class="fa-light fa-paper-plane"></i> Jetzt bewerben</a>
          </div>
          <button class="btn-secondary" data-action="quick" data-id="${this.escape(c.id)}"><i class="fa-light fa-eye"></i> Schnellansicht</button>
        </div>
      </article>
    `;
  }

  // ---------- Modal ----------
  openModal(item){
    this.state.active = item;
    const ensureMWD = (t)=>t.toLowerCase().includes('(m/w/d)')?t:`${t} (m/w/d)`;

    const title = this.container.querySelector('#posModalTitle');
    const tags = this.container.querySelector('#posModalTags');
    const body = this.container.querySelector('#posModalBody');
    const meta = this.container.querySelector('#posModalMeta');
    const wrap = this.container.querySelector('#posApplyBtnWrap');

    if (title) title.textContent = ensureMWD(item.position);

    if (tags) {
      tags.innerHTML = [
        `<span class="pill pill-accent"><i class="fa-light fa-location-dot"></i>${this.escape(item.region)}</span>`,
        ...(item.workCapacity||[]).map(w=>`<span class="pill"><i class="fa-light fa-briefcase"></i>${this.escape(w)}</span>`),
        (item.startDateVisible?`<span class="pill"><i class="fa-light fa-calendar"></i>Start: ${this.escape(item.startDate)}</span>`:'')
      ].join('');
    }

    body.innerHTML = `
      ${this.blockHTML('Erforderliche Qualifikationen','fa-badge-check',(item.qualifications?.mandatory||[]))}
      ${this.blockHTML('Wünschenswerte Qualifikationen','fa-stars',(item.qualifications?.optional||[]))}
      ${this.blockHTML('Aufgaben','fa-list-check',(item.tasks||[]))}
      ${this.blockHTML('Benefits','fa-gift',(item.benefits||[]))}
    `;

    if (meta) meta.textContent = `Veröffentlicht am ${item.datum} · vor ${this.daysSince(item.datum)} Tagen`;

    // Insert CTA using ButtonManager if present
    wrap.innerHTML = '';
    if (window.ButtonManager) {
      const bm = new window.ButtonManager();
      const btn = bm.createButton('MainButton1', {
        text: 'Jetzt bewerben',
        href: item.applicationUrl,
        icon: 'fas fa-paper-plane',
        id: 'posApplyBtn'
      });
      wrap.appendChild(btn);
    } else {
      wrap.innerHTML = `<a class="btn-primary-fallback" href="${this.escape(item.applicationUrl)}" target="_blank">Jetzt bewerben <i class="fas fa-paper-plane"></i></a>`;
    }

    const modal = this.container.querySelector('#posModal');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  blockHTML(title, icon, items){
    if (!items || !items.length) return '';
    return `
      <section class="pos-block">
        <header class="pos-block-head"><i class="fa-light ${icon}"></i><h4>${this.escape(title)}</h4></header>
        <ul class="pos-block-list">
          ${items.map(it=>`<li><i class="fa-light fa-circle-small"></i>${this.escape(it)}</li>`).join('')}
        </ul>
      </section>
    `;
  }

  closeModal(){
    const modal = this.container.querySelector('#posModal');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    this.state.active = null;
  }

  // ---------- Events ----------
  setupEvents(){
    // Parent ClickFunnels containers (no body-level hooks)
    this.attachFilterHandlers();
    this.attachViewHandlers();

    // Modal close
    this.container.querySelectorAll('[data-close="modal"]').forEach(el=>{
      el.addEventListener('click', ()=>this.closeModal());
    });

    // ESC close
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape' && this.state.active) this.closeModal();
    });
  }

  attachFilterHandlers(){
    const s = this.container.querySelector('#posSearch');
    const b = this.container.querySelector('#posBereich');
    const a = this.container.querySelector('#posArt');
    const r = this.container.querySelector('#posRegion');
    const z = this.container.querySelector('#posZeitraum');

    const set = () => {
      this.state.search = s.value || '';
      this.state.bereich = b.value || '';
      this.state.art = a.value || '';
      this.state.region = r.value || '';
      this.state.zeitraum = z.value || 'Alle';
      this.applyFilters();
    };

    [s,b,a,r,z].forEach(el=>{
      if (!el) return;
      el.addEventListener('input', set);
      el.addEventListener('change', set);
    });
  }

  attachViewHandlers(){
    this.container.querySelectorAll('.switcher-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        this.state.view = btn.getAttribute('data-view');
        this.applyFilters();
        this.container.querySelectorAll('.switcher-btn').forEach(b=>{
          b.classList.toggle('is-active', b===btn);
          b.setAttribute('aria-pressed', b===btn ? 'true':'false');
        });
      });
    });
  }

  // ---------- Utils ----------
  unique(arr){ return Array.from(new Set(arr || [])).filter(Boolean).sort(); }
  escape(str){ return (str??'').toString().replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s])); }
  parseDE(ddmmyyyy){ const [dd,mm,yy]= (ddmmyyyy||'').split('.').map(Number); return new Date(yy||1970,(mm||1)-1,dd||1).getTime(); }
  daysSince(d){ const diff = Date.now() - this.parseDE(d); return Math.max(0, Math.floor(diff / 86400000)); }

  // Optional: metrics (kept consistent with your style)
  getMetrics(){
    return {
      sectionType: 'positions',
      totalActive: this.activeData.length,
      totalFiltered: this.filtered.length,
      view: this.state.view,
      isVisible: this.isInViewport(this.container)
    };
  }

  // Validation hook (lightweight; full schema lives in ConfigValidator)
  validateConfig(){
    if (!Array.isArray(this.config.items)) {
      console.error('Positions section: config.items must be an array');
      return false;
    }
    return super.validateConfig();
  }

  // Responsive tweak
  onResize() {/* nothing special required */}
};
