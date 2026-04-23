/* ==============================================
   SILVINA BETARTE · PORTFOLIO SPA
   app.js — Navigation, Menu, Form, Preview
   ============================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  App.init();
});

/* ── HOVER PREVIEW CONTENT ── */
const PREVIEWS = {
  perfil: {
    icon: 'user-round', title: 'Perfil', sub: 'Sobre Silvina Betarte',
    html: `
      <div class="pv-stats">
        <div class="pv-stat"><span class="pv-stat__n">10+</span><span class="pv-stat__l">Años</span></div>
        <div class="pv-stat"><span class="pv-stat__n">50+</span><span class="pv-stat__l">Proyectos</span></div>
        <div class="pv-stat"><span class="pv-stat__n">A11y</span><span class="pv-stat__l">WCAG</span></div>
      </div>
      <div class="pv-tags">
        <span class="pv-tag">Figma</span><span class="pv-tag">FlutterFlow</span>
        <span class="pv-tag">Scrum</span><span class="pv-tag">UX Research</span>
      </div>`
  },
  trabajo: {
    icon: 'briefcase', title: 'Trabajo', sub: 'Experiencia profesional',
    html: `
      <div class="pv-item"><div class="pv-dot"></div>
        <div class="pv-text"><strong>Freelance · 2022–Hoy</strong>Alianza de Pacientes Uruguay</div>
      </div>
      <div class="pv-item"><div class="pv-dot pv-dot--blue"></div>
        <div class="pv-text"><strong>Telefónica · 2019–2025</strong>UX/UI Lead & Coordinadora</div>
      </div>
      <div class="pv-item"><div class="pv-dot pv-dot--amber"></div>
        <div class="pv-text"><strong>Telefónica · 2012–2019</strong>Diseñadora Web & Gráfica</div>
      </div>`
  },
  formacion: {
    icon: 'graduation-cap', title: 'Formación', sub: 'Títulos y certificaciones',
    html: `
      <div class="pv-bar-row"><div class="pv-bar-lbl">Experto UX/UI · ITBA</div>
        <div class="pv-bar"><div class="pv-bar__fill" style="width:95%"></div></div>
      </div>
      <div class="pv-bar-row"><div class="pv-bar-lbl">Scrum Master Padawan</div>
        <div class="pv-bar"><div class="pv-bar__fill" style="width:90%"></div></div>
      </div>
      <div class="pv-bar-row"><div class="pv-bar-lbl">Desarrollo de Apps · CoderHose</div>
        <div class="pv-bar"><div class="pv-bar__fill" style="width:70%"></div></div>
      </div>
      <div class="pv-bar-row"><div class="pv-bar-lbl">Desarrollo Web PHP & MySQL</div>
        <div class="pv-bar"><div class="pv-bar__fill" style="width:85%"></div></div>
      </div>`
  },
  contacto: {
    icon: 'send', title: 'Contacto', sub: 'Disponible para proyectos',
    html: `
      <div class="pv-item"><div class="pv-dot"></div>
        <div class="pv-text"><strong>Email</strong>silvinabetarte@gmail.com</div>
      </div>
      <div class="pv-item"><div class="pv-dot pv-dot--blue"></div>
        <div class="pv-text"><strong>LinkedIn</strong>silvina-betarte-ux-ui</div>
      </div>
      <div class="pv-item"><div class="pv-dot pv-dot--green"></div>
        <div class="pv-text"><strong>Ubicación</strong>Uruguay · Remoto global</div>
      </div>`
  }
};

