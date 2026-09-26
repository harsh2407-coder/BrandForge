import React, { useState, useMemo } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { 
  Rocket, 
  Copy, 
  Check, 
  ArrowRight, 
  Share2, 
  MessageSquare, 
  Pencil, 
  BookOpen,
  Printer,
  Download,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Compass,
  Layers,
  ArrowDown
} from 'lucide-react';
import { EditFieldModal } from '../../shared/EditFieldModal';
import { assembleDeliverData } from '../../../utils/deliverAssembly';

export const LaunchStage: React.FC = () => {
  const { 
    brandMemory, 
    updateLaunch, 
    goToStage,
    setActiveView 
  } = useBrand();

  const { launch } = brandMemory;
  const deliverData = useMemo(() => assembleDeliverData(brandMemory), [brandMemory]);
  const brandName = deliverData.brandName;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<keyof typeof launch | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('essence');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(brandMemory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-system.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      
      {/* 1. Chapter Editorial Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>08 / DELIVER</span>
            <span aria-hidden="true">·</span>
            <span>SYSTEM CONSOLIDATION</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">GROUNDED & COHERENT</span>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => copyToClipboard(JSON.stringify(deliverData, null, 2), 'full_data')}
              className="px-3 py-1.5 rounded-full spatial-surface text-xs font-mono text-[#c8beaf] hover:text-white transition-all flex items-center gap-1.5"
              title="Copy Assembled Deliver Data"
            >
              {copiedKey === 'full_data' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'full_data' ? 'Copied System' : 'Copy System Data'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-full spatial-surface text-xs font-mono text-[#c8beaf] hover:text-white transition-all flex items-center gap-1.5"
              title="Export Brand JSON"
            >
              {downloadSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
              <span>{downloadSuccess ? 'Exported' : 'Export JSON'}</span>
            </button>

            <button
              onClick={() => {
                goToStage('brand-kit');
                setActiveView('brand-kit');
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3 h-3 text-amber-300" />
              <span>Full Brand Book</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8a8175] block">
            CULMINATION OF BRAND INTELLIGENCE
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-editorial text-white tracking-tight leading-[1.05]">
            Your brand, made coherent.
          </h1>
          <p className="text-base sm:text-lg text-[#c8beaf] max-w-3xl font-light leading-relaxed">
            <span className="text-white font-medium">{brandName}</span> is assembled into a complete strategic and creative system, built from your original idea, challenged for weaknesses, refined by your decisions, and ready for founder execution.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 no-print scrollbar-none text-xs font-mono">
          {[
            { id: 'essence', label: 'Essence & Summary' },
            { id: 'foundation', label: 'Foundation' },
            { id: 'personality', label: 'Personality & Voice' },
            { id: 'naming', label: 'The Name' },
            { id: 'visual', label: 'Visual Board' },
            { id: 'messaging', label: 'Messaging' },
            { id: 'challenge', label: 'What We Challenged' },
            { id: 'checklist', label: 'Launch Checklist' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                  : 'text-[#8a8175] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12 my-8">

        {/* 2. EXECUTIVE BRAND SUMMARY & ESSENCE */}
        <section id="essence" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              01 / EXECUTIVE SUMMARY & BRAND ESSENCE
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Strategic Synthesis</span>
          </div>

          {/* Brand Essence Core Plate */}
          <div className="p-8 sm:p-12 rounded-3xl spatial-surface border border-amber-400/20 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                THE BRAND ESSENCE
              </span>
              <span className="text-[10px] font-mono text-[#8a8175] uppercase">
                Problem + Positioning + Personality + Visual
              </span>
            </div>

            <p className="text-2xl sm:text-4xl font-serif-editorial text-white leading-relaxed">
              "{deliverData.brandEssence}"
            </p>

            <div className="pt-2 text-xs font-mono text-[#8a8175] border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-2">
              <span>Category: {deliverData.strategicFoundation.positioning || 'Specialized Digital Product'}</span>
              <span>One-Line Pitch: "{deliverData.oneLinePitch}"</span>
            </div>
          </div>

          {/* 6-Pillar Strategic Executive Summary */}
          <div className="p-8 rounded-3xl spatial-surface space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-white">
                EXECUTIVE STRATEGIC BLUEPRINT
              </span>
              <span className="text-[10px] font-mono text-[#8a8175]">Grounded in Discovery & Positioning</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">1. What is this brand?</span>
                <p className="text-xs text-[#d6cec3] leading-relaxed">
                  {deliverData.brandName} is a focused brand in the category of <span className="text-white font-medium">{deliverData.strategicFoundation.positioning || 'focused digital solutions'}</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">2. Who is it for?</span>
                <p className="text-xs text-[#d6cec3] leading-relaxed">
                  Specifically architected for <span className="text-white font-medium">{deliverData.strategicFoundation.audience}</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">3. What problem does it solve?</span>
                <p className="text-xs text-[#d6cec3] leading-relaxed">
                  Eliminates <span className="text-white font-medium">{deliverData.strategicFoundation.problem}</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">4. What does it promise?</span>
                <p className="text-xs text-[#d6cec3] leading-relaxed">
                  Delivers <span className="text-white font-medium">{deliverData.strategicFoundation.valueProposition}</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">5. Why audience cares</span>
                <p className="text-xs text-[#d6cec3] leading-relaxed">
                  Solves the core need for <span className="text-white font-medium">{deliverData.strategicFoundation.need}</span>, removing the friction of legacy alternatives.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">6. Distinctive edge</span>
                <p className="text-xs text-[#d6cec3] leading-relaxed">
                  Defended by: <span className="text-white font-medium">{deliverData.strategicFoundation.differentiation || 'disciplined strategic focus'}</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STRATEGIC FOUNDATION */}
        <section id="foundation" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              02 / STRATEGIC FOUNDATION
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Discovery & Positioning Core</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl spatial-surface space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-wider block">
                The Core Problem (From Discovery)
              </span>
              <p className="text-sm text-white font-serif-editorial leading-relaxed">
                {deliverData.strategicFoundation.problem}
              </p>
            </div>

            <div className="p-6 rounded-3xl spatial-surface space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-wider block">
                The Beachhead Audience (From Discovery)
              </span>
              <p className="text-sm text-white font-serif-editorial leading-relaxed">
                {deliverData.strategicFoundation.audience}
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl spatial-surface space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              POSITIONING STATEMENT & VALUE PROPOSITION
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-editorial text-white leading-relaxed">
              "{deliverData.strategicFoundation.positioning || deliverData.strategicFoundation.valueProposition}"
            </h3>
            <div className="pt-2 text-xs text-[#c8beaf] flex items-center gap-2">
              <span className="font-semibold text-white font-mono uppercase text-[10px]">Operational Moat:</span>
              <span>{deliverData.strategicFoundation.differentiation}</span>
            </div>
          </div>
        </section>

        {/* 4. PERSONALITY & BRAND VOICE */}
        <section id="personality" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              03 / PERSONALITY & BRAND VOICE
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Behavioral Rules & Heuristics</span>
          </div>

          {/* Personality Traits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliverData.personality.traits.map((t, idx) => (
              <div key={t.name} className="p-6 rounded-3xl spatial-surface space-y-2">
                <span className="text-[10px] font-mono text-[#8a8175] uppercase block">
                  Trait 0{idx + 1}
                </span>
                <h4 className="text-lg font-serif-editorial text-white uppercase">
                  {t.name}
                </h4>
                <p className="text-xs text-[#a39a8e] leading-relaxed">
                  {t.whyItFits || t.description}
                </p>
              </div>
            ))}
          </div>

          {/* Avoid Traits & Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl spatial-surface-subtle space-y-3">
              <span className="text-[10px] font-mono uppercase text-red-400 tracking-widest block">
                EXPLICITLY BANNED TRAITS
              </span>
              <div className="space-y-2">
                {deliverData.personality.avoidTraits.map((a, i) => (
                  <div key={i} className="text-xs text-[#d6cec3] flex items-start gap-2">
                    <span className="text-red-400 font-mono">✕</span>
                    <div>
                      <span className="font-semibold text-white">{a.trait || a.name}: </span>
                      <span className="text-[#a39a8e]">{a.reason || a.reasonToAvoid || a.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl spatial-surface-subtle space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                BRAND PRINCIPLES
              </span>
              <div className="space-y-2">
                {deliverData.personality.principles.map((p, i) => (
                  <div key={i} className="text-xs text-[#d6cec3] flex items-start gap-2">
                    <span className="text-amber-400 font-mono">0{i + 1}.</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Summary & Tone Rules */}
          <div className="p-6 rounded-3xl spatial-surface space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest">
                VOICE ARCHITECTURE
              </span>
              <span className="text-[10px] font-mono text-[#8a8175]">{deliverData.personality.voiceSummary}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-widest block">Writing Heuristic: DO</span>
                <p className="text-xs text-white leading-relaxed">
                  "{deliverData.messaging.toneExamples.do}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/[0.05] border border-red-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase text-red-400 tracking-widest block">Writing Heuristic: AVOID</span>
                <p className="text-xs text-[#c8beaf] leading-relaxed">
                  "{deliverData.messaging.toneExamples.avoid}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. THE NAME */}
        <section id="naming" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              04 / THE NAME
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Verbal Carrier</span>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl spatial-surface flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                FINAL WORDMARK
              </span>
              <h2 className="text-4xl sm:text-6xl font-serif-editorial text-white tracking-tight">
                {deliverData.naming.selectedName}
              </h2>
              {deliverData.naming.namingWorld && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c8beaf]">
                  <span>World: {deliverData.naming.namingWorld}</span>
                </div>
              )}
              <p className="text-xs text-[#a39a8e] leading-relaxed pt-1">
                {deliverData.naming.rationale}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono space-y-2 text-[#8a8175] min-w-[240px]">
              <div className="text-white font-medium pb-1 border-b border-white/10">Diagnostic Integrity</div>
              <div>Strategic Fit: High</div>
              <div>Category Alignment: Verified</div>
              <div className="text-[10px] text-[#a39a8e] pt-1">
                * Grounding note: Legal trademark & domain clearance must be verified with primary registries before filing.
              </div>
            </div>
          </div>
        </section>

        {/* 6. VISUAL BRAND BOARD & SYSTEM */}
        <section id="visual" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              05 / VISUAL IDENTITY & BRAND BOARD
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Creative Direction & Design Tokens</span>
          </div>

          {/* Visual Board Hero */}
          <div className="p-8 sm:p-12 rounded-3xl spatial-surface border border-white/10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                  CREATIVE DIRECTION CONCEPT
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif-editorial text-white">
                  {deliverData.visualIdentity.creativeDirection}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {deliverData.visualIdentity.moodKeywords.map(k => (
                  <span key={k} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c8beaf]">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* 7-Role Color Palette Board */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-widest block">
                7-ROLE COLOR SYSTEM
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {deliverData.visualIdentity.colors.map((swatch) => (
                  <div key={swatch.name} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                    <div
                      className="w-full h-16 rounded-xl border border-white/15 shadow-inner"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="text-xs font-medium text-white truncate">{swatch.name}</div>
                    <div className="text-[10px] font-mono text-[#d4af37] uppercase">{swatch.role}</div>
                    <div className="text-[10px] font-mono text-[#8a8175]">{swatch.hex}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Specimen */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-widest block">
                TYPOGRAPHY SPECIMENS
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deliverData.visualIdentity.typography.map((spec) => (
                  <div key={spec.role} className="space-y-1">
                    <span className="text-[10px] font-mono text-[#d4af37] uppercase block">{spec.role}</span>
                    <div className="text-xl font-bold text-white tracking-tight">{spec.family}</div>
                    <p className="text-xs text-[#a0988e] leading-relaxed">{spec.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. LAUNCH MESSAGING SYSTEM */}
        <section id="messaging" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              06 / LAUNCH MESSAGING SYSTEM
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Conversion & Public Distribution</span>
          </div>

          {/* Hero Landing Page Headline & Specimen Plate */}
          <div className="p-8 sm:p-12 rounded-3xl spatial-surface border border-white/10 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                PRIMARY CONVERSION HEADLINE
              </span>
              <button
                onClick={() => setEditingKey('headline')}
                className="text-xs text-[#8a8175] hover:text-white flex items-center gap-1 font-mono transition-colors no-print"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit headline</span>
              </button>
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif-editorial text-white tracking-tight leading-[1.05]">
              "{deliverData.messaging.headline}"
            </h2>

            <p className="text-base sm:text-lg text-[#c8beaf] max-w-2xl font-light leading-relaxed">
              {deliverData.messaging.subheadline || deliverData.messaging.oneLinePitch}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button className="px-6 py-3 bg-[#f4efe8] text-black text-xs font-semibold rounded-full shadow-lg">
                {deliverData.messaging.primaryCta}
              </button>
              <button className="px-6 py-3 spatial-surface text-white text-xs font-medium rounded-full">
                {deliverData.messaging.secondaryCta}
              </button>
            </div>
          </div>

          {/* One-Line Pitch & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl spatial-surface space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
                <span className="uppercase">One-Line Pitch</span>
                <button
                  onClick={() => copyToClipboard(deliverData.messaging.oneLinePitch, 'pitch')}
                  className="text-[#a89f92] hover:text-white flex items-center gap-1 no-print"
                >
                  {copiedKey === 'pitch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-base text-white font-serif-editorial leading-snug">
                "{deliverData.messaging.oneLinePitch}"
              </p>
            </div>

            <div className="p-6 rounded-3xl spatial-surface space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
                <span className="uppercase">Core Product Description</span>
                <button
                  onClick={() => copyToClipboard(deliverData.messaging.productDescription, 'desc')}
                  className="text-[#a89f92] hover:text-white flex items-center gap-1 no-print"
                >
                  {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-[#b8afa3] leading-relaxed">
                {deliverData.messaging.productDescription}
              </p>
            </div>
          </div>

          {/* Social Post & Launch Letter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Social Announcement */}
            <div className="p-6 rounded-3xl spatial-surface-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
                <span className="uppercase flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Social Launch Post ({deliverData.messaging.socialPost?.platform || 'X / LinkedIn'})</span>
                </span>
                <button
                  onClick={() => copyToClipboard(deliverData.messaging.socialPost?.text || '', 'social')}
                  className="text-[#a89f92] hover:text-white flex items-center gap-1 no-print"
                >
                  {copiedKey === 'social' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'social' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#d6cec3] whitespace-pre-line leading-relaxed font-mono">
                {deliverData.messaging.socialPost?.text}
              </div>
            </div>

            {/* Founder Launch Letter */}
            <div className="p-6 rounded-3xl spatial-surface-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
                <span className="uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Founder Announcement Letter</span>
                </span>
                <button
                  onClick={() => copyToClipboard(deliverData.messaging.launchAnnouncement, 'letter')}
                  className="text-[#a89f92] hover:text-white flex items-center gap-1 no-print"
                >
                  {copiedKey === 'letter' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'letter' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#a0988e] leading-relaxed">
                {deliverData.messaging.launchAnnouncement}
              </div>
            </div>
          </div>
        </section>

        {/* 8. WHAT WE CHALLENGED & TRACEABILITY */}
        <section id="challenge" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              07 / WHAT WE CHALLENGED (TRACEABILITY)
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Adversarial Audit & Founder Decisions</span>
          </div>

          {/* Audit Metrics - Honest, No Fake Percentage */}
          <div className="p-6 rounded-3xl spatial-surface flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-base font-serif-editorial text-white">
                Coherence State: <span className="text-emerald-400">{deliverData.challengeSummary.consistencyState}</span>
              </div>
              <p className="text-xs text-[#a0988e] max-w-xl font-light">
                {deliverData.challengeSummary.editorialAssessment}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-white font-bold">{deliverData.challengeSummary.findingsCount}</span> Challenges Surfaced
              </div>
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="font-bold">{deliverData.challengeSummary.resolvedCount}</span> Applied / Resolved
              </div>
              {deliverData.challengeSummary.ignoredCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#8a8175]">
                  <span className="font-bold">{deliverData.challengeSummary.ignoredCount}</span> Ignored
                </div>
              )}
              {deliverData.challengeSummary.openCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <span className="font-bold">{deliverData.challengeSummary.openCount}</span> Open Considerations
                </div>
              )}
            </div>
          </div>

          {/* Challenge Traceability Cards: BEFORE -> DECISION -> AFTER */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8a8175] block">
              ACCEPTED STRATEGIC REVISIONS (HUMAN DECISION TRACEABILITY)
            </span>

            {deliverData.challengeSummary.traceability.length === 0 ? (
              <div className="p-6 rounded-3xl spatial-surface-subtle text-xs text-[#8a8175] font-mono">
                No human revisions were accepted during the Challenge stage. Strategy maintained its initial baseline.
              </div>
            ) : (
              deliverData.challengeSummary.traceability.map((item) => (
                <div key={item.id} className="p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-white/[0.3]">·</span>
                      <span className="text-xs font-semibold text-white">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      Target: {item.targetStage}.{item.field}
                    </span>
                  </div>

                  {/* Transformation Chain */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    {/* BEFORE */}
                    <div className="p-4 rounded-2xl bg-red-500/[0.04] border border-red-500/15 space-y-1.5">
                      <span className="text-[10px] uppercase text-red-400 tracking-wider font-semibold block">
                        BEFORE CRITIQUE
                      </span>
                      <p className="text-[#c8beaf] font-sans leading-relaxed">
                        "{item.beforeValue}"
                      </p>
                    </div>

                    {/* DECISION */}
                    <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/15 space-y-1.5 flex flex-col justify-between">
                      <span className="text-[10px] uppercase text-amber-400 tracking-wider font-semibold block">
                        HUMAN GOVERNANCE
                      </span>
                      <p className="text-[#d6cec3] font-sans leading-relaxed text-xs">
                        {item.decision}
                      </p>
                      <div className="text-[10px] text-[#8a8175] pt-1 border-t border-white/5">
                        Rationale: {item.rationale}
                      </div>
                    </div>

                    {/* AFTER */}
                    <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/15 space-y-1.5">
                      <span className="text-[10px] uppercase text-emerald-400 tracking-wider font-semibold block">
                        FINAL DELIVER FORMULATION
                      </span>
                      <p className="text-white font-sans leading-relaxed">
                        "{item.afterValue}"
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 9. LAUNCH CHECKLIST */}
        <section id="checklist" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              08 / FOUNDER LAUNCH CHECKLIST
            </span>
            <span className="text-xs font-mono text-[#8a8175]">Completed Assets vs Real-World Next Steps</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliverData.launchChecklist.map((item) => (
              <div 
                key={item.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  item.isCompleted 
                    ? 'bg-emerald-500/[0.03] border-emerald-500/20' 
                    : 'spatial-surface-subtle border-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#8a8175]" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#8a8175]">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#a0988e] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 10. Action Advance Bar to Brand Book */}
      <div className="p-8 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 my-8 no-print shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-base font-semibold text-white">
            <span>Brand System Assembled & Coherent</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-[#8a8175] max-w-xl">
            You can now review the full-screen publication Brand Book, print it as an executive PDF, or copy the brief for your engineering and creative teams.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 spatial-surface hover:border-white/20 text-[#c8beaf] hover:text-white font-mono text-xs rounded-full transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={() => {
              goToStage('brand-kit');
              setActiveView('brand-kit');
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Publication Brand Book</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingKey && (
        <EditFieldModal
          isOpen={!!editingKey}
          title={`Edit ${String(editingKey)}`}
          fieldLabel="Refine copy"
          initialValue={String(launch[editingKey])}
          onSave={(val) => {
            updateLaunch({ [editingKey]: val });
            setEditingKey(null);
          }}
          onClose={() => setEditingKey(null)}
        />
      )}
    </div>
  );
};
