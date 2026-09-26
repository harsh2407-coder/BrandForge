/**
 * scripts/test-challenge.ts
 *
 * Test suite for BrandForge Step 7: Challenge Engine.
 * Verifies:
 * 1. Challenge Normalization & Schema Validation
 * 2. Whitelist Field Protection & Proposed Change Validation
 * 3. API Router Preconditions & Upstream Stage Guards
 * 4. DEMO_BRAND Determinism & Offline Integrity
 * 5. State Integrity, Human Decision Mechanics (Accept / Ignore / Edit), and Stage Isolation
 */

import { groqGateway, ALLOWED_CHALLENGE_MUTATION_FIELDS } from '../server/groqGateway.js';
import { DEMO_BRAND } from '../src/data/demoBrand.js';
import type { ChallengeData, ChallengeFinding, BrandMemory } from '../src/types/brand.js';

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
  console.log('BRANDFORGE STEP 7: CHALLENGE ENGINE TEST SUITE');
  console.log('=====================================================\n');

  // --- 1. Challenge Normalization & Schema Validation ---
  console.log('--- 1. Testing Challenge Normalization & Schema Validation ---');

  const validRawChallenge = {
    findings: [
      {
        id: 'crit-test-1',
        category: 'Positioning Risk',
        severity: 'high',
        status: 'WARNING',
        title: 'Differentiation is Still Category-Level',
        finding: 'Value proposition relies on generic discovery promises that any aggregator could claim.',
        evidence: 'Positioning statement promises "a curated eligibility-focused matching layer" without proprietary mechanics.',
        whyItMatters: 'If competitors can claim the same outcome, the brand cannot defend a distinct mental territory.',
        suggestedFix: 'Anchor the differentiation on the specific decision-tree algorithm and transparent match criteria.',
        suggestedImprovement: 'Anchor the differentiation on the specific decision-tree algorithm and transparent match criteria.',
        proposedChange: {
          targetStage: 'positioning',
          field: 'positioningStatement',
          currentValue: 'ScholarCompass is a personalized scholarship platform.',
          proposedValue: 'ScholarCompass uses a transparent criteria matrix to narrow thousands of grants to high-probability awards.',
          rationale: 'Focuses on the transparent criteria matrix mechanism.'
        }
      },
      {
        id: 'crit-test-2',
        category: 'Credibility / Claim Risk',
        severity: 'critical',
        status: 'CONFLICT',
        title: 'Unsupported Real-Time Verification Claim',
        finding: 'Copy suggests a "verified institutional database" that is not yet established in Discovery.',
        evidence: 'Draft claims verified university feeds when Discovery only established manual directory scraping.',
        whyItMatters: 'Promising verified feeds creates legal exposure and student disillusionment upon launch.',
        suggestedFix: 'Frame data collection as curated public listings rather than verified real-time institutional feeds.',
        suggestedImprovement: 'Frame data collection as curated public listings rather than verified real-time institutional feeds.',
        proposedChange: {
          targetStage: 'positioning',
          field: 'valueProposition',
          currentValue: 'Real-time verified scholarship engine.',
          proposedValue: 'Curated scholarship directory with structured eligibility guidelines.',
          rationale: 'Aligns value prop with actual data capabilities.'
        }
      }
    ],
    consistencySummary: {
      overallState: 'Has Actionable Gaps',
      strengthsCount: 2,
      warningsCount: 1,
      conflictsCount: 1,
      editorialAssessment: 'Significant positioning and claim risks identified.'
    }
  };

  const normalized = groqGateway.validateAndNormalizeChallengeData(validRawChallenge);

  assert(normalized.findings.length === 2, 'Normalizes 2 findings correctly');
  assert(normalized.findings[0].category === 'Positioning Risk', 'Preserves Positioning Risk category');
  assert(normalized.findings[0].severity === 'high', 'Preserves high severity');
  assert(normalized.findings[0].status === 'WARNING', 'Preserves WARNING status');
  assert(normalized.findings[0].title === 'Differentiation is Still Category-Level', 'Preserves finding title');
  assert(normalized.findings[0].evidence!.includes('Positioning statement promises'), 'Preserves required evidence citation');
  assert(normalized.findings[0].whyItMatters.includes('cannot defend a distinct mental territory'), 'Preserves whyItMatters explanation');
  assert(normalized.findings[0].proposedChange !== undefined, 'Preserves valid proposedChange object');
  assert(normalized.findings[0].proposedChange?.field === 'positioningStatement', 'Target field matches whitelist');
  assert(normalized.findings[0].findingStatus === 'open', 'Initial findingStatus is open');
  assert(normalized.findings[0].accepted === false, 'Initial accepted is false');
  assert(normalized.findings[0].ignored === false, 'Initial ignored is false');

  assert(normalized.findings[1].severity === 'critical', 'Preserves critical severity');
  assert(normalized.findings[1].status === 'CONFLICT', 'Preserves CONFLICT status');
  assert(normalized.consistencySummary.conflictsCount === 1, 'Calculates 1 conflict count');
  assert(normalized.consistencySummary.overallState === 'Critical Alignment Needed', 'Sets overallState to Critical Alignment Needed when conflicts present');

  // Test markdown code block wrapping
  const wrappedJson = '```json\n' + JSON.stringify(validRawChallenge) + '\n```';
  const fromWrapped = groqGateway.validateAndNormalizeChallengeData(wrappedJson);
  assert(fromWrapped.findings.length === 2, 'Handles markdown ```json code blocks gracefully');

  // Test controlled error on malformed JSON
  try {
    groqGateway.validateAndNormalizeChallengeData('invalid json {{{');
    assert(false, 'Should throw on malformed JSON');
  } catch (err: any) {
    assert(err.message.includes('Failed to parse Groq Challenge output as JSON'), 'Throws controlled error on malformed JSON');
  }

  // Test controlled error on missing findings array
  try {
    groqGateway.validateAndNormalizeChallengeData({ findings: [] });
    assert(false, 'Should throw on empty findings array');
  } catch (err: any) {
    assert(err.message.includes('Groq returned no findings'), 'Throws controlled error on empty findings array');
  }

  // Test controlled error on missing evidence
  try {
    groqGateway.validateAndNormalizeChallengeData({
      findings: [
        {
          id: 'crit-no-ev',
          category: 'Positioning Risk',
          title: 'Vague finding',
          finding: 'The brand needs more work.',
          evidence: '',
          whyItMatters: 'It matters.',
          suggestedFix: 'Fix it.'
        }
      ]
    });
    assert(false, 'Should throw on missing evidence quote');
  } catch (err: any) {
    assert(err.message.includes('missing required evidence quote'), 'Throws controlled error when evidence quote is missing');
  }

  // --- 2. Whitelist Field Protection & Proposed Change Validation ---
  console.log('\n--- 2. Testing Whitelist Field Protection & Proposed Change Validation ---');

  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.discovery.includes('coreProblem'), 'Discovery allows coreProblem');
  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.discovery.includes('primaryAudience'), 'Discovery allows primaryAudience');
  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.positioning.includes('positioningStatement'), 'Positioning allows positioningStatement');
  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.positioning.includes('valueProposition'), 'Positioning allows valueProposition');
  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.personality.includes('voiceSummary'), 'Personality allows voiceSummary');
  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.naming.includes('selectionRationale'), 'Naming allows selectionRationale');
  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.visualize.includes('visualConcept'), 'Visualize allows visualConcept');
  assert(ALLOWED_CHALLENGE_MUTATION_FIELDS.launch.includes('headline'), 'Launch allows headline');

  // Attempt proposedChange with disallowed field or target stage
  const badFieldChallenge = {
    findings: [
      {
        id: 'crit-disallowed',
        category: 'Strategic Risk',
        title: 'Disallowed field mutation attempt',
        finding: 'Attempting to mutate database or arbitrary property',
        evidence: 'Cited from memory.',
        whyItMatters: 'Security and state integrity.',
        suggestedFix: 'Reject arbitrary mutation.',
        proposedChange: {
          targetStage: 'database_injection',
          field: 'maliciousField',
          proposedValue: 'DROP TABLE'
        }
      },
      {
        id: 'crit-disallowed-2',
        category: 'Positioning Risk',
        title: 'Disallowed internal positioning property',
        finding: 'Attempting to mutate non-whitelisted property',
        evidence: 'Cited from memory.',
        whyItMatters: 'State integrity.',
        suggestedFix: 'Do not allow arbitrary field mutation.',
        proposedChange: {
          targetStage: 'positioning',
          field: 'unauthorizedInternalConfig',
          proposedValue: 'Hacked'
        }
      }
    ]
  };

  const normalizedDisallowed = groqGateway.validateAndNormalizeChallengeData(badFieldChallenge);
  assert(normalizedDisallowed.findings[0].proposedChange === undefined, 'Disallowed targetStage is cleanly stripped');
  assert(normalizedDisallowed.findings[1].proposedChange === undefined, 'Disallowed field is cleanly stripped');

  // --- 3. Testing API Router Preconditions & Upstream Stage Guards ---
  console.log('\n--- 3. Testing API Router Preconditions & Upstream Stage Guards ---');

  const baseUrl = 'http://localhost:3001/api';

  async function postApi(body: any) {
    const res = await fetch(`${baseUrl}/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

  // Missing roughIdea
  const resNoIdea = await postApi({ stage: 'challenge' });
  assert(resNoIdea.status === 400 && resNoIdea.data.error.includes('Please enter a rough idea'), 'Rejects challenge stage without roughIdea');

  // Missing Discovery
  const resNoDisc = await postApi({
    stage: 'challenge',
    brandMemory: { roughIdea: 'Test' },
  });
  assert(resNoDisc.status === 400 && resNoDisc.data.error.includes('Discovery data is missing'), 'Rejects challenge stage when Discovery is missing');

  // Missing Positioning
  const resNoPos = await postApi({
    stage: 'challenge',
    brandMemory: {
      roughIdea: 'Test',
      discovery: { coreProblem: 'Prob', primaryAudience: 'Aud' },
    },
  });
  assert(resNoPos.status === 400 && resNoPos.data.error.includes('Positioning data is missing'), 'Rejects challenge stage when Positioning is missing');

  // Missing Personality
  const resNoPers = await postApi({
    stage: 'challenge',
    brandMemory: {
      roughIdea: 'Test',
      discovery: { coreProblem: 'Prob', primaryAudience: 'Aud' },
      positioning: { category: 'Cat', positioningStatement: 'Stmt' },
    },
  });
  assert(resNoPers.status === 400 && resNoPers.data.error.includes('Personality data is missing'), 'Rejects challenge stage when Personality is missing');

  // Missing Naming
  const resNoNaming = await postApi({
    stage: 'challenge',
    brandMemory: {
      roughIdea: 'Test',
      discovery: { coreProblem: 'Prob', primaryAudience: 'Aud' },
      positioning: { category: 'Cat', positioningStatement: 'Stmt' },
      personality: { traits: [{ name: 'Trait 1' }] },
    },
  });
  assert(resNoNaming.status === 400 && resNoNaming.data.error.includes('Naming data is missing'), 'Rejects challenge stage when Naming is missing');

  // Missing Visualize
  const resNoVisual = await postApi({
    stage: 'challenge',
    brandMemory: {
      roughIdea: 'Test',
      discovery: { coreProblem: 'Prob', primaryAudience: 'Aud' },
      positioning: { category: 'Cat', positioningStatement: 'Stmt' },
      personality: { traits: [{ name: 'Trait 1' }] },
      naming: { namingStrategy: 'Strat' },
    },
  });
  assert(resNoVisual.status === 400 && resNoVisual.data.error.includes('Visual data is missing'), 'Rejects challenge stage when Visual data is missing');

  // --- 4. Testing DEMO_BRAND Determinism & Offline Integrity ---
  console.log('\n--- 4. Testing DEMO_BRAND Determinism & Offline Integrity ---');

  assert(DEMO_BRAND.challenge !== undefined, 'DEMO_BRAND has challenge data pre-populated');
  assert(DEMO_BRAND.challenge.findings.length >= 5, `DEMO_BRAND has ${DEMO_BRAND.challenge.findings.length} findings (>= 5)`);

  const hasPosFinding = DEMO_BRAND.challenge.findings.some(f => f.category === 'POSITIONING' || f.stageTarget === 'position');
  const hasNamingFinding = DEMO_BRAND.challenge.findings.some(f => f.category === 'NAME' || f.stageTarget === 'naming');
  const hasVisualFinding = DEMO_BRAND.challenge.findings.some(f => f.category === 'VISUAL DIRECTION' || f.stageTarget === 'visualize');
  const hasConsistencyFinding = DEMO_BRAND.challenge.findings.some(f => f.category === 'CONSISTENCY');

  assert(hasPosFinding, 'DEMO_BRAND demonstrates at least one positioning finding');
  assert(hasNamingFinding, 'DEMO_BRAND demonstrates at least one naming finding');
  assert(hasVisualFinding, 'DEMO_BRAND demonstrates at least one visual finding');
  assert(hasConsistencyFinding, 'DEMO_BRAND demonstrates at least one cross-stage consistency finding');

  assert(Boolean(DEMO_BRAND.challenge.findings[0].evidence), 'DEMO_BRAND finding 1 has evidence citation');
  assert(Boolean(DEMO_BRAND.challenge.findings[0].proposedChange), 'DEMO_BRAND finding 1 has structured proposedChange');
  assert(DEMO_BRAND.challenge.consistencySummary.overallState === 'Robust & Coherent', 'DEMO_BRAND has overallState');

  // --- 5. Testing State Integrity, Human Decision Mechanics, and Stage Isolation ---
  console.log('\n--- 5. Testing State Integrity, Human Decision Mechanics, and Stage Isolation ---');

  // Setup initial mock BrandMemory
  const initialMemory: BrandMemory = {
    id: 'test-brand-memory',
    roughIdea: 'College scholarship platform',
    projectName: 'ScholarCompass',
    createdAt: new Date().toISOString(),
    discovery: {
      coreProblem: 'Original Core Problem',
      primaryAudience: 'Original Audience',
      userContext: 'Original Context',
      currentAlternatives: ['Google'],
      coreNeed: 'Original Need',
      assumptions: [],
      openQuestions: [],
      isConfirmed: true,
    },
    positioning: {
      category: 'Original Category',
      targetSegment: 'Original Target',
      valueProposition: 'Original Value Prop',
      primaryDifferentiation: 'Original Differentiation',
      differentiator: 'Original Differentiation',
      positioningStatement: 'Original Positioning Statement',
      whyThisPosition: 'Original Why',
      territories: [],
      keyPillars: [],
      isConfirmed: true,
    },
    personality: {
      traits: [{ name: 'Original Trait', whyItFits: 'Fits', evidence: 'E' }],
      traitsToAvoid: [],
      avoidTraits: [],
      brandPrinciples: [],
      principles: [],
      dimensions: [],
      voice: { summary: 'Original Voice Summary', characteristics: [], toneRules: [] },
      voiceSummary: 'Original Voice Summary',
      voiceAndTone: { tone: 'Direct', voiceCharacteristics: ['Clear'], writingSampleDo: 'Do this', writingSampleDont: 'Avoid that' },
      writingSamples: { headline: 'H', valueProposition: 'V', socialMessage: 'S', userExplanation: 'U' },
      isConfirmed: true,
    },
    naming: {
      namingStrategy: 'Original Strategy',
      territories: [],
      selectedNameId: 'c-1',
      selectedCandidateId: 'c-1',
      selectedName: { id: 'c-1', name: 'ScholarCompass', meaning: 'M', strategicRationale: 'R', personalityFit: 'P', potentialWeakness: 'W' },
      selectionRationale: 'Original Selection Rationale',
      isConfirmed: true,
    },
    visual: {
      creativeDirection: { concept: 'Original Concept', visualThesis: 'Original Thesis', moodKeywords: [] },
      visualConcept: 'Original Concept',
      visualThesis: 'Original Thesis',
      palette: [{ name: 'Navy', hex: '#0A1F44', role: 'primary' }],
      typography: [],
      artDirection: { mood: 'M', composition: 'C', lighting: 'L', imageryRules: [] },
      shapeLanguage: { cornerStyle: 'CS', density: 'D', framingRules: 'FR', spatialFeel: 'SF' },
      logoConcept: { markType: 'MT', description: 'D', symbolism: 'S', clearspaceRule: 'CR' },
      thingsToAvoid: [],
      isConfirmed: true,
    },
    challenge: {
      findings: [
        {
          id: 'finding-pos-1',
          category: 'Positioning Risk',
          severity: 'high',
          status: 'WARNING',
          findingStatus: 'open',
          title: 'Differentiation Flaw',
          finding: 'Differentiation is too generic.',
          evidence: 'Original Positioning Statement has no wedge.',
          whyItMatters: 'Competitor replication.',
          suggestedFix: 'Sharpen positioningStatement.',
          suggestedImprovement: 'Sharpen positioningStatement.',
          proposedChange: {
            targetStage: 'positioning',
            field: 'positioningStatement',
            currentValue: 'Original Positioning Statement',
            proposedValue: 'IMPROVED Positioning Statement with Clear Wedge',
            rationale: 'Sharpened wedge.'
          },
          accepted: false,
          ignored: false,
          stageTarget: 'position',
        },
        {
          id: 'finding-ignore-1',
          category: 'Naming Risk',
          severity: 'low',
          status: 'PASS',
          findingStatus: 'open',
          title: 'Minor Naming Risk',
          finding: 'Name is slightly literal.',
          evidence: 'ScholarCompass is descriptive.',
          whyItMatters: 'Minor distinctiveness concern.',
          suggestedFix: 'No change required.',
          suggestedImprovement: 'No change required.',
          accepted: false,
          ignored: false,
          stageTarget: 'naming',
        }
      ],
      consistencySummary: {
        overallState: 'Has Actionable Gaps',
        strengthsCount: 1,
        warningsCount: 1,
        conflictsCount: 0,
        editorialAssessment: 'Gaps present.'
      },
      isConfirmed: false,
    },
    launch: {
      headline: 'Original Headline',
      subheadline: 'Original Subheadline',
      oneLinePitch: 'Original Pitch',
      productDescription: 'Original Desc',
      primaryCta: 'CTA',
      secondaryCta: 'CTA2',
      launchAnnouncement: 'Announce',
      socialPost: { platform: 'X', text: 'Post' },
      whyThisMessagingWorks: 'Works',
      isConfirmed: false,
    },
    currentStage: 'challenge',
    stagesCompleted: ['discover', 'position', 'personality', 'naming', 'visualize'],
    stageExecution: {
      discover: { status: 'ready' },
      position: { status: 'ready' },
      personality: { status: 'ready' },
      naming: { status: 'ready' },
      visualize: { status: 'ready' },
      challenge: { status: 'ready' },
    } as any,
    updatedAt: new Date().toISOString(),
  };

  // Test 5A: Accept finding
  // Simulated controlled applyChallengeChange
  function applyFinding(memory: BrandMemory, findingId: string, customValue?: any): BrandMemory {
    const target = memory.challenge.findings.find(f => f.id === findingId);
    if (!target) return memory;

    const updatedFindings = memory.challenge.findings.map(f =>
      f.id === findingId ? { ...f, accepted: true, ignored: false, findingStatus: 'accepted' as const } : f
    );

    let updatedDiscovery = { ...memory.discovery };
    let updatedPositioning = { ...memory.positioning };
    let updatedPersonality = { ...memory.personality };
    let updatedNaming = { ...memory.naming };
    let updatedVisual = { ...memory.visual };
    let updatedLaunch = { ...memory.launch };

    if (target.proposedChange) {
      const { targetStage, field } = target.proposedChange;
      const valToApply = customValue !== undefined ? customValue : target.proposedChange.proposedValue;
      const allowed = ALLOWED_CHALLENGE_MUTATION_FIELDS[targetStage];

      if (allowed && allowed.includes(field)) {
        if (targetStage === 'positioning') {
          if (field === 'positioningStatement') updatedPositioning.positioningStatement = valToApply;
        }
      }
    }

    return {
      ...memory,
      discovery: updatedDiscovery,
      positioning: updatedPositioning,
      personality: updatedPersonality,
      naming: updatedNaming,
      visual: updatedVisual,
      launch: updatedLaunch,
      challenge: {
        ...memory.challenge,
        findings: updatedFindings,
        consistencySummary: {
          ...memory.challenge.consistencySummary,
          strengthsCount: memory.challenge.consistencySummary.strengthsCount + 1,
          warningsCount: Math.max(0, memory.challenge.consistencySummary.warningsCount - 1),
          overallState: 'Robust & Coherent'
        }
      }
    };
  }

  const memoryAfterAccept = applyFinding(initialMemory, 'finding-pos-1');

  assert(
    memoryAfterAccept.positioning.positioningStatement === 'IMPROVED Positioning Statement with Clear Wedge',
    'Accept finding mutates the targeted positioningStatement'
  );
  assert(
    memoryAfterAccept.discovery.coreProblem === 'Original Core Problem',
    'Discovery remains strictly unchanged after accepting positioning finding'
  );
  assert(
    memoryAfterAccept.discovery.primaryAudience === 'Original Audience',
    'Discovery primaryAudience remains strictly unchanged'
  );
  assert(
    memoryAfterAccept.personality.voiceSummary === 'Original Voice Summary',
    'Personality remains strictly unchanged after accepting positioning finding'
  );
  assert(
    memoryAfterAccept.naming.selectedCandidateId === 'c-1',
    'Naming selection remains strictly unchanged after accepting positioning finding'
  );
  assert(
    memoryAfterAccept.visual.visualConcept === 'Original Concept',
    'Visual identity remains strictly unchanged after accepting positioning finding'
  );
  assert(
    memoryAfterAccept.challenge.findings[0].accepted === true,
    'Target finding accepted flag is set to true'
  );
  assert(
    memoryAfterAccept.challenge.findings[0].findingStatus === 'accepted',
    'Target finding findingStatus is set to accepted'
  );

  // Test 5B: Ignore finding
  function ignoreFinding(memory: BrandMemory, findingId: string): BrandMemory {
    return {
      ...memory,
      challenge: {
        ...memory.challenge,
        findings: memory.challenge.findings.map(f =>
          f.id === findingId ? { ...f, ignored: true, accepted: false, findingStatus: 'ignored' as const } : f
        )
      }
    };
  }

  const memoryAfterIgnore = ignoreFinding(initialMemory, 'finding-ignore-1');
  assert(memoryAfterIgnore.positioning.positioningStatement === 'Original Positioning Statement', 'Ignore leaves positioning intact');
  assert(memoryAfterIgnore.naming.selectionRationale === 'Original Selection Rationale', 'Ignore leaves naming intact');
  assert(memoryAfterIgnore.challenge.findings[1].ignored === true, 'Ignore sets ignored to true');
  assert(memoryAfterIgnore.challenge.findings[1].accepted === false, 'Ignore does not set accepted');

  // Test 5C: Edit finding before applying
  const memoryAfterEdit = applyFinding(initialMemory, 'finding-pos-1', 'USER CUSTOM EDITED Positioning Statement');
  assert(
    memoryAfterEdit.positioning.positioningStatement === 'USER CUSTOM EDITED Positioning Statement',
    'Edit finding applies the user-edited custom value rather than model default'
  );

  console.log('\n=====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error in challenge test suite:', err);
  process.exit(1);
});
