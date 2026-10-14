if (typeof AOS !== "undefined") AOS.init({ duration: 700, once: true });


/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Mobile nav ---------- */
const mobileBtn = document.getElementById('mobileMenu');
const navLinksEl = document.getElementById('navLinks');
mobileBtn.addEventListener('click', () => navLinksEl.classList.toggle('show'));
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => navLinksEl.classList.remove('show')));

/* ---------- Theme ---------- */
const toggle = document.getElementById('themeToggle');
const setTheme = (th) => {
  document.documentElement.setAttribute('data-theme', th);
  localStorage.setItem('theme', th);
  toggle.innerHTML = th === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};
setTheme(localStorage.getItem('theme') || 'light');
toggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  setTheme(cur === 'dark' ? 'light' : 'dark');
});

/* ---------- Smooth scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor =>
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  })
);

/* ---------- Nav scrolled state + active link + scroll progress ---------- */
const navBar = document.getElementById('navBar');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [...navAnchors].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const backToTop = document.getElementById('backToTop');
const scrollBar = document.getElementById('scrollBar');

window.addEventListener('scroll', () => {
  navBar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('show', window.scrollY > 400);

  const doc = document.documentElement;
  const pct = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
  scrollBar.style.width = pct + '%';

  let current = sections[0];
  for (const sec of sections) {
    if (window.scrollY >= sec.offsetTop - 160) current = sec;
  }
  navAnchors.forEach(a => a.classList.toggle('active', document.querySelector(a.getAttribute('href')) === current));
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- THM progress ---------- */
const thmFill = document.getElementById('thmFill');
const thmPercentSpan = document.getElementById('thmPercent');
const thmValue = 64;
if (thmFill) { thmFill.style.width = thmValue + '%'; thmPercentSpan.textContent = thmValue + '%'; }

/* ---------- Count-up stats ---------- */
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---------- Typing role text ---------- */
const roles = ['Penetration Tester', 'Red Team Operator', 'CTF Player', 'Tool Developer', 'Bug Bounty Hunter'];
const roleEl = document.getElementById('roleText');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) {
  roleEl.textContent = roles[0];
} else {
  let roleIdx = 0, charIdx = 0, deleting = false;
  const typeStep = () => {
    const word = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      roleEl.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) { deleting = true; setTimeout(typeStep, 1400); return; }
    } else {
      charIdx--;
      roleEl.textContent = word.slice(0, charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(typeStep, deleting ? 40 : 80);
  };
  typeStep();
}

/* ---------- Copy buttons ---------- */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.copy).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => btn.innerHTML = original, 1400);
    });
  });
});

/* ---------- Swiper ---------- */
if (typeof Swiper !== "undefined") new Swiper('#skillsSwiper', {
  slidesPerView: 1, spaceBetween: 20,
  breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  pagination: { el: '.swiper-pagination', clickable: true },
  loop: false,
  autoplay: { delay: 4000, disableOnInteraction: false }
});

