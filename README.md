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
src/components/    Seo, Header, Footer
src/pages/         una ruta por fichero; robots.txt se genera desde robots.txt.ts
```

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
