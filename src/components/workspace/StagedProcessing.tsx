import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { BrandNucleus } from '../canvas/BrandNucleus';
import { Check, Sparkles } from 'lucide-react';

export const StagedProcessing: React.FC = () => {
  const { processingSteps, currentProcessingStepIndex } = useBrand();

  const stepsList = [
    { label: 'Extracting the core structural problem', key: 0 },
    { label: 'Finding the high-intent audience profile', key: 1 },
    { label: 'Testing assumptions and hidden risks', key: 2 },
    { label: 'Mapping contextual workarounds & friction', key: 3 },
  ];

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-[#f4efe8] text-center">
      {/* Central 3D Brand Nucleus gradually crystallizing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0 opacity-80">
        <BrandNucleus
          stage="processing"
          speedMultiplier={1.8}
          shape={currentProcessingStepIndex > 2 ? 'knot' : 'icosahedron'}
          accentColor="#e0a96d"
          className="w-full h-full max-w-4xl max-h-[70vh]"
          showLabels={false}
        />
      </div>

      {/* Foreground Staged Content */}
      <div className="relative z-10 max-w-xl mx-auto space-y-8 pointer-events-auto">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NUCLEUS FORMATION IN PROGRESS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
            UNDERSTANDING YOUR IDEA
          </h2>

          <p className="text-xs text-[#a0988e] font-light max-w-md mx-auto">
            Extracting deep behavioral tensions and structuring relational brand nodes.
          </p>
        </div>

        {/* Staged Reasoning List */}
        <div className="p-6 rounded-3xl spatial-surface border border-white/10 shadow-2xl space-y-4 text-left">
          {stepsList.map((step, idx) => {
            const isCompleted = idx < currentProcessingStepIndex;
            const isCurrent = idx === currentProcessingStepIndex;
            const isPending = idx > currentProcessingStepIndex;

            return (
              <div
                key={step.key}
                className={`flex items-center justify-between gap-4 py-2 border-b border-white/[0.05] last:border-none transition-all duration-500 ${
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
          Constructing spatial relationship map...
        </div>
      </div>
    </div>
  );
};
