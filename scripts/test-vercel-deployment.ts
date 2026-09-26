// Live Vercel Production Verification Script

const BASE_URL = process.env.VERCEL_URL 
  ? (process.env.VERCEL_URL.startsWith('http') ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`)
  : 'https://brandforge-ten-bice.vercel.app';

console.log(`\n======================================================`);
console.log(`TESTING LIVE VERCEL DEPLOYMENT AT: ${BASE_URL}`);
console.log(`======================================================\n`);

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Landing Page Test
  console.log(`--- 1. Landing Page Test ---`);
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, `Landing page returns 200 OK (got ${res.status})`);
    const text = await res.text();
    assert(text.includes('<html') || text.includes('<!DOCTYPE html>'), `Landing page returns valid HTML`);
    assert(text.includes('id="root"'), `Landing page includes root React mounting point`);
    assert(text.includes('/assets/index-'), `Landing page includes Vite production assets`);
  } catch (err: any) {
    assert(false, `Landing page fetch failed: ${err.message}`);
  }

  // 2. /api/health Test
  console.log(`\n--- 2. Health Endpoint Test (/api/health) ---`);
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert(res.status === 200, `/api/health returns 200 OK (got ${res.status})`);
    const data = await res.json() as any;
    console.log(`  Health response:`, JSON.stringify(data));
    assert(data.status === 'ok', `status is "ok"`);
    assert(data.groqConfigured === true, `groqConfigured is true (GROQ_API_KEY active on Vercel)`);
    assert(typeof data.model === 'string' && data.model.length > 0, `model specified: ${data.model}`);
  } catch (err: any) {
    assert(false, `/api/health fetch failed: ${err.message}`);
  }

  // 3. Error Handling Test
  console.log(`\n--- 3. Controlled Error Handling Test ---`);
  try {
    // 3a. Invalid stage
    const badStageRes = await fetch(`${BASE_URL}/api/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'non_existent_stage',
        brandMemory: { roughIdea: 'Test Idea' }
      })
    });
    assert(badStageRes.status === 400, `Invalid stage returns 400 Bad Request (got ${badStageRes.status})`);
    const badStageJson = await badStageRes.json() as any;
    assert(badStageJson.error?.includes('not implemented'), `Error message indicates unsupported/invalid stage: "${badStageJson.error}"`);

    // 3b. Missing roughIdea
    const missingInputRes = await fetch(`${BASE_URL}/api/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'discover',
        brandMemory: { roughIdea: '' }
      })
    });
    assert(missingInputRes.status === 400, `Empty input returns 400 Bad Request (got ${missingInputRes.status})`);
    const missingInputJson = await missingInputRes.json() as any;
    assert(missingInputJson.error?.includes('Please enter a rough idea'), `Error message prompts for rough idea: "${missingInputJson.error}"`);
  } catch (err: any) {
    assert(false, `Error handling tests failed: ${err.message}`);
  }

  // 4. Real Discovery Generation Test (Live Groq call)
  console.log(`\n--- 4. Real Discovery Generation Test (Live Groq) ---`);
  let discoveryData: any = null;
  const testIdea = "I want to build a platform that helps college students discover scholarships, grants, and other funding opportunities they are actually eligible for, instead of making them search through hundreds of irrelevant opportunities.";
  try {
    const t0 = Date.now();
    console.log(`  Dispatching live Groq request to Vercel for stage "discover"...`);
    const res = await fetch(`${BASE_URL}/api/generate-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'discover',
        brandMemory: {
          roughIdea: testIdea,
          projectName: 'ScholarCompass',
          knownDetails: 'Target audience: undergrad and grad students in the US'
        }
      })
    });
    const durationMs = Date.now() - t0;
    console.log(`  Discovery response received in ${durationMs}ms with status ${res.status}`);
    assert(res.status === 200, `Discover API returns 200 OK (got ${res.status})`);
    
    const body = await res.json() as any;
    assert(body.success === true, `body.success is true`);
    discoveryData = body.data;
    assert(discoveryData && typeof discoveryData === 'object', `Response data is a valid JSON object`);
    assert(typeof discoveryData.coreProblem === 'string' && discoveryData.coreProblem.length > 10, `coreProblem populated: "${discoveryData.coreProblem?.slice(0, 60)}..."`);
    assert(typeof discoveryData.primaryAudience === 'string' && discoveryData.primaryAudience.length > 5, `primaryAudience populated: "${discoveryData.primaryAudience?.slice(0, 60)}..."`);
    assert(typeof discoveryData.userContext === 'string' && discoveryData.userContext.length > 5, `userContext populated: "${discoveryData.userContext?.slice(0, 60)}..."`);
    assert(Array.isArray(discoveryData.currentAlternatives) && discoveryData.currentAlternatives.length > 0, `currentAlternatives populated (${discoveryData.currentAlternatives?.length} items)`);
    assert(Array.isArray(discoveryData.assumptions) && discoveryData.assumptions.length > 0, `assumptions populated (${discoveryData.assumptions?.length} items)`);
    assert(Array.isArray(discoveryData.openQuestions) && discoveryData.openQuestions.length > 0, `openQuestions populated (${discoveryData.openQuestions?.length} items)`);
  } catch (err: any) {
    assert(false, `Live Discovery generation failed: ${err.message}`);
  }

  // 5. Downstream AI Stage: Positioning Generation Test (Live Groq)
  console.log(`\n--- 5. Downstream AI Stage Test (Positioning - Live Groq) ---`);
  if (!discoveryData) {
    assert(false, `Skipping downstream test because Discovery output was not produced`);
  } else {
    try {
      const memoryWithDiscovery = {
        roughIdea: testIdea,
        projectName: 'ScholarCompass',
        knownDetails: 'Target audience: undergrad and grad students in the US',
        discovery: discoveryData,
        stageFeedback: {}
      };
      const t0 = Date.now();
      console.log(`  Dispatching downstream live Groq request to Vercel for stage "position"...`);
      const res = await fetch(`${BASE_URL}/api/generate-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'position',
          brandMemory: memoryWithDiscovery
        })
      });
      const durationMs = Date.now() - t0;
      console.log(`  Positioning response received in ${durationMs}ms with status ${res.status}`);
      assert(res.status === 200, `Positioning API returns 200 OK (got ${res.status})`);

      const body = await res.json() as any;
      assert(body.success === true, `body.success is true`);
      const positionData = body.data;
      assert(positionData && typeof positionData === 'object', `Positioning response data is valid JSON object`);
      assert(typeof positionData.valueProposition === 'string' && positionData.valueProposition.length > 10, `valueProposition populated: "${positionData.valueProposition?.slice(0, 60)}..."`);
      assert(typeof positionData.category === 'string' && positionData.category.length > 3, `category populated: "${positionData.category}"`);
      assert(typeof positionData.targetSegment === 'string' && positionData.targetSegment.length > 5, `targetSegment populated: "${positionData.targetSegment}"`);
      assert(typeof positionData.positioningStatement === 'string' && positionData.positioningStatement.length > 10, `positioningStatement populated: "${positionData.positioningStatement?.slice(0, 60)}..."`);
      assert(typeof positionData.differentiator === 'string' && positionData.differentiator.length > 5, `differentiator populated`);
    } catch (err: any) {
      assert(false, `Live Positioning generation failed: ${err.message}`);
    }
  }

  console.log(`\n======================================================`);
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
