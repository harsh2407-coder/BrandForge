import type { DiscoveryData, PositioningData, PersonalityData, NamingData } from '../src/types/brand.js';

export const Type = {
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export const VISUAL_SYSTEM_INSTRUCTION = `You are the BrandForge Creative Director and Visual Identity Architect.
Your mission is to transform validated upstream brand strategy (Discovery, Positioning, Personality, and Naming) into a coherent, executable visual identity direction.

CRITICAL ARCHITECTURAL PRINCIPLE:
Strategy dictates visual expression.
You are NOT generating isolated decoration, random color swatches, or cliché tech palettes. You are architecting a defensible creative system that visually embodies the brand's positioning and behavioral posture.
The visual direction must answer:
- What should this brand LOOK and FEEL like in the world?
- Why? How does this aesthetic reinforce the positioning wedge?
- How does the form, light, color, and texture express the brand's personality traits and tone?
- How does the visual system support the chosen name and verbal identity?
- What visual tropes must this brand deliberately avoid?

CRITICAL GROUNDING & FEASIBILITY MANDATE:
1. Grounding: Consume the accumulated Discovery, Positioning, Personality, and Naming contexts. Propose creative concepts, aesthetic metaphors, and future design behaviors. Do NOT assert that the product already has deployed visual assets, trademarked logos, registered marks, or pre-existing institutional design systems.
2. No Fake Availability or Legal Claims: Do NOT claim that fonts, marks, or color schemes are legally cleared, trademark-registered, or globally unique.
3. Anti-Generic Mandate:
   - Absolutely NEVER rely on empty, lazy buzzwords like "futuristic", "sleek", "cutting-edge", "innovative", "disruptive", or "next-gen" without immediate concrete visual specifications (e.g., exact lighting temperature, grid density, stroke weight, material finish).
   - Reject generic imagery tropes: no smiling corporate stock photography, no floating neon 3D spheres, no arbitrary purple-to-cyan gradient meshes, no meaningless abstract AI blobs.
4. Color Integrity:
   - Every color must have a valid 6-character uppercase HEX code (e.g. #0A0D12, #F59E0B).
   - Roles must include: primary, secondary, accent, background, surface, text, muted.
   - Colors must be accompanied by strategic rationales explaining emotional resonance and usage rules.
   - Do NOT claim audited WCAG certification; provide qualitative functional contrast assessment.
5. Return strictly valid JSON conforming to the specified schema.`;

export const VISUAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    creativeDirection: {
      type: Type.OBJECT,
      properties: {
        concept: { type: Type.STRING, description: 'Concise creative concept statement explaining the core visual idea.' },
        visualThesis: { type: Type.STRING, description: 'If the brand were a physical environment, object, editorial system, or experience, what would it feel like?' },
        moodKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '4 to 7 specific, evocative mood keywords (avoiding generic buzzwords).',
        },
      },
      required: ['concept', 'visualThesis', 'moodKeywords'],
      additionalProperties: false,
    },
    visualPrinciples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Title of the visual principle.' },
          description: { type: Type.STRING, description: 'What this principle means conceptually.' },
          application: { type: Type.STRING, description: 'How a designer executes this principle in practice.' },
        },
        required: ['name', 'description', 'application'],
        additionalProperties: false,
      },
      description: '4 to 6 strategic visual principles.',
    },
    colorSystem: {
      type: Type.OBJECT,
      properties: {
        primary: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
            role: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ['name', 'hex', 'role', 'rationale'],
          additionalProperties: false,
        },
        secondary: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
            role: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ['name', 'hex', 'role', 'rationale'],
          additionalProperties: false,
        },
        accent: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
            role: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ['name', 'hex', 'role', 'rationale'],
          additionalProperties: false,
        },
        background: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
            role: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ['name', 'hex', 'role', 'rationale'],
          additionalProperties: false,
        },
        surface: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
            role: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ['name', 'hex', 'role', 'rationale'],
          additionalProperties: false,
        },
        text: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
            role: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ['name', 'hex', 'role', 'rationale'],
          additionalProperties: false,
        },
        muted: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
            role: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ['name', 'hex', 'role', 'rationale'],
          additionalProperties: false,
        },
      },
      required: ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'muted'],
      additionalProperties: false,
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        displayFont: { type: Type.STRING, description: 'Display and headline typeface recommendation.' },
        bodyFont: { type: Type.STRING, description: 'Body and functional prose typeface recommendation.' },
        supportingFont: { type: Type.STRING, description: 'Tabular, monospace, or UI accent typeface.' },
        typographyMood: { type: Type.STRING, description: 'The tonal and structural feeling of the typographic pairing.' },
        usageRules: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 to 5 typographic hierarchy, tracking, and weight rules.',
        },
      },
      required: ['displayFont', 'bodyFont', 'supportingFont', 'typographyMood', 'usageRules'],
      additionalProperties: false,
    },
    imageryDirection: {
      type: Type.OBJECT,
      properties: {
        photographyStyle: { type: Type.STRING, description: 'Authentic photographic approach.' },
        subjectMatter: { type: Type.STRING, description: 'What subjects, moments, and scenes to feature.' },
        composition: { type: Type.STRING, description: 'Framing, focal length, geometry, and grid alignment.' },
        lighting: { type: Type.STRING, description: 'Lighting quality, temperature, and mood.' },
        colorTreatment: { type: Type.STRING, description: 'Grading, saturation, and contrast treatment.' },
        humanPresence: { type: Type.STRING, description: 'How people and human interactions are portrayed.' },
        avoidImagery: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Specific photographic and visual tropes to avoid.',
        },
      },
      required: [
        'photographyStyle',
        'subjectMatter',
        'composition',
        'lighting',
        'colorTreatment',
        'humanPresence',
        'avoidImagery',
      ],
      additionalProperties: false,
    },
    graphicLanguage: {
      type: Type.OBJECT,
      properties: {
        shapes: { type: Type.STRING, description: 'Geometric vs organic, corner curvature, and silhouette logic.' },
        lineLanguage: { type: Type.STRING, description: 'Hairline dividers, borders, strokes, and structural framing.' },
        layoutBehavior: { type: Type.STRING, description: 'Grid density, whitespace generosity, and hierarchy cadence.' },
        depth: { type: Type.STRING, description: 'Elevation philosophy: flat, single-elevation hairline, or subtle shadows.' },
        motion: { type: Type.STRING, description: 'Kinetic tempo, transitions, and easing curves.' },
        texture: { type: Type.STRING, description: 'Surface finish: matte, grain, glass, obsidian, or tactile weave.' },
        iconography: { type: Type.STRING, description: 'Icon style: stroke weight, geometry, and metaphor clarity.' },
      },
      required: ['shapes', 'lineLanguage', 'layoutBehavior', 'depth', 'motion', 'texture', 'iconography'],
      additionalProperties: false,
    },
    logoDirection: {
      type: Type.OBJECT,
      properties: {
        concept: { type: Type.STRING, description: 'High-level mark conceptual thesis.' },
        symbolicIdea: { type: Type.STRING, description: 'What metaphor or geometry the mark expresses.' },
        formLanguage: { type: Type.STRING, description: 'Construction geometry (e.g. geometric, monoline, architectural).' },
        construction: { type: Type.STRING, description: 'How the mark scales between standalone symbol and wordmark pairing.' },
        wordmarkDirection: { type: Type.STRING, description: 'Case, tracking, glyph customization, and kerning philosophy.' },
        avoid: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Logo clichés to avoid in this category.',
        },
      },
      required: ['concept', 'symbolicIdea', 'formLanguage', 'construction', 'wordmarkDirection', 'avoid'],
      additionalProperties: false,
    },
    uiDirection: {
      type: Type.OBJECT,
      properties: {
        interfaceMood: { type: Type.STRING, description: 'The psychological posture of the digital interface.' },
        layoutPrinciples: { type: Type.STRING, description: 'Spatial layout rules, density, and modularity.' },
        cardBehavior: { type: Type.STRING, description: 'Surfacing, borders, states, and elevation.' },
        navigationBehavior: { type: Type.STRING, description: 'How navigation and workflows are presented.' },
        interactionStyle: { type: Type.STRING, description: 'Haptic feedback, click targets, and interactive feedback.' },
        motionPrinciples: { type: Type.STRING, description: 'Micro-animations and interface transition physics.' },
      },
      required: [
        'interfaceMood',
        'layoutPrinciples',
        'cardBehavior',
        'navigationBehavior',
        'interactionStyle',
        'motionPrinciples',
      ],
      additionalProperties: false,
    },
    doRules: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 to 6 concrete, brand-specific visual rules to strictly follow.',
    },
    dontRules: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 to 6 concrete, brand-specific visual rules to strictly avoid.',
    },
  },
  required: [
    'creativeDirection',
    'visualPrinciples',
    'colorSystem',
    'typography',
    'imageryDirection',
    'graphicLanguage',
    'logoDirection',
    'uiDirection',
    'doRules',
    'dontRules',
  ],
  additionalProperties: false,
};

