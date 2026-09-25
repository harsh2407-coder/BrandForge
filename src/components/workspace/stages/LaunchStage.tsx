import React, { useState } from 'react';
import { useBrand } from '../../../context/BrandContext';
import { 
  Rocket, 
  Copy, 
  Check, 
  ArrowRight, 
  Share2, 
  MessageSquare, 
  Pencil, 
  BookOpen
} from 'lucide-react';
import { EditFieldModal } from '../../shared/EditFieldModal';

export const LaunchStage: React.FC = () => {
  const { 
    brandMemory, 
    updateLaunch, 
    advanceToNextStage,
    goToStage,
    setActiveView 
  } = useBrand();

  const { launch, naming, personality } = brandMemory;
  const brandName = naming.selectedName?.name || 'SprintForge';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<keyof typeof launch | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-6 text-[#f4efe8]">
      {/* Chapter Editorial Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
            <span>07 / LAUNCH DISTRIBUTION</span>
            <span aria-hidden="true">·</span>
            <span>PUBLIC INTRODUCTION</span>
          </div>

          <div className="text-xs text-[#8a8175] font-mono">
            Grounded in verified Critic fixes
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif-editorial text-white tracking-tight">
          Ready to introduce the brand?
        </h1>
        <p className="text-sm text-[#a39a8e] max-w-2xl font-light leading-relaxed">
          The brand system now speaks to the public. High-impact headlines, launch announcements, and peer-to-peer distribution copy engineered for conversion.
        </p>
      </div>

      {/* Hero Landing Page Headline & Specimen Plate */}
      <div className="p-8 sm:p-12 rounded-3xl spatial-surface border border-white/10 shadow-2xl relative my-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
            PRIMARY CONVERSION HEADLINE
          </span>
          <button
            onClick={() => setEditingKey('headline')}
            className="text-xs text-[#8a8175] hover:text-white flex items-center gap-1 font-mono transition-colors"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit headline</span>
          </button>
        </div>

        <h2 className="text-4xl sm:text-6xl font-serif-editorial text-white tracking-tight leading-[1.05]">
          "{launch.headline || 'Stop building hackathon projects alone.'}"
        </h2>

        <p className="text-base sm:text-lg text-[#c8beaf] max-w-2xl font-light leading-relaxed">
          {launch.subheadline || launch.oneLinePitch}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button className="px-6 py-3 bg-[#f4efe8] text-black text-xs font-semibold rounded-full shadow-lg">
            {launch.primaryCta || 'Find your squad in 3 minutes'}
          </button>
          <button className="px-6 py-3 spatial-surface text-white text-xs font-medium rounded-full">
            {launch.secondaryCta || 'Bring SprintForge to your event'}
          </button>
        </div>
      </div>

      {/* One-Line Pitch & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-6 rounded-3xl spatial-surface space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
            <span className="uppercase">One-Line Pitch</span>
            <button
              onClick={() => copyToClipboard(launch.oneLinePitch, 'pitch')}
              className="text-[#a89f92] hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'pitch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-base text-white font-serif-editorial leading-snug">
            "{launch.oneLinePitch}"
          </p>
        </div>

        <div className="p-6 rounded-3xl spatial-surface space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
            <span className="uppercase">Core Product Description</span>
            <button
              onClick={() => copyToClipboard(launch.productDescription, 'desc')}
              className="text-[#a89f92] hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-[#b8afa3] leading-relaxed">
            {launch.productDescription}
          </p>
        </div>
      </div>

      {/* Social Post & Launch Letter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Social Announcement */}
        <div className="p-6 rounded-3xl spatial-surface-subtle space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8a8175]">
            <span className="uppercase flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Social Launch Post ({launch.socialPost?.platform || 'X / LinkedIn'})</span>
            </span>
            <button
              onClick={() => copyToClipboard(launch.socialPost?.text || '', 'social')}
              className="text-[#a89f92] hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'social' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'social' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#d6cec3] whitespace-pre-line leading-relaxed font-mono">
            {launch.socialPost?.text}
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
              onClick={() => copyToClipboard(launch.launchAnnouncement, 'letter')}
              className="text-[#a89f92] hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'letter' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'letter' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#a0988e] leading-relaxed">
            {launch.launchAnnouncement}
          </div>
        </div>
      </div>

      {/* Why This Messaging Works */}
      <div className="p-6 rounded-3xl spatial-surface-subtle space-y-2 mb-8">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
          WHY THIS MESSAGING WORKS (STRATEGIC CONNECTION)
        </span>
        <p className="text-xs text-[#c8beaf] leading-relaxed">
          {launch.whyThisMessagingWorks}
        </p>
      </div>

      {/* Action Advance Bar to Brand Book */}
      <div className="p-6 rounded-3xl spatial-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>All 7 strategic stages complete</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-xs text-[#8a8175]">
            Your brand is ready for the full-screen editorial Brand Book presentation.
          </p>
        </div>

        <button
          onClick={() => {
            goToStage('brand-kit');
            setActiveView('brand-kit');
          }}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f4efe8] hover:bg-white text-[#11100f] font-semibold text-xs rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open Editorial Brand Book</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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
