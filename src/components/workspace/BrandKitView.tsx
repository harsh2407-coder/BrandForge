import React, { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { BrandNucleus } from '../canvas/BrandNucleus';
import { 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Printer, 
  Share2,
  Layers,
  Target,
  Type,
  Eye,
  ShieldAlert,
  Rocket
} from 'lucide-react';

export const BrandKitView: React.FC = () => {
  const { 
    brandMemory, 
    goToStage, 
    startNewProject, 
    setActiveView 
  } = useBrand();

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const brandName = brandMemory.naming.selectedName?.name || brandMemory.projectName || 'SprintForge';
  const { discovery, positioning, personality, naming, visual, challenge, launch } = brandMemory;

  const handleCopyFullBrief = () => {
    const brief = `
BRANDFORGE EDITORIAL BRAND BOOK
Brand Mark: ${brandName}
One-Line Positioning: ${launch.oneLinePitch || positioning.valueProposition}

==================================================
CHAPTER 1 · STRATEGY & DIAGNOSIS
==================================================
Root Problem: ${discovery.coreProblem}
Beachhead Audience: ${discovery.primaryAudience}
Strategic Need: ${discovery.coreNeed}
Category: ${positioning.category}
Value Proposition: ${positioning.valueProposition}
Moat / Differentiator: ${positioning.differentiator}
Positioning Statement: ${positioning.positioningStatement}

==================================================
CHAPTER 2 · IDENTITY & ARCHETYPE
==================================================
Archetype Traits: ${personality.traits?.map(t => t.name).join(', ')}
Explicitly Banned Traits: ${personality.traitsToAvoid?.map(a => a.trait).join(', ')}
Brand Principles:
${personality.principles?.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}

==================================================
CHAPTER 3 · VERBAL CARRIER & NAMING
==================================================
Chosen Wordmark: ${naming.selectedName?.name}
Etymology: ${naming.selectedName?.meaning}
Strategic Rationale: ${naming.selectedName?.strategicRationale}

==================================================
CHAPTER 4 · VISUAL SYSTEM & ATELIER
==================================================
Color Tokens:
${visual.palette?.map(p => `  - ${p.name} (${p.hex}) · Role: ${p.role}`).join('\n')}
Typography:
${visual.typography?.map(t => `  - ${t.role}: ${t.family}`).join('\n')}
Logo Architecture: ${visual.logoConcept?.description}

==================================================
CHAPTER 5 · VOICE & MESSAGING
==================================================
Tone: ${personality.voiceAndTone?.tone}
Do: "${personality.voiceAndTone?.writingSampleDo}"
Don't: "${personality.voiceAndTone?.writingSampleDont}"
Launch Headline: "${launch.headline}"
Primary CTA: "${launch.primaryCta}"

==================================================
CHAPTER 6 · LAUNCH & DISTRIBUTION
==================================================
Announcement Letter:
${launch.launchAnnouncement}

Social Post:
${launch.socialPost?.text}

==================================================
CHAPTER 7 · ADVERSARIAL CRITIQUE VERIFICATION
==================================================
Structural Coherence: ${challenge.consistencySummary?.overallState}
Resolved Items: ${challenge.consistencySummary?.strengthsCount} passed
    `.trim();

    navigator.clipboard.writeText(brief);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(brandMemory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${brandName.toLowerCase()}-brand-book.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#f4efe8] px-4 sm:px-6 py-12 selection:bg-[#322e2b]">
      {/* Top Floating Controls */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12 border-b border-white/[0.08]">
        <button
          onClick={() => {
            setActiveView('workspace');
            goToStage('launch');
          }}
          className="text-xs text-[#8a8175] hover:text-white flex items-center gap-1.5 font-mono transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Workspace</span>
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
            className="p-2 rounded-full spatial-surface text-[#8a8175] hover:text-white transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
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
        
        {/* GRAND TITLE SPREAD */}
        <section className="relative min-h-[70vh] rounded-3xl spatial-surface border border-white/10 p-8 sm:p-16 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Subtle Background 3D Nucleus */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 flex items-center justify-center opacity-60 pointer-events-none">
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
              "{launch.oneLinePitch || positioning.valueProposition}"
            </p>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#8a8175]">
            <div>Category: {positioning.category}</div>
            <div>Compiled via Multi-Stage BrandForge AI</div>
          </div>
        </section>

        {/* 01 · STRATEGY */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              01 / STRATEGIC FOUNDATION
            </span>
            <button
              onClick={() => {
                setActiveView('workspace');
                goToStage('position');
              }}
              className="text-xs text-[#8a8175] hover:text-white font-mono"
            >
              Adjust in workspace →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-wider block">
                The Core Problem
              </span>
              <p className="text-base text-white font-serif-editorial leading-relaxed">
                {discovery.coreProblem}
              </p>
            </div>

            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] tracking-wider block">
                The Beachhead Audience
              </span>
              <p className="text-base text-white font-serif-editorial leading-relaxed">
                {discovery.primaryAudience}
              </p>
            </div>
          </div>

          {/* Positioning Statement Spread */}
          <div className="p-8 sm:p-12 rounded-3xl spatial-surface border border-amber-400/20 space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              THE POSITIONING STATEMENT
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-editorial text-white leading-relaxed">
              "{positioning.positioningStatement}"
            </h3>
            <p className="text-xs text-[#a0988e] pt-2 font-light">
              <span className="font-semibold text-white">Operational Moat: </span>
              {positioning.differentiator}
            </p>
          </div>
        </section>

        {/* 02 · IDENTITY & ARCHETYPE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              02 / IDENTITY & HUMAN ARCHETYPE
            </span>
            <button
              onClick={() => {
                setActiveView('workspace');
                goToStage('personality');
              }}
              className="text-xs text-[#8a8175] hover:text-white font-mono"
            >
              Adjust in workspace →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personality.traits?.map((t, idx) => (
              <div key={t.name} className="p-6 rounded-3xl spatial-surface space-y-2">
                <span className="text-[10px] font-mono text-[#8a8175] uppercase block">
                  Trait 0{idx + 1}
                </span>
                <h4 className="text-xl font-serif-editorial text-white uppercase">
                  {t.name}
                </h4>
                <p className="text-xs text-[#a39a8e] leading-relaxed">
                  {t.whyItFits}
                </p>
              </div>
            ))}
          </div>

          {/* Principles */}
          <div className="p-8 rounded-3xl spatial-surface space-y-4">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              NON-NEGOTIABLE HEURISTICS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personality.principles?.map((p, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-[#d6cec3]">
                  <span className="font-mono text-amber-400">0{i + 1}.</span>
                  <span className="leading-relaxed">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 · VISUAL LANGUAGE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              03 / VISUAL SYSTEM & PALETTE
            </span>
            <button
              onClick={() => {
                setActiveView('workspace');
                goToStage('visualize');
              }}
              className="text-xs text-[#8a8175] hover:text-white font-mono"
            >
              Adjust in workspace →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {visual.palette?.map((swatch) => (
              <div key={swatch.name} className="p-4 rounded-2xl spatial-surface space-y-2">
                <div
                  className="w-full h-16 rounded-xl border border-white/10"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="text-xs font-medium text-white truncate">{swatch.name}</div>
                <div className="text-[10px] font-mono text-[#8a8175] uppercase">{swatch.role} · {swatch.hex}</div>
              </div>
            ))}
          </div>

          {/* Typography Specimen */}
          <div className="p-8 rounded-3xl spatial-surface space-y-4">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
              TYPOGRAPHY SPECIMEN
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visual.typography?.map((typeSpec) => (
                <div key={typeSpec.role} className="space-y-1">
                  <span className="text-[10px] font-mono text-[#8a8175] uppercase block">{typeSpec.role}</span>
                  <div className="text-lg font-bold text-white">{typeSpec.family}</div>
                  <p className="text-xs text-[#a0988e] leading-relaxed">{typeSpec.usage}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 · VOICE & MESSAGING */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              04 / VOICE & LAUNCH COPY
            </span>
            <button
              onClick={() => {
                setActiveView('workspace');
                goToStage('launch');
              }}
              className="text-xs text-[#8a8175] hover:text-white font-mono"
            >
              Adjust in workspace →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                Primary Conversion Headline
              </span>
              <h4 className="text-3xl font-serif-editorial text-white leading-tight">
                "{launch.headline}"
              </h4>
              <p className="text-xs text-[#a0988e] pt-1">
                CTA: <span className="text-white font-medium">{launch.primaryCta}</span>
              </p>
            </div>

            <div className="p-8 rounded-3xl spatial-surface space-y-3">
              <span className="text-[10px] font-mono uppercase text-sky-400 tracking-widest block">
                Social Distribution Copy
              </span>
              <p className="text-xs text-[#d6cec3] whitespace-pre-line leading-relaxed font-mono">
                {launch.socialPost?.text}
              </p>
            </div>
          </div>
        </section>

        {/* 05 · ADVERSARIAL VERIFICATION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#e06d6d]">
              05 / CRITIC VERIFICATION CERTIFICATE
            </span>
          </div>

          <div className="p-8 rounded-3xl spatial-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-lg font-serif-editorial text-white">
                Coherence Status: {challenge.consistencySummary?.overallState}
              </div>
              <p className="text-xs text-[#a0988e] max-w-xl font-light">
                {challenge.consistencySummary?.editorialAssessment}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400">{challenge.consistencySummary?.strengthsCount} Passed</span>
              <span className="text-amber-400">{challenge.consistencySummary?.warningsCount} Warnings Handled</span>
            </div>
          </div>
        </section>
      </main>

      {/* Book Footer */}
      <footer className="max-w-5xl mx-auto pt-16 pb-8 border-t border-white/[0.08] text-center text-xs font-mono text-[#8a8175]">
        BrandForge Creative Intelligence Studio · All rights reserved
      </footer>
    </div>
  );
};
