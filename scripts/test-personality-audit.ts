import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { groqGateway } from '../server/groqGateway.js';
import { buildPersonalityPrompt, PERSONALITY_SCHEMA, PERSONALITY_SYSTEM_INSTRUCTION } from '../server/personalityPrompt.js';
import type { DiscoveryData, PositioningData } from '../src/types/brand.js';

const discovery: DiscoveryData = {
  coreProblem: 'College students face a chronic information overload when searching for scholarships, wasting hundreds of hours on irrelevant opportunities.',
  primaryAudience: 'Undergraduate and graduate students in the US seeking external funding.',
  userContext: 'Financial aid season and semester tuition deadlines.',
  currentAlternatives: ['Fastweb', 'Scholarships.com', 'College Board', 'Manual Google Search'],
  coreNeed: 'Pre-vetted, eligibility-matched scholarships with transparent deadlines.',
  assumptions: [
    { id: '1', statement: 'Students prefer high relevance over large volume', riskLevel: 'high', validationTip: 'Survey match rate' },
    { id: '2', statement: 'Eligibility criteria can be parsed reliably', riskLevel: 'medium', validationTip: 'Test 50 criteria schemas' }
  ],
  openQuestions: [
    { id: '1', question: 'How to automate GPA verification?', strategicWhy: 'Reduces friction' }
  ],
  isConfirmed: true
};

const positioning: PositioningData = {
  category: 'Eligibility-Focused Scholarship Discovery Platform',
  targetSegment: 'US college students seeking external funding',
  valueProposition: 'Find funding you actually qualify for in minutes, not weekends.',
  differentiator: 'Strict algorithmic eligibility filtering before listing any scholarship.',
  positioningStatement: 'For college students tired of dead-end scholarship searches, ScholarCompass delivers verified eligibility-matched awards.',
  whyThisPosition: 'Incumbents monetize lead-gen volume rather than applicant conversion.',
  isConfirmed: true,
  keyPillars: [
    'Zero-noise matching',
    'Deadline countdown accuracy',
    'Plain-English requirements'
  ]
};

const roughIdea = 'An AI platform helping college students discover scholarships they are actually eligible for.';

async function audit() {
  console.log('=== PERSONALITY AUDIT ===');
  
  const prompt = buildPersonalityPrompt(roughIdea, discovery, positioning, 'ScholarCompass');
  console.log(`Prompt char length: ${prompt.length}`);
  console.log(`System instruction char length: ${PERSONALITY_SYSTEM_INSTRUCTION.length}`);
  console.log(`Schema JSON char length: ${JSON.stringify(PERSONALITY_SCHEMA).length}`);

  console.log('\n--- Calling live Groq for Personality ---');
  const t0 = Date.now();
  try {
    const personality = await groqGateway.generatePersonality({
      roughIdea,
      discovery,
      positioning,
      projectName: 'ScholarCompass'
    });
    const dur = Date.now() - t0;
    console.log(`\nPersonality Generation Succeeded in ${dur}ms!`);
    console.log('Keys in result:', Object.keys(personality));
    console.log('Traits count:', personality.traits?.length);
    console.log('AvoidTraits count:', personality.traitsToAvoid?.length);
    console.log('Principles count:', personality.principles?.length);
    console.log('Dimensions count:', personality.dimensions?.length);
    console.log('Voice characteristics count:', personality.voice?.characteristics?.length);
    console.log('Tone rules count:', personality.voice?.toneRules?.length);
    console.log('Writing samples present:', Boolean(personality.writingSamples));
    console.log('Writing samples:', JSON.stringify(personality.writingSamples, null, 2));
  } catch (err: any) {
    const dur = Date.now() - t0;
    console.error(`\nPersonality Generation FAILED in ${dur}ms:`, err);
  }
}

audit();
