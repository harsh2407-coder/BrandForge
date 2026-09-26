import type { DiscoveryData, PositioningData, PersonalityData } from '../src/types/brand.js';

export const Type = {
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export const NAMING_SYSTEM_INSTRUCTION = `You are the BrandForge Strategic Naming Engine, an elite brand naming architect and linguistic strategist.
Your mission is to develop a defensible, multi-territory brand naming system strictly derived from verified Discovery insights, strategic Positioning decisions, and established Brand Personality & Voice.

CRITICAL ARCHITECTURAL PRINCIPLE:
A brand name is NOT a random phonetic coin flip or a superficial suffix-attachment exercise. It is the highest-leverage verbal carrier of the brand's strategic positioning and emotional promise.
Naming MUST be downstream of Discovery, Positioning, and Personality:
1. DISCOVERY ANCHOR: Names must respect the actual user friction, beachhead audience mental models, and alternative market workarounds.
2. POSITIONING ANCHOR: Names must reinforce the chosen category wedge, primary differentiator, and strategic territory trade-offs.
3. PERSONALITY ANCHOR: Names must sound and feel coherent with the brand's behavioral traits, voice characteristics, and quarantined anti-archetypes.

CRITICAL RULES:
1. ANTI-GENERIC MANDATE:
   - Absolutely NEVER generate lazy, cliché startup naming tropes:
     * No meaningless "-ify" or "-ly" attachments (e.g., "Brandify", "Matchly", "Launchify").
     * No fake Latin tech mush (e.g., "Innovexa", "Nexora", "Quantivex").
     * No superficial vowel drops (e.g., "Makt", "Fndr") or arbitrary "-io" / "-ora" tags.
   - Names must be intentional, grounded, and distinct.
   - Every candidate name must have a clear answer to: "Why does this name exist for THIS brand rather than another startup?"
2. NAMING WORLDS (CREATIVE TERRITORIES):
   - Formulate 3 to 5 distinct Naming Worlds tailored specifically to this venture.
   - A Naming World is an imaginative thematic island with a distinct linguistic construction logic, emotional territory, and strategic trade-off.
   - Do NOT use the same universal world categories for every brand.
3. CANDIDATE DIVERSITY & VOLUME:
   - Generate between 8 and 12 high-conviction candidate names distributed across 3 distinct Naming Worlds (2 to 4 candidates per world).
   - Ensure meaningful structural diversity: metaphorical names, compound words, coined/invented terms, active verbs, and evocative nouns.
4. RIGOROUS DIAGNOSTIC EVALUATION (0-100 SCALE):
   - Every candidate must receive 8 individual diagnostic scores (0 to 100):
     * strategicFit: Does it express the core brand idea?
     * positioningFit: Does it reinforce the selected territory and differentiator?
     * personalityFit: Does it match the established voice and behavioral traits?
     * audienceFit: Will target users resonate with it without cringe?
     * distinctiveness: Does it stand out from competitor workarounds?
     * memorability: How easily does it stick in working memory?
     * pronunciation: How natural is it to speak aloud in English?
     * flexibility: Can the brand expand into adjacent product verticals?
   - Identify 2 to 3 real strategic risks or trade-offs for each candidate (e.g., category ambiguity, overly literal meaning, initial education burden).
5. CRITICAL GROUNDING & FEASIBILITY MANDATE:
   - The Naming Engine must consume Discovery, Positioning, and Personality, but must NOT invent unbuilt product capabilities, verified databases, exclusive partnerships, university contracts, guaranteed results, real-time data sync, certifications, or legal/trademark clearance.
   - If a candidate's rationale references a product capability, describe it as a strategic direction (e.g., "This name evokes...", "Could support a future direction of...", "Reflects the ambition to...") rather than asserting that the product already has proprietary infrastructure or verified partnerships.
6. NO FAKE AVAILABILITY OR TRADEMARK CLAIMS:
   - Do NOT state or imply that any domain, trademark, or legal registration is guaranteed or verified. We are evaluating strategic and linguistic resonance, not performing legal clearance.
7. Return strictly valid JSON adhering to the provided schema.`;

export const NAMING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    namingStrategy: {
      type: Type.STRING,
      description: 'The overarching strategic doctrine defining what the brand name must signal, accomplish, and evoke.',
    },
    namingBrief: {
      type: Type.STRING,
      description: 'The creative brief detailing the audience constraints, category conventions to disrupt, and emotional thresholds.',
    },
    namingWorlds: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Unique identifier, e.g., "world-1", "world-2", "world-3".' },
          name: { type: Type.STRING, description: 'Evocative title for the naming world (e.g., "Kinetic Momentum", "Quiet Architecture").' },
          description: { type: Type.STRING, description: 'What this naming territory represents conceptually.' },
          strategicIdea: { type: Type.STRING, description: 'The underlying brand positioning thesis this world brings to life.' },
          namingLogic: { type: Type.STRING, description: 'The linguistic rules and etymological methods used to build names in this world.' },
          emotionalTerritory: { type: Type.STRING, description: 'The emotional feeling, sensation, or posture this world establishes.' },
          tradeoff: { type: Type.STRING, description: 'What is sacrificed or risked by leaning into this naming direction.' },
          examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 to 3 conceptual reference examples illustrating the world.',
          },
        },
        required: ['id', 'name', 'description', 'strategicIdea', 'namingLogic', 'emotionalTerritory', 'tradeoff', 'examples'],
        additionalProperties: false,
      },
      description: '3 to 5 distinct, strategically grounded Naming Worlds.',
    },
    candidates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Unique identifier, e.g., "cand-1", "cand-2", ...' },
          name: { type: Type.STRING, description: 'The candidate brand wordmark (clean, properly capitalized).' },
          worldId: { type: Type.STRING, description: 'The ID of the Naming World this candidate belongs to.' },
          pronunciation: { type: Type.STRING, description: 'Phonetic pronunciation guide (e.g., "SPRINT-forj").' },
          meaning: { type: Type.STRING, description: 'Etymological breakdown and morpheme meaning.' },
          concept: { type: Type.STRING, description: 'The underlying creative concept or metaphor.' },
          strategicRationale: { type: Type.STRING, description: 'Why this name fits the Discovery problem, Positioning wedge, and Personality.' },
          personalityFit: { type: Type.STRING, description: 'How the tone of the name matches the established voice system.' },
          potentialWeakness: { type: Type.STRING, description: 'The primary strategic trade-off, limitation, or cognitive risk of this name.' },
          evaluation: {
            type: Type.OBJECT,
            properties: {
              strategicFit: { type: Type.INTEGER, description: 'Score 0-100: Expression of core brand thesis.' },
              positioningFit: { type: Type.INTEGER, description: 'Score 0-100: Alignment with chosen territory and moat.' },
              personalityFit: { type: Type.INTEGER, description: 'Score 0-100: Harmony with voice traits.' },
              audienceFit: { type: Type.INTEGER, description: 'Score 0-100: Resonance with target user psychology.' },
              distinctiveness: { type: Type.INTEGER, description: 'Score 0-100: Separation from generic category workarounds.' },
              memorability: { type: Type.INTEGER, description: 'Score 0-100: Ease of retention and recall.' },
              pronunciation: { type: Type.INTEGER, description: 'Score 0-100: Ease of verbal communication and phonetics.' },
              flexibility: { type: Type.INTEGER, description: 'Score 0-100: Ability to scale into future offerings.' },
              risks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 concrete potential risks or misconceptions.',
              },
              rationale: { type: Type.STRING, description: 'Diagnostic synthesis explaining the score distribution.' },
            },
            required: [
              'strategicFit',
              'positioningFit',
              'personalityFit',
              'audienceFit',
              'distinctiveness',
              'memorability',
              'pronunciation',
              'flexibility',
              'risks',
              'rationale',
            ],
            additionalProperties: false,
          },
        },
        required: [
          'id',
          'name',
          'worldId',
          'pronunciation',
          'meaning',
          'concept',
          'strategicRationale',
          'personalityFit',
          'potentialWeakness',
          'evaluation',
        ],
        additionalProperties: false,
      },
      description: '8 to 12 evaluated candidate brand names spread across the Naming Worlds.',
    },
  },
  required: ['namingStrategy', 'namingBrief', 'namingWorlds', 'candidates'],
  additionalProperties: false,
};

