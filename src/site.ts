// Datos globales del sitio: una sola fuente para SEO, cabecera, pie y contacto.
export const SITE = {
  name: 'Norien',
  defaultTitle: 'Norien | Tú atiendes a quien tienes delante. Del resto nos ocupamos nosotros',
  description:
    'Contestamos a tus clientes por WhatsApp, Instagram o teléfono, les damos cita, les recordamos lo pendiente y les mandamos la promoción que les toca. Auditoría gratis de 30 minutos.',
  email: 'info@norien.es',
  phone: '+34644980352',
  phoneDisplay: '+34 644 98 03 52',
  whatsappUrl: 'https://wa.me/34644980352',
  // Vídeo demo de la sección oscura (null = se muestra un marcador).
  // `ratio` es ancho/alto del vídeo, para que el marco no lo recorte.
  demoVideo: {
    src: '/video/norien-demo.mp4',
    poster: '/video/norien-demo-poster.jpg',
    ratio: 1776 / 854,
  } as { src: string; poster?: string; ratio: number } | null,
} as const;

export const NAV = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Demo', href: '/#demo' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Contacto', href: '/#contacto' },
] as const;
