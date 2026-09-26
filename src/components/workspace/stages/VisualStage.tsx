import React, { useState, useEffect } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { BrandNucleus } from '../../canvas/BrandNucleus';
import { 
  Palette, 
  Type, 
  Box, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Layers, 
  ShieldAlert, 
  RefreshCw, 
  Camera, 
  Compass, 
  Layout, 
  CheckCircle2, 
  XCircle, 
  Target, 
  PenTool,
  MoveUpRight,
  Lock
} from 'lucide-react';

export const VisualStage: React.FC = () => {
  const { 
    brandMemory, 
    updateVisual, 
    advanceToNextStage,
    generateVisualize,
    goToStage,
    isProcessing 
  } = useBrand();

  const { visual, naming, personality } = brandMemory;
  const stageStatus = brandMemory.stageExecution?.visualize;
  const brandName = naming.selectedName?.name || brandMemory.projectName || 'Brand';
  const namingReady = brandMemory.stageExecution?.naming?.status === 'ready';

  // Auto-trigger generation for real brands if upstream completed (including naming) but visual idle
  useEffect(() => {
    if (
      brandMemory.id !== 'demo-hackathon-teammates' &&
      brandMemory.discovery?.coreProblem &&
      brandMemory.positioning?.category &&
      brandMemory.personality?.traits &&
      brandMemory.personality.traits.length > 0 &&
      namingReady &&
      brandMemory.stageExecution?.visualize?.status === 'idle' &&
      (!visual.creativeDirection && (!visual.palette || visual.palette.length === 0))
    ) {
      generateVisualize();
    }
  }, [
    brandMemory.id,
    brandMemory.discovery?.coreProblem,
    brandMemory.positioning?.category,
    brandMemory.personality?.traits,
    namingReady,
    brandMemory.stageExecution?.visualize?.status,
    visual.creativeDirection,
    visual.palette,
    generateVisualize
  ]);

  // 3D Studio Directing State
  const [activeShape, setActiveShape] = useState<'icosahedron' | 'knot' | 'torus' | 'octahedron'>('icosahedron');
  const [activeMaterial, setActiveMaterial] = useState<'glass' | 'specular' | 'mineral' | 'wireframe'>('glass');
  const [activeAccent, setActiveAccent] = useState<string>(() => {
    return visual.colorSystem?.accent?.hex || visual.palette?.[1]?.hex || '#f59e0b';
  });
  const [motionSpeed, setMotionSpeed] = useState<number>(1.0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const shapes: Array<{ id: typeof activeShape; label: string }> = [
    { id: 'icosahedron', label: 'Crystalline Geodesic' },
    { id: 'knot', label: 'Toroidal Synthesis' },
    { id: 'torus', label: 'Continuous Loop' },
    { id: 'octahedron', label: 'Precision Monolith' },
  ];

  const materials: Array<{ id: typeof activeMaterial; label: string }> = [
    { id: 'glass', label: 'Translucent Glass' },
    { id: 'specular', label: 'High Specular Obsidian' },
    { id: 'mineral', label: 'Matte Titanium' },
    { id: 'wireframe', label: 'Syntax Wireframe' },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Color tokens pool
  const allColors = visual.colorSystem?.palette || visual.palette || [];
  const principles = visual.visualPrinciples || [];

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>05 / BRAND ATELIER</span>
            <span aria-hidden="true">·</span>
            <span>STRATEGIC VISUAL IDENTITY</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Directing form, light, color & kinetics
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          Give the strategy a visual language.
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          Strategy dictates visual expression. The accumulated problem tensions, positioning wedge, and brand voice translate into an executable design system.
        </p>
      </div>

      {/* Controlled Stage Error Banner */}
      {stageStatus?.status === 'error' && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-semibold text-xs block text-rose-300">
                {stageStatus.errorCategory === 'QUOTA'
                  ? 'Groq AI Quota Exhausted'
                  : stageStatus.errorCategory === 'RATE_LIMIT'
                  ? 'Groq Rate Limit Exceeded'
                  : 'Visual Identity Generation Failed'}
              </span>
              <span className="text-xs text-rose-200/90">
                {stageStatus.lastError || 'Unable to generate visual identity direction. Please try again.'}
              </span>
              {stageStatus.errorCategory === 'QUOTA' && (
                <span className="text-[11px] text-rose-300/80 block mt-1">
                  AI provider credits or quota limit reached on Groq account.
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => generateVisualize()}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 text-xs font-medium transition-colors shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Retry Visual Identity</span>
          </button>
        </div>
      )}

      {/* 1. Creative Direction & Visual Thesis Plate */}
      {(visual.creativeDirection || visual.visualConcept) && (
        <div className="my-6 p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Creative Direction & Visual Thesis</span>
            </div>
            <div className="text-[10px] font-mono text-[#8a8175] uppercase">
              Brand Expression
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif-editorial text-white font-medium tracking-tight">
              "{visual.creativeDirection?.concept || visual.visualConcept}"
            </h2>
            <p className="text-xs sm:text-sm text-[#c8beaf] leading-relaxed font-light">
              {visual.creativeDirection?.visualThesis || visual.visualThesis}
            </p>
          </div>

          {/* Mood Keywords */}
          {((visual.creativeDirection?.moodKeywords && visual.creativeDirection.moodKeywords.length > 0) || (visual.moodKeywords && visual.moodKeywords.length > 0)) && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-[#8a8175] mr-1">Mood Vectors:</span>
              {(visual.creativeDirection?.moodKeywords || visual.moodKeywords || []).map((keyword, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-[#e8e2d8]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Strategic Visual Principles (4–6 Principles) */}
      {principles.length > 0 && (
        <div className="my-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#a89f92] uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Strategic Visual Principles ({principles.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {principles.map((pr, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl spatial-surface-subtle border border-white/[0.06] space-y-2 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-serif-editorial font-semibold text-white tracking-tight">
                    {pr.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#d4af37]">0{idx + 1}</span>
                </div>
                <p className="text-xs text-[#c8beaf] leading-relaxed font-light">
                  {pr.description}
                </p>
                <div className="pt-2 border-t border-white/[0.04] text-[11px] text-[#a0988e]">
                  <span className="font-mono text-[#d4af37]">Application: </span>
                  {pr.application}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main 3D Studio Stage */}
      <div className="relative my-8 rounded-3xl spatial-surface border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center">
        
        {/* Top Studio Controls Overlay */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              LIVE IDENTITY METAPHOR · {brandName}
            </span>
          </div>

          {/* Quick Shape Selector */}
          <div className="flex items-center gap-1 p-1 rounded-full spatial-surface-subtle text-xs font-mono">
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveShape(s.id)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeShape === s.id
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-[#8a8175] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Central 3D Interactive Nucleus */}
        <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center my-4">
          <BrandNucleus
            stage="visualize"
            shape={activeShape}
            materialStyle={activeMaterial}
            accentColor={activeAccent}
            speedMultiplier={motionSpeed}
            className="w-full h-full"
            showLabels={true}
          />

          {/* Foreground Wordmark Watermark Specimen */}
          <div className="absolute bottom-6 left-6 pointer-events-none space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#7d7468] tracking-widest">
              WORDMARK SPECIMEN
            </span>
            <div className="text-3xl sm:text-4xl font-serif-editorial text-white tracking-tight">
              {brandName}
            </div>
          </div>
        </div>

        {/* Surrounding Studio Directing Controllers: COLOR, TYPE, FORM, MOTION */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 z-20 pt-6 border-t border-white/[0.08]">
          
          {/* 1. COLOR Tokens */}
          <div className="p-4 rounded-2xl spatial-surface-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#a89f92]">
              <span className="uppercase">Color Direction</span>
              <Palette className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {allColors.map((swatch, idx) => (
                <button
                  key={`${swatch.hex}-${idx}`}
                  onClick={() => setActiveAccent(swatch.hex)}
                  className={`w-7 h-7 rounded-full border transition-transform cursor-pointer ${
                    activeAccent.toLowerCase() === swatch.hex.toLowerCase()
                      ? 'scale-125 ring-2 ring-white/60 border-white'
                      : 'border-white/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={`${swatch.name} (${swatch.hex})`}
                />
              ))}
            </div>

            <div className="text-[11px] text-[#8a8175] font-mono flex items-center justify-between">
              <span>Active: {activeAccent}</span>
              <button
                onClick={() => handleCopyHex(activeAccent)}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedHex === activeAccent ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* 2. MATERIAL Finish */}
          <div className="p-4 rounded-2xl spatial-surface-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#a89f92]">
              <span className="uppercase">Material Finish</span>
              <Box className="w-3.5 h-3.5 text-sky-400" />
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMaterial(m.id)}
                  className={`p-1.5 rounded-lg text-left text-[11px] transition-all cursor-pointer ${
                    activeMaterial === m.id
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/5 text-[#8a8175] hover:text-white'
                  }`}
                >
                  {m.id}
                </button>
              ))}
            </div>
          </div>

          {/* 3. MOTION Dynamics */}
          <div className="p-4 rounded-2xl spatial-surface-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#a89f92]">
              <span className="uppercase">Motion Kinetics</span>
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="flex items-center gap-2">
              {[0.5, 1.0, 1.8].map((s) => (
                <button
                  key={s}
                  onClick={() => setMotionSpeed(s)}
                  className={`flex-1 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    motionSpeed === s
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/5 text-[#8a8175] hover:text-white'
                  }`}
                >
                  {s === 0.5 ? 'Calm' : s === 1.0 ? 'Nominal' : 'Active'}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[#8a8175] font-mono">
              Speed: {motionSpeed}x
            </div>
          </div>

          {/* 4. TYPE Pairing */}
          <div className="p-4 rounded-2xl spatial-surface-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#a89f92]">
              <span className="uppercase">Type Pairing</span>
              <Type className="w-3.5 h-3.5 text-purple-400" />
            </div>

            <div className="text-xs text-white font-medium">
              {visual.typographyDirection?.displayFont || visual.typography?.[0]?.family || 'Space Grotesk'} + {visual.typographyDirection?.bodyFont || visual.typography?.[1]?.family || 'Plus Jakarta Sans'}
            </div>

            <div className="text-[11px] text-[#8a8175] leading-tight line-clamp-2">
              {visual.typographyDirection?.typographyMood || 'Pairing architectural structure with contemporary scannability.'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Comprehensive Color System Swatch Grid */}
      <div className="my-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-[#a89f92]">
            Curated Color Architecture (7-Role Strategic System)
          </span>
          <span className="text-[10px] font-mono text-[#8a8175]">
            Qualitative Contrast Validated · No Artificial Claims
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {allColors.map((swatch, idx) => (
            <div 
              key={`${swatch.hex}-${idx}`}
              className="p-3.5 rounded-2xl spatial-surface-subtle border border-white/[0.06] space-y-2 flex flex-col justify-between"
            >
              <div 
                className="w-full h-12 rounded-xl border border-white/10 shadow-inner flex items-end justify-end p-1.5"
                style={{ backgroundColor: swatch.hex }}
              >
                <button
                  onClick={() => handleCopyHex(swatch.hex)}
                  className="p-1 rounded-md bg-black/40 hover:bg-black/60 text-white text-[10px] cursor-pointer"
                  title="Copy Hex Code"
                >
                  {copiedHex === swatch.hex ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                </button>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] block">
                  {swatch.role}
                </span>
                <span className="text-xs font-semibold text-white block truncate">
                  {swatch.name}
                </span>
                <span className="text-[10px] font-mono text-[#8a8175] block">
                  {swatch.hex}
                </span>
              </div>

              {swatch.rationale && (
                <p className="text-[10px] text-[#9c9387] leading-relaxed line-clamp-3 pt-1 border-t border-white/[0.04]">
                  {swatch.rationale}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Typography Hierarchy Specimen */}
      <div className="my-6 p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            <Type className="w-4 h-4" />
            <span>Typography Direction & Hierarchy</span>
          </div>
          <span className="text-[10px] font-mono text-[#8a8175]">
            Design Direction · Standard Web Fallbacks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Display Font */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] font-mono uppercase text-[#8a8175] block">
              Display & Headlines
            </span>
            <div className="text-2xl font-bold text-white tracking-tight">
              {visual.typographyDirection?.displayFont || visual.typography?.[0]?.family || 'Space Grotesk'}
            </div>
            <p className="text-xs text-[#a0988e] leading-relaxed font-light">
              Primary brand headlines, chapter titles, and hero wordmarks.
            </p>
          </div>

          {/* Body Font */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] font-mono uppercase text-[#8a8175] block">
              Body & Functional Prose
            </span>
            <div className="text-xl font-medium text-white tracking-normal">
              {visual.typographyDirection?.bodyFont || visual.typography?.[1]?.family || 'Plus Jakarta Sans'}
            </div>
            <p className="text-xs text-[#a0988e] leading-relaxed font-light">
              Criteria descriptions, strategy rationale, and readable instructional paragraphs.
            </p>
          </div>

          {/* Supporting Font */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] font-mono uppercase text-[#8a8175] block">
              Telemetry & Monospace
            </span>
            <div className="text-lg font-mono font-medium text-white">
              {visual.typographyDirection?.supportingFont || visual.typography?.[2]?.family || 'JetBrains Mono'}
            </div>
            <p className="text-xs text-[#a0988e] leading-relaxed font-light">
              Tabular dates, percentage calculations, status badges, and telemetry readouts.
            </p>
          </div>
        </div>

        {/* Usage Rules */}
        {visual.typographyDirection?.usageRules && visual.typographyDirection.usageRules.length > 0 && (
          <div className="pt-4 border-t border-white/[0.04] space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] block">
              Typographic Usage Rules:
            </span>
            <ul className="list-disc list-inside text-xs text-[#c8beaf] space-y-1 font-light">
              {visual.typographyDirection.usageRules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 6. Art Direction, Photography & Logo Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Art Direction & Photography */}
        <div className="p-6 rounded-3xl spatial-surface space-y-3 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
            <Camera className="w-3.5 h-3.5" />
            <span>Art Direction & Photography</span>
          </div>

          <div className="space-y-2.5 text-xs text-[#c8beaf]">
            <div>
              <span className="font-semibold text-white block">Style:</span>
              <span className="font-light">{visual.imageryDirection?.photographyStyle || visual.artDirection?.mood}</span>
            </div>
            {visual.imageryDirection?.subjectMatter && (
              <div>
                <span className="font-semibold text-white block">Subject Matter:</span>
                <span className="font-light">{visual.imageryDirection.subjectMatter}</span>
              </div>
            )}
            <div>
              <span className="font-semibold text-white block">Composition & Lighting:</span>
              <span className="font-light">
                {visual.imageryDirection?.composition || visual.artDirection?.composition} · {visual.imageryDirection?.lighting || visual.artDirection?.lighting}
              </span>
            </div>
            {visual.imageryDirection?.humanPresence && (
              <div>
                <span className="font-semibold text-white block">Human Presence:</span>
                <span className="font-light">{visual.imageryDirection.humanPresence}</span>
              </div>
            )}
          </div>

          {/* Imagery Avoid */}
          {(visual.imageryDirection?.avoidImagery || visual.artDirection?.imageryRules) && (
            <div className="pt-2 border-t border-white/[0.04] text-[11px] text-rose-300/90 space-y-1">
              <span className="font-mono uppercase text-[10px] text-rose-400 block">Imagery to Strictly Avoid:</span>
              <ul className="list-disc list-inside space-y-0.5 font-light">
                {(visual.imageryDirection?.avoidImagery || visual.artDirection?.imageryRules || []).map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Logo Direction Brief */}
        <div className="p-6 rounded-3xl spatial-surface space-y-3 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
            <PenTool className="w-3.5 h-3.5" />
            <span>Logo Direction Brief (Conceptual)</span>
          </div>

          <p className="text-xs text-[#c8beaf] leading-relaxed font-light">
            {visual.logoDirection?.concept || visual.logoConcept?.description}
          </p>

          <div className="space-y-2 text-xs text-[#c8beaf] pt-1">
            <div>
              <span className="font-semibold text-white">Symbolic Idea: </span>
              <span className="font-light">{visual.logoDirection?.symbolicIdea || visual.logoConcept?.symbolism}</span>
            </div>
            {visual.logoDirection?.formLanguage && (
              <div>
                <span className="font-semibold text-white">Form Language: </span>
                <span className="font-light">{visual.logoDirection.formLanguage}</span>
              </div>
            )}
            <div>
              <span className="font-semibold text-white">Construction & Clearspace: </span>
              <span className="font-light">{visual.logoDirection?.construction || visual.logoConcept?.clearspaceRule}</span>
            </div>
          </div>

          {visual.logoDirection?.avoid && visual.logoDirection.avoid.length > 0 && (
            <div className="pt-2 border-t border-white/[0.04] text-[11px] text-rose-300/90 space-y-1">
              <span className="font-mono uppercase text-[10px] text-rose-400 block">Logo Clichés to Avoid:</span>
              <ul className="list-disc list-inside space-y-0.5 font-light">
                {visual.logoDirection.avoid.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 7. Graphic Language & UI Principles Grid */}
      {(visual.graphicLanguage || visual.uiDirection) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Graphic Language */}
          {visual.graphicLanguage && (
            <div className="p-6 rounded-3xl spatial-surface space-y-3 border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                <Layers className="w-3.5 h-3.5" />
                <span>Graphic Language Specification</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#c8beaf]">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#8a8175] block">Shapes & Corners:</span>
                  <span className="font-light">{visual.graphicLanguage.shapes}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#8a8175] block">Lines & Dividers:</span>
                  <span className="font-light">{visual.graphicLanguage.lineLanguage}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#8a8175] block">Grid & Cadence:</span>
                  <span className="font-light">{visual.graphicLanguage.layoutBehavior}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#8a8175] block">Elevation & Depth:</span>
                  <span className="font-light">{visual.graphicLanguage.depth}</span>
                </div>
              </div>
            </div>
          )}

          {/* UI Direction */}
          {visual.uiDirection && (
            <div className="p-6 rounded-3xl spatial-surface space-y-3 border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                <Layout className="w-3.5 h-3.5" />
                <span>Product UI Direction</span>
              </div>
              <div className="space-y-2 text-xs text-[#c8beaf]">
                <div>
                  <span className="font-semibold text-white">Interface Mood: </span>
                  <span className="font-light">{visual.uiDirection.interfaceMood}</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Layout Principles: </span>
                  <span className="font-light">{visual.uiDirection.layoutPrinciples}</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Card Behavior: </span>
                  <span className="font-light">{visual.uiDirection.cardBehavior}</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Motion Physics: </span>
                  <span className="font-light">{visual.uiDirection.motionPrinciples}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. Visual Guardrails (Do / Don't) */}
      {(visual.doRules || visual.dontRules || visual.thingsToAvoid) && (
        <div className="my-6 p-6 sm:p-8 rounded-3xl spatial-surface border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest">
            <Target className="w-4 h-4" />
            <span>Visual System Guardrails (Rules of Engagement)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* DO */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Design Practices to Strictly Follow</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#d6cec3] font-light">
                {(visual.doRules || [
                  'Use generous whitespace to isolate complex criteria',
                  'Reserve warm accent color strictly for high-intent actions',
                  'Maintain tabular monospace alignment for numerical data'
                ]).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DON'T */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                <span>Visual Tropes to Strictly Avoid</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#d6cec3] font-light">
                {(visual.dontRules || visual.avoidVisuals || visual.thingsToAvoid || [
                  'Use overused purple-to-cyan gradient meshes',
                  'Feature smiling corporate stock models in business suits',
                  'Use floating glassmorphism bubbles with excessive backdrop-blur'
                ]).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Advance Bar */}
      {(() => {
        const isReady = stageStatus?.status === 'ready';
        const isGenerating = stageStatus?.status === 'generating';
        const isError = stageStatus?.status === 'error';
        const hasValidVisual = (!!visual.creativeDirection || (!!visual.palette && visual.palette.length > 0)) && isReady;
        const canAdvance = isReady && hasValidVisual;

        return (
          <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            {canAdvance ? (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span>Visual identity system locked in Brand Memory</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-[#8a8175]">
                    Next, we challenge the entire brand against the AI Critic to break contradictions.
                  </p>
                </div>

                <button
                  onClick={advanceToNextStage}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Challenge the brand</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#a0988e]">
                    <span>{isError ? 'Visual Generation Incomplete' : isGenerating ? 'Sculpting Visual Identity...' : 'Visual Identity Required'}</span>
                    <span className={`w-2 h-2 rounded-full ${isError ? 'bg-rose-500' : isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-[#7d7468]'}`} />
                  </div>
                  <p className="text-xs text-[#8a8175]">
                    {isError 
                      ? 'Resolve visual generation errors to unlock the Challenge engine.'
                      : isGenerating 
                      ? 'Groq is sculpting the color palette, typography and form language...'
                      : 'Generate visual identity system before challenging the brand.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isError && (
                    <button
                      onClick={() => generateVisualize()}
                      disabled={isGenerating}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-semibold text-xs rounded-full transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>Retry Visual Identity</span>
                    </button>
                  )}
                  <button
                    disabled={true}
                    title="Complete visual stage before proceeding to Challenge"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 text-[#7d7468] font-semibold text-xs rounded-full cursor-not-allowed border border-white/5 opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Challenge the brand (Locked)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
};
