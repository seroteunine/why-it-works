/* ============================================================
   Why It Works — Shared Script
   script.js
   ============================================================ */

const CHAPTERS = [
  { href: 'index.html',       label: 'Cover' },
  { href: 'intro.html',       label: 'Introduction' },
  { href: 'chapter-01.html',  label: '1. Voltage, Current & Resistance' },
  { href: 'chapter-02.html',  label: '2. What a Circuit Actually Is' },
  { href: 'chapter-03.html',  label: '3. Series vs Parallel' },
  { href: 'chapter-04.html',  label: '4. Power and Heat' },
  { href: 'chapter-05.html',  label: '5. AC vs DC' },
  { href: 'chapter-06.html',  label: '6. The Multimeter' },
  { href: 'chapter-07.html',  label: '7. Switches and Fuses' },
  { href: 'chapter-08.html',  label: '8. Thermal Protection' },
  { href: 'chapter-09.html',  label: '9. Motors' },
  { href: 'chapter-10.html',  label: '10. Reading a Circuit Diagram' },
  { href: 'chapter-11.html',  label: '11. Capacitors' },
  { href: 'chapter-12.html',  label: '12. Systematic Fault Diagnosis' },
  { href: 'appendix.html',    label: 'Reference Appendix' },
];

/* ---- Build navigation ---- */
function buildNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  // Sidebar
  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';
  sidebar.setAttribute('aria-label', 'Course navigation');

  const inner = document.createElement('div');
  inner.className = 'sidebar-inner';

  inner.innerHTML = `
    <div class="sidebar-brand">
      <a href="index.html">
        <span class="brand-title">Why It Works</span>
        <span class="brand-sub">Electronics Fundamentals<br>for Repair Cafe Volunteers</span>
      </a>
    </div>
    <ul class="nav-list" id="nav-list" role="list"></ul>
  `;
  sidebar.appendChild(inner);
  document.body.insertBefore(sidebar, document.body.firstChild);

  // Mobile top bar
  const mobileBar = document.createElement('div');
  mobileBar.className = 'mobile-nav-bar';
  mobileBar.setAttribute('role', 'banner');
  mobileBar.innerHTML = `
    <a href="index.html" class="mobile-brand">Why It Works</a>
    <button class="hamburger" id="hamburger" aria-label="Open navigation" aria-expanded="false" aria-controls="sidebar">
      <span></span><span></span><span></span>
    </button>
  `;
  document.body.insertBefore(mobileBar, document.body.firstChild);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebar-overlay';
  document.body.appendChild(overlay);

  // Populate nav list
  const list = document.getElementById('nav-list');
  let sectionOpen = false;

  CHAPTERS.forEach((ch, i) => {
    // Section labels
    if (i === 2) {
      const li = document.createElement('li');
      li.innerHTML = '<span class="nav-section-label">Chapters</span>';
      list.appendChild(li);
      sectionOpen = true;
    }
    if (ch.href === 'appendix.html' && sectionOpen) {
      const li = document.createElement('li');
      li.innerHTML = '<span class="nav-section-label">Reference</span>';
      list.appendChild(li);
      sectionOpen = false;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = ch.href;
    a.textContent = ch.label;
    if (ch.href === current) a.classList.add('active');
    li.appendChild(a);
    list.appendChild(li);
  });

  // Hamburger logic
  const hamburger = document.getElementById('hamburger');
  const sidebarEl  = document.getElementById('sidebar');
  const overlayEl  = document.getElementById('sidebar-overlay');

  function openNav() {
    sidebarEl.classList.add('open');
    overlayEl.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    sidebarEl.classList.remove('open');
    overlayEl.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    sidebarEl.classList.contains('open') ? closeNav() : openNav();
  });

  overlayEl.addEventListener('click', closeNav);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebarEl.classList.contains('open')) closeNav();
  });
}

/* ---- Answer reveal ---- */
function initAnswerReveal() {
  document.querySelectorAll('.question-item').forEach(item => {
    const prompt = item.querySelector('.question-prompt');
    const answer = item.querySelector('.question-answer');
    const reveal = item.querySelector('.question-reveal');

    if (!prompt || !answer) return;

    prompt.addEventListener('click', () => {
      const isOpen = answer.classList.contains('open');
      answer.classList.toggle('open', !isOpen);
      if (reveal) reveal.textContent = isOpen ? 'Show answer' : 'Hide answer';
      prompt.setAttribute('aria-expanded', String(!isOpen));
    });

    prompt.setAttribute('aria-expanded', 'false');
    prompt.setAttribute('role', 'button');
    prompt.setAttribute('tabindex', '0');

    prompt.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        prompt.click();
      }
    });
  });
}

