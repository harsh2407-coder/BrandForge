import type {
  DiscoveryData,
  PositioningData,
  PersonalityData,
  NamingData,
  VisualData,
  ChallengeData
} from '../src/types/brand.js';

export const Type = {
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export const DELIVER_SYSTEM_INSTRUCTION = `You are the BrandForge Creative Partner and Chief Strategy Officer delivering the final Brand System.
Your mission is to transform the accumulated BrandMemory (Discovery, Positioning, Personality, Naming, Visual, and Challenge resolutions) into an authoritative, launch-ready messaging and executive synthesis.

CRITICAL ARCHITECTURAL MANDATES:
1. BrandMemory IS THE ABSOLUTE SOURCE OF TRUTH:
   - Do NOT reinvent the brand from scratch.
   - Do NOT ignore upstream human decisions from the Challenge Engine. If an accepted finding revised the value proposition or warned against overpromising current capabilities (e.g., eligibility-filtering, proprietary partnerships, automated data feeds), strictly follow the REVISED, GROUNDED formulation.
   - Use the selected brand name. Do NOT invent a different name.

2. STRICT GROUNDING & ANTI-HALLUCINATION RULES:
   - Do NOT introduce unverified claims: "thousands of users", "real-time verified databases", "100% accuracy guarantees", "exclusive partnerships", "proprietary algorithms", or "certified clearance".
   - Ground all copy in what the product actually addresses as established in Discovery and Positioning.
   - Speak in the established brand voice, personality traits, and tone heuristics defined in Step 4.

3. DELIVER AS A COHERENT BRAND ARTIFACT:
   - The headline, subheadline, one-line pitch, and announcement must feel like a unified creative work.
   - Avoid generic AI buzzwords: no "revolutionize", "seamlessly empowers", "game-changer", "unleash", "cutting-edge".
   - Return strictly valid JSON matching the requested schema.`;

export const DELIVER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: 'High-impact primary conversion headline (6 to 12 words) embodying the positioning wedge.',
    },
    subheadline: {
      type: Type.STRING,
      description: 'Supportive subheadline clarifying the exact audience and value proposition without unsupported claims.',
    },
    oneLinePitch: {
      type: Type.STRING,
      description: 'A razor-sharp, memorable one-line pitch summarizing category, audience, and key outcome.',
    },
    productDescription: {
      type: Type.STRING,
      description: 'Concise paragraph (2 to 3 sentences) explaining how the product works and what problem it eliminates.',
    },
    primaryCta: {
      type: Type.STRING,
      description: 'Action-oriented primary call-to-action button copy (e.g. "Find your matches in 3 minutes").',
    },
    secondaryCta: {
      type: Type.STRING,
      description: 'Low-friction secondary call-to-action (e.g. "Explore the scholarship directory").',
    },
    launchAnnouncement: {
      type: Type.STRING,
      description: 'Founder launch announcement letter (3 to 4 paragraphs) speaking directly to the beachhead audience.',
    },
    socialPost: {
      type: Type.OBJECT,
      properties: {
        platform: { type: Type.STRING, description: 'Target platform: "X / LinkedIn"' },
        text: { type: Type.STRING, description: 'Punchy social announcement post formatted with linebreaks and clear hook.' },
      },
      required: ['platform', 'text'],
      additionalProperties: false,
    },
    whyThisMessagingWorks: {
      type: Type.STRING,
      description: 'Strategic rationale explaining how this messaging reflects Discovery pain points, Positioning wedge, and Voice tone rules.',
    },
    executiveSummary: {
      type: Type.STRING,
      description: 'Concise executive summary answering what this brand is, who it is for, what problem it solves, what it promises, and why it is distinctive.',
    },
    brandEssence: {
      type: Type.STRING,
      description: 'A 1 to 2 sentence synthesis unifying problem, audience, positioning, personality, and visual direction.',
    },
  },
  required: [
    'headline',
    'subheadline',
    'oneLinePitch',
    'productDescription',
    'primaryCta',
    'secondaryCta',
    'launchAnnouncement',
    'socialPost',
    'whyThisMessagingWorks',
    'executiveSummary',
    'brandEssence',
  ],
  additionalProperties: false,
};

export interface BuildDeliverPromptInput {
  roughIdea: string;
  discovery: DiscoveryData;
  positioning: PositioningData;
  personality: PersonalityData;
  naming: NamingData;
  visual: VisualData;
  challenge: ChallengeData;
  projectName?: string;
}

