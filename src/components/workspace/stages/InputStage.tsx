import React, { useState } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { ArrowRight, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';

const SEED_EXAMPLES = [
  {
    title: 'Hackathon Teammates',
    text: 'I want to build an app that helps college students find teammates for hackathons based on skill match and commitment.',
    known: 'Discord channels are too chaotic and Google Sheets get ghosted 48 hours before deadlines.'
  },
  {
    title: 'Artisanal Sourdough Drop',
    text: 'A neighborhood micro-bakery subscription delivering freshly baked loaves to doorsteps every Sunday morning.',
    known: 'Local bakeries sell out by 9am and supermarket bread lacks soul and fermentation depth.'
  },
  {
    title: 'Cloud Cost Lens',
    text: 'An open-source CLI and dashboard that shows engineering teams which commit caused their AWS bill to spike this morning.',
    known: 'Engineers avoid AWS Cost Explorer because it is delayed by 24 hours and lacks git context.'
  }
];

export const InputStage: React.FC = () => {
  const { startDiscoveryFromIdea, brandMemory } = useBrand();

  const [ideaText, setIdeaText] = useState(
    brandMemory.roughIdea || 'I want to build an app that helps college students find teammates for hackathons.'
  );
  const [knownDetails, setKnownDetails] = useState(
    brandMemory.knownDetails || 'Discord channels are chaotic and solo builders often drop out because they lack complementary skills.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;
    startDiscoveryFromIdea(ideaText, knownDetails);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-4xl mx-auto px-4 sm:px-6 py-12 text-[#f4efe8]">
      {/* Editorial Chapter Header */}
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
          <span>01 / DISCOVER</span>
          <span aria-hidden="true">·</span>
          <span>THE UNFILTERED SEED</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif-editorial text-white tracking-tight leading-[1.05]">
          Let's start messy. <br />
          <span className="italic font-light text-[#c8beaf]">What are you trying to build?</span>
        </h1>

        <p className="text-sm text-[#9e9589] max-w-xl font-light">
          Don't worry about wording. Give us the rough version. We will construct your brand's strategic architecture through deliberate reasoning.
        </p>
      </div>

      {/* Error Alert if Stage Execution Failed */}
      {brandMemory.stageExecution?.discover?.status === 'error' && brandMemory.stageExecution.discover.lastError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-red-300">Discovery Generation Notice</div>
            <div className="text-xs text-red-200/90 mt-1">{brandMemory.stageExecution.discover.lastError}</div>
          </div>
        </div>
      )}

      {/* Main Large Writing Surface */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            rows={4}
            placeholder="I want to build an app that..."
            className="w-full bg-[#181615]/80 border border-white/[0.08] focus:border-amber-400/60 rounded-3xl p-6 sm:p-8 text-lg sm:text-xl text-white placeholder-[#5a5349] focus:outline-none focus:ring-1 focus:ring-amber-400/20 transition-all leading-relaxed spatial-surface shadow-2xl resize-none"
            required
          />

          <div className="mt-3 flex items-center justify-between text-xs text-[#82796e] px-2 font-mono">
            <span>The raw version is better than marketing speak</span>
            <span>{ideaText.length} chars</span>
          </div>
        </div>

        {/* Secondary Context (Quiet & Spatial) */}
        <div className="p-6 rounded-2xl spatial-surface-subtle space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#b3a89a] block">
            What do you already know? <span className="text-[#6d655a] font-normal">(Optional context, frustrations, hunch)</span>
          </label>
          <input
            type="text"
            value={knownDetails}
            onChange={(e) => setKnownDetails(e.target.value)}
            placeholder="e.g. Existing Discord channels feel too noisy, designers feel left out..."
            className="w-full bg-transparent border-b border-white/[0.08] focus:border-amber-400/60 py-2 text-sm text-[#ddd4c8] placeholder-[#5c544a] focus:outline-none transition-colors"
          />
        </div>

        {/* Quick Idea Seeds */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#7d7468]">
            Or load an existing rough concept:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SEED_EXAMPLES.map((seed) => (
              <button
                key={seed.title}
                type="button"
                onClick={() => {
                  setIdeaText(seed.text);
                  setKnownDetails(seed.known);
                }}
                className="text-left p-3.5 rounded-xl spatial-surface-subtle hover:border-white/20 transition-all group"
              >
                <div className="text-xs font-medium text-[#e4ded5] group-hover:text-amber-300 transition-colors mb-1">
                  {seed.title}
                </div>
                <p className="text-[11px] text-[#8a8175] line-clamp-2 leading-relaxed">
                  {seed.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Big Action Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={!ideaText.trim()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-sm rounded-full transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            <span>Begin discovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
