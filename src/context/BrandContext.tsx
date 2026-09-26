import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandMemory, StageId, ProcessingStep, DiscoveryData, PositioningData, PersonalityData, NamingData, VisualData, ChallengeData, ChallengeFinding, ProposedChange, ALLOWED_CHALLENGE_MUTATION_FIELDS, LaunchData, StageExecutionStatus, StageStatus, NameCandidate } from '../types/brand';
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
  generatePositioning: () => Promise<void>;
  generatePersonality: () => Promise<void>;
  generateNaming: () => Promise<void>;
  generateVisualize: () => Promise<void>;
  generateChallenge: () => Promise<void>;
  advanceToNextStage: () => void;
  goToStage: (stage: StageId) => void;
  updateDiscovery: (data: Partial<DiscoveryData>) => void;
  updatePositioning: (data: Partial<PositioningData>) => void;
  updatePersonality: (data: Partial<PersonalityData>) => void;
  selectNamingCandidate: (candidateId: string) => void;
  toggleShortlistCandidate: (candidateId: string) => void;
  toggleRejectCandidate: (candidateId: string) => void;
  updateNaming: (data: Partial<NamingData>) => void;
  updateVisual: (data: Partial<VisualData>) => void;
  acceptChallengeFinding: (findingId: string, customValue?: any) => void;
  ignoreChallengeFinding: (findingId: string) => void;
  editChallengeFinding: (findingId: string, findingText: string, suggestedImprovement: string, customProposedValue?: string) => void;
  rerunChallenge: () => Promise<void>;
  updateLaunch: (data: Partial<LaunchData>) => void;
  resetProject: () => void;
  setStageStatus: (stage: StageId, status: StageExecutionStatus) => void;
  setStageError: (stage: StageId, error: string) => void;
  clearStageError: (stage: StageId) => void;
}

const DEFAULT_PROCESSING_STEPS: ProcessingStep[] = [
  { id: '1', label: 'Understanding your idea & deconstructing domain', status: 'pending' },
  { id: '2', label: 'Extracting core structural problem & tension', status: 'pending' },
  { id: '3', label: 'Identifying high-intent audience & personas', status: 'pending' },
  { id: '4', label: 'Uncovering latent strategic assumptions', status: 'pending' },
  { id: '5', label: 'Preparing strategic discovery roadmap', status: 'pending' },
];

const STORAGE_KEY = 'brandforge_active_memory';

const createInitialStageExecution = (): Record<StageId, StageStatus> => ({
  input: { status: 'idle' },
  discover: { status: 'idle' },
  position: { status: 'idle' },
  personality: { status: 'idle' },
  naming: { status: 'idle' },
  visualize: { status: 'idle' },
  challenge: { status: 'idle' },
  launch: { status: 'idle' },
  'brand-kit': { status: 'idle' },
});

