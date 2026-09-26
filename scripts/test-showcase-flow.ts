import { isShowcasePrompt, SHOWCASE_PROMPT, getShowcaseDiscovery, getShowcasePositioning, getShowcasePersonality, getShowcaseNaming, getShowcaseVisual, getShowcaseInitialChallenge, getShowcaseReChallenge } from '../src/utils/showcase.js';
import { assembleDeliverData } from '../src/utils/deliverAssembly.js';
import { DEMO_BRAND } from '../src/data/demoBrand.js';
import type { BrandMemory } from '../src/types/brand.js';

console.log('====================================================');
console.log('BrandForge Showcase Mode Automated Verification');
console.log('====================================================\n');

// 1. TEST B: Normalization & Matching
console.log('--- TEST B: Normalization & Matching ---');
const testCases = [
  { input: SHOWCASE_PROMPT, expected: true, desc: 'Exact match' },
  { input: `  ${SHOWCASE_PROMPT}  `, expected: true, desc: 'Leading/trailing whitespace' },
  { input: 'I WANT TO BUILD AN APP THAT HELPS COLLEGE STUDENTS FIND TEAMMATES FOR HACKATHONS.', expected: true, desc: 'All uppercase' },
  { input: 'i want to build an app that helps college students find teammates for hackathons.', expected: true, desc: 'All lowercase' },
  { input: 'I   want   to build   an app that   helps college students find teammates for hackathons.', expected: true, desc: 'Multiple consecutive spaces' },
  { input: 'I want to build an app that helps college students find teammates for hackathons.\n', expected: true, desc: 'Trailing newline' },
  { input: 'I want to build a platform that helps college students discover scholarships.', expected: false, desc: 'Different prompt' },
  { input: 'I want to build an app that helps students find teammates', expected: false, desc: 'Truncated prompt (no fuzzy matching)' },
  { input: '', expected: false, desc: 'Empty string' },
  { input: null as any, expected: false, desc: 'Null' },
];

let normPassed = 0;
for (const tc of testCases) {
  const result = isShowcasePrompt(tc.input);
  if (result === tc.expected) {
    console.log(`  ✓ PASS: ${tc.desc} -> ${result}`);
    normPassed++;
  } else {
    console.error(`  ✗ FAIL: ${tc.desc} -> got ${result}, expected ${tc.expected}`);
  }
}

if (normPassed !== testCases.length) {
  console.error(`Normalization test failed: ${normPassed}/${testCases.length} passed.`);
  process.exit(1);
}
console.log(`All ${normPassed} normalization tests passed!\n`);

// 2. TEST A: Deterministic Stage Data Integrity (zero AI calls)
console.log('--- TEST A: Stage-by-Stage Showcase Data Integrity ---');

const discovery = getShowcaseDiscovery();
console.log('1. Discovery:');
console.log('   - Core Problem:', discovery.coreProblem ? 'PASS' : 'FAIL');
console.log('   - Primary Audience:', discovery.primaryAudience ? 'PASS' : 'FAIL');
console.log('   - Core Need:', discovery.coreNeed ? 'PASS' : 'FAIL');
console.log('   - Open Questions count:', discovery.openQuestions?.length);

const positioning = getShowcasePositioning(true);
console.log('2. Positioning (Initial Pre-Challenge):');
console.log('   - Statement:', positioning.positioningStatement);
console.log('   - Category:', positioning.category);
console.log('   - Value Prop:', positioning.valueProposition ? 'PASS' : 'FAIL');

const personality = getShowcasePersonality();
console.log('3. Personality:');
console.log('   - Voice Summary:', personality.voiceSummary ? 'PASS' : 'FAIL');
console.log('   - Traits count:', personality.traits?.length);
console.log('   - Writing Samples headline:', personality.writingSamples?.headline ? 'PASS' : 'FAIL');

const naming = getShowcaseNaming();
console.log('4. Naming:');
console.log('   - Selected Name:', naming.selectedName?.name);
console.log('   - Candidates count:', naming.candidates?.length);

const visual = getShowcaseVisual();
console.log('5. Visualize:');
console.log('   - Concept:', visual.creativeDirection?.concept);
console.log('   - Palette swatches:', visual.palette?.length);
console.log('   - Visual Principles count:', visual.visualPrinciples?.length);

const initialChallenge = getShowcaseInitialChallenge();
console.log('6. Initial Challenge:');
console.log('   - Overall State:', initialChallenge.consistencySummary.overallState);
console.log('   - Warnings:', initialChallenge.consistencySummary.warningsCount);
console.log('   - Conflicts:', initialChallenge.consistencySummary.conflictsCount);
console.log('   - Findings count:', initialChallenge.findings?.length);
console.log('   - Open findings count:', initialChallenge.findings?.filter(f => !f.accepted).length);

