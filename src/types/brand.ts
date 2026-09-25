export type StageId = 
  | 'input' 
  | 'discover' 
  | 'position' 
  | 'personality' 
  | 'naming' 
  | 'visualize' 
  | 'challenge' 
  | 'launch' 
  | 'brand-kit';

export interface DiscoveryData {
  coreProblem: string;
  primaryAudience: string;
  userContext: string;
  currentAlternatives: string[];
  coreNeed: string;
  assumptions: Array<{
    id: string;
    statement: string;
    riskLevel: 'high' | 'medium' | 'low';
    validationTip: string;
  }>;
  openQuestions: Array<{
    id: string;
    question: string;
    strategicWhy: string;
  }>;
  isConfirmed: boolean;
}

export interface PositioningData {
  category: string;
  targetSegment: string;
  valueProposition: string;
  differentiator: string;
  positioningStatement: string;
  whyThisPosition: string;
  isConfirmed: boolean;
}

export interface PersonalityTrait {
  name: string;
  whyItFits: string;
  evidence: string;
}

export interface PersonalityData {
  traits: PersonalityTrait[];
  traitsToAvoid: Array<{
    trait: string;
    reason: string;
  }>;
  principles: string[];
  voiceAndTone: {
    tone: string;
    voiceCharacteristics: string[];
    writingSampleDo: string;
    writingSampleDont: string;
  };
  isConfirmed: boolean;
}

export interface NameCandidate {
  id: string;
  name: string;
  meaning: string;
  strategicRationale: string;
  personalityFit: string;
  potentialWeakness: string;
  availabilityHint?: string;
}

export interface NamingTerritory {
  id: string;
  number: string;
  name: string;
  theme: string;
  rationale: string;
  candidates: NameCandidate[];
}

export interface NamingData {
  territories: NamingTerritory[];
  selectedNameId: string;
  selectedName: NameCandidate | null;
  selectionRationale: string;
  isConfirmed: boolean;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'surface' | 'neutral';
  contrastRatio: string;
  usageRule: string;
}

export interface FontSpec {
  role: string;
  family: string;
  category: string;
  weight: string;
  usage: string;
}

export interface VisualData {
  palette: ColorSwatch[];
  typography: FontSpec[];
  shapeLanguage: {
    cornerStyle: string;
    density: string;
    framingRules: string;
    spatialFeel: string;
  };
  artDirection: {
    mood: string;
    composition: string;
    lighting: string;
    imageryRules: string[];
  };
  logoConcept: {
    markType: string;
    description: string;
    symbolism: string;
    clearspaceRule: string;
  };
  thingsToAvoid: string[];
  isConfirmed: boolean;
}

export type CritiqueCategory = 
  | 'GENERIC LANGUAGE'
  | 'AUDIENCE FIT'
  | 'POSITIONING'
  | 'PERSONALITY'
  | 'NAME'
  | 'VOICE'
  | 'VISUAL DIRECTION'
  | 'CONSISTENCY';

export type CritiqueStatus = 'PASS' | 'WARNING' | 'CONFLICT';

export interface CritiqueFinding {
  id: string;
  category: CritiqueCategory;
  status: CritiqueStatus;
  finding: string;
  whyItMatters: string;
  suggestedImprovement: string;
  accepted?: boolean;
  ignored?: boolean;
  stageTarget?: StageId;
}

export interface ChallengeData {
  findings: CritiqueFinding[];
  consistencySummary: {
    overallState: 'Robust & Coherent' | 'Has Actionable Gaps' | 'Critical Alignment Needed';
    strengthsCount: number;
    warningsCount: number;
    conflictsCount: number;
    editorialAssessment: string;
  };
  isConfirmed: boolean;
}

export interface LaunchData {
  headline: string;
  subheadline: string;
  oneLinePitch: string;
  productDescription: string;
  primaryCta: string;
  secondaryCta: string;
  launchAnnouncement: string;
  socialPost: {
    platform: string;
    text: string;
  };
  whyThisMessagingWorks: string;
  isConfirmed: boolean;
}

export interface BrandMemory {
  id: string;
  projectName: string;
  roughIdea: string;
  knownDetails?: string;
  createdAt: string;
  updatedAt: string;
  currentStage: StageId;
  stagesCompleted: StageId[];
  discovery: DiscoveryData;
  positioning: PositioningData;
  personality: PersonalityData;
  naming: NamingData;
  visual: VisualData;
  challenge: ChallengeData;
  launch: LaunchData;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}
