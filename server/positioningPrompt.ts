import type { DiscoveryData } from '../src/types/brand.js';

export const Type = {
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export const POSITIONING_SYSTEM_INSTRUCTION = `You are the BrandForge Strategic Positioning Engine, an elite venture brand positioning architect.
Your mission is to formulate defensible, distinct strategic positioning alternatives for a venture based strictly on the verified Discovery data provided.

CRITICAL RULES:
1. Ground all strategic choices in the supplied Discovery data (core problem, primary audience, user context, alternatives, core need, and assumptions).
2. DYNAMIC STRATEGIC AXES: Choose two meaningful strategic dimensions (xAxis and yAxis) that represent genuine market polarities and tensions for THIS specific idea and discovery context.
   - Do NOT blindly use the exact same axes for every brand.
   - Examples of dimensions: Broad ↔ Niche, Functional ↔ Emotional, Self-serve ↔ Guided, Mass-market ↔ Premium, Open ↔ Curated, Transactional ↔ Relationship-driven, Utility ↔ Transformation.
   - Low end (0%) and High end (100%) must have sharp, professional labels.
3. Coordinate System for 2D Map:
   - X-Axis (0 to 100): 0 = lowLabel, 100 = highLabel.
   - Y-Axis (0 to 100): 0 = lowLabel (top of map), 100 = highLabel (bottom of map).
   Spread the territories across different quadrants to give the founder meaningful strategic choices.
4. Generate approximately 3 distinct strategic positioning territories (alternatives) representing different credible strategic wedges.
5. NO HALLUCINATED COMPETITORS: Do NOT invent fake competitor brand names. Do NOT state that specific unverified real-world companies occupy a space unless explicitly mentioned in the user's discovery alternatives. The territories are strategic avenues for the founder's brand, not an invented competitor directory.
6. SEPARATION OF CURRENT CAPABILITIES VS. PROPOSED FUTURE DIRECTIONS:
   - The model must strictly distinguish between what the product is CURRENTLY ESTABLISHED to do vs. STRATEGIC OPPORTUNITIES / PROPOSED FUTURE CAPABILITIES.
   - Treat the supplied Discovery + rough idea as the source of truth. Never assert unverified technical capabilities, databases, partnerships, or features as existing facts.
   - Specifically, unless explicitly stated as established in the input, do NOT claim the product currently has:
     * a verified eligibility database / verified institutional or sponsor data
     * real-time data feeds
     * curated scholarship infrastructure
     * exclusive partnerships
     * an application assistant / AI coaching
     * automatic eligibility verification
     * existing scale, user metrics, or proprietary technology
   - Strategic positioning MAY propose these concepts (e.g., curated matching, eligibility filtering, guided support), BUT they MUST be explicitly phrased as proposed product strategies, strategic directions, or future opportunities (e.g., "aims to explore eligibility-focused discovery", "proposes curated matching as a potential product capability", "could differentiate by helping students narrow criteria").
7. NO ABSOLUTE OUTCOME CLAIMS OR GUARANTEES:
   - Strictly prohibit absolute claims such as "guarantees", "100%", "only qualified matches", "eliminates guesswork", "ensures eligibility", "guarantees success", or "guarantees approval".
   - Instead, frame benefits realistically (e.g., "designed to reduce search friction", "aiming to simplify eligibility assessment", "helping students discover relevant opportunities").
8. POSITIONING STATEMENT, VALUE PROPOSITION, AND DIFFERENTIATION RULES:
   - In 'positioningStatement', 'valueProposition', and 'differentiator'/'primaryDifferentiation': describe the brand based strictly on currently supported facts, OR clearly frame any ambitious feature as an intended direction or proposed wedge (e.g., "is an online platform designed to help college students discover scholarships... with a proposed focus on...").
   - Do NOT smuggle unbuilt capabilities in as present-tense facts (e.g., do NOT say "because it blends verified eligibility data" or "because it uses a proprietary engine").
9. TERRITORIES & STRATEGIC TRADEOFFS:
   - Territories may explore ambitious strategic directions (e.g., "Curated Advisory", "Precision Self-Serve", "Broad Community"), but their descriptions must make clear when a territory relies on a proposed capability that would need to be built.
   - Every territory must articulate a real strategic tradeoff (what is sacrificed by pursuing this route). Positioning is as much about what you choose NOT to do.
10. Recommend one primary territory (selectedTerritoryId) and provide deep strategic rationale grounded in the Discovery insights.
11. Return strictly valid JSON adhering to the provided schema.`;

export const POSITIONING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: 'The market category the brand defines and commands.',
    },
    targetSegment: {
      type: Type.STRING,
      description: 'The specific beachhead segment derived from Discovery.',
    },
    xAxis: {
      type: Type.OBJECT,
      properties: {
        lowLabel: { type: Type.STRING, description: 'Short uppercase label for 0% end of horizontal axis, e.g. "BROAD / GENERALIST" or "SELF-SERVE".' },
        highLabel: { type: Type.STRING, description: 'Short uppercase label for 100% end of horizontal axis, e.g. "NICHE / SPECIALIZED" or "WHITE-GLOVE".' },
      },
      required: ['lowLabel', 'highLabel'],
      additionalProperties: false,
      description: 'The horizontal strategic dimension tailored specifically to this brand context.',
    },
    yAxis: {
      type: Type.OBJECT,
      properties: {
        lowLabel: { type: Type.STRING, description: 'Short uppercase label for 0% (top) end of vertical axis, e.g. "EMOTIONAL / BELONGING" or "TRANSFORMATIVE".' },
        highLabel: { type: Type.STRING, description: 'Short uppercase label for 100% (bottom) end of vertical axis, e.g. "FUNCTIONAL / UTILITY" or "PRAGMATIC TOOL".' },
      },
      required: ['lowLabel', 'highLabel'],
      additionalProperties: false,
      description: 'The vertical strategic dimension tailored specifically to this brand context.',
    },
    valueProposition: {
      type: Type.STRING,
      description: 'The clear, sharp one-line value proposition for the recommended position.',
    },
    differentiator: {
      type: Type.STRING,
      description: 'The primary wedge or unfair differentiation that makes copying irrational.',
    },
    positioningStatement: {
      type: Type.STRING,
      description: 'The structured core positioning statement: For [target] who [problem], [brand] is the [category] that [primary benefit] because [reason to believe].',
    },
    whyThisPosition: {
      type: Type.STRING,
      description: 'Strategic rationale explaining why this recommended position best solves the discovered core problem and addresses the core need while outflanking current alternatives.',
    },
    selectedTerritoryId: {
      type: Type.STRING,
      description: 'The ID of the recommended territory among the generated alternatives.',
    },
    keyPillars: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 4 concise strategic value pillars supporting this position.',
    },
    territories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Unique identifier, e.g., "territory-1", "territory-2", "territory-3".' },
          name: { type: Type.STRING, description: 'Strategic name of the territory (e.g., "High-Trust Squad Chemistry").' },
          quadrant: { type: Type.STRING, description: 'Strategic quadrant based on the two chosen axes.' },
          description: { type: Type.STRING, description: 'Comprehensive explanation of why this territory exists and the opportunity it unlocks.' },
          x: { type: Type.INTEGER, description: 'X-coordinate percentage (0 to 100) along the chosen xAxis.' },
          y: { type: Type.INTEGER, description: 'Y-coordinate percentage (0 to 100) along the chosen yAxis.' },
          valueProposition: { type: Type.STRING, description: 'The unique value proposition if the brand adopts this specific territory.' },
          tradeoff: { type: Type.STRING, description: 'The explicit strategic sacrifice or compromise required by choosing this territory.' },
        },
        required: ['id', 'name', 'quadrant', 'description', 'x', 'y', 'valueProposition', 'tradeoff'],
        additionalProperties: false,
      },
      description: '3 distinct strategic territory alternatives.',
    },
  },
  required: [
    'category',
    'targetSegment',
    'xAxis',
    'yAxis',
    'valueProposition',
    'differentiator',
    'positioningStatement',
    'whyThisPosition',
    'selectedTerritoryId',
    'territories',
    'keyPillars',
  ],
  additionalProperties: false,
};

