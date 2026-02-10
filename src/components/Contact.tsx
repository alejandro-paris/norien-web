import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contacto" className="py-24 md:py-32 relative scroll-mt-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Contacto</h2>
          <div className="h-1 w-20 bg-norien-gold mx-auto"></div>
          <p className="text-norien-silver text-lg mt-6 max-w-xl mx-auto">
            Escríbenos y te respondemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Email */}
          <a
            href="mailto:info@norien.es"
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-norien-gold/40 hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-lg bg-norien-gold/10 flex items-center justify-center text-norien-gold group-hover:scale-110 transition-transform duration-500">
              <Mail size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-norien-gold transition-colors">
              Email
            </h3>
            <p className="text-norien-silver text-sm">info@norien.es</p>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/34644980352"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-norien-gold/40 hover:bg-white/[0.04] transition-all duration-500"
          >
            <div className="w-14 h-14 rounded-lg bg-norien-gold/10 flex items-center justify-center text-norien-gold group-hover:scale-110 transition-transform duration-500">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-norien-gold transition-colors">
              WhatsApp
            </h3>
            <p className="text-norien-silver text-sm">+34 644 98 03 52</p>
          </a>
        </div>
      </div>
    </section>
  );
};
