import React from 'react';
import { Button } from './Button';
import { ShieldCheck } from 'lucide-react';

interface PricingProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onScrollToSection }) => {
  return (
    <section
      id='soluciones'
      className='py-12 relative overflow-hidden scroll-mt-20'
    >
      {/* Subtle background element */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none'></div>

      <div className='container mx-auto px-6 md:px-12 relative z-10'>
        <div className='mb-5 md:mb-10'>
          <h2 className='text-3xl md:text-5xl font-bold mb-4 font-serif text-center'>
            Tarifas y soluciones
          </h2>
          <div className='h-1 w-20 mx-auto  bg-norien-gold'></div>
        </div>
        <div className='max-w-4xl mx-auto text-center border border-white/10 bg-white/[0.02] rounded-3xl p-8 md:p-16 backdrop-blur-sm shadow-2xl'>
          <div className='inline-flex justify-center items-center p-3 bg-norien-gold/10 rounded-full text-norien-gold mb-8'>
            <ShieldCheck size={32} />
          </div>

          <h2 className='text-3xl md:text-5xl font-bold mb-8 text-white font-serif'>
            Soluciones personalizadas. <br />
            <span className='text-norien-gold'>Resultados medibles.</span>
          </h2>

          <p className='text-norien-silver text-lg leading-relaxed mb-10 max-w-2xl mx-auto'>
            Cada negocio es único. Diseñamos flujos de trabajo personalizados
            según tu volumen y necesidades. Nuestra prioridad es tu eficiencia
            operativa: si el sistema no te ahorra tiempo real, no hemos cumplido
            nuestro trabajo.
          </p>

          <Button
            variant='outline'
            className='mx-auto text-lg px-8 py-4 border-norien-gold/30 text-gold hover:border-norien-gold hover:text-norien-gold'
            onClick={() => onScrollToSection('#contacto')}
          >
            Solicitar presupuesto a medida
          </Button>

          <p className='mt-6 text-xs uppercase tracking-widest'>
            <span className='text-norien-silver'>Sin compromisos •</span>{' '}
            <span className='text-norien-gold font-bold'>
              Auditoría inicial gratuita
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
