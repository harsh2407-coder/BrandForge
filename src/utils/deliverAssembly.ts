import type {
  BrandMemory,
  DeliverData,
  StrategicFoundation,
  DeliverPersonality,
  DeliverNaming,
  DeliverVisualIdentity,
  DeliverMessaging,
  DeliverChallengeSummary,
  ChallengeTraceabilityItem,
  LaunchChecklistItem
} from '../types/brand';

/**
 * assembleDeliverData
 *
 * Deterministically compiles the accumulated BrandMemory into a unified DeliverData artifact.
 * Source of truth is BrandMemory directly:
 * - Reflects human-approved Challenge mutations (e.g. valueProposition, positioningStatement)
 * - Resolves the current active brand name
 * - Preserves visual tokens (palette, typography, art direction)
 * - Summarizes Challenge findings & traceability (Before -> Decision -> After)
 * - Generates grounded executive summary and essence
 * - Completely offline-compatible; zero external network or model dependencies
 */
export function assembleDeliverData(brandMemory: BrandMemory): DeliverData {
  const { discovery, positioning, personality, naming, visual, challenge, launch } = brandMemory;

  // 1. Resolve Brand Name
  let brandName = 'Name not finalized';
  let selectedCandidate = naming?.selectedName;

  if (!selectedCandidate && naming?.candidates && (naming.selectedNameId || (naming as any).selectedCandidateId)) {
    const targetId = naming.selectedNameId || (naming as any).selectedCandidateId;
    selectedCandidate = naming.candidates.find(c => c.id === targetId) || null;
  }

  if (selectedCandidate?.name) {
    brandName = selectedCandidate.name;
  } else if (brandMemory.projectName && brandMemory.projectName !== 'My New Brand' && brandMemory.projectName.trim()) {
    brandName = brandMemory.projectName;
  }

  // 2. Strategic Foundation (Source of truth: Discovery + current Positioning with Challenge fixes)
  const strategicFoundation: StrategicFoundation = {
    problem: discovery?.coreProblem || 'Core problem under strategic definition.',
    audience: discovery?.primaryAudience || 'Primary audience under definition.',
    need: discovery?.coreNeed || 'Core strategic need under definition.',
    positioning: positioning?.positioningStatement || '',
    valueProposition: positioning?.valueProposition || '',
    differentiation: positioning?.primaryDifferentiation || positioning?.differentiator || '',
    keyPillars: positioning?.keyPillars || [],
  };

  // 3. Brand Essence
  const conceptSnippet = visual?.creativeDirection?.concept || visual?.visualConcept || '';
  const essenceAudience = discovery?.primaryAudience || 'the target audience';
  const essenceValProp = positioning?.valueProposition || 'delivering clear strategic value';
  
  const brandEssence = positioning?.valueProposition && conceptSnippet
    ? `${brandName} unites ${essenceValProp} with an aesthetic direction of "${conceptSnippet}", engineered specifically for ${essenceAudience}.`
    : (positioning?.positioningStatement || positioning?.valueProposition || `${brandName} is built to address ${discovery?.coreProblem || 'emerging industry challenges'}.`);

  // 4. Executive Summary (Concise strategic synthesis answering the 6 core questions)
  const executiveSummary = [
    `Brand: ${brandName} operates in the category of ${positioning?.category || 'specialized digital products'}.`,
    `Audience: Engineered explicitly for ${discovery?.primaryAudience || 'discerning users'}.`,
    `Problem Addressed: Solves ${discovery?.coreProblem || 'latent workflow friction'}.`,
    `Promise: Delivers ${positioning?.valueProposition || 'uncompromising clarity and utility'}.`,
    `Why Audience Cares: Directly fulfills the unmet need for ${discovery?.coreNeed || 'streamlined execution'}, replacing inadequate alternatives.`,
    `Distinctive Edge: Defends its position through ${strategicFoundation.differentiation || 'disciplined strategic focus'}.`
  ].join(' ');

  // 5. Personality & Voice Heuristics
  const deliverPersonality: DeliverPersonality = {
    traits: personality?.traits || [],
    avoidTraits: personality?.traitsToAvoid || personality?.avoidTraits || [],
    principles: personality?.principles || [],
    voiceSummary: personality?.voiceSummary || personality?.voice?.summary || personality?.voiceAndTone?.summary || 'Direct, purposeful, and grounded.',
    voiceCharacteristics: personality?.voice?.characteristics || personality?.voiceAndTone?.characteristics || [],
    toneRules: personality?.voice?.toneRules || personality?.voiceAndTone?.toneRules || [],
    writingSamples: personality?.writingSamples || personality?.voiceAndTone?.writingSamples,
  };

  // 6. Naming Architecture
  const deliverNaming: DeliverNaming = {
    selectedName: brandName,
    meaning: selectedCandidate?.meaning || (selectedCandidate as any)?.etymology,
    rationale: selectedCandidate?.strategicRationale || naming?.selectionRationale || 'Selected for high strategic fit and category clarity.',
    namingWorld: (selectedCandidate as any)?.territory || (selectedCandidate as any)?.namingWorld || (selectedCandidate as any)?.world || naming?.namingWorlds?.find(w => w.id === (selectedCandidate as any)?.worldId)?.name || '',
    isVerified: false, // Honest grounding: no simulated legal clearance claimed
  };

  // 7. Visual Identity System
  const deliverVisualIdentity: DeliverVisualIdentity = {
    creativeDirection: visual?.creativeDirection?.concept || visual?.visualConcept || 'Disciplined Spatial Modernism',
    visualThesis: visual?.creativeDirection?.visualThesis || visual?.visualThesis || 'A balanced, high-contrast system engineered for clarity across digital touchpoints.',
    moodKeywords: visual?.creativeDirection?.moodKeywords || visual?.moodKeywords || ['Focused', 'Structured', 'Clarity'],
    visualPrinciples: visual?.visualPrinciples || [],
    colors: visual?.palette || visual?.colorSystem?.palette || [],
    typography: visual?.typography || [],
    imagery: visual?.imageryDirection || visual?.artDirection || {
      mood: 'Focused and restrained',
      composition: 'Asymmetric with intentional negative space',
      lighting: 'Calibrated ambient lighting',
      imageryRules: ['Avoid generic stock photography', 'Prioritize proof-of-work documentation']
    },
    graphicLanguage: visual?.graphicLanguage || visual?.shapeLanguage || {
      cornerStyle: 'Refined 16px to 24px curvature',
      density: 'Airy, legible spacing with tactile borders',
      framingRules: 'Subtle high-contrast bounding strokes',
      spatialFeel: 'Restrained glassmorphism on obsidian canvases'
    },
    logoDirection: visual?.logoDirection || visual?.logoConcept || {
      markType: 'Geometric Monogram / Wordmark',
      description: 'A disciplined, mnemonic mark communicating precision.',
      symbolism: 'Structured vector geometry reflecting foundational strength.',
      clearspaceRule: 'Maintain 1.5x mark height clearance on all axes.'
    },
    uiDirection: visual?.uiDirection,
    doRules: visual?.doRules || [],
    dontRules: visual?.dontRules || visual?.thingsToAvoid || visual?.avoidVisuals || [],
  };

  // 8. Launch Messaging System
  const deliverMessaging: DeliverMessaging = {
    headline: launch?.headline || (positioning?.valueProposition ? `The new standard in ${positioning.category || 'brand intelligence'}.` : 'Stop building alone.'),
    subheadline: launch?.subheadline || positioning?.valueProposition || '',
    oneLinePitch: launch?.oneLinePitch || positioning?.valueProposition || '',
    productDescription: launch?.productDescription || discovery?.coreProblem || '',
    primaryCta: launch?.primaryCta || 'Get Started',
    secondaryCta: launch?.secondaryCta || 'Learn More',
    keyMessages: [
      strategicFoundation.valueProposition || 'Engineered for measurable impact.',
      strategicFoundation.differentiation ? `Differentiated by: ${strategicFoundation.differentiation}` : 'Built with operational precision.',
      `Targeted for: ${strategicFoundation.audience}`
    ].filter(Boolean),
    toneExamples: {
      do: personality?.voiceAndTone?.writingSampleDo || personality?.voice?.toneRules?.[0]?.do || 'Direct, active, and supportive.',
      avoid: personality?.voiceAndTone?.writingSampleDont || personality?.voice?.toneRules?.[0]?.avoid || 'Corporate jargon, inflated superlatives, or passive voice.'
    },
    launchAnnouncement: launch?.launchAnnouncement || '',
    socialPost: launch?.socialPost || {
      platform: 'X / LinkedIn',
      text: `${brandName}: ${launch?.oneLinePitch || positioning?.valueProposition}\n\nBuilt for ${discovery?.primaryAudience}.`
    }
  };

  // 9. Challenge Summary & Traceability (Before -> Decision -> After)
  const findings = challenge?.findings || [];
  const resolvedCount = findings.filter(f => f.accepted || f.findingStatus === 'accepted' || f.findingStatus === 'resolved').length;
  const ignoredCount = findings.filter(f => f.ignored || f.findingStatus === 'ignored').length;
  const openCount = findings.filter(f => !f.accepted && !f.ignored && f.findingStatus !== 'accepted' && f.findingStatus !== 'ignored' && f.findingStatus !== 'resolved').length;
  
  const keyRisks = findings
    .filter(f => f.severity === 'critical' || f.severity === 'high' || f.status === 'CONFLICT')
    .map(f => ({
      id: f.id,
      category: f.category,
      severity: f.severity || 'high',
      title: f.title || f.category,
      finding: f.finding,
      status: f.accepted ? 'Resolved' : f.ignored ? 'Ignored' : 'Open'
    }));

  const traceability: ChallengeTraceabilityItem[] = findings
    .filter(f => f.accepted || f.findingStatus === 'accepted')
    .map(f => {
      const targetStage = f.proposedChange?.targetStage || (f as any).stageTarget || 'positioning';
      const field = f.proposedChange?.field || 'strategic statement';
      const beforeValue = f.proposedChange?.currentValue || f.evidence || 'Pre-critique unrefined formulation';
      const decision = `Human accepted critique: ${f.suggestedFix || f.suggestedImprovement || 'Approved targeted strategic revision'}`;
      
      // Determine after value based on approved proposedValue, falling back to current stage value
      let afterValue = f.proposedChange?.proposedValue || '';
      if (!afterValue) {
        if (targetStage === 'positioning' && field === 'valueProposition') {
          afterValue = positioning?.valueProposition || '';
        } else if (targetStage === 'positioning' && field === 'positioningStatement') {
          afterValue = positioning?.positioningStatement || '';
        } else if (targetStage === 'discovery' && field === 'primaryAudience') {
          afterValue = discovery?.primaryAudience || '';
        } else if (targetStage === 'discovery' && field === 'coreProblem') {
          afterValue = discovery?.coreProblem || '';
        } else if (targetStage === 'personality' && field === 'voiceSummary') {
          afterValue = personality?.voiceSummary || '';
        } else if (targetStage === 'visualize' && field === 'visualConcept') {
          afterValue = visual?.visualConcept || '';
        }
      }

      return {
        id: f.id,
        category: f.category,
        title: f.title || f.category,
        finding: f.finding,
        targetStage,
        field,
        beforeValue: String(beforeValue),
        decision,
        afterValue: String(afterValue || f.proposedChange?.proposedValue || 'Updated in brand memory'),
        rationale: f.proposedChange?.rationale || f.whyItMatters,
      };
    });

  const deliverChallengeSummary: DeliverChallengeSummary = {
    findingsCount: findings.length,
    resolvedCount,
    ignoredCount,
    openCount,
    keyRisks,
    traceability,
    consistencyState: challenge?.consistencySummary?.overallState || 'Has Actionable Gaps',
    editorialAssessment: challenge?.consistencySummary?.editorialAssessment || 'Adversarial scan completed across strategic stages.'
  };

  // 10. Pragmatic Launch Checklist
  const launchChecklist: LaunchChecklistItem[] = [
    {
      id: 'chk-1',
      category: 'Brand',
      label: 'Core problem and audience hypothesis validated',
      description: `Targeting: ${discovery?.primaryAudience || 'Primary audience'}`,
      isCompleted: Boolean(discovery?.coreProblem && discovery?.primaryAudience),
    },
    {
      id: 'chk-2',
      category: 'Brand',
      label: 'Strategic positioning & value proposition locked',
      description: strategicFoundation.valueProposition ? `Value Prop: "${strategicFoundation.valueProposition.slice(0, 60)}..."` : 'Awaiting positioning formulation',
      isCompleted: Boolean(positioning?.valueProposition && positioning?.positioningStatement),
    },
    {
      id: 'chk-3',
      category: 'Messaging',
      label: 'Brand personality & tone heuristics codified',
      description: deliverPersonality.traits.length > 0 ? `${deliverPersonality.traits.length} distinct traits defined` : 'Awaiting personality stage',
      isCompleted: deliverPersonality.traits.length > 0,
    },
    {
      id: 'chk-4',
      category: 'Brand',
      label: 'Strategic brand name finalized',
      description: `Active mark: ${brandName}`,
      isCompleted: brandName !== 'Name not finalized',
    },
    {
      id: 'chk-5',
      category: 'Visual',
      label: '7-role color system & typography spec established',
      description: deliverVisualIdentity.colors.length > 0 ? `${deliverVisualIdentity.colors.length} palette tokens configured` : 'Awaiting visual system',
      isCompleted: deliverVisualIdentity.colors.length >= 3,
    },
    {
      id: 'chk-6',
      category: 'Validation',
      label: 'Adversarial critique completed and corrections applied',
      description: `${deliverChallengeSummary.resolvedCount} corrections resolved, ${deliverChallengeSummary.openCount} open considerations`,
      isCompleted: deliverChallengeSummary.findingsCount > 0,
    },
    {
      id: 'chk-7',
      category: 'Validation',
      label: 'Conduct 10 qualitative customer discovery interviews',
      description: 'Verify audience willingness to engage without assuming proprietary data feeds.',
      isCompleted: false, // Realistic open founder action item
    },
    {
      id: 'chk-8',
      category: 'Product',
      label: 'Audit operational capabilities against messaging claims',
      description: 'Confirm no launch copy promises automated verification before the data pipeline is live.',
      isCompleted: false, // Realistic open founder action item
    },
    {
      id: 'chk-9',
      category: 'Validation',
      label: 'Perform legal trademark clearance search',
      description: `Clear "${brandName}" with relevant trademark registries (USPTO / WIPO).`,
      isCompleted: false, // Realistic open founder action item
    },
    {
      id: 'chk-10',
      category: 'Launch',
      label: 'Deploy landing page with conversion copy & analytics',
      description: `Deploy hero headline: "${deliverMessaging.headline.slice(0, 50)}..."`,
      isCompleted: Boolean(launch?.headline),
    },
  ];

  return {
    brandName,
    oneLinePitch: deliverMessaging.oneLinePitch,
    headline: deliverMessaging.headline,
    subheadline: deliverMessaging.subheadline,
    executiveSummary,
    brandEssence,
    strategicFoundation,
    personality: deliverPersonality,
    naming: deliverNaming,
    visualIdentity: deliverVisualIdentity,
    messaging: deliverMessaging,
    challengeSummary: deliverChallengeSummary,
    launchChecklist,
  };
}
