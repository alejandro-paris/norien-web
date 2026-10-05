// Datos globales del sitio: una sola fuente para SEO, cabecera, pie y contacto.
export const SITE = {
  name: 'Norien',
  defaultTitle: 'Norien | Tu WhatsApp contesta, da citas y cobra por ti',
  description:
    'Montamos un asistente en el WhatsApp de tu negocio que contesta a cualquier hora, da citas, avisa a tus clientes y cobra por el mismo chat. Primera auditoría gratis.',
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
  { label: 'Precios', href: '/#soluciones' },
  { label: 'Contacto', href: '/#contacto' },
] as const;