/* ---------- Custom cursor ---------- */
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => { cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`; });
document.querySelectorAll('a, button, .social-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(1.8)');
  el.addEventListener('mouseleave', () => { cursor.style.transform = cursor.style.transform.replace(' scale(1.8)', ''); });
});

/* ====================================================================
   AMBIENT BACKGROUND NETWORK (visual only, simple & lightweight)
   ==================================================================== */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const NODE_COUNT = reducedMotion ? 0 : Math.min(55, Math.floor((window.innerWidth * window.innerHeight) / 22000));
for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
}

const mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

function lineColor() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,' : 'rgba(0,0,0,';
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  const base = lineColor();

  for (const n of nodes) {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
    const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
    if (d < 110 && d > 0.01) { n.x += dx / d * .5; n.y += dy / d * .5; }
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 140) {
        ctx.strokeStyle = base + (0.055 * (1 - d / 140)) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  for (const n of nodes) {
    ctx.fillStyle = base + '0.22)';
    ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

/* ====================================================================
   FIREWALL DRILL GAME — runs as fixed-position targets over the
   whole page, on top of the ambient background network.
   ==================================================================== */
const engageBtn = document.getElementById('engageBtn');
const liveScoreEl = document.getElementById('liveScore');
const liveTimeEl = document.getElementById('liveTime');
const bestScoreEl = document.getElementById('bestScore');
const gameBadge = document.getElementById('gameBadge');
const gameBadgeText = document.getElementById('gameBadgeText');

let gScore = 0, gTime = 30, gActive = false, gSpawnTimer = null, gClockTimer = null;
let gBest = parseInt(localStorage.getItem('drillBest') || '0', 10);
bestScoreEl.textContent = gBest;

function spawnTarget() {
  if (!gActive) return;
  const t = document.createElement('div');
  t.className = 'target';
  const margin = 50;
  const x = Math.random() * (window.innerWidth - margin * 2) + margin;
  const y = Math.random() * (window.innerHeight - margin * 2) + margin;
  t.style.left = x + 'px';
  t.style.top = y + 'px';
  t.innerHTML = '<i class="fas fa-bolt"></i>';
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('in'));

  const life = setTimeout(() => removeTarget(t), 1400);
  t.addEventListener('click', () => {
    clearTimeout(life);
    gScore++;
    liveScoreEl.textContent = gScore;
    updateBadge();
    removeTarget(t);
  });
}

function removeTarget(el) {
  if (!el.isConnected) return;
  el.style.transform = 'scale(0)';
  el.style.opacity = '0';
  setTimeout(() => el.remove(), 180);
}

function updateBadge() {
  gameBadgeText.textContent = `Drill running — Score ${gScore} — ${gTime}s`;
}

function startDrill() {
  gActive = true; gScore = 0; gTime = 30;
  liveScoreEl.textContent = gScore;
  liveTimeEl.textContent = gTime;
  engageBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Drill';
  document.body.classList.add('game-on');
  gameBadge.classList.add('show');
  updateBadge();
  document.querySelectorAll('.target').forEach(t => t.remove());
  spawnTarget();
  gSpawnTimer = setInterval(() => {
    if (document.querySelectorAll('.target').length < 6) spawnTarget();
  }, 800);
  gClockTimer = setInterval(() => {
    gTime--;
    liveTimeEl.textContent = gTime;
    updateBadge();
    if (gTime <= 0) endDrill(true);
  }, 1000);
}

function endDrill(completed) {
  gActive = false;
  clearInterval(gSpawnTimer); clearInterval(gClockTimer);
  document.querySelectorAll('.target').forEach(t => removeTarget(t));
  document.body.classList.remove('game-on');
  engageBtn.innerHTML = '<i class="fas fa-play"></i> Start Drill';
  if (gScore > gBest) {
    gBest = gScore;
    localStorage.setItem('drillBest', gBest);
    bestScoreEl.textContent = gBest;
    if (completed) showToast('New best score: ' + gBest + '!');
  } else if (completed) {
    showToast('Drill complete — score ' + gScore);
  }
  setTimeout(() => gameBadge.classList.remove('show'), completed ? 1400 : 0);
}

engageBtn.addEventListener('click', () => { gActive ? endDrill(false) : startDrill(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && gActive) endDrill(false); });

/* ====================================================================
   LIVE GITHUB DATA (profile repo count only)
   ==================================================================== */
async function loadGitHub() {
  const ghRepoCount = document.getElementById('ghRepoCount');
  try {
    const userRes = await fetch('https://api.github.com/users/JOKER-53');
    if (userRes.ok) {
      const user = await userRes.json();
      if (ghRepoCount && typeof user.public_repos === 'number') {
        ghRepoCount.textContent = user.public_repos + '+';
      }
    }
  } catch (e) { /* silent fail, keep placeholder */ }
}
loadGitHub();

/* ====================================================================
   TILT EFFECT for cards
   ==================================================================== */
function attachTilt() {
  document.querySelectorAll('.tilt').forEach(card => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';
    card.addEventListener('mousemove', (e) => {
      if (reducedMotion) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
document.querySelectorAll('.social-card, .badge-card, .swiper-slide').forEach(el => el.classList.add('tilt'));
attachTilt();

/* ====================================================================
   MAGNETIC BUTTONS
   ==================================================================== */
if (!reducedMotion) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = (e.clientX - r.left - r.width / 2) * 0.18;
      const my = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${mx}px, ${my}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ====================================================================
   REVEAL-ON-SCROLL WORD ANIMATION
   ==================================================================== */
function wrapWords(el) {
  const text = el.textContent.trim();
  el.innerHTML = text.split(/\s+/).map(w => `<span>${w}</span>`).join(' ');
}
document.querySelectorAll('.reveal-words').forEach(wrapWords);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const spans = entry.target.querySelectorAll('span');
      spans.forEach((s, i) => { s.style.transitionDelay = (i * 18) + 'ms'; });
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.reveal-words').forEach(el => revealObserver.observe(el));

/* ====================================================================
   SCRAMBLE / DECRYPT TEXT EFFECT for section eyebrows
   ==================================================================== */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#01';
function scrambleReveal(el) {
  const original = el.textContent;
  if (reducedMotion) { el.textContent = original; return; }
  const len = original.length;
  let frame = 0;
  const totalFrames = 18;
  const interval = setInterval(() => {
    let out = '';
    for (let i = 0; i < len; i++) {
      if (i < (frame / totalFrames) * len) out += original[i];
      else out += original[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = out;
    frame++;
    if (frame > totalFrames) { clearInterval(interval); el.textContent = original; }
  }, 28);
}
const eyebrowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      scrambleReveal(entry.target);
      eyebrowObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.section-eyebrow').forEach(el => eyebrowObserver.observe(el));

/* ====================================================================
   LIVE CLOCK (IST) in nav status pill
   ==================================================================== */
const navClock = document.getElementById('navClock');
function tickClock() {
  if (!navClock) return;
  const now = new Date();
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (5.5 * 3600000));
  const hh = String(ist.getHours()).padStart(2, '0');
  const mm = String(ist.getMinutes()).padStart(2, '0');
  const ss = String(ist.getSeconds()).padStart(2, '0');
  navClock.textContent = `${hh}:${mm}:${ss}`;
}
tickClock();
setInterval(tickClock, 1000);

/* ====================================================================
   SECTION NUMBER WATERMARKS + sheen hover on key cards
   ==================================================================== */
document.querySelectorAll('.section-eyebrow').forEach(eyebrow => {
  const match = eyebrow.textContent.match(/(\d{2})/);
  if (match) {
    const watermark = document.createElement('div');
    watermark.className = 'section-num-watermark';
    watermark.textContent = match[1];
    eyebrow.closest('.section-head')?.appendChild(watermark);
  }
});
document.querySelectorAll('.social-card, .repo-card, .badge-card').forEach(el => el.classList.add('sheen'));

/* ====================================================================
   COMMAND PALETTE (Ctrl+K / Cmd+K)
   ==================================================================== */
const cmdkOverlay = document.getElementById('cmdkOverlay');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');
const cmdkTrigger = document.getElementById('cmdkTrigger');

const cmdkActions = [
  { label: 'Go to About', icon: 'fa-user', action: () => scrollToSel('#about') },
  { label: 'Go to Operations Log', icon: 'fa-timeline', action: () => scrollToSel('#log') },
  { label: 'Go to Expertise', icon: 'fa-layer-group', action: () => scrollToSel('#showcase') },
  { label: 'Go to Cyber Range (play the game)', icon: 'fa-gamepad', action: () => scrollToSel('#range') },
  { label: 'Go to Flagship Project', icon: 'fa-folder-open', action: () => scrollToSel('#project') },
  { label: 'Go to Contact', icon: 'fa-paper-plane', action: () => scrollToSel('#contact') },
  { label: 'Open GitHub Profile', icon: 'fa-github', faPrefix: 'fab', action: () => window.open('https://github.com/JOKER-53', '_blank') },
  { label: 'Open Intelligent Compiler repo', icon: 'fa-code', action: () => window.open('https://github.com/JOKER-53/IntelligentCompiler', '_blank') },
  { label: 'Open LinkedIn', icon: 'fa-linkedin-in', faPrefix: 'fab', action: () => window.open('https://www.linkedin.com/in/kadhiravan-e-g-028818327', '_blank') },
  { label: 'Toggle dark / light theme', icon: 'fa-circle-half-stroke', action: () => toggle.click() },
  { label: 'Copy email address', icon: 'fa-envelope', action: () => copyText('kadhiravan226@gmail.com', 'Email copied to clipboard') },
];

function scrollToSel(sel) {
  document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
}

function copyText(text, msg) {
  navigator.clipboard.writeText(text).then(() => showToast(msg));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

let cmdkActiveIdx = 0;
function renderCmdkList(filter = '') {
  const filtered = cmdkActions.filter(a => a.label.toLowerCase().includes(filter.toLowerCase()));
  cmdkList.innerHTML = filtered.map((a, i) => `
    <div class="cmdk-item ${i === cmdkActiveIdx ? 'active' : ''}" data-idx="${i}">
      <i class="${a.faPrefix || 'fas'} ${a.icon}"></i> ${a.label}
    </div>`).join('') || '<div class="cmdk-item">No matches</div>';
  cmdkList.querySelectorAll('.cmdk-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.idx, 10);
      if (!isNaN(idx)) { filtered[idx].action(); closeCmdk(); }
    });
  });
  return filtered;
}

function openCmdk() {
  cmdkOverlay.classList.add('show');
  cmdkInput.value = '';
  cmdkActiveIdx = 0;
  renderCmdkList();
  setTimeout(() => cmdkInput.focus(), 50);
}
function closeCmdk() { cmdkOverlay.classList.remove('show'); }

cmdkTrigger.addEventListener('click', openCmdk);
cmdkOverlay.addEventListener('click', (e) => { if (e.target === cmdkOverlay) closeCmdk(); });

cmdkInput.addEventListener('input', () => { cmdkActiveIdx = 0; renderCmdkList(cmdkInput.value); });

cmdkInput.addEventListener('keydown', (e) => {
  const filtered = renderCmdkList(cmdkInput.value);
  if (e.key === 'ArrowDown') { e.preventDefault(); cmdkActiveIdx = Math.min(cmdkActiveIdx + 1, filtered.length - 1); renderCmdkList(cmdkInput.value); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); cmdkActiveIdx = Math.max(cmdkActiveIdx - 1, 0); renderCmdkList(cmdkInput.value); }
  else if (e.key === 'Enter') { e.preventDefault(); if (filtered[cmdkActiveIdx]) { filtered[cmdkActiveIdx].action(); closeCmdk(); } }
  else if (e.key === 'Escape') { closeCmdk(); }
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(); }
  if (e.key === 'Escape') closeCmdk();
});
