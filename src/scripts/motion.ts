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

// Cabecera: fondo al hacer scroll y versión oscura mientras hay una sección oscura debajo.
const header = $('[data-header]');
const darkSections = $$('[data-dark]');
const updateHeader = () => {
  if (!header) return;
  header.toggleAttribute('data-scrolled', window.scrollY > 20);
  const line = header.offsetHeight / 2;
  header.toggleAttribute(
    'data-on-dark',
    darkSections.some((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= line && r.bottom >= line;
    }),
  );
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Vídeo demo: se pausa solo si el usuario sale de la sección mientras se reproduce.
const demoVideo = $<HTMLVideoElement>('[data-demo-video]');
if (demoVideo) {
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && !demoVideo.paused) demoVideo.pause();
  }).observe(demoVideo);
}

if (motion) {
  gsap.registerPlugin(ScrollTrigger);
  setupSmoothScroll();
  heroIntro();
  statementScene();
  guideLine();
  servicesScene();
  goldScene();
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

/** Entrada del titular. */
function heroIntro() {
  const trigger = { trigger: '[data-hero]', start: 'top 75%', once: true };
  gsap.fromTo(
    '[data-hero] [data-word]',
    { y: 0, yPercent: 110 },
    { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.06, scrollTrigger: trigger },
  );
  gsap.to('[data-hero] [data-intro]', {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.15,
    delay: 0.45,
    scrollTrigger: trigger,
  });
}

/** Párrafo que se ilumina palabra a palabra al pasar la línea. */
function statementScene() {
  gsap.to('[data-reveal-word]', {
    opacity: 1,
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: { trigger: '[data-statement-text]', start: 'top 80%', end: 'bottom 65%', scrub: true },
  });
}

/**
 * Línea de puntos que baja por el margen izquierdo, se dibuja con el scroll y
 * "desbloquea" cada nodo (servicios, cada tarjeta, sistema) hasta el vídeo.
 */
function guideLine() {
  const wrap = $('[data-guide-wrap]');
  const svg = $<SVGSVGElement>('[data-guide]');
  const startEl = $('[data-guide-start]');
  const statement = $('[data-statement-text]');
  const after = $('[data-guide-after]');
  const end = $('[data-guide-end]');
  if (!wrap || !svg || !startEl || !statement || !after || !end) return;

  const track = $<SVGPathElement>('[data-guide-track]', svg)!;
  const path = $<SVGPathElement>('[data-guide-path]', svg)!;
  const mask = $<SVGPathElement>('[data-guide-mask]', svg)!;
  const nodesGroup = $<SVGGElement>('[data-guide-nodes]', svg)!;
  const tip = $<SVGGElement>('[data-guide-tip]', svg)!;
  const nodeEls = $$('[data-guide-node]', wrap);
  const finalLine = $('[data-guide-final]');
  const finalNode = $('[data-guide-final-node]');


  let length = 0;
  let samples: number[] = []; // y de la línea cada SAMPLE px de longitud
  let nodes: { y: number; g: SVGGElement; el?: HTMLElement }[] = [];
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
    const p3 = { x: w.width / 2, y: rel(end).y };
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
    const addNode = (y: number, el?: HTMLElement) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${gx} ${y})`);
      g.innerHTML = '<circle class="guide-node-halo" r="16"></circle><circle class="guide-node" r="7"></circle>';
      nodesGroup.append(g);
      nodes.push({ y, g, el });
    };
    nodes = [];

    for (const el of nodeEls) {
      const r = rel(el);
      addNode(r.y + r.h / 2, el);
    }
    nodes.sort((a, b) => a.y - b.y);

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
      n.el?.classList.toggle('!text-ink', on);
    }

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

/**
 * Servicios: tarjetas que se apilan. Cada mini demo se monta mientras su tarjeta sube
 * hasta su sitio (ligado al scroll, no al tiempo) y la tarjeta anterior se encoge detrás.
 * Los disparadores son marcas en el flujo, porque las tarjetas fijas (sticky) se miden mal.
 */
function servicesScene() {
  const cards = $$('[data-service-card]');
  const markers = $$('[data-card-marker]');
  if (!cards.length || cards.length !== markers.length) return;

  const stickTop = (card: HTMLElement) => parseFloat(getComputedStyle(card).top) || 0;

  cards.forEach((card, i) => {
    const d = (name: string) => $$(`[data-d="${name}"]`, card);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: markers[i],
        start: 'top 85%',
        end: () => `top ${stickTop(card) + 40}px`,
        scrub: 0.4,
      },
    });
    const pop = { autoAlpha: 0, y: 14, scale: 0.97 };
    const show = { autoAlpha: 1, y: 0, scale: 1, duration: 1 };

    if (i === 0) {
      tl.fromTo(d('in'), pop, show)
        .fromTo(d('typing'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
        .to(d('typing'), { autoAlpha: 0, duration: 0.3 }, '+=0.7')
        .fromTo(d('out'), pop, show, '<')
        .fromTo(d('tag'), pop, show);
    } else if (i === 1) {
      tl.fromTo(d('slot'), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0.4)
        .fromTo(d('tag'), pop, show, '+=0.3');
    } else if (i === 2) {
      tl.fromTo(d('out'), pop, show)
        .fromTo(d('sent'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.15 })
        .fromTo(d('in'), pop, show)
        .fromTo(d('tag'), pop, show);
    } else {
      tl.fromTo(d('out'), pop, show)
        .fromTo(d('paid'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '+=0.6')
        .fromTo(d('tag'), pop, show);
    }

    // La tarjeta anterior se encoge un poco mientras la siguiente la tapa.
    if (i > 0) {
      gsap.to(cards[i - 1], {
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: markers[i],
          start: 'top bottom',
          end: () => `top ${stickTop(card)}px`,
          scrub: true,
        },
      });
    }
  });
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

/** Auditoría: la tarjeta sube suavemente al entrar. */
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
