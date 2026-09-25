import React, { useState } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { CritiqueCategory, CritiqueStatus, CritiqueFinding } from '../../../types/brand';
import { BrandNucleus } from '../../canvas/BrandNucleus';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  X, 
  Pencil, 
  Sparkles,
  Layers,
  Flame
} from 'lucide-react';
import { EditFieldModal } from '../../shared/EditFieldModal';

export const ChallengeStage: React.FC = () => {
  const { 
    brandMemory, 
    acceptChallengeFinding, 
    ignoreChallengeFinding, 
    editChallengeFinding,
    rerunChallenge,
    advanceToNextStage,
    isProcessing,
  } = useBrand();

  const { challenge } = brandMemory;
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [morphCounter, setMorphCounter] = useState<number>(0);
  const [editingFinding, setEditingFinding] = useState<CritiqueFinding | null>(null);

  const categories = [
    'ALL',
    'GENERIC LANGUAGE',
    'AUDIENCE FIT',
    'POSITIONING',
    'PERSONALITY',
    'NAME',
    'VOICE',
    'CONSISTENCY',
  ];

  const filteredFindings = challenge.findings?.filter(f => {
    if (selectedCategory === 'ALL') return true;
    return f.category === selectedCategory;
  }) || [];

  const handleAcceptFinding = (id: string) => {
    acceptChallengeFinding(id);
    setMorphCounter(prev => prev + 1);
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#e06d6d] tracking-widest uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>06 / HERO CRITIC STAGE · ADVERSARIAL STRESS TEST</span>
          </div>

          <button
            onClick={() => rerunChallenge()}
            disabled={isProcessing}
            className="text-xs text-[#8a8175] hover:text-white flex items-center gap-1.5 transition-colors font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Re-run adversarial scan</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-6xl font-serif-editorial text-white tracking-tight leading-[1.05]">
          LET'S TRY TO BREAK YOUR BRAND.
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          A strong identity should survive criticism. The Brand Critic scans your positioning, vocabulary, and tone for lazy clichés, audience mismatch, and voice hypocrisy.
        </p>

        {/* Visible Feedback Loop Indicator */}
        <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#b5aca0]">
          <span className="text-white font-medium">GENERATE</span>
          <span>→</span>
          <span className="text-amber-400 font-medium">CRITIQUE</span>
          <span>→</span>
          <span className="text-emerald-400 font-medium">IMPROVE</span>
        </div>
      </div>

      {/* Central Brand Nucleus with Stress Halo & Materializing Findings */}
      <div className="relative my-8 rounded-3xl spatial-surface border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center">
        
        {/* Nucleus Atmosphere */}
        <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center">
          <BrandNucleus
            stage="challenge"
            shape="knot"
            materialStyle="specular"
            accentColor="#e06d6d"
            morphTrigger={morphCounter}
            speedMultiplier={1.4}
            className="w-full h-full"
            showLabels={false}
          />

          {/* Central Overlay Summary Shield */}
          <div className="absolute p-4 rounded-2xl spatial-surface border border-white/20 text-center shadow-xl backdrop-blur-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
              COHERENCE ASSESSMENT
            </span>
            <div className="text-xl font-serif-editorial text-white font-semibold">
              {challenge.consistencySummary?.overallState || 'Robust & Coherent'}
            </div>
            <div className="mt-1 flex items-center justify-center gap-3 text-xs font-mono text-[#a0988e]">
              <span className="text-emerald-400">{challenge.consistencySummary?.strengthsCount} Passed</span>
              <span className="text-amber-400">{challenge.consistencySummary?.warningsCount} Warnings</span>
              <span className="text-rose-400">{challenge.consistencySummary?.conflictsCount} Conflicts</span>
            </div>
          </div>
        </div>

        {/* Category Segment Filter */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-4 border-t border-white/[0.08]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'spatial-surface-subtle text-[#8a8175] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materialized Critic Findings List */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
          <span>Materialized Findings ({filteredFindings.length})</span>
          <span>Accepting fixes directly morphs the Brand Nucleus</span>
        </div>

        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className={`p-6 rounded-3xl spatial-surface transition-all duration-300 ${
                finding.accepted
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : finding.ignored
                  ? 'border-white/[0.04] opacity-50'
                  : finding.status === 'CONFLICT'
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : finding.status === 'WARNING'
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full uppercase font-medium ${
                      finding.status === 'PASS'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : finding.status === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {finding.status}
                  </span>
                  <span className="text-[11px] font-mono text-[#8a8175] uppercase">
                    {finding.category}
                  </span>
                  {finding.accepted && (
                    <span className="text-[10px] font-mono uppercase text-emerald-400">
                      ✓ Applied to Nucleus
                    </span>
                  )}
                </div>

                {/* Actions: Accept, Ignore, Edit */}
                {!finding.accepted && !finding.ignored && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptFinding(finding.id)}
                      className="px-4 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept suggestion</span>
                    </button>

                    <button
                      onClick={() => setEditingFinding(finding)}
                      className="p-1.5 rounded-full spatial-surface text-[#8a8175] hover:text-white transition-colors"
                      title="Edit manually"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => ignoreChallengeFinding(finding.id)}
                      className="p-1.5 rounded-full spatial-surface text-[#8a8175] hover:text-white transition-colors"
                      title="Ignore"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Finding Headline */}
              <h3 className="text-base font-medium text-white mb-2 leading-relaxed">
                "{finding.finding}"
              </h3>

              {/* Rationale & Suggested Improvement */}
              <div className="space-y-2 text-xs text-[#a0988e]">
                <p className="leading-relaxed">
                  <span className="text-[#d6cec3] font-medium">Why it matters: </span>
                  {finding.whyItMatters}
                </p>

                {finding.suggestedImprovement && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#e4ded5] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#d4af37] block">
                      Recommended Strategic Improvement:
                    </span>
                    <p className="leading-relaxed font-serif-editorial text-sm">
                      {finding.suggestedImprovement}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Advance Bar */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>Critic stress test completed</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-[#8a8175]">
            Next, we compile the launch distribution copy and open the final Brand Book.
          </p>
        </div>

        <button
          onClick={advanceToNextStage}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <span>Compile launch assets</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Finding Modal */}
      {editingFinding && (
        <EditFieldModal
          isOpen={!!editingFinding}
          title={`Edit Finding · ${editingFinding.category}`}
          fieldLabel="Adjust suggested strategic fix"
          initialValue={editingFinding.suggestedImprovement}
          onSave={(text) => {
            editChallengeFinding(editingFinding.id, editingFinding.finding, text);
            setEditingFinding(null);
          }}
          onClose={() => setEditingFinding(null)}
        />
      )}
    </div>
  );
};