export function buildVisualPrompt(
  roughIdea: string,
  discovery: DiscoveryData,
  positioning: PositioningData,
  personality: PersonalityData,
  naming: NamingData,
  projectName?: string
): string {
  let prompt = `You are developing the comprehensive Visual Identity Direction for a new brand.\n\n`;
  if (projectName && projectName !== 'My New Brand') {
    prompt += `Working Brand Name: ${projectName}\n`;
  }
  prompt += `Foundational Idea: ${roughIdea}\n\n`;

  prompt += `=== DISCOVERY CONTEXT (STRATEGIC ANCHOR) ===\n`;
  prompt += `Core Problem: ${discovery.coreProblem}\n`;
  prompt += `Primary Audience: ${discovery.primaryAudience}\n`;
  prompt += `User Friction Context: ${discovery.userContext}\n`;
  prompt += `Core Need: ${discovery.coreNeed}\n`;
  if (discovery.currentAlternatives && discovery.currentAlternatives.length > 0) {
    prompt += `Competitor Workarounds: ${discovery.currentAlternatives.join(', ')}\n`;
  }

  prompt += `\n=== POSITIONING CONTEXT (STRATEGIC FOUNDATION) ===\n`;
  prompt += `Market Category: ${positioning.category}\n`;
  prompt += `Target Segment: ${positioning.targetSegment}\n`;
  prompt += `Value Proposition: ${positioning.valueProposition}\n`;
  prompt += `Differentiator: ${positioning.primaryDifferentiation || positioning.differentiator}\n`;
  prompt += `Positioning Statement: ${positioning.positioningStatement}\n`;
  prompt += `Strategic Rationale: ${positioning.positioningRationale || positioning.whyThisPosition}\n`;
  if (positioning.territories && positioning.territories.length > 0) {
    const selected = positioning.territories.find(t => t.id === positioning.selectedTerritoryId) || positioning.territories[0];
    prompt += `Selected Positioning Territory: "${selected.name}" (${selected.valueProposition})\n`;
  }

  prompt += `\n=== PERSONALITY & VOICE CONTEXT (BEHAVIORAL POSTURE) ===\n`;
  prompt += `Voice Summary: ${personality.voice?.summary || personality.voiceAndTone?.tone}\n`;
  prompt += `Traits:\n`;
  (personality.traits || []).forEach((t, i) => {
    prompt += `  ${i + 1}. ${t.name}: ${t.description || t.whyItFits}\n`;
  });
  if (personality.traitsToAvoid && personality.traitsToAvoid.length > 0) {
    prompt += `Traits to Avoid:\n`;
    personality.traitsToAvoid.forEach((a, i) => {
      prompt += `  ${i + 1}. ${a.name || a.trait}: ${a.reasonToAvoid || a.reason}\n`;
    });
  }
  if (personality.brandPrinciples && personality.brandPrinciples.length > 0) {
    prompt += `Brand Principles:\n`;
    personality.brandPrinciples.forEach((bp, i) => {
      prompt += `  ${i + 1}. ${bp.name}: ${bp.statement}\n`;
    });
  }
  if (personality.dimensions && personality.dimensions.length > 0) {
    prompt += `Personality Spectrums:\n`;
    personality.dimensions.forEach((d, i) => {
      prompt += `  ${i + 1}. ${d.dimension}: ${d.value}% (${d.lowLabel} <-> ${d.highLabel})\n`;
    });
  }

  prompt += `\n=== NAMING CONTEXT (VERBAL IDENTITY) ===\n`;
  prompt += `Naming Strategy: ${naming.namingStrategy || 'Grounded verbal identity'}\n`;
  if (naming.selectedName) {
    prompt += `Chosen Wordmark: "${naming.selectedName.name}" (Concept: ${naming.selectedName.concept || naming.selectedName.meaning})\n`;
    prompt += `Wordmark Strategic Rationale: ${naming.selectedName.strategicRationale}\n`;
  } else if (naming.candidates && naming.candidates.length > 0) {
    prompt += `Lead Candidate Name: "${naming.candidates[0].name}"\n`;
  }

  prompt += `\nTASK:
Translate the above strategic system into an actionable, cohesive Visual Identity Direction:
1. Formulate a singular Creative Concept, sensory Visual Thesis, and 4 to 7 non-generic Mood Keywords.
2. Define 4 to 6 Visual Principles that guide real design decisions.
3. Design a purposeful 7-role Color System (primary, secondary, accent, background, surface, text, muted) with valid #RRGGBB hex values and strategic rationales.
4. Recommend a clear Typography pairing (Display, Body, Supporting) with usage rules.
5. Provide detailed Art Direction for imagery (style, subject matter, composition, lighting, color treatment, human presence, what to avoid).
6. Specify the Graphic Language (shapes, line language, layout behavior, depth, motion, texture, iconography).
7. Outline a Logo Concept Brief (symbolic idea, form language, construction, wordmark direction, avoid).
8. Detail the UI Direction (interface mood, layout principles, card behavior, navigation, motion principles).
9. Set 4 to 6 explicit visual DO rules and 4 to 6 DONT rules.
10. GROUNDING MANDATE: Do NOT claim pre-existing trademarks, deployed visual assets, or certified accessibility. Return strictly valid JSON matching the schema.`;

  return prompt;
}
