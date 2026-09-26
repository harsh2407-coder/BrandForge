import type { DiscoveryData, PositioningData } from '../src/types/brand.js';

export const Type = {
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export const PERSONALITY_SYSTEM_INSTRUCTION = `You are the BrandForge Strategic Personality & Brand Voice Engine, an elite venture brand psychologist and brand voice architect.
Your mission is to formulate a defensible, psychologically grounded brand personality and operational voice system strictly derived from verified Discovery data and selected Positioning decisions.

CRITICAL ARCHITECTURAL PRINCIPLE:
Personality is NOT an arbitrary set of cosmetic adjectives. It is a system of behavioral heuristics and communication rules that guide how the brand behaves, speaks, makes tradeoffs, and earns user trust.
Personality MUST be downstream of both Discovery and Positioning:
1. DISCOVERY FIT: Grounded in the core problem, user context, emotional vulnerabilities, and unmet core needs.
2. POSITIONING FIT: Directly harmonized with the chosen category, value proposition, strategic territory, and key pillars.
3. AUDIENCE FIT: Calibrated to resonate with the specific beachhead segment without condescension or disconnect.
4. DIFFERENTIATION FIT: Reinforcing what makes copying this brand irrational.

CRITICAL RULES:
1. ANTI-GENERIC MANDATE:
   - Absolutely NEVER produce cliché, generic traits such as "Innovative", "Friendly", "Professional", "Trustworthy", "Authentic", "Bold", "Disruptive", "Modern", "Cutting-edge", or "User-centric".
   - Traits must have point of view, behavioral edge, and strategic nuance (e.g., "Radical Intellectual Candor", "Gritty Pragmatism", "Quiet Precision", "Collegiate Kineticism").
   - Every trait must include strategic reasoning showing WHY it solves the specific discovery tension and reinforces the positioning.
2. TRAITS TO AVOID (ANTI-ARCHETYPES):
   - Generate 3 to 4 traits or behavioral patterns the brand must explicitly avoid or quarantine.
   - These must be the logical failure modes or negative polarities of the chosen positioning and audience trust model (e.g., if technical & high-craft, avoid "Hype-driven vaporware jargon" and "Corporate patronizing hand-holding").
3. OPERATIONAL BRAND PRINCIPLES:
   - Generate 3 to 5 non-negotiable principles.
   - Principles must be actionable decision-making heuristics (e.g., "Clarity over cleverness", "Proof before promise", "Frictionless time-to-value").
   - Include the practical implication of each principle on future brand/product choices.
4. DYNAMIC PERSONALITY DIMENSIONS (SPECTRUMS):
   - Generate 4 to 6 contextual spectrums (0 to 100) reflecting the brand's unique behavioral posture.
   - Tailor the dimensions to this specific industry and audience rather than using identical generic axes.
   - Examples: "Sparse & Telegraphic (0) ↔ Narrative & Expressive (100)", "Understated Restraint (0) ↔ Kinetic Provocation (100)", "Methodical Engineering (0) ↔ Creative Improvisation (100)".
5. BRAND VOICE SYSTEM & CONCRETE TONE RULES:
   - Voice summary: A concise, evocative description of how the brand speaks.
   - 3 to 5 voice characteristics with clear operational explanations.
   - 3 to 4 tone rules with explicit "do", "avoid", and realistic in-context "example".
6. CALIBRATION WRITING SAMPLES:
   - Provide concrete, publication-grade writing samples demonstrating the voice in action:
     * Short headline
     * Product/value proposition sentence
     * Short social-style message
     * User-facing explanation
   - The writing samples must directly speak to the real product context, not placeholder generic copy.
7. GROUNDING & FEASIBILITY INTEGRITY (NO INVENTED CAPABILITIES OR ABSOLUTE OUTCOMES):
   - Voice, principles, and writing samples must NEVER assert unverified product capabilities, infrastructure, partnerships, or data as existing facts.
   - Do NOT claim the product currently has a verified database, real-time data feeds, exclusive partnerships, automated eligibility guarantees, an AI assistant, or existing user scale.
   - Do NOT use absolute outcome claims ("guarantees you win scholarships", "100% eligibility", "eliminates all guesswork", "guarantees funding", "ensures eligibility").
   - Voice can convey confidence, empathy, and clarity, but must remain grounded in the reality of an online discovery platform helping students search and filter opportunities.
8. Return strictly valid JSON adhering to the provided schema.`;

export const PERSONALITY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    traits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Specific, non-generic personality trait name (e.g., "Intellectual Candor", "Quiet Precision").' },
          description: { type: Type.STRING, description: 'What this trait looks and feels like in brand behavior.' },
          strategicReason: { type: Type.STRING, description: 'Strategic justification explaining why this trait follows from Discovery problem and Positioning wedge.' },
          whyItFits: { type: Type.STRING, description: 'Concise explanation of why this trait fits the brand ethos.' },
          evidence: { type: Type.STRING, description: 'Audience psychological evidence or user context justifying this trait.' },
        },
        required: ['name', 'description', 'strategicReason', 'whyItFits', 'evidence'],
        additionalProperties: false,
      },
      description: '4 to 5 distinct, deeply justified core personality traits.',
    },
    avoidTraits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Name of the anti-archetype or behavior to avoid (e.g., "Corporate Platitudes", "Pedantic Jargon").' },
          description: { type: Type.STRING, description: 'How this anti-trait manifests when brands make mistakes.' },
          reasonToAvoid: { type: Type.STRING, description: 'Why this behavior breaks trust with the target beachhead audience.' },
          trait: { type: Type.STRING, description: 'Short label of the trait to avoid.' },
          reason: { type: Type.STRING, description: 'Short reason to avoid.' },
        },
        required: ['name', 'description', 'reasonToAvoid', 'trait', 'reason'],
        additionalProperties: false,
      },
      description: '3 to 4 traits or behaviors the brand must explicitly avoid.',
    },
    principles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Short title of the principle (e.g., "Clarity Over Cleverness").' },
          statement: { type: Type.STRING, description: 'The operational rule or doctrine.' },
          implication: { type: Type.STRING, description: 'Concrete consequence for future product, design, or copy decisions.' },
        },
        required: ['name', 'statement', 'implication'],
        additionalProperties: false,
      },
      description: '3 to 5 operational, non-negotiable brand principles.',
    },
    dimensions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dimension: { type: Type.STRING, description: 'Dimension name (e.g., "Communication Density", "Tone Energy").' },
          value: { type: Type.INTEGER, description: 'Position on spectrum from 0 to 100.' },
          lowLabel: { type: Type.STRING, description: 'Label for 0% end (e.g., "Telegraphic & Minimal").' },
          highLabel: { type: Type.STRING, description: 'Label for 100% end (e.g., "Expansive & Narrative").' },
          rationale: { type: Type.STRING, description: 'Why the brand is positioned at this score.' },
        },
        required: ['dimension', 'value', 'lowLabel', 'highLabel', 'rationale'],
        additionalProperties: false,
      },
      description: '4 to 6 tailored personality spectrums with calibrated scores (0-100).',
    },
    voice: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: 'Evocative summary of how the brand speaks and sounds.' },
        characteristics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              characteristic: { type: Type.STRING, description: 'Voice characteristic label (e.g., "Direct & Unvarnished").' },
              explanation: { type: Type.STRING, description: 'How to implement this characteristic in copy.' },
            },
            required: ['characteristic', 'explanation'],
            additionalProperties: false,
          },
          description: '3 to 5 core voice characteristics.',
        },
        toneRules: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              do: { type: Type.STRING, description: 'Clear instruction on what to write or communicate.' },
              avoid: { type: Type.STRING, description: 'Clear instruction on what to avoid.' },
              example: { type: Type.STRING, description: 'Realistic in-context sentence demonstrating this rule.' },
            },
            required: ['do', 'avoid', 'example'],
            additionalProperties: false,
          },
          description: '3 to 4 actionable writing tone rules.',
        },
      },
      required: ['summary', 'characteristics', 'toneRules'],
      additionalProperties: false,
      description: 'Structured brand voice guidelines.',
    },
    writingSamples: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING, description: 'One high-impact headline calibrated to the voice.' },
        valueProposition: { type: Type.STRING, description: 'One clear product/value proposition sentence in voice.' },
        socialMessage: { type: Type.STRING, description: 'One short social-style announcement or post in voice.' },
        userExplanation: { type: Type.STRING, description: 'One user-facing explanatory microcopy sample in voice.' },
      },
      required: ['headline', 'valueProposition', 'socialMessage', 'userExplanation'],
      additionalProperties: false,
      description: 'Real calibration writing samples demonstrating the voice.',
    },
  },
  required: [
    'traits',
    'avoidTraits',
    'principles',
    'dimensions',
    'voice',
    'writingSamples',
  ],
  additionalProperties: false,
};

