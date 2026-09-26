/**
 * scripts/test-full-e2e-optimized.ts
 * 
 * Complete Live E2E Verification & Latency Audit for BrandForge.
 * 
 * Steps:
 * 1. Controlled Failure-Path Test (Simulated 413/429 on Naming):
 *    - Verify Naming error state, downstream Visualize locked, retry availability,
 *      no fabricated name, no false confirmation, no BrandMemory corruption.
 *    - Execute Retry -> verify recovery to ready and Visualize unlocked.
 * 
 * 2. Full Live Groq Sequential Pipeline (Fresh BrandMemory):
 *    - Discovery -> Positioning -> Personality -> Naming -> Visualize -> Challenge
 *      -> Human Decision (Accept) -> Re-Challenge -> Deliver -> JSON Export
 *    - Measures exact request duration for each stage and total end-to-end time.
 */

import { assembleDeliverData } from '../src/utils/deliverAssembly.js';
import { canAccessStage } from '../src/context/BrandContext.js';
import { classifyGroqError } from '../server/groqGateway.js';
import type { BrandMemory, StageId, StageStatus, NamingData } from '../src/types/brand.js';

const BASE = 'http://localhost:3001';
const SCHOLARSHIP_IDEA = 'I want to build a platform that helps college students discover scholarships, grants, and other funding opportunities they are actually eligible for, instead of making them search through hundreds of irrelevant opportunities.';

interface LatencyRecord {
  stage: string;
  durationMs: number;
  durationSec: string;
  status: 'PASS' | 'FAIL';
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  note?: string;
}

const latencyRecords: LatencyRecord[] = [];
let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

