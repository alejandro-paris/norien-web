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
  // Vídeo demo de la sección oscura. Mientras sea null se muestra un marcador.
  // Ej.: { src: '/video/demo.mp4', poster: '/video/demo-poster.jpg' }
  demoVideo: null as { src: string; poster?: string } | null,
} as const;

export const NAV = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Demo', href: '/#demo' },
  { label: 'Precios', href: '/#soluciones' },
  { label: 'Contacto', href: '/#contacto' },
] as const;
