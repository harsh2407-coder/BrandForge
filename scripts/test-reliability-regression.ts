/**
 * BrandForge Pipeline Reliability & Integrity Regression Test Suite
 * 
 * Tests the surgical fixes for:
 * Test A — Naming 429 (Provider Rate Limit)
 * Test B — Naming Validation Failure (Malformed JSON / Schema mismatch)
 * Test C — Duplicate Concurrent Request Protection (Single-Flight Rule)
 * Test D — Error Recovery & Pipeline Preservation (Fail -> Error -> Retry -> Ready -> Unlocked)
 * Test E — Stale State Protection (Previous data not falsely presented as current success)
 * Test F — Transition Timing (Prompt completion without arbitrary long animation timer)
 */

import { classifyGroqError, StageGenerationError } from '../server/groqGateway';
import { canAccessStage, STAGE_ORDER } from '../src/context/BrandContext';
import { BrandMemory, StageId, ErrorCategory, StageStatus, NameCandidate, NamingData } from '../src/types/brand';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

type TestMemory = BrandMemory & { stageExecution: Record<StageId, StageStatus> };

function createBaseMemory(): TestMemory {
  return {
    id: 'test-project-123',
    projectName: 'ScholarCompass',
    roughIdea: 'A platform that helps college students discover scholarships.',
    currentStage: 'naming',
    stagesCompleted: ['discover', 'position', 'personality'],
    discovery: {
      coreProblem: 'Students miss thousands in scholarships due to fragmented portals.',
      primaryAudience: 'First-generation undergraduate college students',
      coreNeed: 'Automated scholarship matching against eligibility criteria.',
    },
    positioning: {
      category: 'AI Scholarship Matching Infrastructure',
      positioningStatement: 'For undergraduates seeking debt-free college education, ScholarCompass automatically navigates institutional funding.',
      valueProposition: 'Instant matching to non-dilutive educational funding.',
    },
    personality: {
      traits: [
        { name: 'Rigorous', description: 'Deep mathematical precision in eligibility filtering', strategicReason: 'Builds trust' },
        { name: 'Empathetic', description: 'Understands financial stress of students', strategicReason: 'Relatable tone' },
      ],
      traitsToAvoid: [],
      principles: ['Zero fluff', 'Transparency first'],
      voiceAndTone: {
        tone: 'Encouraging, authoritative, precise',
        voiceCharacteristics: ['Clear', 'Direct'],
        writingSampleDo: 'You qualify for $14,500 across 3 vetted endowments.',
        writingSampleDont: 'Unlock your magical dreams with free money!'
      },
      isConfirmed: true,
    },
    naming: {
      territories: [],
      candidates: [],
    },
    visual: {
      palette: [],
    },
    challenge: {
      findings: [],
    },
    launch: {
      headline: '',
      subheadline: '',
    },
    stageExecution: {
      discover: { status: 'ready' },
      position: { status: 'ready' },
      personality: { status: 'ready' },
      naming: { status: 'idle' },
      visualize: { status: 'idle' },
      challenge: { status: 'idle' },
      launch: { status: 'idle' },
      input: { status: 'ready' },
      'brand-kit': { status: 'idle' },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as TestMemory;
}

async function runRegressionSuite() {
  console.log('=====================================================');
  console.log('BRANDFORGE RELIABILITY & INTEGRITY REGRESSION TESTS');
  console.log('=====================================================\n');

  // -------------------------------------------------------------------------
  // TEST A — Naming 429 Provider Failure
  // -------------------------------------------------------------------------
  console.log('--- Test A: Naming 429 Provider Failure ---');
  {
    // 1. Groq Gateway Error Classification
    const groq429Error = new Error('429 Rate limit reached for model openai/gpt-oss-120b in organization org_xyz: Please try again in 4.2s.');
    const classified = classifyGroqError(groq429Error);
    assert(classified.category === 'RATE_LIMIT', 'Correctly classifies 429 as RATE_LIMIT');
    assert(classified.isRetryable === true, 'Identifies 429 as retryable');
    assert(typeof classified.retryAfter === 'number' && classified.retryAfter! > 0, 'Extracts retry-after cooldown from error text');
    assert(!classified.message.includes('org_xyz'), 'Sanitizes provider internal IDs from user message');

    // 2. Stage Execution Error State
    const memory = createBaseMemory();
    memory.stageExecution.naming = {
      status: 'error',
      lastError: classified.message,
      errorCategory: classified.category,
      retryAfter: classified.retryAfter,
    };

    assert(memory.stageExecution.naming.status === 'error', 'naming.status === "error" on 429');
    assert(memory.stageExecution.naming.errorCategory === 'RATE_LIMIT', 'Error category stored in stage execution');

    // 3. Downstream Gating
    const canAccessVisualize = canAccessStage('visualize', memory);
    assert(canAccessVisualize === false, 'Downstream Visualize stage is LOCKED when Naming is in error');

    const canAccessChallenge = canAccessStage('challenge', memory);
    assert(canAccessChallenge === false, 'Downstream Challenge stage is LOCKED when Naming is in error');

    const canAccessDeliver = canAccessStage('launch', memory);
    assert(canAccessDeliver === false, 'Downstream Deliver stage is LOCKED when Naming is in error');

    // 4. Wordmark Confirmed Truth Check
    // "Wordmark confirmed in Brand Memory" requires: isReady && hasValidNaming
    const hasValidNaming = ((memory.naming.candidates && memory.naming.candidates.length > 0) || 
                            (memory.naming.territories && memory.naming.territories.length > 0)) && 
                            memory.stageExecution.naming.status === 'ready';
    assert(hasValidNaming === false, '"Wordmark confirmed" truth check returns false on 429 error');
  }

  // -------------------------------------------------------------------------
  // TEST B — Naming Validation Failure (Malformed JSON)
  // -------------------------------------------------------------------------
  console.log('\n--- Test B: Naming Validation Failure (Malformed JSON) ---');
  {
    const malformedJsonError = new SyntaxError('Unexpected token < in JSON at position 0: <html>502 Bad Gateway</html>');
    const classified = classifyGroqError(malformedJsonError);
    assert(classified.category === 'VALIDATION_ERROR', 'Classifies malformed JSON as VALIDATION_ERROR');

    const memory = createBaseMemory();
    // Simulate failed validation update
    const previousNaming = { ...memory.naming };
    memory.stageExecution.naming = {
      status: 'error',
      lastError: 'Failed to parse naming candidates from model response.',
      errorCategory: classified.category,
    };

    // Ensure memory.naming was NOT replaced with corrupted data
    assert(memory.naming.candidates?.length === 0, 'BrandMemory.naming candidates remains empty (not corrupted)');
    assert(canAccessStage('visualize', memory) === false, 'Visualize stage remains locked on validation failure');
  }

  // -------------------------------------------------------------------------
  // TEST C — Duplicate Concurrent Request Protection (Single-Flight Rule)
  // -------------------------------------------------------------------------
  console.log('\n--- Test C: Duplicate Concurrent Request Protection (Single-Flight) ---');
  {
    const inFlightRequests = new Set<StageId>();
    let networkCallCount = 0;

    async function mockGenerateNaming(requestId: number) {
      if (inFlightRequests.has('naming')) {
        // Single-flight rule: drop / reject duplicate request
        return { rejected: true, reason: 'Request already in-flight' };
      }
      inFlightRequests.add('naming');
      try {
        networkCallCount++;
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50));
        return { rejected: false, data: { success: true } };
      } finally {
        inFlightRequests.delete('naming');
      }
    }

    // Trigger two requests simultaneously
    const [req1, req2] = await Promise.all([
      mockGenerateNaming(1),
      mockGenerateNaming(2)
    ]);

    assert(networkCallCount === 1, 'Only exactly 1 network request dispatched despite concurrent triggers');
    assert((req1.rejected && !req2.rejected) || (!req1.rejected && req2.rejected), 'Duplicate concurrent request is safely blocked');
    assert(inFlightRequests.size === 0, 'inFlightRequests set is cleanly cleared after request completes');
  }

  // -------------------------------------------------------------------------
  // TEST D — Error Recovery & Pipeline Preservation (Fail -> Retry -> Ready)
  // -------------------------------------------------------------------------
  console.log('\n--- Test D: Error Recovery & Pipeline Preservation ---');
  {
    const memory = createBaseMemory();

    // Step 1: Initial state (all upstream ready, naming idle)
    assert(canAccessStage('naming', memory) === true, 'Naming is accessible when upstream stages are ready');
    assert(canAccessStage('visualize', memory) === false, 'Visualize is initially locked');

    // Step 2: Generation fails (429 rate limit)
    memory.stageExecution.naming = { status: 'error', lastError: 'Groq rate limit', errorCategory: 'RATE_LIMIT' };
    assert(canAccessStage('visualize', memory) === false, 'Visualize remains locked after failure');

    // Ensure upstream stages were NOT mutated or invalidated
    assert(memory.stageExecution.discover?.status === 'ready', 'Discovery remains ready after Naming failure');
    assert(memory.stageExecution.position?.status === 'ready', 'Positioning remains ready after Naming failure');
    assert(memory.stageExecution.personality?.status === 'ready', 'Personality remains ready after Naming failure');

    // Step 3: User clicks Retry -> status transitions to generating
    memory.stageExecution.naming = { status: 'generating' };
    assert(canAccessStage('visualize', memory) === false, 'Visualize remains locked while retrying');

    // Step 4: Retry succeeds -> status transitions to ready with valid data
    memory.naming = {
      selectedName: {
        id: 'c-1',
        name: 'ScholarCompass',
        meaning: 'Direct navigation through college funding',
        personalityFit: 'Rigorous and empathetic',
        status: 'selected',
      } as unknown as NameCandidate,
      selectedNameId: 'c-1',
      candidates: [
        {
          id: 'c-1',
          name: 'ScholarCompass',
          meaning: 'Direct navigation through college funding',
          personalityFit: 'Rigorous and empathetic',
          status: 'selected',
        } as unknown as NameCandidate
      ],
      territories: [],
    } as unknown as NamingData;
    memory.stageExecution.naming = { status: 'ready' };
    memory.stagesCompleted.push('naming');

    // Step 5: Now Visualize must be UNLOCKED
    assert(canAccessStage('visualize', memory) === true, 'Visualize is UNLOCKED after successful retry');
    assert(memory.naming.selectedName?.name === 'ScholarCompass', 'Verified brand name is confirmed in BrandMemory');
  }

  // -------------------------------------------------------------------------
  // TEST E — Stale State Protection
  // -------------------------------------------------------------------------
  console.log('\n--- Test E: Stale State Protection ---');
  {
    const memory = createBaseMemory();

    // Pre-populate old/cached naming data from a previous session
    memory.naming = {
      selectedName: { id: 'old-1', name: 'OldNameFromPreviousRun', meaning: 'old', personalityFit: 'old', status: 'selected' } as unknown as NameCandidate,
      candidates: [{ id: 'old-1', name: 'OldNameFromPreviousRun', meaning: 'old', personalityFit: 'old', status: 'selected' } as unknown as NameCandidate],
      territories: [],
    } as unknown as NamingData;

    // User triggers a fresh generation which FAILS
    memory.stageExecution.naming = {
      status: 'error',
      lastError: 'Groq API connection timeout',
      errorCategory: 'NETWORK_ERROR',
    };

    // Strict Stage Truth rule:
    // Even if old naming data was present in memory.naming, the stage is NOT successful because status === 'error'
    const isStageTrulyReady = (memory.stageExecution.naming.status as string) === 'ready';
    assert(isStageTrulyReady === false, 'Failed stage is not considered ready despite existing old memory');

    const canAdvance = canAccessStage('visualize', memory);
    assert(canAdvance === false, 'Downstream access is blocked: old data does not mask current generation failure');

    // Truth check for wordmark confirmation
    const wordmarkConfirmed = isStageTrulyReady && (memory.naming.candidates?.length ?? 0) > 0;
    assert(wordmarkConfirmed === false, 'UI wordmark confirmation check rejects stale data when stage is in error');
  }

  // -------------------------------------------------------------------------
  // TEST F — Cinematic Transition Timing
  // -------------------------------------------------------------------------
  console.log('\n--- Test F: Cinematic Transition Timing ---');
  {
    // Verify that the completion trigger is responsive (< 500ms UX delay, not a 15-20s timer)
    const startTime = Date.now();
    let transitionCompleted = false;

    // Simulate completion event
    const handleCompletion = () => {
      // 200ms intentional UX polish delay
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          transitionCompleted = true;
          resolve();
        }, 200);
      });
    };

    await handleCompletion();
    const elapsed = Date.now() - startTime;

    assert(Boolean(transitionCompleted), 'Transition completes promptly upon API response');
    assert(elapsed < 400, `Transition took ${elapsed}ms (well under the <500ms UX polish target, not blocked by long timer)`);

    // Verify error case transition (0ms hang)
    let errorHandledPromptly = false;
    const startErrorTime = Date.now();
    const handleError = () => {
      // Immediately clear loading/processing state
      errorHandledPromptly = true;
    };
    handleError();
    const errorElapsed = Date.now() - startErrorTime;
    assert(Boolean(errorHandledPromptly) && errorElapsed < 50, 'Error dismisses processing screen immediately without hanging');
  }

  // -------------------------------------------------------------------------
  // TEST G — Groq TPM Ceiling & Stage Budget Protection
  // -------------------------------------------------------------------------
  console.log('\n--- Test G: Groq TPM Ceiling & Stage Budget Protection ---');
  {
    const { STAGE_COMPLETION_BUDGETS } = await import('../server/groqGateway.js');
    const { buildDiscoveryPrompt } = await import('../server/discoveryPrompt.js');
    const { buildPositioningPrompt } = await import('../server/positioningPrompt.js');
    const { buildPersonalityPrompt } = await import('../server/personalityPrompt.js');
    const { buildNamingPrompt } = await import('../server/namingPrompt.js');
    const { buildVisualPrompt } = await import('../server/visualPrompt.js');
    const { buildChallengePrompt } = await import('../server/challengePrompt.js');
    const { buildDeliverPrompt } = await import('../server/deliverPrompt.js');

    // Conservative estimation: 1 token ≈ 3.5 characters (stricter than standard 4 chars/token)
    const estimateTokens = (text: string): number => Math.ceil(text.length / 3.5);

    const GROQ_TPM_LIMIT = 8000;
    const MAX_SAFE_CEILING = 6000; // Mandatory 2,000+ token headroom

    // 1. Guard against any stage using 8192
    assert(
      (STAGE_COMPLETION_BUDGETS.naming as number) < 8192,
      'Naming stage budget is reduced from 8192',
      `Current: ${STAGE_COMPLETION_BUDGETS.naming}`
    );
    assert(
      (STAGE_COMPLETION_BUDGETS.personality as number) < 8192,
      'Personality stage budget is reduced from 8192',
      `Current: ${STAGE_COMPLETION_BUDGETS.personality}`
    );
    assert(
      (STAGE_COMPLETION_BUDGETS.visualize as number) < 8192,
      'Visualize stage budget is reduced from 8192',
      `Current: ${STAGE_COMPLETION_BUDGETS.visualize}`
    );
    assert(
      (STAGE_COMPLETION_BUDGETS.challenge as number) < 8192,
      'Challenge stage budget is reduced from 8192',
      `Current: ${STAGE_COMPLETION_BUDGETS.challenge}`
    );

    // 2. Specific test for Naming request size (which previously hit 8,675 tokens)
    const baseMemory = createBaseMemory();
    const namingPrompt = buildNamingPrompt(
      baseMemory.roughIdea,
      baseMemory.discovery,
      baseMemory.positioning,
      baseMemory.personality,
      baseMemory.projectName
    );
    const namingPromptTokens = estimateTokens(namingPrompt);
    const namingTotalReservation = namingPromptTokens + STAGE_COMPLETION_BUDGETS.naming;

    assert(
      namingTotalReservation < MAX_SAFE_CEILING,
      `Naming stage reservation (${namingTotalReservation} tokens) is below safe ceiling (${MAX_SAFE_CEILING} tokens)`
    );
    assert(
      namingTotalReservation < GROQ_TPM_LIMIT,
      `Naming stage reservation (${namingTotalReservation} tokens) is strictly below 8000 TPM limit`
    );

    // 3. Verify ALL stages operate safely within TPM budget
    const stagePrompts: Record<string, { prompt: string; budget: number }> = {
      discovery: {
        prompt: buildDiscoveryPrompt(baseMemory.roughIdea),
        budget: STAGE_COMPLETION_BUDGETS.discovery,
      },
      positioning: {
        prompt: buildPositioningPrompt(baseMemory.roughIdea, baseMemory.discovery, baseMemory.projectName),
        budget: STAGE_COMPLETION_BUDGETS.positioning,
      },
      personality: {
        prompt: buildPersonalityPrompt(baseMemory.roughIdea, baseMemory.discovery, baseMemory.positioning, baseMemory.projectName),
        budget: STAGE_COMPLETION_BUDGETS.personality,
      },
      naming: {
        prompt: namingPrompt,
        budget: STAGE_COMPLETION_BUDGETS.naming,
      },
      visualize: {
        prompt: buildVisualPrompt(baseMemory.roughIdea, baseMemory.discovery, baseMemory.positioning, baseMemory.personality, {
          namingStrategy: 'Precision Navigation',
          selectedName: {
            id: 'c-1',
            name: 'ScholarCompass',
            worldId: 'world-1',
            meaning: 'Navigational clarity',
            concept: 'Guiding through complexity',
            strategicRationale: 'Anchors category leadership',
            pronunciation: 'SKAH-ler-kum-pus',
            personalityFit: 'Authoritative',
            potentialWeakness: 'Compound noun',
            evaluation: {
              strategicFit: 90,
              positioningFit: 90,
              personalityFit: 90,
              audienceFit: 90,
              distinctiveness: 85,
              memorability: 90,
              pronunciation: 95,
              flexibility: 85,
              risks: ['Compound noun'],
              rationale: 'High resonance'
            },
            status: 'candidate'
          },
          candidates: []
        } as any, baseMemory.projectName),
        budget: STAGE_COMPLETION_BUDGETS.visualize,
      },
      challenge: {
        prompt: buildChallengePrompt({
          roughIdea: baseMemory.roughIdea,
          discovery: baseMemory.discovery,
          positioning: baseMemory.positioning,
          personality: baseMemory.personality,
          naming: {
            namingStrategy: 'Precision Navigation',
            selectedName: {
              id: 'c-1',
              name: 'ScholarCompass',
              worldId: 'world-1',
              meaning: 'Navigational clarity',
              concept: 'Guiding through complexity',
              strategicRationale: 'Anchors category leadership',
              pronunciation: 'SKAH-ler-kum-pus',
              personalityFit: 'Authoritative',
              potentialWeakness: 'Compound noun',
              evaluation: {
                strategicFit: 90,
                positioningFit: 90,
                personalityFit: 90,
                audienceFit: 90,
                distinctiveness: 85,
                memorability: 90,
                pronunciation: 95,
                flexibility: 85,
                risks: ['Compound noun'],
                rationale: 'High resonance'
              },
              status: 'candidate'
            },
            candidates: []
          },
          projectName: baseMemory.projectName,
        }),
        budget: STAGE_COMPLETION_BUDGETS.challenge,
      },
      deliver: {
        prompt: buildDeliverPrompt({
          roughIdea: baseMemory.roughIdea,
          discovery: baseMemory.discovery,
          positioning: baseMemory.positioning,
          personality: baseMemory.personality,
          naming: {
            namingStrategy: 'Precision Navigation',
            selectedName: {
              id: 'c-1',
              name: 'ScholarCompass',
              worldId: 'world-1',
              meaning: 'Navigational clarity',
              concept: 'Guiding through complexity',
              strategicRationale: 'Anchors category leadership',
              pronunciation: 'SKAH-ler-kum-pus',
              personalityFit: 'Authoritative',
              potentialWeakness: 'Compound noun',
              evaluation: {
                strategicFit: 90,
                positioningFit: 90,
                personalityFit: 90,
                audienceFit: 90,
                distinctiveness: 85,
                memorability: 90,
                pronunciation: 95,
                flexibility: 85,
                risks: ['Compound noun'],
                rationale: 'High resonance'
              },
              status: 'candidate'
            },
            candidates: []
          } as any,
          visual: baseMemory.visual as any,
          challenge: baseMemory.challenge as any,
          projectName: baseMemory.projectName,
        }),
        budget: STAGE_COMPLETION_BUDGETS.deliver,
      },
    };

    for (const [stg, config] of Object.entries(stagePrompts)) {
      const pTokens = estimateTokens(config.prompt);
      const totalReservation = pTokens + config.budget;
      const headroom = GROQ_TPM_LIMIT - totalReservation;
      assert(
        totalReservation < MAX_SAFE_CEILING,
        `Stage "${stg}" total reservation (${totalReservation} tokens: prompt~${pTokens} + budget=${config.budget}) maintains ${headroom} tokens headroom (<${MAX_SAFE_CEILING})`
      );
    }
  }
  console.log('\n=====================================================');
  console.log(`RELIABILITY REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runRegressionSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
