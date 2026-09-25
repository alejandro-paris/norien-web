// Brújula de Norien en 3D (anillo azul + aguja dorada) para el hero.
// Se carga bajo demanda: Three.js no bloquea el primer pintado.
import {
  ACESFilmicToneMapping,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Path,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Shape,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Estado que anima el scroll (GSAP) y lee el bucle de render. */
export interface CompassState {
  rotX: number;
  rotY: number;
  /** Posición vertical, en fracción de la altura visible (-0.5 abajo … 0.5 arriba). */
  y: number;
  scale: number;
  needle: number;
}

const FOV = 30;
const CAMERA_Z = 10;

export function mountCompass(canvas: HTMLCanvasElement, state: CompassState, animate: boolean) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);

  const key = new DirectionalLight(0xfff1d6, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);

  // Anillo: corona circular extruida con bisel (proporciones del logo: 40.3 / 26.1).
  const ringShape = new Shape();
  ringShape.absarc(0, 0, 2, 0, Math.PI * 2, false);
  const hole = new Path();
  hole.absarc(0, 0, 1.3, 0, Math.PI * 2, true);
  ringShape.holes.push(hole);
  const ringGeo = new ExtrudeGeometry(ringShape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.07,
    bevelSegments: 8,
    curveSegments: 128,
  });
  ringGeo.center();
  const ring = new Mesh(
    ringGeo,
    new MeshPhysicalMaterial({
      color: 0x0a1250,
      metalness: 0.65,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    }),
  );

  // Aguja: rombo alargado, en diagonal como en el símbolo.
  const needleShape = new Shape();
  needleShape.moveTo(0, 1.25);
  needleShape.lineTo(0.2, 0);
  needleShape.lineTo(0, -1.25);
  needleShape.lineTo(-0.2, 0);
  needleShape.closePath();
  const needleGeo = new ExtrudeGeometry(needleShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 4,
  });
  needleGeo.center();
  const needle = new Mesh(
    needleGeo,
    new MeshPhysicalMaterial({ color: 0xc5a059, metalness: 1, roughness: 0.22, clearcoat: 0.6 }),
  );
  needle.position.z = 0.12;

  const needlePivot = new Group();
  needlePivot.add(needle);

  const compass = new Group();
  compass.add(ring, needlePivot);
  scene.add(compass);

  let visibleH = 1;
  let baseScale = 1;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    visibleH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
    const visibleW = visibleH * camera.aspect;
    // Diámetro del anillo (4 unidades) ≈ 46 % del alto o 70 % del ancho visible.
    baseScale = Math.min(visibleH * 0.46, visibleW * 0.7) / 4;
  };
  const render = (time: number) => {
    const t = time / 1000;
    const float = animate ? Math.sin(t * 0.9) * 0.012 : 0;
    compass.rotation.set(state.rotX + float * 2, state.rotY, 0);
    compass.position.y = (state.y + float) * visibleH;
    compass.scale.setScalar(baseScale * state.scale);
    // Aguja en diagonal (-45°) más el giro del scroll y un ligero balanceo.
    needlePivot.rotation.z = -Math.PI / 4 - state.needle + (animate ? Math.sin(t * 1.7) * 0.05 : 0);
    renderer.render(scene, camera);
  };

  resize();
  new ResizeObserver(() => {
    resize();
    if (!animate) render(0);
  }).observe(canvas);

  if (!animate) {
    render(0);
    return;
  }

  // Solo se renderiza mientras el canvas está en pantalla.
  let running = false;
  let frame = 0;
  const loop = (time: number) => {
    render(time);
    if (running) frame = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    cancelAnimationFrame(frame);
    if (running) frame = requestAnimationFrame(loop);
  }).observe(canvas);
}
