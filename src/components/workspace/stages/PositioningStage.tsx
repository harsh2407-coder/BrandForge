import React, { useState, useEffect } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { 
  Compass, 
  ArrowRight, 
  Pencil, 
  ShieldAlert, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { EditFieldModal } from '../../shared/EditFieldModal';

interface TerritorySpot {
  id: string;
  name: string;
  quadrant: string;
  x: number; // percentage
  y: number; // percentage
  isCurrent: boolean;
  valueProp: string;
  whyExplanation: string;
  tradeoff: string;
}

export const PositioningStage: React.FC = () => {
  const { 
    brandMemory, 
    updatePositioning, 
    advanceToNextStage, 
    generatePositioning
  } = useBrand();

  const { positioning } = brandMemory;
  const stageStatus = brandMemory.stageExecution?.position;

  const defaultTerritories: TerritorySpot[] = [
    {
      id: 'current',
      name: 'SprintForge (Current Recommendation)',
      quadrant: 'Niche + Emotional/Belonging',
      x: 75,
      y: 28,
      isCurrent: true,
      valueProp: positioning.valueProposition || 'Form high-chemistry, complementary hackathon squads in under 10 minutes.',
      whyExplanation:
        positioning.whyThisPosition || positioning.positioningRationale ||
        'You are currently positioned here. Targeting collegiate hackathon competitors with an emphasis on squad chemistry and peer trust removes the vulnerability of solo competing while remaining hyper-relevant for the 36-hour sprint.',
      tradeoff: 'Tight event window; requires seasonal retention loops.'
    },
    {
      id: 'functional-niche',
      name: 'Alternative: Pure Technical Stack Matcher',
      quadrant: 'Niche + Functional/Utility',
      x: 78,
      y: 72,
      isCurrent: false,
      valueProp: 'Algorithmic code-commit matching strictly for backend & ML engineers.',
      whyExplanation:
        'An alternative opportunity exists here because deep technical founders prioritize hard engineering parity over social vibe.',
      tradeoff: 'Alienates non-developer roles like UI/UX designers and pitch leads.'
    },
    {
      id: 'broad-emotional',
      name: 'Alternative: Collegiate Creator Society',
      quadrant: 'Broad + Emotional/Identity',
      x: 25,
      y: 30,
      isCurrent: false,
      valueProp: 'Enduring social network for student makers and prospective co-founders.',
      whyExplanation:
        'An alternative opportunity exists here because students want lifelong entrepreneurial friendships beyond single weekends.',
      tradeoff: 'Low adoption urgency without a ticking hackathon countdown.'
    },
    {
      id: 'broad-functional',
      name: 'Incumbents: Discord & Google Sheets',
      quadrant: 'Broad + Functional/Utility',
      x: 22,
      y: 78,
      isCurrent: false,
      valueProp: 'Unstructured forum threads and shared spreadsheets.',
      whyExplanation:
        'Existing workarounds live here: high noise, zero verification, and massive drop-off rates.',
      tradeoff: 'Commoditized, free, and ubiquitous.'
    }
  ];

  const territories: TerritorySpot[] = (positioning.territories && positioning.territories.length > 0)
    ? positioning.territories.map((t) => {
        const isRec = t.id === (positioning.selectedTerritoryId || positioning.territories![0]?.id);
        const quadrant = t.quadrant || (t.x >= 50 ? (t.y <= 50 ? 'Niche + Emotional/Belonging' : 'Niche + Functional/Utility') : (t.y <= 50 ? 'Broad + Emotional/Identity' : 'Broad + Functional/Utility'));
        return {
          id: t.id,
          name: isRec ? `${t.name} (Recommended)` : t.name,
          quadrant,
          x: Math.min(92, Math.max(8, t.x)),
          y: Math.min(92, Math.max(8, t.y)),
          isCurrent: isRec,
          valueProp: t.valueProposition,
          whyExplanation: t.description,
          tradeoff: t.tradeoff,
        };
      })
    : defaultTerritories;

  const [activeTerritoryId, setActiveTerritoryId] = useState<string>(() => {
    return positioning.selectedTerritoryId || territories[0]?.id || 'current';
  });

  useEffect(() => {
    if (positioning.selectedTerritoryId && territories.some(t => t.id === positioning.selectedTerritoryId)) {
      setActiveTerritoryId(positioning.selectedTerritoryId);
    } else if (territories.length > 0 && !territories.some(t => t.id === activeTerritoryId)) {
      setActiveTerritoryId(territories[0].id);
    }
  }, [positioning.selectedTerritoryId, territories, activeTerritoryId]);

  // If real brand with discovery ready but positioning idle, trigger generation
  useEffect(() => {
    if (
      brandMemory.id !== 'demo-hackathon-teammates' &&
      brandMemory.discovery?.coreProblem &&
      brandMemory.stageExecution?.position?.status === 'idle' &&
      (!positioning.territories || positioning.territories.length === 0)
    ) {
      generatePositioning();
    }
  }, [brandMemory.id, brandMemory.discovery?.coreProblem, brandMemory.stageExecution?.position?.status, positioning.territories, generatePositioning]);

  const activeSpot = territories.find(t => t.id === activeTerritoryId) || territories[0];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAdoptAlternative = (spot: TerritorySpot) => {
    updatePositioning({
      selectedTerritoryId: spot.id,
      valueProposition: spot.valueProp,
      positioningStatement: `For ${brandMemory.discovery?.primaryAudience || 'our users'}, this brand provides: ${spot.valueProp}`,
      whyThisPosition: spot.whyExplanation,
      positioningRationale: spot.whyExplanation
    });
  };

  const xAxis = positioning.xAxis || { lowLabel: 'BROAD / GENERALIST', highLabel: 'NICHE / SPECIALIZED' };
  const yAxis = positioning.yAxis || { lowLabel: 'EMOTIONAL / CHEMISTRY', highLabel: 'FUNCTIONAL / MECHANICAL' };

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>02 / POSITIONING LANDSCAPE</span>
            <span aria-hidden="true">·</span>
            <span>STRATEGIC COORDINATES</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Grounding in verified Discovery satellites
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          Where should this brand live?
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          Positioning is not about claiming you are the best. It is about claiming an unoccupied territory where competitors look irrational trying to copy you.
        </p>
      </div>

      {/* Controlled Stage Error Banner */}
      {stageStatus?.status === 'error' && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-semibold text-xs block text-rose-300">Positioning Generation Failed</span>
              <span className="text-xs text-rose-200/90">
                {stageStatus.lastError || 'Unable to generate strategic territories. Please try again.'}
              </span>
            </div>
          </div>
          <button
            onClick={() => generatePositioning()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 text-xs font-medium transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Positioning</span>
          </button>
        </div>
      )}

      {/* 2D Spatial Strategic Landscape Canvas */}
      <div className="relative my-8 p-6 sm:p-10 rounded-3xl spatial-surface border border-white/[0.08] overflow-hidden">
        {/* Map Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#b5aca0] flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>2D Strategic Terrain Map</span>
          </span>
          <span className="text-[11px] font-mono text-[#7d7468]">
            Click beacons to inspect alternative territories
          </span>
        </div>

        {/* 2D Spatial Grid with Axes */}
        <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-[#141312]/90 border border-white/[0.06] overflow-hidden p-6 flex items-center justify-center">
          
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Horizontal Axis: Dynamic lowLabel <-> highLabel */}
          <div className="absolute top-1/2 left-4 right-4 h-px bg-white/10 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7a7266] bg-[#141312] px-2 -translate-y-1/2">
              ← {xAxis.lowLabel}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7a7266] bg-[#141312] px-2 -translate-y-1/2">
              {xAxis.highLabel} →
            </span>
          </div>

          {/* Vertical Axis: Dynamic lowLabel <-> highLabel */}
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 flex flex-col justify-between items-center pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7a7266] bg-[#141312] py-1 -translate-x-1/2">
              ↑ {yAxis.lowLabel}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7a7266] bg-[#141312] py-1 -translate-x-1/2">
              ↓ {yAxis.highLabel}
            </span>
          </div>

          {/* Quadrant Soft Labels for Demo Brand */}
          {(!positioning.territories || positioning.territories.length === 0) && (
            <>
              <div className="absolute top-6 right-6 text-[10px] font-mono text-[#5a5349] uppercase pointer-events-none">
                Podium Craft & Trust
              </div>
              <div className="absolute bottom-6 right-6 text-[10px] font-mono text-[#5a5349] uppercase pointer-events-none">
                Algorithmic Stack Match
              </div>
              <div className="absolute top-6 left-6 text-[10px] font-mono text-[#5a5349] uppercase pointer-events-none">
                Social Community
              </div>
              <div className="absolute bottom-6 left-6 text-[10px] font-mono text-[#5a5349] uppercase pointer-events-none">
                Unstructured Forums
              </div>
            </>
          )}

          {/* Interactive Spot Beacons on Map */}
          {territories.map((spot) => {
            const isSelected = activeTerritoryId === spot.id;

            return (
              <button
                key={spot.id}
                onClick={() => setActiveTerritoryId(spot.id)}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 group transition-all duration-300 p-2 rounded-full cursor-pointer focus:outline-none flex items-center gap-2 ${
                  isSelected ? 'scale-115' : 'hover:scale-105'
                }`}
              >
                {/* Beacon Pulse Ring */}
                <div className="relative flex items-center justify-center">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      spot.isCurrent
                        ? 'bg-amber-400 ring-4 ring-amber-400/20'
                        : isSelected
                        ? 'bg-sky-400 ring-4 ring-sky-400/20'
                        : 'bg-white/40 ring-2 ring-white/10'
                    }`}
                  />
                  {spot.isCurrent && (
                    <span className="absolute w-6 h-6 rounded-full bg-amber-400/30 animate-ping" />
                  )}
                </div>

                <span
                  className={`text-[11px] font-mono tracking-tight px-2.5 py-1 rounded-full backdrop-blur-md border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-black border-white font-semibold shadow-lg'
                      : spot.isCurrent
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                      : 'bg-[#181615]/80 text-[#8a8175] border-white/10 group-hover:text-white'
                  }`}
                >
                  {spot.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Strategic Terrain Analysis Box */}
      <div className="p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 shadow-2xl mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              TERRAIN ANALYSIS · {activeSpot.quadrant}
            </span>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              {activeSpot.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!activeSpot.isCurrent && (
              <button
                onClick={() => handleAdoptAlternative(activeSpot)}
                className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Shift to this position
              </button>
            )}

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full spatial-surface text-xs text-[#c8beaf] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
            >
              <Pencil className="w-3 h-3" />
              <span>Edit Statement</span>
            </button>
          </div>
        </div>

        {/* AI Explanation & Trade-off */}
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#8a8175] uppercase tracking-wider block">Strategic Rationale</span>
            <p className="text-base text-white font-serif-editorial leading-relaxed">
              {activeSpot.whyExplanation}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#a0988e] flex items-center gap-2">
            <span className="font-mono text-[#d4af37] uppercase shrink-0">Strategic Trade-off:</span>
            <span>{activeSpot.tradeoff}</span>
          </div>

          {/* Primary Differentiation */}
          {(positioning.primaryDifferentiation || positioning.differentiator) && (
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#a0988e] flex items-start gap-2">
              <span className="font-mono text-[#d4af37] uppercase shrink-0">Primary Differentiation:</span>
              <span className="text-white/90">{positioning.primaryDifferentiation || positioning.differentiator}</span>
            </div>
          )}

          {/* Key Value Pillars */}
          {positioning.keyPillars && positioning.keyPillars.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block">Key Value Pillars</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {positioning.keyPillars.map((pillar, idx) => (
                  <div key={idx} className="text-xs text-[#dcd5cc] bg-white/[0.04] p-2.5 rounded-xl border border-white/[0.04] flex items-start gap-2">
                    <span className="text-amber-400 font-mono text-[10px] shrink-0 mt-0.5">0{idx + 1}</span>
                    <span className="leading-snug">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Position Statement Bar */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>Position locked in Brand Memory</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-[#8a8175]">
            {positioning.positioningStatement || 'Next, we crystallize the human personality constellation that embodies this position.'}
          </p>
        </div>

        <button
          onClick={advanceToNextStage}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <span>Shape brand personality</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditFieldModal
          isOpen={isEditModalOpen}
          title="Edit Positioning Statement"
          fieldLabel="The singular strategic positioning statement"
          initialValue={positioning.positioningStatement}
          onSave={(val) => {
            updatePositioning({ positioningStatement: val });
            setIsEditModalOpen(false);
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

