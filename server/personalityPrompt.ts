import type { DiscoveryData, PositioningData } from '../src/types/brand.js';

export const Type = {
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export const PERSONALITY_SYSTEM_INSTRUCTION = `You are BrandForge's Brand Voice Engine. Formulate brand personality and operational voice from Discovery & Positioning.
RULES:
1. ANTI-GENERIC: Never use cliché traits (Innovative, Friendly, Trustworthy, Modern, Bold, Disruptive). Traits must have behavioral edge.
2. GROUNDING: Never claim unverified capabilities, real-time data feeds, or 100% outcome guarantees.
3. MANDATORY COMPLETENESS & BREVITY: ALL schema fields are REQUIRED and MUST be completed: traits (4), voice (summary, 3 characteristics, 3 toneRules), writingSamples (headline, valueProposition, socialMessage, userExplanation), avoidTraits (3), principles (3), and dimensions (4).
Keep every text field strictly 1-2 concise sentences (under 25 words). Complete the entire schema without truncation.
Return strictly valid JSON matching the schema.`;

export const PERSONALITY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    traits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Trait name.' },
          description: { type: Type.STRING, description: 'One concise sentence: UX and tone expression.' },
          whyItFits: { type: Type.STRING, description: 'One concise sentence: strategic fit with positioning.' },
          evidence: { type: Type.STRING, description: 'One concise sentence: user friction evidence.' },
        },
        required: ['name', 'description', 'whyItFits', 'evidence'],
        additionalProperties: false,
      },
      description: '4 core personality traits.',
    },
    voice: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: '1-2 concise sentences on how brand speaks.' },
        characteristics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              characteristic: { type: Type.STRING, description: 'Characteristic label.' },
              explanation: { type: Type.STRING, description: 'One concise sentence: copy implementation.' },
            },
            required: ['characteristic', 'explanation'],
            additionalProperties: false,
          },
          description: '3 core voice characteristics.',
        },
        toneRules: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              do: { type: Type.STRING, description: 'Concise writing directive.' },
              avoid: { type: Type.STRING, description: 'Concise avoid directive.' },
              example: { type: Type.STRING, description: 'One realistic in-context sentence.' },
            },
            required: ['do', 'avoid', 'example'],
            additionalProperties: false,
          },
          description: '3 actionable tone rules.',
        },
      },
      required: ['summary', 'characteristics', 'toneRules'],
      additionalProperties: false,
      description: 'Brand voice guidelines.',
    },
    writingSamples: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING, description: 'Short headline in voice (<10 words).' },
        valueProposition: { type: Type.STRING, description: 'One clear value proposition sentence.' },
        socialMessage: { type: Type.STRING, description: 'Short social post in voice (<25 words).' },
        userExplanation: { type: Type.STRING, description: 'One user-facing explanatory microcopy sentence.' },
      },
      required: ['headline', 'valueProposition', 'socialMessage', 'userExplanation'],
      additionalProperties: false,
      description: 'Four calibration writing samples.',
    },
    avoidTraits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Anti-archetype name.' },
          reasonToAvoid: { type: Type.STRING, description: 'One concise sentence: why this destroys trust.' },
          description: { type: Type.STRING, description: 'One concise sentence: how this mistake manifests.' },
        },
        required: ['name', 'reasonToAvoid', 'description'],
        additionalProperties: false,
      },
      description: '3 traits to avoid.',
    },
    principles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Principle title.' },
          statement: { type: Type.STRING, description: 'One concise operational rule sentence.' },
          implication: { type: Type.STRING, description: 'One concise sentence: product/copy consequence.' },
        },
        required: ['name', 'statement', 'implication'],
        additionalProperties: false,
      },
      description: '3 brand principles.',
    },
    dimensions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dimension: { type: Type.STRING, description: 'Spectrum name.' },
          value: { type: Type.INTEGER, description: 'Score 0-100.' },
          lowLabel: { type: Type.STRING, description: '0% pole label.' },
          highLabel: { type: Type.STRING, description: '100% pole label.' },
          rationale: { type: Type.STRING, description: 'One concise sentence rationale.' },
        },
        required: ['dimension', 'value', 'lowLabel', 'highLabel', 'rationale'],
        additionalProperties: false,
      },
      description: '4 personality spectrums (0-100).',
    },
  },
  required: [
    'traits',
    'voice',
    'writingSamples',
    'avoidTraits',
    'principles',
    'dimensions',
  ],
  additionalProperties: false,
};

export function buildPersonalityPrompt(
  roughIdea: string,
  discovery: DiscoveryData,
  positioning: PositioningData,
  projectName?: string
): string {
  const alts = (discovery.currentAlternatives || []).slice(0, 3).join(', ');
  const pillars = (positioning.keyPillars || []).slice(0, 3).join('; ');

  return `Formulate strategic brand personality and voice system.

Brand: ${projectName && projectName !== 'My New Brand' ? projectName : 'BrandForge Venture'}
Idea: ${roughIdea}

UPSTREAM STRATEGY:
- Problem: ${discovery.coreProblem}
- Audience: ${discovery.primaryAudience}
- User Friction: ${discovery.userContext}
- Core Need: ${discovery.coreNeed}
${alts ? `- Alternatives: ${alts}\n` : ''}- Category: ${positioning.category}
- Target Segment: ${positioning.targetSegment}
- Value Prop: ${positioning.valueProposition}
- Wedge: ${positioning.primaryDifferentiation || positioning.differentiator}
- Statement: ${positioning.positioningStatement}
${pillars ? `- Pillars: ${pillars}\n` : ''}
REQUIREMENTS:
1. ANTI-GENERIC: No buzzwords. Distinctive behavioral edge.
2. GROUNDING: No unverified databases or absolute outcome guarantees.
3. CONCISENESS & COMPLETENESS: Every text field must be 1-2 sentences (<25 words). Complete ALL required fields: traits (4), voice (summary, 3 characteristics, 3 toneRules), writingSamples (headline, valueProposition, socialMessage, userExplanation), avoidTraits (3), principles (3), and dimensions (4).

Return strictly valid JSON matching the schema.`;
}
