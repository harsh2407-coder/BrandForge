import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '.env.local' });
dotenv.config();
import { DISCOVERY_SCHEMA, DISCOVERY_SYSTEM_INSTRUCTION, buildDiscoveryPrompt } from './discoveryPrompt.js';
import { POSITIONING_SCHEMA, POSITIONING_SYSTEM_INSTRUCTION, buildPositioningPrompt } from './positioningPrompt.js';
import { PERSONALITY_SCHEMA, PERSONALITY_SYSTEM_INSTRUCTION, buildPersonalityPrompt } from './personalityPrompt.js';
import { NAMING_SCHEMA, NAMING_SYSTEM_INSTRUCTION, buildNamingPrompt } from './namingPrompt.js';
import type { 
  DiscoveryData, 
  PositioningData, 
  PositioningTerritory,
  PersonalityData,
  PersonalityTrait,
  TraitToAvoid,
  BrandPrinciple,
  PersonalityDimension,
  VoiceCharacteristic,
  VoiceToneRule,
  WritingSamples,
  NamingData,
  NamingWorld,
  NameCandidate,
  NamingTerritory,
  NamingEvaluation
} from '../src/types/brand.js';

export interface GenerateDiscoveryInput {
  roughIdea: string;
  knownDetails?: string;
  projectName?: string;
}

export interface GeneratePositioningInput {
  roughIdea: string;
  discovery: DiscoveryData;
  projectName?: string;
}

export interface GeneratePersonalityInput {
  roughIdea: string;
  discovery: DiscoveryData;
  positioning: PositioningData;
  projectName?: string;
}

export interface GenerateNamingInput {
  roughIdea: string;
  discovery: DiscoveryData;
  positioning: PositioningData;
  personality: PersonalityData;
  projectName?: string;
}



