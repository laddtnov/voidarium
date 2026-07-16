/* ── Galaxy Map engine ────────────────────────────────────
   World-space objects + one camera (x, y, zoom) + a global
   map rotation. Travel = easing the camera targets. */

'use strict';

// Non-cryptographic randomness for visual placement only (star/particle
// positions, twinkle phase, color picks) — never security-sensitive.
const rnd = () => Math.random(); // NOSONAR - S2245: visual randomness, not security-sensitive

const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

/* Resolve colors from variables.css — never hardcoded here */
const rootStyle = getComputedStyle(document.documentElement);
const cvar = (name) => rootStyle.getPropertyValue(name).trim();

const COLOR = {
  bg: cvar('--bg-deep'),
  nebula: cvar('--bg-nebula'),
  starWhite: cvar('--star-white'),
  cyan: cvar('--neon-cyan'),
  pink: cvar('--cyber-pink'),
  green: cvar('--terminal-green'),
  voidBlue: cvar('--void-blue'),
  dim: cvar('--text-dim'),
};

/* ── Viewport ── */
let W = 0, H = 0, dpr = 1;
function resize() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

/* ── Camera & global spin ── */
const WORLD_EXTENT = 1750;                    // map fits inside ±this
const overviewZoom = () => (Math.min(W, H) * 0.5) / WORLD_EXTENT;

const camera = {
  x: 0, y: 0, zoom: overviewZoom(),
  tx: 0, ty: 0, tz: overviewZoom(),
};

let mapRotation = 0;
let spinning = true;
const MAP_SPIN_SPEED = 0.000028;              // rad / ms — one turn ≈ 3.7 min

function worldToScreen(wx, wy) {
  const cos = Math.cos(mapRotation), sin = Math.sin(mapRotation);
  const dx = wx - camera.x, dy = wy - camera.y;
  return {
    x: W / 2 + (dx * cos - dy * sin) * camera.zoom,
    y: H / 2 + (dx * sin + dy * cos) * camera.zoom,
  };
}

function screenToWorld(sx, sy) {
  const cos = Math.cos(-mapRotation), sin = Math.sin(-mapRotation);
  const rx = (sx - W / 2) / camera.zoom, ry = (sy - H / 2) / camera.zoom;
  return {
    x: camera.x + rx * cos - ry * sin,
    y: camera.y + rx * sin + ry * cos,
  };
}

/* ── Starfield (two parallax layers, screen-wrapped) ── */
function makeStars(count, parallax) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rnd() * 2200,
      y: rnd() * 1400,
      r: rnd() * 1.3 + 0.3,
      phase: rnd() * Math.PI * 2,
      speed: rnd() * 0.002 + 0.0005,
      parallax,
    });
  }
  return stars;
}
const starLayers = [makeStars(140, 0.05), makeStars(90, 0.12)];

function drawStars(t) {
  for (const layer of starLayers) {
    for (const s of layer) {
      const px = ((s.x - camera.x * s.parallax) % W + W) % W;
      const py = ((s.y - camera.y * s.parallax) % H + H) % H;
      const tw = 0.45 + 0.4 * Math.sin(t * s.speed + s.phase);
      ctx.globalAlpha = tw;
      ctx.fillStyle = COLOR.starWhite;
      ctx.fillRect(px, py, s.r, s.r);
    }
  }
  ctx.globalAlpha = 1;
}

/* ── Object runtime state ── */
const objects = galaxiesData.objects.map((data) => {
  const colors = data.palette.map(cvar);
  const state = { data, colors, angle: rnd() * Math.PI * 2, parent: null };
  if (data.type === 'galaxy') state.particles = makeGalaxyParticles(data);
  if (data.type === 'blackhole') state.disk = makeDiskParticles(data);
  return state;
});

const byId = new Map(objects.map((o) => [o.data.id, o]));
for (const o of objects) {
  if (o.data.parent) o.parent = byId.get(o.data.parent);
}

/* smallest first so a black hole inside a galaxy is still clickable */
const pickOrder = [...objects].sort((a, b) => a.data.radius - b.data.radius);

/* Interior objects orbit with their host galaxy's spin */
function worldPos(o) {
  if (!o.parent) return { x: o.data.x, y: o.data.y };
  const a = o.data.local.a + o.parent.angle;
  return {
    x: o.parent.data.x + Math.cos(a) * o.data.local.r,
    y: o.parent.data.y + Math.sin(a) * o.data.local.r,
  };
}