/* ---- Ohm's Law Demo ---- */
function initOhmDemo() {
  const demo = document.getElementById('ohm-demo');
  if (!demo) return;

  const V = 230;
  let R = 25;

  const fmtV = v => Math.round(v) + '\u202fV';
  const fmtI = i => i.toFixed(1) + '\u202fA';
  const fmtR = r => Math.round(r) + '\u202f\u03a9';

  function lerpColor(a, b, t) {
    const ah = parseInt(a.slice(1),16), bh = parseInt(b.slice(1),16);
    return '#'+[16,8,0].map(s => {
      const av = ah>>s & 0xff, bv = bh>>s & 0xff;
      return Math.round(av + t*(bv-av)).toString(16).padStart(2,'0');
    }).join('');
  }

  function render() {
    const I = V / R;
    const heat = Math.min(1, I / 15);
    const color = heat < 0.5
      ? lerpColor('#8a8a8a','#f8c11a', heat*2)
      : lerpColor('#f8c11a','#e85d04', (heat-0.5)*2);

    // Circuit visuals
    const el   = document.getElementById('ohm-element');
    const glow = document.getElementById('ohm-element-glow');
    const flow = document.getElementById('ohm-flow-path');
    if (el)   el.style.fill = color;
    if (glow) { glow.style.fill = color; glow.style.opacity = (heat*0.7).toFixed(2); }
    if (flow) flow.style.animationDuration = Math.max(0.25, 5 / Math.max(0.1, I)) + 's';

    const rl = document.getElementById('ohm-r-label');
    const il = document.getElementById('ohm-i-label');
    if (rl) rl.textContent = fmtR(R);
    if (il) il.textContent = fmtI(I);

    // Slider row values
    const rRow = demo.querySelector('[data-ohm="R"]');
    if (rRow) rRow.querySelector('.ohm-val').textContent = fmtR(R);

    const iRow = demo.querySelector('[data-ohm="I"]');
    if (iRow) {
      iRow.querySelector('.ohm-val').textContent = fmtI(I);
      const fill = iRow.querySelector('.ohm-bar-fill');
      if (fill) fill.style.width = Math.min(100, I / 20 * 100) + '%';
    }

    // Formula bar
    const fV = demo.querySelector('.ohm-f-V');
    const fI = demo.querySelector('.ohm-f-I');
    const fR = demo.querySelector('.ohm-f-R');
    if (fV) fV.textContent = fmtV(V);
    if (fI) fI.textContent = fmtI(I);
    if (fR) fR.textContent = fmtR(R);
  }

  demo.querySelector('[data-ohm="R"] .ohm-slider')?.addEventListener('input', e => {
    R = parseFloat(e.target.value);
    render();
  });

  render();
}

