import { BrandMemory } from '../types/brand';

export const DEMO_BRAND: BrandMemory = {
  id: 'demo-hackathon-teammates',
  projectName: 'SprintForge',
  roughIdea: 'I want to build an app that helps college students find teammates for hackathons.',
  knownDetails: 'College students usually get stuck on dead Discord channels or chaotic Google Sheets 48 hours before submission deadlines. Solo builders often drop out because they lack complementary skills (e.g., frontend dev without designer).',
  createdAt: '2026-09-25T10:00:00Z',
  updatedAt: '2026-09-25T12:00:00Z',
  currentStage: 'brand-kit',
  stagesCompleted: [
    'input',
    'discover',
    'position',
    'personality',
    'naming',
    'visualize',
    'challenge',
    'launch',
    'brand-kit',
  ],
  discovery: {
    coreProblem:
      'Collegiate hackathon participants drop out or underperform because team formation is unorganized, intimidating, and relies on chaotic Discord channels or last-minute random assignments with unmatched skillsets and commitment levels.',
    primaryAudience:
      'Undergraduate and graduate software engineers, product designers, and student founders (ages 18–24) actively seeking complementary collaborators for weekend sprints.',
    userContext:
      'High-stress, time-compressed hackathon registration windows where missing a designer or backend lead turns an ambitious weekend project into a frustrating non-starter.',
    currentAlternatives: [
      'Chaotic Discord server #team-search channels filled with unstructured intros',
      'Organizer-shared Google Sheets with unverified skills and ghost participants',
      'In-person "speed dating" circles where introverts and first-timers get left behind',
      'Defaulting to submitting solo or skipping the hackathon entirely'
    ],
    coreNeed:
      'A low-friction, high-trust matching system based on verifiable proof of work, complementary roles (UI/UX + Backend + PM), and matched weekend ambition levels.',
    assumptions: [
      {
        id: 'asm-1',
        statement: 'Students are willing to upload GitHub links or mini portfolios before searching for teammates.',
        riskLevel: 'medium',
        validationTip: 'Test 2-minute frictionless onboarding without requiring complex portfolio verification.'
      },
      {
        id: 'asm-2',
        statement: 'Hackathon organizers will actively endorse or embed this instead of running their own Discord channel.',
        riskLevel: 'high',
        validationTip: 'Offer a 1-click organizer dashboard with CSV export and private event access codes.'
      },
      {
        id: 'asm-3',
        statement: 'Participants care more about complementary skills and grit than being close friends prior to the event.',
        riskLevel: 'low',
        validationTip: 'User interviews confirm skill compatibility and commitment consensus are the primary blockers.'
      }
    ],
    openQuestions: [
      {
        id: 'q-1',
        question: 'How do we prevent teammate ghosting 6 hours into a 36-hour sprint?',
        strategicWhy: 'Reliability is the currency of team matchmaking; a single ghosted team damages word-of-mouth.'
      },
      {
        id: 'q-2',
        question: 'Does this platform live only during hackathons or transition into startup co-founder matching year-round?',
        strategicWhy: 'Determines whether our positioning is an event utility or an enduring career network.'
      }
    ],
    isConfirmed: true
  },
  positioning: {
    category: 'Collegiate Hackathon Teammate Matching & Squad Formation Platform',
    targetSegment: 'Competitive and first-time student builders entering regional, collegiate, and global virtual hackathons.',
    valueProposition:
      'Form high-chemistry, complementary hackathon squads in under 10 minutes based on real skills, working styles, and shared ambition—never leave a weekend project unbuilt.',
    differentiator:
      'Role-complementary sync (matching devs with designers & PMs), verified commitment gauges, and structured sprint agreements that eliminate awkward last-minute ghosting.',
    positioningStatement:
      'For ambitious student builders who want to compete without social friction, SprintForge is the squad formation engine that turns solitary hackers into balanced, podium-ready teams before the opening ceremony.',
    whyThisPosition:
      'Generic social apps fail because they lack the time urgency and role-balance logic of a 36-hour sprint. By positioning explicitly around "balanced squad chemistry" rather than generic networking, we solve both the social anxiety and the technical skill gap.',
    isConfirmed: true
  },
  personality: {
    traits: [
      {
        name: 'Bold & Encouraging',
        description: 'Instills builder confidence and dispels imposter syndrome before peer interactions.',
        strategicReason: 'Students frequently self-censor and avoid pitching themselves to senior engineers unless prompted with high-agency warmth.',
        whyItFits: 'Students often suffer from imposter syndrome when approaching unfamiliar or senior peers.',
        evidence: 'User interviews indicate 42% of first-timers do not reach out because they fear being judged as "not technical enough".'
      },
      {
        name: 'Momentum-Driven',
        description: 'Operates with palpable kinetic speed tailored to a ticking 36-hour sprint countdown.',
        strategicReason: 'In hackathons, deliberation latency kills project completion; UX must bias toward instant team commitments.',
        whyItFits: 'Hackathons operate on tight countdowns; every minute spent deliberating is code unwritten.',
        evidence: 'The product experience must feel rapid, energetic, and focused on bias-for-action.'
      },
      {
        name: 'Pragmatic & Honest',
        description: 'Direct, clear, unvarnished communication about stacks, hours, and expectations.',
        strategicReason: 'Collegiate builders possess instant cynicism toward corporate fluff and empty networking buzzwords.',
        whyItFits: 'Developers hate corporate fluff and empty networking buzzwords.',
        evidence: 'Students respond to direct statements about stack compatibility, timezones, and sleep schedules.'
      },
      {
        name: 'Inclusive & Welcoming',
        description: 'Active parity for non-developer disciplines (UI designers, pitching leads, product storytellers).',
        strategicReason: 'Winning hackathon teams require balanced skillsets, yet Discord culture consistently sidelines designers and copywriters.',
        whyItFits: 'Cross-functional teams need non-traditional tech disciplines like design, copy, and hardware.',
        evidence: 'Solo designers frequently feel sidelined in Discord channels dominated by backend engineers.'
      }
    ],
    traitsToAvoid: [
      {
        name: 'Corporate / Stuffy',
        trait: 'Corporate / Stuffy',
        description: 'Enterprise HR-speak with sanitized corporate terminology.',
        reasonToAvoid: 'Feels like a mandatory enterprise compliance software rather than a vibrant collegiate sprint environment.',
        reason: 'Feels like an HR enterprise compliance tool rather than a vibrant collegiate sprint environment.'
      },
      {
        name: 'Gamer / Hyper-Neon Chaos',
        trait: 'Gamer / Hyper-Neon Chaos',
        description: 'Frenetic, noisy, meme-heavy gamer aesthetics that lack strategic clarity.',
        reasonToAvoid: 'Dilutes credibility for participants aiming for venture prizes, top-tier sponsor hiring, and serious portfolio pieces.',
        reason: 'Dilutes seriousness for participants aiming for venture prizes, sponsor hiring, and portfolio work.'
      },
      {
        name: 'Overly Academic',
        trait: 'Overly Academic',
        description: 'Dense theoretical pedagogy and high-friction intellectual gatekeeping.',
        reasonToAvoid: 'Slows down the emotional momentum and creates unnecessary friction with intimidating jargon.',
        reason: 'Slows down the emotional momentum and creates friction with intimidating jargon.'
      }
    ],
    principles: [
      'Match on complementary strengths, never redundant duplicates.',
      'Respect the clock: zero wasted clicks when the submission timer is ticking.',
      'Democratize access: first-time participants get equal visibility alongside experienced champions.',
      'Radical commitment clarity: state upfront whether you are aiming for Grand Prize or just learning.'
    ],
    brandPrinciples: [
      {
        name: 'Complementary Chemistry',
        statement: 'Match on complementary strengths, never redundant duplicates.',
        implication: 'Never pair three backend engineers together without recommending a designer or product lead.'
      },
      {
        name: 'Respect The Clock',
        statement: 'Zero wasted clicks when the submission timer is ticking.',
        implication: 'Every squad formation interaction must conclude in under 3 minutes.'
      },
      {
        name: 'Democratize Visibility',
        statement: 'First-time participants get equal discovery visibility alongside experienced champions.',
        implication: 'Recommendation algorithms weight learning intent and communication parity over raw GitHub stars.'
      },
      {
        name: 'Radical Commitment Clarity',
        statement: 'State upfront whether you are aiming for Grand Prize or just exploring.',
        implication: 'Require a binary ambition gauge during squad sync to eliminate 3am ghosting.'
      }
    ],
    dimensions: [
      {
        dimension: 'Formality',
        value: 20,
        lowLabel: 'Collegiate & Peer',
        highLabel: 'Institutional & Corporate',
        rationale: 'Builds immediate psychological safety for students entering an intimidating high-stakes sprint.'
      },
      {
        dimension: 'Tempo',
        value: 85,
        lowLabel: 'Deliberate & Measured',
        highLabel: 'Kinetic & Urgent',
        rationale: 'Matches the adrenaline and high-energy reality of a 36-hour weekend countdown.'
      },
      {
        dimension: 'Communication Density',
        value: 25,
        lowLabel: 'Telegraphic & Direct',
        highLabel: 'Narrative & Elaborate',
        rationale: 'Builders scan for stack keywords, hours, and goals; zero tolerance for conversational filler.'
      },
      {
        dimension: 'Warmth',
        value: 80,
        lowLabel: 'Stoic & Detached',
        highLabel: 'Empathetic & Electric',
        rationale: 'Counteracts solo hacker anxiety with an infectious atmosphere of mutual belief.'
      }
    ],
    voice: {
      summary: 'Confident, crisp, collegiate, and peer-to-peer — like a trusted senior hackathon mentor cheering you into the arena.',
      characteristics: [
        {
          characteristic: 'Direct & Punchy',
          explanation: 'Uses active verbs and concise clauses; avoids filler or qualifiers.'
        },
        {
          characteristic: 'Grounded in Maker Grit',
          explanation: 'Speaks directly to the realities of shipping code, debugging APIs, and staying fueled.'
        },
        {
          characteristic: 'Celebratory of Shipping',
          explanation: 'Treats every working demo as a victory worth rallying behind.'
        }
      ],
      toneRules: [
        {
          do: 'Speak directly as peer-to-peer collaborators (you, we, squad).',
          avoid: 'Referring to participants as "users", "resources", or "human capital".',
          example: 'Find your co-builder in 3 clicks and lock your squad before opening ceremony.'
        },
        {
          do: 'Acknowledge time pressure with calm confidence.',
          avoid: 'Inducing panic or anxiety about missed deadlines.',
          example: 'Clock is ticking, but you have got this. Let us balance your roster.'
        },
        {
          do: 'Highlight complementary skill pairings specifically.',
          avoid: 'Vague platitudes about general teamwork.',
          example: 'Pair your PyTorch model with a React front-end specialist in room 4.'
        }
      ]
    },
    writingSamples: {
      headline: 'Never build alone again. Meet your 36-hour dream squad.',
      valueProposition: 'Form high-chemistry, cross-functional hackathon squads in under 10 minutes based on real skills and shared ambition.',
      socialMessage: 'Going into HackMIT solo? Don’t let a killer project die in your head. Find your designer & frontend co-pilot right now on SprintForge.',
      userExplanation: 'We match you with peers whose technical skills complement yours and whose weekend goals align with your schedule.'
    },
    voiceAndTone: {
      tone: 'Confident, crisp, collegiate, and peer-to-peer',
      voiceCharacteristics: [
        'Direct and punchy without being arrogant',
        'Empathetic to late-night caffeine-fueled grit',
        'Celebratory of shipping real working prototypes'
      ],
      writingSampleDo: 'Ready to build something unforgettable this weekend? Pair your backend chops with a killer UI designer in 3 clicks.',
      writingSampleDont: 'Leverage our advanced multi-tenant synergy platform to optimize cross-functional human capital allocations.'
    },
    isConfirmed: true
  },
  naming: {
    namingStrategy:
      'Formulate names that harmonize collegiate sprint urgency with the enduring pride of forging high-chemistry software squads, eliminating solo hacker anxiety without resorting to corporate HR platitudes.',
    namingBrief:
      'Names must resonate with high-agency builders, emphasize complementary pairing over redundant duplicate skills, feel native to 36-hour weekend adrenaline, and carry enough weight to scale from hackathons into seed-stage venture teams.',
    namingWorlds: [
      {
        id: 't-1',
        name: 'CONNECTION & SQUAD',
        description: 'Names grounded in human chemistry, mutual peer alignment, and complementary partnerships.',
        strategicIdea: 'Highlights the human element and removes the cold vulnerability of transactional networking.',
        namingLogic: 'Compound morphemes blending collaborative terminology with maker agility.',
        emotionalTerritory: 'Welcoming, warm, high-trust, and communal.',
        tradeoff: 'May occasionally lean softer, requiring strong visual framing to maintain technical credibility.',
        examples: ['Kithack', 'TandemBuild', 'SyncSquad']
      },
      {
        id: 't-2',
        name: 'BUILDER MOMENTUM',
        description: 'Names radiating craftsmanship, rapid prototyping, and shipping working code under extreme pressure.',
        strategicIdea: 'Appeals directly to the pride of builders who stay up all night to see their demo execute.',
        namingLogic: 'Industrial, kinetic action verbs fused with workshop and metallurgical metaphors.',
        emotionalTerritory: 'Bold, gritty, high-agency, professional yet electric.',
        tradeoff: 'Industrial roots (forge, build) are competitive and require distinct semantic modifiers.',
        examples: ['SprintForge', 'ShiftBuild', 'CrewSpark']
      },
      {
        id: 't-3',
        name: 'TACTICAL DISCOVERY',
        description: 'Names focused on scouting, complementary roster assembly, and podium-readiness.',
        strategicIdea: 'Positions the platform as an unfair tactical advantage for ambitious competitors aiming for grand prizes.',
        namingLogic: 'Tournament draft mechanics, laboratory precision, and sports roster terminology.',
        emotionalTerritory: 'Analytical, calculated, ambitious, and elite.',
        tradeoff: 'Risk alienating first-time learners who do not care about competitive tournament podiums.',
        examples: ['RosterLab', 'Foundry5', 'PodiumDraft']
      }
    ],
    territories: [
      {
        id: 't-1',
        number: '01',
        name: 'CONNECTION & SQUAD',
        theme: 'Names grounded in human chemistry, alignment, and complementary partnerships.',
        rationale: 'Highlights the human element and removes the coldness of transactional networking.',
        description: 'Names grounded in human chemistry, mutual peer alignment, and complementary partnerships.',
        strategicIdea: 'Highlights the human element and removes the cold vulnerability of transactional networking.',
        namingLogic: 'Compound morphemes blending collaborative terminology with maker agility.',
        emotionalTerritory: 'Welcoming, warm, high-trust, and communal.',
        tradeoff: 'May occasionally lean softer, requiring strong visual framing to maintain technical credibility.',
        examples: ['Kithack', 'TandemBuild', 'SyncSquad'],
        candidates: [
          {
            id: 'c-1',
            name: 'Kithack',
            worldId: 't-1',
            pronunciation: 'KIT-hak',
            concept: 'The essential tactical kit for community makers.',
            meaning: 'Kit (gear & readiness) + Kin/Kit (community of makers).',
            strategicRationale: 'Friendly, memorable, and sounds like essential equipment for hackathons.',
            personalityFit: 'High warmth, highly accessible.',
            potentialWeakness: 'Might sound too lightweight or like a toy toolkit.',
            status: 'shortlisted',
            evaluation: {
              strategicFit: 84,
              positioningFit: 80,
              personalityFit: 92,
              audienceFit: 88,
              distinctiveness: 85,
              memorability: 89,
              pronunciation: 94,
              flexibility: 76,
              risks: ['Can sound like a hardware kit rather than team matching', 'Lighthearted tone may lessen venture perceived weight'],
              rationale: 'Exceptional warmth and immediate recall for collegiate first-timers.'
            }
          },
          {
            id: 'c-2',
            name: 'TandemBuild',
            worldId: 't-1',
            pronunciation: 'TAN-dem-bild',
            concept: 'Complementary partners pedaling in unison.',
            meaning: 'Working in seamless synchronicity toward a shared goal.',
            strategicRationale: 'Directly implies pairs and balanced teammates pedaling together.',
            personalityFit: 'Pragmatic and reliable.',
            potentialWeakness: 'Implies only 2-person teams rather than 4-person squads.',
            status: 'candidate',
            evaluation: {
              strategicFit: 82,
              positioningFit: 83,
              personalityFit: 78,
              audienceFit: 82,
              distinctiveness: 76,
              memorability: 81,
              pronunciation: 90,
              flexibility: 84,
              risks: ['Semantic suggestion of exactly two people', 'Build root is crowded in dev tooling'],
              rationale: 'Strong conceptual clarity for pair matchmaking but less flexible for full 4-person rosters.'
            }
          },
          {
            id: 'c-3',
            name: 'SyncSquad',
            worldId: 't-1',
            pronunciation: 'SINK-skwod',
            concept: 'Instant roster synchronization for collegiate competitors.',
            meaning: 'Synchronized coordination for competitive teams.',
            strategicRationale: 'Immediate clarity on what the app delivers.',
            personalityFit: 'Modern, energetic, collegiate.',
            potentialWeakness: 'Somewhat literal and generic in crowded EdTech spaces.',
            status: 'candidate',
            evaluation: {
              strategicFit: 79,
              positioningFit: 85,
              personalityFit: 84,
              audienceFit: 86,
              distinctiveness: 68,
              memorability: 82,
              pronunciation: 92,
              flexibility: 74,
              risks: ['High risk of generic association with enterprise collaboration tools', 'Literal name limits brand storytelling'],
              rationale: 'Immediate comprehension with slightly diminished long-term brand defensibility.'
            }
          }
        ]
      },
      {
        id: 't-2',
        number: '02',
        name: 'BUILDER MOMENTUM',
        theme: 'Names radiating craftsmanship, rapid prototyping, and shipping under pressure.',
        rationale: 'Appeals directly to the pride of builders who stay up all night to see their demo execute.',
        description: 'Names radiating craftsmanship, rapid prototyping, and shipping working code under extreme pressure.',
        strategicIdea: 'Appeals directly to the pride of builders who stay up all night to see their demo execute.',
        namingLogic: 'Industrial, kinetic action verbs fused with workshop and metallurgical metaphors.',
        emotionalTerritory: 'Bold, gritty, high-agency, professional yet electric.',
        tradeoff: 'Industrial roots (forge, build) are competitive and require distinct semantic modifiers.',
        examples: ['SprintForge', 'ShiftBuild', 'CrewSpark'],
        candidates: [
          {
            id: 'c-4',
            name: 'SprintForge',
            worldId: 't-2',
            pronunciation: 'SPRINT-forj',
            concept: 'Forging durable venture teams under intense sprint pressure.',
            meaning: 'Sprint (rapid hackathon intensity) + Forge (shaping enduring ideas under heat).',
            strategicRationale: 'Combines the urgency of a weekend with the craftsmanship of an elite build team.',
            personalityFit: 'Bold, gritty, high-agency, professional yet exciting.',
            potentialWeakness: 'Forge is an active root word used across dev tooling.',
            status: 'selected',
            evaluation: {
              strategicFit: 94,
              positioningFit: 95,
              personalityFit: 93,
              audienceFit: 92,
              distinctiveness: 89,
              memorability: 91,
              pronunciation: 95,
              flexibility: 90,
              risks: ['Requires clear visual mark to separate from dev tool repos', 'Forge metaphor requires premium design language'],
              rationale: 'Flawless strategic alignment with the 36-hour sprint tension and lasting co-founder chemistry.'
            }
          },
          {
            id: 'c-5',
            name: 'ShiftBuild',
            worldId: 't-2',
            pronunciation: 'SHIFT-bild',
            concept: 'Shifting from solo concept to collective shipping.',
            meaning: 'Shifting gears from solo concept to collaborative execution.',
            strategicRationale: 'Clean, modern software brand cadence.',
            personalityFit: 'Crisp and focused.',
            potentialWeakness: 'Sounds slightly like a DevOps continuous deployment CI/CD tool.',
            status: 'candidate',
            evaluation: {
              strategicFit: 81,
              positioningFit: 80,
              personalityFit: 83,
              audienceFit: 84,
              distinctiveness: 77,
              memorability: 79,
              pronunciation: 92,
              flexibility: 85,
              risks: ['Category confusion with automated deployment platforms', 'Slightly utilitarian tone'],
              rationale: 'Solid software brand cadence with potential category overlap.'
            }
          },
          {
            id: 'c-6',
            name: 'CrewSpark',
            worldId: 't-2',
            pronunciation: 'KROO-spark',
            concept: 'The initial flash that turns strangers into a unified build squad.',
            meaning: 'The ignition moment where strangers coalesce into an inspired crew.',
            strategicRationale: 'Warm, youthful, and immediately memorable.',
            personalityFit: 'Highly encouraging and accessible.',
            potentialWeakness: 'Slightly less weight for serious upperclassmen.',
            status: 'candidate',
            evaluation: {
              strategicFit: 85,
              positioningFit: 82,
              personalityFit: 88,
              audienceFit: 89,
              distinctiveness: 83,
              memorability: 87,
              pronunciation: 93,
              flexibility: 78,
              risks: ['May feel overly collegiate for founders seeking seed venture rounds', 'Spark suffix is common in early-stage incubators'],
              rationale: 'High enthusiasm and peer warmth with slightly lower enterprise gravitas.'
            }
          }
        ]
      },
      {
        id: 't-3',
        number: '03',
        name: 'TACTICAL DISCOVERY',
        theme: 'Names focused on scouting, roster assembly, and podium-readiness.',
        rationale: 'Positions the tool as an unfair tactical advantage for ambitious competitors.',
        description: 'Names focused on scouting, complementary roster assembly, and podium-readiness.',
        strategicIdea: 'Positions the platform as an unfair tactical advantage for ambitious competitors aiming for grand prizes.',
        namingLogic: 'Tournament draft mechanics, laboratory precision, and sports roster terminology.',
        emotionalTerritory: 'Analytical, calculated, ambitious, and elite.',
        tradeoff: 'Risk alienating first-time learners who do not care about competitive tournament podiums.',
        examples: ['RosterLab', 'Foundry5', 'PodiumDraft'],
        candidates: [
          {
            id: 'c-7',
            name: 'RosterLab',
            worldId: 't-3',
            pronunciation: 'ROS-ter-lab',
            concept: 'The laboratory where tournament-winning teams are engineered.',
            meaning: 'The laboratory where tournament-winning rosters are formulated.',
            strategicRationale: 'Sounds analytical, structured, and goal-oriented.',
            personalityFit: 'Analytical and competitive.',
            potentialWeakness: 'Can feel overly clinical for creative design participants.',
            status: 'candidate',
            evaluation: {
              strategicFit: 87,
              positioningFit: 89,
              personalityFit: 81,
              audienceFit: 83,
              distinctiveness: 86,
              memorability: 88,
              pronunciation: 91,
              flexibility: 82,
              risks: ['Can feel clinical or intimidating to non-technical designers', 'Lab suffix is moderately common'],
              rationale: 'Excellent positioning for high-ambition competitive hackathons.'
            }
          },
          {
            id: 'c-8',
            name: 'Foundry5',
            worldId: 't-3',
            pronunciation: 'FOWN-dree-fyv',
            concept: 'The industrial workshop where five distinct minds fuse.',
            meaning: 'The foundry where up to five minds fuse into one product.',
            strategicRationale: 'Strong architectural resonance.',
            personalityFit: 'Industrial and elite.',
            potentialWeakness: 'The number 5 limits perception if hackathon team caps vary.',
            status: 'candidate',
            evaluation: {
              strategicFit: 83,
              positioningFit: 84,
              personalityFit: 85,
              audienceFit: 79,
              distinctiveness: 88,
              memorability: 85,
              pronunciation: 88,
              flexibility: 70,
              risks: ['Number in name restricts events with 3 or 4 person team caps', 'Sounds slightly like an investment fund'],
              rationale: 'Distinctive industrial tone with restrictive numerical constraint.'
            }
          },
          {
            id: 'c-9',
            name: 'PodiumDraft',
            worldId: 't-3',
            pronunciation: 'PO-dee-um-draft',
            concept: 'A deliberate tournament draft engineered to win the podium.',
            meaning: 'Drafting teammates with the clear target of winning the podium.',
            strategicRationale: 'Direct alignment with hackathon competitive ambition.',
            personalityFit: 'Very high energy, competitive.',
            potentialWeakness: 'May alienate casual beginners who just want to learn.',
            status: 'candidate',
            evaluation: {
              strategicFit: 89,
              positioningFit: 91,
              personalityFit: 82,
              audienceFit: 80,
              distinctiveness: 92,
              memorability: 89,
              pronunciation: 89,
              flexibility: 72,
              risks: ['Alienates beginners just seeking to explore or learn', 'Very specific to competitive tournament events'],
              rationale: 'Maximum differentiation in the competitive segment with narrow audience funnel.'
            }
          }
        ]
      }
    ],
    candidates: [
      {
        id: 'c-1',
        name: 'Kithack',
        worldId: 't-1',
        pronunciation: 'KIT-hak',
        concept: 'The essential tactical kit for community makers.',
        meaning: 'Kit (gear & readiness) + Kin/Kit (community of makers).',
        strategicRationale: 'Friendly, memorable, and sounds like essential equipment for hackathons.',
        personalityFit: 'High warmth, highly accessible.',
        potentialWeakness: 'Might sound too lightweight or like a toy toolkit.',
        status: 'shortlisted',
        evaluation: {
          strategicFit: 84,
          positioningFit: 80,
          personalityFit: 92,
          audienceFit: 88,
          distinctiveness: 85,
          memorability: 89,
          pronunciation: 94,
          flexibility: 76,
          risks: ['Can sound like a hardware kit rather than team matching', 'Lighthearted tone may lessen venture perceived weight'],
          rationale: 'Exceptional warmth and immediate recall for collegiate first-timers.'
        }
      },
      {
        id: 'c-2',
        name: 'TandemBuild',
        worldId: 't-1',
        pronunciation: 'TAN-dem-bild',
        concept: 'Complementary partners pedaling in unison.',
        meaning: 'Working in seamless synchronicity toward a shared goal.',
        strategicRationale: 'Directly implies pairs and balanced teammates pedaling together.',
        personalityFit: 'Pragmatic and reliable.',
        potentialWeakness: 'Implies only 2-person teams rather than 4-person squads.',
        status: 'candidate',
        evaluation: {
          strategicFit: 82,
          positioningFit: 83,
          personalityFit: 78,
          audienceFit: 82,
          distinctiveness: 76,
          memorability: 81,
          pronunciation: 90,
          flexibility: 84,
          risks: ['Semantic suggestion of exactly two people', 'Build root is crowded in dev tooling'],
          rationale: 'Strong conceptual clarity for pair matchmaking but less flexible for full 4-person rosters.'
        }
      },
      {
        id: 'c-3',
        name: 'SyncSquad',
        worldId: 't-1',
        pronunciation: 'SINK-skwod',
        concept: 'Instant roster synchronization for collegiate competitors.',
        meaning: 'Synchronized coordination for competitive teams.',
        strategicRationale: 'Immediate clarity on what the app delivers.',
        personalityFit: 'Modern, energetic, collegiate.',
        potentialWeakness: 'Somewhat literal and generic in crowded EdTech spaces.',
        status: 'candidate',
        evaluation: {
          strategicFit: 79,
          positioningFit: 85,
          personalityFit: 84,
          audienceFit: 86,
          distinctiveness: 68,
          memorability: 82,
          pronunciation: 92,
          flexibility: 74,
          risks: ['High risk of generic association with enterprise collaboration tools', 'Literal name limits brand storytelling'],
          rationale: 'Immediate comprehension with slightly diminished long-term brand defensibility.'
        }
      },
      {
        id: 'c-4',
        name: 'SprintForge',
        worldId: 't-2',
        pronunciation: 'SPRINT-forj',
        concept: 'Forging durable venture teams under intense sprint pressure.',
        meaning: 'Sprint (rapid hackathon intensity) + Forge (shaping enduring ideas under heat).',
        strategicRationale: 'Combines the urgency of a weekend with the craftsmanship of an elite build team.',
        personalityFit: 'Bold, gritty, high-agency, professional yet exciting.',
        potentialWeakness: 'Forge is an active root word used across dev tooling.',
        status: 'selected',
        evaluation: {
          strategicFit: 94,
          positioningFit: 95,
          personalityFit: 93,
          audienceFit: 92,
          distinctiveness: 89,
          memorability: 91,
          pronunciation: 95,
          flexibility: 90,
          risks: ['Requires clear visual mark to separate from dev tool repos', 'Forge metaphor requires premium design language'],
          rationale: 'Flawless strategic alignment with the 36-hour sprint tension and lasting co-founder chemistry.'
        }
      },
      {
        id: 'c-5',
        name: 'ShiftBuild',
        worldId: 't-2',
        pronunciation: 'SHIFT-bild',
        concept: 'Shifting from solo concept to collective shipping.',
        meaning: 'Shifting gears from solo concept to collaborative execution.',
        strategicRationale: 'Clean, modern software brand cadence.',
        personalityFit: 'Crisp and focused.',
        potentialWeakness: 'Sounds slightly like a DevOps continuous deployment CI/CD tool.',
        status: 'candidate',
        evaluation: {
          strategicFit: 81,
          positioningFit: 80,
          personalityFit: 83,
          audienceFit: 84,
          distinctiveness: 77,
          memorability: 79,
          pronunciation: 92,
          flexibility: 85,
          risks: ['Category confusion with automated deployment platforms', 'Slightly utilitarian tone'],
          rationale: 'Solid software brand cadence with potential category overlap.'
        }
      },
      {
        id: 'c-6',
        name: 'CrewSpark',
        worldId: 't-2',
        pronunciation: 'KROO-spark',
        concept: 'The initial flash that turns strangers into a unified build squad.',
        meaning: 'The ignition moment where strangers coalesce into an inspired crew.',
        strategicRationale: 'Warm, youthful, and immediately memorable.',
        personalityFit: 'Highly encouraging and accessible.',
        potentialWeakness: 'Slightly less weight for serious upperclassmen.',
        status: 'candidate',
        evaluation: {
          strategicFit: 85,
          positioningFit: 82,
          personalityFit: 88,
          audienceFit: 89,
          distinctiveness: 83,
          memorability: 87,
          pronunciation: 93,
          flexibility: 78,
          risks: ['May feel overly collegiate for founders seeking seed venture rounds', 'Spark suffix is common in early-stage incubators'],
          rationale: 'High enthusiasm and peer warmth with slightly lower enterprise gravitas.'
        }
      },
      {
        id: 'c-7',
        name: 'RosterLab',
        worldId: 't-3',
        pronunciation: 'ROS-ter-lab',
        concept: 'The laboratory where tournament-winning teams are engineered.',
        meaning: 'The laboratory where tournament-winning rosters are formulated.',
        strategicRationale: 'Sounds analytical, structured, and goal-oriented.',
        personalityFit: 'Analytical and competitive.',
        potentialWeakness: 'Can feel overly clinical for creative design participants.',
        status: 'candidate',
        evaluation: {
          strategicFit: 87,
          positioningFit: 89,
          personalityFit: 81,
          audienceFit: 83,
          distinctiveness: 86,
          memorability: 88,
          pronunciation: 91,
          flexibility: 82,
          risks: ['Can feel clinical or intimidating to non-technical designers', 'Lab suffix is moderately common'],
          rationale: 'Excellent positioning for high-ambition competitive hackathons.'
        }
      },
      {
        id: 'c-8',
        name: 'Foundry5',
        worldId: 't-3',
        pronunciation: 'FOWN-dree-fyv',
        concept: 'The industrial workshop where five distinct minds fuse.',
        meaning: 'The foundry where up to five minds fuse into one product.',
        strategicRationale: 'Strong architectural resonance.',
        personalityFit: 'Industrial and elite.',
        potentialWeakness: 'The number 5 limits perception if hackathon team caps vary.',
        status: 'candidate',
        evaluation: {
          strategicFit: 83,
          positioningFit: 84,
          personalityFit: 85,
          audienceFit: 79,
          distinctiveness: 88,
          memorability: 85,
          pronunciation: 88,
          flexibility: 70,
          risks: ['Number in name restricts events with 3 or 4 person team caps', 'Sounds slightly like an investment fund'],
          rationale: 'Distinctive industrial tone with restrictive numerical constraint.'
        }
      },
      {
        id: 'c-9',
        name: 'PodiumDraft',
        worldId: 't-3',
        pronunciation: 'PO-dee-um-draft',
        concept: 'A deliberate tournament draft engineered to win the podium.',
        meaning: 'Drafting teammates with the clear target of winning the podium.',
        strategicRationale: 'Direct alignment with hackathon competitive ambition.',
        personalityFit: 'Very high energy, competitive.',
        potentialWeakness: 'May alienate casual beginners who just want to learn.',
        status: 'candidate',
        evaluation: {
          strategicFit: 89,
          positioningFit: 91,
          personalityFit: 82,
          audienceFit: 80,
          distinctiveness: 92,
          memorability: 89,
          pronunciation: 89,
          flexibility: 72,
          risks: ['Alienates beginners just seeking to explore or learn', 'Very specific to competitive tournament events'],
          rationale: 'Maximum differentiation in the competitive segment with narrow audience funnel.'
        }
      }
    ],
    shortlistedIds: ['c-1', 'c-4'],
    shortlistedCandidateIds: ['c-1', 'c-4'],
    rejectedIds: [],
    selectedCandidateId: 'c-4',
    selectedNameId: 'c-4',
    selectedName: {
      id: 'c-4',
      name: 'SprintForge',
      worldId: 't-2',
      pronunciation: 'SPRINT-forj',
      concept: 'Forging durable venture teams under intense sprint pressure.',
      meaning: 'Sprint (rapid hackathon intensity) + Forge (shaping enduring ideas under heat).',
      strategicRationale: 'Combines the urgency of a weekend with the craftsmanship of an elite build team.',
      personalityFit: 'Bold, gritty, high-agency, professional yet exciting.',
      potentialWeakness: 'Forge is an active root word used across dev tooling.',
      status: 'selected'
    },
    selectionRationale:
      'SprintForge strikes the exact balance between rapid weekend execution and enduring pride of craft. It honors the 36-hour sprint while framing teammate formation as the foundational step of forging a real product.',
    isConfirmed: true
  },
  visual: {
    creativeDirection: {
      concept: 'Industrial Sprint Atelier: Sculpted tools, nocturnal focus, and kinetic maker grit.',
      visualThesis: 'If SprintForge were a physical environment, it would be an illuminated underground prototyping hangar at 2 AM—where high-performance monitors glow against matte slate workbenches and ideas are hammered into working software under intense countdown pressure.',
      moodKeywords: ['Nocturnal', 'Architectural', 'Kinetic', 'Tactile', 'Decisive', 'Crafted'],
    },
    visualConcept: 'Industrial Sprint Atelier: Sculpted tools, nocturnal focus, and kinetic maker grit.',
    visualThesis: 'If SprintForge were a physical environment, it would be an illuminated underground prototyping hangar at 2 AM—where high-performance monitors glow against matte slate workbenches and ideas are hammered into working software under intense countdown pressure.',
    moodKeywords: ['Nocturnal', 'Architectural', 'Kinetic', 'Tactile', 'Decisive', 'Crafted'],
    visualPrinciples: [
      {
        name: 'Nocturnal Focus',
        description: 'Deep obsidian and structural slate surfaces eliminate eye fatigue during extended 36-hour build sessions.',
        application: 'Maintain dark canvas backgrounds with selective luminescent accents rather than harsh light mode glare.',
      },
      {
        name: 'Hairline Precision',
        description: 'Interfaces are structured using 1px hairline dividers with mathematical nesting instead of heavy drop shadows.',
        application: 'Enforce crisp borders with rgba(255,255,255,0.08) opacity across all card boundaries.',
      },
      {
        name: 'Kinetic Signal Economy',
        description: 'Color is functional telemetry: amber signals urgency and countdown, emerald signals verified compatibility.',
        application: 'Strictly limit vibrant accent colors to 10% of total visual surface area.',
      },
      {
        name: 'Maker Typographic Rhythm',
        description: 'Monospace tabular data provides immediate scan speed for tech stacks, commit frequencies, and project deadlines.',
        application: 'Use tabular digits for clocks, participant counts, and skill match percentages.',
      }
    ],
    colorSystem: {
      primary: {
        name: 'Structural Slate',
        hex: '#161B22',
        role: 'primary',
        rationale: 'Establishes dependable structural weight for cards, navigation panels, and interactive docks.',
      },
      secondary: {
        name: 'Signal Emerald',
        hex: '#10B981',
        role: 'secondary',
        rationale: 'Denotes skill verified status, complementary match indicators, and online presence.',
      },
      accent: {
        name: 'Forged Amber',
        hex: '#F59E0B',
        role: 'accent',
        rationale: 'Highlights primary countdown timers, active matchmaking events, and critical CTAs.',
      },
      background: {
        name: 'Obsidian Canvas',
        hex: '#0A0D12',
        role: 'background',
        rationale: 'Distraction-free nocturnal backdrop calibrated for marathon coding sessions.',
      },
      surface: {
        name: 'Deep Charcoal',
        hex: '#1C2128',
        role: 'surface',
        rationale: 'Slight elevation step for modal overlays, floating command bars, and active cards.',
      },
      text: {
        name: 'Pure Titanium',
        hex: '#F8FAFC',
        role: 'text',
        rationale: 'Maximum contrast typography ensuring readability across all dark surfaces.',
      },
      muted: {
        name: 'Warm Stone',
        hex: '#8A8175',
        role: 'muted',
        rationale: 'Secondary metadata, inactive stage numbers, and subtle tabular headers.',
      },
    },
    palette: [
      {
        name: 'Obsidian Canvas',
        hex: '#0A0D12',
        role: 'background',
        contrastRatio: '18.2:1 against white text',
        usageRule: 'Primary viewport background; establishes a deep, distraction-free nocturnal workspace.'
      },
      {
        name: 'Forged Amber',
        hex: '#F59E0B',
        role: 'accent',
        contrastRatio: '7.8:1 against deep slate',
        usageRule: 'Primary action points, countdown timers, and active match signals (used with 10% budget restraint).'
      },
      {
        name: 'Structural Charcoal',
        hex: '#161B22',
        role: 'surface',
        contrastRatio: '3.4:1 contrast step',
        usageRule: 'Single-elevation card surfaces, hairline framing borders, and input backings.'
      },
      {
        name: 'Signal Emerald',
        hex: '#10B981',
        role: 'secondary',
        contrastRatio: '6.2:1 against dark surfaces',
        usageRule: 'Skill verified badges, complementary match indicators, and online status.'
      },
      {
        name: 'Pure Titanium',
        hex: '#F8FAFC',
        role: 'neutral',
        contrastRatio: '19:1 against obsidian',
        usageRule: 'High-contrast headlines and primary button typography.'
      }
    ],
    typographyDirection: {
      displayFont: 'Space Grotesk',
      bodyFont: 'Plus Jakarta Sans',
      supportingFont: 'JetBrains Mono',
      typographyMood: 'Architectural builder precision paired with effortless collegiate scannability.',
      usageRules: [
        'Display type used for hero wordmarks and major milestone headers with tight tracking (-0.02em).',
        'Body type maintained at 14px–16px with 1.6 line height for fatigue-free reading.',
        'Supporting monospace type reserved for metadata tags, application dates, and match statistics.',
      ],
    },
    typography: [
      {
        role: 'Display & Hero Wordmark',
        family: 'Space Grotesk / Cabinet Grotesk',
        category: 'Modern Editorial Grotesque',
        weight: '600 SemiBold / 700 Bold',
        usage: 'Page titles, brand mark, stage headlines; conveys architectural builder precision.'
      },
      {
        role: 'Body & Strategic Prose',
        family: 'Plus Jakarta Sans',
        category: 'Refined Contemporary Geometric Sans',
        weight: '400 Regular / 500 Medium',
        usage: 'Card descriptions, rationale paragraphs, prompts; ensures effortless scannability.'
      },
      {
        role: 'Data & Telemetry Badges',
        family: 'JetBrains Mono',
        category: 'Tabular Monospace',
        weight: '500 Medium',
        usage: 'Countdown clocks, skill tags, repository stats, stage indicators; enforces tabular alignment.'
      }
    ],
    imageryDirection: {
      photographyStyle: 'Documentary, high-contrast, candid maker photography in real engineering environments.',
      subjectMatter: 'Authentic student builders debating whiteboard diagrams, debugging code on laptops, and soldering breadboards.',
      composition: 'Asymmetric split screens, high-contrast typography, generous whitespace margins.',
      lighting: 'Controlled directional rim lighting with subtle warm amber falloff against cool slate.',
      colorTreatment: 'Desaturated background elements with punchy luminescent screen reflections.',
      humanPresence: 'Candid, collaborative teams absorbed in problem solving—zero posed looks toward the camera.',
      avoidImagery: [
        'Staged stock photography with actors wearing business suits',
        'Floating 3D neon spheres and arbitrary purple gradients',
        'Childish mascot illustrations with oversized bobbleheads',
      ],
    },
    artDirection: {
      mood: 'Focused late-night workshop, collaborative energy, sharp screens illuminating intent faces.',
      composition: 'Asymmetric split screens, high-contrast typography, generous whitespace margins.',
      lighting: 'Controlled directional rim lighting with subtle warm amber falloff against cool slate.',
      imageryRules: [
        'Real authentic student builders over staged stock photography',
        'Show active code editors, Figma wireframes, and whiteboard diagrams',
        'No floating 3D neon spheres or cartoon robots'
      ]
    },
    graphicLanguage: {
      shapes: 'Restrained 8px–12px outer radius with inner radius math (r_inner = r_outer - padding).',
      lineLanguage: '1px hairline dividers with 8% to 15% white opacity (rgba(255,255,255,0.08)).',
      layoutBehavior: 'Compact, information-dense grid with disciplined command-center split views.',
      depth: 'Single-elevation depth with crisp border boundaries rather than heavy blurred drop shadows.',
      motion: 'Crisp 200ms ease-out transitions with zero bouncy or distracting physics.',
      texture: 'Matte obsidian surfaces with micro-grain noise for tactile depth.',
      iconography: 'Monoline 1.5px geometric vector icons aligned on a 24px grid.',
    },
    shapeLanguage: {
      cornerStyle: 'Restrained 8px–12px outer radius with inner radius math (r_inner = r_outer - padding).',
      density: 'Compact, information-dense grid with 1px hairline dividers (rgba(255,255,255,0.08)).',
      framingRules: 'Zero heavy shadows. Single-elevation depth with crisp border boundaries.',
      spatialFeel: 'Editorial command center inspired by Linear and high-end CAD software.'
    },
    logoDirection: {
      concept: 'Integrated Typographic Wordmark with Interlocking Bracket Monogram',
      symbolicIdea: 'The letters "S" and "F" interlock as code syntax braces { } creating an enclosed anvil shape.',
      formLanguage: 'Architectural monoline construction with geometric proportions.',
      construction: 'Works as a compact standalone favicon mark and scales to a balanced wordmark lockup.',
      wordmarkDirection: 'Space Grotesk bold with custom kerning on the "F-o-r-g-e" glyph intersections.',
      avoid: ['Literal anvils and heavy hammers', 'Generic puzzle piece icons', 'Arbitrary abstract flame graphics'],
    },
    logoConcept: {
      markType: 'Integrated Typographic Wordmark with Interlocking Bracket Monogram',
      description: 'The letters "S" and "F" interlock as code syntax braces { } creating an enclosed anvil shape.',
      symbolism: 'Represents disparate individuals coming together within a structured container to forge an idea.',
      clearspaceRule: 'Maintain 1.5x the height of the capital "S" around all four perimeters.'
    },
    uiDirection: {
      interfaceMood: 'Focused late-night engineering atelier with immediate response speeds.',
      layoutPrinciples: 'Split view canvas pairing spatial identity direction with actionable token palettes.',
      cardBehavior: 'Hairline bordered cards that lift subtly (+1px translateY) on pointer hover.',
      navigationBehavior: 'Persistent chapter breadcrumbs with directional next-stage triggers.',
      interactionStyle: 'Tactile, high-contrast click feedback with immediate keyboard accessibility.',
      motionPrinciples: 'Restrained 150ms state changes that preserve builder flow.',
    },
    doRules: [
      'Use deep obsidian canvas to reduce nocturnal eye fatigue',
      'Reserve amber accent strictly for high-urgency countdowns and active match CTAs',
      'Feature authentic maker environments with real code and wireframes',
      'Maintain tabular monospace alignment for numbers and countdown clocks',
    ],
    dontRules: [
      'Use overused purple-to-cyan gradient meshes',
      'Feature smiling corporate stock models in business suits',
      'Use floating glassmorphism bubbles with excessive backdrop-blur',
      'Clutter interface with cartoon mascot illustrations',
    ],
    avoidVisuals: [
      'Overused purple-to-cyan gradient meshes',
      'Childish mascot illustrations with oversized heads',
      'Floating glassmorphism bubbles with excessive backdrop-blur',
      'Cluttered sticker-bomb aesthetics that overwhelm scannability',
    ],
    thingsToAvoid: [
      'Overused purple-to-cyan gradient meshes',
      'Childish mascot illustrations with oversized heads',
      'Floating glassmorphism bubbles with excessive backdrop-blur',
      'Cluttered sticker-bomb aesthetics that overwhelm scannability'
    ],
    isConfirmed: true
  },
  challenge: {
    findings: [
      {
        id: 'crit-1',
        category: 'POSITIONING',
        severity: 'high',
        status: 'WARNING',
        title: 'Value Proposition Mechanism Dilution',
        finding: 'Initial draft copy used "AI-powered teammate platform for everyone" in preliminary description.',
        evidence: 'Draft claims "AI-powered teammate platform for everyone" instead of concrete skill-squad matchmaking mechanism.',
        whyItMatters: '"AI-powered" highlights the back-end mechanism rather than the student outcome, while "everyone" dilutes the acute pain of hackathon teams.',
        suggestedFix: 'Replace with: "The squad formation engine that turns solitary student builders into balanced, podium-ready hackathon teams."',
        suggestedImprovement: 'The squad formation engine that turns solitary student builders into balanced, podium-ready hackathon teams.',
        proposedChange: {
          targetStage: 'positioning',
          field: 'positioningStatement',
          currentValue: 'SprintForge is an AI-powered teammate platform for everyone.',
          proposedValue: 'SprintForge is the squad formation engine that turns solitary student builders into balanced, podium-ready hackathon teams.',
          rationale: 'Anchors the promise on the 36-hour podium outcome rather than generic AI tech.'
        },
        accepted: true,
        findingStatus: 'accepted',
        stageTarget: 'position',
        affectedStages: ['positioning']
      },
      {
        id: 'crit-2',
        category: 'AUDIENCE FIT',
        severity: 'critical',
        status: 'CONFLICT',
        title: 'Engineer-Biased Telemetry Alienates Designers',
        finding: 'Heavy focus on GitHub commit stats threatens to alienate essential non-engineering roles (UI/UX designers, product pitch leads).',
        evidence: 'Discovery userContext and current alternatives focus disproportionately on code repos while ignoring visual Figma portfolios.',
        whyItMatters: 'Hackathon-winning projects win on design and product presentation just as much as backend code. If designers feel excluded, teams remain one-dimensional.',
        suggestedFix: 'Introduce dual portfolio verification: Figma link & Dribbble showcase for designers alongside GitHub for engineers.',
        suggestedImprovement: 'Introduce dual portfolio verification: Figma link & Dribbble showcase for designers alongside GitHub for engineers.',
        proposedChange: {
          targetStage: 'discovery',
          field: 'primaryAudience',
          currentValue: 'Collegiate software developers entering competitive hackathons.',
          proposedValue: 'Ambitious student developers, UI/UX designers, and product creators forming hackathon teams.',
          rationale: 'Explicitly broadens audience to multidisciplinary creators required for winning teams.'
        },
        accepted: true,
        findingStatus: 'accepted',
        stageTarget: 'discover',
        affectedStages: ['discovery']
      },
      {
        id: 'crit-3',
        category: 'POSITIONING',
        severity: 'low',
        status: 'PASS',
        title: 'Crisp Competitive Boundary',
        finding: 'Clear distinction from generic professional networks like LinkedIn or dead Discord channels.',
        evidence: 'Positioning explicitly rejects long-term corporate recruiting to focus exclusively on 36-hour event windows.',
        whyItMatters: 'Focusing squarely on time-boxed 36-hour weekend competitions gives an immediate reason to adopt this Friday night.',
        suggestedFix: 'Maintain this tight boundary; resist expanding to full-time recruiting until hackathon retention is proven.',
        suggestedImprovement: 'Maintain this tight boundary; resist expanding to full-time recruiting until hackathon retention is proven.',
        accepted: false,
        findingStatus: 'open',
        stageTarget: 'position',
        affectedStages: ['positioning']
      },
      {
        id: 'crit-4',
        category: 'NAME',
        severity: 'low',
        status: 'PASS',
        title: 'High Mnemonic Recall and Tone Fit',
        finding: '"SprintForge" delivers high visual recall and clearly communicates speed and craftsmanship without feeling childish.',
        evidence: 'Name candidate c-4 combines "Sprint" (urgency) with "Forge" (craftsmanship under pressure).',
        whyItMatters: 'Carries respect both in a dorm room and when presenting to venture sponsors at the award ceremony.',
        suggestedFix: 'Lock in SprintForge.dev and preserve clean single-color iconography on dark backgrounds.',
        suggestedImprovement: 'Lock in SprintForge.dev and preserve clean single-color iconography on dark backgrounds.',
        accepted: false,
        findingStatus: 'open',
        stageTarget: 'naming',
        affectedStages: ['naming']
      },
      {
        id: 'crit-5',
        category: 'VOICE',
        severity: 'medium',
        status: 'WARNING',
        title: 'Hyper-Aggressive Posturing Risks Intimidation',
        finding: 'Early copy risked sounding slightly too aggressive ("Crush the competition at any cost").',
        evidence: 'Writing samples included combative battle rhetoric that clashes with collegiate camaraderie.',
        whyItMatters: 'Intimidates first-year students and underrepresented groups entering their first hackathon.',
        suggestedFix: 'Shift from hyper-aggressive posturing to collaborative confidence: "From solo brainstorm to podium-ready squad."',
        suggestedImprovement: 'Shift from hyper-aggressive posturing to collaborative confidence: "From solo brainstorm to podium-ready squad."',
        proposedChange: {
          targetStage: 'personality',
          field: 'voiceSummary',
          currentValue: 'Hyper-competitive, aggressive builder energy designed to dominate hackathon tracks.',
          proposedValue: 'Electric, high-urgency, and relentlessly supportive—speaking with the direct camaraderie of an elite late-night sprint teammate.',
          rationale: 'Preserves high energy while eliminating exclusionary militaristic posturing.'
        },
        accepted: true,
        findingStatus: 'accepted',
        stageTarget: 'personality',
        affectedStages: ['personality']
      },
      {
        id: 'crit-6',
        category: 'VISUAL DIRECTION',
        severity: 'medium',
        status: 'WARNING',
        title: 'Ambient Contrast Hazard in Bright Venues',
        finding: 'Extreme dark obsidian canvas (#0B0C0E) may suffer legibility drop-off under high-glare university auditorium lighting.',
        evidence: 'Color system relies on deep obsidian background with subtle surface cards that need calibrated ambient contrast.',
        whyItMatters: 'Hackathon participants pitch from dimly lit stages or brightly lit exhibition gyms where subtle borders disappear.',
        suggestedFix: 'Introduce a calibrated high-contrast card border token (rgba(255,255,255,0.14)) to ensure structural integrity across projector displays.',
        suggestedImprovement: 'Introduce a calibrated high-contrast card border token (rgba(255,255,255,0.14)) to ensure structural integrity across projector displays.',
        proposedChange: {
          targetStage: 'visualize',
          field: 'visualThesis',
          currentValue: 'A dark, moody engineering bay.',
          proposedValue: 'A tactile, high-contrast engineering atelier engineered for crisp visibility on both laptop screens and auditorium projectors.',
          rationale: 'Guarantees projector and high-ambient legibility without abandoning the night-mode aesthetic.'
        },
        accepted: false,
        findingStatus: 'open',
        stageTarget: 'visualize',
        affectedStages: ['visualize']
      },
      {
        id: 'crit-7',
        category: 'CONSISTENCY',
        severity: 'low',
        status: 'PASS',
        title: 'Cross-Stage Architectural Coherence',
        finding: 'Strong alignment across the entire chain: collegiate problem -> rapid sprint positioning -> energetic amber visual palette.',
        evidence: 'Discovery friction points cleanly map into the 3-minute matchmaking proposition and monospace telemetry tokens.',
        whyItMatters: 'Every touchpoint reinforces urgency, craftsmanship, and peer-to-peer trust.',
        suggestedFix: 'Keep launch copy directly tied to the 48-hour pre-event window.',
        suggestedImprovement: 'Keep launch copy directly tied to the 48-hour pre-event window.',
        accepted: false,
        findingStatus: 'open',
        stageTarget: 'launch',
        affectedStages: ['positioning', 'personality', 'visualize', 'launch']
      }
    ],
    consistencySummary: {
      overallState: 'Robust & Coherent',
      strengthsCount: 3,
      warningsCount: 3,
      conflictsCount: 1,
      editorialAssessment:
        'The brand demonstrates exceptional strategic alignment. The critical tension between developer and designer parity has been resolved through multi-format portfolio validation. Brand language is crisp, direct, and avoids generic AI clichés.'
    },
    isConfirmed: true
  },
  launch: {
    headline: 'Stop building hackathon projects alone.',
    subheadline: 'SprintForge pairs ambitious student developers, designers, and creators into podium-ready teams before the opening ceremony.',
    oneLinePitch: 'The squad formation engine that turns solitary college hackers into balanced, championship-ready teams in under 10 minutes.',
    productDescription:
      'SprintForge replaces chaotic Discord threads with intelligent skill-sync matching. Specify your role, your target hackathon prize track, and your working style. In minutes, discover complementary teammates who match your ambition, verify their portfolios, and lock in your weekend squad with zero awkwardness.',
    primaryCta: 'Find your squad in 3 minutes',
    secondaryCta: 'Bring SprintForge to your hackathon',
    launchAnnouncement:
      'We have all been there: it is Friday 7:00 PM at a hackathon, and you are desperately scrolling a 1,200-message Discord channel trying to find a teammate who actually knows CSS. Today, we are launching SprintForge to kill the chaotic team search forever. Form your dream squad based on real skills, complementary roles, and shared goals.',
    socialPost: {
      platform: 'X / LinkedIn',
      text: 'Solo at a hackathon? 40% of solo projects never reach the submission booth.\n\nIntroducing SprintForge: connect with complementary devs and designers based on verified skills and real ambition in under 10 minutes.\n\nNo dead Discord threads. No awkward ghosting. Just podium-ready squads.\n\n👉 sprintforge.dev'
    },
    whyThisMessagingWorks:
      'The copy leads directly with the shared trauma of the target audience (chaotic Friday night Discord channels) rather than abstract features. It establishes immediate peer credibility by validating both developers and designers, then closes with a frictionless time commitment ("in under 10 minutes").',
    isConfirmed: true
  }
};
