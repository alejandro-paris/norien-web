// Datos globales del sitio: una sola fuente para SEO, cabecera, pie y contacto.
export const SITE = {
  name: 'Norien',
  defaultTitle: 'Norien | Automatización de WhatsApp con IA para PYMES',
  description:
    'Automatizamos WhatsApp con IA para negocios de citas, reservas y membresías: respuesta 24/7, agenda automática, campañas de reactivación y cobros sin fricción.',
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
  { label: 'Tarifas', href: '/#soluciones' },
  { label: 'Contacto', href: '/#contacto' },
] as const;
