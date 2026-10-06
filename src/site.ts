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
  // Vídeo demo (null = se muestra un marcador). `srcSmall` es la versión 720p que cargan
  // las pantallas de menos de 1024 px. `ratio` es ancho/alto, para que el marco no lo recorte.
  demoVideo: {
    src: '/video/norien-demo.mp4',
    srcSmall: '/video/norien-demo-720.mp4',
    poster: '/video/norien-demo-poster.jpg',
    ratio: 16 / 9,
  } as { src: string; srcSmall?: string; poster?: string; ratio: number } | null,
} as const;

export const NAV = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Contacto', href: '/#contacto' },
] as const;

export const LEGAL = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Cookies', href: '/cookies' },
] as const;