export class GeminiGateway {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !apiKey.trim() || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not configured on the server. Please provide a valid Gemini API key.');
    }
    if (!this.ai) {
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  async generateDiscovery(input: GenerateDiscoveryInput): Promise<DiscoveryData> {
    const { roughIdea, knownDetails } = input;
    if (!roughIdea || !roughIdea.trim()) {
      throw new Error('Rough idea is required to generate strategic discovery.');
    }

    const ai = this.getClient();
    const prompt = buildDiscoveryPrompt(roughIdea, knownDetails);

    const model = 'gemini-3.8-flash';
    let rawText: string | undefined = undefined;
    let lastError: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: DISCOVERY_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: DISCOVERY_SCHEMA,
            temperature: 0.4,
          },
        });

        rawText = response.text?.trim();
        if (rawText) break;
      } catch (err: any) {
        lastError = err;
        console.error(`[GeminiGateway] Model ${model} generation attempt ${attempt} failed:`, err.message || err);
        if (attempt < 3) {
          if (err.status === 503 || err.message?.includes('503') || err.message?.includes('high demand')) {
            await new Promise(r => setTimeout(r, attempt * 1500));
          } else if (err.status === 429 || err.message?.includes('429')) {
            await new Promise(r => setTimeout(r, 4500));
          }
        }
      }
    }

    if (!rawText && lastError) {
      let safeMessage = 'AI discovery generation failed. Please try again.';
      if (lastError.status === 503 || lastError.message?.includes('503') || lastError.message?.includes('high demand')) {
        safeMessage = 'The AI model is currently experiencing high demand. Please try again in a few moments.';
      } else if (lastError.status === 429 || lastError.message?.includes('429')) {
        safeMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (lastError.message && !lastError.message.includes('API_KEY') && !lastError.message.includes('key')) {
        try {
          const parsedErr = JSON.parse(lastError.message);
          safeMessage = parsedErr?.error?.message || safeMessage;
        } catch {
          safeMessage = lastError.message;
        }
      }
      throw new Error(safeMessage);
    }

    if (!rawText) {
      throw new Error('AI generation failed: No content returned by the model.');
    }

    // Parse and validate structured output
    return this.validateAndNormalizeDiscovery(rawText);
  }

  private validateAndNormalizeDiscovery(jsonString: string): DiscoveryData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      // Sometimes models wrap json in markdown block: ```json ... ```
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Gemini output.');
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid Discovery data: expected an object.');
    }

    if (!parsed.coreProblem || typeof parsed.coreProblem !== 'string' || !parsed.coreProblem.trim()) {
      throw new Error('Invalid Discovery data: missing or empty coreProblem.');
    }

    if (!parsed.primaryAudience || typeof parsed.primaryAudience !== 'string' || !parsed.primaryAudience.trim()) {
      throw new Error('Invalid Discovery data: missing or empty primaryAudience.');
    }

    const userContext = typeof parsed.userContext === 'string' && parsed.userContext.trim()
      ? parsed.userContext.trim()
      : 'Active operational environment requiring immediate resolution.';

    const coreNeed = typeof parsed.coreNeed === 'string' && parsed.coreNeed.trim()
      ? parsed.coreNeed.trim()
      : 'A dependable, coherent solution that eliminates friction and risk.';

    const currentAlternatives: string[] = Array.isArray(parsed.currentAlternatives) && parsed.currentAlternatives.length > 0
      ? parsed.currentAlternatives.map((alt: any) => String(alt).trim()).filter(Boolean)
      : ['Generic makeshift tools and manual spreadsheets', 'Ad-hoc community channels without verification'];

    const assumptions = (Array.isArray(parsed.assumptions) ? parsed.assumptions : []).map((item: any, idx: number) => {
      const risk = String(item?.riskLevel || 'medium').toLowerCase();
      const validRisk: 'high' | 'medium' | 'low' = ['high', 'medium', 'low'].includes(risk)
        ? (risk as 'high' | 'medium' | 'low')
        : 'medium';

      return {
        id: item?.id || `asm-${idx + 1}`,
        statement: String(item?.statement || 'User will adopt low-friction automated workflow.').trim(),
        riskLevel: validRisk,
        validationTip: String(item?.validationTip || 'Interview 5 target users with wireframe prototype.').trim(),
      };
    });

    const openQuestions = (Array.isArray(parsed.openQuestions) ? parsed.openQuestions : []).map((item: any, idx: number) => ({
      id: item?.id || `q-${idx + 1}`,
      question: String(item?.question || 'What is the primary retention mechanism?').trim(),
      strategicWhy: String(item?.strategicWhy || 'Essential for sustainable category leadership.').trim(),
    }));

    return {
      coreProblem: parsed.coreProblem.trim(),
      primaryAudience: parsed.primaryAudience.trim(),
      userContext,
      currentAlternatives,
      coreNeed,
      assumptions: assumptions.length > 0 ? assumptions : [
        {
          id: 'asm-1',
          statement: 'Target audience has acute willingness to adopt a dedicated tool.',
          riskLevel: 'high',
          validationTip: 'Test 2-minute onboarding funnel conversion.',
        },
      ],
      openQuestions: openQuestions.length > 0 ? openQuestions : [
        {
          id: 'q-1',
          question: 'What is the defensible core of this brand positioning?',
          strategicWhy: 'Prevents commoditization by incumbent market players.',
        },
      ],
      isConfirmed: false,
    };
  }

  async generatePositioning(input: GeneratePositioningInput): Promise<PositioningData> {
    const { roughIdea, discovery, projectName } = input;
    if (!roughIdea || !roughIdea.trim()) {
      throw new Error('Rough idea is required to generate strategic positioning.');
    }
    if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
      throw new Error('Discovery data is missing or incomplete. Discovery stage must be completed before Positioning.');
    }

    const ai = this.getClient();
    const prompt = buildPositioningPrompt(roughIdea, discovery, projectName);

    const model = 'gemini-3.8-flash';
    let rawText: string | undefined = undefined;
    let lastError: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: POSITIONING_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: POSITIONING_SCHEMA,
            temperature: 0.4,
          },
        });

        rawText = response.text?.trim();
        if (rawText) break;
      } catch (err: any) {
        lastError = err;
        console.error(`[GeminiGateway] Model ${model} positioning attempt ${attempt} failed:`, err.message || err);
        if (attempt < 3) {
          if (err.status === 503 || err.message?.includes('503') || err.message?.includes('high demand')) {
            await new Promise(r => setTimeout(r, attempt * 1500));
          } else if (err.status === 429 || err.message?.includes('429')) {
            await new Promise(r => setTimeout(r, 4500));
          }
        }
      }
    }

    if (!rawText && lastError) {
      let safeMessage = 'AI positioning generation failed. Please try again.';
      if (lastError.status === 503 || lastError.message?.includes('503') || lastError.message?.includes('high demand')) {
        safeMessage = 'The AI model is currently experiencing high demand. Please try again in a few moments.';
      } else if (lastError.status === 429 || lastError.message?.includes('429')) {
        safeMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (lastError.message && !lastError.message.includes('API_KEY') && !lastError.message.includes('key')) {
        try {
          const parsedErr = JSON.parse(lastError.message);
          safeMessage = parsedErr?.error?.message || safeMessage;
        } catch {
          safeMessage = lastError.message;
        }
      }
      throw new Error(safeMessage);
    }

    if (!rawText) {
      throw new Error('AI generation failed: No content returned by the model.');
    }

    return this.validateAndNormalizePositioning(rawText);
  }

  private validateAndNormalizePositioning(jsonString: string): PositioningData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Gemini output for Positioning.');
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid Positioning data: expected an object.');
    }

    if (!parsed.category || typeof parsed.category !== 'string') {
      throw new Error('Invalid Positioning data: missing or empty category.');
    }
    if (!parsed.valueProposition || typeof parsed.valueProposition !== 'string') {
      throw new Error('Invalid Positioning data: missing or empty valueProposition.');
    }
    if (!parsed.positioningStatement || typeof parsed.positioningStatement !== 'string') {
      throw new Error('Invalid Positioning data: missing or empty positioningStatement.');
    }

    const territories: PositioningTerritory[] = (Array.isArray(parsed.territories) ? parsed.territories : []).map((t: any, idx: number) => {
      const xVal = typeof t?.x === 'number' ? Math.max(5, Math.min(95, Math.round(t.x))) : (25 + idx * 25);
      const yVal = typeof t?.y === 'number' ? Math.max(5, Math.min(95, Math.round(t.y))) : (30 + idx * 20);

      const defaultQuadrant = xVal > 50
        ? (yVal < 50 ? 'Niche + Emotional/Belonging' : 'Niche + Functional/Utility')
        : (yVal < 50 ? 'Broad + Emotional/Identity' : 'Broad + Functional/Utility');

      return {
        id: t?.id || `territory-${idx + 1}`,
        name: String(t?.name || `Strategic Territory ${idx + 1}`).trim(),
        quadrant: String(t?.quadrant || defaultQuadrant).trim(),
        description: String(t?.description || 'Defensible strategic space unlocking distinct value.').trim(),
        x: xVal,
        y: yVal,
        valueProposition: String(t?.valueProposition || parsed.valueProposition).trim(),
        tradeoff: String(t?.tradeoff || 'Requires focused target resource allocation.').trim(),
      };
    });

    if (territories.length === 0) {
      territories.push({
        id: 'territory-1',
        name: 'Focused Wedge Territory',
        quadrant: 'Niche + Emotional/Belonging',
        description: 'Direct wedge solving the acute beachhead friction.',
        x: 75,
        y: 28,
        valueProposition: parsed.valueProposition,
        tradeoff: 'Limits immediate broad appeal in favor of deep high-intent conversion.',
      });
    }

    const validSelectedId = territories.some(t => t.id === parsed.selectedTerritoryId)
      ? parsed.selectedTerritoryId
      : territories[0].id;

    const keyPillars: string[] = Array.isArray(parsed.keyPillars) && parsed.keyPillars.length > 0
      ? parsed.keyPillars.map((p: any) => String(p).trim()).filter(Boolean)
      : ['Audience resonance', 'Friction elimination', 'Defensible wedge'];

    const diff = typeof parsed.primaryDifferentiation === 'string' && parsed.primaryDifferentiation.trim()
      ? parsed.primaryDifferentiation.trim()
      : (typeof parsed.differentiator === 'string' && parsed.differentiator.trim() ? parsed.differentiator.trim() : 'Uniquely engineered to eliminate core friction');

    const rationale = typeof parsed.positioningRationale === 'string' && parsed.positioningRationale.trim()
      ? parsed.positioningRationale.trim()
      : (typeof parsed.whyThisPosition === 'string' && parsed.whyThisPosition.trim() ? parsed.whyThisPosition.trim() : 'Maximizes beachhead adoption by addressing the primary unmet need.');

    const xAxis = (parsed.xAxis && typeof parsed.xAxis.lowLabel === 'string' && typeof parsed.xAxis.highLabel === 'string')
      ? { lowLabel: parsed.xAxis.lowLabel.trim(), highLabel: parsed.xAxis.highLabel.trim() }
      : { lowLabel: 'BROAD / GENERALIST', highLabel: 'NICHE / SPECIALIZED' };

    const yAxis = (parsed.yAxis && typeof parsed.yAxis.lowLabel === 'string' && typeof parsed.yAxis.highLabel === 'string')
      ? { lowLabel: parsed.yAxis.lowLabel.trim(), highLabel: parsed.yAxis.highLabel.trim() }
      : { lowLabel: 'EMOTIONAL / BELONGING', highLabel: 'FUNCTIONAL / MECHANICAL' };

    return {
      category: parsed.category.trim(),
      targetSegment: typeof parsed.targetSegment === 'string' && parsed.targetSegment.trim()
        ? parsed.targetSegment.trim()
        : 'High-intent beachhead adopters',
      valueProposition: parsed.valueProposition.trim(),
      differentiator: diff,
      primaryDifferentiation: diff,
      positioningStatement: parsed.positioningStatement.trim(),
      whyThisPosition: rationale,
      positioningRationale: rationale,
      selectedTerritoryId: validSelectedId,
      territories,
      keyPillars,
      xAxis,
      yAxis,
      isConfirmed: false,
    };
  }

  async generatePersonality(input: GeneratePersonalityInput): Promise<PersonalityData> {
    const { roughIdea, discovery, positioning, projectName } = input;
    if (!roughIdea || !roughIdea.trim()) {
      throw new Error('Rough idea is required to generate strategic brand personality.');
    }
    if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
      throw new Error('Discovery data is missing or incomplete. Discovery stage must be completed before Personality.');
    }
    if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
      throw new Error('Positioning data is missing or incomplete. Positioning stage must be completed before Personality.');
    }

    const ai = this.getClient();
    const prompt = buildPersonalityPrompt(roughIdea, discovery, positioning, projectName);

    const model = 'gemini-3.8-flash';
    let rawText: string | undefined = undefined;
    let lastError: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: PERSONALITY_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: PERSONALITY_SCHEMA,
            temperature: 0.4,
          },
        });

        rawText = response.text?.trim();
        if (rawText) break;
      } catch (err: any) {
        lastError = err;
        console.error(`[GeminiGateway] Model ${model} personality attempt ${attempt} failed:`, err.message || err);
        if (attempt < 3) {
          if (err.status === 503 || err.message?.includes('503') || err.message?.includes('high demand')) {
            await new Promise(r => setTimeout(r, attempt * 1500));
          } else if (err.status === 429 || err.message?.includes('429')) {
            await new Promise(r => setTimeout(r, 4500));
          }
        }
      }
    }

    if (!rawText && lastError) {
      let safeMessage = 'AI personality generation failed. Please try again.';
      if (lastError.status === 503 || lastError.message?.includes('503') || lastError.message?.includes('high demand')) {
        safeMessage = 'The AI model is currently experiencing high demand. Please try again in a few moments.';
      } else if (lastError.status === 429 || lastError.message?.includes('429')) {
        safeMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (lastError.message && !lastError.message.includes('API_KEY') && !lastError.message.includes('key')) {
        try {
          const parsedErr = JSON.parse(lastError.message);
          safeMessage = parsedErr?.error?.message || safeMessage;
        } catch {
          safeMessage = lastError.message;
        }
      }
      throw new Error(safeMessage);
    }

    if (!rawText) {
      throw new Error('AI generation failed: No content returned by the model.');
    }

    return this.validateAndNormalizePersonality(rawText);
  }

  private validateAndNormalizePersonality(jsonString: string): PersonalityData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Gemini output for Personality.');
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid Personality data: expected an object.');
    }

    // 1. Core Traits Validation & Normalization
    const rawTraits = Array.isArray(parsed.traits) ? parsed.traits : [];
    if (rawTraits.length === 0) {
      throw new Error('Invalid Personality data: traits array is missing or empty.');
    }

    const traits: PersonalityTrait[] = rawTraits.map((t: any, idx: number) => {
      const name = String(t?.name || `Trait 0${idx + 1}`).trim();
      const description = String(t?.description || t?.whyItFits || '').trim();
      const strategicReason = String(t?.strategicReason || t?.whyItFits || 'Derives directly from the discovered audience friction and strategic wedge.').trim();
      const whyItFits = String(t?.whyItFits || strategicReason).trim();
      const evidence = String(t?.evidence || description || 'Observed directly in target user behavioral patterns.').trim();

      if (!name) {
        throw new Error(`Invalid Personality data: trait at index ${idx} is missing a name.`);
      }

      return {
        name,
        description: description || whyItFits,
        strategicReason,
        whyItFits,
        evidence,
      };
    });

    // 2. Avoid Traits Validation & Normalization
    const rawAvoid = Array.isArray(parsed.avoidTraits) 
      ? parsed.avoidTraits 
      : (Array.isArray(parsed.traitsToAvoid) ? parsed.traitsToAvoid : []);

    const traitsToAvoid: TraitToAvoid[] = (rawAvoid.length > 0 ? rawAvoid : [
      {
        name: 'Corporate Platitudes',
        description: 'Vague marketing buzzwords that lack concrete operational utility.',
        reasonToAvoid: 'Destroys credibility with practitioners who need immediate clarity.',
      },
      {
        name: 'Hype-Driven Superficiality',
        description: 'Over-promising unverified capabilities.',
        reasonToAvoid: 'Breaks long-term trust and invites aggressive competitive scrutiny.',
      }
    ]).map((a: any, idx: number) => {
      const name = String(a?.name || a?.trait || `Anti-Archetype 0${idx + 1}`).trim();
      const reasonToAvoid = String(a?.reasonToAvoid || a?.reason || 'Violates the primary trust model of the target segment.').trim();
      const description = String(a?.description || reasonToAvoid).trim();

      return {
        name,
        trait: name,
        description,
        reasonToAvoid,
        reason: reasonToAvoid,
      };
    });

    // 3. Brand Principles Validation & Normalization
    const rawPrinciples = Array.isArray(parsed.principles) ? parsed.principles : [];
    const brandPrinciples: BrandPrinciple[] = [];
    const principleStrings: string[] = [];

    if (rawPrinciples.length > 0) {
      rawPrinciples.forEach((p: any, idx: number) => {
        if (typeof p === 'string' && p.trim()) {
          principleStrings.push(p.trim());
          brandPrinciples.push({
            name: `Principle 0${idx + 1}`,
            statement: p.trim(),
            implication: 'Guides all decisions regarding message clarity and operational focus.',
          });
        } else if (p && typeof p === 'object') {
          const name = String(p.name || `Principle 0${idx + 1}`).trim();
          const statement = String(p.statement || p.name || 'Operate with deliberate simplicity.').trim();
          const implication = String(p.implication || 'Prefer direct clarity over decorative complexity.').trim();
          brandPrinciples.push({ name, statement, implication });
          principleStrings.push(`${name}: ${statement}`);
        }
      });
    }

    if (brandPrinciples.length === 0) {
      brandPrinciples.push(
        {
          name: 'Clarity Over Cleverness',
          statement: 'If a message can be understood immediately, prefer the clearer version over the more impressive-sounding one.',
          implication: 'Audit all user-facing touchpoints for cognitive friction before launch.',
        },
        {
          name: 'Proof Over Promise',
          statement: 'Demonstrate functional reliability with concrete mechanics rather than broad claims.',
          implication: 'Lead with evidence and product transparency in all communications.',
        },
        {
          name: 'Respect The User Clock',
          statement: 'Eliminate every unnecessary step between user intent and completed outcome.',
          implication: 'Keep onboarding and transactional interactions strictly under 60 seconds.',
        }
      );
      brandPrinciples.forEach(bp => principleStrings.push(`${bp.name}: ${bp.statement}`));
    }

    // 4. Dimensions Validation & Normalization
    const rawDims = Array.isArray(parsed.dimensions) ? parsed.dimensions : [];
    const dimensions: PersonalityDimension[] = (rawDims.length > 0 ? rawDims : [
      { dimension: 'Formality', value: 30, lowLabel: 'Conversational & Peer', highLabel: 'Institutional & Formal', rationale: 'Fosters rapid psychological safety with builders.' },
      { dimension: 'Communication Density', value: 25, lowLabel: 'Minimal & Telegraphic', highLabel: 'Expansive & Narrative', rationale: 'Prioritizes immediate comprehension without cognitive clutter.' },
      { dimension: 'Tone Energy', value: 75, lowLabel: 'Calm & Measured', highLabel: 'Kinetic & Provocative', rationale: 'Injects decisive urgency into critical workflows.' },
      { dimension: 'Perspective', value: 80, lowLabel: 'Consensus-seeking', highLabel: 'Opinionated & Decisive', rationale: 'Users rely on this brand to offer unambiguous strategic recommendations.' }
    ]).map((d: any, idx: number) => {
      const val = typeof d?.value === 'number' ? Math.max(0, Math.min(100, Math.round(d.value))) : 50;
      return {
        dimension: String(d?.dimension || `Dimension 0${idx + 1}`).trim(),
        value: val,
        lowLabel: String(d?.lowLabel || 'Low').trim(),
        highLabel: String(d?.highLabel || 'High').trim(),
        rationale: String(d?.rationale || 'Calibrated to maximize trust with target segment.').trim(),
      };
    });

    // 5. Voice System Validation & Normalization
    const rawVoice = (parsed.voice && typeof parsed.voice === 'object') ? parsed.voice : {};
    const voiceSummary = String(rawVoice.summary || parsed.voiceAndTone?.tone || 'Direct, intellectually honest, pragmatic, and encouraging').trim();

    const voiceChars: VoiceCharacteristic[] = (Array.isArray(rawVoice.characteristics) ? rawVoice.characteristics : []).map((vc: any) => ({
      characteristic: String(vc?.characteristic || 'Decisive & Crisp').trim(),
      explanation: String(vc?.explanation || 'Uses active verbs and concise syntax.').trim(),
    }));

    if (voiceChars.length === 0) {
      voiceChars.push(
        { characteristic: 'Direct & Unvarnished', explanation: 'Speaks with precision, eliminating corporate qualifiers and filler words.' },
        { characteristic: 'Practitioner-First', explanation: 'Uses terminology familiar to experienced users without condescension.' },
        { characteristic: 'Action-Oriented', explanation: 'Frames every insight around what the user can build or execute next.' }
      );
    }

    const toneRules: VoiceToneRule[] = (Array.isArray(rawVoice.toneRules) ? rawVoice.toneRules : []).map((tr: any) => ({
      do: String(tr?.do || 'Write in active voice with clear verbs.').trim(),
      avoid: String(tr?.avoid || 'Avoid passive corporate phrasing.').trim(),
      example: String(tr?.example || 'Build your high-chemistry team in 3 clicks.').trim(),
    }));

    if (toneRules.length === 0) {
      toneRules.push(
        {
          do: 'State the functional benefit before introducing the mechanism.',
          avoid: 'Leading with technical abstractions or proprietary terminology.',
          example: 'Match with complementary co-builders instantly using our verified skill index.',
        },
        {
          do: 'Acknowledge tradeoffs openly when making recommendations.',
          avoid: 'Pretending a single solution is universally perfect for every edge case.',
          example: 'This territory prioritizes sprint velocity over long-term multi-year retention loops.',
        }
      );
    }

    // 6. Writing Samples Validation & Normalization
    const rawSamples = (parsed.writingSamples && typeof parsed.writingSamples === 'object') ? parsed.writingSamples : {};
    const writingSamples: WritingSamples = {
      headline: String(rawSamples.headline || 'Stop Competing Solo. Build Your Squad in Minutes.').trim(),
      valueProposition: String(rawSamples.valueProposition || 'Turn solitary makers into high-chemistry, complementary squads before the clock starts.').trim(),
      socialMessage: String(rawSamples.socialMessage || 'Building alone this weekend? Match with a killer UI designer and backend engineer right now on BrandForge.').trim(),
      userExplanation: String(rawSamples.userExplanation || 'We pair complementary skills and commitment levels so your project gets built and shipped on time.').trim(),
    };

    const voiceAndTone = {
      tone: voiceSummary,
      summary: voiceSummary,
      voiceCharacteristics: voiceChars.map(vc => `${vc.characteristic}: ${vc.explanation}`),
      characteristics: voiceChars,
      toneRules,
      writingSampleDo: `${writingSamples.headline} — ${writingSamples.valueProposition}`,
      writingSampleDont: toneRules[0]?.avoid || 'Leverage synergistic multi-tenant human capital allocation engines.',
      writingSamples,
    };

    return {
      traits,
      traitsToAvoid,
      avoidTraits: traitsToAvoid,
      principles: principleStrings,
      brandPrinciples,
      dimensions,
      voice: {
        summary: voiceSummary,
        characteristics: voiceChars,
        toneRules,
      },
      writingSamples,
      voiceAndTone,
      isConfirmed: false,
    };
  }

  async generateNaming(input: GenerateNamingInput): Promise<NamingData> {
    const { roughIdea, discovery, positioning, personality, projectName } = input;
    if (!roughIdea || !roughIdea.trim()) {
      throw new Error('Rough idea is required to generate strategic brand naming.');
    }
    if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
      throw new Error('Discovery data is missing or incomplete. Discovery stage must be completed before Naming.');
    }
    if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
      throw new Error('Positioning data is missing or incomplete. Positioning stage must be completed before Naming.');
    }
    if (!personality || !personality.traits || personality.traits.length === 0) {
      throw new Error('Personality data is missing or incomplete. Personality stage must be completed before Naming.');
    }

    const ai = this.getClient();
    const prompt = buildNamingPrompt(roughIdea, discovery, positioning, personality, projectName);

    const model = 'gemini-3.8-flash';
    let rawText: string | undefined = undefined;
    let lastError: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: NAMING_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: NAMING_SCHEMA,
            temperature: 0.4,
          },
        });

        rawText = response.text?.trim();
        if (rawText) break;
      } catch (err: any) {
        lastError = err;
        console.error(`[GeminiGateway] Model ${model} naming attempt ${attempt} failed:`, err.message || err);
        if (attempt < 3) {
          if (err.status === 503 || err.message?.includes('503') || err.message?.includes('high demand')) {
            await new Promise(r => setTimeout(r, attempt * 1500));
          } else if (err.status === 429 || err.message?.includes('429')) {
            await new Promise(r => setTimeout(r, 4500));
          }
        }
      }
    }

    if (!rawText && lastError) {
      let safeMessage = 'AI naming generation failed. Please try again.';
      if (lastError.status === 503 || lastError.message?.includes('503') || lastError.message?.includes('high demand')) {
        safeMessage = 'The AI model is currently experiencing high demand. Please try again in a few moments.';
      } else if (lastError.status === 429 || lastError.message?.includes('429')) {
        safeMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (lastError.message && !lastError.message.includes('API_KEY') && !lastError.message.includes('key')) {
        try {
          const parsedErr = JSON.parse(lastError.message);
          safeMessage = parsedErr?.error?.message || safeMessage;
        } catch {
          safeMessage = lastError.message;
        }
      }
      throw new Error(safeMessage);
    }

    if (!rawText) {
      throw new Error('AI generation failed: No content returned by the model.');
    }

    return this.validateAndNormalizeNaming(rawText);
  }

  private validateAndNormalizeNaming(jsonString: string): NamingData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Gemini output for Naming.');
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid Naming data: expected an object.');
    }

    // 1. Naming Strategy & Brief
    const namingStrategy = String(
      parsed.namingStrategy ||
      'Formulate memorable, high-trust wordmarks that anchor the brand value proposition and differentiate against generic incumbent workarounds.'
    ).trim();

    const namingBrief = String(
      parsed.namingBrief ||
      'Names must resonate with practitioners, project deliberate craftsmanship, and avoid cliché startup suffixes.'
    ).trim();

    // 2. Naming Worlds
    const rawWorlds = Array.isArray(parsed.namingWorlds) ? parsed.namingWorlds : [];
    if (rawWorlds.length === 0) {
      throw new Error('Invalid Naming data: namingWorlds array is missing or empty.');
    }

    const namingWorlds: NamingWorld[] = rawWorlds.map((w: any, idx: number) => {
      const id = String(w?.id || `world-${idx + 1}`).trim();
      const name = String(w?.name || `Naming Territory 0${idx + 1}`).trim();
      const description = String(w?.description || 'Defensible strategic naming territory.').trim();
      const strategicIdea = String(w?.strategicIdea || description).trim();
      const namingLogic = String(w?.namingLogic || 'Constructed using grounded metaphorical morphemes.').trim();
      const emotionalTerritory = String(w?.emotionalTerritory || 'Empathetic, clear, and high-trust.').trim();
      const tradeoff = String(w?.tradeoff || 'Requires focused audience calibration.').trim();
      const examples = Array.isArray(w?.examples)
        ? w.examples.map((ex: any) => String(ex).trim()).filter(Boolean)
        : [];

      return {
        id,
        name,
        description,
        strategicIdea,
        namingLogic,
        emotionalTerritory,
        tradeoff,
        examples,
      };
    });

    const validWorldIds = new Set(namingWorlds.map(w => w.id));

    // 3. Candidates
    const rawCandidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];
    if (rawCandidates.length === 0) {
      throw new Error('Invalid Naming data: candidates array is missing or empty.');
    }

    // Deduplicate candidates by lowercase name
    const seenNames = new Set<string>();
    const candidates: NameCandidate[] = [];

    for (let idx = 0; idx < rawCandidates.length; idx++) {
      const c = rawCandidates[idx];
      const name = String(c?.name || '').trim();
      if (!name) continue;

      const lower = name.toLowerCase();
      if (seenNames.has(lower)) continue;
      seenNames.add(lower);

      const id = String(c?.id || `cand-${candidates.length + 1}`).trim();
      let worldId = String(c?.worldId || '').trim();
      if (!validWorldIds.has(worldId)) {
        worldId = namingWorlds[candidates.length % namingWorlds.length].id;
      }

      const meaning = String(c?.meaning || 'Clean compound morphemes reinforcing brand capability.').trim();
      const strategicRationale = String(c?.strategicRationale || 'Directly reinforces the strategic positioning wedge.').trim();
      const personalityFit = String(c?.personalityFit || 'Harmonizes with established brand tone and voice heuristics.').trim();
      const potentialWeakness = String(c?.potentialWeakness || 'Requires deliberate initial context framing in early marketing.').trim();
      const concept = String(c?.concept || meaning).trim();
      const pronunciation = String(c?.pronunciation || name).trim();

      // Normalize evaluation
      const rawEval = (c?.evaluation && typeof c.evaluation === 'object') ? c.evaluation : {};
      const clampScore = (val: any, defaultScore: number) => {
        const num = typeof val === 'number' ? Math.round(val) : defaultScore;
        return Math.max(0, Math.min(100, num));
      };

      const evaluation: NamingEvaluation = {
        strategicFit: clampScore(rawEval.strategicFit, 85),
        positioningFit: clampScore(rawEval.positioningFit, 82),
        personalityFit: clampScore(rawEval.personalityFit, 80),
        audienceFit: clampScore(rawEval.audienceFit, 84),
        distinctiveness: clampScore(rawEval.distinctiveness, 88),
        memorability: clampScore(rawEval.memorability, 86),
        pronunciation: clampScore(rawEval.pronunciation, 90),
        flexibility: clampScore(rawEval.flexibility, 78),
        risks: Array.isArray(rawEval.risks) && rawEval.risks.length > 0
          ? rawEval.risks.map((r: any) => String(r).trim()).filter(Boolean)
          : [potentialWeakness],
        rationale: String(rawEval.rationale || strategicRationale).trim(),
      };

      candidates.push({
        id,
        name,
        worldId,
        pronunciation,
        meaning,
        concept,
        strategicRationale,
        personalityFit,
        potentialWeakness,
        evaluation,
        status: 'candidate',
      });
    }

    if (candidates.length === 0) {
      throw new Error('Invalid Naming data: no valid candidates found after parsing.');
    }

    // 4. Construct NamingTerritory[] for backward compatibility
    const territories: NamingTerritory[] = namingWorlds.map((world, idx) => {
      const worldCandidates = candidates.filter(c => c.worldId === world.id);
      return {
        id: world.id,
        number: `0${idx + 1}`.slice(-2),
        name: world.name,
        theme: world.emotionalTerritory || world.description,
        rationale: world.strategicIdea || world.namingLogic,
        description: world.description,
        strategicIdea: world.strategicIdea,
        namingLogic: world.namingLogic,
        emotionalTerritory: world.emotionalTerritory,
        tradeoff: world.tradeoff,
        examples: world.examples,
        candidates: worldCandidates.length > 0 ? worldCandidates : candidates.slice(0, 3),
      };
    });

    const selectedName = candidates[0] || null;

    return {
      namingStrategy,
      namingBrief,
      namingWorlds,
      territories,
      candidates,
      shortlistedCandidateIds: [],
      selectedCandidateId: selectedName ? selectedName.id : '',
      selectedNameId: selectedName ? selectedName.id : '',
      selectedName,
      selectionRationale: selectedName ? selectedName.strategicRationale : '',
      isConfirmed: false,
    };
  }
}

export const geminiGateway = new GeminiGateway();
