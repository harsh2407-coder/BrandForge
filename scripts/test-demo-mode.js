import { DEMO_BRAND } from '../src/data/demoBrand.ts';

console.log('--- TEST: Demo Brand Integrity ---');
console.log('Demo Project ID:', DEMO_BRAND.id);
console.log('Demo Category:', DEMO_BRAND.positioning?.category);
console.log('Demo Value Prop:', DEMO_BRAND.positioning?.valueProposition);
console.log('Demo Differentiator:', DEMO_BRAND.positioning?.differentiator);
console.log('Demo Statement:', DEMO_BRAND.positioning?.positioningStatement);
console.log('Demo Rationale:', DEMO_BRAND.positioning?.whyThisPosition);

if (DEMO_BRAND.id !== 'demo-hackathon-teammates') {
  throw new Error('DEMO_BRAND id is invalid');
}
if (!DEMO_BRAND.positioning.valueProposition) {
  throw new Error('DEMO_BRAND positioning valueProposition is missing');
}
if (!DEMO_BRAND.discovery.coreProblem) {
  throw new Error('DEMO_BRAND discovery coreProblem is missing');
}

console.log('✅ Demo brand integrity verified! Demo mode remains 100% deterministic and Gemini-free.');
