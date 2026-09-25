import React, { useState } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { 
  Type, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  AlertTriangle,
  Layers,
  Globe
} from 'lucide-react';

export const NamingStage: React.FC = () => {
  const { 
    brandMemory, 
    selectNamingCandidate, 
    advanceToNextStage,
    goToStage 
  } = useBrand();

  const { naming } = brandMemory;
  const [activeTerritoryId, setActiveTerritoryId] = useState<string>(
    naming.territories[1]?.id || naming.territories[0]?.id || ''
  );

  const selectedCandidate = naming.selectedName || naming.territories[0]?.candidates[0];
  const activeTerritory = naming.territories.find(t => t.id === activeTerritoryId) || naming.territories[0];

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>04 / NAMING WORLDS</span>
            <span aria-hidden="true">·</span>
            <span>STRATEGIC CLUSTERS</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Active Mark: <span className="text-white font-semibold">{selectedCandidate?.name || 'SprintForge'}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          Three Strategic Naming Worlds.
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          Names are not accidental rhymes. They are strategic bets that frame customer expectations before a single feature is used. Select an island world to explore candidate names.
        </p>
      </div>

      {/* Selected Wordmark Floating Hero Plate */}
      {selectedCandidate && (
        <div className="p-8 sm:p-10 rounded-3xl spatial-surface border border-amber-400/30 shadow-2xl relative overflow-hidden my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
                ACTIVE CHOSEN WORDMARK
              </span>
              <h2 className="text-4xl sm:text-6xl font-serif-editorial text-white tracking-tight">
                {selectedCandidate.name}
              </h2>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <span className="text-[#8a8175] uppercase block text-[10px]">Domain Verification</span>
              <span className="text-emerald-400 font-medium">
                {selectedCandidate.availabilityHint || `${selectedCandidate.name.toLowerCase()}.app`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-[#d6cec3]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] block">Etymology & Meaning</span>
              <p className="leading-relaxed font-medium text-white">{selectedCandidate.meaning}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] block">Strategic Rationale</span>
              <p className="leading-relaxed">{selectedCandidate.strategicRationale}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] block">Audience Alignment</span>
              <p className="leading-relaxed">{selectedCandidate.personalityFit}</p>
            </div>
          </div>
        </div>
      )}

      {/* The 3 Spatial Island Worlds */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-[#a89f92]">
            Territory Islands ({naming.territories.length})
          </span>
          <span className="text-[11px] font-mono text-[#7d7468]">
            Click an island to enter its naming world
          </span>
        </div>

        {/* Territory Island Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {naming.territories.map((terr) => {
            const isTerritoryActive = activeTerritoryId === terr.id;

            return (
              <button
                key={terr.id}
                onClick={() => setActiveTerritoryId(terr.id)}
                className={`p-6 rounded-3xl spatial-surface text-left transition-all duration-300 cursor-pointer relative ${
                  isTerritoryActive
                    ? 'border-amber-400/80 bg-[#25221f]/90 shadow-2xl scale-[1.02]'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-[#1a1816]/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af37]">
                    WORLD 0{terr.number}
                  </span>
                  {terr.candidates.some(c => c.id === naming.selectedNameId) && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" title="Contains selected wordmark" />
                  )}
                </div>

                <h3 className="text-lg font-serif-editorial text-white tracking-tight">
                  {terr.name}
                </h3>

                <p className="text-xs text-[#a0988e] mt-2 line-clamp-2 leading-relaxed font-light">
                  {terr.theme}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Naming World Candidates (Cards appearing progressively) */}
        {activeTerritory && (
          <div className="p-8 rounded-3xl spatial-surface border border-white/[0.08] space-y-6">
            <div className="space-y-1 border-b border-white/[0.08] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8a8175]">
                ACTIVE NAMING WORLD · {activeTerritory.name}
              </span>
              <p className="text-xs text-[#c8beaf] leading-relaxed">
                <span className="font-semibold text-white">Territory Rationale:</span> {activeTerritory.rationale}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTerritory.candidates.map((cand) => {
                const isSelected = cand.id === naming.selectedNameId;

                return (
                  <div
                    key={cand.id}
                    onClick={() => selectNamingCandidate(cand.id)}
                    className={`p-6 rounded-2xl spatial-surface transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-amber-400 bg-white/10 shadow-2xl scale-[1.02]'
                        : 'border-white/[0.08] hover:border-white/20 hover:bg-[#1a1816]/80'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-serif-editorial text-white font-bold tracking-tight">
                          {cand.name}
                        </span>
                        {isSelected ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-mono font-semibold">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase text-[#7d7468] hover:text-white">
                            Select
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175]">Meaning</span>
                        <p className="text-xs text-[#e4ded5] leading-relaxed font-medium">{cand.meaning}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175]">Strategic Rationale</span>
                        <p className="text-xs text-[#a39a8e] leading-relaxed">{cand.strategicRationale}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] space-y-2">
                      <div className="text-[11px] text-[#a0988e]">
                        <span className="font-mono text-[#7d7468]">Fit: </span>
                        <span>{cand.personalityFit}</span>
                      </div>

                      {cand.potentialWeakness && (
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-tight">
                          <span className="font-mono text-amber-400">Trade-off: </span>
                          {cand.potentialWeakness}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Advance Bar */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>Wordmark confirmed in Brand Memory</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-[#8a8175]">
            Next, we enter the Visual Studio to sculpt colors, typography, materials, and form.
          </p>
        </div>

        <button
          onClick={advanceToNextStage}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <span>Enter Visual Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
