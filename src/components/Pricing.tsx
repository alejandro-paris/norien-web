import React from 'react';
import { Button } from './Button';
import { ShieldCheck } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-4xl mx-auto text-center border border-white/10 bg-white/[0.02] rounded-3xl p-8 md:p-16 backdrop-blur-sm shadow-2xl">
                
                <div className="inline-flex justify-center items-center p-3 bg-norien-gold/10 rounded-full text-norien-gold mb-8">
                    <ShieldCheck size={32} />
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white font-serif">
                    Soluciones a medida. <br />
                    <span className="text-norien-gold">Resultados garantizados.</span>
                </h2>

                <p className="text-norien-silver text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                    Cada negocio es único. Diseñamos flujos de trabajo personalizados según tu volumen y necesidades. Nuestra prioridad es tu eficiencia operativa: si el sistema no te ahorra tiempo real, no hemos cumplido nuestro trabajo.
                </p>

                <Button variant="outline" className="mx-auto text-lg px-8 py-4 border-norien-silver/30 text-white hover:border-norien-gold hover:text-norien-gold">
                    Solicitar presupuesto a medida
                </Button>

                <p className="mt-6 text-xs text-norien-silver/60 uppercase tracking-widest">
                    Sin compromisos • Auditoría inicial gratuita
                </p>
            </div>
        </div>
    </section>
  );
};