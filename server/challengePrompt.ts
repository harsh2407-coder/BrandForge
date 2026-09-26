/**
 * server/challengePrompt.ts
 *
 * Prompt and JSON schema for Step 7: Challenge Engine (Adversarial Brand Stress Test).
 * Consumes the accumulated BrandMemory (Discovery, Positioning, Personality, Naming, Visualize)
 * and acts as an uncompromising, skeptical brand strategist and creative director.
 */

export const CHALLENGE_SYSTEM_INSTRUCTION = `You are a skeptical, top-tier brand strategist, adversarial critic, and creative director reviewing brand identity work you did NOT author.
Your sole mission is to pressure-test the accumulated brand system, identify critical blind spots, challenge assumptions, expose unearned claims, and test cross-stage alignment.

THE PIPELINE UNDER REVIEW:
1. Discovery (Problem, Audience, Core Need, Assumptions, Open Questions)
2. Positioning (Category, Value Prop, Differentiation, Pillars, Territories)
3. Personality (Traits, Traits to Avoid, Principles, Voice, Tone Rules)
4. Naming (Naming Worlds, Candidates, Selected Name Rationale)
5. Visual Identity (Creative Direction, Principles, 7-role Color System, Typography, Art Direction, Graphic Language, Logo Direction, UI Direction, Do/Don't Rules)

CORE EVALUATION CATEGORIES:
- "Strategic Risk" / "Positioning Risk": Generic value props, category-level benefits any competitor could claim, lack of defensibility.
- "Audience Risk": Narrowing down to the wrong personas, cognitive friction, ignoring critical student/buyer context.
- "Differentiation Risk": Failure to establish a distinct, proprietary wedge or point of difference.
- "Credibility / Claim Risk": VERY CRITICAL. Look for unearned, unsupported claims ("verified database", "guaranteed eligibility", "100% accuracy", "proprietary real-time engine", "thousands of partners", "certified") presented as EXISTING capabilities rather than proposed directions.
- "Naming Risk": Selected name carries unintended connotations, confusing pronunciation, generic dev/tech cliches, or fails to embody the chosen positioning territory.
- "Personality Risk": Incoherent personality dimensions, disconnect between principles and writing voice, corporate jargon sneaking into copy.
- "Visual Risk": Palette contradictions (e.g. claims calm but colors clash violently), generic art direction, over-engineered decorative complexity, illegible typography hierarchy.
- "Coherence Risk": Cross-stage contradictions where one stage asserts one tone/strategy (e.g. calm pragmatic rigor) but another asserts the opposite (e.g. hyper-aggressive, flashy tech).
- "Assumption Risk": High-risk assumptions that have zero validation tests or unaddressed existential open questions.

RULES FOR CRITIQUE:
1. NO FLATTERY OR HOLLOW PRAISE. Do not say "Everything looks fantastic!" You are a stress test. A good brand must survive scrutiny.
2. REQUIRE EVIDENCE. Every finding MUST cite exact evidence or quotes from the provided BrandMemory. Never say "The positioning could be stronger" without pointing to the exact sentence and why it fails.
3. BE SPECIFIC AND EXECUTABLE. Each finding must offer a concrete, actionable suggestedFix.
4. PROPOSED CHANGES: Where a finding can be directly repaired by updating a specific field in BrandMemory, include a structured "proposedChange" object targeting an allowed whitelist field:
   - discovery: "coreProblem", "primaryAudience", "coreNeed", "userContext"
   - positioning: "positioningStatement", "valueProposition", "primaryDifferentiation", "targetSegment", "category"
   - personality: "voiceSummary"
   - naming: "selectionRationale"
   - visualize: "visualConcept", "visualThesis"
5. SEVERITY LEVELS:
   - "critical": Fundamentally breaks the brand strategy, introduces legal/factual falsehoods, or severe cross-stage conflict.
   - "high": Material weakness that competitors will easily exploit or severe confusion for the target audience.
   - "medium": Noticeable inconsistency or clichéd phrasing that weakens brand distinctiveness.
   - "low": Polish or minor optimization.
6. BACKWARD COMPATIBILITY: Map critical/high to status "CONFLICT" or "WARNING"; map medium/low to "WARNING" or "PASS".

You must respond with valid JSON matching the requested schema.`;

