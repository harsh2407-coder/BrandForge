import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { StageId } from '../../types/brand';
import { 
  Check, 
  Layers, 
  Target, 
  Sparkles, 
  Type, 
  Eye, 
  ShieldAlert, 
  Rocket, 
  Database,
  Pencil,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { EditFieldModal } from '../shared/EditFieldModal';

interface StepMeta {
  id: StageId;
  index: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  isHero?: boolean;
}

const WORKFLOW_STEPS: StepMeta[] = [
  {
    id: 'discover',
    index: '01',
    name: 'Discover',
    desc: 'Problem & audience',
    icon: Layers,
  },
  {
    id: 'position',
    index: '02',
    name: 'Position',
    desc: 'Category & value prop',
    icon: Target,
  },
  {
    id: 'personality',
    index: '03',
    name: 'Personality',
    desc: 'Voice & principles',
    icon: Sparkles,
  },
  {
    id: 'naming',
    index: '04',
    name: 'Naming',
    desc: 'Territories & names',
    icon: Type,
  },
  {
    id: 'visualize',
    index: '05',
    name: 'Visualize',
    desc: 'Color, type & marks',
    icon: Eye,
  },
  {
    id: 'challenge',
    index: '06',
    name: 'Challenge',
    desc: 'AI Brand Critic',
    icon: ShieldAlert,
    isHero: true,
  },
  {
    id: 'launch',
    index: '07',
    name: 'Launch',
    desc: 'Messaging & assets',
    icon: Rocket,
  },
];

export const Sidebar: React.FC = () => {
  const {
    brandMemory,
    currentStage,
    goToStage,
    isMemoryOpen,
    setIsMemoryOpen,
  } = useBrand();

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const isStepCompleted = (stageId: StageId) => {
    return brandMemory.stagesCompleted.includes(stageId);
  };

  return (
    <aside className="w-64 shrink-0 bg-neutral-950 border-r border-neutral-800/80 flex flex-col justify-between h-[calc(100vh-3.5rem)] select-none">
      {/* Top: Project Info & Workflow */}
      <div className="p-4 space-y-5 overflow-y-auto">
        {/* Project Header */}
        <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono tracking-wider">
            <span>ACTIVE BRAND</span>
            <button
              onClick={() => setIsRenameModalOpen(true)}
              className="text-neutral-400 hover:text-amber-400 transition-colors"
              title="Rename Project"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
          <div className="font-semibold text-sm text-neutral-100 truncate">
            {brandMemory.projectName || 'My New Brand'}
          </div>
          <div className="text-[11px] text-neutral-400 line-clamp-1">
            {brandMemory.roughIdea ? `"${brandMemory.roughIdea}"` : 'Awaiting rough idea...'}
          </div>
        </div>

        {/* Workflow Title */}
        <div className="space-y-1.5">
          <div className="px-2 flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
            <span>Workflow Stages</span>
            <span className="text-[10px] text-neutral-400">
              {brandMemory.stagesCompleted.length}/7
            </span>
          </div>

          {/* Navigation Steps */}
          <nav className="space-y-1" aria-label="Workflow Stages">
            {WORKFLOW_STEPS.map((step) => {
              const active = currentStage === step.id;
              const completed = isStepCompleted(step.id);
              const StepIcon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStage(step.id)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs group ${
                    active
                      ? 'bg-neutral-800 text-white font-medium border border-neutral-700/80 shadow-xs'
                      : 'text-neutral-400 hover:bg-neutral-900/80 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-mono text-[11px] w-5 shrink-0 ${
                        active ? 'text-amber-400 font-semibold' : 'text-neutral-400 group-hover:text-neutral-400'
                      }`}
                    >
                      {step.index}
                    </span>

                    <span className="truncate">{step.name}</span>

                    {step.isHero && (
                      <span className="text-[9px] font-mono uppercase px-1 py-0.2 text-amber-300 bg-amber-950/60 border border-amber-800/60 rounded">
                        Critic
                      </span>
                    )}
                  </div>

                  <div className="flex items-center shrink-0 pl-1">
                    {completed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : active ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom: Brand Memory trigger */}
      <div className="p-4 border-t border-neutral-800/80 space-y-2 bg-neutral-950/80">
        <button
          onClick={() => setIsMemoryOpen(!isMemoryOpen)}
          className={`w-full p-3 rounded-xl border text-left transition-all ${
            isMemoryOpen
              ? 'bg-amber-950/30 border-amber-600/50 text-neutral-100'
              : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 text-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Brand Memory</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                isMemoryOpen ? 'rotate-90 text-amber-400' : ''
              }`}
            />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
            Shared context pipeline connecting all 7 reasoning stages.
          </p>
        </button>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 pt-1 font-mono">
          <span>Engine: Strategic-V1</span>
          <button 
            onClick={() => goToStage('discover')}
            className="hover:text-neutral-300 transition-colors"
          >
            Review Stage
          </button>
        </div>
      </div>

      {/* Rename Modal */}
      <EditFieldModal
        isOpen={isRenameModalOpen}
        title="Rename Brand Project"
        fieldLabel="Project or Brand Title"
        initialValue={brandMemory.projectName}
        multiline={false}
        onSave={(val) => {
          brandMemory.projectName = val;
        }}
        onClose={() => setIsRenameModalOpen(false)}
      />
    </aside>
  );
};
