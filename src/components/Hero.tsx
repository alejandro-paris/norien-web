import React from 'react';
import { Button } from './Button';
import { ArrowRight, Rocket, Megaphone, Headset, SquareCheckIcon, SquareCheckBig, ChartLine } from 'lucide-react';
import { LightningEffect } from './LightningEffect';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToSection }) => {
  return (
    <section className='relative min-h-screen flex items-center overflow-hidden'>
      <div className='container mx-auto px-6 md:px-12 relative z-10'>
        <div className='text-center pt-20 lg:pt-0'>
          <div className='mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest text-norien-gold uppercase animate-fade-in-up'>
            <span className='w-1.5 h-1.5 rounded-full bg-norien-gold animate-pulse'></span>
            Para PYMES por cita, reservas y membresías
          </div>

          <h1 className='text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-8 tracking-tight text-white font-serif'>
            Convierte conversaciones en reservas, citas y pagos.
          </h1>

          <p className='text-norien-silver text-lg md:text-xl mb-10 leading-relaxed font-light'>
            Automatizamos WhatsApp con IA y añadimos estrategia comercial
            (scripts + campañas segmentadas) para captar, reactivar y cobrar sin
            fricción.
          </p>

          <div className='flex w-full justify-center flex-col sm:flex-row items-center lg:items-start gap-4'>
            <Button
              className='w-full sm:w-auto text-lg px-8 py-4'
              onClick={() => onScrollToSection('#contacto')}
            >
              Quiero ahorrar tiempo
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>

        <div className='w-full flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mt-16 text-sm text-norien-silver'>
            <div className='flex items-center gap-2'>
              <SquareCheckBig size={20} className='text-norien-gold' strokeWidth={2} />
              <span className='text-base'>Implementación en 7/14 días</span>
            </div>
            <div className='flex items-center gap-2'>
              <Megaphone size={20} className='text-norien-gold' />
              <span className='text-base'>Campañas de reactivación y eventos</span>
            </div>
            <div className='flex items-center gap-2'>
              <ChartLine size={20} className='text-norien-gold' />
              <span className='text-base'>Handoff humano + reporting</span>
            </div>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent'></div>
    </section>
  );
};