export const CHALLENGE_SCHEMA = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          category: {
            type: "string",
            enum: [
              "Strategic Risk",
              "Audience Risk",
              "Positioning Risk",
              "Differentiation Risk",
              "Naming Risk",
              "Personality Risk",
              "Visual Risk",
              "Credibility / Claim Risk",
              "Coherence Risk",
              "Assumption Risk",
              "GENERIC LANGUAGE",
              "AUDIENCE FIT",
              "POSITIONING",
              "PERSONALITY",
              "NAME",
              "VOICE",
              "VISUAL DIRECTION",
              "CONSISTENCY"
            ]
          },
          severity: {
            type: "string",
            enum: ["critical", "high", "medium", "low"]
          },
          status: {
            type: "string",
            enum: ["CONFLICT", "WARNING", "PASS"]
          },
          title: { type: "string" },
          finding: { type: "string" },
          evidence: { type: "string" },
          whyItMatters: { type: "string" },
          affectedStages: {
            type: "array",
            items: { type: "string" }
          },
          stageTarget: {
            type: "string",
            enum: ["discover", "position", "personality", "naming", "visualize", "launch"]
          },
          suggestedFix: { type: "string" },
          suggestedImprovement: { type: "string" },
          proposedChange: {
            type: "object",
            properties: {
              targetStage: {
                type: "string",
                enum: ["discovery", "positioning", "personality", "naming", "visualize", "launch"]
              },
              field: { type: "string" },
              currentValue: { type: "string" },
              proposedValue: { type: "string" },
              rationale: { type: "string" }
            },
            required: ["targetStage", "field", "proposedValue"]
          }
        },
        required: [
          "id",
          "category",
          "severity",
          "status",
          "title",
          "finding",
          "evidence",
          "whyItMatters",
          "suggestedFix",
          "suggestedImprovement"
        ]
      }
    },
    consistencySummary: {
      type: "object",
      properties: {
        overallState: {
          type: "string",
          enum: ["Robust & Coherent", "Has Actionable Gaps", "Critical Alignment Needed"]
        },
        strengthsCount: { type: "integer" },
        warningsCount: { type: "integer" },
        conflictsCount: { type: "integer" },
        editorialAssessment: { type: "string" }
      },
      required: [
        "overallState",
        "strengthsCount",
        "warningsCount",
        "conflictsCount",
        "editorialAssessment"
      ]
    }
  },
  required: ["findings", "consistencySummary"]
};