export function buildPersonalityPrompt(
  roughIdea: string,
  discovery: DiscoveryData,
  positioning: PositioningData,
  projectName?: string
): string {
  let prompt = `You are formulating the strategic personality and voice system for a new venture brand.\n\n`;
  if (projectName && projectName !== 'My New Brand') {
    prompt += `Working Brand Name: ${projectName}\n`;
  }
  prompt += `Foundational Idea: ${roughIdea}\n\n`;

  prompt += `=== VERIFIED DISCOVERY DATA (UPSTREAM CONTEXT) ===\n`;
  prompt += `Core Problem: ${discovery.coreProblem}\n`;
  prompt += `Primary Beachhead Audience: ${discovery.primaryAudience}\n`;
  prompt += `User High-Friction Context: ${discovery.userContext}\n`;
  prompt += `Core Unmet Need: ${discovery.coreNeed}\n`;
  prompt += `Current Alternatives & Competitors:\n`;
  (discovery.currentAlternatives || []).forEach((alt, i) => {
    prompt += `  ${i + 1}. ${alt}\n`;
  });

  if (discovery.assumptions && discovery.assumptions.length > 0) {
    prompt += `Key Strategic Assumptions:\n`;
    discovery.assumptions.forEach((asm, i) => {
      prompt += `  ${i + 1}. [Risk: ${asm.riskLevel}] ${asm.statement}\n`;
    });
  }

  prompt += `\n=== VERIFIED POSITIONING DATA (STRATEGIC FOUNDATION) ===\n`;
  prompt += `Market Category: ${positioning.category}\n`;
  prompt += `Target Segment: ${positioning.targetSegment}\n`;
  prompt += `Value Proposition: ${positioning.valueProposition}\n`;
  prompt += `Core Differentiator: ${positioning.primaryDifferentiation || positioning.differentiator}\n`;
  prompt += `Positioning Statement: ${positioning.positioningStatement}\n`;
  prompt += `Strategic Rationale: ${positioning.positioningRationale || positioning.whyThisPosition}\n`;

  if (positioning.keyPillars && positioning.keyPillars.length > 0) {
    prompt += `Key Value Pillars:\n`;
    positioning.keyPillars.forEach((p, i) => {
      prompt += `  ${i + 1}. ${p}\n`;
    });
  }

  if (positioning.territories && positioning.territories.length > 0) {
    const selected = positioning.territories.find(t => t.id === positioning.selectedTerritoryId) || positioning.territories[0];
    prompt += `Selected Strategic Territory: "${selected.name}"\n`;
    prompt += `Territory Value Prop: ${selected.valueProposition}\n`;
    prompt += `Territory Tradeoff (What is sacrificed): ${selected.tradeoff}\n`;
  }

  prompt += `\n=== CRITICAL GROUNDING & ANTI-GENERIC REQUIREMENTS ===
1. STRICT ANTI-GENERIC MANDATE:
   - Do NOT use generic buzzword traits (e.g., "Innovative", "Friendly", "Professional", "Trustworthy", "Authentic", "Bold", "Disruptive", "Cutting-edge", "Modern", "User-centric").
   - Traits must be behaviorally distinctive (e.g. "Pragmatic Rigor", "Radical Candor", "Quiet Precision") with clear strategic reasoning connecting them to the Discovery tension and Positioning wedge.

2. DO NOT ASSERT UNVERIFIED PRODUCT CAPABILITIES:
   - The brand currently is an online discovery platform helping students discover scholarships.
   - Do NOT assert unbuilt features as present facts (no "verified database", no "real-time feeds", no "exclusive partnerships", no "automated qualification guarantees").
   - Prohibit absolute outcome promises (do NOT use "guarantees", "100%", "only qualified awards", "eliminates guesswork", "ensures success").
   - Writing samples must reflect real, grounded brand voice without inventing existing institutional data or guarantees.

TASK:
Based strictly on the Discovery and Positioning findings above:
1. Synthesize 4 to 5 non-generic Personality Traits. For every trait, articulate both what it feels like and the exact strategicReason connecting it to the discovery problem and positioning wedge.
2. Define 3 to 4 explicit Traits to Avoid (anti-archetypes) that represent acute failure modes for this specific audience.
3. Formulate 3 to 5 operational Brand Principles with clear statements and practical implications for future decisions.
4. Establish 4 to 6 tailored Personality Dimensions with calibrated 0-100 scores and contrasting pole labels.
5. Create a structured Voice System featuring an evocative summary, 3 to 5 voice characteristics, and 3 to 4 actionable tone rules (do, avoid, concrete in-context example).
6. Provide 4 concrete Calibration Writing Samples (headline, value proposition sentence, social message, user explanation) that demonstrate the voice in practice.
7. Return strictly valid JSON adhering to the specified schema.`;

  return prompt;
}
