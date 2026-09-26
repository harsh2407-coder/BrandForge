import { DEMO_BRAND } from '../data/demoBrand.js';
import type { 
  DiscoveryData, 
  PositioningData, 
  PersonalityData, 
  NamingData, 
  VisualData, 
  ChallengeData 
} from '../types/brand.js';

export const SHOWCASE_PROMPT =
  'I want to build an app that helps college students find teammates for hackathons.';

/**
 * Normalized exact matching:
 * - trim whitespace
 * - normalize repeated whitespace
 * - compare case-insensitively
 * Does NOT use fuzzy matching.
 */
export function isShowcasePrompt(prompt: string | undefined | null): boolean {
  if (!prompt || typeof prompt !== 'string') return false;
  const normalizedInput = prompt.trim().replace(/\s+/g, ' ').toLowerCase();
  const normalizedTarget = SHOWCASE_PROMPT.trim().replace(/\s+/g, ' ').toLowerCase();
  return normalizedInput === normalizedTarget;
}

export const SHOWCASE_DELAYS = {
  discover: 1200,
  position: 1000,
  personality: 1000,
  naming: 1200,
  visualize: 1200,
  challenge: 1400,
  reChallenge: 1200,
  deliver: 800,
} as const;

export function getShowcaseDiscovery(): DiscoveryData {
  return JSON.parse(JSON.stringify(DEMO_BRAND.discovery));
}

export function getShowcasePositioning(initialPreChallenge = true): PositioningData {
  const positioning = JSON.parse(JSON.stringify(DEMO_BRAND.positioning)) as PositioningData;
  if (initialPreChallenge) {
    // Initial pre-challenge draft has the unrefined statement that triggers crit-1 in Challenge
    positioning.positioningStatement = 'SprintForge is an AI-powered teammate platform for everyone.';
  }
  return positioning;
}

export function getShowcasePersonality(): PersonalityData {
  const personality = JSON.parse(JSON.stringify(DEMO_BRAND.personality)) as PersonalityData;
  if (!personality.voiceSummary && personality.voice?.summary) {
    personality.voiceSummary = personality.voice.summary;
  }
  return personality;
}

export function getShowcaseNaming(): NamingData {
  return JSON.parse(JSON.stringify(DEMO_BRAND.naming));
}

export function getShowcaseVisual(): VisualData {
  const visual = JSON.parse(JSON.stringify(DEMO_BRAND.visual)) as VisualData;
  if (!visual.palette && visual.colorSystem) {
    const swatches = [
      visual.colorSystem.primary,
      visual.colorSystem.secondary,
      visual.colorSystem.accent,
      visual.colorSystem.background,
      visual.colorSystem.surface,
      visual.colorSystem.text,
      visual.colorSystem.muted,
    ];
    visual.palette = swatches.filter((s): s is NonNullable<typeof s> => Boolean(s));
  }
  return visual;
}

export function getShowcaseInitialChallenge(): ChallengeData {
  const baseChallenge = JSON.parse(JSON.stringify(DEMO_BRAND.challenge)) as ChallengeData;
  return {
    ...baseChallenge,
    consistencySummary: {
      overallState: 'Has Actionable Gaps',
      strengthsCount: 2,
      warningsCount: 3,
      conflictsCount: 1,
      editorialAssessment:
        'Strong core builder ethos, but initial positioning statement leans on generic AI tropes and audience definition underrepresents designers.',
    },
    // Reset findings to open/unaccepted state so human-in-the-loop interaction works in demo
    findings: baseChallenge.findings.map(f => ({
      ...f,
      accepted: false,
      ignored: false,
      findingStatus: 'open' as const,
    })),
    isConfirmed: false,
  };
}

export function getShowcaseReChallenge(currentChallenge: ChallengeData): ChallengeData {
  const acceptedCount = currentChallenge.findings.filter(f => f.accepted).length;

  return {
    ...currentChallenge,
    consistencySummary: {
      overallState: 'Robust & Coherent',
      strengthsCount: Math.max(3, 2 + acceptedCount),
      warningsCount: 1,
      conflictsCount: 0,
      editorialAssessment:
        acceptedCount > 0
          ? 'Strategic alignment confirmed. Accepted positioning wedge cleanly articulates the 36-hour podium outcome and multidisciplinary roster balance.'
          : DEMO_BRAND.challenge.consistencySummary.editorialAssessment,
    },
    isConfirmed: true,
    lastChallengedAt: new Date().toISOString(),
  };
}
