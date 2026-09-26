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

// Execution status for each stage
export type StageExecutionStatus = 'idle' | 'generating' | 'ready' | 'error';

export interface StageStatus {
  status: StageExecutionStatus;
  lastError?: string;
  lastUpdated?: string;
}

// Strategic positioning territories (alternatives)
export interface PositioningTerritory {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  valueProposition: string;
  tradeoff: string;
  quadrant?: string;
}

// Extend BrandMemory with stageExecution map


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

export interface PositioningAxis {
  lowLabel: string;
  highLabel: string;
}

export interface PositioningData {
  category: string;
  targetSegment: string;
  valueProposition: string;
  differentiator: string;
  positioningStatement: string;
  whyThisPosition: string;
  isConfirmed: boolean;
  territories?: PositioningTerritory[];
  selectedTerritoryId?: string;
  positioningRationale?: string;
  primaryDifferentiation?: string;
  keyPillars?: string[];
  xAxis?: PositioningAxis;
  yAxis?: PositioningAxis;
}

export interface PersonalityTrait {
  name: string;
  whyItFits: string;
  evidence: string;
  description?: string;
  strategicReason?: string;
}

export interface TraitToAvoid {
  trait: string;
  reason: string;
  name?: string;
  description?: string;
  reasonToAvoid?: string;
}

export interface BrandPrinciple {
  name: string;
  statement: string;
  implication: string;
}

export interface PersonalityDimension {
  dimension: string;
  value: number; // 0 to 100
  lowLabel: string;
  highLabel: string;
  rationale: string;
}

export interface VoiceCharacteristic {
  characteristic: string;
  explanation: string;
}

export interface VoiceToneRule {
  do: string;
  avoid: string;
  example: string;
}

export interface WritingSamples {
  headline: string;
  valueProposition: string;
  socialMessage: string;
  userExplanation: string;
}

export interface VoiceSystem {
  summary: string;
  characteristics: VoiceCharacteristic[];
  toneRules: VoiceToneRule[];
}

export interface VoiceAndToneData {
  tone: string;
  voiceCharacteristics: string[];
  writingSampleDo: string;
  writingSampleDont: string;
  summary?: string;
  characteristics?: VoiceCharacteristic[];
  toneRules?: VoiceToneRule[];
  writingSamples?: WritingSamples;
}

export interface PersonalityData {
  traits: PersonalityTrait[];
  traitsToAvoid: TraitToAvoid[];
  avoidTraits?: TraitToAvoid[];
  principles: string[];
  brandPrinciples?: BrandPrinciple[];
  dimensions?: PersonalityDimension[];
  voice?: VoiceSystem;
  voiceSummary?: string;
  writingSamples?: WritingSamples;
  voiceAndTone: VoiceAndToneData;
  isConfirmed: boolean;
}


export interface NamingEvaluation {
  strategicFit: number;
  positioningFit: number;
  personalityFit: number;
  audienceFit: number;
  distinctiveness: number;
  memorability: number;
  pronunciation: number;
  flexibility: number;
  risks: string[];
  rationale: string;
}

export interface NamingWorld {
  id: string;
  name: string;
  description: string;
  strategicIdea: string;
  namingLogic: string;
  emotionalTerritory: string;
  tradeoff: string;
  examples: string[];
}

export interface NameCandidate {
  id: string;
  name: string;
  meaning: string;
  strategicRationale: string;
  rationale?: string;
  personalityFit: string;
  potentialWeakness: string;
  availabilityHint?: string;
  worldId?: string;
  concept?: string;
  pronunciation?: string;
  evaluation?: NamingEvaluation;
  status?: 'candidate' | 'shortlisted' | 'rejected' | 'selected';
}

export type NamingCandidate = NameCandidate;

export interface NamingTerritory {
  id: string;
  number: string;
  name: string;
  theme: string;
  rationale: string;
  candidates: NameCandidate[];
  description?: string;
  strategicIdea?: string;
  namingLogic?: string;
  emotionalTerritory?: string;
  tradeoff?: string;
  examples?: string[];
}

export interface NamingData {
  namingStrategy?: string;
  namingBrief?: string;
  namingWorlds?: NamingWorld[];
  worlds?: NamingWorld[];
  territories: NamingTerritory[];
  candidates?: NameCandidate[];
  shortlistedIds?: string[];
  shortlistedCandidateIds?: string[];
  rejectedIds?: string[];
  selectedCandidateId?: string;
  selectedNameId: string;
  selectedName: NameCandidate | null;
  selectionRationale: string;
  isConfirmed: boolean;
}


