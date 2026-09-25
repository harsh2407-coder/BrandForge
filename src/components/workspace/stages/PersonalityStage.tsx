import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { EditFieldModal } from '../../shared/EditFieldModal';

export const PersonalityStage: React.FC = () => {
  const { 
    brandMemory, 
    updatePersonality, 
    advanceToNextStage,
    goToStage 
  } = useBrand();

  const { personality } = brandMemory;
  const [selectedTraitIdx, setSelectedTraitIdx] = useState<number>(0);
  const activeTrait = personality.traits?.[selectedTraitIdx] || personality.traits?.[0];

  const [isToneModalOpen, setIsToneModalOpen] = useState(false);

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
            Derived from validated positioning
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          If this brand were a person...
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          Brand personality is not cosmetic tone. It is a set of behavioral heuristics that guide how your product responds under stress, communicates trade-offs, and earns human respect.
        </p>
      </div>

      {/* Visual Personality Constellation Map */}
      <div className="relative my-8 p-8 sm:p-12 rounded-3xl spatial-surface border border-white/[0.08] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Subtle Radial Orbital Ring Guidelines */}
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.05] pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-white/[0.03] pointer-events-none" />

        {/* Central Core: The Brand Archetype */}
        <div className="relative z-10 p-6 rounded-full spatial-surface border border-amber-400/40 text-center shadow-2xl backdrop-blur-xl mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
            CORE PERSONA
          </span>
          <div className="text-xl sm:text-2xl font-serif-editorial text-white font-semibold">
            {personality.voiceAndTone?.tone || 'Bold, Pragmatic & Collegiate'}
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
                {activeTrait.whyItFits}
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
                Direct statements on stack compatibility, zero corporate jargon, rapid frictionless onboarding under 60 seconds.
              </p>
            </div>
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
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1 text-xs"
            >
              <div className="font-semibold text-rose-300 uppercase tracking-wide">
                {avoid.trait}
              </div>
              <p className="text-[#a0988e] leading-relaxed text-[11px]">
                {avoid.reason}
              </p>
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
          {personality.principles?.map((principle, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3 text-xs text-[#d6cec3]"
            >
              <span className="font-mono text-amber-400 text-[11px]">0{idx + 1}.</span>
              <span className="leading-relaxed">{principle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Advance Bar */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <span>Explore Naming Worlds</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

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
              }
            });
            setIsToneModalOpen(false);
          }}
          onClose={() => setIsToneModalOpen(false)}
        />
      )}
    </div>
  );
};
