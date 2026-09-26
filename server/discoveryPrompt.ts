export const Type = {
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export const DISCOVERY_SYSTEM_INSTRUCTION = `You are the BrandForge Strategic Intelligence Engine, an elite venture brand strategist and positioning architect.
Your mission is to transform a founder's rough, incomplete startup or product idea into a deeply structured, analytical Discovery foundation.

CRITICAL RULES:
1. Do NOT simply regurgitate or rephrase the founder's raw words. Extract the underlying strategic tensions, human behaviors, and market dynamics.
2. Provide concrete, highly specific insights. Avoid generic corporate buzzwords.
3. Identify genuine friction in the status quo: why existing habits, tools, and workarounds break down.
4. Uncover high-risk latent assumptions the founder is making that could kill the business if false.
5. Formulate incisive strategic questions that pressure-test their domain comprehension.
6. GROUNDING & FACTUAL INTEGRITY:
   - "primaryAudience" must contain ONLY audience characteristics directly supported by the user's input.
   - Do NOT present inferred demographics, geography/country, education level or class year, socioeconomic status, behavior, constraints, or motivations as established facts.
   - For example, if the input states "college students", use "college students"; do NOT invent unstated segments (such as "sophomores to seniors" or "limited time").
   - Any speculative segment hypotheses, unverified constraints, or unstated attributes must be placed in 'assumptions' or 'openQuestions' instead.
7. Return valid JSON strictly matching the provided schema.`;

export const DISCOVERY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    coreProblem: {
      type: Type.STRING,
      description: 'The fundamental, structural problem or tension that the target user faces. Deep, nuanced explanation of what is truly broken in the current paradigm.',
    },
    primaryAudience: {
      type: Type.STRING,
      description: 'The specific, high-intent beachhead audience. Who feels this pain most acutely right now, including their context, demographics, or professional identity.',
    },
    userContext: {
      type: Type.STRING,
      description: 'The specific environment, trigger moments, or high-stakes scenario where this problem flares up and demands resolution.',
    },
    currentAlternatives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 5 existing workarounds, competitors, manual workflows, or makeshift tools they currently use today and how they fall short.',
    },
    coreNeed: {
      type: Type.STRING,
      description: 'The core functional, emotional, and psychological outcome the user desperately wants to achieve.',
    },
    assumptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          statement: { type: Type.STRING, description: 'A critical unvalidated hypothesis or assumption the founder is making.' },
          riskLevel: { type: Type.STRING, description: 'Must be one of: "high", "medium", "low".' },
          validationTip: { type: Type.STRING, description: 'A concrete, actionable way to test and validate or invalidate this assumption in 48 hours.' },
        },
        required: ['statement', 'riskLevel', 'validationTip'],
        additionalProperties: false,
      },
      description: '3 to 5 critical strategic assumptions that need validation.',
    },
    openQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'A sharp, thought-provoking strategic question about the brand or product.' },
          strategicWhy: { type: Type.STRING, description: 'Why answering this question is critical to positioning and long-term defensibility.' },
        },
        required: ['question', 'strategicWhy'],
        additionalProperties: false,
      },
      description: '3 to 5 provocative strategic questions to pressure-test the concept.',
    },
  },
  required: [
    'coreProblem',
    'primaryAudience',
    'userContext',
    'currentAlternatives',
    'coreNeed',
    'assumptions',
    'openQuestions',
  ],
  additionalProperties: false,
};

export function buildDiscoveryPrompt(roughIdea: string, knownDetails?: string): string {
  let prompt = `Analyze the following founder idea and perform strategic brand discovery:\n\n`;
  prompt += `=== FOUNDER'S ROUGH IDEA ===\n${roughIdea.trim()}\n\n`;
  if (knownDetails && knownDetails.trim()) {
    prompt += `=== ADDITIONAL FOUNDER CONTEXT & KNOWN DETAILS ===\n${knownDetails.trim()}\n\n`;
  }
  prompt += `Provide a comprehensive, incisive strategic Discovery breakdown matching the required JSON schema.\nStrict requirement: Ground "primaryAudience" strictly in the founder's provided words. Do not invent unmentioned demographics, class standing, geography, or unstated constraints.`;
  return prompt;
}
