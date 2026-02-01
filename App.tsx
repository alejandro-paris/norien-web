import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { BackgroundParticles } from './components/BackgroundParticles';
import { WorkInProgress } from './components/WorkInProgress';

type ViewState = 'landing' | 'wip';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');

  // Scroll to top when view changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="min-h-screen bg-norien-bg text-white selection:bg-norien-gold selection:text-black relative">
      {/* Fixed Background Layer */}
      <BackgroundParticles />

      {/* Main Content Layer - High Z-index ensures interactivity over canvas */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onNavigate={setView} />
        
        <main className="flex-grow pt-20">
          {view === 'landing' ? (
            <>
              {/* Added negative margin to pull Hero up into the padding created by pt-20 if needed, 
                  but Hero has its own padding. Keeping it simple. */}
              <div className="-mt-20"> 
                 <Hero />
              </div>
              <Features />
              <Pricing />
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