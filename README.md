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
src/components/    Seo, Header, Footer, Compass (símbolo), SplitWords
src/components/sections/  secciones de la portada (Hero, Statement, ChatStory, SystemGold, Demo, Solutions, Contact)
src/scripts/motion.ts     animaciones con scroll (GSAP ScrollTrigger + Lenis) y línea guía
src/pages/         una ruta por fichero; robots.txt se genera desde robots.txt.ts
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
- La cabecera se vuelve oscura sobre cualquier sección con `data-dark`.

### Línea guía

Una línea de puntos baja por el margen izquierdo desde el hero hasta el vídeo demo
(SVG dentro de `[data-guide-wrap]` en `src/pages/index.astro`). Se dibuja con el scroll:
su punta va siempre al 60 % de la altura de la pantalla (72 % en móvil).

- El trazado se calcula en JS a partir de los elementos de la página, así que se adapta
  solo al contenido y al tamaño de pantalla. Las secciones que recorre usan la clase
  `.guide-container`, que deja libre el margen izquierdo.
- Cualquier elemento con `data-guide-node` crea un nodo que se enciende al llegar la línea.
  Los nodos dentro de `[data-step]` controlan el chat de servicios: cada uno avanza la
  conversación un paso (mensajes, "escribiendo…" y etiqueta flotante).
- El último tramo va dentro de la sección del vídeo (`data-guide-final`) para que siga
  fijo mientras el vídeo crece.

## Vídeo demo

Copia el vídeo en `public/video/` y rellena `demoVideo` en `src/site.ts`:

```ts
demoVideo: { src: '/video/demo.mp4', poster: '/video/demo-poster.jpg' },
```

Recomendado: MP4 H.264, 1080p, menos de ~15 MB, y un póster JPG del primer fotograma.

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
