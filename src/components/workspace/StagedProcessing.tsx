import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { BrandNucleus } from '../canvas/BrandNucleus';
import { Check, Sparkles } from 'lucide-react';
import type { StageId } from '../../types/brand';

interface StageProcessingMeta {
  tag: string;
  title: string;
  description: string;
  footerNote: string;
  shape: 'icosahedron' | 'knot' | 'torus' | 'octahedron';
  accentColor: string;
}

const STAGE_META: Record<string, StageProcessingMeta> = {
  discover: {
    tag: 'NUCLEUS FORMATION IN PROGRESS',
    title: 'UNDERSTANDING YOUR IDEA',
    description: 'Extracting deep behavioral tensions and structuring relational brand nodes.',
    footerNote: 'Constructing spatial relationship map...',
    shape: 'icosahedron',
    accentColor: '#e0a96d',
  },
  position: {
    tag: 'COMPETITIVE WEDGES IN PROGRESS',
    title: 'ARCHITECTING STRATEGIC POSITION',
    description: 'Exploring unoccupied territory and plotting 2D strategic coordinates.',
    footerNote: 'Synthesizing defensible positioning statement...',
    shape: 'octahedron',
    accentColor: '#d97706',
  },
  personality: {
    tag: 'TONAL SPECTRUM IN PROGRESS',
    title: 'CALIBRATING BRAND VOICE & TRAITS',
    description: 'Formulating core behavioral traits, writing samples, and tone rules.',
    footerNote: 'Locking brand principles and spectrum dimensions...',
    shape: 'knot',
    accentColor: '#ec4899',
  },
  naming: {
    tag: 'NAMING ENGINE IN PROGRESS',
    title: 'EXPLORING VERBAL IDENTITY WORLDS',
    description: 'Synthesizing naming worlds, phonetic archetypes, and diagnostic audits.',
    footerNote: 'Running 8-factor linguistic and risk evaluation...',
    shape: 'torus',
    accentColor: '#d4af37',
  },
  visualize: {
    tag: 'CREATIVE DIRECTION IN PROGRESS',
    title: 'SCULPTING VISUAL IDENTITY SYSTEM',
    description: 'Harmonizing color palettes, typography systems, and art direction.',
    footerNote: 'Calibrating 7-role color tokens and typographic pairings...',
    shape: 'icosahedron',
    accentColor: '#10b981',
  },
  challenge: {
    tag: 'ADVERSARIAL CRITIQUE IN PROGRESS',
    title: 'STRESS-TESTING BRAND SYSTEM',
    description: 'Running multi-vector adversarial audits across positioning, voice, and viability.',
    footerNote: 'Evaluating unearned claims and category tension...',
    shape: 'knot',
    accentColor: '#f43f5e',
  },
};

export const StagedProcessing: React.FC = () => {
  const { processingSteps, currentProcessingStepIndex, generatingStage, currentStage } = useBrand();

  const activeStage: StageId = generatingStage || currentStage || 'discover';
  const meta: StageProcessingMeta = STAGE_META[activeStage] || STAGE_META.discover;
  const steps = processingSteps && processingSteps.length > 0 ? processingSteps : [];

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-[#f4efe8] text-center">
      {/* Central 3D Brand Nucleus gradually crystallizing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0 opacity-80">
        <BrandNucleus
          stage="processing"
          speedMultiplier={1.8}
          shape={meta.shape}
          accentColor={meta.accentColor}
          className="w-full h-full max-w-4xl max-h-[70vh]"
          showLabels={false}
        />
      </div>

      {/* Foreground Staged Content */}
      <div className="relative z-10 max-w-xl mx-auto space-y-8 pointer-events-auto">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase" style={{ color: meta.accentColor }}>
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{meta.tag}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
            {meta.title}
          </h2>

          <p className="text-xs text-[#a0988e] font-light max-w-md mx-auto">
            {meta.description}
          </p>
        </div>

        {/* Dynamic Staged Reasoning List */}
        <div className="p-6 rounded-3xl spatial-surface border border-white/10 shadow-2xl space-y-4 text-left">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed' || idx < currentProcessingStepIndex;
            const isCurrent = step.status === 'active' || idx === currentProcessingStepIndex;
            const isPending = !isCompleted && !isCurrent;

            return (
              <div
                key={step.id || idx}
                className={`flex items-center justify-between gap-4 py-2 border-b border-white/[0.05] last:border-none transition-all duration-300 ${
                  isPending ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center border text-[11px] font-mono shrink-0">
                    {isCompleted ? (
                      <span className="w-full h-full rounded-full bg-emerald-500/20 text-emerald-400 border-emerald-500/40 flex items-center justify-center">
                        ✓
                      </span>
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    ) : (
                      <span className="text-[#6d655a] border-white/10">0{idx + 1}</span>
                    )}
                  </div>

                  <span
                    className={`text-xs ${
                      isCurrent
                        ? 'text-white font-medium'
                        : isCompleted
                        ? 'text-[#c8beaf]'
                        : 'text-[#6d655a]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase text-[#8a8175]">
                  {isCompleted ? 'Resolved' : isCurrent ? 'Reasoning...' : 'Queued'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-xs font-mono text-[#8a8175]">
          {meta.footerNote}
        </div>
      </div>
    </div>
  );
};
