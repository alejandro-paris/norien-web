# norien-web

Web pública de Norien ([norien.es](https://norien.es)). Sitio estático generado con [Astro](https://astro.build) y Tailwind CSS 4.

## Desarrollo

Requiere Node 22.12 o superior.

```sh
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # comprobación de tipos (astro check) + build en dist/
npm run preview  # sirve dist/ en local
```

## Estructura

```
public/            ficheros servidos tal cual (favicon, CNAME, fuentes)
src/site.ts        datos globales: nombre, descripción SEO, email, teléfono
src/styles/        CSS global y tokens de marca (@theme de Tailwind)
src/layouts/       BaseLayout: <head>, SEO, cabecera y pie
src/components/    Seo, Header, Footer, Compass (símbolo), SplitWords, SectionLabel (etiqueta de sección)
src/components/sections/  secciones de la portada (Hero, Demo, LogoStrip, Statement, ServiceCards, SystemGold, Pricing, Solutions, Contact)
src/scripts/motion.ts     animaciones con scroll (GSAP ScrollTrigger + Lenis) y línea guía (solo portada)
src/scripts/header.ts     cabecera: fondo al hacer scroll y modo oscuro (todas las páginas)
src/pages/         una ruta por fichero; robots.txt se genera desde robots.txt.ts
                   aviso-legal.md y privacidad.md: textos legales en Markdown (plantilla LegalLayout);
                   el enlace «Cookies» del pie apunta a /privacidad#cookies
```

## Animaciones

La portada está pensada como una página de lanzamiento: secciones que se quedan fijas
(`position: sticky`) mientras el scroll avanza una línea de tiempo de GSAP.

- Todo el contenido está en el HTML; el JS solo anima. Un script en línea añade la clase
  `motion` a `<html>` si el usuario no pide movimiento reducido. Los estilos que dependen
  de ella usan la variante de Tailwind `motion:` (p. ej. `motion:h-[600vh]` para alargar
  una sección animada). Sin JS o con `prefers-reduced-motion`, la página es estática y completa.
- Los elementos animados se marcan con atributos `data-*` (`data-hero`, `data-story`,
  `data-step`, `data-card`, `data-reveal`…) y `src/scripts/motion.ts` los busca.
- La cabecera se vuelve oscura sobre cualquier sección con `data-dark` (también sin animaciones).

### Línea guía

Una línea de puntos sale de "Mira cómo funciona" (hero), baja por el lateral del vídeo y sigue por el margen izquierdo hasta la sección de precios
(SVG dentro de `[data-guide-wrap]` en `src/pages/index.astro`). Se dibuja con el scroll:
su punta va siempre al 60 % de la altura de la pantalla (72 % en móvil).

- El trazado se calcula en JS a partir de los elementos de la página, así que se adapta
  solo al contenido y al tamaño de pantalla. Las secciones que recorre usan la clase
  `.guide-container`, que deja libre el margen izquierdo (su ancho máximo debe coincidir con
  `GUIDE_MAX` en `motion.ts`). Sobre secciones `data-dark` la línea se pinta en dorado.
- Cualquier elemento con `data-guide-node` crea un nodo que se enciende al llegar la línea.

### Servicios

Cuatro tarjetas que se apilan (`position: sticky` con un `top` creciente). Cada una
tiene una mini demo (`[data-card-demo]`) cuyas piezas (`data-d="…"`) se animan ligadas
al scroll mientras la tarjeta sube a su sitio, nunca con temporizador: quien baja rápido
ve el resultado final y quien sube lo ve retroceder. Como las tarjetas fijas se miden mal,
los disparadores son marcas en el flujo (`[data-card-marker]`), que también hacen de nodos
de la línea guía.
- Termina en la sección marcada con `data-guide-end` (precios); el último tramo va dentro
  de esa sección (`data-guide-final`), que tapa la línea del resto de la página.

## Vídeo demo

Los vídeos están en `public/video/` y se configuran en `demoVideo` de `src/site.ts`:

```ts
demoVideo: {
  src: '/video/norien-demo.mp4',          // 1080p, pantallas de 1024 px o más
  srcSmall: '/video/norien-demo-720.mp4', // 720p, pantallas pequeñas
  poster: '/video/norien-demo-poster.jpg',
  ratio: 16 / 9,
},
```

Para regenerar la versión 720p a partir del original:

```sh
ffmpeg -i norien-demo.mp4 -vf scale=-2:720 -c:v libx264 -profile:v high -preset slow -crf 25 \
  -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart norien-demo-720.mp4
```

Encima del vídeo hay un botón de play grande; al pulsarlo aparecen los controles normales y
vuelve al terminar. El vídeo se pausa solo al salir de la sección.

## Cookies

La web no instala cookies ni usa `localStorage`/`sessionStorage`, y no hace peticiones a
dominios externos (fuentes, vídeo y logos se sirven desde el propio sitio). Comprobado en
el build de producción el 8/10/2026. Si se añade analítica, un mapa, un vídeo incrustado de
terceros, etc., hay que revisar la sección de cookies de `privacidad.md` y, si instala
cookies no técnicas, añadir un aviso de consentimiento.

## Maquetación

- `.page-container` y `.guide-container` (en `global.css`) limitan el contenido a 76rem y
  aumentan el margen lateral en pantallas grandes.
- Las secciones principales (Cómo trabajamos, Qué hacemos) empiezan con
  `<SectionLabel label="…" />`: pequeño cuadrado dorado + nombre de la sección.

## Marca

Tokens definidos en `src/styles/global.css`:

| Token        | Valor     | Uso                               |
| ------------ | --------- | --------------------------------- |
| `paper`      | `#f7f5f0` | Fondo (blanco roto)               |
| `paper-deep` | `#efece4` | Fondos secundarios                |
| `ink`        | `#050a30` | Texto principal y acentos oscuros |
| `ink-soft`   | `#3d4260` | Texto secundario                  |
| `gold`       | `#c5a059` | Acento de marca                   |
| `gold-hover` | `#b08d45` | Estado hover del acento           |

Tipografías: Inter (texto, `font-sans`) y Space Grotesk (titulares, `font-display`).

El dorado sobre el fondo claro tiene poco contraste: úsalo para detalles, bordes o fondos, no para texto pequeño.

## SEO

- HTML estático por página (sin renderizado en cliente), indexable directamente.
- `src/components/Seo.astro`: título, descripción, canonical, Open Graph, Twitter y JSON-LD (`ProfessionalService`). Cada página puede pasar `title`, `description`, `image` y `noindex` a `BaseLayout`.
- Sitemap automático (`@astrojs/sitemap`) y `robots.txt` apuntando a él.
- Pendiente: imagen Open Graph por defecto.

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) compila y publica en GitHub Pages en cada push a `main`. Dominio configurado con `public/CNAME`.
