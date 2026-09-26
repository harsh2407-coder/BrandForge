import React, { useState, useMemo } from 'react';
import { useBrand } from '../../context/BrandContext';
import { BrandNucleus } from '../canvas/BrandNucleus';
import { 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  Printer, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { assembleDeliverData } from '../../utils/deliverAssembly';

export const BrandKitView: React.FC = () => {
  const { 
    brandMemory, 
    goToStage, 
    startNewProject, 
    setActiveView 
  } = useBrand();

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const deliverData = useMemo(() => assembleDeliverData(brandMemory), [brandMemory]);
  const brandName = deliverData.brandName;
  const { strategicFoundation, personality, naming, visualIdentity, messaging, challengeSummary, launchChecklist } = deliverData;

  const handleCopyFullBrief = () => {
    const brief = `
BRANDFORGE EDITORIAL BRAND BOOK
Brand Mark: ${brandName}
One-Line Positioning: ${deliverData.oneLinePitch}

==================================================
CHAPTER 1 · BRAND ESSENCE & EXECUTIVE SUMMARY
==================================================
Brand Essence:
"${deliverData.brandEssence}"

Executive Strategic Summary:
${deliverData.executiveSummary}

==================================================
CHAPTER 2 · STRATEGIC FOUNDATION
==================================================
Root Problem: ${strategicFoundation.problem}
Beachhead Audience: ${strategicFoundation.audience}
Core Strategic Need: ${strategicFoundation.need}

==================================================
CHAPTER 3 · POSITIONING & VALUE PROPOSITION
==================================================
Positioning Statement:
"${strategicFoundation.positioning}"

Value Proposition:
"${strategicFoundation.valueProposition}"

Operational Moat / Differentiation:
${strategicFoundation.differentiation}

==================================================
CHAPTER 4 · PERSONALITY & VOICE
==================================================
Archetype Traits: ${personality.traits.map(t => t.name).join(', ')}
Explicitly Banned Traits: ${personality.avoidTraits.map(a => a.trait || a.name).join(', ')}
Brand Principles:
${personality.principles.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}

Voice Summary: ${personality.voiceSummary}
Tone Rule DO: "${messaging.toneExamples.do}"
Tone Rule AVOID: "${messaging.toneExamples.avoid}"

==================================================
CHAPTER 5 · VERBAL CARRIER & NAMING
==================================================
Chosen Wordmark: ${naming.selectedName}
Strategic Rationale: ${naming.rationale}
${naming.namingWorld ? `Naming World: ${naming.namingWorld}` : ''}
* Note: Legal trademark clearance must be completed with official registries.

==================================================
CHAPTER 6 · VISUAL SYSTEM & ATELIER
==================================================
Creative Direction Concept: ${visualIdentity.creativeDirection}
Visual Thesis: ${visualIdentity.visualThesis}
Mood Keywords: ${visualIdentity.moodKeywords.join(' · ')}

7-Role Color Tokens:
${visualIdentity.colors.map(p => `  - ${p.name} (${p.hex}) · Role: ${p.role}`).join('\n')}

Typography Specimens:
${visualIdentity.typography.map(t => `  - ${t.role}: ${t.family} (${t.usage})`).join('\n')}

==================================================
CHAPTER 7 · LAUNCH & DISTRIBUTION MESSAGING
==================================================
Primary Headline: "${messaging.headline}"
Subheadline: "${messaging.subheadline}"
One-Line Pitch: "${messaging.oneLinePitch}"
Primary CTA: "${messaging.primaryCta}"
Secondary CTA: "${messaging.secondaryCta}"

Product Description:
${messaging.productDescription}

Social Launch Post:
${messaging.socialPost.text}

Founder Launch Announcement:
${messaging.launchAnnouncement}

==================================================
CHAPTER 8 · ADVERSARIAL CRITIQUE & TRACEABILITY
==================================================
Structural Coherence: ${challengeSummary.consistencyState}
Findings: ${challengeSummary.findingsCount} surfaced · ${challengeSummary.resolvedCount} applied/resolved · ${challengeSummary.ignoredCount} ignored · ${challengeSummary.openCount} open

Accepted Strategic Transformations:
${challengeSummary.traceability.map(t => `  * ${t.title} (${t.targetStage}.${t.field}):
    Before: "${t.beforeValue}"
    Decision: ${t.decision}
    After: "${t.afterValue}"`).join('\n\n')}

==================================================
CHAPTER 9 · FOUNDER LAUNCH CHECKLIST
==================================================
${launchChecklist.map(c => `[${c.isCompleted ? 'X' : ' '}] (${c.category}) ${c.label}: ${c.description}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(brief);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleDownloadJson = () => {
    const exportPayload = {
      _meta: {
        generator: 'BrandForge Creative Intelligence Studio',
        exportedAt: new Date().toISOString(),
        brandName,
      },
      brandBook: deliverData,
      brandMemory,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-book.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#f4efe8] px-4 sm:px-6 py-12 selection:bg-[#322e2b]">
      {/* Top Floating Controls */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12 border-b border-white/[0.08] no-print">
        <button
          onClick={() => {
            setActiveView('workspace');
            goToStage('launch');
          }}
          className="text-xs text-[#8a8175] hover:text-white flex items-center gap-1.5 font-mono transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Workspace Stage</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleCopyFullBrief}
            className="px-4 py-2 rounded-full spatial-surface text-xs font-mono text-[#c8beaf] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
          >
            {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSummary ? 'Copied Full Book' : 'Copy Strategic Brief'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-4 py-2 rounded-full spatial-surface text-xs font-mono text-[#c8beaf] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
          >
            {downloadSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
            <span>{downloadSuccess ? 'Downloaded' : 'Export JSON'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full spatial-surface text-[#c8beaf] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={startNewProject}
            className="px-5 py-2 rounded-full bg-[#f4efe8] hover:bg-white text-black text-xs font-semibold transition-all shadow-md active:scale-95"
          >
            Start New Brand
          </button>
        </div>
      </div>

      {/* Main Editorial Publication Layout */}
      <main className="max-w-5xl mx-auto py-12 space-y-24">
        
        {/* 1. GRAND TITLE SPREAD */}
        <section className="relative min-h-[65vh] rounded-3xl spatial-surface border border-white/10 p-8 sm:p-16 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Subtle Background 3D Nucleus */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 flex items-center justify-center opacity-50 pointer-events-none no-print">
            <BrandNucleus
              stage="brand-kit"
              shape="knot"
              materialStyle="glass"
              accentColor="#f59e0b"
              className="w-full h-full"
              showLabels={false}
            />
          </div>

          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
              <span>BRAND BOOK · VERIFIED STRATEGY</span>
              <span>·</span>
              <span>VOL. 01</span>
            </div>

            <h1 className="text-6xl sm:text-8xl font-serif-editorial text-white tracking-tighter leading-none">
              {brandName}
            </h1>

            <p className="text-xl sm:text-2xl text-[#d6cec3] font-light leading-relaxed font-serif-editorial pt-2">
              "{deliverData.oneLinePitch}"
            </p>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#8a8175]">
            <div>Category: {strategicFoundation.positioning ? strategicFoundation.positioning.slice(0, 45) : 'Specialized Digital Product'}</div>
            <div>BrandForge Creative Intelligence Studio · Step 8 Deliver</div>
          </div>
        </section>

        {/* 2. BRAND ESSENCE & EXECUTIVE SUMMARY */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              01 / BRAND ESSENCE & EXECUTIVE STRATEGY
            </span>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl spatial-surface border border-amber-400/20 space-y-4">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              THE CORE BRAND ESSENCE
            </span>
            <p className="text-2xl sm:text-4xl font-serif-editorial text-white leading-relaxed">
              "{deliverData.brandEssence}"
            </p>
          </div>

          {/* 6 Questions */}
          <div className="p-8 rounded-3xl spatial-surface space-y-4">
            <span className="text-[10px] font-mono uppercase text-white tracking-widest block">
              EXECUTIVE STRATEGIC SUMMARY
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">1. What is this brand?</span>
                <p className="text-xs text-[#c8beaf] leading-relaxed">{brandName} operates in {strategicFoundation.positioning || 'specialized digital products'}.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">2. Who is it for?</span>
                <p className="text-xs text-[#c8beaf] leading-relaxed">Engineered for {strategicFoundation.audience}.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">3. What problem does it solve?</span>
                <p className="text-xs text-[#c8beaf] leading-relaxed">Directly eliminates {strategicFoundation.problem}.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">4. What does it promise?</span>
                <p className="text-xs text-[#c8beaf] leading-relaxed">Delivers {strategicFoundation.valueProposition}.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">5. Why audience cares</span>
                <p className="text-xs text-[#c8beaf] leading-relaxed">Fulfills the core need for {strategicFoundation.need}.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase">6. Distinctive edge</span>
                <p className="text-xs text-[#c8beaf] leading-relaxed">Defended by: {strategicFoundation.differentiation || 'disciplined strategic focus'}.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STRATEGIC FOUNDATION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              02 / STRATEGIC FOUNDATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-wider block">
                The Core Problem
              </span>
              <p className="text-base text-white font-serif-editorial leading-relaxed">
                {strategicFoundation.problem}
              </p>
            </div>

            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-wider block">
                The Beachhead Audience
              </span>
              <p className="text-base text-white font-serif-editorial leading-relaxed">
                {strategicFoundation.audience}
              </p>
            </div>
          </div>

          {/* Positioning Statement Spread */}
          <div className="p-8 sm:p-12 rounded-3xl spatial-surface space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              THE POSITIONING STATEMENT & VALUE PROPOSITION
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-editorial text-white leading-relaxed">
              "{strategicFoundation.positioning || strategicFoundation.valueProposition}"
            </h3>
            <p className="text-xs text-[#a0988e] pt-2 font-light">
              <span className="font-semibold text-white">Operational Moat: </span>
              {strategicFoundation.differentiation}
            </p>
          </div>
        </section>

        {/* 4. IDENTITY & ARCHETYPE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              03 / IDENTITY & BRAND ARCHETYPE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personality.traits.map((t, idx) => (
              <div key={t.name} className="p-6 rounded-3xl spatial-surface space-y-2">
                <span className="text-[10px] font-mono text-[#8a8175] uppercase block">
                  Trait 0{idx + 1}
                </span>
                <h4 className="text-xl font-serif-editorial text-white uppercase">
                  {t.name}
                </h4>
                <p className="text-xs text-[#a39a8e] leading-relaxed">
                  {t.whyItFits || t.description}
                </p>
              </div>
            ))}
          </div>

          {/* Principles */}
          <div className="p-8 rounded-3xl spatial-surface space-y-4">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              NON-NEGOTIABLE OPERATIONAL PRINCIPLES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personality.principles.map((p, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-[#d6cec3]">
                  <span className="font-mono text-amber-400">0{i + 1}.</span>
                  <span className="leading-relaxed">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Summary */}
          {personality.voiceSummary && (
            <div className="p-8 sm:p-12 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                VOICE SUMMARY
              </span>
              <p className="text-xl sm:text-2xl font-serif-editorial text-white leading-relaxed">
                "{personality.voiceSummary}"
              </p>
            </div>
          )}

          {/* Voice Characteristics */}
          {personality.voiceCharacteristics.length > 0 && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-widest block">
                VOICE CHARACTERISTICS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {personality.voiceCharacteristics.map((vc, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-xs font-medium text-white">{vc.characteristic}</span>
                    <p className="text-[11px] text-[#a39a8e] leading-relaxed">{vc.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tone Rules */}
          {personality.toneRules.length > 0 && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-widest block">
                TONE GOVERNANCE
              </span>
              <div className="space-y-3">
                {personality.toneRules.map((rule, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase block mb-1">Do:</span>
                      <p className="text-[#d6cec3] leading-relaxed">{rule.do}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-500/[0.04] border border-red-500/10">
                      <span className="text-[10px] text-red-400 font-mono uppercase block mb-1">Avoid:</span>
                      <p className="text-[#c8beaf] leading-relaxed">{rule.avoid}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-[10px] text-amber-400 font-mono uppercase block mb-1">Example:</span>
                      <p className="text-white leading-relaxed font-serif-editorial italic">"{rule.example}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 5. THE NAME */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              04 / VERBAL IDENTITY & WORDMARK
            </span>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl spatial-surface space-y-4">
            <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-widest block">
              OFFICIAL WORDMARK
            </span>
            <h3 className="text-4xl sm:text-6xl font-serif-editorial text-white">
              {naming.selectedName}
            </h3>
            {naming.namingWorld && (
              <div className="text-xs font-mono text-amber-300">
                Strategic Territory: {naming.namingWorld}
              </div>
            )}
            <p className="text-xs text-[#a39a8e] max-w-2xl leading-relaxed">
              {naming.rationale}
            </p>
          </div>
        </section>

        {/* 6. VISUAL SYSTEM & PALETTE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              05 / VISUAL IDENTITY SYSTEM
            </span>
          </div>

          <div className="p-8 rounded-3xl spatial-surface space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              CREATIVE DIRECTION THESIS
            </span>
            <h4 className="text-2xl font-serif-editorial text-white">
              {visualIdentity.creativeDirection}
            </h4>
            <p className="text-xs text-[#a39a8e] leading-relaxed">
              {visualIdentity.visualThesis}
            </p>
          </div>

          {/* 7-Role Color Tokens */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {visualIdentity.colors.map((swatch) => (
              <div key={swatch.name} className="p-4 rounded-2xl spatial-surface space-y-2">
                <div
                  className="w-full h-16 rounded-xl border border-white/10"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="text-xs font-medium text-white truncate">{swatch.name}</div>
                <div className="text-[10px] font-mono text-[#d4af37] uppercase">{swatch.role}</div>
                <div className="text-[10px] font-mono text-[#8a8175]">{swatch.hex}</div>
              </div>
            ))}
          </div>

          {/* Typography Specimen */}
          <div className="p-8 rounded-3xl spatial-surface space-y-4">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              TYPOGRAPHY SPECIMEN
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visualIdentity.typography.map((typeSpec) => (
                <div key={typeSpec.role} className="space-y-1">
                  <span className="text-[10px] font-mono text-[#8a8175] uppercase block">{typeSpec.role}</span>
                  <div className="text-lg font-bold text-white">{typeSpec.family}</div>
                  <p className="text-xs text-[#a0988e] leading-relaxed">{typeSpec.usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Imagery Direction */}
          {visualIdentity.imagery && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                IMAGERY DIRECTION
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(visualIdentity.imagery as any).photographyStyle && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Photography Style</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.imagery as any).photographyStyle}</p>
                  </div>
                )}
                {(visualIdentity.imagery as any).subjectMatter && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Subject Matter</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.imagery as any).subjectMatter}</p>
                  </div>
                )}
                {(visualIdentity.imagery as any).composition && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Composition</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.imagery as any).composition}</p>
                  </div>
                )}
                {(visualIdentity.imagery as any).lighting && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Lighting</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.imagery as any).lighting}</p>
                  </div>
                )}
                {(visualIdentity.imagery as any).mood && !(visualIdentity.imagery as any).photographyStyle && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Mood</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.imagery as any).mood}</p>
                  </div>
                )}
                {(visualIdentity.imagery as any).colorTreatment && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Color Treatment</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.imagery as any).colorTreatment}</p>
                  </div>
                )}
                {(visualIdentity.imagery as any).humanPresence && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Human Presence</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.imagery as any).humanPresence}</p>
                  </div>
                )}
              </div>
              {/* Avoid list */}
              {((visualIdentity.imagery as any).avoidImagery?.length > 0 || (visualIdentity.imagery as any).imageryRules?.length > 0) && (
                <div className="pt-2 space-y-2">
                  {(visualIdentity.imagery as any).avoidImagery?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-red-400 uppercase block">Imagery to Avoid</span>
                      {(visualIdentity.imagery as any).avoidImagery.map((item: string, i: number) => (
                        <p key={i} className="text-xs text-[#a39a8e] leading-relaxed pl-3 border-l border-red-500/20">— {item}</p>
                      ))}
                    </div>
                  )}
                  {(visualIdentity.imagery as any).imageryRules?.length > 0 && !(visualIdentity.imagery as any).avoidImagery?.length && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Imagery Rules</span>
                      {(visualIdentity.imagery as any).imageryRules.map((item: string, i: number) => (
                        <p key={i} className="text-xs text-[#a39a8e] leading-relaxed pl-3 border-l border-white/10">— {item}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Graphic Language */}
          {visualIdentity.graphicLanguage && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                GRAPHIC LANGUAGE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(visualIdentity.graphicLanguage).map(([key, value]) => {
                  if (!value || typeof value !== 'string') return null;
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, s => s.toUpperCase())
                    .trim();
                  return (
                    <div key={key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-[#8a8175] uppercase block">{label}</span>
                      <p className="text-xs text-[#d6cec3] leading-relaxed">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Logo Direction */}
          {visualIdentity.logoDirection && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                LOGO DIRECTION · CONCEPTUAL
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {((visualIdentity.logoDirection as any).concept || (visualIdentity.logoDirection as any).markType) && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Concept / Mark Type</span>
                    <p className="text-sm text-white font-serif-editorial leading-relaxed">
                      {(visualIdentity.logoDirection as any).concept || (visualIdentity.logoDirection as any).markType}
                    </p>
                  </div>
                )}
                {((visualIdentity.logoDirection as any).symbolicIdea || (visualIdentity.logoDirection as any).description || (visualIdentity.logoDirection as any).symbolism) && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Symbolic Direction</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">
                      {(visualIdentity.logoDirection as any).symbolicIdea || (visualIdentity.logoDirection as any).description || (visualIdentity.logoDirection as any).symbolism}
                    </p>
                  </div>
                )}
                {(visualIdentity.logoDirection as any).formLanguage && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Form Language</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.logoDirection as any).formLanguage}</p>
                  </div>
                )}
                {(visualIdentity.logoDirection as any).construction && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Construction</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.logoDirection as any).construction}</p>
                  </div>
                )}
                {(visualIdentity.logoDirection as any).wordmarkDirection && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Wordmark Direction</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.logoDirection as any).wordmarkDirection}</p>
                  </div>
                )}
                {((visualIdentity.logoDirection as any).clearspaceRule) && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8a8175] uppercase block">Clearspace Rule</span>
                    <p className="text-xs text-[#d6cec3] leading-relaxed">{(visualIdentity.logoDirection as any).clearspaceRule}</p>
                  </div>
                )}
              </div>
              {(visualIdentity.logoDirection as any).avoid?.length > 0 && (
                <div className="pt-2 space-y-1">
                  <span className="text-[10px] font-mono text-red-400 uppercase block">Mark Avoidances</span>
                  {(visualIdentity.logoDirection as any).avoid.map((item: string, i: number) => (
                    <p key={i} className="text-xs text-[#a39a8e] leading-relaxed pl-3 border-l border-red-500/20">— {item}</p>
                  ))}
                </div>
              )}
              <p className="text-[10px] font-mono text-[#5a5449] italic pt-2">
                Note: This is a conceptual direction. Final mark production requires professional execution and legal trademark clearance.
              </p>
            </div>
          )}

          {/* UI Direction */}
          {visualIdentity.uiDirection && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                PRODUCT UI DIRECTION
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(visualIdentity.uiDirection).map(([key, value]) => {
                  if (!value || typeof value !== 'string') return null;
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, s => s.toUpperCase())
                    .trim();
                  return (
                    <div key={key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-[#8a8175] uppercase block">{label}</span>
                      <p className="text-xs text-[#d6cec3] leading-relaxed">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Visual Do / Don't Rules */}
          {((visualIdentity.doRules && visualIdentity.doRules.length > 0) || (visualIdentity.dontRules && visualIdentity.dontRules.length > 0)) && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                VISUAL GOVERNANCE · DO / DON'T
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visualIdentity.doRules && visualIdentity.doRules.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block">Do</span>
                    {visualIdentity.doRules.map((rule, i) => (
                      <p key={i} className="text-xs text-[#d6cec3] leading-relaxed pl-3 border-l-2 border-emerald-500/30">{rule}</p>
                    ))}
                  </div>
                )}
                {visualIdentity.dontRules && visualIdentity.dontRules.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-red-400 uppercase block">Don't</span>
                    {visualIdentity.dontRules.map((rule, i) => (
                      <p key={i} className="text-xs text-[#a39a8e] leading-relaxed pl-3 border-l-2 border-red-500/30">{rule}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 7. VOICE & LAUNCH MESSAGING */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              06 / LAUNCH COPY & MESSAGING
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                Primary Conversion Headline
              </span>
              <h4 className="text-3xl font-serif-editorial text-white leading-tight">
                "{messaging.headline}"
              </h4>
              <p className="text-xs text-[#a0988e] pt-1">
                CTA: <span className="text-white font-medium">{messaging.primaryCta}</span>
                {messaging.secondaryCta && (
                  <span className="text-[#8a8175]"> · Secondary: {messaging.secondaryCta}</span>
                )}
              </p>
            </div>

            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-sky-400 tracking-widest block">
                Social Distribution Copy
              </span>
              <p className="text-xs text-[#d6cec3] whitespace-pre-line leading-relaxed font-mono">
                {messaging.socialPost.text}
              </p>
            </div>
          </div>

          {/* Product Description */}
          {messaging.productDescription && (
            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-widest block">
                PRODUCT DESCRIPTION
              </span>
              <p className="text-sm text-[#d6cec3] leading-relaxed font-serif-editorial">
                {messaging.productDescription}
              </p>
            </div>
          )}

          {/* Key Messages */}
          {messaging.keyMessages.length > 0 && (
            <div className="p-8 rounded-3xl spatial-surface space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-widest block">
                KEY STRATEGIC MESSAGES
              </span>
              <div className="space-y-3">
                {messaging.keyMessages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-[#d6cec3]">
                    <span className="font-mono text-amber-400 shrink-0">0{i + 1}.</span>
                    <span className="leading-relaxed">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Launch Announcement */}
          {messaging.launchAnnouncement && (
            <div className="p-8 sm:p-12 rounded-3xl spatial-surface border border-white/[0.06] space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                FOUNDER LAUNCH ANNOUNCEMENT
              </span>
              <p className="text-sm text-[#d6cec3] leading-relaxed font-serif-editorial whitespace-pre-line">
                {messaging.launchAnnouncement}
              </p>
            </div>
          )}
        </section>

        {/* 8. WHAT WE CHALLENGED & TRACEABILITY */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#e06d6d]">
              07 / ADVERSARIAL CRITIQUE & TRACEABILITY
            </span>
          </div>

          <div className="p-8 rounded-3xl spatial-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-lg font-serif-editorial text-white">
                Coherence Status: {challengeSummary.consistencyState}
              </div>
              <p className="text-xs text-[#a0988e] max-w-xl font-light">
                {challengeSummary.editorialAssessment}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400">{challengeSummary.resolvedCount} Resolved</span>
              <span className="text-amber-400">{challengeSummary.openCount} Open Considerations</span>
            </div>
          </div>

          {/* Traceability Cards */}
          <div className="space-y-4">
            {challengeSummary.traceability.map((item) => (
              <div key={item.id} className="p-6 rounded-3xl spatial-surface border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 uppercase font-semibold">{item.title}</span>
                  <span className="text-emerald-400 uppercase">{item.targetStage}.{item.field}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-red-500/[0.05] border border-red-500/10">
                    <span className="text-[10px] text-red-400 font-mono uppercase block mb-1">Before:</span>
                    <p className="text-[#c8beaf]">"{item.beforeValue}"</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/10">
                    <span className="text-[10px] text-amber-400 font-mono uppercase block mb-1">Decision:</span>
                    <p className="text-[#d6cec3]">{item.decision}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/10">
                    <span className="text-[10px] text-emerald-400 font-mono uppercase block mb-1">Final Result:</span>
                    <p className="text-white">"{item.afterValue}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. LAUNCH CHECKLIST */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              08 / FOUNDER LAUNCH CHECKLIST
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {launchChecklist.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl spatial-surface flex items-start gap-3 text-xs">
                {item.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 pt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#8a8175] pt-0.5 shrink-0" />
                )}
                <div>
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-[#8a8175] text-[11px]">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Book Footer */}
      <footer className="max-w-5xl mx-auto pt-16 pb-8 border-t border-white/[0.08] text-center text-xs font-mono text-[#8a8175]">
        BrandForge Creative Intelligence Studio · Step 8 Deliver · Verified System
      </footer>
    </div>
  );
};