export const createBlankBrandMemory = (): BrandMemory => ({
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
    isConfirmed: false,
  },
  positioning: {
    category: '',
    targetSegment: '',
    valueProposition: '',
    differentiator: '',
    positioningStatement: '',
    whyThisPosition: '',
    isConfirmed: false,
  },
  personality: {
    traits: [],
    traitsToAvoid: [],
    principles: [],
    voiceAndTone: {
      tone: '',
      voiceCharacteristics: [],
      writingSampleDo: '',
      writingSampleDont: '',
    },
    isConfirmed: false,
  },
  naming: {
    territories: [],
    selectedNameId: '',
    selectedName: null,
    selectionRationale: '',
    isConfirmed: false,
  },
  visual: {
    palette: [],
    typography: [],
    shapeLanguage: {
      cornerStyle: '',
      density: '',
      framingRules: '',
      spatialFeel: '',
    },
    artDirection: {
      mood: '',
      composition: '',
      lighting: '',
      imageryRules: [],
    },
    logoConcept: {
      markType: '',
      description: '',
      symbolism: '',
      clearspaceRule: '',
    },
    thingsToAvoid: [],
    isConfirmed: false,
  },
  challenge: {
    findings: [],
    consistencySummary: {
      overallState: 'Has Actionable Gaps',
      strengthsCount: 0,
      warningsCount: 0,
      conflictsCount: 0,
      editorialAssessment: '',
    },
    isConfirmed: false,
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
      text: '',
    },
    whyThisMessagingWorks: '',
    isConfirmed: false,
  },
  stageExecution: createInitialStageExecution(),
});

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandMemory, setBrandMemory] = useState<BrandMemory>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BrandMemory;
        if (parsed && typeof parsed.id === 'string' && parsed.discovery && parsed.positioning) {
          if (!parsed.stageExecution) {
            parsed.stageExecution = createInitialStageExecution();
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to hydrate BrandMemory from sessionStorage:', e);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    return createBlankBrandMemory();
  });

  const [activeView, setActiveView] = useState<'landing' | 'workspace' | 'brand-kit'>('landing');
  const [currentStage, setCurrentStage] = useState<StageId>('input');
  const [isMemoryOpen, setIsMemoryOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(DEFAULT_PROCESSING_STEPS);
  const [currentProcessingStepIndex, setCurrentProcessingStepIndex] = useState<number>(0);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(brandMemory));
    } catch (e) {
      console.error('Failed to persist BrandMemory to sessionStorage:', e);
    }
  }, [brandMemory]);

  const loadDemoProject = (targetStage: StageId = 'discover') => {
    const demo = {
      ...DEMO_BRAND,
      updatedAt: new Date().toISOString(),
      stageExecution: createInitialStageExecution(),
    };
    demo.stagesCompleted.forEach(s => {
      demo.stageExecution![s] = { status: 'ready', lastUpdated: new Date().toISOString() };
    });
    setBrandMemory(demo);
    setCurrentStage(targetStage);
    setActiveView(targetStage === 'brand-kit' ? 'brand-kit' : 'workspace');
  };

  const startNewProject = () => {
    setBrandMemory(createBlankBrandMemory());
    setCurrentStage('input');
    setActiveView('workspace');
  };

  const startDiscoveryFromIdea = async (idea: string, details?: string) => {
    setStageStatus('discover', 'generating');
    clearStageError('discover');
    setIsProcessing(true);
    setProcessingSteps(DEFAULT_PROCESSING_STEPS.map(s => ({ ...s, status: 'pending' })));
    setCurrentProcessingStepIndex(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < DEFAULT_PROCESSING_STEPS.length - 1) {
        currentStep++;
        setCurrentProcessingStepIndex(currentStep);
        setProcessingSteps(prev =>
          prev.map((step, i) => {
            if (i < currentStep) return { ...step, status: 'completed' };
            if (i === currentStep) return { ...step, status: 'active' };
            return { ...step, status: 'pending' };
          })
        );
      }
    }, 700);

    try {
      const response = await fetch('/api/generate-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'discover',
          brandMemory: {
            roughIdea: idea,
            knownDetails: details,
            projectName: brandMemory.projectName || 'My New Brand',
          },
        }),
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      const discoveryData: DiscoveryData = result.data;

      // Complete all steps
      setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      await new Promise(r => setTimeout(r, 400));

      const now = new Date().toISOString();
      setBrandMemory(prev => ({
        ...prev,
        roughIdea: idea,
        knownDetails: details || '',
        discovery: discoveryData,
        updatedAt: now,
        currentStage: 'discover',
        stagesCompleted: Array.from(new Set([...prev.stagesCompleted, 'input', 'discover'])),
        stageExecution: {
          ...(prev.stageExecution || createInitialStageExecution()),
          discover: { status: 'ready', lastUpdated: now },
        },
      }));
      setCurrentStage('discover');
      setActiveView('workspace');
    } catch (err: any) {
      clearInterval(stepInterval);
      const safeMessage = err.message || 'An unexpected error occurred during discovery generation.';
      console.error('[Discovery Generation Error]:', err);
      setStageError('discover', safeMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePositioning = async () => {
    if (brandMemory.id === 'demo-hackathon-teammates') {
      return;
    }

    setStageStatus('position', 'generating');
    clearStageError('position');
    setIsProcessing(true);

    const POSITION_STEPS: ProcessingStep[] = [
      { id: '1', label: 'Extracting strategic tensions & beachhead signals from Discovery', status: 'pending' },
      { id: '2', label: 'Exploring unoccupied strategic territory wedges', status: 'pending' },
      { id: '3', label: 'Plotting 2D strategic coordinate map & trade-offs', status: 'pending' },
      { id: '4', label: 'Synthesizing defensible positioning statement & differentiation', status: 'pending' },
      { id: '5', label: 'Locking recommended strategic position into Brand Memory', status: 'pending' },
    ];

    setProcessingSteps(POSITION_STEPS);
    setCurrentProcessingStepIndex(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < POSITION_STEPS.length - 1) {
        currentStep++;
        setCurrentProcessingStepIndex(currentStep);
        setProcessingSteps(prev =>
          prev.map((step, i) => {
            if (i < currentStep) return { ...step, status: 'completed' };
            if (i === currentStep) return { ...step, status: 'active' };
            return { ...step, status: 'pending' };
          })
        );
      }
    }, 700);

    try {
      const response = await fetch('/api/generate-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'position',
          brandMemory: {
            roughIdea: brandMemory.roughIdea,
            knownDetails: brandMemory.knownDetails,
            projectName: brandMemory.projectName,
            discovery: brandMemory.discovery,
          },
        }),
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      const positioningData: PositioningData = result.data;

      // Complete all steps
      setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      await new Promise(r => setTimeout(r, 400));

      const now = new Date().toISOString();
      setBrandMemory(prev => ({
        ...prev,
        positioning: positioningData,
        updatedAt: now,
        currentStage: 'position',
        stagesCompleted: Array.from(new Set([...prev.stagesCompleted, 'position'])),
        stageExecution: {
          ...(prev.stageExecution || createInitialStageExecution()),
          position: { status: 'ready', lastUpdated: now },
        },
      }));
    } catch (err: any) {
      clearInterval(stepInterval);
      const safeMessage = err.message || 'An unexpected error occurred during positioning generation.';
      console.error('[Positioning Generation Error]:', err);
      setStageError('position', safeMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePersonality = async () => {
    if (brandMemory.id === 'demo-hackathon-teammates') {
      return;
    }

    setStageStatus('personality', 'generating');
    clearStageError('personality');
    setIsProcessing(true);

    const PERSONALITY_STEPS: ProcessingStep[] = [
      { id: '1', label: 'Extracting behavioral tensions & trust model from Discovery + Positioning', status: 'pending' },
      { id: '2', label: 'Formulating core personality traits and quarantined anti-archetypes', status: 'pending' },
      { id: '3', label: 'Synthesizing non-negotiable brand principles and spectrum dimensions', status: 'pending' },
      { id: '4', label: 'Architecting operational brand voice and actionable tone rules', status: 'pending' },
      { id: '5', label: 'Generating calibration writing samples and locking Brand Memory', status: 'pending' },
    ];

    setProcessingSteps(PERSONALITY_STEPS);
    setCurrentProcessingStepIndex(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < PERSONALITY_STEPS.length - 1) {
        currentStep++;
        setCurrentProcessingStepIndex(currentStep);
        setProcessingSteps(prev =>
          prev.map((step, i) => {
            if (i < currentStep) return { ...step, status: 'completed' };
            if (i === currentStep) return { ...step, status: 'active' };
            return { ...step, status: 'pending' };
          })
        );
      }
    }, 700);

    try {
      const response = await fetch('/api/generate-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'personality',
          brandMemory: {
            roughIdea: brandMemory.roughIdea,
            knownDetails: brandMemory.knownDetails,
            projectName: brandMemory.projectName,
            discovery: brandMemory.discovery,
            positioning: brandMemory.positioning,
          },
        }),
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      const personalityData: PersonalityData = result.data;

      // Complete all steps
      setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      await new Promise(r => setTimeout(r, 400));

      const now = new Date().toISOString();
      setBrandMemory(prev => ({
        ...prev,
        personality: personalityData,
        updatedAt: now,
        currentStage: 'personality',
        stagesCompleted: Array.from(new Set([...prev.stagesCompleted, 'personality'])),
        stageExecution: {
          ...(prev.stageExecution || createInitialStageExecution()),
          personality: { status: 'ready', lastUpdated: now },
        },
      }));
    } catch (err: any) {
      clearInterval(stepInterval);
      const safeMessage = err.message || 'An unexpected error occurred during personality generation.';
      console.error('[Personality Generation Error]:', err);
      setStageError('personality', safeMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateNaming = async () => {
    if (brandMemory.id === 'demo-hackathon-teammates') {
      return;
    }

    if (!brandMemory.discovery?.coreProblem || !brandMemory.discovery?.primaryAudience) {
      setStageError('naming', 'Discovery data is missing or incomplete. Discovery, Positioning, and Personality must be completed before Naming.');
      return;
    }

    if (!brandMemory.positioning?.category || (!brandMemory.positioning?.positioningStatement && !brandMemory.positioning?.valueProposition)) {
      setStageError('naming', 'Positioning data is missing or incomplete. Discovery, Positioning, and Personality must be completed before Naming.');
      return;
    }

    if (!brandMemory.personality?.traits || brandMemory.personality.traits.length === 0) {
      setStageError('naming', 'Personality data is missing or incomplete. Discovery, Positioning, and Personality must be completed before Naming.');
      return;
    }

    setStageStatus('naming', 'generating');
    clearStageError('naming');
    setIsProcessing(true);

    const NAMING_STEPS: ProcessingStep[] = [
      { id: '1', label: 'Analyzing Discovery tensions, Positioning wedge & Voice posture', status: 'pending' },
      { id: '2', label: 'Synthesizing strategic Naming Strategy & Creative Brief', status: 'pending' },
      { id: '3', label: 'Formulating 3 to 5 distinct Naming Worlds & emotional territories', status: 'pending' },
      { id: '4', label: 'Generating 12 to 20 candidate wordmarks across linguistic archetypes', status: 'pending' },
      { id: '5', label: 'Executing 8-factor diagnostic evaluations & risk audits', status: 'pending' },
    ];

    setProcessingSteps(NAMING_STEPS);
    setCurrentProcessingStepIndex(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < NAMING_STEPS.length - 1) {
        currentStep++;
        setCurrentProcessingStepIndex(currentStep);
        setProcessingSteps(prev =>
          prev.map((step, i) => {
            if (i < currentStep) return { ...step, status: 'completed' };
            if (i === currentStep) return { ...step, status: 'active' };
            return { ...step, status: 'pending' };
          })
        );
      }
    }, 700);

    try {
      const response = await fetch('/api/generate-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'naming',
          brandMemory: {
            roughIdea: brandMemory.roughIdea,
            knownDetails: brandMemory.knownDetails,
            projectName: brandMemory.projectName,
            discovery: brandMemory.discovery,
            positioning: brandMemory.positioning,
            personality: brandMemory.personality,
          },
        }),
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      const namingData: NamingData = result.data;

      // Complete all steps
      setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      await new Promise(r => setTimeout(r, 400));

      const now = new Date().toISOString();
      setBrandMemory(prev => ({
        ...prev,
        projectName: namingData.selectedName?.name || prev.projectName,
        naming: namingData,
        updatedAt: now,
        currentStage: 'naming',
        stagesCompleted: Array.from(new Set([...prev.stagesCompleted, 'naming'])),
        stageExecution: {
          ...(prev.stageExecution || createInitialStageExecution()),
          naming: { status: 'ready', lastUpdated: now },
        },
      }));
    } catch (err: any) {
      clearInterval(stepInterval);
      const safeMessage = err.message || 'An unexpected error occurred during naming generation.';
      console.error('[Naming Generation Error]:', err);
      setStageError('naming', safeMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVisualize = async () => {
    if (brandMemory.id === 'demo-hackathon-teammates') {
      return;
    }

    if (!brandMemory.discovery?.coreProblem || !brandMemory.discovery?.primaryAudience) {
      setStageError('visualize', 'Discovery data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.');
      return;
    }

    if (!brandMemory.positioning?.category || (!brandMemory.positioning?.positioningStatement && !brandMemory.positioning?.valueProposition)) {
      setStageError('visualize', 'Positioning data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.');
      return;
    }

    if (!brandMemory.personality?.traits || brandMemory.personality.traits.length === 0) {
      setStageError('visualize', 'Personality data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.');
      return;
    }

    if (!brandMemory.naming || (!brandMemory.naming.namingStrategy && (!brandMemory.naming.namingWorlds || brandMemory.naming.namingWorlds.length === 0) && (!brandMemory.naming.candidates || brandMemory.naming.candidates.length === 0))) {
      setStageError('visualize', 'Naming data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.');
      return;
    }

    setStageStatus('visualize', 'generating');
    clearStageError('visualize');
    setIsProcessing(true);

    const VISUAL_STEPS: ProcessingStep[] = [
      { id: '1', label: 'Analyzing Discovery friction, Positioning wedge, and Verbal identity', status: 'pending' },
      { id: '2', label: 'Sculpting Creative Concept & Visual Thesis mental model', status: 'pending' },
      { id: '3', label: 'Formulating 4 to 6 strategic Visual Principles', status: 'pending' },
      { id: '4', label: 'Synthesizing 7-role Color System & Typography pairings', status: 'pending' },
      { id: '5', label: 'Establishing Art Direction, Graphic Language & UI Principles', status: 'pending' },
    ];

    setProcessingSteps(VISUAL_STEPS);
    setCurrentProcessingStepIndex(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < VISUAL_STEPS.length - 1) {
        currentStep++;
        setCurrentProcessingStepIndex(currentStep);
        setProcessingSteps(prev =>
          prev.map((step, i) => {
            if (i < currentStep) return { ...step, status: 'completed' };
            if (i === currentStep) return { ...step, status: 'active' };
            return { ...step, status: 'pending' };
          })
        );
      }
    }, 700);

    try {
      const response = await fetch('/api/generate-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'visualize',
          brandMemory: {
            roughIdea: brandMemory.roughIdea,
            knownDetails: brandMemory.knownDetails,
            projectName: brandMemory.projectName,
            discovery: brandMemory.discovery,
            positioning: brandMemory.positioning,
            personality: brandMemory.personality,
            naming: brandMemory.naming,
          },
        }),
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      const visualData: VisualData = result.data;

      // Complete all steps
      setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      await new Promise(r => setTimeout(r, 400));

      const now = new Date().toISOString();
      setBrandMemory(prev => ({
        ...prev,
        visual: visualData,
        updatedAt: now,
        currentStage: 'visualize',
        stagesCompleted: Array.from(new Set([...prev.stagesCompleted, 'visualize'])),
        stageExecution: {
          ...(prev.stageExecution || createInitialStageExecution()),
          visualize: { status: 'ready', lastUpdated: now },
        },
      }));
    } catch (err: any) {
      clearInterval(stepInterval);
      const safeMessage = err.message || 'An unexpected error occurred during visual identity generation.';
      console.error('[Visual Identity Generation Error]:', err);
      setStageError('visualize', safeMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateChallenge = async () => {
    if (brandMemory.id === 'demo-hackathon-teammates') {
      return;
    }

    if (!brandMemory.discovery?.coreProblem || !brandMemory.discovery?.primaryAudience) {
      setStageError('challenge', 'Discovery data is missing or incomplete. Challenge requires Discovery, Positioning, Personality, Naming, and Visualize stages.');
      return;
    }

    if (!brandMemory.positioning?.category || (!brandMemory.positioning?.positioningStatement && !brandMemory.positioning?.valueProposition)) {
      setStageError('challenge', 'Positioning data is missing or incomplete. Challenge requires Discovery, Positioning, Personality, Naming, and Visualize stages.');
      return;
    }

    if (!brandMemory.personality?.traits || brandMemory.personality.traits.length === 0) {
      setStageError('challenge', 'Personality data is missing or incomplete. Challenge requires Discovery, Positioning, Personality, Naming, and Visualize stages.');
      return;
    }

    if (!brandMemory.naming || (!brandMemory.naming.namingStrategy && (!brandMemory.naming.namingWorlds || brandMemory.naming.namingWorlds.length === 0) && (!brandMemory.naming.candidates || brandMemory.naming.candidates.length === 0))) {
      setStageError('challenge', 'Naming data is missing or incomplete. Challenge requires Discovery, Positioning, Personality, Naming, and Visualize stages.');
      return;
    }

    if (!brandMemory.visual || (!brandMemory.visual.creativeDirection && (!brandMemory.visual.palette || brandMemory.visual.palette.length === 0) && !brandMemory.visual.colorSystem)) {
      setStageError('challenge', 'Visual data is missing or incomplete. Challenge requires Discovery, Positioning, Personality, Naming, and Visualize stages.');
      return;
    }

    setStageStatus('challenge', 'generating');
    clearStageError('challenge');
    setIsProcessing(true);

    const CHALLENGE_STEPS: ProcessingStep[] = [
      { id: '1', label: 'Stress-testing Discovery assumptions & audience definition', status: 'pending' },
      { id: '2', label: 'Interrogating Positioning defensibility & competitive wedge', status: 'pending' },
      { id: '3', label: 'Auditing unearned claims, accuracy guarantees & credibility risks', status: 'pending' },
      { id: '4', label: 'Analyzing Naming connotations & Visual language harmony', status: 'pending' },
      { id: '5', label: 'Synthesizing adversarial findings & strategic remediations', status: 'pending' },
    ];

    setProcessingSteps(CHALLENGE_STEPS);
    setCurrentProcessingStepIndex(0);

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < CHALLENGE_STEPS.length - 1) {
        currentStep++;
        setCurrentProcessingStepIndex(currentStep);
        setProcessingSteps(prev =>
          prev.map((step, i) => {
            if (i < currentStep) return { ...step, status: 'completed' };
            if (i === currentStep) return { ...step, status: 'active' };
            return { ...step, status: 'pending' };
          })
        );
      }
    }, 700);

    try {
      const response = await fetch('/api/generate-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'challenge',
          brandMemory: {
            roughIdea: brandMemory.roughIdea,
            knownDetails: brandMemory.knownDetails,
            projectName: brandMemory.projectName,
            discovery: brandMemory.discovery,
            positioning: brandMemory.positioning,
            personality: brandMemory.personality,
            naming: brandMemory.naming,
            visual: brandMemory.visual,
          },
        }),
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Server responded with status ${response.status}`);
      }

      const challengeData: ChallengeData = result.data;

      setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      await new Promise(r => setTimeout(r, 400));

      const now = new Date().toISOString();
      setBrandMemory(prev => ({
        ...prev,
        challenge: challengeData,
        updatedAt: now,
        currentStage: 'challenge',
        stagesCompleted: Array.from(new Set([...prev.stagesCompleted, 'challenge'])),
        stageExecution: {
          ...(prev.stageExecution || createInitialStageExecution()),
          challenge: { status: 'ready', lastUpdated: now },
        },
      }));
    } catch (err: any) {
      clearInterval(stepInterval);
      const safeMessage = err.message || 'An unexpected error occurred during brand challenge generation.';
      console.error('[Challenge Generation Error]:', err);
      setStageError('challenge', safeMessage);
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
      const now = new Date().toISOString();
      
      // Update stagesCompleted and stageExecution
      setBrandMemory(prev => {
        const stageExec = { ...(prev.stageExecution || createInitialStageExecution()) };
        stageExec[currentStage] = {
          ...(stageExec[currentStage] || {}),
          status: 'ready',
          lastUpdated: now,
        };
        return {
          ...prev,
          updatedAt: now,
          currentStage: nextStage,
          stagesCompleted: Array.from(new Set([...prev.stagesCompleted, currentStage])),
          stageExecution: stageExec,
        };
      });

      goToStage(nextStage);

      // Trigger positioning generation if transitioning to position and not yet ready
      if (nextStage === 'position' && brandMemory.id !== 'demo-hackathon-teammates' && brandMemory.stageExecution?.position?.status !== 'ready') {
        generatePositioning();
      }

      // Trigger personality generation if transitioning to personality and not yet ready
      if (nextStage === 'personality' && brandMemory.id !== 'demo-hackathon-teammates' && brandMemory.stageExecution?.personality?.status !== 'ready') {
        generatePersonality();
      }

      // Trigger naming generation if transitioning to naming and not yet ready
      if (nextStage === 'naming' && brandMemory.id !== 'demo-hackathon-teammates' && brandMemory.stageExecution?.naming?.status !== 'ready') {
        generateNaming();
      }

      // Trigger visualize generation if transitioning to visualize and not yet ready
      if (nextStage === 'visualize' && brandMemory.id !== 'demo-hackathon-teammates' && brandMemory.stageExecution?.visualize?.status !== 'ready') {
        generateVisualize();
      }

      // Trigger challenge generation if transitioning to challenge and not yet ready
      if (nextStage === 'challenge' && brandMemory.id !== 'demo-hackathon-teammates' && brandMemory.stageExecution?.challenge?.status !== 'ready') {
        generateChallenge();
      }
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
    let chosenCandidate: NameCandidate | null = null;
    if (brandMemory.naming.candidates) {
      chosenCandidate = brandMemory.naming.candidates.find(c => c.id === candidateId) || null;
    }
    if (!chosenCandidate && brandMemory.naming.territories) {
      for (const territory of brandMemory.naming.territories) {
        const found = territory.candidates.find(c => c.id === candidateId);
        if (found) {
          chosenCandidate = found;
          break;
        }
      }
    }

    if (chosenCandidate) {
      setBrandMemory(prev => {
        const updatedCandidates = prev.naming.candidates
          ? prev.naming.candidates.map(c => ({
              ...c,
              status: c.id === candidateId ? ('selected' as const) : (c.status === 'selected' ? ('candidate' as const) : c.status)
            }))
          : undefined;

        return {
          ...prev,
          projectName: chosenCandidate!.name,
          updatedAt: new Date().toISOString(),
          naming: {
            ...prev.naming,
            selectedNameId: candidateId,
            selectedCandidateId: candidateId,
            selectedName: chosenCandidate,
            candidates: updatedCandidates || prev.naming.candidates,
            selectionRationale: chosenCandidate!.strategicRationale || `Selected candidate "${chosenCandidate!.name}" for its strategic alignment with the brand's core positioning and audience energy.`
          }
        };
      });
    }
  };

  const toggleShortlistCandidate = (candidateId: string) => {
    setBrandMemory(prev => {
      const existingShortlist = prev.naming.shortlistedCandidateIds || prev.naming.shortlistedIds || [];
      const isShortlisted = existingShortlist.includes(candidateId);
      const updatedShortlist = isShortlisted
        ? existingShortlist.filter(id => id !== candidateId)
        : [...existingShortlist, candidateId];

      const updatedCandidates = prev.naming.candidates
        ? prev.naming.candidates.map(c => {
            if (c.id === candidateId) {
              return {
                ...c,
                status: isShortlisted ? ('candidate' as const) : ('shortlisted' as const)
              };
            }
            return c;
          })
        : undefined;

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        naming: {
          ...prev.naming,
          shortlistedIds: updatedShortlist,
          shortlistedCandidateIds: updatedShortlist,
          candidates: updatedCandidates || prev.naming.candidates,
        }
      };
    });
  };

  const toggleRejectCandidate = (candidateId: string) => {
    setBrandMemory(prev => {
      const existingRejected = prev.naming.rejectedIds || [];
      const isCurrentlyRejected = existingRejected.includes(candidateId);
      const updatedRejected = isCurrentlyRejected
        ? existingRejected.filter(id => id !== candidateId)
        : [...existingRejected, candidateId];

      const updatedCandidates = prev.naming.candidates
        ? prev.naming.candidates.map(c => {
            if (c.id === candidateId) {
              return {
                ...c,
                status: isCurrentlyRejected ? ('candidate' as const) : ('rejected' as const)
              };
            }
            return c;
          })
        : undefined;

      const currentShortlist = prev.naming.shortlistedCandidateIds || prev.naming.shortlistedIds || [];
      const updatedShortlist = currentShortlist.filter(id => id !== candidateId);

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        naming: {
          ...prev.naming,
          rejectedIds: updatedRejected,
          shortlistedIds: updatedShortlist,
          shortlistedCandidateIds: updatedShortlist,
          candidates: updatedCandidates || prev.naming.candidates,
        }
      };
    });
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

  const acceptChallengeFinding = (findingId: string, customValue?: any) => {
    setBrandMemory(prev => {
      const target = prev.challenge.findings.find(f => f.id === findingId);
      if (!target) return prev;

      const updatedFindings = prev.challenge.findings.map(f =>
        f.id === findingId ? { ...f, accepted: true, ignored: false, findingStatus: 'accepted' as const } : f
      );

      // Deep/shallow copy individual stages for strict isolation
      let updatedDiscovery = { ...prev.discovery };
      let updatedPositioning = { ...prev.positioning };
      let updatedPersonality = { ...prev.personality };
      let updatedNaming = { ...prev.naming };
      let updatedVisual = { ...prev.visual };
      let updatedLaunch = { ...prev.launch };

      if (target.proposedChange) {
        const { targetStage, field } = target.proposedChange;
        const valToApply = customValue !== undefined ? customValue : target.proposedChange.proposedValue;
        const allowed = ALLOWED_CHALLENGE_MUTATION_FIELDS[targetStage];

        if (allowed && allowed.includes(field)) {
          if (targetStage === 'discovery') {
            if (field === 'coreProblem') updatedDiscovery.coreProblem = valToApply;
            else if (field === 'primaryAudience') updatedDiscovery.primaryAudience = valToApply;
            else if (field === 'coreNeed') updatedDiscovery.coreNeed = valToApply;
            else if (field === 'userContext') updatedDiscovery.userContext = valToApply;
          } else if (targetStage === 'positioning') {
            if (field === 'positioningStatement') updatedPositioning.positioningStatement = valToApply;
            else if (field === 'valueProposition') updatedPositioning.valueProposition = valToApply;
            else if (field === 'primaryDifferentiation' || field === 'differentiator') {
              updatedPositioning.primaryDifferentiation = valToApply;
              updatedPositioning.differentiator = valToApply;
            } else if (field === 'targetSegment') updatedPositioning.targetSegment = valToApply;
            else if (field === 'category') updatedPositioning.category = valToApply;
          } else if (targetStage === 'personality') {
            if (field === 'voiceSummary') {
              updatedPersonality.voiceSummary = valToApply;
              if (updatedPersonality.voice) {
                updatedPersonality.voice = { ...updatedPersonality.voice, summary: valToApply };
              }
            }
          } else if (targetStage === 'naming') {
            if (field === 'selectionRationale') updatedNaming.selectionRationale = valToApply;
          } else if (targetStage === 'visualize') {
            if (field === 'visualConcept') {
              updatedVisual.visualConcept = valToApply;
              if (updatedVisual.creativeDirection) {
                updatedVisual.creativeDirection = { ...updatedVisual.creativeDirection, concept: valToApply };
              }
            } else if (field === 'visualThesis') {
              updatedVisual.visualThesis = valToApply;
              if (updatedVisual.creativeDirection) {
                updatedVisual.creativeDirection = { ...updatedVisual.creativeDirection, visualThesis: valToApply };
              }
            }
          } else if (targetStage === 'launch') {
            if (field === 'headline') updatedLaunch.headline = valToApply;
            else if (field === 'subheadline') updatedLaunch.subheadline = valToApply;
            else if (field === 'oneLinePitch') updatedLaunch.oneLinePitch = valToApply;
          }
        }
      } else {
        // Fallback for legacy findings without structured proposedChange
        const fallbackVal = customValue !== undefined ? customValue : target.suggestedImprovement;
        if (target.stageTarget === 'position' && fallbackVal) {
          updatedPositioning.positioningStatement = fallbackVal;
        } else if (target.stageTarget === 'launch' && fallbackVal) {
          updatedLaunch.headline = fallbackVal;
        } else if (target.stageTarget === 'discover' && fallbackVal) {
          updatedDiscovery.coreProblem = fallbackVal;
        }
      }

      const warningsCount = Math.max(0, prev.challenge.consistencySummary.warningsCount - 1);
      const conflictsCount = Math.max(0, prev.challenge.consistencySummary.conflictsCount - (target.severity === 'critical' || target.status === 'CONFLICT' ? 1 : 0));
      const overallState = conflictsCount === 0 ? (warningsCount === 0 ? 'Robust & Coherent' : 'Has Actionable Gaps') : 'Critical Alignment Needed';

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        discovery: updatedDiscovery,
        positioning: updatedPositioning,
        personality: updatedPersonality,
        naming: updatedNaming,
        visual: updatedVisual,
        launch: updatedLaunch,
        challenge: {
          ...prev.challenge,
          findings: updatedFindings,
          consistencySummary: {
            ...prev.challenge.consistencySummary,
            strengthsCount: prev.challenge.consistencySummary.strengthsCount + 1,
            warningsCount,
            conflictsCount,
            overallState,
          },
        },
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
          f.id === findingId ? { ...f, ignored: true, accepted: false, findingStatus: 'ignored' as const } : f
        ),
      },
    }));
  };

  const editChallengeFinding = (findingId: string, findingText: string, suggestedImprovement: string, customProposedValue?: string) => {
    setBrandMemory(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      challenge: {
        ...prev.challenge,
        findings: prev.challenge.findings.map(f => {
          if (f.id !== findingId) return f;
          const proposedChange = f.proposedChange
            ? { ...f.proposedChange, proposedValue: customProposedValue !== undefined ? customProposedValue : suggestedImprovement }
            : undefined;
          return {
            ...f,
            finding: findingText,
            suggestedImprovement,
            suggestedFix: suggestedImprovement,
            findingStatus: 'edited' as const,
            proposedChange,
          };
        }),
      },
    }));
  };

  const rerunChallenge = async () => {
    if (brandMemory.id === 'demo-hackathon-teammates') {
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 600));
      setBrandMemory(prev => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        challenge: {
          ...DEMO_BRAND.challenge,
          findings: DEMO_BRAND.challenge.findings.map(f => ({ ...f, accepted: false, ignored: false, findingStatus: 'open' as const })),
        },
      }));
      setIsProcessing(false);
      return;
    }
    await generateChallenge();
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

  const setStageStatus = (stage: StageId, status: StageExecutionStatus) => {
    setBrandMemory(prev => {
      const stageExec = { ...(prev.stageExecution || createInitialStageExecution()) };
      stageExec[stage] = {
        ...(stageExec[stage] || {}),
        status,
        lastUpdated: new Date().toISOString(),
      };
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        stageExecution: stageExec,
      };
    });
  };

  const setStageError = (stage: StageId, error: string) => {
    setBrandMemory(prev => {
      const stageExec = { ...(prev.stageExecution || createInitialStageExecution()) };
      stageExec[stage] = {
        ...(stageExec[stage] || {}),
        status: 'error',
        lastError: error,
        lastUpdated: new Date().toISOString(),
      };
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        stageExecution: stageExec,
      };
    });
  };

  const clearStageError = (stage: StageId) => {
    setBrandMemory(prev => {
      const stageExec = { ...(prev.stageExecution || createInitialStageExecution()) };
      if (stageExec[stage]) {
        stageExec[stage] = {
          ...stageExec[stage],
          lastError: undefined,
          lastUpdated: new Date().toISOString(),
        };
      }
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        stageExecution: stageExec,
      };
    });
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
        generatePositioning,
        generatePersonality,
        generateNaming,
        generateVisualize,
        generateChallenge,
        advanceToNextStage,
        goToStage,
        updateDiscovery,
        updatePositioning,
        updatePersonality,
        selectNamingCandidate,
        toggleShortlistCandidate,
        toggleRejectCandidate,
        updateNaming,
        updateVisual,
        acceptChallengeFinding,
        ignoreChallengeFinding,
        editChallengeFinding,
        rerunChallenge,
        updateLaunch,
        resetProject,
        setStageStatus,
        setStageError,
        clearStageError,
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