/* ---- Circuit Demo ---- */
function initCircuitDemo() {
  if (!document.getElementById('svg-series')) return;

  const SERIES_IDS   = ['s0','s1','s2','s3'];
  const PARALLEL_IDS = ['p0','p1','p2','p3'];
  const COMBINED_IDS = ['c_m0','c_a0','c_a1','c_b0','c_b1'];

  const seriesBroken   = new Set();
  const parallelBroken = new Set();
  const combinedBroken = new Set();

  function renderSeries() {
    const anyBroken = seriesBroken.size > 0;
    document.querySelectorAll('.c-wire-s').forEach(el => el.classList.toggle('c-dead', anyBroken));
    document.querySelectorAll('.c-power-s').forEach(el => el.classList.toggle('c-dead', anyBroken));

    SERIES_IDS.forEach(id => {
      const bulb = document.querySelector(`[data-id="${id}"]`);
      if (!bulb) return;
      bulb.classList.toggle('c-broken', seriesBroken.has(id));
      bulb.classList.toggle('c-dead', !seriesBroken.has(id) && anyBroken);
    });

    const status = document.getElementById('series-status');
    if (!status) return;
    if (!anyBroken) {
      status.textContent = 'Current flows — all bulbs lit';
      status.className = 'circuit-panel-status status-ok';
    } else {
      status.textContent = 'One break — entire circuit dead';
      status.className = 'circuit-panel-status status-fault';
    }
  }

  function renderParallel() {
    const allBroken = parallelBroken.size === PARALLEL_IDS.length;
    document.querySelectorAll('.c-wire-p-rail').forEach(el => el.classList.toggle('c-dead', allBroken));
    document.querySelectorAll('.c-power-p').forEach(el => el.classList.toggle('c-dead', allBroken));

    PARALLEL_IDS.forEach(id => {
      const bulb = document.querySelector(`[data-id="${id}"]`);
      if (!bulb) return;
      const isBroken = parallelBroken.has(id);
      bulb.classList.toggle('c-broken', isBroken);
      bulb.classList.remove('c-dead');
      document.querySelectorAll(`[data-branch="${id}"]`)
        .forEach(el => el.classList.toggle('c-dead', isBroken));
    });

    const status = document.getElementById('parallel-status');
    if (!status) return;
    const n = parallelBroken.size;
    if (n === 0) {
      status.textContent = 'Current flows — all bulbs lit';
      status.className = 'circuit-panel-status status-ok';
    } else if (n < PARALLEL_IDS.length) {
      status.textContent = `${n} bulb${n > 1 ? 's' : ''} broken — others unaffected`;
      status.className = 'circuit-panel-status status-fault';
    } else {
      status.textContent = 'All branches broken';
      status.className = 'circuit-panel-status status-fault';
    }
  }

  function bindBulbs(ids, brokenSet, renderFn) {
    ids.forEach(id => {
      const bulb = document.querySelector(`[data-id="${id}"]`);
      if (!bulb) return;
      const toggle = () => {
        brokenSet.has(id) ? brokenSet.delete(id) : brokenSet.add(id);
        renderFn();
      };
      bulb.addEventListener('click', toggle);
      bulb.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  function renderCombined() {
    const m0b = combinedBroken.has('c_m0');
    const a0b = combinedBroken.has('c_a0');
    const a1b = combinedBroken.has('c_a1');
    const b0b = combinedBroken.has('c_b0');
    const b1b = combinedBroken.has('c_b1');

    const aBroken = a0b || a1b;
    const bBroken = b0b || b1b;

    const mainDead  = m0b || (aBroken && bBroken);
    const aDead     = m0b || aBroken;
    const bDead     = m0b || bBroken;
    const rightDead = aDead && bDead;

    document.querySelectorAll('.c-wire-cm').forEach(el => el.classList.toggle('c-dead', mainDead));
    document.querySelectorAll('.c-power-cm').forEach(el => el.classList.toggle('c-dead', mainDead));
    document.querySelectorAll('.c-wire-ca').forEach(el => el.classList.toggle('c-dead', aDead));
    document.querySelectorAll('.c-wire-cb').forEach(el => el.classList.toggle('c-dead', bDead));
    document.querySelectorAll('.c-wire-cr').forEach(el => el.classList.toggle('c-dead', rightDead));

    const bulbStates = {
      'c_m0': { broken: m0b, dead: !m0b && aBroken && bBroken },
      'c_a0': { broken: a0b, dead: !a0b && (m0b || a1b) },
      'c_a1': { broken: a1b, dead: !a1b && (m0b || a0b) },
      'c_b0': { broken: b0b, dead: !b0b && (m0b || b1b) },
      'c_b1': { broken: b1b, dead: !b1b && (m0b || b0b) },
    };
    Object.entries(bulbStates).forEach(([id, s]) => {
      const bulb = document.querySelector(`[data-id="${id}"]`);
      if (!bulb) return;
      bulb.classList.toggle('c-broken', s.broken);
      bulb.classList.toggle('c-dead', s.dead);
    });

    const status = document.getElementById('combined-status');
    if (!status) return;
    if (!combinedBroken.size) {
      status.textContent = 'Current flows — all five bulbs lit';
      status.className = 'circuit-panel-status status-ok';
    } else if (m0b) {
      status.textContent = 'Series fault — entire circuit dead';
      status.className = 'circuit-panel-status status-fault';
    } else if (aBroken && bBroken) {
      status.textContent = 'Both branches open — circuit dead';
      status.className = 'circuit-panel-status status-fault';
    } else if (aBroken) {
      status.textContent = 'Branch A open — branch B still lit';
      status.className = 'circuit-panel-status status-fault';
    } else {
      status.textContent = 'Branch B open — branch A still lit';
      status.className = 'circuit-panel-status status-fault';
    }
  }

  bindBulbs(SERIES_IDS,   seriesBroken,   renderSeries);
  bindBulbs(PARALLEL_IDS, parallelBroken, renderParallel);
  bindBulbs(COMBINED_IDS, combinedBroken, renderCombined);

  document.getElementById('circuit-reset')?.addEventListener('click', () => {
    seriesBroken.clear();
    parallelBroken.clear();
    combinedBroken.clear();
    renderSeries();
    renderParallel();
    renderCombined();
  });

  renderSeries();
  renderParallel();
  renderCombined();
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initAnswerReveal();
  initOhmDemo();
  initCircuitDemo();
});
