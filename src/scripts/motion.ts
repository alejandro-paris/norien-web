// Animaciones de la portada: scroll suave (Lenis) + escenas con scroll (GSAP ScrollTrigger)
// y la línea guía que acompaña al usuario desde el hero hasta el vídeo demo.
// Todo el contenido existe en el HTML; aquí solo se anima. Sin la clase `motion`
// (JS desactivado o prefers-reduced-motion) la página queda estática y completa.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

const root = document.documentElement;
const motion = root.classList.contains('motion');
if (motion) window.__motionReady = true;

const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Cabecera: fondo al hacer scroll.
const header = $('[data-header]');
const updateHeader = () => header?.toggleAttribute('data-scrolled', window.scrollY > 20);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (motion) {
  gsap.registerPlugin(ScrollTrigger);
  setupSmoothScroll();
  darkHeader();
  heroIntro();
  statementScene();
  guideLine();
  goldScene();
  demoScene();
  solutionsScene();
  reveals();
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

function setupSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Enlaces internos (#seccion) con el mismo scroll suave.
  for (const link of $$<HTMLAnchorElement>('a[href*="#"]')) {
    const url = new URL(link.href);
    if (url.pathname !== location.pathname || !url.hash) continue;
    link.addEventListener('click', (event) => {
      const target = $(url.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { duration: 1.6 });
      history.pushState(null, '', url.hash);
    });
  }
}

/** La cabecera pasa a oscuro mientras hay una sección oscura debajo. */
function darkHeader() {
  if (!header) return;
  for (const section of $$('[data-dark]')) {
    ScrollTrigger.create({
      trigger: section,
      start: () => `top ${header.offsetHeight}px`,
      end: () => `bottom ${header.offsetHeight}px`,
      onToggle: ({ isActive }) => header.toggleAttribute('data-on-dark', isActive),
    });
  }
}

/** Entrada del titular. */
function heroIntro() {
  gsap.fromTo(
    '[data-hero] [data-word]',
    { y: 0, yPercent: 110 },
    { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.06, delay: 0.1 },
  );
  gsap.to('[data-hero] [data-intro]', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.55 });
}

/** Párrafo que se ilumina palabra a palabra al pasar la línea. */
function statementScene() {
  gsap.to('[data-reveal-word]', {
    opacity: 1,
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: { trigger: '[data-statement-text]', start: 'top 75%', end: 'bottom 50%', scrub: true },
  });
}

/**
 * Línea de puntos que baja por el margen izquierdo, se dibuja con el scroll y
 * "desbloquea" cada nodo (servicios, cada paso del chat, sistema) hasta el vídeo.
 */
