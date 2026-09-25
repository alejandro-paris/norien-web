// Animaciones de la portada: scroll suave (Lenis) + escenas con scroll (GSAP ScrollTrigger).
// Todo el contenido existe en el HTML; aquí solo se anima. Sin la clase `motion`
// (JS desactivado o prefers-reduced-motion) la página queda estática y completa.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { CompassState } from './compass3d';

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

// Cabecera: fondo al hacer scroll.
const header = $('[data-header]');
const updateHeader = () => header?.toggleAttribute('data-scrolled', window.scrollY > 20);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Estado de la brújula 3D: posición inicial (tumbada, en la parte baja del hero).
const compass: CompassState = { rotX: -1.15, rotY: 0.4, y: -0.58, scale: 0.9, needle: 0 };
if (!motion) Object.assign(compass, { rotX: -0.9, rotY: 0.3, y: -0.7 });
mountCompass();

if (motion) {
  gsap.registerPlugin(ScrollTrigger);
  darkHeader();
  setupSmoothScroll();
  heroScene();
  statementScene();
  storyScene();
  goldScene();
  demoScene();
  solutionsScene();
  reveals();
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

function mountCompass() {
  const canvas = $<HTMLCanvasElement>('[data-compass]');
  if (!canvas || !hasWebGL()) return;
  import('./compass3d').then(({ mountCompass }) => {
    mountCompass(canvas, compass, motion);
    canvas.classList.remove('opacity-0');
    $('.compass-fallback')?.classList.add('opacity-0');
  });
}

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
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

/** Hero: entrada del titular y la brújula que se levanta y gira con el scroll. */
function heroScene() {
  gsap.fromTo('[data-hero] [data-word]', { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.06, delay: 0.1 });
  gsap.to('[data-hero] [data-intro]', { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.55 });

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom bottom', scrub: 0.8 },
    })
    .to('[data-hero-copy]', { yPercent: -35, autoAlpha: 0, duration: 0.45 }, 0)
    .to('[data-scroll-hint]', { autoAlpha: 0, duration: 0.1 }, 0)
    .to(compass, { rotX: 0, rotY: Math.PI * 2, y: 0, scale: 1.5, needle: Math.PI * 2, duration: 1, ease: 'power1.inOut' }, 0)
    .to('.compass-fallback', { autoAlpha: 0, duration: 0.3 }, 0);
}

/** Párrafo que se ilumina palabra a palabra. */
function statementScene() {
  gsap.to('[data-reveal-word]', {
    opacity: 1,
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: { trigger: '[data-statement]', start: 'top 35%', end: 'bottom bottom', scrub: true },
  });
}

/** Servicios: el teléfono se gira y la conversación avanza por pasos. */
function storyScene() {
  const story = $('[data-story]');
  if (!story) return;
  const phone = $('[data-phone]', story)!;
  const steps = $$('[data-step]', story);
  const cards = $$('[data-card]', story);
  const bars = $$('[data-progress]', story);
  const msgs = $$('[data-msg]', story);

  // Orientación del teléfono en cada paso: se balancea para mostrar volumen.
  const poses = [
    { rotateY: -20, rotateX: 6 },
    { rotateY: 16, rotateX: 4 },
    { rotateY: -12, rotateX: -4 },
    { rotateY: 8, rotateX: 5 },
  ];

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: story, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  });

  gsap.set(steps, { autoAlpha: 0 });
  tl.fromTo(
    phone,
    { rotateY: 200, rotateX: 16, rotateZ: -10, y: 60, scale: 0.85 },
    { ...poses[0], rotateZ: 0, y: 0, scale: 1, duration: 1.2, ease: 'power2.inOut' },
  );

  steps.forEach((step, i) => {
    const at = 1 + i * 1.6;
    if (i > 0) {
      tl.to(steps[i - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, at);
      tl.to(cards[i - 1], { autoAlpha: 0, z: 260, y: -30, duration: 0.35 }, at);
      tl.to(phone, { ...poses[i], duration: 1.2, ease: 'sine.inOut' }, at);
    }
    tl.fromTo(step, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35 }, at + (i > 0 ? 0.25 : 0));
    tl.to(bars[i], { scaleX: 1, duration: 1.5 }, at);

    msgs
      .filter((m) => m.dataset.msg === String(i + 1))
      .forEach((m, k) => {
        tl.fromTo(m, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.22 }, at + 0.1 + k * 0.26);
      });

    tl.fromTo(
      cards[i],
      { autoAlpha: 0, z: -320, y: 50, rotateX: 30 },
      { autoAlpha: 1, z: 120, y: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' },
      at + 0.45,
    );
  });

  tl.to({}, { duration: 0.5 });
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
    .to('[data-demo-copy]', { autoAlpha: 0, y: -40, duration: 0.3 }, 0.2)
    .to({}, { duration: 0.35 });
}

/** Tarifas: la tarjeta se endereza en 3D al entrar. */
function solutionsScene() {
  const card = $('[data-tilt-card]');
  if (!card) return;
  gsap.fromTo(
    card,
    { rotateX: 32, rotateY: -16, y: 140, scale: 0.9 },
    {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'center 55%', scrub: true },
    },
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
