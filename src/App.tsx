import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackgroundParticles } from './components/BackgroundParticles';
import { WorkInProgress } from './components/WorkInProgress';

type ViewState = 'landing' | 'wip';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const pendingSection = useRef<string | null>(null);

  React.useEffect(() => {
    if (pendingSection.current) {
      const sectionId = pendingSection.current;
      pendingSection.current = null;
      // Wait for the landing DOM to render before scrolling
      requestAnimationFrame(() => {
        const target = document.querySelector(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [view]);

  const handleScrollToSection = (sectionId: string) => {
    if (view === 'landing') {
      const target = document.querySelector(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      pendingSection.current = sectionId;
      setView('landing');
    }
  };

  return (
    <div className="min-h-screen bg-norien-bg text-white selection:bg-norien-gold selection:text-black relative">
      {/* Fixed Background Layer */}
      <BackgroundParticles />

      {/* Main Content Layer - High Z-index ensures interactivity over canvas */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          currentView={view}
          onNavigate={setView}
          onScrollToSection={handleScrollToSection}
        />

        <main className="flex-grow pt-20">
          {view === 'landing' ? (
            <>
              <div className="-mt-20">
                 <Hero onScrollToSection={handleScrollToSection} />
              </div>
              <Features />
              <Pricing onScrollToSection={handleScrollToSection} />
              <Contact />
            </>
          ) : (
            <WorkInProgress onBack={() => setView('landing')} />
          )}
        </main>

        <Footer onNavigate={setView} />
      </div>
    </div>
  );
};

export default App;
