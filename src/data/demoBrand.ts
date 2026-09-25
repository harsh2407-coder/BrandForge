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
        whyItFits: 'Students often suffer from imposter syndrome when approaching unfamiliar or senior peers.',
        evidence: 'User interviews indicate 42% of first-timers do not reach out because they fear being judged as "not technical enough".'
      },
      {
        name: 'Momentum-Driven',
        whyItFits: 'Hackathons operate on tight countdowns; every minute spent deliberating is code unwritten.',
        evidence: 'The product experience must feel rapid, energetic, and focused on bias-for-action.'
      },
      {
        name: 'Pragmatic & Honest',
        whyItFits: 'Developers hate corporate fluff and empty networking buzzwords.',
        evidence: 'Students respond to direct statements about stack compatibility, timezones, and sleep schedules.'
      },
      {
        name: 'Inclusive & Welcoming',
        whyItFits: 'Cross-functional teams need non-traditional tech disciplines like design, copy, and hardware.',
        evidence: 'Solo designers frequently feel sidelined in Discord channels dominated by backend engineers.'
      }
    ],
    traitsToAvoid: [
      {
        trait: 'Corporate / Stuffy',
        reason: 'Feels like an HR enterprise compliance tool rather than a vibrant collegiate sprint environment.'
      },
      {
        trait: 'Gamer / Hyper-Neon Chaos',
        reason: 'Dilutes seriousness for participants aiming for venture prizes, sponsor hiring, and portfolio work.'
      },
      {
        trait: 'Overly Academic',
        reason: 'Slows down the emotional momentum and creates friction with intimidating jargon.'
      }
    ],
    principles: [
      'Match on complementary strengths, never redundant duplicates.',
      'Respect the clock: zero wasted clicks when the submission timer is ticking.',
      'Democratize access: first-time participants get equal visibility alongside experienced champions.',
      'Radical commitment clarity: state upfront whether you are aiming for Grand Prize or just learning.'
    ],
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
    territories: [
      {
        id: 't-1',
        number: '01',
        name: 'CONNECTION & SQUAD',
        theme: 'Names grounded in human chemistry, alignment, and complementary partnerships.',
        rationale: 'Highlights the human element and removes the coldness of transactional networking.',
        candidates: [
          {
            id: 'c-1',
            name: 'Kithack',
            meaning: 'Kit (gear & readiness) + Kin/Kit (community of makers).',
            strategicRationale: 'Friendly, memorable, and sounds like essential equipment for hackathons.',
            personalityFit: 'High warmth, highly accessible.',
            potentialWeakness: 'Might sound too lightweight or like a toy toolkit.'
          },
          {
            id: 'c-2',
            name: 'TandemBuild',
            meaning: 'Working in seamless synchronicity toward a shared goal.',
            strategicRationale: 'Directly implies pairs and balanced teammates pedaling together.',
            personalityFit: 'Pragmatic and reliable.',
            potentialWeakness: 'Implies only 2-person teams rather than 4-person squads.'
          },
          {
            id: 'c-3',
            name: 'SyncSquad',
            meaning: 'Synchronized coordination for competitive teams.',
            strategicRationale: 'Immediate clarity on what the app delivers.',
            personalityFit: 'Modern, energetic, collegiate.',
            potentialWeakness: 'Somewhat literal and generic in crowded EdTech spaces.'
          }
        ]
      },
      {
        id: 't-2',
        number: '02',
        name: 'BUILDER MOMENTUM',
        theme: 'Names radiating craftsmanship, rapid prototyping, and shipping under pressure.',
        rationale: 'Appeals directly to the pride of builders who stay up all night to see their demo execute.',
        candidates: [
          {
            id: 'c-4',
            name: 'SprintForge',
            meaning: 'Sprint (rapid hackathon intensity) + Forge (shaping enduring ideas under heat).',
            strategicRationale: 'Combines the urgency of a weekend with the craftsmanship of an elite build team.',
            personalityFit: 'Bold, gritty, high-agency, professional yet exciting.',
            potentialWeakness: 'Forge is an active root word used across dev tooling.',
            availabilityHint: 'SprintForge.dev / SprintForge.app'
          },
          {
            id: 'c-5',
            name: 'ShiftBuild',
            meaning: 'Shifting gears from solo concept to collaborative execution.',
            strategicRationale: 'Clean, modern software brand cadence.',
            personalityFit: 'Crisp and focused.',
            potentialWeakness: 'Sounds slightly like a DevOps continuous deployment CI/CD tool.'
          },
          {
            id: 'c-6',
            name: 'CrewSpark',
            meaning: 'The ignition moment where strangers coalesce into an inspired crew.',
            strategicRationale: 'Warm, youthful, and immediately memorable.',
            personalityFit: 'Highly encouraging and accessible.',
            potentialWeakness: 'Slightly less weight for serious upperclassmen.'
          }
        ]
      },
      {
        id: 't-3',
        number: '03',
        name: 'TACTICAL DISCOVERY',
        theme: 'Names focused on scouting, roster assembly, and podium-readiness.',
        rationale: 'Positions the tool as an unfair tactical advantage for ambitious competitors.',
        candidates: [
          {
            id: 'c-7',
            name: 'RosterLab',
            meaning: 'The laboratory where tournament-winning rosters are formulated.',
            strategicRationale: 'Sounds analytical, structured, and goal-oriented.',
            personalityFit: 'Analytical and competitive.',
            potentialWeakness: 'Can feel overly clinical for creative design participants.'
          },
          {
            id: 'c-8',
            name: 'Foundry5',
            meaning: 'The foundry where up to five minds fuse into one product.',
            strategicRationale: 'Strong architectural resonance.',
            personalityFit: 'Industrial and elite.',
            potentialWeakness: 'The number 5 limits perception if hackathon team caps vary.'
          },
          {
            id: 'c-9',
            name: 'PodiumDraft',
            meaning: 'Drafting teammates with the clear target of winning the podium.',
            strategicRationale: 'Direct alignment with hackathon competitive ambition.',
            personalityFit: 'Very high energy, competitive.',
            potentialWeakness: 'May alienate casual beginners who just want to learn.'
          }
        ]
      }
    ],
    selectedNameId: 'c-4',
    selectedName: {
      id: 'c-4',
      name: 'SprintForge',
      meaning: 'Sprint (rapid hackathon intensity) + Forge (shaping enduring ideas under heat).',
      strategicRationale: 'Combines the urgency of a weekend with the craftsmanship of an elite build team.',
      personalityFit: 'Bold, gritty, high-agency, professional yet exciting.',
      potentialWeakness: 'Forge is an active root word used across dev tooling.',
      availabilityHint: 'SprintForge.dev / SprintForge.app'
    },
    selectionRationale:
      'SprintForge strikes the exact balance between rapid weekend execution and enduring pride of craft. It honors the 36-hour sprint while framing teammate formation as the foundational step of forging a real product.',
    isConfirmed: true
  },
  visual: {
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
    shapeLanguage: {
      cornerStyle: 'Restrained 8px–12px outer radius with inner radius math (r_inner = r_outer - padding).',
      density: 'Compact, information-dense grid with 1px hairline dividers (rgba(255,255,255,0.08)).',
      framingRules: 'Zero heavy shadows. Single-elevation depth with crisp border boundaries.',
      spatialFeel: 'Editorial command center inspired by Linear and high-end CAD software.'
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
    logoConcept: {
      markType: 'Integrated Typographic Wordmark with Interlocking Bracket Monogram',
      description: 'The letters "S" and "F" interlock as code syntax braces { } creating an enclosed anvil shape.',
      symbolism: 'Represents disparate individuals coming together within a structured container to forge an idea.',
      clearspaceRule: 'Maintain 1.5x the height of the capital "S" around all four perimeters.'
    },
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
        category: 'GENERIC LANGUAGE',
        status: 'WARNING',
        finding: 'Initial draft copy used "AI-powered teammate platform for everyone" in preliminary description.',
        whyItMatters: '"AI-powered" highlights the back-end mechanism rather than the student outcome, while "everyone" dilutes the acute pain of hackathon teams.',
        suggestedImprovement: 'Replace with: "The squad formation engine that turns solitary student builders into balanced, podium-ready hackathon teams."',
        accepted: true,
        stageTarget: 'position'
      },
      {
        id: 'crit-2',
        category: 'AUDIENCE FIT',
        status: 'CONFLICT',
        finding: 'Heavy focus on GitHub commit stats threatens to alienate essential non-engineering roles (UI/UX designers, product pitch leads).',
        whyItMatters: 'Hackathon-winning projects win on design and product presentation just as much as backend code. If designers feel excluded, teams remain one-dimensional.',
        suggestedImprovement: 'Introduce dual portfolio verification: Figma link & Dribbble showcase for designers alongside GitHub for engineers.',
        accepted: true,
        stageTarget: 'discover'
      },
      {
        id: 'crit-3',
        category: 'POSITIONING',
        status: 'PASS',
        finding: 'Clear distinction from generic professional networks like LinkedIn or dead Discord channels.',
        whyItMatters: 'Focusing squarely on time-boxed 36-hour weekend competitions gives an immediate reason to adopt this Friday night.',
        suggestedImprovement: 'Maintain this tight boundary; resist expanding to full-time recruiting until hackathon retention is proven.',
        accepted: false,
        stageTarget: 'position'
      },
      {
        id: 'crit-4',
        category: 'NAME',
        status: 'PASS',
        finding: '"SprintForge" delivers high visual recall and clearly communicates speed and craftsmanship without feeling childish.',
        whyItMatters: 'Carries respect both in a dorm room and when presenting to venture sponsors at the award ceremony.',
        suggestedImprovement: 'Lock in SprintForge.dev and preserve clean single-color iconography on dark backgrounds.',
        accepted: false,
        stageTarget: 'naming'
      },
      {
        id: 'crit-5',
        category: 'VOICE',
        status: 'WARNING',
        finding: 'Early copy risked sounding slightly too aggressive ("Crush the competition at any cost").',
        whyItMatters: 'Intimidates first-year students and underrepresented groups entering their first hackathon.',
        suggestedImprovement: 'Shift from hyper-aggressive posturing to collaborative confidence: "From solo brainstorm to podium-ready squad."',
        accepted: true,
        stageTarget: 'personality'
      },
      {
        id: 'crit-6',
        category: 'CONSISTENCY',
        status: 'PASS',
        finding: 'Strong alignment across the entire chain: collegiate problem -> rapid sprint positioning -> energetic amber visual palette.',
        whyItMatters: 'Every touchpoint reinforces urgency, craftsmanship, and peer-to-peer trust.',
        suggestedImprovement: 'Keep launch copy directly tied to the 48-hour pre-event window.',
        accepted: false,
        stageTarget: 'launch'
      }
    ],
    consistencySummary: {
      overallState: 'Robust & Coherent',
      strengthsCount: 3,
      warningsCount: 2,
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