export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'surface' | 'neutral' | 'text' | 'muted';
  contrastRatio?: string;
  usageRule?: string;
  rationale?: string;
}

export interface ColorSystem {
  primary: ColorSwatch;
  secondary: ColorSwatch;
  accent: ColorSwatch;
  background: ColorSwatch;
  surface: ColorSwatch;
  text?: ColorSwatch;
  muted?: ColorSwatch;
  palette?: ColorSwatch[];
}

export interface FontSpec {
  role: string;
  family: string;
  category: string;
  weight: string;
  usage: string;
}

export interface TypographyDirection {
  displayFont: string;
  bodyFont: string;
  supportingFont?: string;
  typographyMood: string;
  usageRules: string[];
  specs?: FontSpec[];
}

export interface VisualPrinciple {
  name: string;
  description: string;
  application: string;
}

export interface ImageryDirection {
  photographyStyle: string;
  subjectMatter: string;
  composition: string;
  lighting: string;
  colorTreatment: string;
  humanPresence: string;
  avoidImagery: string[];
}

export interface GraphicLanguage {
  shapes: string;
  lineLanguage: string;
  layoutBehavior: string;
  depth: string;
  motion: string;
  texture: string;
  iconography: string;
}

export interface LogoDirection {
  concept: string;
  symbolicIdea: string;
  formLanguage: string;
  construction: string;
  wordmarkDirection: string;
  avoid: string[];
  markType?: string;
  description?: string;
  symbolism?: string;
  clearspaceRule?: string;
}

export interface UIDirection {
  interfaceMood: string;
  layoutPrinciples: string;
  cardBehavior: string;
  navigationBehavior: string;
  interactionStyle: string;
  motionPrinciples: string;
}

export interface CreativeDirection {
  concept: string;
  visualThesis: string;
  moodKeywords: string[];
}

export interface VisualData {
  creativeDirection?: CreativeDirection;
  visualConcept?: string;
  visualThesis?: string;
  moodKeywords?: string[];
  visualPrinciples?: VisualPrinciple[];
  colorSystem?: ColorSystem;
  palette: ColorSwatch[];
  typography: FontSpec[];
  typographyDirection?: TypographyDirection;
  imageryDirection?: ImageryDirection;
  artDirection: {
    mood: string;
    composition: string;
    lighting: string;
    imageryRules: string[];
  };
  graphicLanguage?: GraphicLanguage;
  shapeLanguage: {
    cornerStyle: string;
    density: string;
    framingRules: string;
    spatialFeel: string;
  };
  logoDirection?: LogoDirection;
  logoConcept: {
    markType: string;
    description: string;
    symbolism: string;
    clearspaceRule: string;
  };
  uiDirection?: UIDirection;
  doRules?: string[];
  dontRules?: string[];
  avoidVisuals?: string[];
  thingsToAvoid: string[];
  isConfirmed: boolean;
}

export type ChallengeSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ChallengeCategory = 
  | 'Strategic Risk'
  | 'Audience Risk'
  | 'Positioning Risk'
  | 'Differentiation Risk'
  | 'Naming Risk'
  | 'Personality Risk'
  | 'Visual Risk'
  | 'Credibility / Claim Risk'
  | 'Coherence Risk'
  | 'Assumption Risk'
  | 'GENERIC LANGUAGE'
  | 'AUDIENCE FIT'
  | 'POSITIONING'
  | 'PERSONALITY'
  | 'NAME'
  | 'VOICE'
  | 'VISUAL DIRECTION'
  | 'CONSISTENCY';

export type CritiqueCategory = ChallengeCategory;

export type CritiqueStatus = 'PASS' | 'WARNING' | 'CONFLICT';

export type FindingStatus = 'open' | 'accepted' | 'ignored' | 'edited' | 'resolved';

export interface ProposedChange {
  targetStage: 'discovery' | 'positioning' | 'personality' | 'naming' | 'visualize' | 'launch';
  field: string;
  currentValue?: any;
  proposedValue: any;
  rationale?: string;
}

export const ALLOWED_CHALLENGE_MUTATION_FIELDS: Record<string, string[]> = {
  discovery: ['coreProblem', 'primaryAudience', 'coreNeed', 'userContext'],
  positioning: ['positioningStatement', 'valueProposition', 'primaryDifferentiation', 'differentiator', 'targetSegment', 'category'],
  personality: ['voiceSummary'],
  naming: ['selectionRationale'],
  visualize: ['visualConcept', 'visualThesis'],
  launch: ['headline', 'subheadline', 'oneLinePitch']
};

