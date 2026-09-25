import React from 'react';
import { BrandProvider, useBrand } from './context/BrandContext';
import { FloatingNav } from './components/navigation/FloatingNav';
import { LandingPage } from './components/landing/LandingPage';
import { Workspace } from './components/workspace/Workspace';
import { BrandKitView } from './components/workspace/BrandKitView';
import { BrandMemoryPanel } from './components/spatial/BrandMemoryPanel';

const AppContent: React.FC = () => {
  const { activeView } = useBrand();

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#f4efe8] flex flex-col font-sans selection:bg-[#322e2b] selection:text-white">
      {/* Minimal Floating Navigation (No permanent admin sidebar) */}
      <FloatingNav />
      
      {activeView === 'landing' && <LandingPage />}

      {activeView === 'workspace' && <Workspace />}

      {activeView === 'brand-kit' && (
        <div className="flex-1 pt-16">
          <BrandKitView />
        </div>
      )}

      {/* Floating Spatial Brand Memory Graph Panel (Available globally) */}
      <BrandMemoryPanel />
    </div>
  );
};

export default function App() {
  return (
    <BrandProvider>
      <AppContent />
    </BrandProvider>
  );
}