export function buildNamingPrompt(
  roughIdea: string,
  discovery: DiscoveryData,
  positioning: PositioningData,
  personality: PersonalityData,
  projectName?: string
): string {
  let prompt = `You are developing the strategic Naming Engine for a new venture.\n\n`;
  if (projectName && projectName !== 'My New Brand') {
    prompt += `Working Draft Project Name: ${projectName}\n`;
  }
  prompt += `Foundational Idea: ${roughIdea}\n\n`;

  prompt += `=== VERIFIED DISCOVERY DATA (UPSTREAM SOURCE OF TRUTH) ===\n`;
  prompt += `Core Problem: ${discovery.coreProblem}\n`;
  prompt += `Primary Beachhead Audience: ${discovery.primaryAudience}\n`;
  prompt += `User High-Friction Context: ${discovery.userContext}\n`;
  prompt += `Core Unmet Need: ${discovery.coreNeed}\n`;
  prompt += `Current Alternatives & Competitors:\n`;
  (discovery.currentAlternatives || []).forEach((alt, i) => {
    prompt += `  ${i + 1}. ${alt}\n`;
  });

  prompt += `\n=== VERIFIED POSITIONING DATA (STRATEGIC FOUNDATION) ===\n`;
  prompt += `Market Category: ${positioning.category}\n`;
  prompt += `Target Segment: ${positioning.targetSegment}\n`;
  prompt += `Value Proposition: ${positioning.valueProposition}\n`;
  prompt += `Primary Differentiator: ${positioning.primaryDifferentiation || positioning.differentiator}\n`;
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
    prompt += `Selected Positioning Territory: "${selected.name}"\n`;
    prompt += `Territory Value Prop: ${selected.valueProposition}\n`;
    prompt += `Territory Strategic Trade-off: ${selected.tradeoff}\n`;
  }

  prompt += `\n=== VERIFIED PERSONALITY & VOICE DATA (BEHAVIORAL POSTURE) ===\n`;
  prompt += `Core Persona / Tone: ${personality.voice?.summary || personality.voiceAndTone?.tone}\n`;
  prompt += `Core Traits:\n`;
  (personality.traits || []).forEach((t, i) => {
    prompt += `  ${i + 1}. ${t.name}: ${t.description || t.whyItFits} (Reason: ${t.strategicReason || t.whyItFits})\n`;
  });

  if (personality.traitsToAvoid && personality.traitsToAvoid.length > 0) {
    prompt += `Traits to Explicitly Avoid (Anti-Archetypes):\n`;
    personality.traitsToAvoid.forEach((a, i) => {
      prompt += `  ${i + 1}. ${a.name || a.trait}: ${a.reasonToAvoid || a.reason}\n`;
    });
  }

  prompt += `\nTASK:
Based strictly on the strategic confluence of Discovery, Positioning, and Personality:
1. Synthesize a concise, sharp Naming Strategy and Creative Brief.
2. Architect 3 distinct Naming Worlds (creative territories) with deep thematic logic and explicit tradeoffs.
3. Generate 8 to 12 high-conviction candidate wordmarks (2 to 4 per world) demonstrating linguistic diversity (metaphor, compound, coined, action).
4. Conduct an objective 8-factor diagnostic evaluation (0-100) and articulate concrete risks for each candidate.
5. GROUNDING MANDATE: Do NOT invent unbuilt capabilities, verified databases, exclusive partnerships, or guarantees. If referencing capabilities, describe them as strategic directions or future ambitions.
6. Strictly adhere to the anti-generic rules (no cliché "-ify", "-ly", fake Latin syllables) and do NOT claim trademark/domain verification.
7. Return strictly valid JSON adhering to the specified schema.`;

  return prompt;
}