/* LOD: interior objects fade in once their host fills enough screen */
function childAlpha(o) {
  if (!o.parent) return 1;
  const parentScreenR = o.parent.data.radius * camera.zoom;
  return Math.min(Math.max((parentScreenR - 110) / 90, 0), 1);
}

/* Weighted pick among 3 palette slots: mostly slot 0, rest split 1/2 */
function pickColorIndex() {
  if (rnd() < 0.55) return 0;
  return rnd() < 0.7 ? 1 : 2;
}

function makeGalaxyParticles(data) {
  const pts = [];
  const arms = data.arms || 3;
  for (let i = 0; i < 260; i++) {
    const t = rnd();
    let r, a;
    if (data.elliptical) {
      r = data.radius * Math.pow(rnd(), 0.6);
      a = rnd() * Math.PI * 2;
    } else if (data.ring) {
      // most stars pile up in the collision ring, a few in the core
      if (rnd() < 0.72) {
        r = data.radius * (0.8 + rnd() * 0.2);
      } else {
        r = data.radius * rnd() * 0.3;
      }
      a = rnd() * Math.PI * 2;
    } else {
      const arm = i % arms;
      r = data.radius * (0.1 + 0.9 * Math.pow(t, 0.65));
      a = arm * ((Math.PI * 2) / arms) + t * 3.0 + (rnd() - 0.5) * 0.4;
    }
    pts.push({
      r, a,
      size: rnd() * 1.7 + 0.5,
      ci: pickColorIndex(),
      alpha: rnd() * 0.55 + 0.35,
    });
  }
  return pts;
}

function makeDiskParticles(data) {
  const pts = [];
  for (let i = 0; i < 90; i++) {
    const r = data.radius * (1.35 + rnd() * 1.15);
    pts.push({
      r,
      a: rnd() * Math.PI * 2,
      speed: 0.0012 * Math.sqrt(data.radius / r), // Keplerian: inner orbits faster
      size: rnd() * 1.8 + 0.7,
      ci: rnd() < 0.6 ? 0 : 1,
    });
  }
  return pts;
}

/* ── Renderers ── */
function drawGalaxy(o, t) {
  const { data, colors } = o;
  const sc = worldToScreen(data.x, data.y);
  const z = camera.zoom;
  const rot = o.angle + mapRotation;

  // core glow
  const coreR = Math.max(data.radius * 0.45 * z, 4);
  const g = ctx.createRadialGradient(sc.x, sc.y, 0, sc.x, sc.y, coreR);
  g.addColorStop(0, COLOR.starWhite);
  g.addColorStop(0.35, colors[0]);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, coreR, 0, Math.PI * 2);
  ctx.fill();

  // spiral arm particles — own-axis spin + map spin compose as one angle
  for (const p of o.particles) {
    const a = p.a + rot;
    const px = sc.x + Math.cos(a) * p.r * z;
    const py = sc.y + Math.sin(a) * p.r * z;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = colors[p.ci] || colors[0];
    const s = Math.max(p.size * Math.min(z * 2, 1.6), 0.6);
    ctx.fillRect(px, py, s, s);
  }
  ctx.globalAlpha = 1;
}

