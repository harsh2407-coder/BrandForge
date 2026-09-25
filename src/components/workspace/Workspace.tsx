import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { StagedProcessing } from './StagedProcessing';
import { InputStage } from './stages/InputStage';
import { DiscoverStage } from './stages/DiscoverStage';
import { PositioningStage } from './stages/PositioningStage';
import { PersonalityStage } from './stages/PersonalityStage';
import { NamingStage } from './stages/NamingStage';
import { VisualStage } from './stages/VisualStage';
import { ChallengeStage } from './stages/ChallengeStage';
import { LaunchStage } from './stages/LaunchStage';
import { BrandKitView } from './BrandKitView';
import { BrandMemoryPanel } from '../spatial/BrandMemoryPanel';

export const Workspace: React.FC = () => {
  const { currentStage, isProcessing } = useBrand();

  const renderActiveStage = () => {
    if (isProcessing) {
      return <StagedProcessing />;
    }

    switch (currentStage) {
      case 'input':
        return <InputStage />;
      case 'discover':
        return <DiscoverStage />;
      case 'position':
        return <PositioningStage />;
      case 'personality':
        return <PersonalityStage />;
      case 'naming':
        return <NamingStage />;
      case 'visualize':
        return <VisualStage />;
      case 'challenge':
        return <ChallengeStage />;
      case 'launch':
        return <LaunchStage />;
      case 'brand-kit':
        return <BrandKitView />;
      default:
        return <DiscoverStage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0c0b0a] text-[#f4efe8] pt-20 pb-16 overflow-x-hidden">
      {/* Subtle Background Radial Ambient Glow */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(217, 163, 102, 0.04) 0%, rgba(12, 11, 10, 0) 75%)'
        }}
      />

      {/* Main Full-Width Spatial Viewport (NO SIDEBAR) */}
      <main className="w-full">
        {renderActiveStage()}
      </main>

      {/* Floating Spatial Brand Memory Graph Panel */}
      <BrandMemoryPanel />
    </div>
  );
};