export function buildPositioningPrompt(roughIdea: string, discovery: DiscoveryData, projectName?: string): string {
  let prompt = `You are formulating the strategic positioning for a new brand.\n\n`;
  if (projectName && projectName !== 'My New Brand') {
    prompt += `Working Brand Name: ${projectName}\n`;
  }
  prompt += `Foundational Idea: ${roughIdea}\n\n`;
  prompt += `=== VERIFIED DISCOVERY DATA (SOURCE OF TRUTH) ===\n`;
  prompt += `Core Problem: ${discovery.coreProblem}\n`;
  prompt += `Primary Beachhead Audience: ${discovery.primaryAudience}\n`;
  prompt += `User High-Friction Context: ${discovery.userContext}\n`;
  prompt += `Core Need: ${discovery.coreNeed}\n`;
  prompt += `Current Alternatives & Workarounds:\n`;
  (discovery.currentAlternatives || []).forEach((alt, i) => {
    prompt += `  ${i + 1}. ${alt}\n`;
  });

  if (discovery.assumptions && discovery.assumptions.length > 0) {
    prompt += `Key Strategic Assumptions:\n`;
    discovery.assumptions.forEach((asm, i) => {
      prompt += `  ${i + 1}. [Risk: ${asm.riskLevel}] ${asm.statement}\n`;
    });
  }

  if (discovery.openQuestions && discovery.openQuestions.length > 0) {
    prompt += `Open Strategic Questions:\n`;
    discovery.openQuestions.forEach((q, i) => {
      prompt += `  ${i + 1}. ${q.question} (Why: ${q.strategicWhy})\n`;
    });
  }

  prompt += `\n=== CRITICAL GROUNDING & PHRASING INSTRUCTIONS ===
1. DO NOT ASSERT UNVERIFIED CAPABILITIES AS EXISTING FACTS:
The product currently is ONLY: "${roughIdea.trim()}".
It does NOT currently establish:
- a verified eligibility database
- verified institutional or sponsor data
- real-time data feeds
- curated scholarship infrastructure
- guaranteed qualification accuracy
- exclusive partnerships
- an application assistant or AI coaching
- automatic eligibility verification
- existing scale or proprietary technology

2. STRATEGIC OPPORTUNITIES MUST BE PHRASED AS PROPOSED DIRECTIONS:
If you propose capabilities (e.g., curated matching, eligibility-focused discovery, guided application support), you MUST frame them as:
- a proposed strategic direction (e.g., "ScholarGuide could position itself around eligibility-focused scholarship discovery, with verified matching as a future product capability")
- a proposed capability or wedge (e.g., "could differentiate by helping students narrow opportunities according to eligibility criteria")
- a future product opportunity (e.g., "a curated eligibility experience could become a future differentiation strategy")
Do NOT write them as present-tense established facts (BAD: "it uses a verified database", "blends verified eligibility data", "surfaces only qualified awards").

3. FORBIDDEN ABSOLUTE OUTCOME CLAIMS:
Do NOT use: "guarantees", "100%", "only qualified awards", "eliminates guesswork", "ensures eligibility", "guarantees success/approval", "proprietary real-time engine".

4. POSITIONING STATEMENT, VALUE PROPOSITION, & DIFFERENTIATION:
Describe the brand based on currently supported facts, OR clearly frame unsupported capabilities as future/proposed directions. Do NOT hide unsupported capabilities inside persuasive marketing copy.

TASK:
Based strictly on the Discovery findings above:
1. Define the Market Category and Target Segment.
2. Select two domain-relevant strategic dimensions (xAxis: 0 -> 100, yAxis: 0 -> 100) reflecting genuine polarities and market tensions for this specific domain.
3. Generate exactly 3 distinct strategic territory alternatives across different quadrants with explicit coordinate placements (x: 0-100, y: 0-100), value propositions, and deliberate tradeoffs. Ensure territory descriptions make clear when a territory depends on a capability that does not yet exist.
4. Recommend one territory (selectedTerritoryId) and provide concise, rigorous strategic rationale grounded in the Discovery insights.
5. Construct the singular Positioning Statement, core differentiator, and key value pillars adhering strictly to the Grounding & Phrasing Instructions above.
6. Return strictly valid JSON adhering to the specified schema.`;

  return prompt;
}
