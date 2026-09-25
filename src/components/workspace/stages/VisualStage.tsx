import React, { useState } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { BrandNucleus } from '../../canvas/BrandNucleus';
import { 
  Eye, 
  Palette, 
  Type, 
  Box, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Layers,
  Wand2
} from 'lucide-react';

export const VisualStage: React.FC = () => {
  const { 
    brandMemory, 
    updateVisual, 
    advanceToNextStage,
    goToStage 
  } = useBrand();

  const { visual, naming, personality } = brandMemory;
  const brandName = naming.selectedName?.name || 'SprintForge';

  // 3D Studio Directing State
  const [activeShape, setActiveShape] = useState<'icosahedron' | 'knot' | 'torus' | 'octahedron'>('icosahedron');
  const [activeMaterial, setActiveMaterial] = useState<'glass' | 'specular' | 'mineral' | 'wireframe'>('glass');
  const [activeAccent, setActiveAccent] = useState<string>('#f59e0b');
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

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>05 / BRAND ATELIER</span>
            <span aria-hidden="true">·</span>
            <span>IDENTITY DIRECTION</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Directing form, light, color & kinetics
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          Give the strategy a visual language.
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          This is an interactive identity atelier. The brand persona directly dictates the geometry, lighting, materials, and typographic rhythm of your system.
        </p>
      </div>

      {/* Main 3D Studio Stage */}
      <div className="relative my-8 rounded-3xl spatial-surface border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center">
        
        {/* Top Studio Controls Overlay */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              LIVE STUDIO METAPHOR · {brandName}
            </span>
          </div>

          {/* Quick Shape Selector */}
          <div className="flex items-center gap-1 p-1 rounded-full spatial-surface-subtle text-xs font-mono">
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveShape(s.id)}
                className={`px-3 py-1 rounded-full transition-all ${
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
        <div className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center my-4">
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

        {/* Surrounding Studio Directing Controllers: COLOR, TYPE, FORM, MOTION, IMAGE */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 z-20 pt-6 border-t border-white/[0.08]">
          
          {/* 1. COLOR Tokens */}
          <div className="p-4 rounded-2xl spatial-surface-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#a89f92]">
              <span className="uppercase">Color Direction</span>
              <Palette className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <div className="flex items-center gap-2">
              {visual.palette?.map((swatch) => (
                <button
                  key={swatch.hex}
                  onClick={() => setActiveAccent(swatch.hex)}
                  className={`w-7 h-7 rounded-full border transition-transform ${
                    activeAccent === swatch.hex
                      ? 'scale-125 ring-2 ring-white/60 border-white'
                      : 'border-white/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={`${swatch.name} (${swatch.hex})`}
                />
              ))}
            </div>

            <div className="text-[11px] text-[#8a8175] font-mono">
              Active Luminescence: {activeAccent}
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
                  className={`p-1.5 rounded-lg text-left text-[11px] transition-all ${
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
                  className={`flex-1 py-1 rounded-lg text-xs font-mono transition-all ${
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
              Parallax tracking active
            </div>
          </div>

          {/* 4. TYPE Pairing */}
          <div className="p-4 rounded-2xl spatial-surface-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#a89f92]">
              <span className="uppercase">Typography Pairing</span>
              <Type className="w-3.5 h-3.5 text-purple-400" />
            </div>

            <div className="text-xs text-white font-medium">
              Space Grotesk + Plus Jakarta
            </div>

            <div className="text-[11px] text-[#8a8175] leading-tight">
              Pairing architectural structure with contemporary scannability.
            </div>
          </div>
        </div>
      </div>

      {/* Art Direction & Visual Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 rounded-3xl spatial-surface space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] block">
            Art Direction & Photography
          </span>
          <div className="space-y-2 text-xs text-[#c8beaf]">
            <div>
              <span className="font-semibold text-white">Mood: </span>
              {visual.artDirection?.mood}
            </div>
            <div>
              <span className="font-semibold text-white">Lighting: </span>
              {visual.artDirection?.lighting}
            </div>
            <div>
              <span className="font-semibold text-white">Composition: </span>
              {visual.artDirection?.composition}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl spatial-surface space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] block">
            Logo Mark Architecture
          </span>
          <p className="text-xs text-[#c8beaf] leading-relaxed">
            {visual.logoConcept?.description}
          </p>
          <div className="text-[11px] font-mono text-[#8a8175]">
            Symbolism: {visual.logoConcept?.symbolism}
          </div>
        </div>
      </div>

      {/* Action Advance Bar */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>Visual tokens sculpted</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-[#8a8175]">
            Next, we challenge the entire brand against the AI Critic to break contradictions.
          </p>
        </div>

        <button
          onClick={advanceToNextStage}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <span>Challenge the brand</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