export interface ChallengeFinding {
  id: string;
  category: ChallengeCategory;
  severity?: ChallengeSeverity;
  status: CritiqueStatus;
  findingStatus?: FindingStatus;
  title?: string;
  summary?: string;
  finding: string;
  evidence?: string;
  whyItMatters: string;
  affectedStages?: string[];
  suggestedImprovement: string;
  suggestedFix?: string;
  proposedChange?: ProposedChange;
  accepted?: boolean;
  ignored?: boolean;
  stageTarget?: StageId;
}

export type CritiqueFinding = ChallengeFinding;

export interface ChallengeData {
  findings: ChallengeFinding[];
  consistencySummary: {
    overallState: 'Robust & Coherent' | 'Has Actionable Gaps' | 'Critical Alignment Needed';
    strengthsCount: number;
    warningsCount: number;
    conflictsCount: number;
    editorialAssessment: string;
  };
  isConfirmed: boolean;
  lastChallengedAt?: string;
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

export interface StrategicFoundation {
  problem: string;
  audience: string;
  need: string;
  positioning: string;
  valueProposition: string;
  differentiation: string;
  keyPillars?: string[];
}

export interface DeliverPersonality {
  traits: PersonalityTrait[];
  avoidTraits: TraitToAvoid[];
  principles: string[];
  voiceSummary: string;
  voiceCharacteristics: VoiceCharacteristic[];
  toneRules: VoiceToneRule[];
  writingSamples?: WritingSamples;
}

export interface DeliverNaming {
  selectedName: string;
  meaning?: string;
  rationale: string;
  namingWorld?: string;
  isVerified: boolean;
}

export interface DeliverVisualIdentity {
  creativeDirection: string;
  visualThesis: string;
  moodKeywords: string[];
  visualPrinciples: VisualPrinciple[];
  colors: ColorSwatch[];
  typography: FontSpec[];
  imagery: {
    mood: string;
    composition: string;
    lighting: string;
    imageryRules: string[];
  } | ImageryDirection;
  graphicLanguage: {
    cornerStyle: string;
    density: string;
    framingRules: string;
    spatialFeel: string;
  } | GraphicLanguage;
  logoDirection: {
    markType?: string;
    description?: string;
    symbolism?: string;
    clearspaceRule?: string;
    concept?: string;
    symbolicIdea?: string;
    formLanguage?: string;
    construction?: string;
    wordmarkDirection?: string;
    avoid?: string[];
  } | LogoDirection;
  uiDirection?: UIDirection;
  doRules?: string[];
  dontRules?: string[];
}

export interface DeliverMessaging {
  headline: string;
  subheadline: string;
  oneLinePitch: string;
  productDescription: string;
  primaryCta: string;
  secondaryCta: string;
  keyMessages: string[];
  toneExamples: {
    do: string;
    avoid: string;
  };
  launchAnnouncement: string;
  socialPost: {
    platform: string;
    text: string;
  };
}

export interface ChallengeTraceabilityItem {
  id: string;
  category: string;
  title: string;
  finding: string;
  targetStage: string;
  field: string;
  beforeValue: string;
  decision: string;
  afterValue: string;
  rationale?: string;
}

export interface DeliverChallengeSummary {
  findingsCount: number;
  resolvedCount: number;
  ignoredCount: number;
  openCount: number;
  keyRisks: Array<{
    id: string;
    category: string;
    severity: string;
    title: string;
    finding: string;
    status: string;
  }>;
  traceability: ChallengeTraceabilityItem[];
  consistencyState: string;
  editorialAssessment: string;
}

export interface LaunchChecklistItem {
  id: string;
  category: 'Brand' | 'Messaging' | 'Visual' | 'Product' | 'Launch' | 'Validation';
  label: string;
  description: string;
  isCompleted: boolean;
}

export interface DeliverData {
  brandName: string;
  oneLinePitch: string;
  headline: string;
  subheadline: string;
  executiveSummary: string;
  brandEssence: string;
  strategicFoundation: StrategicFoundation;
  personality: DeliverPersonality;
  naming: DeliverNaming;
  visualIdentity: DeliverVisualIdentity;
  messaging: DeliverMessaging;
  challengeSummary: DeliverChallengeSummary;
  launchChecklist: LaunchChecklistItem[];
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
  deliver?: DeliverData;
  stageExecution?: Record<StageId, StageStatus>;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}
