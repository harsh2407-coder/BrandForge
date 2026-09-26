import { GeminiGateway } from '../server/geminiGateway.ts';

const gateway = new GeminiGateway();

// Call the private validateAndNormalizePositioning via any casting
const validate = (json: string) => (gateway as any).validateAndNormalizePositioning(json);

console.log('--- TEST: Positioning Normalization and Validation ---');

// Test 1: Complete valid JSON
const validPayload = JSON.stringify({
  category: 'Urban Agriculture Tool Sharing Platform',
  selectedTerritoryId: 'rec-1',
  positioningRationale: 'Directly solves the seasonal capital overhead blocker for urban growers while avoiding high commercial rental contracts.',
  positioningStatement: 'For community growers who need seasonal equipment without ownership debt, GreenShare is the hyper-local gear exchange that delivers verified machinery on demand.',
  valueProposition: 'Access industrial-grade garden equipment within your neighborhood for a fraction of store rental costs.',
  primaryDifferentiation: 'Peer-to-peer verified custody handoffs with deposit protection rather than commercial day-rate contracts.',
  keyPillars: [
    'Zero idle asset waste',
    'Neighborhood-level trust escrow',
    'Seasonal on-demand availability'
  ],
  xAxis: {
    lowLabel: 'COMMUNITY / DECENTRALIZED',
    highLabel: 'COMMERCIAL / CENTRALIZED'
  },
  yAxis: {
    lowLabel: 'PEER TRUST / MEMBERSHIP',
    highLabel: 'TRANSACTIONAL RENTAL'
  },
  territories: [
    {
      id: 'rec-1',
      name: 'Hyper-Local Neighborhood Co-op',
      description: 'Focuses entirely on hyper-local community growers sharing neighborhood tillers and aerators.',
      x: 82,
      y: 25,
      quadrant: 'Niche + Emotional/Belonging',
      valueProposition: 'Neighbor-to-neighbor verified gardening gear sharing.',
      tradeoff: 'Smaller geographical radius and variable equipment availability.'
    },
    {
      id: 'alt-2',
      name: 'Commercial Gear Depots',
      description: 'Centralized heavy machinery rental hubs.',
      x: 85,
      y: 75,
      quadrant: 'Niche + Functional/Utility',
      valueProposition: 'Guaranteed commercial tractor and tiller availability.',
      tradeoff: 'High capital requirements and lack of neighborhood connection.'
    },
    {
      id: 'alt-3',
      name: 'Casual Tool Classifieds',
      description: 'Broad informal classifieds for all household and lawn tools.',
      x: 20,
      y: 70,
      quadrant: 'Broad + Functional/Utility',
      valueProposition: 'Free peer-to-peer listings of lawnmowers and rakes.',
      tradeoff: 'No damage deposit guarantee or condition verification.'
    }
  ]
});

const result = validate(validPayload);
console.log('Result validated successfully!');
console.log('Territories count:', result.territories.length);
console.log('Selected territory:', result.selectedTerritoryId);
console.log('Key pillars:', result.keyPillars);
console.log('Primary differentiator:', result.primaryDifferentiation);

if (result.territories.length !== 3) throw new Error('Expected 3 territories');
if (result.selectedTerritoryId !== 'rec-1') throw new Error('Expected selectedTerritoryId to be rec-1');
if (!result.primaryDifferentiation) throw new Error('Missing primaryDifferentiation');
if (!result.xAxis || result.xAxis.lowLabel !== 'COMMUNITY / DECENTRALIZED') throw new Error('xAxis lowLabel mismatch');
if (!result.yAxis || result.yAxis.highLabel !== 'TRANSACTIONAL RENTAL') throw new Error('yAxis highLabel mismatch');

// Test 2: Markdown wrapped JSON
const markdownWrapped = '```json\n' + validPayload + '\n```';
const resultMd = validate(markdownWrapped);
if (resultMd.selectedTerritoryId !== 'rec-1') throw new Error('Failed to parse markdown wrapped JSON');
console.log('Markdown wrapped JSON parsed successfully!');

// Test 3: Invalid JSON throws controlled error
try {
  validate('Not a json string');
  throw new Error('Should have thrown on non-JSON');
} catch (e: any) {
  console.log('Controlled error on invalid JSON:', e.message);
  if (!e.message.includes('malformed JSON')) throw e;
}

console.log('✅ All normalization unit tests passed successfully!');
