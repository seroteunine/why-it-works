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

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initAnswerReveal();
});
