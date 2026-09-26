import React, { useState, useEffect } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { 
  Sparkles, 
  Ban, 
  ArrowRight, 
  Check, 
  Compass, 
  Layers, 
  HelpCircle,
  Pencil,
  ShieldAlert,
  RefreshCw,
  Sliders,
  Quote,
  MessageSquare,
  FileText,
  Lock
} from 'lucide-react';
import { EditFieldModal } from '../../shared/EditFieldModal';

export const PersonalityStage: React.FC = () => {
  const { 
    brandMemory, 
    updatePersonality, 
    advanceToNextStage,
    generatePersonality,
    goToStage,
    isProcessing
  } = useBrand();

  const { personality } = brandMemory;
  const stageStatus = brandMemory.stageExecution?.personality;
  const [selectedTraitIdx, setSelectedTraitIdx] = useState<number>(0);
  const activeTrait = personality.traits?.[selectedTraitIdx] || personality.traits?.[0];

  const [isToneModalOpen, setIsToneModalOpen] = useState(false);

  // Auto-trigger personality generation if real project with discovery & positioning ready but personality idle
  useEffect(() => {
    if (
      brandMemory.id !== 'demo-hackathon-teammates' &&
      brandMemory.discovery?.coreProblem &&
      brandMemory.positioning?.category &&
      brandMemory.stageExecution?.personality?.status === 'idle' &&
      (!personality.traits || personality.traits.length === 0)
    ) {
      generatePersonality();
    }
  }, [
    brandMemory.id, 
    brandMemory.discovery?.coreProblem, 
    brandMemory.positioning?.category, 
    brandMemory.stageExecution?.personality?.status, 
    personality.traits, 
    generatePersonality
  ]);

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>03 / IDENTITY & VOICE</span>
            <span aria-hidden="true">·</span>
            <span>BEHAVIORAL CONSTELLATION</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Derived from validated Discovery & Positioning
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          If this brand were a person...
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          Brand personality is not cosmetic tone. It is a set of behavioral heuristics and calibrated voice rules that guide how your product communicates, behaves under stress, and earns human respect.
        </p>
      </div>

      {/* Controlled Stage Error Banner */}
      {stageStatus?.status === 'error' && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-semibold text-xs block text-rose-300">
                {stageStatus.errorCategory === 'QUOTA'
                  ? 'Groq AI Quota Exhausted'
                  : stageStatus.errorCategory === 'RATE_LIMIT'
                  ? 'Groq Rate Limit Exceeded'
                  : 'Personality Generation Failed'}
              </span>
              <span className="text-xs text-rose-200/90">
                {stageStatus.lastError || 'Unable to generate strategic personality. Please try again.'}
              </span>
              {stageStatus.errorCategory === 'QUOTA' && (
                <span className="text-[11px] text-rose-300/80 block mt-1">
                  AI provider credits or quota limit reached on Groq account.
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => generatePersonality()}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 text-xs font-medium transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Retry Personality</span>
          </button>
        </div>
      )}

      {/* Visual Personality Constellation Map */}
      <div className="relative my-8 p-8 sm:p-12 rounded-3xl spatial-surface border border-white/[0.08] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Subtle Radial Orbital Ring Guidelines */}
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.05] pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-white/[0.03] pointer-events-none" />

        {/* Central Core: The Brand Archetype */}
        <div className="relative z-10 p-6 rounded-3xl spatial-surface border border-amber-400/40 text-center shadow-2xl backdrop-blur-xl mb-8 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block mb-1">
            CORE PERSONA & VOICE
          </span>
          <div className="text-xl sm:text-2xl font-serif-editorial text-white font-semibold">
            {personality.voice?.summary || personality.voiceAndTone?.tone || 'Bold, Pragmatic & Collegiate'}
          </div>
        </div>

        {/* Orbiting Celestial Trait Nodes */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 max-w-3xl">
          {personality.traits?.map((trait, idx) => {
            const isSelected = selectedTraitIdx === idx;

            return (
              <button
                key={trait.name}
                onClick={() => setSelectedTraitIdx(idx)}
                className={`group px-6 py-3.5 rounded-full spatial-surface transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-white/15 text-white shadow-xl scale-110'
                    : 'border-white/[0.08] hover:border-white/20 text-[#c8beaf] hover:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-transform ${
                    isSelected ? 'bg-amber-400 scale-125' : 'bg-white/40'
                  }`}
                />
                <span className="text-sm font-semibold tracking-wide uppercase">
                  {trait.name}
                </span>
                <span className="text-[10px] font-mono text-[#7d7468]">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Trait Inspection Deck (Why it fits, Evidence, What it changes) */}
      {activeTrait && (
        <div className="p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 shadow-2xl mb-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                TRAIT DETAIL · 0{selectedTraitIdx + 1}
              </span>
              <h3 className="text-2xl font-serif-editorial text-white tracking-tight">
                {activeTrait.name}
              </h3>
            </div>

            <button
              onClick={() => setIsToneModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full spatial-surface text-xs text-[#c8beaf] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Pencil className="w-3 h-3" />
              <span>Edit Voice Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175]">
                Why It Fits The Brand
              </span>
              <p className="text-sm text-[#e8e2d8] leading-relaxed">
                {activeTrait.strategicReason || activeTrait.whyItFits}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175]">
                Audience Psychological Evidence
              </span>
              <p className="text-sm text-[#e8e2d8] leading-relaxed">
                {activeTrait.evidence}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175]">
                What It Changes in UX & Tone
              </span>
              <p className="text-sm text-[#e8e2d8] leading-relaxed">
                {activeTrait.description || 'Direct statements on stack compatibility, zero corporate jargon, rapid frictionless onboarding.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Personality Dimensions / Spectrums */}
      {personality.dimensions && personality.dimensions.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            <Sliders className="w-4 h-4" />
            <span>Personality Spectrums & Behavioral Calibration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {personality.dimensions.map((dim, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white uppercase tracking-wider text-[11px]">{dim.dimension}</span>
                  <span className="font-mono text-amber-400 text-[10px]">{dim.value}%</span>
                </div>

                {/* Spectrum Track */}
                <div className="relative w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500/60 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${dim.value}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8175]">
                  <span>{dim.lowLabel}</span>
                  <span>{dim.highLabel}</span>
                </div>

                <p className="text-[#a0988e] text-[11px] leading-relaxed pt-1 border-t border-white/[0.04]">
                  {dim.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traits to Avoid (Separated Quarantined Zone) */}
      <div className="p-6 rounded-3xl spatial-surface-subtle border border-rose-500/20 mb-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-300 uppercase tracking-widest">
          <Ban className="w-4 h-4 text-rose-400" />
          <span>Traits to Explicitly Avoid (Quarantined Anti-Archetypes)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {personality.traitsToAvoid?.map((avoid, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-xs"
            >
              <div className="font-semibold text-rose-300 uppercase tracking-wide">
                {avoid.name || avoid.trait}
              </div>
              <p className="text-[#e2dad0] text-[11px] leading-relaxed font-light">
                {avoid.reasonToAvoid || avoid.reason}
              </p>
              {avoid.description && avoid.description !== avoid.reasonToAvoid && (
                <p className="text-[#7d7468] text-[10px] leading-relaxed pt-1 border-t border-white/[0.04]">
                  {avoid.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Brand Principles */}
      <div className="p-6 rounded-3xl spatial-surface-subtle space-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          <span>Non-Negotiable Brand Principles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {(personality.brandPrinciples && personality.brandPrinciples.length > 0) ? (
            personality.brandPrinciples.map((bp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-xs text-[#d6cec3]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 text-[11px]">0{idx + 1}.</span>
                  <span className="font-semibold text-white uppercase tracking-wider text-[11px]">{bp.name}</span>
                </div>
                <p className="leading-relaxed text-[#e8e2d8] text-xs font-light">{bp.statement}</p>
                <p className="text-[#8a8175] text-[11px] pt-1 border-t border-white/[0.04]">
                  <span className="text-[#d4af37] font-mono">Implication: </span>{bp.implication}
                </p>
              </div>
            ))
          ) : (
            personality.principles?.map((principle, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3 text-xs text-[#d6cec3]"
              >
                <span className="font-mono text-amber-400 text-[11px]">0{idx + 1}.</span>
                <span className="leading-relaxed">{principle}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Brand Voice Characteristics & Actionable Tone Rules */}
      {(personality.voice?.toneRules || personality.voiceAndTone?.toneRules) && (
        <div className="p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            <MessageSquare className="w-4 h-4" />
            <span>Brand Voice & Actionable Tone Rules</span>
          </div>

          {/* Voice Characteristics */}
          {personality.voice?.characteristics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {personality.voice.characteristics.map((vc, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-xs font-semibold text-amber-300 block">{vc.characteristic}</span>
                  <p className="text-[11px] text-[#a0988e] leading-relaxed">{vc.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tone Rules Grid */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175] block">
              EXECUTION HEURISTICS (DO / AVOID / EXAMPLE)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(personality.voice?.toneRules || personality.voiceAndTone?.toneRules || []).map((rule, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold shrink-0">DO</span>
                    <span className="text-[#e8e2d8] leading-relaxed">{rule.do}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] uppercase font-bold shrink-0">AVOID</span>
                    <span className="text-[#a0988e] leading-relaxed">{rule.avoid}</span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.04] text-[11px] text-amber-200/90 font-serif-editorial italic">
                    "{rule.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calibration Writing Samples */}
      {(personality.writingSamples || personality.voiceAndTone?.writingSamples) && (
        <div className="p-6 sm:p-8 rounded-3xl spatial-surface-subtle border border-amber-400/20 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            <Quote className="w-4 h-4 text-amber-400" />
            <span>Voice Calibration Writing Samples</span>
          </div>

          {(() => {
            const samples = personality.writingSamples || personality.voiceAndTone?.writingSamples;
            if (!samples) return null;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175] block">Short Headline</span>
                  <p className="text-sm font-semibold text-white">{samples.headline}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175] block">Value Proposition Sentence</span>
                  <p className="text-xs text-[#e8e2d8] leading-relaxed">{samples.valueProposition}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175] block">Social Announcement</span>
                  <p className="text-xs text-[#e8e2d8] leading-relaxed">{samples.socialMessage}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175] block">User-Facing Explanation</span>
                  <p className="text-xs text-[#e8e2d8] leading-relaxed">{samples.userExplanation}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Action Advance Bar */}
      {(() => {
        const isReady = stageStatus?.status === 'ready';
        const isGenerating = stageStatus?.status === 'generating';
        const isError = stageStatus?.status === 'error';
        const hasValidPersonality = !!personality.traits && personality.traits.length > 0 && isReady;
        const canAdvance = isReady && hasValidPersonality;

        return (
          <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {canAdvance ? (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span>Personality Constellation locked</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-[#8a8175]">
                    Next, we explore 3 distinct Naming Worlds derived from this exact persona.
                  </p>
                </div>

                <button
                  onClick={advanceToNextStage}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Explore Naming Worlds</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#a0988e]">
                    <span>{isError ? 'Personality Generation Incomplete' : isGenerating ? 'Forming Archetype & Voice...' : 'Personality Required'}</span>
                    <span className={`w-2 h-2 rounded-full ${isError ? 'bg-rose-500' : isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-[#7d7468]'}`} />
                  </div>
                  <p className="text-xs text-[#8a8175]">
                    {isError 
                      ? 'Resolve personality generation errors before advancing to Naming.'
                      : isGenerating 
                      ? 'Groq is crystallizing the archetype, traits, and behavioral voice rules...'
                      : 'Lock in personality and brand archetype before advancing to Naming.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isError && (
                    <button
                      onClick={() => generatePersonality()}
                      disabled={isGenerating}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-semibold text-xs rounded-full transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>Retry Personality</span>
                    </button>
                  )}
                  <button
                    disabled={true}
                    title="Complete personality stage before proceeding to Naming"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 text-[#7d7468] font-semibold text-xs rounded-full cursor-not-allowed border border-white/5 opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Explore Naming Worlds (Locked)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })()}


      {/* Edit Tone Modal */}
      {isToneModalOpen && personality.voiceAndTone && (
        <EditFieldModal
          isOpen={isToneModalOpen}
          title="Edit Brand Tone Description"
          fieldLabel="Primary Brand Tone Description"
          initialValue={personality.voiceAndTone.tone}
          onSave={(newTone) => {
            updatePersonality({
              voiceAndTone: {
                ...personality.voiceAndTone,
                tone: newTone,
              },
              voice: personality.voice ? {
                ...personality.voice,
                summary: newTone,
              } : undefined,
            });
            setIsToneModalOpen(false);
          }}
          onClose={() => setIsToneModalOpen(false)}
        />
      )}
    </div>
  );
};

