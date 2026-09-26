import fs from 'fs';
import { assembleDeliverData } from '../src/utils/deliverAssembly.js';
import type { BrandMemory } from '../src/types/brand.js';

async function verifyDeliverE2E() {
  console.log('=====================================================');
  console.log('STEP 8: DELIVER - REAL END-TO-END VERIFICATION');
  console.log('=====================================================\n');

  // 1. Load accumulated Steps 1-7 artifacts
  const namingJson = JSON.parse(fs.readFileSync('C:/Users/sharm/.gemini/antigravity-ide/brain/1cc0f1f4-5b2e-43a7-a72b-11510b754cf9/scratch/naming_response.json', 'utf8'));
  const visualJson = JSON.parse(fs.readFileSync('C:/Users/sharm/.gemini/antigravity-ide/brain/1cc0f1f4-5b2e-43a7-a72b-11510b754cf9/scratch/visualize_response.json', 'utf8'));
  const challengeJson = JSON.parse(fs.readFileSync('C:/Users/sharm/.gemini/antigravity-ide/brain/1cc0f1f4-5b2e-43a7-a72b-11510b754cf9/scratch/challenge_response.json', 'utf8'));

  // 2. Build the live BrandMemory with the human-accepted Challenge finding F001 applied
  const findings = challengeJson.data.findings.map((f: any) => {
    if (f.id === 'F001') {
      return {
        ...f,
        accepted: true,
        findingStatus: 'accepted'
      };
    }
    return f;
  });

  const liveMemory: BrandMemory = {
    id: 'live-scholar-compass-session',
    projectName: 'ScholarCompass',
    roughIdea: 'An online platform that helps college students discover scholarships, fellowships, and grants they are eligible for.',
    knownDetails: 'College students need scholarships and grants.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: 'launch',
    stagesCompleted: ['discover', 'position', 'personality', 'naming', 'visualize', 'challenge', 'launch'],
    discovery: {
      coreProblem: "Students face a fragmented, opaque landscape of scholarships where eligibility criteria are hidden, information is scattered across dozens of sites, and the time required to identify suitable awards is prohibitive, leading to missed funding opportunities.",
      primaryAudience: "college students",
      userContext: "When a student receives a tuition bill or learns about upcoming application deadlines and needs to quickly identify funding sources that match their academic record, major, and personal background.",
      currentAlternatives: [
        "Google search for scholarships",
        "University financial aid office listings",
        "Third‑party scholarship aggregator sites (e.g., Fastweb, Chegg Scholarships)",
        "Word‑of‑mouth lists shared in student groups",
        "Social media posts and forums"
      ],
      coreNeed: "A fast, trustworthy, personalized discovery experience that surfaces only the scholarships they truly qualify for, minimizing search effort and uncertainty.",
      assumptions: [
        { id: 'asm-1', statement: 'College students will actively seek a single platform for scholarship discovery.', riskLevel: 'high', validationTip: 'Survey 100 students.' }
      ],
      openQuestions: [
        { id: 'q-1', question: 'What unique value proposition can you deliver that existing scholarship aggregators cannot?', strategicWhy: 'Defines defensibility.' }
      ],
      isConfirmed: true
    },
    positioning: {
      category: "Personalized Scholarship and Grant Discovery Platform",
      targetSegment: "College students (undergraduate and graduate) actively seeking financial aid, scholarships, fellowships, and grants to offset tuition and living costs.",
      // Human-accepted Challenge correction applied:
      valueProposition: "A guided, high‑confidence match experience that currently curates scholarship listings and will soon add eligibility‑focused filtering to deliver even more relevant matches.",
      differentiator: "A curated matching approach that combines extensive scholarship listings with targeted eligibility filtering (future capability), transparent match criteria, and student‑centric application tracking.",
      positioningStatement: "For college students who need to quickly identify funding opportunities, ScholarCompass is a personalized scholarship discovery platform that surfaces relevant, eligibility‑focused awards because it proposes a curated matching approach that combines extensive scholarship listings with targeted eligibility filtering.",
      whyThisPosition: "Positions as a transparent navigator in an opaque market.",
      primaryDifferentiation: "A curated matching approach that combines extensive scholarship listings with targeted eligibility filtering.",
      keyPillars: [
        "Curated, comprehensive database of scholarships, fellowships, and grants",
        "Eligibility‑focused filtering (future capability) to increase relevance",
        "Transparent match criteria explaining why an award fits",
        "Application workflow guidance and deadline tracking"
      ],
      isConfirmed: true
    },
    personality: {
      traits: [
        { name: "Pragmatic Rigor", whyItFits: "Students face high financial stress and need reliable, no-nonsense guidance.", evidence: "Clear criteria presentation." },
        { name: "Guarded Empathy", whyItFits: "Understanding student financial anxiety without becoming saccharine or patronizing.", evidence: "Respectful, transparent communication." },
        { name: "Selective Clarity", whyItFits: "Surfaces only relevant details to avoid cognitive overload.", evidence: "Clean match lists." },
        { name: "Focused Confidence", whyItFits: "Instills agency during stressful funding search.", evidence: "Encouraging next-step cues." }
      ],
      traitsToAvoid: [
        { trait: "Overpromising Hype", reason: "Never promise guaranteed funding or instant money." },
        { trait: "Corporate Bureaucracy", reason: "Avoid dense administrative jargon that mimics confusing financial aid forms." }
      ],
      principles: [
        "Honesty over hype: never imply guaranteed qualification.",
        "Precision before volume: a short, relevant list beats thousands of mismatched awards.",
        "Zero hidden fees: maintain complete transparency regarding platform operations."
      ],
      voiceSummary: "Pragmatic, direct, clear, and reassuring—like a knowledgeable financial aid counselor who respects your time.",
      voiceAndTone: {
        tone: "Pragmatic, direct, clear, and reassuring",
        voiceCharacteristics: ["Direct", "Transparent", "Empowering"],
        writingSampleDo: "Here are 4 scholarships you match with based on your major and academic year.",
        writingSampleDont: "Unlock millions in free government money instantly with zero effort!"
      },
      isConfirmed: true
    },
    naming: namingJson.data,
    visual: visualJson.data,
    challenge: {
      findings,
      consistencySummary: challengeJson.data.consistencySummary,
      isConfirmed: true
    },
    launch: {
      headline: "Stop scrolling through thousands of scholarships you don't qualify for.",
      subheadline: "ScholarCompass brings quiet clarity to funding discovery, curating vetted opportunities for college students.",
      oneLinePitch: "A guided, high-confidence scholarship discovery platform built for college students navigating tuition costs.",
      productDescription: "ScholarCompass organizes the chaotic scholarship landscape into structured, high-probability matches with transparent criteria and deadline guidance.",
      primaryCta: "Find your matches",
      secondaryCta: "Explore directory",
      launchAnnouncement: "Today we are introducing ScholarCompass to end the confusion of finding college funding.",
      socialPost: {
        platform: "X / LinkedIn",
        text: "Finding college scholarships shouldn't be harder than applying for college.\n\nIntroducing ScholarCompass: clear, curated scholarship discovery.\n\n👉 scholarcompass.edu"
      },
      whyThisMessagingWorks: "Speaks directly to the student frustration with scattered and misleading scholarship sites.",
      isConfirmed: true
    }
  };

  // 3. Assemble Deliver Data deterministically
  console.log('--- Step A: Assembling Deliver Data from Live BrandMemory ---');
  const deliverData = assembleDeliverData(liveMemory);

  console.log('Brand Name:', deliverData.brandName);
  console.log('Current Value Proposition (Challenge Corrected):', deliverData.strategicFoundation.valueProposition);
  console.log('Creative Direction:', deliverData.visualIdentity.creativeDirection);
  console.log('Challenge Findings Count:', deliverData.challengeSummary.findingsCount);
  console.log('Challenge Resolved Count:', deliverData.challengeSummary.resolvedCount);
  console.log('Traceability Count:', deliverData.challengeSummary.traceability.length);

  // Assertions on Deliver Data
  if (deliverData.brandName !== 'ScholarCompass') {
    throw new Error(`Expected brandName "ScholarCompass", got "${deliverData.brandName}"`);
  }
  if (!deliverData.strategicFoundation.valueProposition.includes('currently curates scholarship listings and will soon add eligibility‑focused filtering')) {
    throw new Error('Deliver failed to reflect the human-accepted Challenge correction on valueProposition!');
  }
  if (deliverData.challengeSummary.traceability.length !== 1) {
    throw new Error(`Expected 1 traceability item for F001, got ${deliverData.challengeSummary.traceability.length}`);
  }
  const f001Trace = deliverData.challengeSummary.traceability[0];
  console.log('\n--- Challenge Traceability Card for F001 ---');
  console.log('  BEFORE:', f001Trace.beforeValue);
  console.log('  DECISION:', f001Trace.decision);
  console.log('  AFTER:', f001Trace.afterValue);

  // 4. Test Live Groq Gateway Call for Deliver Stage (Exactly ONE live request)
  console.log('\n--- Step B: Performing ONE Live Groq Deliver Request (/api/generate-stage) ---');
  const response = await fetch('http://localhost:3001/api/generate-stage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stage: 'launch',
      brandMemory: liveMemory
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Deliver request failed with status ${response.status}: ${errorText}`);
  }

  const liveGroqDeliver = await response.json();
  console.log('HTTP 200 OK received from Groq Gateway!');
  console.log('Live Groq Generated Headline:', liveGroqDeliver.data?.headline);
  console.log('Live Groq One-Line Pitch:', liveGroqDeliver.data?.oneLinePitch);
  console.log('Live Groq Executive Summary:', liveGroqDeliver.data?.executiveSummary?.slice(0, 150) + '...');
  console.log('Live Groq Brand Essence:', liveGroqDeliver.data?.brandEssence);

  // 5. Generate and save the final Brand Book Markdown artifact
  const brandBookMd = `
# BRANDFORGE BRAND BOOK: ${deliverData.brandName.toUpperCase()}
*A Complete Strategic and Creative System, Built from Your Original Idea*

---

## 1. BRAND ESSENCE & EXECUTIVE SUMMARY

### The Brand Essence
> "${deliverData.brandEssence}"

### Executive Strategic Blueprint
${deliverData.executiveSummary}

---

## 2. STRATEGIC FOUNDATION
- **Category:** ${deliverData.strategicFoundation.positioning ? deliverData.strategicFoundation.positioning.slice(0, 60) : 'Personalized Discovery Platform'}
- **Beachhead Audience:** ${deliverData.strategicFoundation.audience}
- **Root Problem Addressed:** ${deliverData.strategicFoundation.problem}
- **Core Unmet Need:** ${deliverData.strategicFoundation.need}

### Positioning Statement
> "${deliverData.strategicFoundation.positioning}"

### Value Proposition (Post-Challenge Approved Formulation)
> "${deliverData.strategicFoundation.valueProposition}"

**Operational Moat:** ${deliverData.strategicFoundation.differentiation}

---

## 3. PERSONALITY & VOICE HEURISTICS

### Core Personality Traits
${deliverData.personality.traits.map(t => `- **${t.name}:** ${t.whyItFits}`).join('\n')}

### Explicitly Banned Traits
${deliverData.personality.avoidTraits.map(a => `- **${a.trait || a.name}:** ${a.reason || a.reasonToAvoid}`).join('\n')}

### Non-Negotiable Brand Principles
${deliverData.personality.principles.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Voice & Tone Architecture
- **Voice Summary:** ${deliverData.personality.voiceSummary}
- **Writing Heuristic (DO):** "${deliverData.messaging.toneExamples.do}"
- **Writing Heuristic (AVOID):** "${deliverData.messaging.toneExamples.avoid}"

---

## 4. THE NAME
- **Official Wordmark:** **${deliverData.naming.selectedName}**
- **Strategic Territory:** ${deliverData.naming.namingWorld || 'Guided Compass'}
- **Rationale:** ${deliverData.naming.rationale}
- **Grounding Note:** Official trademark registration and domain acquisition must be conducted through external registries.

---

## 5. VISUAL IDENTITY & BRAND BOARD
- **Creative Direction Concept:** ${deliverData.visualIdentity.creativeDirection}
- **Visual Thesis:** ${deliverData.visualIdentity.visualThesis}
- **Mood Keywords:** ${deliverData.visualIdentity.moodKeywords.join(' · ')}

### 7-Role Color Palette
${deliverData.visualIdentity.colors.map(c => `- **${c.name}** (\`${c.hex}\`): ${c.role}`).join('\n')}

### Typography Specimens
${deliverData.visualIdentity.typography.map(t => `- **${t.role}:** \`${t.family}\` (${t.usage})`).join('\n')}

---

## 6. LAUNCH MESSAGING SYSTEM
- **Primary Conversion Headline:** "${deliverData.messaging.headline}"
- **Subheadline:** "${deliverData.messaging.subheadline}"
- **One-Line Pitch:** "${deliverData.messaging.oneLinePitch}"
- **Primary CTA:** [${deliverData.messaging.primaryCta}]
- **Secondary CTA:** [${deliverData.messaging.secondaryCta}]

### Core Product Description
${deliverData.messaging.productDescription}

### Social Distribution Post (${deliverData.messaging.socialPost.platform})
\`\`\`
${deliverData.messaging.socialPost.text}
\`\`\`

### Founder Launch Announcement Letter
${deliverData.messaging.launchAnnouncement}

---

## 7. WHAT WE CHALLENGED (TRACEABILITY)
- **Coherence State:** ${deliverData.challengeSummary.consistencyState}
- **Findings Surfaced:** ${deliverData.challengeSummary.findingsCount}
- **Corrections Accepted & Applied:** ${deliverData.challengeSummary.resolvedCount}
- **Considerations Open:** ${deliverData.challengeSummary.openCount}

### Accepted Strategic Transformations
${deliverData.challengeSummary.traceability.map(t => `
#### ${t.title} (\`${t.targetStage}.${t.field}\`)
- **BEFORE:** "${t.beforeValue}"
- **DECISION:** ${t.decision}
- **AFTER:** "${t.afterValue}"
`).join('\n')}

---

## 8. FOUNDER LAUNCH CHECKLIST
${deliverData.launchChecklist.map(c => `- [${c.isCompleted ? 'X' : ' '}] **(${c.category})** ${c.label}: ${c.description}`).join('\n')}

---
*Compiled by BrandForge Creative Intelligence Studio · Step 8 Deliver Verified*
  `.trim();

  fs.writeFileSync('C:/Users/sharm/.gemini/antigravity-ide/brain/1cc0f1f4-5b2e-43a7-a72b-11510b754cf9/scratch/scholarcompass_brand_book.md', brandBookMd, 'utf8');
  console.log('\nBrand Book markdown artifact generated successfully at scratch/scholarcompass_brand_book.md!');

  console.log('\n=====================================================');
  console.log('STEP 8 DELIVER VERIFICATION: SUCCESS');
  console.log('=====================================================');
}

verifyDeliverE2E().catch(err => {
  console.error('End-to-End Deliver Verification failed:', err);
  process.exit(1);
});
