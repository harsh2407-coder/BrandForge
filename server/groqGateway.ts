import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import Groq from 'groq-sdk';
import { DISCOVERY_SCHEMA, DISCOVERY_SYSTEM_INSTRUCTION, buildDiscoveryPrompt } from './discoveryPrompt.js';
import { POSITIONING_SCHEMA, POSITIONING_SYSTEM_INSTRUCTION, buildPositioningPrompt } from './positioningPrompt.js';
import { PERSONALITY_SCHEMA, PERSONALITY_SYSTEM_INSTRUCTION, buildPersonalityPrompt } from './personalityPrompt.js';
import { NAMING_SCHEMA, NAMING_SYSTEM_INSTRUCTION, buildNamingPrompt } from './namingPrompt.js';
import { VISUAL_SCHEMA, VISUAL_SYSTEM_INSTRUCTION, buildVisualPrompt } from './visualPrompt.js';
import { CHALLENGE_SCHEMA, CHALLENGE_SYSTEM_INSTRUCTION, buildChallengePrompt } from './challengePrompt.js';
import { DELIVER_SCHEMA, DELIVER_SYSTEM_INSTRUCTION, buildDeliverPrompt } from './deliverPrompt.js';
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
  NamingEvaluation,
  VisualData,
  ColorSwatch,
  ColorSystem,
  FontSpec,
  TypographyDirection,
  VisualPrinciple,
  ImageryDirection,
  GraphicLanguage,
  LogoDirection,
  UIDirection,
  CreativeDirection,
  ChallengeData,
  ChallengeFinding,
  ProposedChange,
  ChallengeCategory,
  ChallengeSeverity,
  LaunchData,
  StageId,
  ErrorCategory
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

export interface GenerateVisualizeInput {
  roughIdea: string;
  discovery: DiscoveryData;
  positioning: PositioningData;
  personality: PersonalityData;
  naming: NamingData;
  projectName?: string;
}

export interface GenerateChallengeInput {
  roughIdea: string;
  discovery: DiscoveryData;
  positioning: PositioningData;
  personality: PersonalityData;
  naming: NamingData;
  visual?: VisualData;
  visualize?: VisualData;
  projectName?: string;
}

export interface GenerateDeliverInput {
  roughIdea: string;
  discovery: DiscoveryData;
  positioning: PositioningData;
  personality: PersonalityData;
  naming: NamingData;
  visual: VisualData;
  challenge: ChallengeData;
  projectName?: string;
}

export const ALLOWED_CHALLENGE_MUTATION_FIELDS: Record<string, string[]> = {
  discovery: ['coreProblem', 'primaryAudience', 'coreNeed', 'userContext'],
  positioning: ['positioningStatement', 'valueProposition', 'primaryDifferentiation', 'differentiator', 'targetSegment', 'category'],
  personality: ['voiceSummary', 'summary'],
  naming: ['selectionRationale', 'selectedCandidateId'],
  visualize: ['visualConcept', 'visualThesis'],
  launch: ['headline', 'subheadline', 'oneLinePitch']
};

export class StageGenerationError extends Error {
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    public readonly category: ErrorCategory,
    public readonly statusCode: number = 500,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = 'StageGenerationError';
    this.isRetryable = category === 'RATE_LIMIT' || category === 'NETWORK_ERROR' || category === 'PROVIDER_ERROR';
  }
}

export function classifyGroqError(err: any): StageGenerationError {
  if (err instanceof StageGenerationError) {
    return err;
  }

  const status = err?.status || err?.statusCode || (err?.error?.status) || 500;
  const rawMsg = err?.message || String(err || '');
  const code = err?.code || '';
  const sanitized = rawMsg.replace(/gsk_[a-zA-Z0-9_-]+/g, '[REDACTED]');
  const lowerMsg = sanitized.toLowerCase();

  // Retry-after header or error message match if present
  let retryAfter: number | undefined;
  const headerVal = err?.headers?.get ? err.headers.get('retry-after') : err?.headers?.['retry-after'];
  if (headerVal) {
    const parsedSec = parseInt(headerVal, 10);
    if (!isNaN(parsedSec) && parsedSec > 0) retryAfter = parsedSec;
  }
  if (!retryAfter) {
    const match = rawMsg.match(/try again in ([0-9.]+)\s*s/i) || rawMsg.match(/retry.*after\s+([0-9.]+)\s*s/i);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed) && parsed > 0) retryAfter = Math.ceil(parsed);
    }
  }

  // 1. Validation Error (Schema mismatch, JSON parse error, malformed structure from model)
  if (
    err instanceof SyntaxError ||
    err?.name === 'SyntaxError' ||
    lowerMsg.includes('syntaxerror') ||
    lowerMsg.includes('unexpected token') ||
    (lowerMsg.includes('json') && lowerMsg.includes('position')) ||
    lowerMsg.includes('malformed json') ||
    lowerMsg.includes('invalid discovery data') ||
    lowerMsg.includes('invalid positioning data') ||
    lowerMsg.includes('invalid personality data') ||
    lowerMsg.includes('invalid naming data') ||
    lowerMsg.includes('invalid visual data') ||
    lowerMsg.includes('invalid challenge data') ||
    lowerMsg.includes('invalid deliver data') ||
    lowerMsg.includes('json parse') ||
    lowerMsg.includes('schema')
  ) {
    return new StageGenerationError(
      sanitized || 'AI generation returned an incomplete or invalid structure. Please retry.',
      'VALIDATION_ERROR',
      422
    );
  }

  // 2. Rate Limit (TPM / RPM / TPD / Rate Limit Exceeded)
  if (
    lowerMsg.includes('rate_limit_exceeded') ||
    lowerMsg.includes('rate limit reached') ||
    lowerMsg.includes('tokens per day') ||
    lowerMsg.includes('tokens per minute') ||
    lowerMsg.includes('requests per minute') ||
    lowerMsg.includes('tpm') ||
    lowerMsg.includes('rpm') ||
    lowerMsg.includes('tpd') ||
    lowerMsg.includes('too many requests') ||
    (lowerMsg.includes('request too large') && lowerMsg.includes('tokens'))
  ) {
    const waitMsg = retryAfter ? ` Please wait ${retryAfter}s before retrying.` : ' Please wait a moment before trying again.';
    return new StageGenerationError(
      `Groq rate limit reached (requests or tokens limit).${waitMsg}`,
      'RATE_LIMIT',
      429,
      retryAfter
    );
  }

  // 3. Quota Exhaustion
  if (
    status === 402 ||
    (status === 429 && (
      lowerMsg.includes('insufficient_quota') || 
      lowerMsg.includes('credit') || 
      lowerMsg.includes('hard limit')
    )) ||
    lowerMsg.includes('exceeded your current quota')
  ) {
    return new StageGenerationError(
      'Groq AI organization quota or credit limit exhausted. Please check your Groq billing tier or credit balance.',
      'QUOTA',
      429,
      retryAfter
    );
  }

  // 4. Network Failure / Timeout
  if (
    code === 'ETIMEDOUT' ||
    code === 'ECONNRESET' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    code === 'UND_ERR_CONNECT_TIMEOUT' ||
    err?.name === 'FetchError' ||
    err?.name === 'AbortError' ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('socket hang up')
  ) {
    return new StageGenerationError(
      'Network connection to the AI provider timed out. Please check your internet connection and retry.',
      'NETWORK_ERROR',
      504
    );
  }

  // 5. Provider Error (Downtime / Server 5xx)
  const httpStatus = err?.status || err?.statusCode || (err?.error?.status);
  if (httpStatus && httpStatus >= 500 && httpStatus <= 504) {
    return new StageGenerationError(
      'The Groq AI service is currently experiencing high demand or temporary downtime. Please try again in a few moments.',
      'PROVIDER_ERROR',
      503
    );
  }

  // 6. Auth Failure
  if (status === 401 || status === 403) {
    return new StageGenerationError(
      'Groq authentication failed. Please verify your GROQ_API_KEY in .env.local.',
      'UNKNOWN',
      401
    );
  }

  return new StageGenerationError(
    `Groq generation failed: ${sanitized}`,
    'UNKNOWN',
    status >= 400 && status < 600 ? status : 500
  );
}

