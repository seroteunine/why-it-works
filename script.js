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

/* ---- Multimeter Simulator ---- */
function initMeterSim() {
  const demo = document.getElementById('meter-sim');
  if (!demo) return;

  const screenBg = document.getElementById('meter-screen-bg');
  const screenText = document.getElementById('meter-screen-text');
  const screenSubtext = document.getElementById('meter-screen-subtext');
  const readingEl = document.getElementById('meter-sim-reading');
  const summaryEl = document.getElementById('meter-sim-summary');
  const noteEl = document.getElementById('meter-sim-note');
  const resultEl = document.getElementById('meter-sim-result');
  const sceneCaptionEl = document.getElementById('meter-scene-caption');

  const blackProbe = document.getElementById('meter-black-probe');
  const redProbe = document.getElementById('meter-red-probe');
  const blackGlow = document.getElementById('meter-black-probe-glow');
  const redGlow = document.getElementById('meter-red-probe-glow');
  const blackLead = document.getElementById('meter-black-lead');
  const redLead = document.getElementById('meter-red-lead');

  const sceneTabs = demo.querySelectorAll('[data-meter-scene]');
  const sceneGroups = demo.querySelectorAll('[data-meter-scene-group]');
  const modeGroups = demo.querySelectorAll('[data-meter-mode]');
  const redSockets = {
    vohm: document.getElementById('meter-red-socket-vohm'),
    amps: document.getElementById('meter-red-socket-amps'),
  };

  const sceneData = {
    socket: {
      caption: 'Live wall socket: measure between live and neutral.',
      blackPos: { x: 589, y: 187 },
      redPos: { x: 546, y: 187 },
      evaluate(mode, socket) {
        if (mode === 'amps' && socket === 'amps') {
          return danger('SHORT', 'This would put the ammeter almost directly across live and neutral. Best case: the meter fuse blows. Worst case: the meter fails violently.', 'Current mode is only for measurements made in series with the circuit.');
        }
        if ((mode === 'ohms' || mode === 'cont') && socket === 'vohm') {
          return danger('LIVE?', 'Resistance or continuity mode on a live socket can damage the meter because the meter is trying to inject its own test signal into an energized circuit.', 'Ohms and continuity are only for unpowered circuits.');
        }
        if (mode === 'vac' && socket === 'vohm') {
          return good('230 V~', 'That is the correct setup for checking the mains supply: AC volts, V/ohms socket, one probe on live and one on neutral.', 'This is a parallel voltage measurement on a live circuit.');
        }
        if (mode === 'vdc' && socket === 'vohm') {
          return caution('---', 'The probes are placed correctly, but the function is wrong. A wall socket is AC, so DC mode will mislead you.', 'Always match the meter function to the source you are measuring.');
        }
        return caution('---', 'Current mode also needs the red lead in the 10A socket. Right now the setup is incomplete.', 'The meter mode and lead socket have to agree with each other.');
      },
    },
    switch: {
      caption: 'Live circuit: measure across a healthy closed switch.',
      blackPos: { x: 458, y: 188 },
      redPos: { x: 514, y: 188 },
      evaluate(mode, socket) {
        if (mode === 'amps' && socket === 'amps') {
          return danger('SHORT', 'Across a closed live switch, ammeter mode is again acting like a near-short. That would usually just blow the meter fuse, but it is still the wrong and unsafe setup.', 'An ammeter goes in series, not across a live component.');
        }
        if ((mode === 'ohms' || mode === 'cont') && socket === 'vohm') {
          return danger('LIVE?', 'Ohms or continuity on a live circuit can damage the meter and gives a meaningless result.', 'Switch to a voltage range for live testing.');
        }
        if (mode === 'vac' && socket === 'vohm') {
          return good('0.1 V~', 'A healthy closed switch should drop almost no voltage. If you saw several volts here, that would point to high-resistance contacts.', 'Voltage-drop testing under load is one of the most useful bench techniques.');
        }
        if (mode === 'vdc' && socket === 'vohm') {
          return caution('---', 'The idea is right, but the function is wrong. This is an AC live-circuit test, not a DC one.', 'A wrong range can produce a misleading result even when the probes are placed well.');
        }
        return caution('---', 'The red lead is still in the V/ohms socket, so current mode is not actually set up correctly.', 'Mode choice and lead socket must match.');
      },
    },
    fuse: {
      caption: 'Unplugged appliance: test both ends of a good fuse.',
      blackPos: { x: 462, y: 188 },
      redPos: { x: 560, y: 188 },
      evaluate(mode, socket) {
        if (mode === 'cont' && socket === 'vohm') {
          return good('BEEP', 'That is exactly what a good fuse should do in continuity mode.', 'If it read OL or stayed silent, the fuse element would be open.');
        }
        if (mode === 'ohms' && socket === 'vohm') {
          return good('0.3 ohms', 'Resistance mode also works well here. A good fuse should read very close to zero ohms.', 'Near-zero resistance means the fuse path is intact.');
        }
        if (mode === 'amps' && socket === 'amps') {
          return caution('---', 'An ammeter does not tell you whether an unplugged fuse is healthy. There is no circuit current here to measure.', 'For an isolated fuse, choose continuity or resistance.');
        }
        return caution('---', 'Voltage ranges tell you almost nothing on a dead, isolated fuse.', 'This is an unplugged continuity or resistance check.');
      },
    },
    element: {
      caption: 'Unplugged heating element: check resistance across the terminals.',
      blackPos: { x: 450, y: 188 },
      redPos: { x: 574, y: 188 },
      evaluate(mode, socket) {
        if (mode === 'ohms' && socket === 'vohm') {
          return good('26 ohms', 'That is a plausible reading for a healthy kettle-style heating element.', 'Now you can compare the measured resistance with the appliance wattage.');
        }
        if (mode === 'cont' && socket === 'vohm') {
          return caution('BEEP', 'Continuity tells you the element is not fully open, but it hides the actual resistance you need for diagnosis.', 'For heating elements, ohms mode usually teaches you more than the buzzer.');
        }
        if (mode === 'amps' && socket === 'amps') {
          return caution('---', 'There is no live circuit current here to measure. This is an unplugged element check.', 'Use resistance mode for this test.');
        }
        return caution('---', 'This is a resistance problem, not a live-voltage problem.', 'Use resistance mode once the appliance is safely unplugged.');
      },
    },
    current: {
      caption: 'Open the circuit and insert the meter in series to measure lamp current.',
      blackPos: { x: 464, y: 188 },
      redPos: { x: 534, y: 188 },
      evaluate(mode, socket) {
        if (mode === 'amps' && socket === 'amps') {
          return good('0.35 A', 'Now the meter is acting as an ammeter correctly: inserted in series so the circuit current flows through it.', 'This is why the 10A socket is safe here but dangerous across a wall socket.');
        }
        if ((mode === 'ohms' || mode === 'cont') && socket === 'vohm') {
          return danger('LIVE?', 'This is a live circuit. Ohms or continuity mode here can damage the meter because the meter is trying to power the test itself.', 'Use current mode with the red lead in the 10A socket.');
        }
        if (mode === 'vac' && socket === 'vohm') {
          return caution('230 V~', 'Voltage mode across the open gap tells you the supply is present, but it does not measure current.', 'To measure current, switch to amps and move the red lead to the 10A socket.');
        }
        if (mode === 'vdc' && socket === 'vohm') {
          return caution('---', 'This is still the wrong function. The gap is in an AC circuit, and the task is current measurement anyway.', 'The correct setup is amps mode with the red lead in the 10A socket.');
        }
        return caution('---', 'You have chosen current mode, but the red lead is still in the V/ohms socket. The setup is incomplete.', 'Current testing needs both the 10A socket and current mode.');
      },
    },
  };

  let scene = 'socket';
  let mode = 'vac';
  let redSocket = 'vohm';
  const probes = {
    black: { el: blackProbe, glow: blackGlow, lead: blackLead, x: 589, y: 187, anchorX: 88, anchorY: 311 },
    red: { el: redProbe, glow: redGlow, lead: redLead, x: 546, y: 187, anchorX: 152, anchorY: 311 },
  };

  function good(display, summary, note) { return { state: 'good', display, screen: 'Good setup', summary, note }; }
  function caution(display, summary, note) { return { state: 'caution', display, screen: 'Check setup', summary, note }; }
  function danger(display, summary, note) { return { state: 'danger', display, screen: 'Unsafe', summary, note }; }

  function renderProbe(name) {
    const probe = probes[name];
    probe.el.setAttribute('cx', probe.x);
    probe.el.setAttribute('cy', probe.y);
    probe.glow.setAttribute('cx', probe.x);
    probe.glow.setAttribute('cy', probe.y);
    probe.lead.setAttribute('x1', probe.anchorX);
    probe.lead.setAttribute('y1', probe.anchorY);
    probe.lead.setAttribute('x2', probe.x);
    probe.lead.setAttribute('y2', probe.y);
  }

  function renderState() {
    const result = sceneData[scene].evaluate(mode, redSocket);
    sceneCaptionEl.textContent = sceneData[scene].caption;
    screenBg.setAttribute('class', `meter-screen is-${result.state}`);
    screenText.textContent = result.display;
    screenSubtext.textContent = result.screen;
    readingEl.textContent = result.display;
    summaryEl.textContent = result.summary;
    noteEl.textContent = result.note;
    resultEl.className = `meter-sim-readout meter-demo-result is-${result.state}`;

    sceneTabs.forEach(tab => {
      const active = tab.dataset.meterScene === scene;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    sceneGroups.forEach(group => group.classList.toggle('is-active', group.dataset.meterSceneGroup === scene));
    modeGroups.forEach(group => group.classList.toggle('is-active', group.dataset.meterMode === mode));
    Object.entries(redSockets).forEach(([name, el]) => el.classList.toggle('is-active', name === redSocket));
  }

  function setScene(nextScene) {
    scene = nextScene;
    const next = sceneData[scene];
    probes.black.x = next.blackPos.x;
    probes.black.y = next.blackPos.y;
    probes.red.x = next.redPos.x;
    probes.red.y = next.redPos.y;
    renderProbe('black');
    renderProbe('red');
    renderState();
  }

  sceneTabs.forEach(tab => tab.addEventListener('click', () => setScene(tab.dataset.meterScene)));
  modeGroups.forEach(group => group.addEventListener('click', () => {
    mode = group.dataset.meterMode;
    renderState();
  }));
  redSockets.vohm.addEventListener('click', () => {
    redSocket = 'vohm';
    probes.red.anchorX = 152;
    probes.red.anchorY = 311;
    renderProbe('red');
    renderState();
  });
  redSockets.amps.addEventListener('click', () => {
    redSocket = 'amps';
    probes.red.anchorX = 216;
    probes.red.anchorY = 311;
    renderProbe('red');
    renderState();
  });

  setScene('socket');
}

/* ---- Schematic Mapping Demo ---- */
function initSchematicDemo() {
  const demo = document.getElementById('schematic-demo');
  if (!demo) return;

  const summaryEl = document.getElementById('schematic-summary');
  const schematicParts = demo.querySelectorAll('[data-schematic-part]');
  const layoutParts = demo.querySelectorAll('[data-layout-part]');
  const schematicPaths = demo.querySelectorAll('[data-schematic-path]');
  const layoutPaths = demo.querySelectorAll('[data-layout-path]');
  const descriptions = {
    f1: 'F1 is in the shared supply path, so if it opens the heater, lamp, and pump all go dead together.',
    s1: 'S1 is also common to every branch. A dead-everything symptom makes this one of the first components worth testing.',
    th1: 'TH1 only sits in the heater branch. If the lamp still works but heat is missing, the highlighted path shows why TH1 becomes interesting.',
    h1: 'H1 is the load at the end of the heater branch. If the path up to it is intact, the element itself is a strong suspect.',
    l1: 'L1 has its own branch, so it can confirm the common supply path while the heater or pump still fail independently.',
    p1: 'P1 is on a separate branch again. The path highlight makes it obvious which upstream parts it shares and which it does not.',
  };
  const partPaths = {
    f1: ['common', 'heater', 'lamp', 'pump'],
    s1: ['common', 'heater', 'lamp', 'pump'],
    th1: ['common', 'heater'],
    h1: ['common', 'heater'],
    l1: ['common', 'lamp'],
    p1: ['common', 'pump'],
  };

  let locked = 'f1';

  function render(part) {
    schematicParts.forEach(node => node.classList.toggle('is-active', node.dataset.schematicPart === part));
    layoutParts.forEach(node => node.classList.toggle('is-active', node.dataset.layoutPart === part));
    schematicPaths.forEach(path => path.classList.toggle('is-active', partPaths[part].includes(path.dataset.schematicPath)));
    layoutPaths.forEach(path => path.classList.toggle('is-active', partPaths[part].includes(path.dataset.layoutPath)));
    summaryEl.textContent = descriptions[part] || '';
  }

  function bindPart(nodes, keyName) {
    nodes.forEach(node => {
      const part = node.dataset[keyName];
      node.addEventListener('mouseenter', () => render(part));
      node.addEventListener('mouseleave', () => render(locked));
      node.addEventListener('click', () => {
        locked = part;
        render(locked);
      });
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'button');
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          locked = part;
          render(locked);
        }
      });
    });
  }

  bindPart(schematicParts, 'schematicPart');
  bindPart(layoutParts, 'layoutPart');
  render(locked);
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initAnswerReveal();
  initOhmDemo();
  initCircuitDemo();
  initMeterSim();
  initSchematicDemo();
});
