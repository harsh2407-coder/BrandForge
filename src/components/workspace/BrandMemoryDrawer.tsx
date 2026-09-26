import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { 
  Database, 
  X, 
  ArrowRight, 
  Layers, 
  Target, 
  Sparkles, 
  Type, 
  Eye, 
  ShieldAlert, 
  Rocket,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { StageId } from '../../types/brand';

export const BrandMemoryDrawer: React.FC = () => {
  const { 
    brandMemory, 
    isMemoryOpen, 
    setIsMemoryOpen, 
    goToStage 
  } = useBrand();

  if (!isMemoryOpen) return null;

  const { discovery, positioning, personality, naming, visual, challenge, launch } = brandMemory;
  const brandName = naming.selectedName?.name || brandMemory.projectName || 'Draft Brand';

  const memorySections: Array<{
    stageId: StageId;
    title: string;
    icon: React.ElementType;
    preview: string;
    isLocked: boolean;
  }> = [
    {
      stageId: 'discover',
      title: 'Problem & Audience',
      icon: Layers,
      preview: discovery.primaryAudience 
        ? `${discovery.primaryAudience.slice(0, 70)}...` 
        : 'Awaiting discovery synthesis',
      isLocked: !discovery.primaryAudience
    },
    {
      stageId: 'position',
      title: 'Positioning & Moat',
      icon: Target,
      preview: positioning.positioningStatement
        ? `"${positioning.positioningStatement.slice(0, 70)}..."`
        : 'Awaiting positioning synthesis',
      isLocked: !positioning.positioningStatement
    },
    {
      stageId: 'personality',
      title: 'Personality Traits',
      icon: Sparkles,
      preview: personality.traits?.length
        ? personality.traits.map(t => t.name).join(' · ')
        : 'Awaiting archetype definition',
      isLocked: !personality.traits?.length
    },
    {
      stageId: 'naming',
      title: 'Selected Wordmark',
      icon: Type,
      preview: naming.selectedName?.name
        ? `${naming.selectedName.name} — ${naming.selectedName.meaning.slice(0, 50)}...`
        : 'Awaiting naming selection',
      isLocked: !naming.selectedName?.name
    },
    {
      stageId: 'visualize',
      title: 'Visual Tokens',
      icon: Eye,
      preview: visual.palette?.length
        ? `${visual.palette.slice(0, 3).map(p => p.hex).join(' ')} · ${visual.typography?.[0]?.family || 'Sans'}`
        : 'Awaiting visual generation',
      isLocked: !visual.palette?.length
    },
    {
      stageId: 'challenge',
      title: 'Critic Audit',
      icon: ShieldAlert,
      preview: challenge.consistencySummary?.overallState
        ? `${challenge.consistencySummary.overallState} (${challenge.consistencySummary.strengthsCount} passed)`
        : 'Awaiting challenge scan',
      isLocked: !challenge.consistencySummary?.overallState
    },
    {
      stageId: 'launch',
      title: 'Deliver & Launch',
      icon: Rocket,
      preview: launch.headline
        ? `Headline: "${launch.headline}"`
        : 'Awaiting launch copy',
      isLocked: !launch.headline
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col justify-between select-none">
      {/* Drawer Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Brand Memory</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </h2>
            <p className="text-[11px] text-neutral-400 font-mono">
              Context pipeline passed between stages
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMemoryOpen(false)}
          className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors"
          aria-label="Close brand memory drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Memory Nodes List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
        <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 space-y-1">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            Active Strategic Seed
          </span>
          <p className="text-xs text-neutral-200 line-clamp-2 italic">
            "{brandMemory.roughIdea || 'Awaiting initial prompt...'}"
          </p>
        </div>

        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 pt-1">
          Accumulated Memory Nodes ({memorySections.filter(m => !m.isLocked).length}/7)
        </div>

        {memorySections.map((sec) => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.stageId}
              onClick={() => {
                goToStage(sec.stageId);
                setIsMemoryOpen(false);
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                sec.isLocked
                  ? 'bg-neutral-950/40 border-neutral-900 text-neutral-400'
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80 text-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${sec.isLocked ? 'text-neutral-400' : 'text-amber-400'}`} />
                  <span className="text-xs font-semibold tracking-tight text-neutral-100 group-hover:text-amber-300 transition-colors">
                    {sec.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  {sec.isLocked ? (
                    <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Pending
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="font-mono text-[10px]">Synced</span>
                    </span>
                  )}
                  <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                {sec.preview}
              </p>
            </div>
          );
        })}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/90 text-center">
        <p className="text-[11px] text-neutral-400 leading-normal">
          Click any card to inspect or modify the underlying reasoning.
        </p>
      </div>
    </div>
  );
};