function drawStarObj(o, t) {
  const { data, colors } = o;
  const va = childAlpha(o);
  if (va < 0.02) return;
  const wp = worldPos(o);
  const sc = worldToScreen(wp.x, wp.y);
  const z = camera.zoom;
  const pulse = 1 + 0.08 * Math.sin(t * 0.003 + o.angle);
  const R = Math.max(data.radius * 2.1 * z * pulse, 6);

  const g = ctx.createRadialGradient(sc.x, sc.y, 0, sc.x, sc.y, R);
  g.addColorStop(0, COLOR.starWhite);
  g.addColorStop(0.25, colors[0]);
  g.addColorStop(0.6, colors[1] || colors[0]);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = va;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R, 0, Math.PI * 2);
  ctx.fill();

  // diffraction spikes, slowly rotating with the star's own spin
  ctx.save();
  ctx.translate(sc.x, sc.y);
  ctx.rotate(o.angle * 0.2 + mapRotation);
  ctx.strokeStyle = colors[0];
  ctx.globalAlpha = 0.5 * va;
  ctx.lineWidth = 1;
  const L = R * 1.5;
  for (let i = 0; i < 2; i++) {
    ctx.rotate(Math.PI / 2 * i);
    ctx.beginPath();
    ctx.moveTo(-L, 0);
    ctx.lineTo(L, 0);
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawBlackHole(o, t) {
  const { data, colors } = o;
  const va = childAlpha(o);
  if (va < 0.02) return;
  const wp = worldPos(o);
  const sc = worldToScreen(wp.x, wp.y);
  const z = camera.zoom;
  const R = Math.max(data.radius * z, 3);
  const tilt = 0.42; // accretion disk viewed at an angle

  const diskPoint = (p) => ({
    x: sc.x + Math.cos(p.a) * p.r * z,
    y: sc.y + Math.sin(p.a) * p.r * z * tilt,
    behind: Math.sin(p.a) < 0,
  });

  // back half of the accretion disk (passes behind the horizon)
  for (const p of o.disk) {
    const q = diskPoint(p);
    if (!q.behind) continue;
    ctx.globalAlpha = 0.7 * va;
    ctx.fillStyle = colors[p.ci] || colors[0];
    ctx.fillRect(q.x, q.y, p.size, p.size);
  }

  // ambient glow + photon ring + event horizon
  const g = ctx.createRadialGradient(sc.x, sc.y, R * 0.6, sc.x, sc.y, R * 3);
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.25 * va;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = va;
  ctx.fillStyle = COLOR.bg;
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.9)';
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R * 0.92, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = colors[0];
  ctx.lineWidth = Math.max(1.2, z * 1.2);
  ctx.shadowBlur = 14;
  ctx.shadowColor = colors[0];
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // front half of the disk (passes in front of the horizon)
  for (const p of o.disk) {
    const q = diskPoint(p);
    if (q.behind) continue;
    ctx.globalAlpha = 0.9 * va;
    ctx.fillStyle = colors[p.ci] || colors[0];
    ctx.fillRect(q.x, q.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

function drawVoid(o, t) {
  const { data, colors } = o;
  const sc = worldToScreen(data.x, data.y);
  const z = camera.zoom;
  const R = data.radius * z;

  // a region *darker* than space itself
  const g = ctx.createRadialGradient(sc.x, sc.y, 0, sc.x, sc.y, R);
  g.addColorStop(0, 'rgba(0,0,0,0.75)');
  g.addColorStop(0.8, 'rgba(0,0,0,0.35)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = colors[0];
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 10]);
  ctx.lineDashOffset = -t * 0.008 - o.angle * 400;
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function drawLabel(o, highlight) {
  const { data } = o;
  const wp = worldPos(o);
  const sc = worldToScreen(wp.x, wp.y);
  const offset = data.type === 'void' ? 16 : data.radius * camera.zoom + 16;
  ctx.font = '11px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = highlight ? COLOR.cyan : COLOR.dim;
  if (highlight) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = COLOR.cyan;
  }
  ctx.fillText(data.name, sc.x, sc.y + offset);
  ctx.shadowBlur = 0;
}

function drawSelectionRing(o, t) {
  const wp = worldPos(o);
  const sc = worldToScreen(wp.x, wp.y);
  const R = Math.max(o.data.radius * camera.zoom * 1.25, 26);
  ctx.strokeStyle = COLOR.cyan;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = -t * 0.02;
  ctx.beginPath();
  ctx.arc(sc.x, sc.y, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // corner brackets
  ctx.strokeStyle = COLOR.pink;
  ctx.lineWidth = 1.5;
  const B = R + 10, L = 10;
  for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    ctx.beginPath();
    ctx.moveTo(sc.x + dx * B, sc.y + dy * (B - L));
    ctx.lineTo(sc.x + dx * B, sc.y + dy * B);
    ctx.lineTo(sc.x + dx * (B - L), sc.y + dy * B);
    ctx.stroke();
  }
}

/* ── Interaction ── */
let hovered = null;
let selected = null;
let panelPending = null;
let followTarget = null;   // camera tracks this object as it orbits
let mouse = { x: -999, y: -999 };
let drag = null;

function pick(sx, sy) {
  for (const o of pickOrder) {
    if (childAlpha(o) < 0.35) continue;  // hidden interior objects aren't clickable
    const wp = worldPos(o);
    const sc = worldToScreen(wp.x, wp.y);
    const hitR = Math.max(o.data.radius * camera.zoom, 16);
    const dx = sx - sc.x, dy = sy - sc.y;
    if (dx * dx + dy * dy <= hitR * hitR) return o;
  }
  return null;
}

function travelTo(o) {
  selected = o;
  panelPending = o;
  followTarget = o;
  closePanel();
  const wp = worldPos(o);
  camera.tx = wp.x;
  camera.ty = wp.y;
  const fit = (Math.min(W, H) * (o.data.type === 'void' ? 0.42 : 0.3)) / o.data.radius;
  camera.tz = Math.min(Math.max(fit, overviewZoom()), 10);
  hudTarget.textContent = o.parent
    ? o.parent.data.name + ' › ' + o.data.name
    : o.data.name;
}

canvas.addEventListener('pointerdown', (e) => {
  drag = { x: e.clientX, y: e.clientY, moved: false };
  canvas.classList.add('dragging');
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener('pointermove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (drag) {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    if (drag.moved) {
      followTarget = null;
      panelPending = null;
      const cos = Math.cos(-mapRotation), sin = Math.sin(-mapRotation);
      const wx = (dx / camera.zoom) * cos - (dy / camera.zoom) * sin;
      const wy = (dx / camera.zoom) * sin + (dy / camera.zoom) * cos;
      camera.x -= wx; camera.y -= wy;
      camera.tx = camera.x; camera.ty = camera.y;
      drag.x = e.clientX; drag.y = e.clientY;
    }
  } else {
    hovered = pick(e.clientX, e.clientY);
    canvas.classList.toggle('hovering', !!hovered);
  }
});

canvas.addEventListener('pointerup', (e) => {
  canvas.classList.remove('dragging');
  const wasDrag = drag?.moved;
  drag = null;
  if (wasDrag) return;
  const hit = pick(e.clientX, e.clientY);
  if (hit) travelTo(hit);
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  followTarget = null;
  const anchor = screenToWorld(e.clientX, e.clientY);
  camera.tz = Math.min(Math.max(camera.tz * Math.exp(-e.deltaY * 0.0013), overviewZoom() * 0.6), 10);
  // keep the world point under the cursor fixed while zooming
  const cos = Math.cos(-mapRotation), sin = Math.sin(-mapRotation);
  const rx = (e.clientX - W / 2) / camera.tz, ry = (e.clientY - H / 2) / camera.tz;
  camera.tx = anchor.x - (rx * cos - ry * sin);
  camera.ty = anchor.y - (rx * sin + ry * cos);
}, { passive: false });

/* ── Info panel ── */
const panel = document.getElementById('info-panel');
const panelType = document.getElementById('panel-type');
const panelName = document.getElementById('panel-name');
const panelClass = document.getElementById('panel-class');
const panelDistance = document.getElementById('panel-distance');
const panelSize = document.getElementById('panel-size');
const panelDesc = document.getElementById('panel-desc');
const hudCoords = document.getElementById('hud-coords');
const hudZoom = document.getElementById('hud-zoom');
const hudTarget = document.getElementById('hud-target');

const TYPE_LABEL = {
  galaxy: 'GALAXY',
  star: 'SUPERMASSIVE STAR',
  blackhole: 'BLACK HOLE',
  void: 'COSMIC VOID',
};

let typeTimer = null;

function openPanel(o) {
  const d = o.data;
  panelType.textContent = TYPE_LABEL[d.type];
  panelType.className = 'type-badge ' + d.type;
  panelName.textContent = d.name;
  panelClass.textContent = d.class + (o.parent ? '  ·  inside ' + o.parent.data.name : '');
  panelDistance.textContent = d.distance;
  panelSize.textContent = d.size;
  panel.classList.remove('hidden');

  // terminal typewriter
  clearInterval(typeTimer);
  panelDesc.textContent = '';
  let i = 0;
  typeTimer = setInterval(() => {
    panelDesc.textContent = d.desc.slice(0, ++i);
    if (i >= d.desc.length) clearInterval(typeTimer);
  }, 11);
}

function closePanel() {
  panel.classList.add('hidden');
  clearInterval(typeTimer);
}

document.getElementById('panel-close').addEventListener('click', () => {
  closePanel();
  selected = null;
  followTarget = null;
  hudTarget.textContent = '—';
});

document.getElementById('btn-overview').addEventListener('click', () => {
  closePanel();
  selected = null;
  panelPending = null;
  followTarget = null;
  hudTarget.textContent = '—';
  camera.tx = 0; camera.ty = 0;
  camera.tz = overviewZoom();
});

const btnSpin = document.getElementById('btn-spin');
btnSpin.addEventListener('click', () => {
  spinning = !spinning;
  btnSpin.textContent = spinning ? '⏸ SPIN' : '▶ SPIN';
});

/* ── Destinations nav ── */
const destNav = document.getElementById('destinations');
const destList = document.getElementById('dest-list');
document.getElementById('dest-toggle').addEventListener('click', () => {
  destNav.classList.toggle('open');
});

{
  const addGroup = (label) => {
    const h = document.createElement('li');
    h.className = 'dest-group';
    h.textContent = label;
    destList.appendChild(h);
  };
  const addItem = (o, isChild) => {
    const li = document.createElement('li');
    li.className = 'dest-item' + (isChild ? ' child' : '');
    li.textContent = o.data.name;
    li.addEventListener('click', () => travelTo(o));
    destList.appendChild(li);
  };

  // galaxies with their interior objects nested beneath them
  addGroup('GALAXIES');
  for (const g of objects.filter((o) => o.data.type === 'galaxy')) {
    addItem(g, false);
    for (const c of objects.filter((o) => o.parent === g)) addItem(c, true);
  }
  addGroup('DEEP SPACE');
  for (const o of objects) {
    if (!o.parent && o.data.type === 'blackhole') addItem(o, false);
  }
  addGroup('COSMIC VOIDS');
  for (const o of objects) {
    if (o.data.type === 'void') addItem(o, false);
  }
}

/* ── Main loop ──
   Split into single-purpose steps so `frame` stays a short orchestrator:
   physics → camera → arrival check → render → HUD text. */
let lastT = performance.now();

function updatePhysics(dt) {
  if (spinning) mapRotation += MAP_SPIN_SPEED * dt;
  for (const o of objects) {
    o.angle += o.data.spinSpeed * dt;
    if (o.disk) for (const p of o.disk) p.a += p.speed * dt;
  }
}

function updateCamera(dt) {
  // camera follows its target as it orbits inside a spinning galaxy
  if (followTarget) {
    const wp = worldPos(followTarget);
    camera.tx = wp.x;
    camera.ty = wp.y;
  }

  // ease camera toward targets (frame-rate independent)
  const k = 1 - Math.exp(-dt * 0.004);
  camera.x += (camera.tx - camera.x) * k;
  camera.y += (camera.ty - camera.y) * k;
  camera.zoom += (camera.tz - camera.zoom) * k;
}

function checkArrival() {
  if (!panelPending) return;
  const closePos = Math.hypot(camera.x - camera.tx, camera.y - camera.ty) < 30 / camera.zoom;
  const closeZoom = Math.abs(camera.zoom - camera.tz) < camera.tz * 0.04;
  if (closePos && closeZoom) {
    openPanel(panelPending);
    panelPending = null;
  }
}

function labelVisibility(o) {
  const hl = o === hovered || o === selected;
  if (o.parent) return childAlpha(o) > 0.6 ? hl : null; // interior labels only once revealed
  return camera.zoom < 1.1 || hl ? hl : null;
}

function renderScene(t) {
  ctx.fillStyle = COLOR.bg;
  ctx.fillRect(0, 0, W, H);
  drawStars(t);

  for (const o of objects) if (o.data.type === 'void') drawVoid(o, t);
  for (const o of objects) if (o.data.type === 'galaxy') drawGalaxy(o, t);
  for (const o of objects) if (o.data.type === 'star') drawStarObj(o, t);
  for (const o of objects) if (o.data.type === 'blackhole') drawBlackHole(o, t);

  for (const o of objects) {
    const hl = labelVisibility(o);
    if (hl !== null) drawLabel(o, hl);
  }

  if (selected) drawSelectionRing(selected, t);
}

function updateHud() {
  hudCoords.textContent = `${Math.round(camera.x)} : ${Math.round(camera.y)}`;
  hudZoom.textContent = camera.zoom.toFixed(2) + '×';
}

function frame(t) {
  const dt = Math.min(t - lastT, 50);
  lastT = t;

  updatePhysics(dt);
  updateCamera(dt);
  checkArrival();
  renderScene(t);
  updateHud();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

/* Deep links: ?goto=<object-id> flies there on load, e.g. ?goto=ton-618.
   Add &snap=1 to jump instantly instead of flying. */
{
  const params = new URLSearchParams(location.search);
  const id = params.get('goto');
  if (id && byId.has(id)) {
    const o = byId.get(id);
    travelTo(o);
    if (params.has('snap')) {
      camera.x = camera.tx;
      camera.y = camera.ty;
      camera.zoom = camera.tz;
      panelPending = null;
      openPanel(o);
    }
  }
}
