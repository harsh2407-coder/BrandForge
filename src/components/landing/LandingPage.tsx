import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { BrandNucleus } from '../canvas/BrandNucleus';
import { ArrowRight, Sparkles, ChevronRight, Compass } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setActiveView, 
    setCurrentStage, 
    loadDemoProject, 
    startNewProject 
  } = useBrand();

  const [isHoveringCta, setIsHoveringCta] = useState(false);

  const handleBuildBrand = () => {
    startNewProject();
    setCurrentStage('input');
    setActiveView('workspace');
  };

  const handleSeeExample = () => {
    loadDemoProject('discover');
  };

  return (
    <div className="relative min-h-screen bg-[#0c0b0a] text-[#f4efe8] flex flex-col justify-between overflow-hidden">
      {/* Cinematic Full-Screen Spatial Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 text-center">
        
        {/* The Brand Nucleus (3D Spatial Canvas Centerpiece) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto -z-0">
          <BrandNucleus
            stage="landing"
            speedMultiplier={isHoveringCta ? 2.2 : 1.0}
            shape={isHoveringCta ? 'knot' : 'icosahedron'}
            accentColor={isHoveringCta ? '#fbbf24' : '#e0a96d'}
            className="w-full h-full max-w-5xl max-h-[85vh] mx-auto opacity-90"
            showLabels={true}
          />
        </div>

        {/* Foreground Content Stack */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center pointer-events-none space-y-6">
          
          {/* Subtle Ambient Kicker */}
          <div className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full spatial-surface text-xs font-mono text-[#b5aca0] tracking-wider uppercase backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Spatial Brand Intelligence</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif-editorial tracking-tight text-white leading-[1.0] text-balance">
            YOUR IDEA <br />
            IS ONLY THE BEGINNING.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-[#c7beaf] max-w-2xl font-light leading-relaxed text-balance">
            Start with the messy version. BrandForge turns an unfinished idea into a coherent brand strategy, identity and launch system.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-3 pt-4">
            <button
              onClick={handleBuildBrand}
              onMouseEnter={() => setIsHoveringCta(true)}
              onMouseLeave={() => setIsHoveringCta(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-sm rounded-full transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
            >
              <span>Build my brand</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSeeExample}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 spatial-surface hover:border-white/30 text-[#e4ded5] hover:text-white text-sm font-medium rounded-full transition-all duration-300"
            >
              <span>Explore an example</span>
              <ChevronRight className="w-4 h-4 text-[#8a8175]" />
            </button>
          </div>

          {/* Small Supporting Journey Text */}
          <div className="pt-8 text-[11px] font-mono tracking-widest text-[#8a8175] uppercase">
            DISCOVER · POSITION · SHAPE · VISUALIZE · CHALLENGE · LAUNCH
          </div>
        </div>

        {/* Ambient Warm Gradient Falloff */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/70 to-transparent pointer-events-none" />
      </section>

      {/* Quiet Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#0c0b0a]/90 backdrop-blur-md py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a8175] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">BrandForge Studio</span>
            <span>·</span>
            <span>Creative Spatial Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={handleBuildBrand} className="hover:text-white transition-colors">
              Enter Studio
            </button>
            <button onClick={handleSeeExample} className="hover:text-white transition-colors">
              Teammate Finder Case
            </button>
            <span>v2.0 Spatial</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
