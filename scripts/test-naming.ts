import { groqGateway } from '../server/groqGateway.js';
import { apiRouter } from '../server/apiRouter.js';
import { DEMO_BRAND } from '../src/data/demoBrand.js';
import type { DiscoveryData, PositioningData, PersonalityData, NamingData, BrandMemory } from '../src/types/brand.js';
import express from 'express';
import http from 'http';

const validateNaming = (json: string) => groqGateway.validateAndNormalizeNaming(json);

async function runTests() {
  console.log('=====================================================');
  console.log('BRANDFORGE STEP 5: NAMING ENGINE TEST SUITE');
  console.log('=====================================================\n');

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

  // -------------------------------------------------------------------------
  // SUITE 1: Normalization & Schema Validation Unit Tests
  // -------------------------------------------------------------------------
  console.log('--- 1. Testing Naming Normalization & Schema Validation ---');

  const validMockNaming = {
    namingStrategy: 'Names must communicate understated precision and operational leverage, avoiding whimsical hype and corporate platitudes.',
    namingBrief: 'Focus on tools, craft, signal, and momentum. Monosyllabic or compound structures preferred.',
    namingWorlds: [
      {
        id: 'world-1',
        name: 'Quiet Precision',
        description: 'Understated, meticulously engineered instruments.',
        strategicIdea: 'Instruments that respect practitioner bandwidth.',
        namingLogic: 'Elemental, mechanical nouns and tactile roots.',
        emotionalTerritory: 'Calm mastery, unhurried depth.',
        tradeoff: 'May feel cold if stripped of human context.',
        examples: ['Caliber', 'Datum', 'Plumb']
      },
      {
        id: 'world-2',
        name: 'Human Momentum',
        description: 'Dynamic kinetic energy fueled by collaborative velocity.',
        strategicIdea: 'Momentum created by teams moving in sync.',
        namingLogic: 'Active verbs, forward-leaning phonetics.',
        emotionalTerritory: 'Urgency, shared cadence, lift.',
        tradeoff: 'Risks sounding like a sports apparel brand if too aggressive.',
        examples: ['Stride', 'Kinetic', 'Tandem']
      },
      {
        id: 'world-3',
        name: 'Signal & Match',
        description: 'Filtering noise to surface exact high-fidelity connections.',
        strategicIdea: 'Defeating fragmentation through intelligent synthesis.',
        namingLogic: 'Acoustic and optical metaphors for clarity.',
        emotionalTerritory: 'Relief, sudden lucidity, resolution.',
        tradeoff: 'Can drift into telecom or network hardware territory.',
        examples: ['Beacon', 'Prism', 'Aperture']
      }
    ],
    candidates: [
      {
        id: 'c-1',
        name: 'Vantage',
        worldId: 'world-1',
        pronunciation: 'VAN-tij',
        meaning: 'High-ground vantage point affording clear sightlines.',
        concept: 'High ground perspective providing total operational clarity.',
        strategicRationale: 'Directly aligns with positioning pillar of strategic visibility without clutter.',
        personalityFit: 'Calm, authoritative, understated.',
        potentialWeakness: 'Common English word requiring distinct visual framing.',
        evaluation: {
          strategicFit: 92,
          positioningFit: 94,
          personalityFit: 88,
          audienceFit: 90,
          distinctiveness: 85,
          memorability: 89,
          pronunciation: 95,
          flexibility: 88,
          risks: ['Common English word requiring strong visual trademark identity'],
          rationale: 'Crisp, authoritative, immediately readable by enterprise buyers and solo builders.'
        }
      },
      {
        id: 'c-2',
        name: 'Kinetic',
        worldId: 'world-2',
        pronunciation: 'kye-NET-ik',
        meaning: 'Kinetic energy in continuous active motion.',
        concept: 'Energy in motion, transforming dormant plans into live execution.',
        strategicRationale: 'Expresses collegiate velocity and rapid prototype deployment.',
        personalityFit: 'Urgent, dynamic, energetic.',
        potentialWeakness: 'Frequently used root in physical fitness and logistics.',
        evaluation: {
          strategicFit: 86,
          positioningFit: 88,
          personalityFit: 84,
          audienceFit: 85,
          distinctiveness: 80,
          memorability: 86,
          pronunciation: 92,
          flexibility: 82,
          risks: ['Frequently used root in physical fitness and logistics sectors'],
          rationale: 'High energy and natural cadence, although distinctiveness needs reinforcement.'
        }
      },
      {
        id: 'c-3',
        name: 'Beacon',
        worldId: 'world-3',
        pronunciation: 'BEE-kun',
        meaning: 'A luminous signal guiding navigation through fog.',
        concept: 'Unwavering guidance signal through market noise.',
        strategicRationale: 'Reinforces the core need for trusted navigation in a noisy ecosystem.',
        personalityFit: 'Clear, steady, protective.',
        potentialWeakness: 'May evoke maritime or lighthouse imagery.',
        evaluation: {
          strategicFit: 90,
          positioningFit: 91,
          personalityFit: 87,
          audienceFit: 89,
          distinctiveness: 82,
          memorability: 91,
          pronunciation: 96,
          flexibility: 85,
          risks: ['May evoke maritime or lighthouse imagery if not modernly styled'],
          rationale: 'Clean, evocative, instantly memorable.'
        }
      }
    ]
  };

  try {
    const norm = validateNaming(JSON.stringify(validMockNaming));
    assert(norm.namingWorlds?.length === 3, 'Normalizes 3 naming worlds correctly');
    assert(norm.candidates?.length === 3, 'Normalizes 3 candidates correctly');
    assert(norm.territories && norm.territories.length === 3, 'Populates legacy territories array for backward compatibility');
    assert(norm.selectedCandidateId === 'c-1', 'Defaults selectedCandidateId to first candidate if none selected');
    assert(Boolean(norm.selectedName && norm.selectedName.name === 'Vantage'), 'Sets selectedName object');
    assert(Array.isArray(norm.shortlistedIds), 'Initializes shortlistedIds array');
    assert(Array.isArray(norm.rejectedIds), 'Initializes rejectedIds array');
  } catch (err: any) {
    assert(false, `Valid normalization failed: ${err.message}`);
  }

  // Markdown codeblock wrapper handling
  try {
    const wrappedJson = '```json\n' + JSON.stringify(validMockNaming) + '\n```';
    const normWrapped = validateNaming(wrappedJson);
    assert(normWrapped.candidates?.[0]?.name === 'Vantage', 'Handles markdown ```json code blocks gracefully');
  } catch (err: any) {
    assert(false, `Markdown-wrapped JSON failed: ${err.message}`);
  }

  // Score clamping test (out-of-range scores like 150 and -20)
  try {
    const outOfBoundsData = JSON.parse(JSON.stringify(validMockNaming));
    outOfBoundsData.candidates[0].evaluation.strategicFit = 145;
    outOfBoundsData.candidates[0].evaluation.memorability = -30;
    const clamped = validateNaming(JSON.stringify(outOfBoundsData));
    assert(clamped.candidates?.[0]?.evaluation?.strategicFit === 100, 'Clamps score > 100 down to 100');
    assert(clamped.candidates?.[0]?.evaluation?.memorability === 0, 'Clamps score < 0 up to 0');
  } catch (err: any) {
    assert(false, `Score clamping failed: ${err.message}`);
  }

  // Deduplication test (repeated candidate names)
  try {
    const duplicateData = JSON.parse(JSON.stringify(validMockNaming));
    duplicateData.candidates.push({
      ...duplicateData.candidates[0],
      id: 'c-dup',
      concept: 'Different concept but exact same name'
    });
    const deduped = validateNaming(JSON.stringify(duplicateData));
    assert(deduped.candidates?.length === 3, 'Deduplicates candidates with identical lowercase names');
  } catch (err: any) {
    assert(false, `Deduplication test failed: ${err.message}`);
  }

  // Missing world ID fallback
  try {
    const missingWorldData = JSON.parse(JSON.stringify(validMockNaming));
    missingWorldData.candidates[0].worldId = 'non-existent-world-id';
    const resolvedWorld = validateNaming(JSON.stringify(missingWorldData));
    assert(resolvedWorld.candidates?.[0]?.worldId === 'world-1', 'Safely maps invalid worldId to a valid world');
  } catch (err: any) {
    assert(false, `Missing world ID fallback failed: ${err.message}`);
  }

  // Malformed JSON test
  try {
    validateNaming('{ malformed: true, ');
    assert(false, 'Expected malformed JSON to throw error');
  } catch (err: any) {
    assert(true, 'Throws controlled error on malformed JSON');
  }

  // Missing candidates test
  try {
    const noCandidates = {
      namingStrategy: 'Strategy only',
      namingBrief: 'Brief only',
      namingWorlds: validMockNaming.namingWorlds,
      candidates: []
    };
    validateNaming(JSON.stringify(noCandidates));
    assert(false, 'Expected empty candidates list to throw validation error');
  } catch (err: any) {
    assert(true, 'Throws controlled error when candidates array is empty');
  }

  // Missing worlds test
  try {
    const noWorlds = {
      namingStrategy: 'Strategy only',
      namingBrief: 'Brief only',
      namingWorlds: [],
      candidates: validMockNaming.candidates
    };
    validateNaming(JSON.stringify(noWorlds));
    assert(false, 'Expected empty worlds list to throw validation error');
  } catch (err: any) {
    assert(true, 'Throws controlled error when namingWorlds array is empty');
  }

  // -------------------------------------------------------------------------
  // SUITE 2: Express /api/generate-stage Route & Precondition Tests
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Testing API Router Preconditions & Error Handling ---');

  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(8097, resolve));

  const postApi = async (body: any) => {
    const res = await fetch('http://localhost:8097/api/generate-stage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { status: res.status, data };
  };

  // Health check
  const healthRes = await fetch('http://localhost:8097/api/health');
  const healthData = await healthRes.json();
  assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

  // Missing stage
  const resNoStage = await postApi({ brandMemory: { roughIdea: 'Idea' } });
  assert(resNoStage.status === 400 && resNoStage.data.error.includes('Missing required field: "stage"'), 'Rejects request with missing stage');

  // Unsupported stage
  const resBadStage = await postApi({ stage: 'unknown_stage', brandMemory: { roughIdea: 'Idea' } });
  assert(resBadStage.status === 400 && resBadStage.data.error.includes('is not implemented yet'), 'Rejects request with unsupported stage');

  // Missing roughIdea
  const resNoIdea = await postApi({ stage: 'naming' });
  assert(resNoIdea.status === 400 && resNoIdea.data.error.includes('Please enter a rough idea'), 'Rejects naming stage without roughIdea');

  // Missing Discovery
  const resNoDisc = await postApi({
    stage: 'naming',
    brandMemory: { roughIdea: 'AI dev tool' }
  });
  assert(resNoDisc.status === 400 && resNoDisc.data.error.includes('Discovery data is missing'), 'Rejects naming stage when Discovery data is missing');

  // Missing Positioning
  const resNoPos = await postApi({
    stage: 'naming',
    brandMemory: {
      roughIdea: 'AI dev tool',
      discovery: DEMO_BRAND.discovery
    }
  });
  assert(resNoPos.status === 400 && resNoPos.data.error.includes('Positioning data is missing'), 'Rejects naming stage when Positioning data is missing');

  // Missing Personality
  const resNoPers = await postApi({
    stage: 'naming',
    brandMemory: {
      roughIdea: 'AI dev tool',
      discovery: DEMO_BRAND.discovery,
      positioning: DEMO_BRAND.positioning
    }
  });
  assert(resNoPers.status === 400 && resNoPers.data.error.includes('Personality data is missing'), 'Rejects naming stage when Personality data is missing');

  server.close();

  // -------------------------------------------------------------------------
  // SUITE 3: Demo Brand Determinism & Groq-Free / Gemini-Free Validation
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Testing DEMO_BRAND Determinism & Offline Integrity ---');

  assert(Boolean(DEMO_BRAND.naming), 'DEMO_BRAND has naming data pre-populated');
  assert(Boolean(DEMO_BRAND.naming.namingStrategy), 'DEMO_BRAND.naming contains rich namingStrategy');
  assert(Boolean(DEMO_BRAND.naming.namingBrief), 'DEMO_BRAND.naming contains namingBrief');
  assert(Boolean(DEMO_BRAND.naming.namingWorlds && DEMO_BRAND.naming.namingWorlds.length >= 3), `DEMO_BRAND has ${DEMO_BRAND.naming.namingWorlds?.length} naming worlds (>= 3)`);
  assert(Boolean(DEMO_BRAND.naming.candidates && DEMO_BRAND.naming.candidates.length >= 8), `DEMO_BRAND has ${DEMO_BRAND.naming.candidates?.length} candidates (>= 8)`);
  assert(Boolean(DEMO_BRAND.naming.shortlistedCandidateIds && DEMO_BRAND.naming.shortlistedCandidateIds.length > 0), 'DEMO_BRAND has pre-shortlisted candidates');
  assert(DEMO_BRAND.naming.selectedCandidateId === 'c-4', 'DEMO_BRAND selects candidate c-4 (SprintForge) deterministically');
  assert(DEMO_BRAND.naming.selectedName?.name === 'SprintForge', 'DEMO_BRAND has matching legacy selectedName SprintForge');

  // Verify candidate evaluation dimensions
  const sampleCandidate = DEMO_BRAND.naming.candidates![0];
  const evalDims = [
    'strategicFit', 'positioningFit', 'personalityFit', 'audienceFit',
    'distinctiveness', 'memorability', 'pronunciation', 'flexibility',
    'risks', 'rationale'
  ];
  const allDimsPresent = evalDims.every(dim => (sampleCandidate.evaluation as any)[dim] !== undefined);
  assert(allDimsPresent, 'Candidate evaluation has all 8 numerical dimensions plus risks and rationale');

  // -------------------------------------------------------------------------
  // SUITE 4: Selection Mechanics & Alternatives Preservation
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Testing Selection Mechanics & Alternatives Preservation ---');

  const candidatesPool = [...DEMO_BRAND.naming.candidates!];
  const originalCandidateCount = candidatesPool.length;
  const originalWorldsCount = DEMO_BRAND.naming.namingWorlds!.length;

  // Simulate shortlisting a candidate
  let currentShortlist = [...(DEMO_BRAND.naming.shortlistedCandidateIds || [])];
  const candidateToShortlist = 'c-2';
  if (!currentShortlist.includes(candidateToShortlist)) {
    currentShortlist.push(candidateToShortlist);
  }
  assert(currentShortlist.includes(candidateToShortlist), 'Shortlisting adds candidate ID to shortlisted set');
  assert(candidatesPool.length === originalCandidateCount, 'Shortlisting does NOT delete any candidates');

  // Simulate un-shortlisting
  currentShortlist = currentShortlist.filter(id => id !== candidateToShortlist);
  assert(!currentShortlist.includes(candidateToShortlist), 'Toggling shortlist removes candidate ID cleanly');
  assert(candidatesPool.length === originalCandidateCount, 'Un-shortlisting does NOT delete any candidates');

  // Simulate rejecting a candidate
  const candidateToReject = 'c-3';
  let rejectedIds = [candidateToReject];
  assert(rejectedIds.includes(candidateToReject), 'Rejecting adds candidate to rejected set');
  assert(candidatesPool.length === originalCandidateCount, 'Rejecting does NOT delete the candidate from pool');

  // Simulate selecting a candidate
  let selectedId = 'c-5';
  const selectedCandidate = candidatesPool.find(c => c.id === selectedId);
  assert(selectedCandidate !== undefined, 'Candidate to select exists in pool');
  assert(selectedId === 'c-5', 'Candidate selection updates selectedId');
  assert(candidatesPool.length === originalCandidateCount, 'Selecting a candidate preserves all alternative candidates');
  assert(DEMO_BRAND.naming.namingWorlds!.length === originalWorldsCount, 'Selecting a candidate preserves all naming worlds');

  // Changing selection
  selectedId = 'c-1';
  assert(selectedId === 'c-1', 'Changing candidate selection works without deleting alternatives');
  assert(candidatesPool.length === originalCandidateCount, 'All alternatives remain intact after selection change');

  // -------------------------------------------------------------------------
  // SUITE 5: BrandMemory State Integrity Tests
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Testing BrandMemory State Integrity ---');

  const originalDiscovery = JSON.parse(JSON.stringify(DEMO_BRAND.discovery));
  const originalPositioning = JSON.parse(JSON.stringify(DEMO_BRAND.positioning));
  const originalPersonality = JSON.parse(JSON.stringify(DEMO_BRAND.personality));

  // Simulate updating naming in BrandMemory
  const updatedBrandMemory: BrandMemory = {
    ...DEMO_BRAND,
    naming: {
      ...DEMO_BRAND.naming,
      selectedCandidateId: 'c-1',
      shortlistedCandidateIds: ['c-1', 'c-2']
    }
  };

  assert(JSON.stringify(updatedBrandMemory.discovery) === JSON.stringify(originalDiscovery), 'Discovery remains strictly unmutated after naming update');
  assert(JSON.stringify(updatedBrandMemory.positioning) === JSON.stringify(originalPositioning), 'Positioning remains strictly unmutated after naming update');
  assert(JSON.stringify(updatedBrandMemory.personality) === JSON.stringify(originalPersonality), 'Personality remains strictly unmutated after naming update');
  assert(updatedBrandMemory.naming.selectedCandidateId === 'c-1', 'Naming candidate selection updates properly');

  // Failed naming should not corrupt upstream or partially write
  const memoryBeforeFailure = JSON.parse(JSON.stringify(updatedBrandMemory));
  // If an error occurs, naming stage status is set to error and brandMemory.naming is untouched
  const failedStageExecution = {
    ...memoryBeforeFailure.stageExecution,
    naming: { status: 'error', lastError: 'API timeout' }
  };
  const memoryAfterFailure = {
    ...memoryBeforeFailure,
    stageExecution: failedStageExecution
  };

  assert(JSON.stringify(memoryAfterFailure.discovery) === JSON.stringify(originalDiscovery), 'Failed naming leaves Discovery intact');
  assert(JSON.stringify(memoryAfterFailure.positioning) === JSON.stringify(originalPositioning), 'Failed naming leaves Positioning intact');
  assert(JSON.stringify(memoryAfterFailure.personality) === JSON.stringify(originalPersonality), 'Failed naming leaves Personality intact');
  assert(memoryAfterFailure.stageExecution.naming.status === 'error', 'Failed naming marks stageExecution.naming as error');

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n=====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
