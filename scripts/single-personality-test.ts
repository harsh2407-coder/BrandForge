import { GeminiGateway } from '../server/geminiGateway.js';
import dotenv from 'dotenv';
dotenv.config();

const gateway = new GeminiGateway();

async function run() {
  console.log('Testing single live personality call to gemini-3.8-flash...');
  try {
    const res = await gateway.generatePersonality({
      roughIdea: 'Peer-to-peer neighborhood sharing of commercial urban farming equipment',
      projectName: 'GreenShare',
      discovery: {
        coreProblem: 'Urban micro-growers cannot afford $2,000 commercial tillers, leaving productive urban land fallow.',
        primaryAudience: 'Neighborhood community garden leaders and urban agriculture cooperatives.',
        userContext: 'Spring soil preparation window lasting 3 weeks; rental companies require multi-day commitments.',
        coreNeed: 'Affordable, verified peer-to-peer equipment sharing with neighborhood custody escrow.',
        currentAlternatives: ['Commercial heavy equipment rental depots', 'Classifieds with zero escrow'],
        assumptions: [{ id: 'asm-1', statement: 'Growers are willing to share expensive tillers if escrowed.', riskLevel: 'high', validationTip: 'Survey 10 farms.' }],
        openQuestions: [{ id: 'q-1', question: 'How to handle mechanical breakdown?', strategicWhy: 'Determines insurance reserve.' }],
        isConfirmed: true,
      },
      positioning: {
        category: 'Hyper-Local Urban Agricultural Equipment Sharing & Escrow Platform',
        targetSegment: 'Urban growers and neighborhood community farm coordinators in dense metropolitan areas.',
        valueProposition: 'Access commercial-grade urban farming tools within your neighborhood for an 80% cost reduction with verified damage escrow.',
        differentiator: 'Neighborhood-level custody verification and escrowed micro-deposits instead of commercial lease agreements.',
        positioningStatement: 'For community growers who need seasonal equipment without ownership debt, GreenShare is the hyper-local gear exchange that delivers verified machinery on demand.',
        whyThisPosition: 'Commercial incumbents ignore neighborhood-scale micro-leasing because transaction values are too small; classifieds lack deposit escrow. Owning this trust wedge solves both.',
        selectedTerritoryId: 'territory-1',
        keyPillars: ['Zero idle asset waste', 'Neighborhood trust escrow', 'Seasonal on-demand availability'],
        isConfirmed: true,
      }
    });

    console.log('=== REAL GEMINI CALL SUCCEEDED! ===');
    console.log('Traits:', res.traits.map(t => `${t.name} -> reason: ${t.strategicReason}`));
    console.log('Avoid Traits:', res.traitsToAvoid.map(a => `${a.name || a.trait}: ${a.reasonToAvoid || a.reason}`));
    console.log('Brand Principles:', (res.brandPrinciples || []).map(p => `${p.name}: ${p.statement} (Imp: ${p.implication})`));
    console.log('Dimensions:', (res.dimensions || []).map(d => `${d.dimension}: ${d.value}% (${d.lowLabel} <-> ${d.highLabel})`));
    console.log('Voice Summary:', res.voice?.summary);
    console.log('Tone Rules:', res.voice?.toneRules);
    console.log('Writing Samples:', res.writingSamples);
  } catch (err: any) {
    console.log('=== REAL GEMINI CALL RESULT ===');
    console.log('Error message:', err.message);
  }
}

run();
