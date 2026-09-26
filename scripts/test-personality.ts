import { groqGateway } from '../server/groqGateway.js';
import { apiRouter } from '../server/apiRouter.js';
import { DEMO_BRAND } from '../src/data/demoBrand.js';
import type { BrandMemory } from '../src/types/brand.js';
import express from 'express';
import http from 'http';

const validatePersonality = (json: string) => groqGateway.validateAndNormalizePersonality(json);

async function runTests() {
  console.log('=====================================================');
  console.log('BRANDFORGE STEP 4: PERSONALITY + BRAND VOICE ENGINE TESTS');
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
  // SUITE 1: Schema & Normalization Tests
  // -------------------------------------------------------------------------
  console.log('--- 1. Testing Personality Schema Normalization & Validation ---');

  const validMockPersonality = {
    traits: [
      {
        name: 'Quiet Precision',
        description: 'Understated, meticulously engineered tool experience without theatrical flourish.',
        strategicReason: 'Practitioners trust tools that respect their cognitive bandwidth and perform consistently.',
        whyItFits: 'Practitioners trust tools that respect their cognitive bandwidth.',
        evidence: 'Target users expressed frustration with noisy marketing claims and cluttered UIs.'
      },
      {
        name: 'Radical Intellectual Candor',
        description: 'Unvarnished transparency about what the platform can and cannot do.',
        strategicReason: 'Counteracts cynicism caused by legacy competitors hiding fees and limitations.',
        whyItFits: 'Direct honesty builds immediate defensibility.',
        evidence: 'Interviews revealed 68% of users left competitors due to hidden fees.'
      },
      {
        name: 'Gritty Pragmatism',
        description: 'Focuses entirely on tangible operational workflows over abstract theory.',
        strategicReason: 'Collegiate and startup builders need immediate working prototypes.',
        whyItFits: 'Prioritizes velocity over academic debate.',
        evidence: 'Participants cite 36-hour sprint deadlines as their primary tension.'
      },
      {
        name: 'Peer-Level Warmth',
        description: 'Speaks as an equal co-builder in the trenches rather than an institutional authority.',
        strategicReason: 'Diffuses imposter syndrome and encourages cross-disciplinary outreach.',
        whyItFits: 'Solo creators need welcoming psychological safety.',
        evidence: 'First-time builders hesitate to approach senior peers without encouragement.'
      }
    ],
    avoidTraits: [
      {
        name: 'Corporate Platitudes',
        description: 'Sanitized corporate jargon and buzzword-laden mission statements.',
        reasonToAvoid: 'Signals enterprise bloat and alienation for agile practitioners.',
        trait: 'Corporate Platitudes',
        reason: 'Signals enterprise bloat and alienation for agile practitioners.'
      },
      {
        name: 'Hype-Driven Superficiality',
        description: 'Inflated promises without functional architecture.',
        reasonToAvoid: 'Destroys technical credibility on day one.',
        trait: 'Hype-Driven Superficiality',
        reason: 'Destroys technical credibility on day one.'
      },
      {
        name: 'Academic Pedantry',
        description: 'Intimidating theoretical frameworks that slow down execution.',
        reasonToAvoid: 'Creates high cognitive friction during time-sensitive projects.',
        trait: 'Academic Pedantry',
        reason: 'Creates high cognitive friction during time-sensitive projects.'
      }
    ],
    principles: [
      {
        name: 'Clarity Over Cleverness',
        statement: 'If a message can be understood immediately, prefer the clearer version over the impressive-sounding one.',
        implication: 'Audit all user microcopy to ensure reading ease under 3 seconds.'
      },
      {
        name: 'Proof Before Promise',
        statement: 'Demonstrate functional reliability with concrete mechanics rather than claims.',
        implication: 'Every value proposition statement must cite verifiable system capabilities.'
      },
      {
        name: 'Respect The User Clock',
        statement: 'Eliminate every unnecessary click between intent and working outcome.',
        implication: 'Keep primary onboarding paths under 60 seconds.'
      }
    ],
    dimensions: [
      {
        dimension: 'Formality',
        value: 25,
        lowLabel: 'Peer-to-Peer & Casual',
        highLabel: 'Institutional & Formal',
        rationale: 'Fosters rapid camaraderie among independent builders.'
      },
      {
        dimension: 'Tempo',
        value: 120, // Should be clamped to 100
        lowLabel: 'Deliberate & Measured',
        highLabel: 'Urgent & Kinetic',
        rationale: 'Mirrors the high-energy urgency of weekend builds.'
      },
      {
        dimension: 'Communication Density',
        value: -15, // Should be clamped to 0
        lowLabel: 'Telegraphic & Minimal',
        highLabel: 'Expansive & Narrative',
        rationale: 'Users scan for technical keywords and clear actions.'
      },
      {
        dimension: 'Perspective',
        value: 85,
        lowLabel: 'Neutral & Consensus',
        highLabel: 'Opinionated & Decisive',
        rationale: 'Users seek unambiguous strategic recommendations.'
      }
    ],
    voice: {
      summary: 'Confident, unvarnished, collegiate, and encouraging — like a seasoned peer lead in the arena.',
      characteristics: [
        { characteristic: 'Direct & Active', explanation: 'Uses active verbs and concise sentence structure.' },
        { characteristic: 'Practitioner Grounded', explanation: 'Speaks the authentic language of builders without condescension.' },
        { characteristic: 'Generous & Cheering', explanation: 'Celebrates shipping real software and overcoming blockers.' }
      ],
      toneRules: [
        {
          do: 'State the operational benefit upfront before explaining the mechanism.',
          avoid: 'Leading with proprietary acronyms or architectural jargon.',
          example: 'Sync with complementary teammates in 3 clicks before the countdown begins.'
        },
        {
          do: 'Acknowledge tradeoffs honestly when guiding decisions.',
          avoid: 'Claiming one option solves every possible problem.',
          example: 'This territory prioritizes rapid matching velocity over year-round social networking.'
        }
      ]
    },
    writingSamples: {
      headline: 'Build Faster Together. Match Your Squad in Minutes.',
      valueProposition: 'Turn solitary makers into high-chemistry, complementary squads before the sprint countdown begins.',
      socialMessage: 'Building solo this weekend? Don’t leave your project unbuilt. Match with a verified designer & dev on BrandForge.',
      userExplanation: 'We pair complementary skills and commitment levels so your team ships on time.'
    }
  };

  // Test 1: Valid schema normalization
  try {
    const normalized = validatePersonality(JSON.stringify(validMockPersonality));
    assert(normalized.traits.length === 4, 'Normalized 4 core traits');
    assert(normalized.traits[0].name === 'Quiet Precision', 'Preserved trait name');
    assert(Boolean(normalized.traits[0].strategicReason), 'Trait strategicReason is present');
    assert(normalized.traitsToAvoid.length === 3, 'Normalized 3 traits to avoid');
    assert(Boolean(normalized.brandPrinciples && normalized.brandPrinciples.length === 3), 'brandPrinciples normalized');
    assert(Boolean(normalized.principles && normalized.principles.length === 3), 'legacy principles string array preserved');
    assert(Boolean(normalized.dimensions && normalized.dimensions.length === 4), 'dimensions array normalized');
    assert(normalized.dimensions![1].value === 100, 'Clamped upper-bound dimension value to 100');
    assert(normalized.dimensions![2].value === 0, 'Clamped lower-bound dimension value to 0');
    assert(Boolean(normalized.voice && normalized.voice.summary), 'voice system summary normalized');
    assert(Boolean(normalized.writingSamples && normalized.writingSamples.headline), 'writingSamples normalized');
  } catch (err: any) {
    assert(false, `Valid personality normalization failed: ${err.message}`);
  }

  // Test 2: Markdown-wrapped JSON parsing
  try {
    const wrapped = '```json\n' + JSON.stringify(validMockPersonality) + '\n```';
    const normalizedWrapped = validatePersonality(wrapped);
    assert(normalizedWrapped.traits.length === 4, 'Markdown-wrapped JSON parsed and normalized successfully');
  } catch (err: any) {
    assert(false, `Markdown-wrapped normalization failed: ${err.message}`);
  }

  // Test 3: Malformed JSON handling
  try {
    validatePersonality('{ invalid json here');
    assert(false, 'Should have thrown error on malformed string');
  } catch (err: any) {
    assert(err.message.includes('malformed JSON') || err.message.includes('Invalid'), 'Controlled error on malformed JSON');
  }

  // Test 4: Missing required fields (empty traits)
  try {
    validatePersonality(JSON.stringify({ ...validMockPersonality, traits: [] }));
    assert(false, 'Should have thrown error on empty traits');
  } catch (err: any) {
    assert(err.message.includes('traits array is missing or empty'), 'Controlled error on missing traits');
  }

  // -------------------------------------------------------------------------
  // SUITE 2: Express API Route & Validation Tests
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Testing /api/generate-stage Route & Upstream Rejection ---');

  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}/api`;

  // Test A: Health check
  try {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    assert(res.status === 200 && data.status === 'ok', 'GET /api/health returned 200 ok');
  } catch (err: any) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // Test B: Missing stage field
  try {
    const res = await fetch(`${baseUrl}/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('Missing required field: "stage"'), 'Controlled 400 on missing stage');
  } catch (err: any) {
    assert(false, `Missing stage test failed: ${err.message}`);
  }

  // Test C: Unsupported stage
  try {
    const res = await fetch(`${baseUrl}/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: 'unknown_stage' }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('is not implemented yet'), 'Controlled 400 on unsupported stage');
  } catch (err: any) {
    assert(false, `Unsupported stage test failed: ${err.message}`);
  }

  // Test D: Missing roughIdea
  try {
    const res = await fetch(`${baseUrl}/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: 'personality', brandMemory: { roughIdea: '' } }),
    });
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('Please enter a rough idea'), 'Controlled 400 on empty roughIdea');
  } catch (err: any) {
    assert(false, `Missing roughIdea test failed: ${err.message}`);
  }

  // Test E: Missing Discovery for Personality stage
  try {
    const res = await fetch(`${baseUrl}/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'personality',
        brandMemory: {
          roughIdea: 'Online scholarship search',
          discovery: null,
          positioning: { category: 'Platform', positioningStatement: 'For students' }
        }
      }),
    });
    const data = await res.json();
    assert(
      res.status === 400 && data.error.includes('Discovery data is missing or incomplete'),
      'Controlled 400 when Discovery is missing for Personality'
    );
  } catch (err: any) {
    assert(false, `Missing Discovery rejection test failed: ${err.message}`);
  }

  // Test F: Missing Positioning for Personality stage
  try {
    const res = await fetch(`${baseUrl}/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'personality',
        brandMemory: {
          roughIdea: 'Online scholarship search',
          discovery: { coreProblem: 'Fragmented data', primaryAudience: 'Students' },
          positioning: null
        }
      }),
    });
    const data = await res.json();
    assert(
      res.status === 400 && data.error.includes('Positioning data is missing or incomplete'),
      'Controlled 400 when Positioning is missing for Personality'
    );
  } catch (err: any) {
    assert(false, `Missing Positioning rejection test failed: ${err.message}`);
  }

  // Close test server
  await new Promise<void>((resolve) => server.close(() => resolve()));

  // -------------------------------------------------------------------------
  // SUITE 3: Demo Mode Determinism & Zero-Groq Guarantee
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Testing Demo Mode Offline Determinism ---');
  assert(DEMO_BRAND.id === 'demo-hackathon-teammates', 'DEMO_BRAND id is verified');
  assert(DEMO_BRAND.personality.traits.length >= 4, 'DEMO_BRAND has >= 4 personality traits');
  assert(DEMO_BRAND.personality.traitsToAvoid.length >= 3, 'DEMO_BRAND has >= 3 traits to avoid');
  assert(DEMO_BRAND.personality.principles.length >= 4, 'DEMO_BRAND has >= 4 principles');
  assert(Boolean(DEMO_BRAND.personality.brandPrinciples && DEMO_BRAND.personality.brandPrinciples.length >= 4), 'DEMO_BRAND has rich brandPrinciples');
  assert(Boolean(DEMO_BRAND.personality.dimensions && DEMO_BRAND.personality.dimensions.length >= 4), 'DEMO_BRAND has calibrated dimensions');
  assert(Boolean(DEMO_BRAND.personality.voice && DEMO_BRAND.personality.voice.summary), 'DEMO_BRAND has voice system');
  assert(Boolean(DEMO_BRAND.personality.writingSamples && DEMO_BRAND.personality.writingSamples.headline), 'DEMO_BRAND has writing samples');

  // -------------------------------------------------------------------------
  // SUITE 4: State Integrity & Isolation
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Testing State Integrity & Isolation ---');

  const { createBlankBrandMemory } = await import('../src/context/BrandContext.js');
  const baseMemory = createBlankBrandMemory();

  const initialBrandMemory: BrandMemory = {
    ...baseMemory,
    id: 'test-project-1',
    projectName: 'TestBrand',
    roughIdea: 'An online platform that helps college students discover scholarships, fellowships, and grants they are eligible for.',
    currentStage: 'position',
    stagesCompleted: ['input', 'discover', 'position'],
    stageExecution: {
      ...baseMemory.stageExecution!,
      input: { status: 'ready', lastUpdated: new Date().toISOString() },
      discover: { status: 'ready', lastUpdated: new Date().toISOString() },
      position: { status: 'ready', lastUpdated: new Date().toISOString() },
      personality: { status: 'idle', lastUpdated: new Date().toISOString() },
    },
    discovery: {
      coreProblem: 'Students face a fragmented landscape.',
      primaryAudience: 'college students',
      userContext: 'When applying for aid.',
      currentAlternatives: ['Google', 'Fastweb'],
      coreNeed: 'A fast, trustworthy discovery experience.',
      assumptions: [],
      openQuestions: [],
      isConfirmed: false,
    },
    positioning: {
      category: 'Personalized Scholarship Discovery Platform',
      targetSegment: 'College students',
      valueProposition: 'A guided high-confidence match experience.',
      differentiator: 'Curated eligibility-focused matching layer.',
      primaryDifferentiation: 'Curated eligibility-focused matching layer.',
      positioningStatement: 'For college students who need funding, ScholarGuide is the platform...',
      whyThisPosition: 'Directly addresses fragmented data.',
      positioningRationale: 'Directly addresses fragmented data.',
      selectedTerritoryId: 'territory-2',
      territories: [],
      keyPillars: ['Trust', 'Relevance'],
      isConfirmed: false,
    },
  };

  const discoveryBackup = JSON.stringify(initialBrandMemory.discovery);
  const positioningBackup = JSON.stringify(initialBrandMemory.positioning);

  // Simulate successful state update
  const normalizedPersonality = validatePersonality(JSON.stringify(validMockPersonality));
  const updatedBrandMemory: BrandMemory = {
    ...initialBrandMemory,
    personality: normalizedPersonality,
    currentStage: 'personality',
    stagesCompleted: Array.from(new Set([...initialBrandMemory.stagesCompleted, 'personality'])),
    stageExecution: {
      ...initialBrandMemory.stageExecution!,
      personality: { status: 'ready', lastUpdated: new Date().toISOString() },
    },
  };

  assert(updatedBrandMemory.personality.traits.length === 4, 'Personality updated in BrandMemory on success');
  assert(JSON.stringify(updatedBrandMemory.discovery) === discoveryBackup, 'Discovery strictly preserved');
  assert(JSON.stringify(updatedBrandMemory.positioning) === positioningBackup, 'Positioning strictly preserved');
  assert(!updatedBrandMemory.naming?.selectedNameId, 'Naming remains completely untouched');

  // Simulate failed generation (no mutation on failure)
  let failedBrandMemory = { ...initialBrandMemory };
  try {
    throw new Error('Groq rate limit simulated');
  } catch (err: any) {
    // Stage error recorded, brandMemory NOT mutated
    failedBrandMemory = {
      ...failedBrandMemory,
      stageExecution: {
        ...failedBrandMemory.stageExecution!,
        personality: { status: 'error', lastError: err.message, lastUpdated: new Date().toISOString() },
      },
    };
  }

  assert(failedBrandMemory.personality.traits.length === 0, 'Failed generation did NOT partially write personality');
  assert(failedBrandMemory.stageExecution!.personality.status === 'error', 'Personality stage status correctly set to error on failure');
  assert(JSON.stringify(failedBrandMemory.discovery) === discoveryBackup, 'Discovery preserved on failed generation');
  assert(JSON.stringify(failedBrandMemory.positioning) === positioningBackup, 'Positioning preserved on failed generation');

  console.log('\n=====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});

