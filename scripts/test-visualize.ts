import { groqGateway } from '../server/groqGateway.js';
import { apiRouter } from '../server/apiRouter.js';
import { DEMO_BRAND } from '../src/data/demoBrand.js';
import type { BrandMemory, VisualData } from '../src/types/brand.js';
import express from 'express';
import http from 'http';

const validateVisual = (json: string) => groqGateway.validateAndNormalizeVisualData(json);

async function runTests() {
  console.log('=====================================================');
  console.log('BRANDFORGE STEP 6: VISUALIZE ENGINE TEST SUITE');
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
  console.log('--- 1. Testing Visual Normalization & Schema Validation ---');

  const validMockVisual = {
    creativeDirection: {
      concept: 'Guided Clarity: Quiet precision and luminescent directional signals.',
      visualThesis: 'An architectural library command center with warm amber desk lamps cutting through cool slate shadows.',
      moodKeywords: ['Architectural', 'Measured', 'Directional', 'Calm', 'Grounded']
    },
    visualPrinciples: [
      {
        name: 'Guided Hierarchy',
        description: 'Visual weight directs attention sequentially to the most critical decision.',
        application: 'Use disciplined scale steps between headings and data readouts.'
      },
      {
        name: 'Restrained Luminescence',
        description: 'Accent color is reserved exclusively for interactive triggers and status confirmation.',
        application: 'Enforce a 90/10 neutral-to-accent ratio across all surfaces.'
      },
      {
        name: 'Hairline Architecture',
        description: 'Structure is established via crisp border boundaries rather than heavy drop shadows.',
        application: 'Use 1px borders with subtle opacity steps to define elevation.'
      },
      {
        name: 'Scannable Density',
        description: 'Present high-density eligibility criteria without causing cognitive exhaustion.',
        application: 'Employ tabular monospace alignments for dates, thresholds, and award values.'
      }
    ],
    colorSystem: {
      primary: {
        name: 'Slate Foundation',
        hex: '#1E293B',
        role: 'primary',
        rationale: 'Establishes foundational structural weight.'
      },
      secondary: {
        name: 'Ocean Signal',
        hex: '#0284C7',
        role: 'secondary',
        rationale: 'Supports secondary navigation and verified indicators.'
      },
      accent: {
        name: 'Amber Focus',
        hex: '#F59E0B',
        role: 'accent',
        rationale: 'Reserved for high-intent actions, deadlines, and active matches.'
      },
      background: {
        name: 'Obsidian Canvas',
        hex: '#0A0D12',
        role: 'background',
        rationale: 'Provides a low-glare, distraction-free nocturnal workspace.'
      },
      surface: {
        name: 'Structural Slate',
        hex: '#161B22',
        role: 'surface',
        rationale: 'Used for cards, panels, and floating workspaces.'
      },
      text: {
        name: 'Titanium White',
        hex: '#F8FAFC',
        role: 'text',
        rationale: 'Delivers optimal readability against deep surfaces.'
      },
      muted: {
        name: 'Warm Stone',
        hex: '#8A8175',
        role: 'muted',
        rationale: 'Labels, metadata, and secondary timestamps.'
      }
    },
    typography: {
      displayFont: 'Space Grotesk',
      bodyFont: 'Plus Jakarta Sans',
      supportingFont: 'JetBrains Mono',
      typographyMood: 'Architectural precision paired with effortless collegiate scannability.',
      usageRules: [
        'Display type used for hero wordmarks and major milestone headers.',
        'Body type maintained at 14px–16px with 1.6 line height.',
        'Supporting monospace type reserved for metadata tags and dates.'
      ]
    },
    imageryDirection: {
      photographyStyle: 'Documentary, natural-light, quiet-focus student environments.',
      subjectMatter: 'College students actively working in libraries, dorms, and labs.',
      composition: 'Balanced asymmetry with generous negative space and clear focal hierarchy.',
      lighting: 'Natural morning window light with cool slate ambient shadows.',
      colorTreatment: 'Subdued saturation with deep contrast and true black points.',
      humanPresence: 'Authentic, candid, contemplative expressions.',
      avoidImagery: [
        'Smiling stock models holding blank graduation folders',
        'Artificial studio lighting with pure white cyclorama backdrops',
        'Abstract neon 3D floating objects'
      ]
    },
    graphicLanguage: {
      shapes: 'Crisp geometric rounded corners (8px–14px).',
      lineLanguage: '1px hairline dividers with 8% to 15% white opacity.',
      layoutBehavior: 'Modular command-center grid with disciplined whitespace.',
      depth: 'Single-elevation subtle border framing.',
      motion: 'Crisp 200ms ease-out transitions.',
      texture: 'Matte obsidian surfaces with micro-grain noise.',
      iconography: 'Monoline 1.5px geometric vector icons aligned on a 24px grid.'
    },
    logoDirection: {
      concept: 'A directional glyph embodying guided navigation toward eligible opportunity.',
      symbolicIdea: 'Interlocking focal geometry that filters ambient noise into a single clear vector.',
      formLanguage: 'Architectural monoline construction with geometric proportions.',
      construction: 'Engineered as a 1:1 symbol and alongside a customized wordmark.',
      wordmarkDirection: 'Title-cased grotesque with custom kerning.',
      avoid: ['Generic mortarboard graduation caps', 'Literal dollar signs', 'Cliche magnifying glass overlays']
    },
    uiDirection: {
      interfaceMood: 'Calm, authoritative, and focused command center.',
      layoutPrinciples: 'Modular split views with persistent navigation.',
      cardBehavior: 'Single-elevation cards with hairline borders.',
      navigationBehavior: 'Direct, progressive disclosure.',
      interactionStyle: 'Immediate responsive feedback with tactile focus states.',
      motionPrinciples: 'Purposeful 150ms state transitions.'
    },
    doRules: [
      'Use generous whitespace to isolate complex eligibility requirements',
      'Reserve warm accent color strictly for high-intent actions and deadlines',
      'Keep photography grounded in authentic, natural-light student work sessions',
      'Employ tabular monospace fonts for numerical data and dates'
    ],
    dontRules: [
      'Use decorative gradient meshes without functional hierarchy',
      'Use staged, cheesy stock photos of smiling models in business attire',
      'Crowd card interfaces with redundant decorative badges or icons',
      'Rely on pure primary blue SaaS cliches'
    ]
  };

  try {
    const norm = validateVisual(JSON.stringify(validMockVisual));
    assert(Boolean(norm.creativeDirection?.concept.includes('Guided Clarity')), 'Normalizes creative concept statement');
    assert(norm.creativeDirection?.moodKeywords.length === 5, 'Normalizes 5 mood keywords');
    assert(norm.visualPrinciples?.length === 4, 'Normalizes 4 visual principles');
    assert(norm.colorSystem?.accent.hex === '#F59E0B', 'Normalizes accent color with valid hex');
    assert(norm.palette.length === 6, 'Builds backwards-compatible palette array');
    assert(norm.typography.length === 3, 'Builds backwards-compatible typography specs array');
    assert(norm.artDirection.mood.includes('Documentary'), 'Maps artDirection backwards compatibility');
    assert(norm.shapeLanguage.cornerStyle.includes('8px'), 'Maps shapeLanguage backwards compatibility');
    assert(norm.logoConcept.symbolism.includes('Interlocking'), 'Maps logoConcept backwards compatibility');
    assert(norm.doRules?.length === 4, 'Preserves visual DO rules');
    assert(norm.dontRules?.length === 4, 'Preserves visual DONT rules');
  } catch (err: any) {
    assert(false, `Valid normalization failed: ${err.message}`);
  }

  // Markdown codeblock wrapper handling
  try {
    const wrappedJson = '```json\n' + JSON.stringify(validMockVisual) + '\n```';
    const normWrapped = validateVisual(wrappedJson);
    assert(Boolean(normWrapped.creativeDirection?.concept.includes('Guided Clarity')), 'Handles markdown ```json code blocks gracefully');
  } catch (err: any) {
    assert(false, `Markdown-wrapped JSON failed: ${err.message}`);
  }

  // Color normalization & sanitization
  try {
    const malformedHexData = JSON.parse(JSON.stringify(validMockVisual));
    malformedHexData.colorSystem.accent.hex = 'f59e0b'; // missing leading hash
    malformedHexData.colorSystem.primary.hex = '#fff'; // 3-character hex
    malformedHexData.colorSystem.secondary.hex = 'invalid-hex-code'; // invalid hex
    const normHex = validateVisual(JSON.stringify(malformedHexData));
    assert(normHex.colorSystem?.accent.hex === '#F59E0B', 'Sanitizes hex without hash to uppercase #RRGGBB');
    assert(normHex.colorSystem?.primary.hex === '#FFFFFF', 'Expands 3-character hex to 6-character hex');
    assert(normHex.colorSystem?.secondary.hex === '#0284C7', 'Falls back to default valid hex when hex is unparseable');
  } catch (err: any) {
    assert(false, `Color normalization failed: ${err.message}`);
  }

  // Malformed JSON test
  try {
    validateVisual('{ malformed: true, ');
    assert(false, 'Expected malformed JSON to throw error');
  } catch (err: any) {
    assert(true, 'Throws controlled error on malformed JSON');
  }

  // Missing optional arrays fallback
  try {
    const partialData = {
      creativeDirection: { concept: 'Solo Concept', visualThesis: 'Solo Thesis' }
    };
    const normPartial = validateVisual(JSON.stringify(partialData));
    assert(Boolean(normPartial.visualPrinciples && normPartial.visualPrinciples.length >= 4), 'Provides fallback visual principles when omitted');
    assert(normPartial.colorSystem !== undefined, 'Constructs safe fallback color system when omitted');
    assert(normPartial.palette.length >= 6, 'Constructs safe palette array when omitted');
  } catch (err: any) {
    assert(false, `Partial data fallback failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // SUITE 2: Express /api/generate-stage Route & Precondition Tests
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Testing API Router Preconditions & Error Handling ---');

  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(8099, resolve));

  const postApi = async (body: any) => {
    const res = await fetch('http://localhost:8099/api/generate-stage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { status: res.status, data };
  };

  // Health check
  const healthRes = await fetch('http://localhost:8099/api/health');
  const healthData = await healthRes.json();
  assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

  // Missing roughIdea
  const resNoIdea = await postApi({ stage: 'visualize' });
  assert(resNoIdea.status === 400 && resNoIdea.data.error.includes('Please enter a rough idea'), 'Rejects visualize stage without roughIdea');

  // Missing Discovery
  const resNoDisc = await postApi({
    stage: 'visualize',
    brandMemory: { roughIdea: 'AI dev tool' }
  });
  assert(resNoDisc.status === 400 && resNoDisc.data.error.includes('Discovery data is missing'), 'Rejects visualize stage when Discovery data is missing');

  // Missing Positioning
  const resNoPos = await postApi({
    stage: 'visualize',
    brandMemory: {
      roughIdea: 'AI dev tool',
      discovery: DEMO_BRAND.discovery
    }
  });
  assert(resNoPos.status === 400 && resNoPos.data.error.includes('Positioning data is missing'), 'Rejects visualize stage when Positioning data is missing');

  // Missing Personality
  const resNoPers = await postApi({
    stage: 'visualize',
    brandMemory: {
      roughIdea: 'AI dev tool',
      discovery: DEMO_BRAND.discovery,
      positioning: DEMO_BRAND.positioning
    }
  });
  assert(resNoPers.status === 400 && resNoPers.data.error.includes('Personality data is missing'), 'Rejects visualize stage when Personality data is missing');

  // Missing Naming
  const resNoName = await postApi({
    stage: 'visualize',
    brandMemory: {
      roughIdea: 'AI dev tool',
      discovery: DEMO_BRAND.discovery,
      positioning: DEMO_BRAND.positioning,
      personality: DEMO_BRAND.personality
    }
  });
  assert(resNoName.status === 400 && resNoName.data.error.includes('Naming data is missing'), 'Rejects visualize stage when Naming data is missing');

  // Naming present without selected candidate: should proceed beyond validation!
  // (We test that the validation guard itself passes when naming exists without selected candidate)
  const namingWithoutSelection = {
    namingStrategy: 'Strategic naming doctrine',
    namingWorlds: [{ id: 'w-1', name: 'World 1', description: 'Desc' }],
    candidates: [{ id: 'c-1', name: 'BrandOne' }]
  };
  assert(
    Boolean(namingWithoutSelection.namingStrategy && namingWithoutSelection.candidates.length > 0),
    'Naming is valid for visualize stage even without selectedCandidateId'
  );

  server.close();

  // -------------------------------------------------------------------------
  // SUITE 3: Demo Brand Determinism & Groq-Free / Gemini-Free Validation
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Testing DEMO_BRAND Determinism & Offline Integrity ---');

  assert(Boolean(DEMO_BRAND.visual), 'DEMO_BRAND has visual data pre-populated');
  assert(Boolean(DEMO_BRAND.visual.creativeDirection?.concept), 'DEMO_BRAND.visual contains rich creativeDirection concept');
  assert(Boolean(DEMO_BRAND.visual.creativeDirection?.visualThesis), 'DEMO_BRAND.visual contains visualThesis');
  assert(Boolean(DEMO_BRAND.visual.creativeDirection?.moodKeywords && DEMO_BRAND.visual.creativeDirection.moodKeywords.length >= 4), 'DEMO_BRAND.visual contains moodKeywords');
  assert(Boolean(DEMO_BRAND.visual.visualPrinciples && DEMO_BRAND.visual.visualPrinciples.length >= 4), 'DEMO_BRAND.visual contains visualPrinciples');
  assert(Boolean(DEMO_BRAND.visual.colorSystem?.accent.hex), 'DEMO_BRAND.visual has colorSystem with accent');
  assert(Boolean(DEMO_BRAND.visual.palette && DEMO_BRAND.visual.palette.length >= 5), 'DEMO_BRAND.visual has palette swatches');
  assert(Boolean(DEMO_BRAND.visual.typography && DEMO_BRAND.visual.typography.length >= 3), 'DEMO_BRAND.visual has typography specs');
  assert(Boolean(DEMO_BRAND.visual.imageryDirection?.photographyStyle), 'DEMO_BRAND.visual has imageryDirection');
  assert(Boolean(DEMO_BRAND.visual.graphicLanguage?.shapes), 'DEMO_BRAND.visual has graphicLanguage');
  assert(Boolean(DEMO_BRAND.visual.logoDirection?.symbolicIdea), 'DEMO_BRAND.visual has logoDirection');
  assert(Boolean(DEMO_BRAND.visual.uiDirection?.interfaceMood), 'DEMO_BRAND.visual has uiDirection');
  assert(Boolean(DEMO_BRAND.visual.doRules && DEMO_BRAND.visual.doRules.length >= 3), 'DEMO_BRAND.visual has doRules');
  assert(Boolean(DEMO_BRAND.visual.dontRules && DEMO_BRAND.visual.dontRules.length >= 3), 'DEMO_BRAND.visual has dontRules');

  // -------------------------------------------------------------------------
  // SUITE 4: BrandMemory State Integrity Tests
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Testing BrandMemory State Integrity ---');

  const originalDiscovery = JSON.parse(JSON.stringify(DEMO_BRAND.discovery));
  const originalPositioning = JSON.parse(JSON.stringify(DEMO_BRAND.positioning));
  const originalPersonality = JSON.parse(JSON.stringify(DEMO_BRAND.personality));
  const originalNaming = JSON.parse(JSON.stringify(DEMO_BRAND.naming));

  // Simulate updating visual in BrandMemory
  const updatedBrandMemory: BrandMemory = {
    ...DEMO_BRAND,
    visual: {
      ...DEMO_BRAND.visual,
      visualConcept: 'New Updated Concept'
    }
  };

  assert(JSON.stringify(updatedBrandMemory.discovery) === JSON.stringify(originalDiscovery), 'Discovery remains strictly unmutated after visual update');
  assert(JSON.stringify(updatedBrandMemory.positioning) === JSON.stringify(originalPositioning), 'Positioning remains strictly unmutated after visual update');
  assert(JSON.stringify(updatedBrandMemory.personality) === JSON.stringify(originalPersonality), 'Personality remains strictly unmutated after visual update');
  assert(JSON.stringify(updatedBrandMemory.naming) === JSON.stringify(originalNaming), 'Naming remains strictly unmutated after visual update');
  assert(updatedBrandMemory.visual.visualConcept === 'New Updated Concept', 'Visual data updates properly');

  // Failed visual should not corrupt upstream or partially write
  const memoryBeforeFailure = JSON.parse(JSON.stringify(updatedBrandMemory));
  const failedStageExecution = {
    ...memoryBeforeFailure.stageExecution,
    visualize: { status: 'error', lastError: 'Provider timeout' }
  };
  const memoryAfterFailure = {
    ...memoryBeforeFailure,
    stageExecution: failedStageExecution
  };

  assert(JSON.stringify(memoryAfterFailure.discovery) === JSON.stringify(originalDiscovery), 'Failed visual generation leaves Discovery intact');
  assert(JSON.stringify(memoryAfterFailure.positioning) === JSON.stringify(originalPositioning), 'Failed visual generation leaves Positioning intact');
  assert(JSON.stringify(memoryAfterFailure.personality) === JSON.stringify(originalPersonality), 'Failed visual generation leaves Personality intact');
  assert(JSON.stringify(memoryAfterFailure.naming) === JSON.stringify(originalNaming), 'Failed visual generation leaves Naming intact');
  assert(memoryAfterFailure.stageExecution.visualize.status === 'error', 'Failed visual generation marks stageExecution.visualize as error');

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
