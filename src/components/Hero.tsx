import React from 'react';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-subtle-glow opacity-60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest text-norien-gold uppercase animate-fade-in-up">
                <span className="w-1.5 h-1.5 rounded-full bg-norien-gold animate-pulse"></span>
                Automatización para negocios locales
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 max-w-5xl mx-auto font-serif">
                Tu negocio rinde más.  <br className="hidden md:block"/>
                <span className="text-white">Tú trabajas menos.</span>
            </h1>

            <p className="text-norien-silver text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
Automatizamos las tareas repetitivas que os quitan horas cada día. Pasamos la gestión de mensajes y citas a sistemas que trabajan en segundo plano, para que tú y tu equipo podáis centraros al 100% en dar el mejor servicio sin interrupciones constantes.            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="w-full sm:w-auto text-lg px-8 py-4">
                    Quiero ahorrar tiempo
                    <ArrowRight size={20} />
                </Button>
                <p className="mt-4 sm:mt-0 text-sm text-norien-silver/60 sm:hidden">
                    Resultados desde el primer mes.
                </p>
            </div>
            
        </div>
        
        {/* Decorative Lines */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </section>
  );
};