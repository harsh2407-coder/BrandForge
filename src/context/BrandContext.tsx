import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandMemory, StageId, ProcessingStep, DiscoveryData, PositioningData, PersonalityData, NamingData, VisualData, ChallengeData, LaunchData } from '../types/brand';
import { DEMO_BRAND } from '../data/demoBrand';
import { brandEngine } from '../services/brandService';

const STAGE_ORDER: StageId[] = [
  'input',
  'discover',
  'position',
  'personality',
  'naming',
  'visualize',
  'challenge',
  'launch',
  'brand-kit',
];

interface BrandContextType {
  brandMemory: BrandMemory;
  activeView: 'landing' | 'workspace' | 'brand-kit';
  currentStage: StageId;
  isMemoryOpen: boolean;
  isProcessing: boolean;
  processingSteps: ProcessingStep[];
  currentProcessingStepIndex: number;
  setActiveView: (view: 'landing' | 'workspace' | 'brand-kit') => void;
  setCurrentStage: (stage: StageId) => void;
  setIsMemoryOpen: (open: boolean) => void;
  loadDemoProject: (targetStage?: StageId) => void;
  startNewProject: () => void;
  startDiscoveryFromIdea: (idea: string, details?: string) => Promise<void>;
  advanceToNextStage: () => void;
  goToStage: (stage: StageId) => void;
  updateDiscovery: (data: Partial<DiscoveryData>) => void;
  updatePositioning: (data: Partial<PositioningData>) => void;
  updatePersonality: (data: Partial<PersonalityData>) => void;
  selectNamingCandidate: (candidateId: string) => void;
  updateNaming: (data: Partial<NamingData>) => void;
  updateVisual: (data: Partial<VisualData>) => void;
  acceptChallengeFinding: (findingId: string) => void;
  ignoreChallengeFinding: (findingId: string) => void;
  editChallengeFinding: (findingId: string, findingText: string, suggestedImprovement: string) => void;
  rerunChallenge: () => Promise<void>;
  updateLaunch: (data: Partial<LaunchData>) => void;
  resetProject: () => void;
}

