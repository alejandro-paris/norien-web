import React from 'react';
import { Button } from './Button';
import { Hammer } from 'lucide-react';

interface WorkInProgressProps {
  onBack: () => void;
}

export const WorkInProgress: React.FC<WorkInProgressProps> = ({ onBack }) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 relative animate-fade-in-up">
      <div className="w-24 h-24 bg-norien-gold/10 rounded-full flex items-center justify-center text-norien-gold mb-8 relative">
        <div className="absolute inset-0 bg-norien-gold/20 rounded-full animate-ping opacity-20"></div>
        <Hammer size={48} />
      </div>
      
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight font-serif">
        Estamos trabajando en ello
      </h2>
      
      <p className="text-norien-silver text-lg max-w-lg mb-12 leading-relaxed font-light">
        Esta sección estará disponible muy pronto. Estamos ultimando los detalles técnicos para ofrecerte una experiencia impecable.
      </p>
      
      <Button onClick={onBack} className="min-w-[200px]">
        Volver al inicio
      </Button>
    </section>
  );
};