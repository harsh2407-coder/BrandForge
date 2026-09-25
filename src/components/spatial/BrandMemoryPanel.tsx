import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { 
  X, 
  Database, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Target, 
  Layers, 
  Type, 
  Eye, 
  Rocket, 
  ShieldAlert,
  GitBranch
} from 'lucide-react';
import { StageId } from '../../types/brand';

export const BrandMemoryPanel: React.FC = () => {
  const { 
    brandMemory, 
    isMemoryOpen, 
    setIsMemoryOpen, 
    goToStage 
  } = useBrand();

  if (!isMemoryOpen) return null;

  const { discovery, positioning, personality, naming, visual, launch } = brandMemory;
  const brandName = naming.selectedName?.name || brandMemory.projectName || 'Draft Brand';

  const systemNodes: Array<{
    stage: StageId;
    title: string;
    category: string;
    summary: string;
    accent: string;
    icon: React.ElementType;
    connectedTo?: string;
  }> = [
    {
      stage: 'discover',
      title: 'Audience & Core Problem',
      category: 'Stage 01 · Diagnostic Foundation',
      summary: discovery.coreProblem || 'Awaiting idea discovery...',
      accent: '#f59e0b',
      icon: Layers,
      connectedTo: 'Category & Positioning'
    },
    {
      stage: 'position',
      title: 'Category & Positioning',
      category: 'Stage 02 · Strategic Angle',
      summary: positioning.positioningStatement || 'Awaiting position definition...',
      accent: '#d97706',
      icon: Target,
      connectedTo: 'Personality & Voice'
    },
    {
      stage: 'personality',
      title: 'Personality & Voice',
      category: 'Stage 03 · Brand Archetype',
      summary: personality.traits?.length 
        ? personality.traits.map(t => t.name).join(' · ')
        : 'Awaiting traits constellation...',
      accent: '#ec4899',
      icon: Sparkles,
      connectedTo: 'Chosen Wordmark'
    },
    {
      stage: 'naming',
      title: 'Chosen Wordmark',
      category: 'Stage 04 · Verbal Carrier',
      summary: naming.selectedName 
        ? `${naming.selectedName.name} — ${naming.selectedName.meaning}`
        : 'Awaiting territory selection...',
      accent: '#a855f7',
      icon: Type,
      connectedTo: 'Visual System'
    },
    {
      stage: 'visualize',
      title: 'Visual Direction',
      category: 'Stage 05 · Aesthetic Codes',
      summary: visual.palette?.length 
        ? `${visual.palette.slice(0, 3).map(p => p.hex).join(' ')} · ${visual.typography?.[0]?.family || 'Grotesque'}`
        : 'Awaiting visual tokens...',
      accent: '#10b981',
      icon: Eye,
      connectedTo: 'Launch Strategy'
    },
    {
      stage: 'launch',
      title: 'Launch Strategy & Copy',
      category: 'Stage 07 · Market Introduction',
      summary: launch.headline || 'Awaiting launch compilation...',
      accent: '#38bdf8',
      icon: Rocket,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0" 
        onClick={() => setIsMemoryOpen(false)} 
      />

      {/* Floating Spatial Glass Panel */}
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl spatial-surface border border-white/15 shadow-2xl overflow-hidden text-[#f4efe8]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-white">
                  Brand Memory Graph
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Unified System
                </span>
              </div>
              <p className="text-xs text-[#a0988e] mt-0.5">
                The persistent relational context uniting every strategic decision for <span className="text-white font-medium">{brandName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMemoryOpen(false)}
            className="p-2 text-[#a89f92] hover:text-white rounded-full hover:bg-white/5 transition-colors"
            aria-label="Close Brand Memory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spatial Node Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#b8afa3] flex items-center gap-2.5">
            <GitBranch className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Each decision below directly informs subsequent stages. Click any memory node to inspect or reshape its reasoning.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemNodes.map((node) => {
              const Icon = node.icon;

              return (
                <div
                  key={node.stage}
                  onClick={() => {
                    goToStage(node.stage);
                    setIsMemoryOpen(false);
                  }}
                  className="group relative p-5 rounded-2xl spatial-surface-subtle border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#8c8376] uppercase tracking-wider">{node.category}</span>
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: node.accent, boxShadow: `0 0 8px ${node.accent}` }} 
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#e0a96d]" />
                      <h3 className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
                        {node.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#a89f92] leading-relaxed line-clamp-3">
                      {node.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#7d7468] group-hover:text-[#b8afa3] transition-colors font-mono">
                    <span>Jump to stage</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#11100f] text-center text-xs text-[#8c8376] font-mono">
          Context state: Synced · 6 Active Knowledge Embeddings
        </div>
      </div>
    </div>
  );
};
