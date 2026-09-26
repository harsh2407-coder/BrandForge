import React, { useState, useEffect } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { 
  Type, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  AlertTriangle,
  Layers,
  Globe,
  Star,
  Ban,
  ShieldAlert,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sliders,
  BookmarkCheck,
  Target,
  Lock
} from 'lucide-react';
import type { NameCandidate, NamingTerritory, NamingWorld } from '../../../types/brand';

export const NamingStage: React.FC = () => {
  const { 
    brandMemory, 
    selectNamingCandidate, 
    toggleShortlistCandidate,
    toggleRejectCandidate,
    advanceToNextStage,
    generateNaming,
    goToStage 
  } = useBrand();

  const { naming } = brandMemory;
  const stageStatus = brandMemory.stageExecution?.naming;

  // Auto-trigger generation for real brands with upstream completed but naming idle
  useEffect(() => {
    if (
      brandMemory.id !== 'demo-hackathon-teammates' &&
      brandMemory.discovery?.coreProblem &&
      brandMemory.positioning?.category &&
      brandMemory.personality?.traits &&
      brandMemory.personality.traits.length > 0 &&
      brandMemory.stageExecution?.naming?.status === 'idle' &&
      (!naming.territories || naming.territories.length === 0) &&
      (!naming.candidates || naming.candidates.length === 0)
    ) {
      generateNaming();
    }
  }, [
    brandMemory.id,
    brandMemory.discovery?.coreProblem,
    brandMemory.positioning?.category,
    brandMemory.personality?.traits,
    brandMemory.stageExecution?.naming?.status,
    naming.territories,
    naming.candidates,
    generateNaming
  ]);

  // Territories or Worlds list
  const worlds = (naming.namingWorlds && naming.namingWorlds.length > 0)
    ? naming.namingWorlds
    : naming.territories.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || t.theme,
        strategicIdea: t.strategicIdea || t.rationale,
        namingLogic: t.namingLogic || 'Evocative compound morphemes',
        emotionalTerritory: t.emotionalTerritory || t.theme,
        tradeoff: t.tradeoff || 'Requires deliberate brand education.',
        examples: t.examples || t.candidates.map(c => c.name),
      }));

  const [activeWorldId, setActiveWorldId] = useState<string>(() => {
    return naming.territories[1]?.id || naming.territories[0]?.id || worlds[0]?.id || 'all';
  });

  const [filterMode, setFilterMode] = useState<'world' | 'shortlist' | 'all'>('world');
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);

  const isReady = stageStatus?.status === 'ready';
  const isGenerating = stageStatus?.status === 'generating';
  const isError = stageStatus?.status === 'error';
  const hasValidNaming = ((naming.candidates && naming.candidates.length > 0) || (naming.territories && naming.territories.length > 0)) && isReady;
  const canEnterVisualize = isReady && hasValidNaming;

  // All candidates pool
  const allCandidates: NameCandidate[] = (naming.candidates && naming.candidates.length > 0)
    ? naming.candidates
    : naming.territories.flatMap(t => t.candidates);

  const selectedCandidate = hasValidNaming
    ? (naming.selectedName || allCandidates.find(c => c.id === naming.selectedNameId) || allCandidates[0] || null)
    : null;
  const shortlistedIds = new Set(naming.shortlistedCandidateIds || []);

  // Filtered candidate list based on active mode
  let displayedCandidates: NameCandidate[] = [];
  if (filterMode === 'shortlist') {
    displayedCandidates = allCandidates.filter(c => shortlistedIds.has(c.id));
  } else if (filterMode === 'all') {
    displayedCandidates = allCandidates;
  } else {
    // By active world
    const activeTerritory = naming.territories.find(t => t.id === activeWorldId);
    if (activeTerritory && activeTerritory.candidates?.length > 0) {
      displayedCandidates = activeTerritory.candidates;
    } else {
      displayedCandidates = allCandidates.filter(c => c.worldId === activeWorldId);
    }
    if (displayedCandidates.length === 0 && allCandidates.length > 0) {
      displayedCandidates = allCandidates.slice(0, 4);
    }
  }

  const activeWorld = worlds.find(w => w.id === activeWorldId) || worlds[0];

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>04 / STRATEGIC NAMING STUDIO</span>
            <span aria-hidden="true">·</span>
            <span>VERBAL IDENTITY WORLDS</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Active Mark:{' '}
            {isReady && selectedCandidate ? (
              <span className="text-white font-semibold">{selectedCandidate.name}</span>
            ) : isGenerating ? (
              <span className="text-amber-400 font-semibold animate-pulse">Generating...</span>
            ) : isError ? (
              <span className="text-rose-400 font-semibold">Generation Failed</span>
            ) : (
              <span className="text-[#8a8175] italic">None selected</span>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          Name the idea.
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          Brand names are not accidental rhymes. They are strategic bets that frame customer expectations before a single feature is used. Explore candidate names across distinct thematic worlds.
        </p>
      </div>

      {/* Controlled Stage Error Banner */}
      {isError && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-semibold text-xs block text-rose-300">
                {stageStatus.errorCategory === 'QUOTA'
                  ? 'Groq AI Quota Exhausted'
                  : stageStatus.errorCategory === 'RATE_LIMIT'
                  ? 'Groq Rate Limit Exceeded'
                  : 'Naming Generation Failed'}
              </span>
              <span className="text-xs text-rose-200/90">
                {stageStatus.lastError || 'Unable to generate strategic naming worlds. Please try again.'}
              </span>
              {stageStatus.errorCategory === 'QUOTA' && (
                <span className="text-[11px] text-rose-300/80 block mt-1">
                  AI provider credits or quota limit reached on Groq account.
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => generateNaming()}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 text-xs font-medium transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Retry Naming</span>
          </button>
        </div>
      )}

      {/* Strategic Naming Brief Plate */}
      {(naming.namingStrategy || naming.namingBrief) && (
        <div className="my-6 p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            <Target className="w-4 h-4" />
            <span>Strategic Naming Doctrine & Creative Brief</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs">
            {naming.namingStrategy && (
              <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175] block">
                  Strategic Mandate (What This Name Must Accomplish)
                </span>
                <p className="text-[#e8e2d8] leading-relaxed font-light">
                  {naming.namingStrategy}
                </p>
              </div>
            )}

            {naming.namingBrief && (
              <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175] block">
                  Creative Constraints (Audience Resonance & Category Guardrails)
                </span>
                <p className="text-[#e8e2d8] leading-relaxed font-light">
                  {naming.namingBrief}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Wordmark Floating Hero Plate */}
      {selectedCandidate && (
        <div className="p-8 sm:p-10 rounded-3xl spatial-surface border border-amber-400/30 shadow-2xl relative overflow-hidden my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
                ACTIVE CHOSEN WORDMARK
              </span>
              <div className="flex items-baseline gap-3">
                <h2 className="text-4xl sm:text-6xl font-serif-editorial text-white tracking-tight">
                  {selectedCandidate.name}
                </h2>
                {selectedCandidate.pronunciation && (
                  <span className="text-sm font-mono text-[#a0988e]">
                    /{selectedCandidate.pronunciation}/
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <span className="text-[#8a8175] uppercase block text-[10px]">Verification Notice</span>
              <span className="text-amber-300 font-medium">
                Availability Not Checked · Strategic Fit Confirmed
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

      {/* Filter Tabs & Naming Worlds Island Grid */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#a89f92]">
              Explore Naming Worlds ({worlds.length})
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('world')}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                filterMode === 'world'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-[#8a8175] hover:text-white'
              }`}
            >
              By World
            </button>
            <button
              onClick={() => setFilterMode('shortlist')}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                filterMode === 'shortlist'
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'text-[#8a8175] hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Shortlist ({shortlistedIds.size})</span>
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                filterMode === 'all'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-[#8a8175] hover:text-white'
              }`}
            >
              All Names ({allCandidates.length})
            </button>
          </div>
        </div>

        {/* Territory Island Cards (visible in World mode) */}
        {filterMode === 'world' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {worlds.map((terr, idx) => {
              const isTerritoryActive = activeWorldId === terr.id;

              return (
                <button
                  key={terr.id}
                  onClick={() => setActiveWorldId(terr.id)}
                  className={`p-6 rounded-3xl spatial-surface text-left transition-all duration-300 cursor-pointer relative ${
                    isTerritoryActive
                      ? 'border-amber-400/80 bg-[#25221f]/90 shadow-2xl scale-[1.02]'
                      : 'border-white/[0.08] hover:border-white/20 hover:bg-[#1a1816]/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af37]">
                      WORLD 0{idx + 1}
                    </span>
                    {allCandidates.some(c => c.worldId === terr.id && c.id === naming.selectedNameId) && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" title="Contains selected wordmark" />
                    )}
                  </div>

                  <h3 className="text-lg font-serif-editorial text-white tracking-tight">
                    {terr.name}
                  </h3>

                  <p className="text-xs text-[#a0988e] mt-2 line-clamp-2 leading-relaxed font-light">
                    {terr.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/[0.04] text-[10px] font-mono text-[#8a8175]">
                    Trade-off: <span className="text-[#a0988e]">{terr.tradeoff}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Territory Detail Bar */}
        {filterMode === 'world' && activeWorld && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
              <span className="font-mono text-[10px] uppercase text-[#d4af37] tracking-wider">
                WORLD THESIS · {activeWorld.name}
              </span>
              <span className="font-mono text-[10px] text-[#8a8175]">
                Emotional Territory: {activeWorld.emotionalTerritory}
              </span>
            </div>
            <p className="text-[#c8beaf] leading-relaxed">
              <span className="text-white font-semibold">Strategic Idea:</span> {activeWorld.strategicIdea}
            </p>
            <p className="text-[#a0988e] text-[11px] leading-relaxed">
              <span className="text-[#d4af37] font-mono">Naming Logic: </span>{activeWorld.namingLogic}
            </p>
          </div>
        )}

        {/* Candidate Names Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8a8175]">
              {filterMode === 'shortlist'
                ? `Shortlisted Candidates (${displayedCandidates.length})`
                : (filterMode === 'all'
                  ? `All Strategic Candidates (${displayedCandidates.length})`
                  : `Candidates in ${activeWorld?.name || 'World'} (${displayedCandidates.length})`)}
            </span>
          </div>

          {displayedCandidates.length === 0 ? (
            isError ? (
              <div className="p-8 rounded-3xl spatial-surface text-center space-y-3 border border-rose-500/20 bg-rose-500/5">
                <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-rose-200">Naming Generation Failed</p>
                  <p className="text-xs text-[#a0988e] max-w-md mx-auto">
                    {stageStatus?.lastError || 'Unable to generate strategic naming worlds. Please retry generation to continue.'}
                  </p>
                </div>
                <button
                  onClick={() => generateNaming()}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 text-xs font-mono transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Retry Naming</span>
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-3xl spatial-surface text-center space-y-2 border border-white/[0.06]">
                <p className="text-sm text-[#a0988e]">No candidates match this filter.</p>
                {filterMode === 'shortlist' && (
                  <button
                    onClick={() => setFilterMode('world')}
                    className="text-xs text-amber-400 hover:underline font-mono"
                  >
                    Return to Naming Worlds to shortlist candidates →
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayedCandidates.map((cand) => {
                const isSelected = cand.id === naming.selectedNameId;
                const isShortlisted = shortlistedIds.has(cand.id);
                const isRejected = cand.status === 'rejected';
                const isExpanded = expandedCandidateId === cand.id;

                return (
                  <div
                    key={cand.id}
                    className={`p-6 rounded-2xl spatial-surface transition-all duration-300 flex flex-col justify-between space-y-4 ${
                      isRejected ? 'opacity-40 grayscale border-white/[0.04]' : ''
                    } ${
                      isSelected
                        ? 'border-amber-400 bg-white/10 shadow-2xl scale-[1.01]'
                        : 'border-white/[0.08] hover:border-white/20 hover:bg-[#1a1816]/80'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Name Header and Status Badges */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-serif-editorial text-white font-bold tracking-tight">
                              {cand.name}
                            </span>
                            {cand.pronunciation && (
                              <span className="text-[11px] font-mono text-[#8a8175]">
                                /{cand.pronunciation}/
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Shortlist Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleShortlistCandidate(cand.id);
                            }}
                            title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                            className={`p-1.5 rounded-full transition-colors ${
                              isShortlisted
                                ? 'bg-amber-400/20 text-amber-300'
                                : 'text-[#7d7468] hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Reject Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRejectCandidate(cand.id);
                            }}
                            title={isRejected ? 'Un-reject candidate' : 'Mark as rejected'}
                            className={`p-1.5 rounded-full transition-colors ${
                              isRejected
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'text-[#7d7468] hover:text-rose-300 hover:bg-rose-500/10'
                            }`}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Concept & Meaning */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175]">Concept & Morphemes</span>
                        <p className="text-xs text-[#e4ded5] leading-relaxed font-medium">{cand.meaning || cand.concept}</p>
                      </div>

                      {/* Strategic Rationale */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8175]">Strategic Rationale</span>
                        <p className="text-xs text-[#a39a8e] leading-relaxed">{cand.strategicRationale}</p>
                      </div>

                      {/* Trade-off / Potential Weakness */}
                      {cand.potentialWeakness && (
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-tight">
                          <span className="font-mono text-amber-400">Trade-off: </span>
                          {cand.potentialWeakness}
                        </div>
                      )}

                      {/* Expandable Diagnostic Evaluation */}
                      {cand.evaluation && (
                        <div className="pt-2">
                          <button
                            onClick={() => setExpandedCandidateId(isExpanded ? null : cand.id)}
                            className="text-[10px] font-mono text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Diagnostic Scores' : 'View 8-Factor Diagnostic Evaluation'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 text-[10px] animate-fadeIn">
                              <span className="font-mono uppercase text-[#8a8175] block mb-1">Diagnostic Fit Dimensions (0-100)</span>

                              <div className="grid grid-cols-2 gap-2 font-mono">
                                <div>Strategic Fit: <span className="text-amber-300 font-bold">{cand.evaluation.strategicFit}%</span></div>
                                <div>Positioning Fit: <span className="text-amber-300 font-bold">{cand.evaluation.positioningFit}%</span></div>
                                <div>Personality Fit: <span className="text-amber-300 font-bold">{cand.evaluation.personalityFit}%</span></div>
                                <div>Audience Fit: <span className="text-amber-300 font-bold">{cand.evaluation.audienceFit}%</span></div>
                                <div>Distinctiveness: <span className="text-amber-300 font-bold">{cand.evaluation.distinctiveness}%</span></div>
                                <div>Memorability: <span className="text-amber-300 font-bold">{cand.evaluation.memorability}%</span></div>
                                <div>Pronunciation: <span className="text-amber-300 font-bold">{cand.evaluation.pronunciation}%</span></div>
                                <div>Flexibility: <span className="text-amber-300 font-bold">{cand.evaluation.flexibility}%</span></div>
                              </div>

                              {cand.evaluation.risks && cand.evaluation.risks.length > 0 && (
                                <div className="pt-2 border-t border-white/[0.04]">
                                  <span className="font-mono text-rose-300 uppercase block">Identified Strategic Risks:</span>
                                  <ul className="list-disc list-inside text-[#a0988e] space-y-0.5 mt-1 font-sans">
                                    {cand.evaluation.risks.map((risk, rIdx) => (
                                      <li key={rIdx}>{risk}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Bar per Candidate Card */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="text-[11px] text-[#a0988e]">
                        <span className="font-mono text-[#7d7468]">Voice: </span>
                        <span>{cand.personalityFit}</span>
                      </div>

                      <button
                        onClick={() => selectNamingCandidate(cand.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-black font-semibold shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isSelected ? '✓ ACTIVE' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Action Advance Bar */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {canEnterVisualize ? (
          <>
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
          </>
        ) : (
          <>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#a0988e]">
                <span>{isError ? 'Naming Generation Incomplete' : isGenerating ? 'Synthesizing Naming Worlds...' : 'Naming Generation Required'}</span>
                <span className={`w-2 h-2 rounded-full ${isError ? 'bg-rose-500' : isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-[#7d7468]'}`} />
              </div>
              <p className="text-xs text-[#8a8175]">
                {isError 
                  ? 'Resolve naming generation errors and confirm a wordmark to unlock Visual Studio.'
                  : isGenerating 
                  ? 'Groq is currently synthesizing naming worlds and strategic candidates...'
                  : 'Generate and confirm a brand name before advancing to Visual Studio.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isError && (
                <button
                  onClick={() => generateNaming()}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-semibold text-xs rounded-full transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Retry Naming</span>
                </button>
              )}
              <button
                disabled={true}
                title="Complete naming stage before advancing to Visual Studio"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 text-[#7d7468] font-semibold text-xs rounded-full cursor-not-allowed border border-white/5 opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Enter Visual Studio (Locked)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