function guideLine() {
  const wrap = $('[data-guide-wrap]');
  const svg = $<SVGSVGElement>('[data-guide]');
  const startEl = $('[data-guide-start]');
  const statement = $('[data-statement-text]');
  const after = $('[data-guide-after]');
  const demo = $('[data-demo]');
  if (!wrap || !svg || !startEl || !statement || !after || !demo) return;

  const track = $<SVGPathElement>('[data-guide-track]', svg)!;
  const path = $<SVGPathElement>('[data-guide-path]', svg)!;
  const mask = $<SVGPathElement>('[data-guide-mask]', svg)!;
  const nodesGroup = $<SVGGElement>('[data-guide-nodes]', svg)!;
  const tip = $<SVGGElement>('[data-guide-tip]', svg)!;
  const nodeEls = $$('[data-guide-node]', wrap);
  const finalLine = $('[data-guide-final]');
  const finalNode = $('[data-guide-final-node]');

  const story = $('[data-story]');
  const steps = story ? $$('[data-step]', story) : [];
  const bars = story ? $$('[data-progress]', story) : [];
  const setChatStep = story ? chatController(story) : () => {};

  let length = 0;
  let samples: number[] = []; // y de la línea cada SAMPLE px de longitud
  let nodes: { y: number; g: SVGGElement; el: HTMLElement }[] = [];
  let stepYs: number[] = [];
  let endY = 0;
  let finalMax = 0;
  const SAMPLE = 6;

  const tipRatio = () => (window.innerWidth < 768 ? 0.72 : 0.6);

  const build = () => {
    const w = wrap.getBoundingClientRect();
    const rel = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - w.left, y: r.top - w.top, w: r.width, h: r.height };
    };
    svg.setAttribute('width', String(w.width));
    svg.setAttribute('height', String(w.height));

    const gx = Math.max(0, (w.width - 1280) / 2) + (w.width >= 768 ? 48 : 22);
    const s = rel(startEl);
    const p0 = { x: s.x + s.w / 2, y: s.y + s.h / 2 };
    const p1 = { x: gx, y: rel(statement).y - 12 };
    const a = rel(after);
    const p2 = { x: gx, y: a.y + a.h + 56 };
    const p3 = { x: w.width / 2, y: rel(demo).y };
    const curve = (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const dy = (to.y - from.y) / 2;
      return `C${from.x},${from.y + dy} ${to.x},${to.y - dy} ${to.x},${to.y}`;
    };
    const d = `M${p0.x},${p0.y} ${curve(p0, p1)} L${p2.x},${p2.y} ${curve(p2, p3)}`;
    for (const p of [track, path, mask]) p.setAttribute('d', d);

    length = path.getTotalLength();
    mask.style.strokeDasharray = `${length} ${length}`;
    samples = [];
    for (let l = 0; l <= length; l += SAMPLE) samples.push(path.getPointAtLength(l).y);
    endY = p3.y;

    nodesGroup.replaceChildren();
    nodes = nodeEls.map((el) => {
      const r = rel(el);
      const y = r.y + r.h / 2;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${gx} ${y})`);
      g.innerHTML = '<circle class="guide-node-halo" r="16"></circle><circle class="guide-node" r="7"></circle>';
      nodesGroup.append(g);
      return { y, g, el };
    });
    stepYs = nodes.filter((n) => n.el.closest('[data-step]')).map((n) => n.y);
    const goldNode = nodes.find((n) => n.el.closest('[data-system]'));
    if (goldNode) stepYs.push(goldNode.y);

    if (finalLine && finalNode) {
      finalMax = finalNode.getBoundingClientRect().top - finalLine.parentElement!.getBoundingClientRect().top + 6;
    }
    update();
  };

  // Longitud de la línea en la que su altura alcanza `y` (la línea siempre baja).
  const lengthAtY = (y: number) => {
    let lo = 0;
    let hi = samples.length - 1;
    if (y <= samples[0]) return 0;
    if (y >= samples[hi]) return length;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid] < y) lo = mid;
      else hi = mid;
    }
    return lo * SAMPLE;
  };

  const update = () => {
    if (!length) return;
    const ratio = tipRatio();
    const tipY = window.innerHeight * ratio - wrap.getBoundingClientRect().top;
    const len = lengthAtY(tipY);
    mask.style.strokeDashoffset = String(length - len);
    const pt = path.getPointAtLength(len);
    tip.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    tip.style.opacity = len > 0 && tipY < endY ? '1' : '0';

    for (const n of nodes) {
      const on = tipY >= n.y;
      n.g.toggleAttribute('data-active', on);
      n.el.classList.toggle('!text-ink', on && !n.el.closest('[data-step]'));
    }

    // Paso activo del chat = nodos de paso ya alcanzados.
    let active = 0;
    stepYs.slice(0, steps.length).forEach((y, i) => {
      if (tipY >= y) active = i + 1;
      bars[i] && gsap.set(bars[i], { scaleX: clamp((tipY - y) / (stepYs[i + 1] - y)) });
    });
    steps.forEach((s, i) => s.toggleAttribute('data-active', i + 1 === active));
    setChatStep(active);

    // Tramo final dentro de la sección del vídeo.
    if (finalLine && finalNode) {
      const top = finalLine.parentElement!.getBoundingClientRect().top;
      const h = clamp(window.innerHeight * ratio - top, 0, finalMax);
      finalLine.style.height = `${h}px`;
      finalNode.toggleAttribute('data-active', h >= finalMax - 1);
    }
  };

  build();
  let raf = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(build);
  }).observe(wrap);
  document.fonts.ready.then(build);
  gsap.ticker.add(update);
}

/** Chat de servicios: avanza mensaje a mensaje (con "escribiendo…") al cambiar de paso. */
function chatController(scope: HTMLElement) {
  const msgs = $$('[data-msg]', scope);
  const pills = $$('[data-pill]', scope);
  const typing = $('[data-typing]', scope)!;
  gsap.set(msgs, { height: 0, autoAlpha: 0 });
  gsap.set(pills, { autoAlpha: 0, y: 14 });
  gsap.set(typing, { display: 'block', height: 0, autoAlpha: 0 });

  let shown = 0;
  let tl: gsap.core.Timeline | undefined;

  return (target: number) => {
    if (target === shown) return;
    tl?.progress(1).kill();

    if (target < shown) {
      gsap.to(
        msgs.filter((m) => Number(m.dataset.msg) > target),
        { height: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' },
      );
      pills.forEach((p, i) => gsap.to(p, { autoAlpha: i + 1 === target ? 1 : 0, y: 0, duration: 0.3 }));
      shown = target;
      return;
    }

    tl = gsap.timeline();
    const skipping = target - shown > 1;
    for (let s = shown + 1; s <= target; s++) {
      if (pills[s - 2]) tl.to(pills[s - 2], { autoAlpha: 0, y: -10, duration: 0.25 }, tl.duration());
      for (const m of msgs.filter((el) => Number(el.dataset.msg) === s)) {
        if (m.dataset.from === 'them' && !skipping) {
          tl.to(typing, { height: 'auto', autoAlpha: 1, duration: 0.2 }, '+=0.2')
            .to({}, { duration: 0.6 })
            .to(typing, { height: 0, autoAlpha: 0, duration: 0.1 });
        }
        tl.fromTo(
          m,
          { height: 0, autoAlpha: 0, y: 14 },
          { height: 'auto', autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          m.dataset.from === 'me' ? '+=0.35' : '>',
        );
      }
      tl.fromTo(
        pills[s - 1],
        { autoAlpha: 0, y: 14, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.15',
      );
    }
    if (skipping) tl.timeScale(3);
    shown = target;
  };
}

/** Sección dorada: se abre como una ventana y las palabras entran desde los lados. */
function goldScene() {
  const section = $('[data-system]');
  if (!section) return;
  gsap.fromTo(
    section,
    { clipPath: 'inset(0px 32px 0px 32px round 48px)' },
    {
      clipPath: 'inset(0px 0px 0px 0px round 0px)',
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 20%', scrub: true },
    },
  );
  for (const word of $$('[data-slide]', section)) {
    const dir = Number(word.dataset.slide);
    gsap.fromTo(
      word,
      { xPercent: 35 * dir },
      { xPercent: 0, ease: 'none', scrollTrigger: { trigger: word, start: 'top bottom', end: 'top 65%', scrub: true } },
    );
  }
}

/** Demo: el vídeo crece desde una tarjeta hasta ocupar la pantalla. */
function demoScene() {
  const demo = $('[data-demo]');
  if (!demo) return;
  const small = window.innerWidth < 768;
  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: demo, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    })
    .fromTo(
      '[data-demo-frame]',
      { scale: small ? 0.82 : 0.5, borderRadius: small ? 24 : 56 },
      { scale: 1, borderRadius: 0, duration: 1, ease: 'power1.inOut' },
    )
    .to(['[data-demo-copy]', '[data-guide-final]'], { autoAlpha: 0, y: -40, duration: 0.3 }, 0.2)
    .to({}, { duration: 0.35 });
}

/** Tarifas: la tarjeta sube suavemente al entrar. */
function solutionsScene() {
  const card = $('[data-rise-card]');
  if (!card) return;
  gsap.fromTo(
    card,
    { y: 120, scale: 0.94 },
    { y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'center 60%', scrub: true } },
  );
}

/** Aparición suave de bloques sueltos. */
function reveals() {
  ScrollTrigger.batch('[data-reveal], [data-fact]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }),
  });
}
