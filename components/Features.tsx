import React from 'react';
import { MessageSquare, CalendarCheck, Workflow } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-norien-gold/40 hover:bg-white/[0.04] transition-all duration-500">
    <div className="w-12 h-12 rounded-lg bg-norien-gold/10 flex items-center justify-center text-norien-gold mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-norien-gold transition-colors">
        {title}
    </h3>
    <p className="text-norien-silver leading-relaxed text-sm md:text-base">
        {description}
    </p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros servicios</h2>
            <div className="h-1 w-20 bg-norien-gold"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<MessageSquare size={24} />}
                title="Disponibilidad Total"
                description="Respuesta inmediata en WhatsApp 24/7. Ni un solo cliente potencial sin atender."
            />
            <FeatureCard 
                icon={<CalendarCheck size={24} />}
                title="Agendamiento Inteligente"
                description="Sincronización automática con tu calendario. Citas confirmadas sin intervención manual."
            />
            <FeatureCard 
                icon={<Workflow size={24} />}
                title="Automatización de Procesos"
                description="Eliminación de tareas repetitivas. Facturación, reportes y gestión de datos sin errores humanos."
            />
        </div>
      </div>
    </section>
  );
};