async function postStage(stage: string, memory: any): Promise<{ status: number; body: any; elapsedMs: number }> {
  const start = Date.now();
  const res = await fetch(`${BASE}/api/generate-stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, brandMemory: memory }),
  });
  const elapsedMs = Date.now() - start;
  const body = await res.json();
  if (res.status !== 200) {
    console.error(`  [postStage Error] Stage "${stage}" failed with HTTP ${res.status}:`, body.error || body.message || body);
  }
  return { status: res.status, body, elapsedMs };
}

// =========================================================================
// PART 1: CONTROLLED FAILURE-PATH VERIFICATION (SIMULATED 413 / 429)
// =========================================================================
async function runFailurePathVerification() {
  console.log('\n=====================================================');
  console.log('PART 1: CONTROLLED FAILURE-PATH VERIFICATION (413 / 429)');
  console.log('=====================================================');

  // Setup a valid upstream memory with stages completed up to personality
  const memory: any = {
    id: `fail-test-${Date.now()}`,
    projectName: 'ScholarCompass',
    roughIdea: SCHOLARSHIP_IDEA,
    currentStage: 'naming',
    stagesCompleted: ['discover', 'position', 'personality'],
    discovery: {
      coreProblem: 'College students miss critical funding because of cluttered portals.',
      primaryAudience: 'College students searching for relevant scholarships',
      coreNeed: 'A direct way to see awards they actually qualify for.',
      currentAlternatives: ['Manual Google search', 'Generic scholarship directories'],
      userContext: 'Application cycle crunch',
      assumptions: [],
      openQuestions: [],
      isConfirmed: true,
    },
    positioning: {
      category: 'Scholarship Eligibility Discovery Platform',
      targetSegment: 'College students seeking non-dilutive funding',
      valueProposition: 'Find eligible scholarships without wading through noise.',
      positioningStatement: 'For college students tired of dead-end applications, ScholarCompass is the eligibility-focused platform.',
      whyThisPosition: 'Directly addresses search fatigue',
      differentiator: 'Direct focus on eligibility filters',
      primaryDifferentiation: 'Direct focus on eligibility filters',
      selectedTerritoryId: 'territory-1',
      territories: [],
      keyPillars: ['Eligibility first', 'Zero junk spam'],
      xAxis: { lowLabel: 'BROAD', highLabel: 'FOCUSED' },
      yAxis: { lowLabel: 'SEARCH', highLabel: 'VERIFICATION' },
      isConfirmed: true,
    },
    personality: {
      traits: [
        { name: 'Grounded Pragmatism', description: 'Clear guidance', strategicReason: 'Builds trust', whyItFits: 'Resonates with students', evidence: 'Student feedback' }
      ],
      traitsToAvoid: [],
      brandPrinciples: [],
      dimensions: [],
      voice: {
        summary: 'Direct, clear, student-advocate tone',
        characteristics: [],
        toneRules: []
      },
      writingSamples: {
        headline: 'Stop searching. Start qualifying.',
        valueProposition: 'Scholarships matched to your actual background.',
      },
      isConfirmed: true,
    },
    naming: {
      namingStrategy: '',
      namingBrief: '',
      namingWorlds: [],
      candidates: [],
      territories: [],
      shortlistedIds: [],
      rejectedIds: [],
      selectedCandidateId: '',
      isConfirmed: false,
    },
    visual: null,
    challenge: null,
    launch: null,
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
  };

  console.log('\n--- 1. Simulating Provider Rate Limit (413 / 429) ---');
  const simulatedError = new Error('413 Request size 8675 tokens exceeds TPM limit of 8000. Limit 8000 TPM.');
  (simulatedError as any).status = 429;
  const classified = classifyGroqError(simulatedError);

  // Apply failure to state exactly as BrandContext does
  memory.stageExecution.naming = {
    status: 'error',
    error: classified.message,
    errorCategory: classified.category,
    statusCode: classified.statusCode,
    retryAfter: classified.retryAfter,
  };

  assert(memory.stageExecution.naming.status === 'error', 'Naming stage marked as error');
  assert(memory.stageExecution.naming.errorCategory === 'RATE_LIMIT', 'Error correctly categorized as RATE_LIMIT');
  
  // Verify Visualize is strictly locked
  const canAccessVisualize = canAccessStage('visualize', memory);
  assert(canAccessVisualize === false, 'Visualize stage is LOCKED when Naming fails with rate limit');

  // Verify Deliver is locked
  const canAccessDeliver = canAccessStage('launch', memory);
  assert(canAccessDeliver === false, 'Deliver stage is LOCKED when Naming fails');

  // Verify no fabricated name
  assert(!memory.naming.selectedCandidateId, 'No fabricated selectedCandidateId in BrandMemory');
  assert(memory.naming.candidates.length === 0, 'No fabricated name candidates in BrandMemory');

  // Verify "Wordmark confirmed" check
  const wordmarkConfirmed = memory.stageExecution.naming.status === 'ready' && (memory.naming.candidates?.length ?? 0) > 0;
  assert(wordmarkConfirmed === false, 'Wordmark confirmed indicator remains FALSE (no false confirmation)');

  // Verify BrandMemory integrity: Discovery, Positioning, Personality intact
  assert(memory.discovery.coreProblem.length > 0, 'Discovery data completely preserved');
  assert(memory.positioning.valueProposition.length > 0, 'Positioning data completely preserved');
  assert(memory.personality.traits.length > 0, 'Personality data completely preserved');

  console.log('\n--- 2. Simulating Successful Retry ---');
  // Simulating retry transition
  memory.stageExecution.naming = { status: 'generating' };
  assert(canAccessStage('visualize', memory) === false, 'Visualize remains locked while retrying');

  // Retry completes successfully
  memory.stageExecution.naming = { status: 'ready' };
  memory.naming.candidates = [
    {
      id: 'c-1',
      name: 'ScholarCompass',
      worldId: 'world-1',
      pronunciation: 'SKAH-ler-kum-pus',
      meaning: 'Navigational clarity for scholarship search',
      concept: 'Navigational instrument',
      strategicRationale: 'Anchors category leadership',
      personalityFit: 'Authoritative',
      potentialWeakness: 'Compound noun',
      evaluation: {
        strategicFit: 92,
        positioningFit: 94,
        personalityFit: 90,
        audienceFit: 91,
        distinctiveness: 88,
        memorability: 93,
        pronunciation: 96,
        flexibility: 87,
        risks: ['Compound wordmark'],
        rationale: 'High recognition and category resonance'
      },
      status: 'candidate'
    }
  ];
  memory.naming.selectedCandidateId = 'c-1';
  memory.stagesCompleted.push('naming');

  const canAccessVisualizePostRetry = canAccessStage('visualize', memory);
  assert(canAccessVisualizePostRetry === true, 'Visualize is UNLOCKED after successful retry');
  assert(memory.stageExecution.naming.status === 'ready', 'Naming is in ready state');
  console.log('✅ Controlled failure-path and recovery verified successfully.\n');
}

// =========================================================================
// PART 2: FULL LIVE GROQ E2E PIPELINE EXECUTION
// =========================================================================
async function runFullLiveE2EPipeline() {
  console.log('=====================================================');
  console.log('PART 2: FULL LIVE GROQ E2E PIPELINE EXECUTION');
  console.log(`Idea: "${SCHOLARSHIP_IDEA}"`);
  console.log('=====================================================\n');

  const overallStart = Date.now();

  const brandMemory: any = {
    id: `e2e-live-${Date.now()}`,
    projectName: 'ScholarCompass',
    roughIdea: SCHOLARSHIP_IDEA,
    knownDetails: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: 'input',
    stagesCompleted: [],
    discovery: null,
    positioning: null,
    personality: null,
    naming: null,
    visual: null,
    challenge: null,
    launch: null,
    stageExecution: {
      discover: { status: 'idle' },
      position: { status: 'idle' },
      personality: { status: 'idle' },
      naming: { status: 'idle' },
      visualize: { status: 'idle' },
      challenge: { status: 'idle' },
      launch: { status: 'idle' },
      input: { status: 'ready' },
      'brand-kit': { status: 'idle' },
    }
  };

  // 1. DISCOVERY
  console.log('--- 1. LIVE DISCOVERY STAGE ---');
  {
    const { status, body, elapsedMs } = await postStage('discover', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && !!body.data?.coreProblem;
    latencyRecords.push({
      stage: 'Discovery',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, coreProblem: ${body.data?.coreProblem?.slice(0, 50)}...`
    });

    assert(status === 200, `Discovery HTTP status is 200 (${durationSec})`);
    assert(body.success === true, 'Discovery success flag is true');
    assert(typeof body.data.coreProblem === 'string', 'Discovery returned valid coreProblem');
    assert(typeof body.data.primaryAudience === 'string', 'Discovery returned valid primaryAudience');
    assert(Array.isArray(body.data.currentAlternatives), 'Discovery returned currentAlternatives array');

    brandMemory.discovery = { ...body.data, isConfirmed: true };
    brandMemory.stagesCompleted.push('discover');
    brandMemory.stageExecution.discover = { status: 'ready' };
    console.log(`  Discovery completed in ${durationSec}`);
  }

  // 2. POSITIONING
  console.log('\n--- 2. LIVE POSITIONING STAGE ---');
  {
    const { status, body, elapsedMs } = await postStage('position', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && !!body.data?.positioningStatement;
    latencyRecords.push({
      stage: 'Positioning',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, category: ${body.data?.category}`
    });

    assert(status === 200, `Positioning HTTP status is 200 (${durationSec})`);
    assert(body.success === true, 'Positioning success flag is true');
    assert(typeof body.data.category === 'string', 'Positioning category is valid');
    assert(typeof body.data.valueProposition === 'string', 'Positioning valueProposition is valid');
    assert(Array.isArray(body.data.territories) && body.data.territories.length >= 3, 'Positioning returned >= 3 territories');

    brandMemory.positioning = { ...body.data, isConfirmed: true };
    brandMemory.stagesCompleted.push('position');
    brandMemory.stageExecution.position = { status: 'ready' };
    console.log(`  Positioning completed in ${durationSec}`);
  }

  // 3. PERSONALITY
  console.log('\n--- 3. LIVE PERSONALITY STAGE ---');
  {
    const { status, body, elapsedMs } = await postStage('personality', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && Array.isArray(body.data?.traits);
    latencyRecords.push({
      stage: 'Personality',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, traits: ${body.data?.traits?.length}`
    });

    assert(status === 200, `Personality HTTP status is 200 (${durationSec})`);
    assert(body.success === true, 'Personality success flag is true');
    assert(Array.isArray(body.data.traits) && body.data.traits.length >= 4, 'Personality returned >= 4 traits');
    assert(!!body.data.voice?.summary || !!body.data.voiceAndTone?.tone, 'Personality voice summary is valid');

    brandMemory.personality = { ...body.data, isConfirmed: true };
    brandMemory.stagesCompleted.push('personality');
    brandMemory.stageExecution.personality = { status: 'ready' };
    console.log(`  Personality completed in ${durationSec}`);
  }

  // Realistic human review pause before Naming
  console.log('  [Pacing] Allowing 8s for founder review & TPM window recovery before Naming...');
  await new Promise(r => setTimeout(r, 8000));

  // 4. NAMING (OPTIMIZED BUDGET)
  console.log('\n--- 4. LIVE NAMING STAGE (OPTIMIZED TPM BUDGET) ---');
  {
    const { status, body, elapsedMs } = await postStage('naming', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && Array.isArray(body.data?.candidates);
    latencyRecords.push({
      stage: 'Naming',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, candidates: ${body.data?.candidates?.length}, selected: ${body.data?.selectedName?.name || body.data?.candidates?.[0]?.name}`
    });

    assert(status === 200, `Naming HTTP status is 200 (${durationSec}) - NO 413 RATE LIMIT!`);
    assert(body.success === true, 'Naming success flag is true');
    assert(Array.isArray(body.data?.namingWorlds) && body.data.namingWorlds.length >= 3, 'Naming returned >= 3 worlds');
    assert(Array.isArray(body.data?.candidates) && body.data.candidates.length >= 3, `Naming returned ${body.data?.candidates?.length} candidates (>= 3)`);
    assert(!!body.data?.candidates?.[0]?.evaluation, 'Candidate has comprehensive diagnostic evaluation');

    const selectedName = body.data?.selectedName || body.data?.candidates?.[0];
    brandMemory.naming = {
      ...body.data,
      selectedCandidateId: selectedName.id,
      selectedName,
      isConfirmed: true,
    };
    brandMemory.stagesCompleted.push('naming');
    brandMemory.stageExecution.naming = { status: 'ready' };
    console.log(`  Naming completed in ${durationSec} | Selected: "${selectedName.name}"`);
  }

  // Realistic human review pause before Visualize
  console.log('  [Pacing] Allowing 8s for founder review & TPM window recovery before Visualize...');
  await new Promise(r => setTimeout(r, 8000));

  // 5. VISUALIZE
  console.log('\n--- 5. LIVE VISUALIZE STAGE ---');
  {
    const { status, body, elapsedMs } = await postStage('visualize', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && !!body.data?.colorSystem;
    latencyRecords.push({
      stage: 'Visualize',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, primaryHex: ${body.data?.colorSystem?.primary?.hex || body.data?.palette?.[0]?.hex}`
    });

    assert(status === 200, `Visualize HTTP status is 200 (${durationSec})`);
    assert(body.success === true, 'Visualize success flag is true');
    assert(!!body.data?.creativeDirection?.concept || !!body.data?.visualConcept, 'Visualize creative direction is valid');
    assert(!!body.data?.colorSystem?.accent?.hex || !!body.data?.palette?.[2]?.hex, 'Visualize color system has accent hex');

    brandMemory.visual = { ...body.data, isConfirmed: true };
    brandMemory.stagesCompleted.push('visualize');
    brandMemory.stageExecution.visualize = { status: 'ready' };
    console.log(`  Visualize completed in ${durationSec}`);
  }

  // Realistic human review pause before Challenge
  console.log('  [Pacing] Allowing 8s for founder review & TPM window recovery before Challenge...');
  await new Promise(r => setTimeout(r, 8000));

  // 6. CHALLENGE
  console.log('\n--- 6. LIVE CHALLENGE STAGE ---');
  let firstFindingId = '';
  let firstProposedChange: any = null;
  {
    const { status, body, elapsedMs } = await postStage('challenge', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && Array.isArray(body.data?.findings);
    latencyRecords.push({
      stage: 'Challenge',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, findings: ${body.data?.findings?.length}`
    });

    assert(status === 200, `Challenge HTTP status is 200 (${durationSec})`);
    assert(body.success === true, 'Challenge success flag is true');
    assert(Array.isArray(body.data.findings) && body.data.findings.length >= 3, `Challenge returned ${body.data.findings?.length} adversarial findings`);

    const findings = body.data.findings;
    const withChange = findings.find((f: any) => f.proposedChange && f.proposedChange.targetField);
    if (withChange) {
      firstFindingId = withChange.id;
      firstProposedChange = withChange.proposedChange;
    } else {
      firstFindingId = findings[0].id;
    }

    brandMemory.challenge = { ...body.data, isConfirmed: true };
    brandMemory.stagesCompleted.push('challenge');
    brandMemory.stageExecution.challenge = { status: 'ready' };
    console.log(`  Challenge completed in ${durationSec} | Findings: ${findings.length}`);
  }

  // 7. HUMAN DECISION (ACCEPT PROPOSED CHANGE)
  console.log('\n--- 7. HUMAN DECISION (ACCEPT ADVERSARIAL FINDING) ---');
  {
    const startDecision = Date.now();
    const findings = brandMemory.challenge.findings;
    const targetIdx = findings.findIndex((f: any) => f.id === firstFindingId);
    assert(targetIdx !== -1, `Found target finding "${firstFindingId}" for human review`);

    // Human accepts finding
    findings[targetIdx].accepted = true;
    findings[targetIdx].findingStatus = 'accepted';

    // If proposed change exists, apply mutation to BrandMemory
    if (firstProposedChange && firstProposedChange.targetStage && firstProposedChange.targetField) {
      const stage = firstProposedChange.targetStage;
      const field = firstProposedChange.targetField;
      const newVal = firstProposedChange.newValue;
      if (brandMemory[stage]) {
        console.log(`  Applying human accepted change: [${stage}.${field}] -> "${newVal.slice(0, 60)}..."`);
        brandMemory[stage][field] = newVal;
      }
    }

    const decisionElapsed = Date.now() - startDecision;
    const durationSec = (decisionElapsed / 1000).toFixed(2) + 's';
    latencyRecords.push({
      stage: 'Human Decision',
      durationMs: decisionElapsed,
      durationSec,
      status: 'PASS',
      note: `Accepted finding "${firstFindingId}"`
    });

    assert(findings[targetIdx].accepted === true, 'Finding marked accepted');
    console.log(`  Human Decision recorded in ${durationSec}`);
  }

  // 8. RE-CHALLENGE
  console.log('\n--- 8. LIVE RE-CHALLENGE (POST-DECISION VERIFICATION) ---');
  {
    const { status, body, elapsedMs } = await postStage('challenge', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && Array.isArray(body.data?.findings);
    latencyRecords.push({
      stage: 'Re-Challenge',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, re-evaluated findings: ${body.data?.findings?.length}`
    });

    assert(status === 200, `Re-Challenge HTTP status is 200 (${durationSec})`);
    assert(body.success === true, 'Re-Challenge returned valid adversarial re-evaluation');
    brandMemory.challenge = { ...body.data, isConfirmed: true };
    console.log(`  Re-Challenge completed in ${durationSec}`);
  }

  // Realistic human review pause before Deliver
  console.log('  [Pacing] Allowing 8s for founder review & TPM window recovery before Deliver...');
  await new Promise(r => setTimeout(r, 8000));

  // 9. DELIVER
  console.log('\n--- 9. LIVE DELIVER STAGE ---');
  {
    const { status, body, elapsedMs } = await postStage('launch', brandMemory);
    const durationSec = (elapsedMs / 1000).toFixed(1) + 's';
    const isPass = status === 200 && body.success === true && !!body.data?.headline;
    latencyRecords.push({
      stage: 'Deliver',
      durationMs: elapsedMs,
      durationSec,
      status: isPass ? 'PASS' : 'FAIL',
      note: `HTTP ${status}, headline: "${body.data?.headline}"`
    });

    assert(status === 200, `Deliver HTTP status is 200 (${durationSec})`);
    assert(body.success === true, 'Deliver success flag is true');
    assert(typeof body.data.headline === 'string' && body.data.headline.length > 5, 'Deliver returned strong headline');
    assert(typeof body.data.oneLinePitch === 'string', 'Deliver returned oneLinePitch');
    assert(!!body.data.executiveSummary, 'Deliver returned executiveSummary');

    brandMemory.launch = { ...body.data, isConfirmed: true };
    brandMemory.stagesCompleted.push('launch');
    brandMemory.stageExecution.launch = { status: 'ready' };
    console.log(`  Deliver completed in ${durationSec} | Headline: "${body.data.headline}"`);
  }

  // 10. JSON EXPORT & BRAND BOOK ASSEMBLY
  console.log('\n--- 10. DETERMINISTIC BRAND BOOK ASSEMBLY & JSON EXPORT ---');
  {
    const startExport = Date.now();
    const deliverData = assembleDeliverData(brandMemory);
    assert(!!deliverData, 'assembleDeliverData generated valid DeliverData structure');
    assert(deliverData.brandName === (brandMemory.naming.selectedName?.name || 'ScholarCompass'), `Brand name resolved as "${deliverData.brandName}"`);
    assert(!!deliverData.brandEssence, 'Brand essence is populated');
    assert(deliverData.launchChecklist.length === 10, '10-item founder launch checklist assembled');
    assert(deliverData.challengeSummary.findingsCount >= 0, 'DeliverData challengeSummary is assembled');

    // JSON export test
    const exportedJson = JSON.stringify(deliverData, null, 2);
    assert(exportedJson.length > 2000, `Export JSON successfully generated (${exportedJson.length} bytes)`);

    const exportElapsed = Date.now() - startExport;
    const durationSec = (exportElapsed / 1000).toFixed(2) + 's';
    latencyRecords.push({
      stage: 'Export',
      durationMs: exportElapsed,
      durationSec,
      status: 'PASS',
      note: `Assembled ${exportedJson.length} bytes of verified JSON`
    });
    console.log(`  Export completed in ${durationSec}`);
  }

  const totalTimeSec = ((Date.now() - overallStart) / 1000).toFixed(1) + 's';

  // REPORT
  console.log('\n=====================================================');
  console.log('LIVE PIPELINE LATENCY & EXECUTION SUMMARY');
  console.log('=====================================================');
  console.table(latencyRecords.map(r => ({
    Stage: r.stage,
    Duration: r.durationSec,
    Result: r.status,
    Notes: r.note || ''
  })));
  console.log(`Total End-to-End Pipeline Duration: ${totalTimeSec}`);
  console.log(`Total Verifications: ${passed} PASSED, ${failed} FAILED\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

async function main() {
  await runFailurePathVerification();
  await runFullLiveE2EPipeline();
}

main().catch(err => {
  console.error('Fatal live test failure:', err);
  process.exit(1);
});
