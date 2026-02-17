
import React from 'react';
import { MessageSquare, CalendarCheck, Workflow, BadgeEuro } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className='group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-norien-gold/40 hover:bg-white/[0.04] transition-all duration-500'>
    <div className='w-12 h-12 rounded-lg bg-norien-gold/10 flex items-center justify-center text-norien-gold mb-6 group-hover:scale-110 transition-transform duration-500'>
      {icon}
    </div>
    <h3 className='text-xl font-semibold text-white mb-3 group-hover:text-norien-gold transition-colors'>
      {title}
    </h3>
    <p className='text-norien-silver leading-relaxed text-sm md:text-base'>
      {description}
    </p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id='servicios' className='py-24 md:py-32 relative scroll-mt-20'>
      <div className='container mx-auto px-6 md:px-12'>
        <div className='mb-5 md:mb-10'>
          <h2 className='text-3xl md:text-5xl font-bold mb-4 font-serif text-center'>
            Nuestros servicios
          </h2>
          <div className='h-1 w-20 mb-8 mx-auto bg-norien-gold'></div>
          <div className='width-full flex justify-center mb-4'>
            <div className='mx-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest text-norien-gold uppercase animate-fade-in-up'>
              <span className='w-1.5 h-1.5 rounded-full bg-norien-gold animate-pulse'></span>
              Un sistema completo
            </div>
          </div>
          <p className='text-xs text-norien-silver uppercase tracking-widest text-center'>
            Captar • Agendar • Reactivar • Cobrar
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <FeatureCard
            icon={<MessageSquare size={24} />}
            title='Atención 24/7 que convierte'
            description='Respuesta inmediata en WhatsApp + cualificación automática. Menos leads perdidos, más reservas/citas.'
          />
          <FeatureCard
            icon={<CalendarCheck size={24} />}
            title='Sistema de reservas y citas'
            description='Gestión automática del calendario. Confirmaciones, recordatorios y reprogramaciones sin intervención manual. Más asistencia, menos bajas.'
          />
          <FeatureCard
            icon={<Workflow size={24} />}
            title='Mensajería masiva con estrategia'
            description='Envío de mensajes a gran escala. Desarrollo de la oferta, copy y segmentación para llenar huecos y reactivar clientes.'
          />
          <FeatureCard
            icon={<BadgeEuro size={24} />}
            title='Cobro y seguimiento automático'
            description='Recordatorios a impagos y pago directo (Stripe) desde el chat. Menos fricción, más cobros a tiempo.'
          />
        </div>
      </div>
    </section>
  );
};
