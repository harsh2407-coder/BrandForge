import { GeminiGateway } from '../server/geminiGateway.js';
import { DEMO_BRAND } from '../src/data/demoBrand.js';

async function main() {
  const g = new GeminiGateway();
  try {
    const res = await g.generateNaming({
      roughIdea: DEMO_BRAND.roughIdea,
      projectName: DEMO_BRAND.projectName,
      discovery: DEMO_BRAND.discovery,
      positioning: DEMO_BRAND.positioning,
      personality: DEMO_BRAND.personality
    });
    console.log('LIVE SUCCESS: Worlds count:', res.namingWorlds?.length, 'Candidates count:', res.candidates?.length);
    console.log('Sample Candidate:', res.candidates?.[0]?.name, 'Rationale:', res.candidates?.[0]?.strategicRationale);
  } catch (err: any) {
    console.log('LIVE ATTEMPT RESULT:', err.message);
  }
}

main();