export function buildDeliverPrompt(input: BuildDeliverPromptInput): string {
  const { roughIdea, discovery, positioning, personality, naming, visual, challenge, projectName } = input;

  // Resolve brand name
  let brandName = naming.selectedName?.name;
  if (!brandName && naming.candidates && naming.selectedNameId) {
    brandName = naming.candidates.find(c => c.id === naming.selectedNameId)?.name;
  }
  if (!brandName) {
    brandName = projectName || 'BrandForge System';
  }

  // Extract accepted challenge changes to highlight human decisions
  const acceptedFindings = (challenge.findings || []).filter(f => f.accepted || f.findingStatus === 'accepted');
  const challengeCorrectionsText = acceptedFindings.length > 0
    ? acceptedFindings.map(f => {
        const target = f.proposedChange ? `${f.proposedChange.targetStage}.${f.proposedChange.field}` : (f as any).stageTarget || 'strategy';
        const revised = f.proposedChange ? f.proposedChange.proposedValue : (f.suggestedFix || f.suggestedImprovement);
        return `- Finding: "${f.finding}" -> Corrected in ${target}: "${revised}"`;
      }).join('\n')
    : 'None (no challenge corrections accepted)';

  // Visual highlights
  const visualConcept = visual.creativeDirection?.concept || visual.visualConcept || 'High-contrast modernism';
  const paletteText = (visual.palette || visual.colorSystem?.palette || [])
    .map(p => `${p.name} (${p.hex}, ${p.role})`)
    .join(', ');

  // Personality traits
  const personalityTraits = (personality.traits || []).map(t => t.name).join(', ');
  const avoidTraits = (personality.traitsToAvoid || personality.avoidTraits || []).map(a => a.trait || a.name).join(', ');

  return `ACCUMULATED BRANDMEMORY CONTEXT FOR DELIVER STAGE:

FOUNDER'S ORIGINAL INPUT:
- Rough Idea: "${roughIdea}"
- Project Name: "${projectName || 'Unnamed'}"

SELECTED BRAND NAME:
- Name: "${brandName}"
- Rationale: "${naming.selectedName?.strategicRationale || naming.selectionRationale || 'Positioning fit'}"
- Naming World: "${(naming.selectedName as any)?.territory || (naming.selectedName as any)?.namingWorld || 'Core Territory'}"

STAGE 1: DISCOVERY (VALIDATED):
- Core Problem: "${discovery.coreProblem}"
- Primary Audience: "${discovery.primaryAudience}"
- Core Need: "${discovery.coreNeed}"
- Current Inadequate Alternatives: ${JSON.stringify(discovery.currentAlternatives || [])}

STAGE 2: POSITIONING (ACTIVE STATE WITH CHALLENGE REVISIONS):
- Category: "${positioning.category}"
- Target Segment: "${positioning.targetSegment}"
- Value Proposition: "${positioning.valueProposition}"
- Operational Moat / Differentiator: "${positioning.primaryDifferentiation || positioning.differentiator}"
- Positioning Statement: "${positioning.positioningStatement}"

STAGE 3: PERSONALITY & VOICE:
- Core Traits: ${personalityTraits || 'Purposeful, Clear'}
- Traits to Avoid: ${avoidTraits || 'Corporate jargon'}
- Voice Summary: "${personality.voiceSummary || personality.voice?.summary || personality.voiceAndTone?.summary || 'Direct and grounded'}"
- Tone Rules: ${JSON.stringify(personality.voice?.toneRules || personality.voiceAndTone?.toneRules || [])}

STAGE 4: VISUAL IDENTITY:
- Creative Direction Concept: "${visualConcept}"
- Visual Thesis: "${visual.creativeDirection?.visualThesis || visual.visualThesis || 'Structured clarity'}"
- Palette Tokens: ${paletteText || 'Dark mode obsidian, warm amber accents'}

STAGE 5: ADVERSARIAL CHALLENGE FINDINGS & HUMAN DECISIONS:
The founder and system conducted an adversarial critique. The following corrections were approved:
${challengeCorrectionsText}

TASK:
Synthesize this complete BrandMemory into a coherent, launch-ready Deliver artifact.
Formulate:
1. headline: High-impact conversion headline.
2. subheadline: Supportive subheadline.
3. oneLinePitch: One-line pitch.
4. productDescription: Grounded description (2-3 sentences).
5. primaryCta: Action-oriented button copy.
6. secondaryCta: Low-friction button copy.
7. launchAnnouncement: Founder announcement letter.
8. socialPost: Social post for X / LinkedIn.
9. whyThisMessagingWorks: Explanation of how it bridges discovery, positioning, voice, and challenge fixes.
10. executiveSummary: Concise 6-point strategic summary.
11. brandEssence: 1-2 sentence core brand synthesis.

Return JSON conforming strictly to DELIVER_SCHEMA.`;
}
