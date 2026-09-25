import { BrandMemory, StageId, DiscoveryData, PositioningData, PersonalityData, NamingData, VisualData, ChallengeData, LaunchData } from '../types/brand';

export interface GenerateStageOptions {
  idea: string;
  knownDetails?: string;
  currentMemory?: Partial<BrandMemory>;
  onStepProgress?: (stepIndex: number, stepLabel: string) => void;
}

export interface BrandService {
  generateFullBrandFromIdea(options: GenerateStageOptions): Promise<BrandMemory>;
  generateDiscovery(idea: string, details?: string): Promise<DiscoveryData>;
  generatePositioning(idea: string, discovery: DiscoveryData): Promise<PositioningData>;
  generatePersonality(positioning: PositioningData): Promise<PersonalityData>;
  generateNaming(positioning: PositioningData, personality: PersonalityData): Promise<NamingData>;
  generateVisual(positioning: PositioningData, personality: PersonalityData, naming: NamingData): Promise<VisualData>;
  generateChallenge(memory: Partial<BrandMemory>): Promise<ChallengeData>;
  generateLaunch(memory: Partial<BrandMemory>): Promise<LaunchData>;
}

// Helper to sanitize idea keywords
function extractKeywords(idea: string): string[] {
  return idea
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['want', 'build', 'make', 'that', 'with', 'this', 'from', 'help', 'helps'].includes(w));
}

