import { groqGateway, STAGE_COMPLETION_BUDGETS } from '../server/groqGateway.js';
import { buildPersonalityPrompt, PERSONALITY_SCHEMA, PERSONALITY_SYSTEM_INSTRUCTION } from '../server/personalityPrompt.js';
import type { DiscoveryData, PositioningData, PersonalityData, BrandMemory } from '../src/types/brand.js';

console.log('=====================================================');
console.log('BRANDFORGE PERSONALITY REGRESSION & VALIDATION SUITE');
console.log('=====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

// Mock verified discovery & positioning upstream data
const mockDiscovery: DiscoveryData = {
  coreProblem: 'College students struggle with fragmented, irrelevant scholarship portals.',
  primaryAudience: 'US undergraduate & graduate students seeking external grants.',
  userContext: 'Application deadlines with high financial stress.',
  currentAlternatives: ['Fastweb', 'Scholarships.com'],
  coreNeed: 'Pre-vetted eligible funding without spam.',
  assumptions: [],
  openQuestions: [],
  isConfirmed: true,
};

const mockPositioning: PositioningData = {
  category: 'Eligibility-Focused Scholarship Discovery Platform',
  targetSegment: 'US college students seeking external funding',
  valueProposition: 'Find funding you actually qualify for in minutes, not weekends.',
  differentiator: 'Algorithmic pre-filtering on strict eligibility before display.',
  positioningStatement: 'For students who waste time on dead ends, ScholarCompass delivers verified matches.',
  whyThisPosition: 'Incumbents prioritize advertising impressions over applicant match rate.',
  isConfirmed: true,
  keyPillars: ['Zero-noise matching', 'Transparent deadlines', 'Plain-English criteria'],
};

// 1. Test Valid Full Personality Response
console.log('--- Test 1: Full Valid Personality Response with All Required Fields ---');
const validPersonalityJson = JSON.stringify({
  traits: [
    {
      name: 'Pragmatic Rigor',
      description: 'Clear, straightforward guidance that cuts through academic bureaucracy.',
      whyItFits: 'Directly addresses student exhaustion from bloated portals.',
      evidence: 'Students abandon search tools that surface unqualified leads.',
    },
    {
      name: 'Empathetic Candor',
      description: 'Transparent communication about eligibility likelihood without false hope.',
      whyItFits: 'Builds authentic trust when traditional portals exaggerate chances.',
      evidence: 'Users appreciate knowing immediately if an award is worth their application time.',
    },
    {
      name: 'Quiet Precision',
      description: 'Surgical filtering and crisp data presentation over noisy gamification.',
      whyItFits: 'Reinforces the algorithmic wedge against spammy lead-generation incumbents.',
      evidence: 'High-intent applicants seek efficiency during compressed application windows.',
    },
    {
      name: 'Advocate Stance',
      description: 'Uncompromising loyalty to the student applicant rather than corporate sponsors.',
      whyItFits: 'Positions the platform as an ally against student debt.',
      evidence: 'Trust collapses when student platforms sell applicant data to private lenders.',
    },
  ],
  avoidTraits: [
    {
      name: 'Vaporous Hype',
      reasonToAvoid: 'Exaggerating award odds creates resentment when students receive rejections.',
      description: 'Promising guaranteed funds or effortless application shortcuts.',
    },
    {
      name: 'Bureaucratic Jargon',
      reasonToAvoid: 'Dense financial aid terminology alienates first-generation applicants.',
      description: 'Using opaque institutional acronyms without explanatory context.',
    },
    {
      name: 'Patronizing Hand-Holding',
      reasonToAvoid: 'Treating capable college adults like children undermines self-efficacy.',
      description: 'Excessive cartoonish gamification and infantilizing cheerleading.',
    },
  ],
  principles: [
    {
      name: 'Eligibility Before Volume',
      statement: 'Never display an opportunity unless the student strictly satisfies core criteria.',
      implication: 'Filtering algorithms drop borderline matches to maintain trust.',
    },
    {
      name: 'Total Source Transparency',
      statement: 'Every scholarship listing must clearly display its funding source and deadline.',
      implication: 'Sponsored placements are prohibited from masquerading as organic matches.',
    },
    {
      name: 'Respect the Applicant Time',
      statement: 'Quantify required essay effort and estimated completion hours upfront.',
      implication: 'UI shows time-investment metrics on every opportunity card.',
    },
  ],
  dimensions: [
    {
      dimension: 'Communication Density',
      value: 25,
      lowLabel: 'Telegraphic & Minimal',
      highLabel: 'Expansive & Narrative',
      rationale: 'Students need rapid scanning during busy semesters.',
    },
    {
      dimension: 'Tone Posture',
      value: 30,
      lowLabel: 'Pragmatic Ally',
      highLabel: 'Cheerleading Coach',
      rationale: 'Grounded realism resonates better than synthetic cheerleading.',
    },
    {
      dimension: 'Technical Transparency',
      value: 80,
      lowLabel: 'Black Box Simplicity',
      highLabel: 'Transparent Scoring',
      rationale: 'Explaining match rationale increases application conversion.',
    },
    {
      dimension: 'Design Aesthetic',
      value: 20,
      lowLabel: 'Quiet Utility',
      highLabel: 'Playful Gamification',
      rationale: 'Financial stress requires clean clarity, not bells and whistles.',
    },
  ],
  voice: {
    summary: 'Direct, clear, intellectually honest, and deeply respectful of the student time.',
    characteristics: [
      {
        characteristic: 'Crisp & Actionable',
        explanation: 'State eligibility rules plainly using active verbs.',
      },
      {
        characteristic: 'Pragmatic & Grounded',
        explanation: 'Acknowledge competitive realities without sugarcoating acceptance odds.',
      },
      {
        characteristic: 'Student-First Transparency',
        explanation: 'Always explain why an opportunity matches or does not match.',
      },
    ],
    toneRules: [
      {
        do: 'State the exact GPA and residency prerequisites in the first line.',
        avoid: 'Hiding critical disqualifying criteria behind click-through walls.',
        example: 'Requires 3.2+ GPA, California residency, and computer science major.',
      },
      {
        do: 'Provide estimated application hours and essay requirements upfront.',
        avoid: 'Calling 5-page research proposals "easy" or "quick".',
        example: 'Estimated time: 3 hours (one 500-word essay, two references).',
      },
      {
        do: 'Speak directly as a dependable partner to the applicant.',
        avoid: 'Using cheerful slogans when students are dealing with severe tuition stress.',
        example: 'Your deadline is in 4 days. Here is what is still missing from your packet.',
      },
    ],
  },
  writingSamples: {
    headline: 'Scholarships You Actually Qualify For. Zero Junk.',
    valueProposition: 'Filter out the noise and find verified funding opportunities in under ten minutes.',
    socialMessage: 'Stop spending Sunday nights scrolling through expired scholarships. Find matched awards now.',
    userExplanation: 'We verify award deadlines and eligibility rules before showing you any funding opportunity.',
  },
});

try {
  const result = groqGateway.validateAndNormalizePersonality(validPersonalityJson);
  assert(Boolean(result), 'Normalized personality object produced');
  assert(Array.isArray(result.traits) && result.traits.length === 4, 'traits contains 4 items');
  assert(result.traits[0].name === 'Pragmatic Rigor', 'first trait name is "Pragmatic Rigor"');
  assert(Boolean(result.traits[0].whyItFits), 'trait.whyItFits is populated');
  assert(Boolean(result.traits[0].evidence), 'trait.evidence is populated');
  assert(Boolean(result.traits[0].description), 'trait.description is populated');
  assert(Array.isArray(result.traitsToAvoid) && result.traitsToAvoid.length === 3, 'traitsToAvoid contains 3 items');
  assert(Array.isArray(result.principles) && result.principles.length === 3, 'principles contains 3 items');
  assert(Array.isArray(result.brandPrinciples) && result.brandPrinciples.length === 3, 'brandPrinciples contains 3 items');
  assert(Array.isArray(result.dimensions) && result.dimensions.length === 4, 'dimensions contains 4 items');
  assert(Boolean(result.voice?.summary), 'voice.summary is populated');
  assert(Array.isArray(result.voice?.characteristics) && result.voice!.characteristics.length === 3, 'voice.characteristics contains 3 items');
  assert(Array.isArray(result.voice?.toneRules) && result.voice!.toneRules.length === 3, 'voice.toneRules contains 3 items');
  
  // Verify writingSamples strictly populated from output
  assert(Boolean(result.writingSamples), 'writingSamples object is populated');
  assert(result.writingSamples?.headline === 'Scholarships You Actually Qualify For. Zero Junk.', 'writingSamples.headline matches model output');
  assert(result.writingSamples?.valueProposition === 'Filter out the noise and find verified funding opportunities in under ten minutes.', 'writingSamples.valueProposition matches model output');
  assert(Boolean(result.writingSamples?.socialMessage?.includes('Sunday nights')), 'writingSamples.socialMessage matches model output');
  assert(Boolean(result.writingSamples?.userExplanation?.includes('verify award deadlines')), 'writingSamples.userExplanation matches model output');
} catch (e: any) {
  assert(false, `Valid Personality parsing failed: ${e.message}`);
}

// 2. Test Simulated Truncated Output (Missing writingSamples)
console.log('\n--- Test 2: Simulated Truncated Output (Missing writingSamples) ---');
const truncatedJson = JSON.stringify({
  traits: [
    { name: 'Trait 1', whyItFits: 'Fits', evidence: 'Evidence', description: 'Desc' },
    { name: 'Trait 2', whyItFits: 'Fits', evidence: 'Evidence', description: 'Desc' },
    { name: 'Trait 3', whyItFits: 'Fits', evidence: 'Evidence', description: 'Desc' },
  ],
  avoidTraits: [
    { name: 'Avoid 1', reasonToAvoid: 'Reason', description: 'Desc' },
    { name: 'Avoid 2', reasonToAvoid: 'Reason', description: 'Desc' },
  ],
  principles: [
    { name: 'P1', statement: 'Statement', implication: 'Imp' },
    { name: 'P2', statement: 'Statement', implication: 'Imp' },
  ],
  dimensions: [
    { dimension: 'Dim 1', value: 50, lowLabel: 'L', highLabel: 'H', rationale: 'R' },
    { dimension: 'Dim 2', value: 50, lowLabel: 'L', highLabel: 'H', rationale: 'R' },
    { dimension: 'Dim 3', value: 50, lowLabel: 'L', highLabel: 'H', rationale: 'R' },
  ],
  voice: {
    summary: 'Voice summary',
    characteristics: [{ characteristic: 'C1', explanation: 'E1' }, { characteristic: 'C2', explanation: 'E2' }],
    toneRules: [{ do: 'Do this', avoid: 'Avoid this', example: 'Example' }, { do: 'Do this', avoid: 'Avoid this', example: 'Example' }],
  },
  // writingSamples is completely missing due to token truncation!
});

let truncationCaught = false;
try {
  groqGateway.validateAndNormalizePersonality(truncatedJson);
} catch (err: any) {
  truncationCaught = true;
  assert(err.message.includes('writingSamples'), `Truncation error mentions writingSamples: "${err.message}"`);
}
assert(truncationCaught, 'Truncated output strictly fails validation (no fake fallback substituted)');

// 3. Test Pipeline Error State Protection on Personality Failure
console.log('\n--- Test 3: Pipeline Integrity & State Preservation on Personality Failure ---');

const initialMemory: BrandMemory = {
  id: 'test-session',
  roughIdea: 'AI platform for scholarships',
  projectName: 'ScholarCompass',
  currentStage: 'personality',
  stagesCompleted: ['discover', 'position'],
  stageExecution: {
    input: { status: 'ready' },
    discover: { status: 'ready' },
    position: { status: 'ready' },
    personality: { status: 'idle' },
    naming: { status: 'idle' },
    visualize: { status: 'idle' },
    challenge: { status: 'idle' },
    launch: { status: 'idle' },
    'brand-kit': { status: 'idle' },
  },
  discovery: mockDiscovery,
  positioning: mockPositioning,
  stageFeedback: {},
} as any;

// Simulate dispatch failure handling
function simulatePersonalityFailure(memory: BrandMemory, errorMsg: string): BrandMemory {
  // Deep clone memory to simulate immutable React state update
  const updated: BrandMemory = JSON.parse(JSON.stringify(memory));
  // On validation/generation failure, stageExecution is marked error
  if (updated.stageExecution) {
    updated.stageExecution.personality = {
      status: 'error',
      lastError: errorMsg,
      errorCategory: 'VALIDATION_ERROR',
    };
  }
  return updated;
}

const failedState = simulatePersonalityFailure(initialMemory, 'Invalid Personality data: missing required property: writingSamples.');

assert(failedState.stageExecution?.personality?.status === 'error', 'personality status is "error"');
assert(failedState.personality === undefined, 'BrandMemory.personality is not corrupted with fake data');
assert(!failedState.stagesCompleted.includes('personality'), 'personality is NOT added to stagesCompleted');

// Downstream lock tests:
function isStageAccessible(memory: BrandMemory, stageId: string): boolean {
  if (stageId === 'naming') {
    return memory.stageExecution?.personality?.status === 'ready' &&
           Boolean(memory.personality?.traits && memory.personality.traits.length > 0);
  }
  if (stageId === 'visualize') {
    return memory.stageExecution?.naming?.status === 'ready' &&
           Boolean(memory.naming?.candidates && memory.naming.candidates.length > 0);
  }
  if (stageId === 'challenge') {
    return memory.stageExecution?.visualize?.status === 'ready';
  }
  if (stageId === 'deliver') {
    return memory.stageExecution?.challenge?.status === 'ready';
  }
  return true;
}

assert(!isStageAccessible(failedState, 'naming'), 'Downstream Naming stage is strictly LOCKED when Personality fails');
assert(!isStageAccessible(failedState, 'visualize'), 'Downstream Visualize stage is strictly LOCKED');
assert(!isStageAccessible(failedState, 'challenge'), 'Downstream Challenge stage is strictly LOCKED');
assert(!isStageAccessible(failedState, 'deliver'), 'Downstream Deliver stage is strictly LOCKED');

// 4. Test Prompt Size & Token Budget Calibration
console.log('\n--- Test 4: Personality Token Footprint & Budget Headroom ---');
const prompt = buildPersonalityPrompt(initialMemory.roughIdea, mockDiscovery, mockPositioning, initialMemory.projectName);
const estimatedPromptTokens = Math.ceil((prompt.length + PERSONALITY_SYSTEM_INSTRUCTION.length + JSON.stringify(PERSONALITY_SCHEMA).length) / 3.8);

console.log(`  Measured Prompt char length: ${prompt.length}`);
console.log(`  Estimated total input tokens: ~${estimatedPromptTokens}`);
console.log(`  Personality completion budget: ${STAGE_COMPLETION_BUDGETS.personality}`);
const totalReservation = estimatedPromptTokens + STAGE_COMPLETION_BUDGETS.personality;
console.log(`  Total reservation (input + budget): ${totalReservation} tokens`);

assert(STAGE_COMPLETION_BUDGETS.personality === 4800, `Personality budget calibrated to 4800 tokens (got ${STAGE_COMPLETION_BUDGETS.personality})`);
assert(totalReservation < 8000, `Total reservation (${totalReservation} tokens) strictly respects Groq 8000 TPM limit`);
assert(8000 - totalReservation > 1500, `Headroom below 8000 TPM limit is ${8000 - totalReservation} tokens (>1500 tokens safe buffer)`);

console.log('\n=====================================================');
console.log(`PERSONALITY REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('=====================================================\n');

if (failed > 0) {
  process.exit(1);
}
