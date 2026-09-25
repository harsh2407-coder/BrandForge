import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { Sparkles, Menu, X, Plus, Database, ArrowRight } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    brandMemory,
    activeView,
    setActiveView,
    currentStage,
    goToStage,
    isMemoryOpen,
    setIsMemoryOpen,
    startNewProject,
    loadDemoProject,
  } = useBrand();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stageDisplayMap: Record<string, string> = {
    input: '00 · Ideation',
    discover: '01 · Discover',
    position: '02 · Position',
    personality: '03 · Personality',
    naming: '04 · Naming',
    visualize: '05 · Visualize',
    challenge: '06 · Challenge',
    launch: '07 · Launch',
    'brand-kit': 'Kit · Complete',
  };

  const currentStageLabel = stageDisplayMap[currentStage] || '01 · Discover';

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2 group text-left focus:outline-none"
            title="BrandForge Home"
          >
            <span className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-base font-semibold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              BrandForge
            </span>
          </button>

          {/* Quiet breadcrumb separator for active project */}
          {brandMemory.projectName && activeView !== 'landing' && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 pl-2 border-l border-neutral-800">
              <span className="truncate max-w-[140px] text-neutral-200 font-medium">
                {brandMemory.projectName}
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-400 font-mono text-[11px]">
                {currentStageLabel}
              </span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
          <button
            onClick={() => {
              setActiveView('workspace');
              if (currentStage === 'brand-kit') goToStage('discover');
            }}
            className={`transition-colors py-1 ${
              activeView === 'workspace' && currentStage !== 'brand-kit'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-neutral-200'
            }`}
          >
            Workspace
          </button>

          <button
            onClick={() => setIsMemoryOpen(!isMemoryOpen)}
            className={`flex items-center gap-1.5 transition-colors py-1 ${
              isMemoryOpen ? 'text-amber-400 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Brand Memory</span>
          </button>

          <button
            onClick={() => {
              goToStage('brand-kit');
              setActiveView('brand-kit');
            }}
            className={`transition-colors py-1 ${
              activeView === 'brand-kit' || currentStage === 'brand-kit'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-neutral-200'
            }`}
          >
            Brand Kit
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => loadDemoProject('discover')}
            className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors px-2 py-1"
            title="Load Hackathon Teammates Demo"
          >
            Load Example
          </button>

          <button
            onClick={startNewProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-400" />
            <span>New Project</span>
          </button>

          {activeView === 'landing' ? (
            <button
              onClick={() => {
                setActiveView('workspace');
                goToStage('input');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <span>Build Brand</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 pl-2 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-neutral-300">Live Memory</span>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col gap-2.5 text-sm">
            <button
              onClick={() => {
                setActiveView('workspace');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-neutral-300 hover:text-white"
            >
              Workspace
            </button>
            <button
              onClick={() => {
                setIsMemoryOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-neutral-300 hover:text-white flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Brand Memory</span>
            </button>
            <button
              onClick={() => {
                goToStage('brand-kit');
                setActiveView('brand-kit');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-neutral-300 hover:text-white"
            >
              Brand Kit
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                loadDemoProject('discover');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-neutral-400 hover:text-neutral-200 py-1.5"
            >
              Load Example
            </button>
            <button
              onClick={() => {
                startNewProject();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-md"
            >
              New Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
