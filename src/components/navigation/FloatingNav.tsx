import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { StageId } from '../../types/brand';
import { Sparkles, Plus, Database, ChevronRight, Layers, ArrowLeft } from 'lucide-react';

interface StageMeta {
  id: StageId;
  index: string;
  label: string;
}

const STAGES: StageMeta[] = [
  { id: 'discover', index: '01', label: 'Discover' },
  { id: 'position', index: '02', label: 'Position' },
  { id: 'personality', index: '03', label: 'Identity' },
  { id: 'naming', index: '04', label: 'Naming' },
  { id: 'visualize', index: '05', label: 'Visualize' },
  { id: 'challenge', index: '06', label: 'Challenge' },
  { id: 'launch', index: '07', label: 'Deliver' },
  { id: 'brand-kit', index: 'Book', label: 'Brand Book' },
];

export const FloatingNav: React.FC = () => {
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

  const brandName = brandMemory.naming.selectedName?.name || brandMemory.projectName || 'Draft Brand';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-4 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Wordmark Spatial Island */}
        <div className="pointer-events-auto">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full spatial-surface text-left group hover:border-white/20 transition-all shadow-lg focus:outline-none"
          >
            <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-300/30 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[#f4efe8] group-hover:text-white transition-colors">
              BrandForge
            </span>
            {activeView !== 'landing' && (
              <span className="hidden md:inline-flex items-center gap-1.5 pl-1.5 border-l border-white/10 text-xs text-[#a0988e] font-mono">
                <span className="max-w-[120px] truncate text-[#e6ded5]">{brandName}</span>
              </span>
            )}
          </button>
        </div>

        {/* Center: Stage Journey Bar (Shown when in workspace or brand kit) */}
        {activeView !== 'landing' && currentStage !== 'input' && (
          <nav 
            className="pointer-events-auto hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full spatial-surface border border-white/[0.08] shadow-xl"
            aria-label="Brand stages navigation"
          >
            {STAGES.map((s) => {
              const isActive = currentStage === s.id;
              const isCompleted = brandMemory.stagesCompleted.includes(s.id);

              return (
                <button
                  key={s.id}
                  onClick={() => goToStage(s.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/15 text-white font-medium shadow-xs border border-white/20'
                      : isCompleted
                      ? 'text-[#c6bdb0] hover:text-white hover:bg-white/5'
                      : 'text-[#847b70] hover:text-[#bbb1a4]'
                  }`}
                  title={s.label}
                >
                  <span className={`text-[10px] ${isActive ? 'text-amber-300' : 'opacity-60'}`}>
                    {s.index}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Actions (New Project, Brand Memory Toggle, Load Example) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {activeView === 'landing' ? (
            <>
              <button
                onClick={() => loadDemoProject('discover')}
                className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-mono text-[#b5aca0] hover:text-white rounded-full spatial-surface-subtle hover:border-white/20 transition-all"
              >
                <span>Explore Example</span>
              </button>
              <button
                onClick={() => {
                  startNewProject();
                  setActiveView('workspace');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#11100f] bg-[#f4efe8] hover:bg-white rounded-full transition-all shadow-md active:scale-95"
              >
                <span>Build brand</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startNewProject}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#b5aca0] hover:text-white rounded-full spatial-surface hover:border-white/20 transition-all"
                title="Start a new brand from rough idea"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>

              <button
                onClick={() => setIsMemoryOpen(!isMemoryOpen)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full spatial-surface text-xs font-medium transition-all shadow-md ${
                  isMemoryOpen
                    ? 'border-amber-400/60 text-white bg-amber-500/15'
                    : 'text-[#d6cec3] hover:text-white hover:border-white/20'
                }`}
                title="Open persistent Brand Memory graph"
              >
                <Database className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xs:inline">Brand Memory</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