const DEFAULT_PROCESSING_STEPS: ProcessingStep[] = [
  { id: '1', label: 'Understanding your idea & deconstructing domain', status: 'pending' },
  { id: '2', label: 'Extracting core structural problem & tension', status: 'pending' },
  { id: '3', label: 'Identifying high-intent audience & personas', status: 'pending' },
  { id: '4', label: 'Uncovering latent strategic assumptions', status: 'pending' },
  { id: '5', label: 'Preparing strategic discovery roadmap', status: 'pending' },
];

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandMemory, setBrandMemory] = useState<BrandMemory>(() => {
    // Start with demo brand loaded in memory so preview is immediately rich,
    // but default landing page view
    return DEMO_BRAND;
  });

  const [activeView, setActiveView] = useState<'landing' | 'workspace' | 'brand-kit'>('landing');
  const [currentStage, setCurrentStage] = useState<StageId>('input');
  const [isMemoryOpen, setIsMemoryOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(DEFAULT_PROCESSING_STEPS);
  const [currentProcessingStepIndex, setCurrentProcessingStepIndex] = useState<number>(0);

  const loadDemoProject = (targetStage: StageId = 'discover') => {
    setBrandMemory({ ...DEMO_BRAND });
    setCurrentStage(targetStage);
    setActiveView(targetStage === 'brand-kit' ? 'brand-kit' : 'workspace');
  };

  const startNewProject = () => {
    const blank: BrandMemory = {
      id: `project-${Date.now()}`,
      projectName: 'My New Brand',
      roughIdea: '',
      knownDetails: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStage: 'input',
      stagesCompleted: [],
      discovery: {
        coreProblem: '',
        primaryAudience: '',
        userContext: '',
        currentAlternatives: [],
        coreNeed: '',
        assumptions: [],
        openQuestions: [],
        isConfirmed: false
      },
      positioning: {
        category: '',
        targetSegment: '',
        valueProposition: '',
        differentiator: '',
        positioningStatement: '',
        whyThisPosition: '',
        isConfirmed: false
      },
      personality: {
        traits: [],
        traitsToAvoid: [],
        principles: [],
        voiceAndTone: {
          tone: '',
          voiceCharacteristics: [],
          writingSampleDo: '',
          writingSampleDont: ''
        },
        isConfirmed: false
      },
      naming: {
        territories: [],
        selectedNameId: '',
        selectedName: null,
        selectionRationale: '',
        isConfirmed: false
      },
      visual: {
        palette: [],
        typography: [],
        shapeLanguage: {
          cornerStyle: '',
          density: '',
          framingRules: '',
          spatialFeel: ''
        },
        artDirection: {
          mood: '',
          composition: '',
          lighting: '',
          imageryRules: []
        },
        logoConcept: {
          markType: '',
          description: '',
          symbolism: '',
          clearspaceRule: ''
        },
        thingsToAvoid: [],
        isConfirmed: false
      },
      challenge: {
        findings: [],
        consistencySummary: {
          overallState: 'Has Actionable Gaps',
          strengthsCount: 0,
          warningsCount: 0,
          conflictsCount: 0,
          editorialAssessment: ''
        },
        isConfirmed: false
      },
      launch: {
        headline: '',
        subheadline: '',
        oneLinePitch: '',
        productDescription: '',
        primaryCta: '',
        secondaryCta: '',
        launchAnnouncement: '',
        socialPost: {
          platform: 'X / LinkedIn',
          text: ''
        },
        whyThisMessagingWorks: '',
        isConfirmed: false
      }
    };

    setBrandMemory(blank);
    setCurrentStage('input');
    setActiveView('workspace');
  };

  const startDiscoveryFromIdea = async (idea: string, details?: string) => {
    setIsProcessing(true);
    setProcessingSteps(DEFAULT_PROCESSING_STEPS.map(s => ({ ...s, status: 'pending' })));
    setCurrentProcessingStepIndex(0);

    try {
      const generated = await brandEngine.generateFullBrandFromIdea({
        idea,
        knownDetails: details,
        onStepProgress: (idx, label) => {
          setCurrentProcessingStepIndex(idx);
          setProcessingSteps(prev =>
            prev.map((step, i) => {
              if (i < idx) return { ...step, status: 'completed' };
              if (i === idx) return { ...step, status: 'active', label };
              return { ...step, status: 'pending' };
            })
          );
        }
      });

      // Complete all steps
      setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      await new Promise(r => setTimeout(r, 400));

      setBrandMemory(generated);
      setCurrentStage('discover');
      setActiveView('workspace');
    } finally {
      setIsProcessing(false);
    }
  };

  const goToStage = (stage: StageId) => {
    setCurrentStage(stage);
    if (stage === 'brand-kit') {
      setActiveView('brand-kit');
    } else {
      setActiveView('workspace');
    }
  };

  const advanceToNextStage = () => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1];
      
      // Update stagesCompleted
      setBrandMemory(prev => ({
        ...prev,
        currentStage: nextStage,
        stagesCompleted: Array.from(new Set([...prev.stagesCompleted, currentStage]))
      }));

      goToStage(nextStage);
    }
  };

  const updateDiscovery = (data: Partial<DiscoveryData>) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      discovery: {
        ...prev.discovery,
        ...data,
      }
    }));
  };

  const updatePositioning = (data: Partial<PositioningData>) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      positioning: {
        ...prev.positioning,
        ...data,
      }
    }));
  };

  const updatePersonality = (data: Partial<PersonalityData>) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      personality: {
        ...prev.personality,
        ...data,
      }
    }));
  };

  const selectNamingCandidate = (candidateId: string) => {
    let chosenCandidate = null;
    for (const territory of brandMemory.naming.territories) {
      const found = territory.candidates.find(c => c.id === candidateId);
      if (found) {
        chosenCandidate = found;
        break;
      }
    }

    if (chosenCandidate) {
      setBrandMemory(prev => ({
        ...prev,
        projectName: chosenCandidate.name,
        updatedAt: new Date().toISOString(),
        naming: {
          ...prev.naming,
          selectedNameId: candidateId,
          selectedName: chosenCandidate,
          selectionRationale: `Selected candidate "${chosenCandidate.name}" for its strategic alignment with the brand's core positioning and audience energy.`
        }
      }));
    }
  };

  const updateNaming = (data: Partial<NamingData>) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      naming: {
        ...prev.naming,
        ...data,
      }
    }));
  };

  const updateVisual = (data: Partial<VisualData>) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      visual: {
        ...prev.visual,
        ...data,
      }
    }));
  };

  const acceptChallengeFinding = (findingId: string) => {
    setBrandMemory(prev => {
      const target = prev.challenge.findings.find(f => f.id === findingId);
      if (!target) return prev;

      const updatedFindings = prev.challenge.findings.map(f =>
        f.id === findingId ? { ...f, accepted: true, ignored: false } : f
      );

      // If finding had an improvement suggestion, apply it to memory where applicable
      let updatedDiscovery = { ...prev.discovery };
      let updatedPositioning = { ...prev.positioning };
      let updatedLaunch = { ...prev.launch };

      if (target.stageTarget === 'position' && target.suggestedImprovement) {
        updatedPositioning.positioningStatement = target.suggestedImprovement;
      } else if (target.stageTarget === 'launch' && target.suggestedImprovement) {
        updatedLaunch.headline = target.suggestedImprovement;
      }

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        discovery: updatedDiscovery,
        positioning: updatedPositioning,
        launch: updatedLaunch,
        challenge: {
          ...prev.challenge,
          findings: updatedFindings,
          consistencySummary: {
            ...prev.challenge.consistencySummary,
            strengthsCount: prev.challenge.consistencySummary.strengthsCount + 1,
            warningsCount: Math.max(0, prev.challenge.consistencySummary.warningsCount - 1),
            conflictsCount: Math.max(0, prev.challenge.consistencySummary.conflictsCount - (target.status === 'CONFLICT' ? 1 : 0)),
            overallState: 'Robust & Coherent'
          }
        }
      };
    });
  };

  const ignoreChallengeFinding = (findingId: string) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      challenge: {
        ...prev.challenge,
        findings: prev.challenge.findings.map(f =>
          f.id === findingId ? { ...f, ignored: true, accepted: false } : f
        )
      }
    }));
  };

  const editChallengeFinding = (findingId: string, findingText: string, suggestedImprovement: string) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      challenge: {
        ...prev.challenge,
        findings: prev.challenge.findings.map(f =>
          f.id === findingId ? { ...f, finding: findingText, suggestedImprovement } : f
        )
      }
    }));
  };

  const rerunChallenge = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 900));
    const newChallenge = await brandEngine.generateChallenge(brandMemory);
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      challenge: newChallenge
    }));
    setIsProcessing(false);
  };

  const updateLaunch = (data: Partial<LaunchData>) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      launch: {
        ...prev.launch,
        ...data,
      }
    }));
  };

  const resetProject = () => {
    startNewProject();
  };

  return (
    <BrandContext.Provider
      value={{
        brandMemory,
        activeView,
        currentStage,
        isMemoryOpen,
        isProcessing,
        processingSteps,
        currentProcessingStepIndex,
        setActiveView,
        setCurrentStage,
        setIsMemoryOpen,
        loadDemoProject,
        startNewProject,
        startDiscoveryFromIdea,
        advanceToNextStage,
        goToStage,
        updateDiscovery,
        updatePositioning,
        updatePersonality,
        selectNamingCandidate,
        updateNaming,
        updateVisual,
        acceptChallengeFinding,
        ignoreChallengeFinding,
        editChallengeFinding,
        rerunChallenge,
        updateLaunch,
        resetProject,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