const App = {
  /* State */
  section:   'perfil',
  menuOpen:  false,
  formOpen:  false,
  pvTimer:   null,

  /* DOM */
  shell:      null,
  sideMenu:   null,
  hamburger:  null,
  overlay:    null,
  tabs:       null,
  sideItems:  null,
  pages:      null,
  topTitle:   null,
  hoverPv:    null,
  openFormBtn:null,
  cfWrap:     null,
  cfSubmit:   null,
  cfStatus:   null,

  init() {
    this.shell       = document.getElementById('appShell');
    this.sideMenu    = document.getElementById('sideMenu');
    this.hamburger   = document.getElementById('hamburgerBtn');
    this.overlay     = document.getElementById('overlay');
    this.tabs        = document.querySelectorAll('.tab');
    this.sideItems   = document.querySelectorAll('.smenu-item');
    this.pages       = document.querySelectorAll('.page');
    this.topTitle    = document.getElementById('topBarTitle');
    this.hoverPv     = document.getElementById('hoverPreview');
    this.openFormBtn = document.getElementById('openFormBtn');
    this.cfWrap      = document.getElementById('contactForm');
    this.cfSubmit    = document.getElementById('cfSubmitBtn');
    this.cfStatus    = document.getElementById('cfStatus');

    this.bindEvents();
  },

  /* ── EVENTS ── */
  bindEvents() {
    /* Hamburger */
    this.hamburger.addEventListener('click', () => this.toggleMenu());

    /* Overlay tap closes menu */
    this.overlay.addEventListener('click', () => this.closeMenu());

    /* Tab bar */
    this.tabs.forEach(btn =>
      btn.addEventListener('click', () => {
        this.navigateTo(btn.dataset.section);
        this.closeMenu();
      })
    );

    /* Side menu items */
    this.sideItems.forEach(btn =>
      btn.addEventListener('click', () => {
        this.navigateTo(btn.dataset.section);
        if (window.innerWidth < 768) setTimeout(() => this.closeMenu(), 180);
      })
    );

    /* Sidebar "Disponible" button → go to contacto */
    const sideAvail = document.getElementById('availSidebarBtn');
    if (sideAvail) {
      sideAvail.addEventListener('click', () => {
        this.navigateTo('contacto');
        if (window.innerWidth < 768) setTimeout(() => this.closeMenu(), 220);
        /* Also open form after nav animation */
        setTimeout(() => this.openForm(), 400);
      });
    }

    /* Contact form toggle */
    if (this.openFormBtn) {
      this.openFormBtn.addEventListener('click', () => this.toggleForm());
    }

    /* Form submit */
    if (this.cfSubmit) {
      this.cfSubmit.addEventListener('click', () => this.submitForm());
    }

    /* Hover previews on sidebar items (desktop only) */
    this.sideItems.forEach(btn => {
      btn.addEventListener('mouseenter', () => this.showPreview(btn));
      btn.addEventListener('mouseleave', () => this.scheduleHidePreview());
    });
    if (this.hoverPv) {
      this.hoverPv.addEventListener('mouseenter', () => clearTimeout(this.pvTimer));
      this.hoverPv.addEventListener('mouseleave', () => this.scheduleHidePreview());
    }

    /* Keyboard */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (this.menuOpen) this.closeMenu();
        if (this.formOpen) this.closeForm();
      }
    });

    /* Swipe (mobile) */
    this.initSwipe();
  },

  /* ── MENU ── */
  toggleMenu() {
    if (window.innerWidth >= 768) return; /* desktop: sidebar always visible */
    this.menuOpen ? this.closeMenu() : this.openMenu();
  },

  openMenu() {
    this.menuOpen = true;
    document.body.classList.add('menu-open');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.hamburger.setAttribute('aria-label', 'Cerrar menú');
  },

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('menu-open');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.hamburger.setAttribute('aria-label', 'Abrir menú');
  },

  /* ── NAVIGATION ── */
  navigateTo(id) {
    if (id === this.section) {
      if (id === 'contacto') { /* allow re-navigating to contact to open form */ }
      else return;
    }

    /* Hide current */
    const cur = document.getElementById(`page-${this.section}`);
    if (cur) cur.classList.remove('active');

    /* Show next */
    const next = document.getElementById(`page-${id}`);
    if (next) {
      next.classList.add('active');
      /* Re-trigger animation */
      next.style.animation = 'none';
      next.offsetHeight; /* reflow */
      next.style.animation = '';
    }

    this.section = id;

    /* Sync tabs */
    this.tabs.forEach(btn => {
      const a = btn.dataset.section === id;
      btn.classList.toggle('active', a);
      btn.setAttribute('aria-selected', String(a));
    });

    /* Sync side items */
    this.sideItems.forEach(btn => {
      const a = btn.dataset.section === id;
      btn.classList.toggle('active', a);
      btn.setAttribute('aria-current', a ? 'page' : 'false');
    });

    /* Update top bar title */
    if (next) this.topTitle.textContent = next.dataset.title || id;

    /* Scroll content to top */
    const c = document.getElementById('contentArea');
    if (c) c.scrollTop = 0;

    /* Re-init icons in new section */
    lucide.createIcons();
  },

  /* ── CONTACT FORM ── */
  toggleForm() {
    this.formOpen ? this.closeForm() : this.openForm();
  },

  openForm() {
    this.formOpen = true;
    this.cfWrap.classList.add('open');
    this.cfWrap.setAttribute('aria-hidden', 'false');
    this.openFormBtn.classList.add('open');
    this.openFormBtn.setAttribute('aria-expanded', 'true');
    lucide.createIcons();
    setTimeout(() => this.cfWrap.scrollIntoView({ behavior:'smooth', block:'nearest' }), 120);
  },

  closeForm() {
    this.formOpen = false;
    this.cfWrap.classList.remove('open');
    this.cfWrap.setAttribute('aria-hidden', 'true');
    this.openFormBtn.classList.remove('open');
    this.openFormBtn.setAttribute('aria-expanded', 'false');
  },

  submitForm() {
    const name    = document.getElementById('cf-name')?.value.trim()    || '';
    const email   = document.getElementById('cf-email')?.value.trim()   || '';
    const subject = document.getElementById('cf-subject')?.value.trim() || '';
    const message = document.getElementById('cf-message')?.value.trim() || '';

    /* Validate */
    if (!name || !email || !message) {
      this.setStatus('error', 'alert-circle', 'Por favor completá nombre, email y mensaje.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.setStatus('error', 'alert-circle', 'El email no parece válido.');
      return;
    }

    /* Build mailto */
    const to   = 'silvinabetarte_@outlook.com';
    const sub  = encodeURIComponent(subject || `Contacto desde Portfolio — ${name}`);
    const body = encodeURIComponent(
      `Hola Silvina,\n\nMi nombre es ${name} (${email}).\n\n${message}\n\n— Enviado desde tu portfolio`
    );

    this.cfSubmit.disabled = true;
    this.cfSubmit.innerHTML = '<i data-lucide="loader"></i> Abriendo cliente de correo…';
    lucide.createIcons({ nodes:[this.cfSubmit] });

    setTimeout(() => {
      window.location.href = `mailto:${to}?subject=${sub}&body=${body}`;
      this.cfSubmit.disabled = false;
      this.cfSubmit.innerHTML = '<i data-lucide="send"></i> Enviar mensaje';
      lucide.createIcons({ nodes:[this.cfSubmit] });
      this.setStatus('success', 'check-circle', '¡Listo! Se abrió tu cliente de correo con el mensaje.');
      ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 700);
  },

  setStatus(type, icon, text) {
    if (!this.cfStatus) return;
    this.cfStatus.className = `cf-status ${type}`;
    this.cfStatus.innerHTML = `<i data-lucide="${icon}"></i>${text}`;
    lucide.createIcons({ nodes:[this.cfStatus] });
    setTimeout(() => { this.cfStatus.className = 'cf-status'; this.cfStatus.innerHTML = ''; }, 7000);
  },

  /* ── HOVER PREVIEW ── */
  showPreview(btn) {
    if (window.innerWidth < 768) return;
    clearTimeout(this.pvTimer);

    const id   = btn.dataset.section;
    const data = PREVIEWS[id];
    if (!data || !this.hoverPv) return;

    /* Position: center on hovered button */
    const rect   = btn.getBoundingClientRect();
    const midY   = rect.top + rect.height / 2;
    const panelH = 260;
    const margin = 16;
    const topPx  = Math.max(margin + panelH / 2, Math.min(window.innerHeight - margin - panelH / 2, midY));

    /* Snap position, then transition in */
    this.hoverPv.style.cssText = `top:${topPx}px; transition:none; opacity:0; transform:translateY(-50%) translateX(-10px);`;
    this.hoverPv.classList.remove('show');

    this.hoverPv.innerHTML = `
      <div class="hover-preview__head">
        <div class="hover-preview__ico"><i data-lucide="${data.icon}"></i></div>
        <div>
          <div class="hover-preview__title">${data.title}</div>
          <div class="hover-preview__sub">${data.sub}</div>
        </div>
      </div>
      <div class="hover-preview__body">${data.html}</div>`;

    lucide.createIcons({ nodes:[this.hoverPv] });

    /* Two rAF to ensure browser registers starting state before transition */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.hoverPv.style.cssText = `top:${topPx}px;`;
      this.hoverPv.classList.add('show');
    }));
  },

  scheduleHidePreview() {
    this.pvTimer = setTimeout(() => {
      if (!this.hoverPv) return;
      this.hoverPv.classList.remove('show');
    }, 100);
  },

  /* ── SWIPE (mobile) ── */
  initSwipe() {
    let sx = 0, sy = 0;
    document.addEventListener('touchstart', e => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, { passive:true });

    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx > 60 && sx < 30 && !this.menuOpen)  this.openMenu();
      if (dx < -60 && this.menuOpen)              this.closeMenu();
    }, { passive:true });
  }
};