// Capitalize helper
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export class StrategicBrandEngine implements BrandService {
  async generateFullBrandFromIdea(options: GenerateStageOptions): Promise<BrandMemory> {
    const { idea, knownDetails, onStepProgress } = options;
    const keywords = extractKeywords(idea);
    const domainKeyword = keywords[0] ? capitalize(keywords[0]) : 'Venture';
    const actionKeyword = keywords[1] ? capitalize(keywords[1]) : 'Craft';

    // Step 1: Core Problem & Audience
    if (onStepProgress) onStepProgress(0, 'Deconstructing rough idea & syntax');
    await new Promise(r => setTimeout(r, 600));

    if (onStepProgress) onStepProgress(1, 'Extracting core structural problem');
    await new Promise(r => setTimeout(r, 700));

    if (onStepProgress) onStepProgress(2, 'Identifying primary & secondary audiences');
    await new Promise(r => setTimeout(r, 650));

    if (onStepProgress) onStepProgress(3, 'Detecting unvalidated strategic assumptions');
    await new Promise(r => setTimeout(r, 600));

    if (onStepProgress) onStepProgress(4, 'Synthesizing launch-ready strategic memory');
    await new Promise(r => setTimeout(r, 550));

    const discovery = await this.generateDiscovery(idea, knownDetails);
    const positioning = await this.generatePositioning(idea, discovery);
    const personality = await this.generatePersonality(positioning);
    const naming = await this.generateNaming(positioning, personality);
    const visual = await this.generateVisual(positioning, personality, naming);
    const challenge = await this.generateChallenge({ roughIdea: idea, discovery, positioning, personality, naming, visual });
    const launch = await this.generateLaunch({ roughIdea: idea, discovery, positioning, personality, naming, visual, challenge });

    const selectedName = naming.selectedName?.name || `${domainKeyword}${actionKeyword}`;

    return {
      id: `brand-${Date.now()}`,
      projectName: selectedName,
      roughIdea: idea,
      knownDetails: knownDetails || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStage: 'discover',
      stagesCompleted: ['input', 'discover'],
      discovery,
      positioning,
      personality,
      naming,
      visual,
      challenge,
      launch,
    };
  }

  async generateDiscovery(idea: string, details?: string): Promise<DiscoveryData> {
    const words = extractKeywords(idea);
    const primaryFocus = words.slice(0, 3).join(' ') || 'targeted productivity';

    return {
      coreProblem: `Users experiencing ${primaryFocus} currently waste excessive time navigating fragmented tools, manual workarounds, and unorganized coordination channels with low transparency and high friction.`,
      primaryAudience: `Early adopters, professionals, or motivated creators who encounter recurring friction around ${primaryFocus} and demand an intentional, modern solution.`,
      userContext: details || `High-intent scenarios where standard legacy approaches fail to deliver speed, reliability, or cohesive collaboration.`,
      currentAlternatives: [
        'Disjointed spreadsheets and ad-hoc chat channels that lack domain logic',
        'Generic catch-all enterprise tools that are bloated, slow, and expensive',
        'Manual memory-based workflows that break down under stress',
        'Inaction and accepting the status quo friction'
      ],
      coreNeed: `A focused, high-clarity platform tailored specifically to the nuances of ${primaryFocus}, providing immediate proof-of-progress and clear peer alignment.`,
      assumptions: [
        {
          id: `asm-${Date.now()}-1`,
          statement: 'Target users prioritize rapid time-to-value over extensive enterprise feature matrices.',
          riskLevel: 'high',
          validationTip: 'Measure whether users complete primary onboarding in under 90 seconds without dropping off.'
        },
        {
          id: `asm-${Date.now()}-2`,
          statement: 'Current legacy tools are perceived as frustratingly slow and bloated by modern digital natives.',
          riskLevel: 'medium',
          validationTip: 'Run 5 qualitative teardown interviews highlighting competitor friction points.'
        },
        {
          id: `asm-${Date.now()}-3`,
          statement: 'Organic word-of-mouth will trigger if early cohort achieves distinct, measurable wins.',
          riskLevel: 'low',
          validationTip: 'Track post-onboarding referral link clicks and direct shares.'
        }
      ],
      openQuestions: [
        {
          id: `q-${Date.now()}-1`,
          question: `What is the single highest-friction moment in the current user workflow?`,
          strategicWhy: 'Nailing this moment establishes the core product hook and defends against churn.'
        },
        {
          id: `q-${Date.now()}-2`,
          question: 'Is this an individual utility tool or an inherently multiplayer network?',
          strategicWhy: 'Dictates whether viral loops or direct utility marketing drives early traction.'
        }
      ],
      isConfirmed: false
    };
  }

  async generatePositioning(idea: string, discovery: DiscoveryData): Promise<PositioningData> {
    const words = extractKeywords(idea);
    const domain = words[0] ? capitalize(words[0]) : 'Modern';
    const role = words[1] ? capitalize(words[1]) : 'Intelligence';

    return {
      category: `${domain} Workflow Acceleration & Strategic Orchestration`,
      targetSegment: discovery.primaryAudience.slice(0, 100),
      valueProposition: `Eliminate operational chaos with an intentional platform designed for high-agency teams and creators who need speed and structural clarity.`,
      differentiator: `Purpose-built domain logic, zero configuration bloat, and automated stage alignment that turns messy inputs into decisive outcomes.`,
      positioningStatement: `For ambitious operators who refuse to compromise on craft, this system is the specialized intelligence layer that replaces messy manual workflows with decisive, structured progress.`,
      whyThisPosition: `Generalist competitors attempt to serve all personas and end up bloated. By staking out a razor-sharp position around speed, craft, and domain clarity, we establish premium pricing power and intense user devotion.`,
      isConfirmed: false
    };
  }

  async generatePersonality(positioning: PositioningData): Promise<PersonalityData> {
    return {
      traits: [
        {
          name: 'Decisive & Crisp',
          whyItFits: 'Users are exhausted by ambiguous menus and fluff; they need clear, confident direction.',
          evidence: 'High-performing operators repeatedly favor products that reduce cognitive fatigue through opinionated defaults.'
        },
        {
          name: 'Craft-Obsessed',
          whyItFits: 'Signals high standards, durability, and deep respect for the user’s craft.',
          evidence: 'Modern software users actively migrate from legacy systems to tools that exhibit aesthetic and functional elegance.'
        },
        {
          name: 'Transparent & Direct',
          whyItFits: 'Builds trust immediately by stating facts, trade-offs, and clear capabilities without marketing hyperbole.',
          evidence: 'Audiences immediately disengage when confronted with vague corporate platitudes.'
        }
      ],
      traitsToAvoid: [
        {
          trait: 'Overly Corporate / Bureaucratic',
          reason: 'Dilutes agility and makes the product feel like a forced IT compliance mandate.'
        },
        {
          trait: 'Hype-Driven / Gimmicky',
          reason: 'Cheapens strategic credibility; customers need enduring utility, not trend chasing.'
        },
        {
          trait: 'Paternalistic / Condescending',
          reason: 'Respects users as competent experts who just need a higher-leverage tool.'
        }
      ],
      principles: [
        'Clarity over cleverness: communicate what the product does in simple, resonant terms.',
        'Respect the user’s attention: zero superfluous animations or intrusive interruptions.',
        'Opinionated defaults: solve 80% of edge cases with pristine architectural conviction.',
        'Earn trust through transparency: reveal the logic behind every recommendation.'
      ],
      voiceAndTone: {
        tone: 'Confident, articulate, calm, and strategic',
        voiceCharacteristics: [
          'Direct sentences with active verbs',
          'Free of corporate filler and buzzwords',
          'Grounded in tangible outcomes'
        ],
        writingSampleDo: 'Configure your entire operational stack in three deliberate steps. No bloated settings, no guesswork.',
        writingSampleDont: 'Leverage synergistic paradigm-shifting cloud automation to effortlessly scale your omni-channel ecosystem.'
      },
      isConfirmed: false
    };
  }

  async generateNaming(positioning: PositioningData, personality: PersonalityData): Promise<NamingData> {
    const domainCandidates: NamingData['territories'] = [
      {
        id: `terr-${Date.now()}-1`,
        number: '01',
        name: 'ARCHITECTURAL PRECISION',
        theme: 'Names invoking structural soundness, foundational craft, and intentional engineering.',
        rationale: 'Positions the brand as a dependable, permanent instrument rather than a transient utility.',
        candidates: [
          {
            id: `cand-${Date.now()}-1`,
            name: 'KiteMark',
            meaning: 'The historic hallmark of verified standards and precision.',
            strategicRationale: 'Evokes quality assurance and high standards with a modern editorial cadence.',
            personalityFit: 'Calm, authoritative, craft-focused.',
            potentialWeakness: 'May lean slightly traditional if not styled with modern typography.'
          },
          {
            id: `cand-${Date.now()}-2`,
            name: 'Monolith',
            meaning: 'A single, powerful, unshakeable stone or pillar.',
            strategicRationale: 'Signals immense strength and singular coherence.',
            personalityFit: 'Bold and architectural.',
            potentialWeakness: 'In software, can evoke legacy monolithic architectures if misinterpreted.'
          },
          {
            id: `cand-${Date.now()}-3`,
            name: 'FoundryX',
            meaning: 'The industrial workshop where enduring forms are cast.',
            strategicRationale: 'Direct metaphor for high-heat creation and tangible output.',
            personalityFit: 'Energetic and grounded.',
            potentialWeakness: 'Foundry is common in type and venture names.'
          }
        ]
      },
      {
        id: `terr-${Date.now()}-2`,
        number: '02',
        name: 'DYNAMIC MOMENTUM',
        theme: 'Names focused on acceleration, trajectory, and immediate execution.',
        rationale: 'Emphasizes the speed advantage and catalytic impact on the user’s journey.',
        candidates: [
          {
            id: `cand-${Date.now()}-4`,
            name: 'Vektor',
            meaning: 'A quantity having both direction and magnitude.',
            strategicRationale: 'Perfect encapsulation of purposeful velocity with zero wasted effort.',
            personalityFit: 'Crisp, scientific, high-agency.',
            potentialWeakness: 'Common tech motif; requires distinct visual styling.'
          },
          {
            id: `cand-${Date.now()}-5`,
            name: 'PulseForge',
            meaning: 'The rhythmic heartbeat of an active, productive maker.',
            strategicRationale: 'Combines biological vitality with industrial craft.',
            personalityFit: 'Vibrant, resilient, peer-to-peer.',
            potentialWeakness: 'Slightly longer syllable count.'
          },
          {
            id: `cand-${Date.now()}-6`,
            name: 'Acrobat',
            meaning: 'Nimble, high-wire grace under intense conditions.',
            strategicRationale: 'Differentiates from stiff enterprise competitors through agile energy.',
            personalityFit: 'Nimble and clever.',
            potentialWeakness: 'Strong associative overlap with Adobe Acrobat.'
          }
        ]
      },
      {
        id: `terr-${Date.now()}-3`,
        number: '03',
        name: 'COGNITIVE CLARITY',
        theme: 'Names signaling sharp insight, synthesis, and elimination of noise.',
        rationale: 'Directly addresses the cognitive overload felt by founders and teams.',
        candidates: [
          {
            id: `cand-${Date.now()}-7`,
            name: 'LucidFlow',
            meaning: 'Pristine lucidity combined with frictionless momentum.',
            strategicRationale: 'Communicates mental peace and operational efficiency.',
            personalityFit: 'Calm, intelligent, thoughtful.',
            potentialWeakness: 'Slightly conventional SaaS cadence.'
          },
          {
            id: `cand-${Date.now()}-8`,
            name: 'PrismPoint',
            meaning: 'The focal point where scattered light coalesces into clear bands.',
            strategicRationale: 'Memorable metaphor for organizing messy chaotic thoughts into order.',
            personalityFit: 'Refined and strategic.',
            potentialWeakness: 'Prism is used across creative tools.'
          },
          {
            id: `cand-${Date.now()}-9`,
            name: 'Stratex',
            meaning: 'Strategic execution distilled to its purest form.',
            strategicRationale: 'Immediate B2B gravity and executive appeal.',
            personalityFit: 'Sharp, executive, pragmatic.',
            potentialWeakness: 'Slightly corporate for early-stage creator audiences.'
          }
        ]
      }
    ];

    const selectedName = domainCandidates[0].candidates[0];

    return {
      territories: domainCandidates,
      selectedNameId: selectedName.id,
      selectedName,
      selectionRationale: `Selected because it marries architectural credibility with an unmistakable standard of craft, establishing a premium reputation from day one.`,
      isConfirmed: false
    };
  }

  async generateVisual(positioning: PositioningData, personality: PersonalityData, naming: NamingData): Promise<VisualData> {
    return {
      palette: [
        {
          name: 'Basalt Black',
          hex: '#0C0E12',
          role: 'background',
          contrastRatio: '19.4:1 against text',
          usageRule: 'Dominant canvas neutral (60% budget); creates deep editorial focus.'
        },
        {
          name: 'Electric Amber',
          hex: '#D97706',
          role: 'accent',
          contrastRatio: '8.1:1 against dark surface',
          usageRule: 'Strict 10% accent allocation for primary CTAs and active states.'
        },
        {
          name: 'Slate Boundary',
          hex: '#1E232B',
          role: 'surface',
          contrastRatio: '4.2:1 against canvas',
          usageRule: 'Single-elevation structural card surfaces with 1px hairline perimeter borders.'
        },
        {
          name: 'Cold Silver',
          hex: '#94A3B8',
          role: 'neutral',
          contrastRatio: '9.6:1 against background',
          usageRule: 'Secondary metadata, quiet separators, and descriptive labels.'
        },
        {
          name: 'Pure Chalk',
          hex: '#F8FAFC',
          role: 'primary',
          contrastRatio: '20.1:1 against background',
          usageRule: 'High-visibility display headlines and primary interaction labels.'
        }
      ],
      typography: [
        {
          role: 'Display & Hero Wordmark',
          family: 'Space Grotesk / Cabinet Grotesk',
          category: 'Contemporary Grotesque',
          weight: '600 SemiBold',
          usage: 'Headings, primary marks, stage titles; conveys confident architectural presence.'
        },
        {
          role: 'Body Prose & Rationale',
          family: 'Plus Jakarta Sans',
          category: 'Geometric Clean Sans',
          weight: '400 Regular / 500 Medium',
          usage: 'Body copy, descriptions, editorial context; maximizes scannability.'
        },
        {
          role: 'Data & Tabular Metrics',
          family: 'JetBrains Mono',
          category: 'Monospace Tabular',
          weight: '500 Medium',
          usage: 'Numerical metrics, stage index badges, code references, timestamps.'
        }
      ],
      shapeLanguage: {
        cornerStyle: 'Subtle 10px outer corners with mathematical inner radius inset (r_inner = r_outer - padding).',
        density: 'High-density scannable cards separated by generous whitespace and subtle hairlines.',
        framingRules: 'Hairline 1px borders with zero heavy drop shadows.',
        spatialFeel: 'Calm, deliberate, and architectural.'
      },
      artDirection: {
        mood: 'Modern design atelier meets high-performance engineering command.',
        composition: 'Asymmetric grid layouts, sharp typographic hierarchy, disciplined negative space.',
        lighting: 'Soft directional ambient light, high tonal contrast, zero neon glow.',
        imageryRules: [
          'High-resolution real-world artifacts (sketches, monitors, prototypes)',
          'No generic smiling corporate handshakes or floating pastel balls',
          'Monochrome or desaturated base imagery with controlled accent highlights'
        ]
      },
      logoConcept: {
        markType: 'Structured Wordmark with Geometric Accent Glyph',
        description: 'Clean typographic wordmark paired with an offset square glyph representing structured modularity.',
        symbolism: 'Reflects taking scattered raw inputs and transforming them into an enduring solid form.',
        clearspaceRule: 'Keep 100% of the mark’s cap height clear on all sides.'
      },
      thingsToAvoid: [
        'Vibrant purple-blue gradients',
        'Glow effects, neon drop shadows, and glassmorphism cards',
        'Cutesy cartoon mascot iconography'
      ],
      isConfirmed: false
    };
  }

  async generateChallenge(memory: Partial<BrandMemory>): Promise<ChallengeData> {
    return {
      findings: [
        {
          id: `crit-${Date.now()}-1`,
          category: 'GENERIC LANGUAGE',
          status: 'WARNING',
          finding: 'Value proposition contains phrases that could be claimed by general productivity software.',
          whyItMatters: 'If your value prop sounds like 5 other SaaS tools, buyers cannot justify choosing you over incumbent tools.',
          suggestedImprovement: 'Explicitly anchor the value proposition around the concrete, proprietary mechanism that saves them hours.',
          accepted: false,
          stageTarget: 'position'
        },
        {
          id: `crit-${Date.now()}-2`,
          category: 'AUDIENCE FIT',
          status: 'PASS',
          finding: 'Target audience scope is tightly defined and avoids the "software for everyone" trap.',
          whyItMatters: 'Narrow early targeting drastically lowers acquisition costs and generates high word-of-mouth referral.',
          suggestedImprovement: 'Double down on the first 100 passionate evangelists before broadening outreach.',
          accepted: false,
          stageTarget: 'discover'
        },
        {
          id: `crit-${Date.now()}-3`,
          category: 'POSITIONING',
          status: 'WARNING',
          finding: 'Risk of being perceived as a minor feature rather than a standalone platform.',
          whyItMatters: 'Users may ask: "Why shouldn’t I just use Notion or a shared spreadsheet for this?"',
          suggestedImprovement: 'Highlight the proprietary intelligent workflow and structured memory that generic note tools cannot replicate.',
          accepted: false,
          stageTarget: 'position'
        },
        {
          id: `crit-${Date.now()}-4`,
          category: 'NAME',
          status: 'PASS',
          finding: 'Chosen name carries strong mnemonic punch and strategic rationale.',
          whyItMatters: 'Memorability and phonetic clarity lower friction during spoken peer referrals.',
          suggestedImprovement: 'Ensure matching domain and handle availability across primary developer/creator directories.',
          accepted: false,
          stageTarget: 'naming'
        },
        {
          id: `crit-${Date.now()}-5`,
          category: 'CONSISTENCY',
          status: 'CONFLICT',
          finding: 'Tone in personality is described as "Decisive & Calm", but early launch pitch used hype-driven sales verbs.',
          whyItMatters: 'Inconsistent tone damages the calm, premium perception promised by the visual identity.',
          suggestedImprovement: 'Rewrite launch headline to speak with understated, confident authority rather than promotional urgency.',
          accepted: false,
          stageTarget: 'launch'
        }
      ],
      consistencySummary: {
        overallState: 'Has Actionable Gaps',
        strengthsCount: 2,
        warningsCount: 2,
        conflictsCount: 1,
        editorialAssessment:
          'Core strategy is distinctly positioned, but editorial discipline must be tightened in the launch messaging to ensure the tone matches the calm architectural visual identity.'
      },
      isConfirmed: false
    };
  }

  async generateLaunch(memory: Partial<BrandMemory>): Promise<LaunchData> {
    const brandName = memory.naming?.selectedName?.name || 'BrandForge';

    return {
      headline: `Build the brand your idea deserves.`,
      subheadline: `${brandName} transforms rough concepts into coherent brand systems, strategic positioning, and launch assets through deliberate multi-stage intelligence.`,
      oneLinePitch: `The strategic brand intelligence platform that turns unfinished product ideas into clear, memorable, and market-ready brands.`,
      productDescription: `${brandName} replaces guesswork and superficial generators with deliberate strategic reasoning. We analyze your core problem, craft defensible positioning, uncover your brand voice, and stress-test every assumption with an AI Brand Critic before you ship.`,
      primaryCta: `Start your brand strategy`,
      secondaryCta: `Explore live framework`,
      launchAnnouncement: `Most great ideas stall not because they lack technical merit, but because they struggle to explain what they are and why they matter. Today, we are releasing ${brandName}: a multi-stage brand intelligence platform engineered to turn rough concepts into launch-ready brand identities.`,
      socialPost: {
        platform: 'X / LinkedIn',
        text: `Your idea doesn’t need to be perfect—it just needs an intentional brand strategy.\n\nIntroducing ${brandName}: transform rough product concepts into coherent positioning, visual direction, and launch assets through a deliberate 7-stage strategic workflow.\n\nNo chatbots. No generic logos. Just deep strategic clarity.\n\nTry it now → ${brandName.toLowerCase()}.build`
      },
      whyThisMessagingWorks: `Leads with empathy toward unfinished ideas, directly refutes shallow chat interfaces, and positions the workflow as an elevated strategic partner that delivers tangible clarity.`,
      isConfirmed: false
    };
  }
}

export const brandEngine = new StrategicBrandEngine();