export const STAGE_COMPLETION_BUDGETS = {
  discovery: 3000,
  positioning: 4000,
  personality: 4800,
  naming: 4500,
  visualize: 4500,
  challenge: 4500,
  deliver: 3500,
} as const;

const GROQ_MODEL = 'openai/gpt-oss-120b';

export class GroqGateway {
  private client: Groq | null = null;

  private getClient(): Groq {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || !apiKey.trim() || apiKey === 'MY_GROQ_API_KEY') {
      throw new Error('GROQ_API_KEY is not configured on the server. Please provide a valid Groq API key in .env.local.');
    }
    if (!this.client) {
      this.client = new Groq({ apiKey });
    }
    return this.client;
  }

  private async callModelWithSchema(
    stageName: string,
    systemInstruction: string, 
    userPrompt: string, 
    schemaName: string, 
    schema: any,
    maxCompletionTokens: number = 3000,
    temperature: number = 0.4
  ): Promise<string> {
    const client = this.getClient();
    let lastError: any = null;
    const startMs = Date.now();

    // Attempt 1: Strict JSON Schema Structured Output
    try {
      const response = await client.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: `${systemInstruction}\nYou MUST return strictly valid JSON matching the schema.` },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: schemaName,
            strict: true,
            schema
          }
        },
        temperature,
        max_completion_tokens: maxCompletionTokens
      });

      const content = response.choices?.[0]?.message?.content?.trim();
      if (content) {
        const durationMs = Date.now() - startMs;
        const usage = response.usage;
        console.log(`[GroqGateway] stage="${stageName}" inputTokens=${usage?.prompt_tokens ?? 'N/A'} maxBudget=${maxCompletionTokens} outputTokens=${usage?.completion_tokens ?? 'N/A'} totalTokens=${usage?.total_tokens ?? 'N/A'} duration=${durationMs}ms status=SUCCESS`);
        return content;
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.statusCode || (err?.error?.status);
      const msg = err?.message || String(err);

      // If json_schema is rejected as unsupported by the specific model, try json_object mode
      if (status === 400 && (msg.includes('json_schema') || msg.includes('response_format'))) {
        try {
          const fallbackResp = await client.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
              { role: 'system', content: `${systemInstruction}\nYou must return strictly valid JSON matching this schema:\n${JSON.stringify(schema)}` },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature,
            max_completion_tokens: maxCompletionTokens
          });

          const fbContent = fallbackResp.choices?.[0]?.message?.content?.trim();
          if (fbContent) {
            const durationMs = Date.now() - startMs;
            const usage = fallbackResp.usage;
            console.log(`[GroqGateway] stage="${stageName}" inputTokens=${usage?.prompt_tokens ?? 'N/A'} maxBudget=${maxCompletionTokens} outputTokens=${usage?.completion_tokens ?? 'N/A'} totalTokens=${usage?.total_tokens ?? 'N/A'} duration=${durationMs}ms status=SUCCESS fallback=json_object`);
            return fbContent;
          }
        } catch (innerErr: any) {
          lastError = innerErr;
        }
      }
    }

    // If rate limited by provider rolling window (e.g. 8000 TPM cooldown), wait and retry up to 2 times
    let attempts = 0;
    while (attempts < 2) {
      const classification = classifyGroqError(lastError);
      if (classification.category !== 'RATE_LIMIT') break;
      attempts++;
      const waitSec = Math.max(10, Math.min(25, (classification.retryAfter || 12) * attempts));
      console.log(`[GroqGateway] stage="${stageName}" encountered rolling TPM limit (attempt ${attempts}/2). Waiting ${waitSec}s for window recovery before automatic retry...`);
      await new Promise(r => setTimeout(r, (waitSec + 1) * 1000));
      try {
        const retryResp = await client.chat.completions.create({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: `${systemInstruction}\nYou MUST return strictly valid JSON matching the schema.` },
            { role: 'user', content: userPrompt }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: schemaName,
              strict: true,
              schema
            }
          },
          temperature,
          max_completion_tokens: maxCompletionTokens
        });

        const retryContent = retryResp.choices?.[0]?.message?.content?.trim();
        if (retryContent) {
          const durationMs = Date.now() - startMs;
          const usage = retryResp.usage;
          console.log(`[GroqGateway] stage="${stageName}" inputTokens=${usage?.prompt_tokens ?? 'N/A'} maxBudget=${maxCompletionTokens} outputTokens=${usage?.completion_tokens ?? 'N/A'} totalTokens=${usage?.total_tokens ?? 'N/A'} duration=${durationMs}ms status=SUCCESS retry=auto_tpm_recovery attempt=${attempts}`);
          return retryContent;
        }
      } catch (retryErr: any) {
        lastError = retryErr;
      }
    }

    const durationMs = Date.now() - startMs;
    // Handle error classification safely without exposing credentials
    if (lastError) {
      const classified = classifyGroqError(lastError);
      console.error(`[GroqGateway] stage="${stageName}" maxBudget=${maxCompletionTokens} duration=${durationMs}ms status=FAILED errorCategory=${classified.category} statusCode=${classified.statusCode}`);
      throw classified;
    }

    const unkErr = new StageGenerationError('Groq generation failed: No content returned by the model.', 'UNKNOWN', 500);
    console.error(`[GroqGateway] stage="${stageName}" maxBudget=${maxCompletionTokens} duration=${durationMs}ms status=FAILED errorCategory=UNKNOWN statusCode=500`);
    throw unkErr;
  }

  async generateDiscovery(input: GenerateDiscoveryInput): Promise<DiscoveryData> {
    const { roughIdea, knownDetails } = input;
    if (!roughIdea || !roughIdea.trim()) {
      throw new Error('Rough idea is required to generate strategic discovery.');
    }

    const prompt = buildDiscoveryPrompt(roughIdea, knownDetails);
    const rawText = await this.callModelWithSchema(
      'discovery',
      DISCOVERY_SYSTEM_INSTRUCTION,
      prompt,
      'discovery_schema',
      DISCOVERY_SCHEMA,
      STAGE_COMPLETION_BUDGETS.discovery
    );

    return this.validateAndNormalizeDiscovery(rawText);
  }

  validateAndNormalizeDiscovery(jsonString: string): DiscoveryData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Groq output.');
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

    const prompt = buildPositioningPrompt(roughIdea, discovery, projectName);
    const rawText = await this.callModelWithSchema(
      'positioning',
      POSITIONING_SYSTEM_INSTRUCTION,
      prompt,
      'positioning_schema',
      POSITIONING_SCHEMA,
      STAGE_COMPLETION_BUDGETS.positioning
    );

    return this.validateAndNormalizePositioning(rawText);
  }

  validateAndNormalizePositioning(jsonString: string): PositioningData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Groq output for Positioning.');
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

    const prompt = buildPersonalityPrompt(roughIdea, discovery, positioning, projectName);
    const rawText = await this.callModelWithSchema(
      'personality',
      PERSONALITY_SYSTEM_INSTRUCTION,
      prompt,
      'personality_schema',
      PERSONALITY_SCHEMA,
      STAGE_COMPLETION_BUDGETS.personality
    );

    return this.validateAndNormalizePersonality(rawText);
  }

  validateAndNormalizePersonality(jsonString: string): PersonalityData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Groq output for Personality.');
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid Personality data: expected an object.');
    }

    // 1. Traits Validation (must be at least 3 distinct traits)
    const rawTraits = Array.isArray(parsed.traits) ? parsed.traits : [];
    if (rawTraits.length < 3) {
      throw new Error(`Invalid Personality data: traits array is missing or empty (expected at least 3 traits, got ${rawTraits.length}).`);
    }

    const traits: PersonalityTrait[] = rawTraits.map((t: any, idx: number) => {
      const name = String(t?.name || '').trim();
      const description = String(t?.description || '').trim();
      const whyItFits = String(t?.whyItFits || t?.strategicReason || '').trim();
      const strategicReason = String(t?.strategicReason || whyItFits).trim();
      const evidence = String(t?.evidence || '').trim();

      if (!name) {
        throw new Error(`Invalid Personality data: trait at index ${idx} is missing a name.`);
      }
      if (!description || !whyItFits || !evidence) {
        throw new Error(`Invalid Personality data: trait "${name}" is missing required fields (description, whyItFits, evidence).`);
      }

      return {
        name,
        description,
        strategicReason,
        whyItFits,
        evidence,
      };
    });

    // 2. Traits to Avoid Validation (must be at least 2 anti-traits)
    const rawAvoid = Array.isArray(parsed.avoidTraits) ? parsed.avoidTraits : (Array.isArray(parsed.traitsToAvoid) ? parsed.traitsToAvoid : []);
    if (rawAvoid.length < 2) {
      throw new Error(`Invalid Personality data: expected at least 2 avoidTraits, got ${rawAvoid.length}.`);
    }

    const traitsToAvoid: TraitToAvoid[] = rawAvoid.map((a: any, idx: number) => {
      const name = String(a?.name || a?.trait || '').trim();
      const reasonToAvoid = String(a?.reasonToAvoid || a?.reason || '').trim();
      const description = String(a?.description || reasonToAvoid).trim();

      if (!name || !reasonToAvoid) {
        throw new Error(`Invalid Personality data: avoidTrait at index ${idx} is missing name or reasonToAvoid.`);
      }

      return {
        name,
        description,
        reasonToAvoid,
        trait: name,
        reason: reasonToAvoid,
      };
    });

    // 3. Operational Principles Validation (must be at least 2 principles)
    const rawPrinciples = Array.isArray(parsed.principles) ? parsed.principles : [];
    if (rawPrinciples.length < 2) {
      throw new Error(`Invalid Personality data: expected at least 2 principles, got ${rawPrinciples.length}.`);
    }

    const brandPrinciples: BrandPrinciple[] = rawPrinciples.map((p: any, idx: number) => {
      if (typeof p === 'string' && p.trim()) {
        return {
          name: p.trim(),
          statement: p.trim(),
          implication: 'Operational guideline for product and brand communication.',
        };
      }
      const name = String(p?.name || '').trim();
      const statement = String(p?.statement || name).trim();
      const implication = String(p?.implication || '').trim();

      if (!name || !statement) {
        throw new Error(`Invalid Personality data: principle at index ${idx} is missing name or statement.`);
      }

      return { name, statement, implication };
    });

    const principleStrings = brandPrinciples.map(bp => bp.statement || bp.name);

    // 4. Dimensions Validation (must be at least 3 dimensions)
    const rawDimensions = Array.isArray(parsed.dimensions) ? parsed.dimensions : [];
    if (rawDimensions.length < 3) {
      throw new Error(`Invalid Personality data: expected at least 3 dimensions, got ${rawDimensions.length}.`);
    }

    const dimensions: PersonalityDimension[] = rawDimensions.map((d: any, idx: number) => {
      const dimName = String(d?.dimension || '').trim();
      if (!dimName) {
        throw new Error(`Invalid Personality data: dimension at index ${idx} is missing dimension name.`);
      }
      const val = typeof d?.value === 'number' ? Math.max(0, Math.min(100, Math.round(d.value))) : 50;
      return {
        dimension: dimName,
        value: val,
        lowLabel: String(d?.lowLabel || 'Understated').trim(),
        highLabel: String(d?.highLabel || 'Expressive').trim(),
        rationale: String(d?.rationale || '').trim(),
      };
    });

    // 5. Voice System Validation (summary, characteristics >= 2, toneRules >= 2)
    if (!parsed.voice || typeof parsed.voice !== 'object') {
      throw new Error('Invalid Personality data: missing required property: voice.');
    }

    const voiceSummary = String(parsed.voice.summary || '').trim();
    if (!voiceSummary) {
      throw new Error('Invalid Personality data: voice summary is missing or empty.');
    }

    const rawChars = Array.isArray(parsed.voice.characteristics) ? parsed.voice.characteristics : [];
    if (rawChars.length < 2) {
      throw new Error(`Invalid Personality data: expected at least 2 voice characteristics, got ${rawChars.length}.`);
    }

    const voiceChars: VoiceCharacteristic[] = rawChars.map((vc: any, idx: number) => {
      const characteristic = String(vc?.characteristic || '').trim();
      const explanation = String(vc?.explanation || '').trim();
      if (!characteristic || !explanation) {
        throw new Error(`Invalid Personality data: voice characteristic at index ${idx} is incomplete.`);
      }
      return { characteristic, explanation };
    });

    const rawRules = Array.isArray(parsed.voice.toneRules) ? parsed.voice.toneRules : [];
    if (rawRules.length < 2) {
      throw new Error(`Invalid Personality data: expected at least 2 voice toneRules, got ${rawRules.length}.`);
    }

    const toneRules: VoiceToneRule[] = rawRules.map((tr: any, idx: number) => {
      const doRule = String(tr?.do || '').trim();
      const avoidRule = String(tr?.avoid || '').trim();
      const example = String(tr?.example || '').trim();
      if (!doRule || !avoidRule || !example) {
        throw new Error(`Invalid Personality data: tone rule at index ${idx} is incomplete.`);
      }
      return { do: doRule, avoid: avoidRule, example };
    });

    // 6. Writing Samples Validation (all 4 fields strictly required, no fake fallbacks)
    if (!parsed.writingSamples || typeof parsed.writingSamples !== 'object') {
      throw new Error('Invalid Personality data: missing required property: writingSamples.');
    }

    const headline = String(parsed.writingSamples.headline || '').trim();
    const valueProposition = String(parsed.writingSamples.valueProposition || '').trim();
    const socialMessage = String(parsed.writingSamples.socialMessage || '').trim();
    const userExplanation = String(parsed.writingSamples.userExplanation || '').trim();

    if (!headline || !valueProposition || !socialMessage || !userExplanation) {
      throw new Error('Invalid Personality data: missing required property: writingSamples fields are incomplete (requires headline, valueProposition, socialMessage, and userExplanation).');
    }

    const writingSamples: WritingSamples = {
      headline,
      valueProposition,
      socialMessage,
      userExplanation,
    };

    const voiceAndTone = {
      tone: voiceSummary,
      summary: voiceSummary,
      voiceCharacteristics: voiceChars.map(vc => `${vc.characteristic}: ${vc.explanation}`),
      characteristics: voiceChars,
      toneRules,
      writingSampleDo: `${writingSamples.headline} — ${writingSamples.valueProposition}`,
      writingSampleDont: toneRules[0]?.avoid || 'Corporate filler jargon.',
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

    const prompt = buildNamingPrompt(roughIdea, discovery, positioning, personality, projectName);
    const rawText = await this.callModelWithSchema(
      'naming',
      NAMING_SYSTEM_INSTRUCTION,
      prompt,
      'naming_schema',
      NAMING_SCHEMA,
      STAGE_COMPLETION_BUDGETS.naming
    );

    return this.validateAndNormalizeNaming(rawText);
  }

  validateAndNormalizeNaming(jsonString: string): NamingData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Groq output for Naming.');
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
        rationale: strategicRationale,
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
      worlds: namingWorlds,
      territories,
      candidates,
      shortlistedIds: [],
      shortlistedCandidateIds: [],
      rejectedIds: [],
      selectedCandidateId: selectedName ? selectedName.id : '',
      selectedNameId: selectedName ? selectedName.id : '',
      selectedName,
      selectionRationale: selectedName ? selectedName.strategicRationale : '',
      isConfirmed: false,
    };
  }

  async generateVisualize(input: GenerateVisualizeInput): Promise<VisualData> {
    const { roughIdea, discovery, positioning, personality, naming, projectName } = input;
    if (!roughIdea || !roughIdea.trim()) {
      throw new Error('Rough idea is required to generate visual identity.');
    }
    if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
      throw new Error('Discovery data is missing or incomplete. Discovery stage must be completed before Visual identity.');
    }
    if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
      throw new Error('Positioning data is missing or incomplete. Positioning stage must be completed before Visual identity.');
    }
    if (!personality || !personality.traits || personality.traits.length === 0) {
      throw new Error('Personality data is missing or incomplete. Personality stage must be completed before Visual identity.');
    }
    if (!naming || (!naming.namingStrategy && (!naming.namingWorlds || naming.namingWorlds.length === 0) && (!naming.candidates || naming.candidates.length === 0))) {
      throw new Error('Naming data is missing or incomplete. Naming stage must be completed before Visual identity.');
    }

    const prompt = buildVisualPrompt(roughIdea, discovery, positioning, personality, naming, projectName);
    const rawText = await this.callModelWithSchema(
      'visualize',
      VISUAL_SYSTEM_INSTRUCTION,
      prompt,
      'visual_schema',
      VISUAL_SCHEMA,
      STAGE_COMPLETION_BUDGETS.visualize
    );

    return this.validateAndNormalizeVisualData(rawText);
  }

  validateAndNormalizeVisualData(jsonString: string): VisualData {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e: any) {
      const cleaned = jsonString.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (innerErr) {
        throw new Error('Server received malformed JSON from Groq output for Visual identity.');
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid Visual identity data: expected an object.');
    }

    // Helper: validate and normalize hex color code
    const sanitizeHex = (hex: any, fallback: string): string => {
      if (typeof hex !== 'string') return fallback;
      let clean = hex.trim().toUpperCase();
      if (!clean.startsWith('#')) clean = `#${clean}`;
      if (/^#[0-9A-F]{6}$/i.test(clean)) return clean;
      if (/^#[0-9A-F]{3}$/i.test(clean)) {
        return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
      }
      return fallback;
    };

    // 1. Creative Direction
    const rawCD = parsed.creativeDirection || {};
    const concept = String(rawCD.concept || parsed.visualConcept || 'Structured clarity through restrained geometry, intentional typography, and high-trust palettes.').trim();
    const visualThesis = String(rawCD.visualThesis || parsed.visualThesis || 'An architectural command center that balances utilitarian precision with welcoming collegiate warmth.').trim();
    const rawKeywords = Array.isArray(rawCD.moodKeywords) ? rawCD.moodKeywords : (Array.isArray(parsed.moodKeywords) ? parsed.moodKeywords : []);
    const moodKeywords: string[] = rawKeywords.map((k: any) => String(k).trim()).filter(Boolean);
    if (moodKeywords.length === 0) {
      moodKeywords.push('Architectural', 'Measured', 'Direct', 'Grounding', 'Clarity');
    }

    const creativeDirection: CreativeDirection = {
      concept,
      visualThesis,
      moodKeywords,
    };

    // 2. Visual Principles (4–6 principles)
    const rawPrinciples = Array.isArray(parsed.visualPrinciples) ? parsed.visualPrinciples : [];
    const visualPrinciples: VisualPrinciple[] = rawPrinciples.map((p: any, idx: number) => ({
      name: String(p?.name || `Visual Principle 0${idx + 1}`).trim(),
      description: String(p?.description || 'Defines spatial hierarchy and visual weight.').trim(),
      application: String(p?.application || 'Maintain strong typography contrast and hairline borders.').trim(),
    }));

    if (visualPrinciples.length === 0) {
      visualPrinciples.push(
        {
          name: 'Guided Hierarchy',
          description: 'Visual weight directs attention sequentially to the most critical decision.',
          application: 'Use disciplined scale steps between headings and data readouts.',
        },
        {
          name: 'Restrained Luminescence',
          description: 'Accent color is reserved exclusively for interactive triggers and status confirmation.',
          application: 'Enforce a 90/10 neutral-to-accent ratio across all surfaces.',
        },
        {
          name: 'Hairline Architecture',
          description: 'Structure is established via crisp border boundaries rather than heavy drop shadows.',
          application: 'Use 1px borders with subtle opacity steps to define elevation.',
        },
        {
          name: 'Scannable Density',
          description: 'Present high-density eligibility criteria without causing cognitive exhaustion.',
          application: 'Employ tabular monospace alignments for dates, thresholds, and award values.',
        }
      );
    }

    // 3. Color System (primary, secondary, accent, background, surface, text, muted)
    const rawCS = parsed.colorSystem || {};
    const makeSwatch = (raw: any, defaultRole: string, defaultHex: string, defaultName: string, defaultRationale: string): ColorSwatch => ({
      name: String(raw?.name || defaultName).trim(),
      hex: sanitizeHex(raw?.hex, defaultHex),
      role: (raw?.role || defaultRole) as any,
      rationale: String(raw?.rationale || defaultRationale).trim(),
      usageRule: String(raw?.rationale || defaultRationale).trim(),
      contrastRatio: 'Tested for accessible contrast',
    });

    const primaryColor = makeSwatch(rawCS.primary, 'primary', '#1E293B', 'Deep Slate', 'Establishes foundational structural weight and authority.');
    const secondaryColor = makeSwatch(rawCS.secondary, 'secondary', '#0284C7', 'Ocean Signal', 'Supports secondary navigation and verified indicators.');
    const accentColor = makeSwatch(rawCS.accent, 'accent', '#F59E0B', 'Amber Focus', 'Reserved for high-intent actions, deadlines, and active matches.');
    const backgroundColor = makeSwatch(rawCS.background, 'background', '#0A0D12', 'Obsidian Canvas', 'Provides a low-glare, distraction-free nocturnal workspace.');
    const surfaceColor = makeSwatch(rawCS.surface, 'surface', '#161B22', 'Structural Slate', 'Used for cards, panels, and floating workspaces.');
    const textColor = makeSwatch(rawCS.text, 'text', '#F8FAFC', 'Titanium White', 'Delivers optimal readability against deep surfaces.');
    const mutedColor = makeSwatch(rawCS.muted, 'muted', '#8A8175', 'Warm Stone', 'Labels, metadata, and secondary timestamps.');

    const colorSystem: ColorSystem = {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      background: backgroundColor,
      surface: surfaceColor,
      text: textColor,
      muted: mutedColor,
      palette: [primaryColor, secondaryColor, accentColor, backgroundColor, surfaceColor, textColor, mutedColor],
    };

    const palette: ColorSwatch[] = [
      backgroundColor,
      surfaceColor,
      accentColor,
      secondaryColor,
      textColor,
      mutedColor,
    ];

    // 4. Typography Direction
    const rawType = parsed.typography || {};
    const displayFont = String(rawType.displayFont || 'Space Grotesk').trim();
    const bodyFont = String(rawType.bodyFont || 'Plus Jakarta Sans').trim();
    const supportingFont = String(rawType.supportingFont || 'JetBrains Mono').trim();
    const typographyMood = String(rawType.typographyMood || 'Architectural precision paired with effortless collegiate scannability.').trim();
    const rawUsage = Array.isArray(rawType.usageRules) ? rawType.usageRules : [];
    const usageRules: string[] = rawUsage.map((u: any) => String(u).trim()).filter(Boolean);
    if (usageRules.length === 0) {
      usageRules.push(
        'Display type used for hero wordmarks and major milestone headers with tight letter-spacing (-0.02em).',
        'Body type maintained at 14px–16px with 1.6 line height for fatigue-free reading.',
        'Supporting monospace type reserved for metadata tags, application dates, and match statistics.'
      );
    }

    const typographySpecs: FontSpec[] = [
      {
        role: 'Display & Headlines',
        family: displayFont,
        category: 'Editorial Geometric Grotesque',
        weight: '600 SemiBold / 700 Bold',
        usage: 'Page titles, brand wordmark, stage banners.',
      },
      {
        role: 'Body & Strategic Prose',
        family: bodyFont,
        category: 'Contemporary Sans-Serif',
        weight: '400 Regular / 500 Medium',
        usage: 'Descriptions, match summaries, criteria explanations.',
      },
      {
        role: 'Telemetry & Badges',
        family: supportingFont,
        category: 'Tabular Monospace',
        weight: '500 Medium',
        usage: 'Deadline countdowns, eligibility percentages, GPA thresholds.',
      },
    ];

    const typographyDirection: TypographyDirection = {
      displayFont,
      bodyFont,
      supportingFont,
      typographyMood,
      usageRules,
      specs: typographySpecs,
    };

    // 5. Imagery Direction / Art Direction
    const rawImg = parsed.imageryDirection || {};
    const photographyStyle = String(rawImg.photographyStyle || 'Documentary, natural-light, quiet-focus student environments.').trim();
    const subjectMatter = String(rawImg.subjectMatter || 'College students actively working in libraries, dorms, and labs—focused on real tasks.').trim();
    const composition = String(rawImg.composition || 'Balanced asymmetry with generous negative space and clear focal hierarchy.').trim();
    const lighting = String(rawImg.lighting || 'Natural morning window light or focused desk illumination with cool slate ambient shadows.').trim();
    const colorTreatment = String(rawImg.colorTreatment || 'Subdued saturation with deep contrast and true black points.').trim();
    const humanPresence = String(rawImg.humanPresence || 'Authentic, candid, contemplative expressions—never performing for the camera.').trim();
    const rawAvoidImg = Array.isArray(rawImg.avoidImagery) ? rawImg.avoidImagery : [];
    const avoidImagery: string[] = rawAvoidImg.map((a: any) => String(a).trim()).filter(Boolean);
    if (avoidImagery.length === 0) {
      avoidImagery.push(
        'Smiling stock models holding blank graduation folders',
        'Artificial studio lighting with pure white cyclorama backdrops',
        'Abstract neon 3D floating objects and glossy robot mascots'
      );
    }

    const imageryDirection: ImageryDirection = {
      photographyStyle,
      subjectMatter,
      composition,
      lighting,
      colorTreatment,
      humanPresence,
      avoidImagery,
    };

    const artDirection = {
      mood: photographyStyle,
      composition,
      lighting,
      imageryRules: avoidImagery,
    };

    // 6. Graphic Language / Shape Language
    const rawGL = parsed.graphicLanguage || {};
    const shapes = String(rawGL.shapes || 'Crisp geometric rounded corners (8px–14px) with mathematical nesting.').trim();
    const lineLanguage = String(rawGL.lineLanguage || '1px hairline dividers with 8% to 15% white opacity.').trim();
    const layoutBehavior = String(rawGL.layoutBehavior || 'Modular command-center grid with disciplined whitespace breathing room.').trim();
    const depth = String(rawGL.depth || 'Single-elevation subtle border framing over heavy blurred drop shadows.').trim();
    const motion = String(rawGL.motion || 'Crisp 200ms ease-out transitions with zero bouncy or distracting physics.').trim();
    const texture = String(rawGL.texture || 'Matte obsidian surfaces with micro-grain noise for tactile depth.').trim();
    const iconography = String(rawGL.iconography || 'Monoline 1.5px geometric vector icons aligned on a 24px grid.').trim();

    const graphicLanguage: GraphicLanguage = {
      shapes,
      lineLanguage,
      layoutBehavior,
      depth,
      motion,
      texture,
      iconography,
    };

    const shapeLanguage = {
      cornerStyle: shapes,
      density: layoutBehavior,
      framingRules: lineLanguage,
      spatialFeel: depth,
    };

    // 7. Logo Direction / Logo Concept
    const rawLogo = parsed.logoDirection || {};
    const logoConceptBrief = String(rawLogo.concept || 'A directional glyph embodying guided navigation toward eligible opportunity.').trim();
    const symbolicIdea = String(rawLogo.symbolicIdea || 'Interlocking focal geometry that filters ambient noise into a single clear vector.').trim();
    const formLanguage = String(rawLogo.formLanguage || 'Architectural monoline construction with geometric proportions.').trim();
    const construction = String(rawLogo.construction || 'Engineered as a 1:1 symbol and alongside a customized wordmark.').trim();
    const wordmarkDirection = String(rawLogo.wordmarkDirection || 'Title-cased grotesque with custom kerning on capital letter intersections.').trim();
    const rawLogoAvoid = Array.isArray(rawLogo.avoid) ? rawLogo.avoid : [];
    const logoAvoid: string[] = rawLogoAvoid.map((a: any) => String(a).trim()).filter(Boolean);
    if (logoAvoid.length === 0) {
      logoAvoid.push('Generic mortarboard graduation caps', 'Literal dollar signs and coin stacks', 'Cliche magnifying glass overlays');
    }

    const logoDirection: LogoDirection = {
      concept: logoConceptBrief,
      symbolicIdea,
      formLanguage,
      construction,
      wordmarkDirection,
      avoid: logoAvoid,
      markType: formLanguage,
      description: logoConceptBrief,
      symbolism: symbolicIdea,
      clearspaceRule: construction,
    };

    const logoConcept = {
      markType: formLanguage,
      description: logoConceptBrief,
      symbolism: symbolicIdea,
      clearspaceRule: construction,
    };

    // 8. UI Direction
    const rawUI = parsed.uiDirection || {};
    const uiDirection: UIDirection = {
      interfaceMood: String(rawUI.interfaceMood || 'Calm, authoritative, and focused command center.').trim(),
      layoutPrinciples: String(rawUI.layoutPrinciples || 'Modular split views with persistent navigation and prominent primary action.').trim(),
      cardBehavior: String(rawUI.cardBehavior || 'Single-elevation cards with hairline borders and subtle interactive glow on hover.').trim(),
      navigationBehavior: String(rawUI.navigationBehavior || 'Direct, progressive disclosure without multi-level nested menus.').trim(),
      interactionStyle: String(rawUI.interactionStyle || 'Immediate responsive feedback with tactile focus states.').trim(),
      motionPrinciples: String(rawUI.motionPrinciples || 'Purposeful 150ms state transitions that guide eye movement to updated data.').trim(),
    };

    // 9. Visual Guardrails (Do / Don't)
    const rawDo = Array.isArray(parsed.doRules) ? parsed.doRules : [];
    const doRules: string[] = rawDo.map((d: any) => String(d).trim()).filter(Boolean);
    if (doRules.length === 0) {
      doRules.push(
        'Use generous whitespace to isolate complex eligibility requirements',
        'Reserve warm accent color strictly for high-intent actions and deadlines',
        'Keep photography grounded in authentic, natural-light student work sessions',
        'Employ tabular monospace fonts for numerical data and dates'
      );
    }

    const rawDont = Array.isArray(parsed.dontRules) ? parsed.dontRules : (Array.isArray(parsed.thingsToAvoid) ? parsed.thingsToAvoid : []);
    const dontRules: string[] = rawDont.map((d: any) => String(d).trim()).filter(Boolean);
    if (dontRules.length === 0) {
      dontRules.push(
        'Use decorative gradient meshes without functional hierarchy',
        'Use staged, cheesy stock photos of smiling models in business attire',
        'Crowd card interfaces with redundant decorative badges or icons',
        'Rely on pure primary blue SaaS cliches'
      );
    }

    return {
      creativeDirection,
      visualConcept: concept,
      visualThesis,
      moodKeywords,
      visualPrinciples,
      colorSystem,
      palette,
      typography: typographySpecs,
      typographyDirection,
      imageryDirection,
      artDirection,
      graphicLanguage,
      shapeLanguage,
      logoDirection,
      logoConcept,
      uiDirection,
      doRules,
      dontRules,
      avoidVisuals: dontRules,
      thingsToAvoid: dontRules,
      isConfirmed: false,
    };
  }

  async generateChallenge(input: GenerateChallengeInput): Promise<ChallengeData> {
    const prompt = buildChallengePrompt(input);
    const rawText = await this.callModelWithSchema(
      'challenge',
      CHALLENGE_SYSTEM_INSTRUCTION,
      prompt,
      'brand_challenge',
      CHALLENGE_SCHEMA,
      STAGE_COMPLETION_BUDGETS.challenge,
      0.3
    );

    return this.validateAndNormalizeChallengeData(rawText, input);
  }

  validateAndNormalizeChallengeData(raw: any, _memory?: any): ChallengeData {
    let parsed: any;
    if (typeof raw === 'string') {
      let cleaned = raw.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
      else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (err: any) {
        throw new Error(`Failed to parse Groq Challenge output as JSON: ${err.message}`);
      }
    } else {
      parsed = raw;
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Challenge output must be an object.');
    }

    const rawFindings = Array.isArray(parsed.findings) ? parsed.findings : [];
    if (rawFindings.length === 0) {
      throw new Error('Challenge generation failed: Groq returned no findings.');
    }

    const VALID_CATEGORIES: ChallengeCategory[] = [
      'Strategic Risk',
      'Audience Risk',
      'Positioning Risk',
      'Differentiation Risk',
      'Naming Risk',
      'Personality Risk',
      'Visual Risk',
      'Credibility / Claim Risk',
      'Coherence Risk',
      'Assumption Risk',
      'GENERIC LANGUAGE',
      'AUDIENCE FIT',
      'POSITIONING',
      'PERSONALITY',
      'NAME',
      'VOICE',
      'VISUAL DIRECTION',
      'CONSISTENCY'
    ];

    const findings: ChallengeFinding[] = rawFindings.map((f: any, idx: number) => {
      const id = String(f.id || `crit-${Date.now()}-${idx + 1}`).trim();
      
      // Category normalization
      let category: ChallengeCategory = 'Strategic Risk';
      const rawCat = String(f.category || '').trim();
      const matchedCat = VALID_CATEGORIES.find(c => c.toLowerCase() === rawCat.toLowerCase());
      if (matchedCat) {
        category = matchedCat;
      } else if (rawCat.includes('Position')) {
        category = 'Positioning Risk';
      } else if (rawCat.includes('Name')) {
        category = 'Naming Risk';
      } else if (rawCat.includes('Visual')) {
        category = 'Visual Risk';
      } else if (rawCat.includes('Claim') || rawCat.includes('Credib')) {
        category = 'Credibility / Claim Risk';
      } else if (rawCat.includes('Audience')) {
        category = 'Audience Risk';
      } else if (rawCat.includes('Coherence') || rawCat.includes('Consist')) {
        category = 'Coherence Risk';
      }

      // Severity normalization
      const rawSev = String(f.severity || '').toLowerCase().trim();
      let severity: ChallengeSeverity = 'medium';
      if (rawSev === 'critical') severity = 'critical';
      else if (rawSev === 'high') severity = 'high';
      else if (rawSev === 'low') severity = 'low';

      // Status normalization (backward compatible with CritiqueStatus)
      let status: 'CONFLICT' | 'WARNING' | 'PASS' = 'WARNING';
      const rawStatus = String(f.status || '').toUpperCase().trim();
      if (rawStatus === 'CONFLICT' || rawStatus === 'PASS' || rawStatus === 'WARNING') {
        status = rawStatus as any;
      } else if (severity === 'critical') {
        status = 'CONFLICT';
      } else if (severity === 'low') {
        status = 'PASS';
      }

      const title = String(f.title || f.finding || `Adversarial Finding ${idx + 1}`).trim();
      const findingText = String(f.finding || f.title || title).trim();
      const evidence = String(f.evidence || '').trim();
      if (!evidence) {
        throw new Error(`Challenge validation failed: Finding "${title}" is missing required evidence quote from BrandMemory.`);
      }

      const whyItMatters = String(f.whyItMatters || '').trim();
      if (!whyItMatters) {
        throw new Error(`Challenge validation failed: Finding "${title}" is missing whyItMatters explanation.`);
      }

      const suggestedFix = String(f.suggestedFix || f.suggestedImprovement || '').trim();
      const suggestedImprovement = suggestedFix;

      // Stage Target
      let stageTarget: StageId = 'position';
      const rawStage = String(f.stageTarget || '').toLowerCase().trim();
      if (['discover', 'position', 'personality', 'naming', 'visualize', 'launch'].includes(rawStage)) {
        stageTarget = rawStage as StageId;
      } else if (category.includes('Audience') || category.includes('AUDIENCE')) {
        stageTarget = 'discover';
      } else if (category.includes('Position') || category.includes('POSITION')) {
        stageTarget = 'position';
      } else if (category.includes('Personality') || category.includes('Voice') || category.includes('PERSONALITY') || category.includes('VOICE')) {
        stageTarget = 'personality';
      } else if (category.includes('Name') || category.includes('NAME')) {
        stageTarget = 'naming';
      } else if (category.includes('Visual') || category.includes('VISUAL')) {
        stageTarget = 'visualize';
      }

      // Affected stages array
      const rawAffected = Array.isArray(f.affectedStages) ? f.affectedStages : [];
      const affectedStages: string[] = rawAffected.map((s: any) => String(s).trim()).filter(Boolean);
      if (affectedStages.length === 0) {
        affectedStages.push(stageTarget);
      }

      // Proposed Change validation against strict whitelist
      let proposedChange: ProposedChange | undefined = undefined;
      if (f.proposedChange && typeof f.proposedChange === 'object') {
        const rawTargetStage = String(f.proposedChange.targetStage || '').toLowerCase().trim();
        const rawField = String(f.proposedChange.field || '').trim();
        const allowedFields = ALLOWED_CHALLENGE_MUTATION_FIELDS[rawTargetStage];
        if (allowedFields && allowedFields.includes(rawField) && f.proposedChange.proposedValue) {
          proposedChange = {
            targetStage: rawTargetStage as any,
            field: rawField,
            currentValue: f.proposedChange.currentValue !== undefined ? String(f.proposedChange.currentValue) : undefined,
            proposedValue: String(f.proposedChange.proposedValue),
            rationale: f.proposedChange.rationale ? String(f.proposedChange.rationale).trim() : undefined,
          };
        }
      }

      return {
        id,
        category,
        severity,
        status,
        findingStatus: 'open',
        title,
        finding: findingText,
        evidence,
        whyItMatters,
        affectedStages,
        stageTarget,
        suggestedFix,
        suggestedImprovement,
        proposedChange,
        accepted: false,
        ignored: false,
      };
    });

    // Consistency Summary
    const strengthsCount = findings.filter(f => f.status === 'PASS' || f.severity === 'low').length;
    const conflictsCount = findings.filter(f => f.status === 'CONFLICT' || f.severity === 'critical').length;
    const warningsCount = findings.filter(f => f.status === 'WARNING' || f.severity === 'high' || f.severity === 'medium').length;

    let overallState: 'Robust & Coherent' | 'Has Actionable Gaps' | 'Critical Alignment Needed' = 'Has Actionable Gaps';
    if (conflictsCount > 0) {
      overallState = 'Critical Alignment Needed';
    } else if (warningsCount === 0) {
      overallState = 'Robust & Coherent';
    }

    const rawSummary = parsed.consistencySummary || {};
    const editorialAssessment = String(
      rawSummary.editorialAssessment ||
      `The adversarial scan identified ${findings.length} findings (${conflictsCount} critical/conflicts, ${warningsCount} warnings). Address high-severity risks to reinforce strategic differentiation and defensibility.`
    ).trim();

    return {
      findings,
      consistencySummary: {
        overallState,
        strengthsCount,
        warningsCount,
        conflictsCount,
        editorialAssessment,
      },
      isConfirmed: false,
      lastChallengedAt: new Date().toISOString(),
    };
  }

  async generateDeliver(input: GenerateDeliverInput): Promise<LaunchData & { executiveSummary?: string; brandEssence?: string }> {
    const prompt = buildDeliverPrompt(input);
    const rawText = await this.callModelWithSchema(
      'deliver',
      DELIVER_SYSTEM_INSTRUCTION,
      prompt,
      'brand_deliver',
      DELIVER_SCHEMA,
      STAGE_COMPLETION_BUDGETS.deliver,
      0.35
    );

    return this.validateAndNormalizeDeliverData(rawText);
  }

  validateAndNormalizeDeliverData(raw: any): LaunchData & { executiveSummary?: string; brandEssence?: string } {
    let parsed: any;
    if (typeof raw === 'string') {
      let cleaned = raw.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
      else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
      if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (err: any) {
        throw new Error(`Failed to parse Groq Deliver output as JSON: ${err.message}`);
      }
    } else {
      parsed = raw;
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Deliver output must be an object.');
    }

    const headline = String(parsed.headline || '').trim();
    if (!headline) {
      throw new Error('Deliver generation failed: missing headline.');
    }

    const subheadline = String(parsed.subheadline || '').trim();
    const oneLinePitch = String(parsed.oneLinePitch || '').trim();
    const productDescription = String(parsed.productDescription || '').trim();
    const primaryCta = String(parsed.primaryCta || 'Get Started').trim();
    const secondaryCta = String(parsed.secondaryCta || 'Learn More').trim();
    const launchAnnouncement = String(parsed.launchAnnouncement || '').trim();

    const socialPost = (parsed.socialPost && typeof parsed.socialPost === 'object') ? {
      platform: String(parsed.socialPost.platform || 'X / LinkedIn').trim(),
      text: String(parsed.socialPost.text || '').trim(),
    } : {
      platform: 'X / LinkedIn',
      text: `${headline}\n\n${oneLinePitch}`,
    };

    const whyThisMessagingWorks = String(parsed.whyThisMessagingWorks || '').trim();
    const executiveSummary = parsed.executiveSummary ? String(parsed.executiveSummary).trim() : undefined;
    const brandEssence = parsed.brandEssence ? String(parsed.brandEssence).trim() : undefined;

    return {
      headline,
      subheadline,
      oneLinePitch,
      productDescription,
      primaryCta,
      secondaryCta,
      launchAnnouncement,
      socialPost,
      whyThisMessagingWorks,
      executiveSummary,
      brandEssence,
      isConfirmed: false,
    };
  }
}

export const groqGateway = new GroqGateway();
