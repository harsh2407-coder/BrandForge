import http from 'http';

async function post(url, data) {
  const parsed = new URL(url);
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Sending single real Positioning request downstream of Discovery...');
  const testDiscovery = {
    coreProblem: 'Urban gardeners and small-scale community growers face prohibitive upfront costs for heavy-duty tools (tillers, shredders, aerators) that sit idle for months, leading to project abandonment and reliance on low-quality disposable tools.',
    primaryAudience: 'Ambitious urban growers, community garden leaders, and suburban homesteaders seeking reliable equipment without equipment ownership debt.',
    userContext: 'High-urgency seasonal preparation windows where renting from industrial contractors is too complex and borrowing from unverified social channels is unreliable.',
    currentAlternatives: [
      'Big-box hardware store short-term tool rentals with commercial fees',
      'Unorganized neighborhood WhatsApp/Facebook groups',
      'Buying low-cost single-use machinery that breaks easily'
    ],
    coreNeed: 'A peer-to-peer equipment sharing network with verified damage deposits, frictionless booking, and localized custody handoffs.',
    assumptions: [
      {
        id: 'asm-1',
        statement: 'Owners will entrust high-value gardening tools to verified neighbors for a fee.',
        riskLevel: 'high',
        validationTip: 'Test with a $150 security deposit buffer and profile verification.'
      }
    ],
    openQuestions: [
      {
        id: 'q-1',
        question: 'What is the liability framework for equipment breakdown during a rental?',
        strategicWhy: 'Determines insurance overhead and onboarding friction.'
      }
    ],
    isConfirmed: true
  };

  const res = await post('http://localhost:3000/api/generate-stage', {
    stage: 'position',
    brandMemory: {
      roughIdea: 'A peer-to-peer equipment sharing network for neighborhood gardeners and urban farmers to rent tools and share harvest surpluses.',
      projectName: 'GreenShare',
      discovery: testDiscovery
    }
  });

  console.log('Response Status:', res.status);
  console.log('Response Body:\n', JSON.stringify(res.data, null, 2));

  if (res.data?.success && res.data?.data) {
    const d = res.data.data;
    console.log('\n--- VERIFICATION OF POSITIONING ENGINE ---');
    console.log('Category:', d.category);
    console.log('Selected Territory:', d.selectedTerritoryId);
    console.log('Positioning Rationale:\n', d.positioningRationale);
    console.log('Positioning Statement:\n', d.positioningStatement);
    console.log('Value Proposition:\n', d.valueProposition);
    console.log('Primary Differentiation:\n', d.primaryDifferentiation);
    console.log('Value Pillars:\n', d.keyPillars);
    console.log('\nTerritories:');
    d.territories?.forEach(t => {
      console.log(`- [${t.id}] ${t.name} (${t.x}, ${t.y}) [${t.quadrant}]`);
      console.log(`   Prop: ${t.valueProposition}`);
      console.log(`   Tradeoff: ${t.tradeoff}`);
      console.log(`   Desc: ${t.description}`);
    });
  }
}

run().catch(console.error);