export function buildChallengePrompt(memory: any): string {
  const roughIdea = memory.roughIdea || 'Not provided';
  const projectName = memory.projectName || 'Not specified';

  // 1. Discovery summary
  const discovery = memory.discovery || {};
  const discoveryText = `
[DISCOVERY STAGE]
- Core Problem: ${discovery.coreProblem || 'N/A'}
- Primary Audience: ${discovery.primaryAudience || 'N/A'}
- User Context: ${discovery.userContext || 'N/A'}
- Alternatives: ${(discovery.currentAlternatives || []).join('; ') || 'N/A'}
- Core Need: ${discovery.coreNeed || 'N/A'}
- Key Assumptions: ${(discovery.assumptions || []).map((a: any) => `[${a.riskLevel?.toUpperCase()}] ${a.statement}`).join(' | ') || 'N/A'}
- Open Questions: ${(discovery.openQuestions || []).map((q: any) => q.question).join(' | ') || 'N/A'}
`.trim();

  // 2. Positioning summary
  const positioning = memory.positioning || {};
  const positioningText = `
[POSITIONING STAGE]
- Category: ${positioning.category || 'N/A'}
- Target Segment: ${positioning.targetSegment || 'N/A'}
- Value Proposition: ${positioning.valueProposition || 'N/A'}
- Differentiator: ${positioning.primaryDifferentiation || positioning.differentiator || 'N/A'}
- Positioning Statement: ${positioning.positioningStatement || 'N/A'}
- Selected Territory: ${positioning.selectedTerritoryId ? (positioning.territories || []).find((t: any) => t.id === positioning.selectedTerritoryId)?.name || positioning.selectedTerritoryId : 'N/A'}
- Positioning Pillars: ${(positioning.pillars || []).map((p: any) => p.title || p).join('; ') || (positioning.keyPillars || []).join('; ') || 'N/A'}
`.trim();

  // 3. Personality summary
  const personality = memory.personality || {};
  const personalityText = `
[PERSONALITY & VOICE STAGE]
- Core Traits: ${(personality.traits || []).map((t: any) => `${t.name}: ${t.whyItFits || ''}`).join('; ') || 'N/A'}
- Avoid Traits: ${(personality.avoidTraits || []).map((t: any) => `${t.name}: ${t.reasonToAvoid || ''}`).join('; ') || 'N/A'}
- Brand Principles: ${(personality.brandPrinciples || []).map((p: any) => `${p.name}: ${p.statement || ''}`).join('; ') || 'N/A'}
- Voice Summary: ${personality.voice?.summary || personality.voiceSummary || 'N/A'}
- Writing Samples: Headline: "${personality.writingSamples?.headline || 'N/A'}" | Pitch: "${personality.writingSamples?.valueProposition || 'N/A'}"
`.trim();

  // 4. Naming summary
  const naming = memory.naming || {};
  const selectedName = naming.selectedName?.name || naming.selectedCandidateId || projectName;
  const namingText = `
[NAMING STAGE]
- Selected Name: ${selectedName}
- Selection Rationale: ${naming.selectionRationale || naming.selectedName?.strategicRationale || 'N/A'}
- Naming Strategy: ${naming.namingStrategy || 'N/A'}
- Alternative Worlds: ${(naming.namingWorlds || naming.worlds || []).map((w: any) => w.name).join(', ') || 'N/A'}
- Shortlisted Alternatives: ${(naming.shortlistedCandidateIds || naming.shortlistedIds || []).join(', ') || 'None'}
`.trim();

  // 5. Visual summary
  const visual = memory.visual || memory.visualize || {};
  const colorSystem = visual.colorSystem || {};
  const visualText = `
[VISUAL IDENTITY STAGE]
- Creative Concept: ${visual.creativeDirection?.concept || visual.visualConcept || 'N/A'}
- Visual Thesis: ${visual.creativeDirection?.visualThesis || visual.visualThesis || 'N/A'}
- Mood Keywords: ${(visual.creativeDirection?.moodKeywords || visual.moodKeywords || []).join(', ') || 'N/A'}
- Palette: Primary=${colorSystem.primary?.hex || visual.palette?.[0]?.hex || 'N/A'}, Secondary=${colorSystem.secondary?.hex || visual.palette?.[1]?.hex || 'N/A'}, Accent=${colorSystem.accent?.hex || visual.palette?.[2]?.hex || 'N/A'}
- Typography: Display=${visual.typographyDirection?.displayFont || visual.typography?.[0]?.family || 'N/A'}, Body=${visual.typographyDirection?.bodyFont || visual.typography?.[1]?.family || 'N/A'}
- Imagery Direction: ${visual.imageryDirection?.photographyStyle || visual.artDirection?.mood || 'N/A'}
- Graphic Language: Shapes=${visual.graphicLanguage?.shapes || visual.shapeLanguage?.cornerStyle || 'N/A'}, Depth=${visual.graphicLanguage?.depth || visual.shapeLanguage?.spatialFeel || 'N/A'}
- Logo Direction: ${visual.logoDirection?.concept || visual.logoConcept?.description || 'N/A'}
- UI Direction: ${visual.uiDirection?.interfaceMood || 'N/A'}
- Do Rules: ${(visual.doRules || []).join('; ') || 'N/A'}
- Don't Rules: ${(visual.dontRules || visual.avoidVisuals || visual.thingsToAvoid || []).join('; ') || 'N/A'}
`.trim();

  return `Perform an uncompromising, rigorous adversarial brand challenge and stress test on the following BrandMemory system:

ROUGH IDEA:
"${roughIdea}"

PROJECT / BRAND NAME:
"${projectName}"

${discoveryText}

${positioningText}

${personalityText}

${namingText}

${visualText}

TASK:
Produce 4 to 7 deeply thoughtful, adversarial findings dissecting strategic vulnerabilities, unearned capability claims, positioning loopholes, naming risks, visual disconnects, and cross-stage contradictions.
For each actionable flaw, provide evidence directly quoted or cited from the BrandMemory, explain why it compromises the brand, provide a concrete suggestedFix, and whenever possible provide a structured proposedChange with an improved replacement value for an allowed whitelist field.`;
}
