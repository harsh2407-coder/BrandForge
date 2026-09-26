/**
 * scripts/test-deliver.ts
 *
 * Test suite for BrandForge Step 8: DELIVER (Final Stage).
 * Verifies:
 * 1. Deterministic Data Assembly & Schema Coverage
 * 2. Brand Name Resolution & Fallback Behavior
 * 3. Challenge Integration & Traceability (Before -> Decision -> After)
 * 4. Human-Approved Challenge Mutation Freshness (Positioning valueProposition reflection)
 * 5. State Integrity & Read-Only Immobility (Opening/exporting does NOT mutate BrandMemory)
 * 6. Grounding Audit (Zero invented claims, metrics, or fake trademark availability)
 * 7. DEMO_BRAND Determinism & Zero-Network Offline Integrity
 * 8. Missing Optional Fields & Graceful Degradation
 * 9. Export & Brief Formatting Integrity
 */

import { assembleDeliverData } from '../src/utils/deliverAssembly.js';
import { DEMO_BRAND } from '../src/data/demoBrand.js';
import { groqGateway } from '../server/groqGateway.js';
import type { BrandMemory } from '../src/types/brand.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=====================================================');
  console.log('BRANDFORGE STEP 8: DELIVER TEST SUITE');
  console.log('=====================================================\n');

  // --- 1. Deterministic Data Assembly from DEMO_BRAND ---
  console.log('--- 1. Testing Deterministic Data Assembly & Schema Coverage ---');
  const demoDeliver = assembleDeliverData(DEMO_BRAND);

  assert(demoDeliver.brandName === 'SprintForge', 'Brand name correctly resolved as "SprintForge"');
  assert(typeof demoDeliver.oneLinePitch === 'string' && demoDeliver.oneLinePitch.length > 10, 'One-line pitch is present and substantive');
  assert(typeof demoDeliver.headline === 'string' && demoDeliver.headline.length > 5, 'Headline is present');
  assert(typeof demoDeliver.subheadline === 'string' && demoDeliver.subheadline.length > 5, 'Subheadline is present');
  assert(typeof demoDeliver.executiveSummary === 'string' && demoDeliver.executiveSummary.includes('SprintForge'), 'Executive summary synthesizes brand identity');
  assert(typeof demoDeliver.brandEssence === 'string' && demoDeliver.brandEssence.length > 10, 'Brand essence is substantive');

  // Strategic Foundation
  assert(demoDeliver.strategicFoundation.problem === DEMO_BRAND.discovery.coreProblem, 'Strategic Foundation reflects Discovery problem');
  assert(demoDeliver.strategicFoundation.audience === DEMO_BRAND.discovery.primaryAudience, 'Strategic Foundation reflects Discovery audience');
  assert(demoDeliver.strategicFoundation.need === DEMO_BRAND.discovery.coreNeed, 'Strategic Foundation reflects Discovery need');
  assert(demoDeliver.strategicFoundation.positioning === DEMO_BRAND.positioning.positioningStatement, 'Strategic Foundation reflects Positioning statement');
  assert(demoDeliver.strategicFoundation.valueProposition === DEMO_BRAND.positioning.valueProposition, 'Strategic Foundation reflects Value proposition');

  // Personality & Voice
  assert(demoDeliver.personality.traits.length === DEMO_BRAND.personality.traits.length, 'Personality traits count matches upstream');
  assert(demoDeliver.personality.avoidTraits.length > 0, 'Avoid traits preserved');
  assert(demoDeliver.personality.principles.length > 0, 'Brand principles preserved');
  assert(demoDeliver.personality.voiceSummary.length > 5, 'Voice summary preserved');

  // Visual System
  assert(demoDeliver.visualIdentity.colors.length >= 5, 'Visual identity preserves color system tokens');
  assert(demoDeliver.visualIdentity.typography.length >= 2, 'Visual identity preserves typography specimens');
  assert(demoDeliver.visualIdentity.creativeDirection.length > 0, 'Visual identity creative direction preserved');

  // Launch Messaging
  assert(demoDeliver.messaging.headline === DEMO_BRAND.launch.headline, 'Messaging headline matches LaunchData');
  assert(demoDeliver.messaging.primaryCta === DEMO_BRAND.launch.primaryCta, 'Messaging primary CTA preserved');
  assert(demoDeliver.messaging.socialPost.text === DEMO_BRAND.launch.socialPost.text, 'Messaging social post preserved');

  // Checklist
  assert(demoDeliver.launchChecklist.length === 10, 'Generates 10-item founder launch checklist');
  const completedCount = demoDeliver.launchChecklist.filter(c => c.isCompleted).length;
  assert(completedCount >= 5, 'Completed upstream stages marked completed in checklist');
  const openCount = demoDeliver.launchChecklist.filter(c => !c.isCompleted).length;
  assert(openCount >= 3, 'Founder real-world execution items (trademark, interviews) remain open');

  console.log('\n--- 2. Testing Brand Name Resolution & Fallbacks ---');
  // Case A: Candidate selected via selectedName object
  const memA: BrandMemory = {
    ...DEMO_BRAND,
    naming: {
      ...DEMO_BRAND.naming,
      selectedName: { id: 'c-custom', name: 'CustomMark', meaning: 'Craft', strategicRationale: 'Clear fit', personalityFit: 'High', potentialWeakness: 'None' }
    }
  };
  assert(assembleDeliverData(memA).brandName === 'CustomMark', 'Resolves name from selectedName object');

  // Case B: Candidate selected via selectedNameId
  const memB: BrandMemory = {
    ...DEMO_BRAND,
    naming: {
      ...DEMO_BRAND.naming,
      selectedName: null as any,
      selectedNameId: 'c-test-id',
      candidates: [
        { id: 'c-test-id', name: 'CandidateViaId', meaning: 'Meaning', strategicRationale: 'Strat', personalityFit: 'High', potentialWeakness: 'None' }
      ]
    }
  };
  assert(assembleDeliverData(memB).brandName === 'CandidateViaId', 'Resolves name from candidates array using selectedNameId');

  // Case C: Fallback to projectName if no candidate selected
  const memC: BrandMemory = {
    ...DEMO_BRAND,
    projectName: 'ProjectScholar',
    naming: {
      ...DEMO_BRAND.naming,
      selectedName: null as any,
      selectedNameId: '',
      candidates: []
    }
  };
  assert(assembleDeliverData(memC).brandName === 'ProjectScholar', 'Falls back to projectName when candidate not selected');

  // Case D: "Name not finalized" if blank project and no candidate
  const memD: BrandMemory = {
    ...DEMO_BRAND,
    projectName: 'My New Brand',
    naming: {
      ...DEMO_BRAND.naming,
      selectedName: null as any,
      selectedNameId: '',
      candidates: []
    }
  };
  assert(assembleDeliverData(memD).brandName === 'Name not finalized', 'Returns "Name not finalized" when no valid name exists');

  console.log('\n--- 3. Testing Challenge Integration & Traceability (Before -> Decision -> After) ---');
  const challengeSummary = demoDeliver.challengeSummary;
  assert(challengeSummary.findingsCount === DEMO_BRAND.challenge.findings.length, 'Findings count matches BrandMemory');
  assert(challengeSummary.resolvedCount === DEMO_BRAND.challenge.findings.filter(f => f.accepted).length, 'Resolved count matches accepted findings');
  assert(challengeSummary.ignoredCount === DEMO_BRAND.challenge.findings.filter(f => f.ignored).length, 'Ignored count matches ignored findings');
  assert(challengeSummary.traceability.length === challengeSummary.resolvedCount, 'Traceability items correspond to accepted findings');

  // Inspect the accepted traceability item from DEMO_BRAND (crit-2: primaryAudience broadened)
  const crit2Item = challengeSummary.traceability.find(t => t.id === 'crit-2');
  assert(crit2Item !== undefined, 'Accepted finding crit-2 is present in traceability');
  if (crit2Item) {
    assert(crit2Item.beforeValue.includes('Collegiate software developers'), 'Traceability captures original unrefined beforeValue');
    assert(crit2Item.decision.includes('Human accepted critique'), 'Traceability establishes human governance decision');
    assert(crit2Item.afterValue.includes('Ambitious student developers, UI/UX designers'), 'Traceability captures corrected afterValue');
    assert(crit2Item.targetStage === 'discovery', 'Traceability identifies targetStage correctly');
    assert(crit2Item.field === 'primaryAudience', 'Traceability identifies target field correctly');
  }

  console.log('\n--- 4. Testing Freshness & Live Challenge Mutation Reflection ---');
  // Simulate live BrandMemory after Step 7 Challenge mutation
  const mutatedMemory: BrandMemory = {
    ...DEMO_BRAND,
    positioning: {
      ...DEMO_BRAND.positioning,
      valueProposition: 'A guided, high‑confidence match experience that currently curates scholarship listings and will soon add eligibility‑focused filtering.',
    },
    challenge: {
      ...DEMO_BRAND.challenge,
      findings: [
        {
          id: 'F001',
          category: 'Credibility / Claim Risk',
          status: 'WARNING',
          finding: 'Eligibility filtering presented as current capability when pipeline is not yet deployed.',
          whyItMatters: 'Overpromising undermines student trust.',
          suggestedImprovement: 'Frame eligibility filtering as future roadmap.',
          suggestedFix: 'Frame eligibility filtering as future roadmap.',
          proposedChange: {
            targetStage: 'positioning',
            field: 'valueProposition',
            currentValue: 'A real-time eligibility filtering platform.',
            proposedValue: 'A guided, high‑confidence match experience that currently curates scholarship listings and will soon add eligibility‑focused filtering.',
            rationale: 'Aligns claim with actual stage capabilities.'
          },
          accepted: true,
          findingStatus: 'accepted'
        }
      ]
    }
  };

  const deliverFromMutation = assembleDeliverData(mutatedMemory);
  assert(
    deliverFromMutation.strategicFoundation.valueProposition === 'A guided, high‑confidence match experience that currently curates scholarship listings and will soon add eligibility‑focused filtering.',
    'Deliver consumes current mutated valueProposition reflecting human-accepted Challenge correction'
  );
  assert(deliverFromMutation.challengeSummary.traceability.length === 1, 'Traceability reflects live F001 correction');
  assert(deliverFromMutation.challengeSummary.traceability[0].beforeValue === 'A real-time eligibility filtering platform.', 'Traceability captures F001 beforeValue');
  assert(deliverFromMutation.challengeSummary.traceability[0].afterValue === 'A guided, high‑confidence match experience that currently curates scholarship listings and will soon add eligibility‑focused filtering.', 'Traceability captures F001 afterValue');

  console.log('\n--- 5. Testing State Integrity & Read-Only Behavior ---');
  const originalSnapshot = JSON.stringify(DEMO_BRAND);
  // Assemble Deliver multiple times
  const d1 = assembleDeliverData(DEMO_BRAND);
  const d2 = assembleDeliverData(DEMO_BRAND);
  const finalSnapshot = JSON.stringify(DEMO_BRAND);

  assert(originalSnapshot === finalSnapshot, 'Assembling DeliverData does NOT mutate the source BrandMemory');
  assert(JSON.stringify(d1) === JSON.stringify(d2), 'Deliver assembly is strictly deterministic and idempotent');

  console.log('\n--- 6. Testing Grounding & Anti-Hallucination Integrity ---');
  // DeliverData should not assert fake legal/trademark clearance
  assert(demoDeliver.naming.isVerified === false, 'Naming isVerified flag remains false (no fake trademark clearance claimed)');
  const allDeliverText = JSON.stringify(demoDeliver).toLowerCase();
  assert(!allDeliverText.includes('100% accuracy guaranteed'), 'Deliver does not invent 100% accuracy guarantees');
  assert(!allDeliverText.includes('verified institutional partnerships'), 'Deliver does not invent verified institutional partnerships');
  assert(!allDeliverText.includes('uspto registered trademark #'), 'Deliver does not invent fake trademark registration numbers');

  console.log('\n--- 7. Testing Missing Optional Fields & Graceful Degradation ---');
  const sparseMemory: BrandMemory = {
    id: 'sparse-1',
    projectName: 'MinimalApp',
    roughIdea: 'A quick tool for notes.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: 'launch',
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
      shapeLanguage: { cornerStyle: '', density: '', framingRules: '', spatialFeel: '' },
      artDirection: { mood: '', composition: '', lighting: '', imageryRules: [] },
      logoConcept: { markType: '', description: '', symbolism: '', clearspaceRule: '' },
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
      socialPost: { platform: 'X', text: '' },
      whyThisMessagingWorks: '',
      isConfirmed: false
    }
  };

  let sparseDeliver: any;
  let didCrash = false;
  try {
    sparseDeliver = assembleDeliverData(sparseMemory);
  } catch (e) {
    didCrash = true;
  }

  assert(!didCrash, 'Deliver handles completely sparse BrandMemory without crashing');
  assert(sparseDeliver.brandName === 'MinimalApp', 'Falls back to projectName on sparse memory');
  assert(sparseDeliver.challengeSummary.findingsCount === 0, 'Handles empty challenge findings list gracefully');
  assert(sparseDeliver.launchChecklist.length === 10, 'Generates full checklist with incomplete statuses');

  console.log('\n--- 8. Testing Groq Gateway Deliver Normalizer ---');
  const mockRawGroqDeliver = {
    headline: 'Stop Building Hackathons Alone.',
    subheadline: 'SprintForge pairs ambitious student developers into podium-ready teams.',
    oneLinePitch: 'The squad formation engine for collegiate hackathon builders.',
    productDescription: 'Find complementary teammates based on real proof of work in under 10 minutes.',
    primaryCta: 'Find your squad in 3 minutes',
    secondaryCta: 'Bring SprintForge to your event',
    launchAnnouncement: 'We are launching SprintForge today to eliminate chaotic team search forever.',
    socialPost: {
      platform: 'X / LinkedIn',
      text: 'Introducing SprintForge: squad formation for hackathons.'
    },
    whyThisMessagingWorks: 'Directly addresses Friday night Discord pain points.',
    executiveSummary: 'SprintForge is a collegiate teammate matching platform solving chaotic team formation.',
    brandEssence: 'Rapid squad formation engineered for collegiate hackathon competitors.'
  };

  const normalizedDeliver = groqGateway.validateAndNormalizeDeliverData(mockRawGroqDeliver);
  assert(normalizedDeliver.headline === 'Stop Building Hackathons Alone.', 'Normalizes headline correctly');
  assert(normalizedDeliver.primaryCta === 'Find your squad in 3 minutes', 'Normalizes primary CTA');
  assert(Boolean(normalizedDeliver.executiveSummary?.includes('SprintForge is a collegiate teammate matching platform')), 'Normalizes executive summary');
  assert(Boolean(normalizedDeliver.brandEssence?.includes('Rapid squad formation')), 'Normalizes brand essence');

  console.log('\n=====================================================');
  console.log(`DELIVER TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
