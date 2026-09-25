import React, { useState } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { 
  Pencil, 
  ArrowRight, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  Compass, 
  AlertCircle,
  HelpCircle,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { EditFieldModal } from '../../shared/EditFieldModal';
import { BrandNucleus } from '../../canvas/BrandNucleus';

type DiscoveryNodeKey = 'problem' | 'audience' | 'need' | 'context' | 'alternatives';

export const DiscoverStage: React.FC = () => {
  const { 
    brandMemory, 
    updateDiscovery, 
    advanceToNextStage, 
    goToStage 
  } = useBrand();

  const { discovery } = brandMemory;
  const [activeNodeKey, setActiveNodeKey] = useState<DiscoveryNodeKey | null>('problem');

  // Edit modal
  const [editModal, setEditModal] = useState<{
    key: string;
    title: string;
    label: string;
    value: string;
  } | null>(null);

  const nodesMap = {
    problem: {
      id: 'problem',
      label: 'PROBLEM',
      title: 'Core Structural Problem',
      summary: discovery.coreProblem,
      color: '#f59e0b',
      details: 'The fundamental friction that prevents users from reaching their desired outcome under current conditions.'
    },
    audience: {
      id: 'audience',
      label: 'AUDIENCE',
      title: 'Primary Beachhead Audience',
      summary: discovery.primaryAudience,
      color: '#e0a96d',
      details: 'The hyper-specific persona who experiences this pain acutely enough to immediately change behaviors.'
    },
    need: {
      id: 'need',
      label: 'CORE NEED',
      title: 'Strategic Emotional & Utility Need',
      summary: discovery.coreNeed,
      color: '#10b981',
      details: 'What the brand must fulfill beyond basic features to earn long-term trust and loyalty.'
    },
    context: {
      id: 'context',
      label: 'CONTEXT',
      title: 'User High-Friction Context',
      summary: discovery.userContext,
      color: '#38bdf8',
      details: 'The urgent timeline or environment where existing solutions fail catastrophically.'
    },
    alternatives: {
      id: 'alternatives',
      label: 'ALTERNATIVES',
      title: 'Current Ad-Hoc Alternatives',
      summary: discovery.currentAlternatives?.join(' · ') || 'Spreadsheets, Discord, ad-hoc chats',
      color: '#a855f7',
      details: 'The manual, fragmented workarounds users cobble together today before your brand exists.'
    }
  };

  const selectedNode = activeNodeKey ? nodesMap[activeNodeKey] : null;

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>01 / DISCOVERY MAP</span>
            <span aria-hidden="true">·</span>
            <span>STRATEGIC SATELLITES</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Click satellites to inspect & reshape reasoning
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          The Strategic Diagnosis.
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          Your rough concept has crystallized into 5 relational satellites surrounding the core idea. Explore each node to review, adjust, or stress-test.
        </p>
      </div>

      {/* Spatial Map Canvas with Central Idea & Orbiting Satellites */}
      <div className="relative my-8 min-h-[480px] rounded-3xl spatial-surface border border-white/[0.08] p-6 sm:p-10 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Subtle Background 3D Nucleus Atmosphere */}
        <div className="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center">
          <BrandNucleus
            stage="discover"
            shape="icosahedron"
            speedMultiplier={0.8}
            className="w-full h-full max-w-2xl"
            showLabels={false}
          />
        </div>

        {/* Central Core Object: THE IDEA */}
        <div className="relative z-10 p-6 sm:p-8 rounded-3xl spatial-surface border border-amber-400/40 shadow-2xl max-w-md text-center backdrop-blur-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block mb-1">
            THE RAW IDEA
          </span>
          <p className="text-base sm:text-lg font-serif-editorial text-white leading-snug">
            "{brandMemory.roughIdea || 'Collegiate hackathon teammate finder'}"
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#8a8175] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>5 Satellites Formed</span>
          </div>
        </div>

        {/* Orbiting Satellite Nodes */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-5 gap-3 mt-8 z-10">
          {(Object.keys(nodesMap) as DiscoveryNodeKey[]).map((key) => {
            const item = nodesMap[key];
            const isSelected = activeNodeKey === key;

            return (
              <button
                key={key}
                onClick={() => setActiveNodeKey(key)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 spatial-surface cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-400/80 bg-[#25221f]/90 shadow-xl scale-105'
                    : 'border-white/[0.08] hover:border-white/20 hover:bg-[#1a1816]/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#8a8175]">
                    {item.label}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                  />
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {item.title}
                </div>
                <p className="text-[11px] text-[#a0988e] mt-1 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Expanded Reasoning Deck */}
      {selectedNode && (
        <div className="p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 shadow-2xl relative mb-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedNode.color, boxShadow: `0 0 10px ${selectedNode.color}` }}
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8a8175]">
                  Satellite Inspection · {selectedNode.label}
                </span>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  {selectedNode.title}
                </h3>
              </div>
            </div>

            {/* Actions: Accept, Edit, Challenge */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditModal({
                  key: selectedNode.id,
                  title: `Refine ${selectedNode.title}`,
                  label: 'Human-in-the-loop adjustment',
                  value: selectedNode.summary || ''
                })}
                className="px-3.5 py-1.5 rounded-full spatial-surface text-xs font-medium text-[#c8beaf] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => goToStage('challenge')}
                className="px-3.5 py-1.5 rounded-full spatial-surface text-xs font-medium text-[#c8beaf] hover:text-rose-300 hover:border-rose-400/40 transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>Challenge</span>
              </button>

              <button
                onClick={() => {
                  updateDiscovery({ isConfirmed: true });
                }}
                className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5"
              >
                <Check className="w-3 h-3" />
                <span>Accept</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-base text-[#f4efe8] font-serif-editorial leading-relaxed">
              "{selectedNode.summary}"
            </p>
            <p className="text-xs text-[#8a8175] font-light">
              {selectedNode.details}
            </p>
          </div>
        </div>
      )}

      {/* Strategic Assumptions & Questions Tray */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-5 rounded-2xl spatial-surface-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Unvalidated Assumptions ({discovery.assumptions?.length || 0})</span>
          </div>
          <div className="space-y-2">
            {discovery.assumptions?.map((asm) => (
              <div key={asm.id} className="text-xs text-[#a0988e] leading-relaxed">
                <span className="text-white font-medium">• {asm.statement}</span>
                <span className="block text-[11px] text-[#7a7266] pl-2 font-mono">
                  Test: {asm.validationTip}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl spatial-surface-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8a8175] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Open Inquiry</span>
          </div>
          <div className="space-y-2">
            {discovery.openQuestions?.map((q) => (
              <div key={q.id} className="text-xs text-[#a0988e] leading-relaxed">
                <span className="text-white font-medium">• {q.question}</span>
                <span className="block text-[11px] text-[#7a7266] pl-2 font-mono">
                  Strategic why: {q.strategicWhy}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Advance Action Bar */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>Satellites verified in Brand Memory</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-[#8a8175]">
            Next, we place this problem into a 2D strategic competitive landscape.
          </p>
        </div>

        <button
          onClick={advanceToNextStage}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <span>Build positioning landscape</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <EditFieldModal
          isOpen={!!editModal}
          title={editModal.title}
          fieldLabel={editModal.label}
          initialValue={editModal.value}
          onSave={(val) => {
            if (editModal.key === 'problem') updateDiscovery({ coreProblem: val });
            if (editModal.key === 'audience') updateDiscovery({ primaryAudience: val });
            if (editModal.key === 'need') updateDiscovery({ coreNeed: val });
            if (editModal.key === 'context') updateDiscovery({ userContext: val });
            setEditModal(null);
          }}
          onClose={() => setEditModal(null)}
        />
      )}
    </div>
  );
};
