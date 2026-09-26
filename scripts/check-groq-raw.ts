import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import Groq from 'groq-sdk';
import { PERSONALITY_SCHEMA, PERSONALITY_SYSTEM_INSTRUCTION, buildPersonalityPrompt } from '../server/personalityPrompt.js';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const dummyDiscovery: any = {
    coreProblem: 'Overload of irrelevant scholarships.',
    primaryAudience: 'College students in US.',
    userContext: 'Tuition deadlines.',
    coreNeed: 'Pre-vetted eligible funding.',
    currentAlternatives: ['Fastweb']
  };
  const dummyPositioning: any = {
    category: 'Scholarship platform',
    targetSegment: 'US students',
    valueProposition: 'Fast matched funding.',
    differentiator: 'Strict eligibility filtering.',
    positioningStatement: 'For students needing funding.',
    whyThisPosition: 'Incumbents spam ads.'
  };

  const prompt = buildPersonalityPrompt('Scholarship platform', dummyDiscovery, dummyPositioning, 'ScholarCompass');

  console.log('Sending Personality request to Groq...');
  try {
    const r = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: PERSONALITY_SYSTEM_INSTRUCTION },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'personality_schema', strict: true, schema: PERSONALITY_SCHEMA }
      },
      max_completion_tokens: 3500
    });
    console.log('SUCCESS! Output length:', r.choices[0]?.message?.content?.length);
    console.log('Usage:', r.usage);
    console.log('Content preview:', r.choices[0]?.message?.content?.slice(0, 300));
  } catch (e: any) {
    console.error('Error status:', e.status);
    console.error('Error message:', e.error?.message || e.message);
  }
}

main();