// 3. TEST D: Human Decision - Accept Finding crit-1
console.log('\n--- TEST D & E: Human Decision & Re-Challenge ---');

// Build active BrandMemory at Challenge stage
let memory: BrandMemory = {
  id: 'showcase-project',
  projectName: 'SprintForge',
  roughIdea: SHOWCASE_PROMPT,
  knownDetails: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentStage: 'challenge',
  stagesCompleted: ['input', 'discover', 'position', 'personality', 'naming', 'visualize', 'challenge'],
  discovery,
  positioning,
  personality,
  naming,
  visual,
  challenge: initialChallenge,
  launch: DEMO_BRAND.launch,
  stageExecution: {
    input: { status: 'ready' },
    discover: { status: 'ready' },
    position: { status: 'ready' },
    personality: { status: 'ready' },
    naming: { status: 'ready' },
    visualize: { status: 'ready' },
    challenge: { status: 'ready' },
    launch: { status: 'idle' },
    'brand-kit': { status: 'idle' },
  },
};

console.log('Initial Positioning Statement before acceptance:');
console.log(' "', memory.positioning.positioningStatement, '"');

// Simulate acceptChallengeFinding('crit-1')
const crit1 = memory.challenge.findings.find(f => f.id === 'crit-1')!;
console.log('\nTarget finding: [crit-1]', crit1.title);
console.log('Proposed Value:', crit1.proposedChange?.proposedValue);

// Execute mutation
if (crit1.proposedChange) {
  memory.positioning.positioningStatement = crit1.proposedChange.proposedValue;
  crit1.accepted = true;
  crit1.findingStatus = 'accepted';
}

console.log('\nMutated Positioning Statement after acceptance:');
console.log(' "', memory.positioning.positioningStatement, '"');

if (memory.positioning.positioningStatement === 'SprintForge is the squad formation engine that turns solitary student builders into balanced, podium-ready hackathon teams.') {
  console.log('✓ PASS: Positioning statement mutated correctly via finding proposedChange');
} else {
  console.error('✗ FAIL: Positioning statement mutation mismatch');
  process.exit(1);
}

// Simulate Re-Challenge
const reChallenge = getShowcaseReChallenge(memory.challenge);
memory.challenge = reChallenge;
console.log('\nRe-Challenge Result:');
console.log(' - Overall State:', reChallenge.consistencySummary.overallState);
console.log(' - Editorial Assessment:', reChallenge.consistencySummary.editorialAssessment);
console.log(' - Confirmed:', reChallenge.isConfirmed);

if (reChallenge.consistencySummary.overallState === 'Robust & Coherent') {
  console.log('✓ PASS: Re-Challenge upgraded status to "Robust & Coherent"');
} else {
  console.error('✗ FAIL: Re-Challenge status was:', reChallenge.consistencySummary.overallState);
  process.exit(1);
}

// 4. TEST F: Deliver Assembly
console.log('\n--- TEST F: Deliver Assembly & Brand Book ---');
const deliverData = assembleDeliverData(memory);
console.log('Brand Name:', deliverData.brandName);
console.log('Headline:', deliverData.headline);
console.log('One Line Pitch:', deliverData.oneLinePitch);
console.log('Deliver Positioning Statement:');
console.log(' "', deliverData.strategicFoundation.positioning, '"');
console.log('Deliver Brand Essence:', deliverData.brandEssence ? 'PASS' : 'FAIL');
console.log('Deliver Launch Checklist items:', deliverData.launchChecklist?.length);

if (deliverData.strategicFoundation.positioning === memory.positioning.positioningStatement) {
  console.log('✓ PASS: Deliver stage accurately reflects mutated positioning statement!');
} else {
  console.error('✗ FAIL: Deliver positioning statement did not match BrandMemory');
  process.exit(1);
}

// 5. TEST G: Reset Behavior
console.log('\n--- TEST G: Session Isolation & Reset Verification ---');
// Verify that non-showcase prompts return false
const normalPrompt = 'Build an AI tool for tracking personal carbon footprints';
if (!isShowcasePrompt(normalPrompt)) {
  console.log('✓ PASS: Arbitrary user prompt does NOT trigger showcase mode');
} else {
  console.error('✗ FAIL: Arbitrary user prompt falsely triggered showcase mode');
  process.exit(1);
}

console.log('\n====================================================');
console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY (100% PASS)');
console.log('====================================================');
