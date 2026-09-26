import fs from 'fs';

async function run() {
  const namingJson = JSON.parse(fs.readFileSync('C:/Users/sharm/.gemini/antigravity-ide/brain/1cc0f1f4-5b2e-43a7-a72b-11510b754cf9/scratch/naming_response.json', 'utf8'));
  const visualJson = JSON.parse(fs.readFileSync('C:/Users/sharm/.gemini/antigravity-ide/brain/1cc0f1f4-5b2e-43a7-a72b-11510b754cf9/scratch/visualize_response.json', 'utf8'));

  const payload = {
    stage: 'challenge',
    brandMemory: {
      roughIdea: 'An online platform that helps college students discover scholarships, fellowships, and grants they are eligible for.',
      projectName: namingJson.data.selectedName?.name || 'ScholarCompass',
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
          {
            id: "asm-1",
            statement: "College students will actively seek a single platform for scholarship discovery rather than using multiple existing sites.",
            riskLevel: "high",
            validationTip: "Run a 48‑hour on‑campus survey with at least 100 students asking which tool they would prefer for scholarship search."
          },
          {
            id: "asm-2",
            statement: "The platform can obtain accurate, up‑to‑date eligibility data for thousands of scholarships.",
            riskLevel: "high",
            validationTip: "Contact 5 scholarship providers today and secure a data feed or API access within 48 hours."
          },
          {
            id: "asm-3",
            statement: "Students are willing to share personal academic and demographic data to receive personalized matches.",
            riskLevel: "medium",
            validationTip: "Deploy a low‑fidelity prototype sign‑up flow and measure consent rate in a 48‑hour pilot with a small student cohort."
          },
          {
            id: "asm-4",
            statement: "Monetization through affiliate commissions or premium features will be sufficient to sustain the business.",
            riskLevel: "medium",
            validationTip: "Interview 10 campus financial‑aid officers and 10 students within 48 hours about willingness to pay for premium scholarship insights."
          }
        ],
        openQuestions: [
          {
            id: "q-1",
            question: "What unique value proposition can you deliver that existing scholarship aggregators cannot?",
            strategicWhy: "Defines defensibility and differentiation essential for brand positioning."
          },
          {
            id: "q-2",
            question: "How will you ensure data freshness and accuracy at scale?",
            strategicWhy: "Trust and retention hinge on up‑to‑date eligibility information."
          },
          {
            id: "q-3",
            question: "Which distribution channels will reach college students at the moment they are most motivated to apply?",
            strategicWhy: "Optimizes acquisition cost and timing for maximum impact."
          },
          {
            id: "q-4",
            question: "What regulatory or privacy constraints affect collecting student data for personalized matching?",
            strategicWhy: "Legal risk and brand trust depend on compliant data practices."
          }
        ],
        isConfirmed: false
      },
      positioning: {
        category: "Personalized Scholarship Discovery Platform",
        targetSegment: "College students seeking a fast, trustworthy, and personalized way to find scholarships, fellowships, and grants",
        valueProposition: "A guided, high‑confidence match experience that narrows thousands of scholarships to a short list of awards students are most likely to qualify for and supports them through key application steps",
        differentiator: "A curated eligibility‑focused matching layer that filters scholarships to a concise, high‑confidence list—a capability not offered by generic aggregators",
        primaryDifferentiation: "A curated eligibility‑focused matching layer that filters scholarships to a concise, high‑confidence list—a capability not offered by generic aggregators",
        positioningStatement: "For college students who need to quickly identify funding opportunities, ScholarGuide is a personalized scholarship discovery platform that surfaces relevant, eligibility‑focused awards because it proposes a curated matching approach that combines extensive scholarship listings with targeted eligibility filtering.",
        whyThisPosition: "Students struggle with fragmented, opaque scholarship information and hidden eligibility criteria. By choosing a guided, trust‑oriented territory, ScholarGuide directly addresses the core need for a fast, reliable, and personalized discovery experience, outflanking current alternatives that either overwhelm with volume or lack confidence. This position balances the essential trade‑off of higher development effort with the strategic advantage of building a defensible, high‑trust brand that students will prefer when deadlines loom.",
        positioningRationale: "Students struggle with fragmented, opaque scholarship information and hidden eligibility criteria. By choosing a guided, trust‑oriented territory, ScholarGuide directly addresses the core need for a fast, reliable, and personalized discovery experience, outflanking current alternatives that either overwhelm with volume or lack confidence. This position balances the essential trade‑off of higher development effort with the strategic advantage of building a defensible, high‑trust brand that students will prefer when deadlines loom.",
        selectedTerritoryId: "territory-2",
        territories: [
          {
            id: "territory-1",
            name: "Fast Self‑Serve Explorer",
            quadrant: "SELF‑SERVE / SPEED",
            description: "Leverages publicly available scholarship listings and simple keyword filters, allowing students to instantly browse a broad catalog of awards without any personalized guidance.",
            x: 20,
            y: 20,
            valueProposition: "Instantly browse a broad catalog of scholarships with simple keyword filters, letting students scan many options quickly.",
            tradeoff: "Provides limited relevance and confidence; many results may be ineligible and there is no personalized guidance."
          },
          {
            id: "territory-2",
            name: "Trusted Curated Match",
            quadrant: "GUIDED / TRUST",
            description: "Proposes building a curated eligibility engine and guided workflow that filters scholarships to those most likely to fit a student’s profile and walks them through key application steps.",
            x: 80,
            y: 80,
            valueProposition: "Provides a guided, high‑confidence match experience that filters scholarships to a short list of awards students are most likely to qualify for and supports them through key application steps.",
            tradeoff: "Requires significant data curation and higher development cost, potentially limiting the total number of scholarships displayed and slowing initial rollout."
          },
          {
            id: "territory-3",
            name: "Eligibility‑Focused Self‑Serve",
            quadrant: "SELF‑SERVE / TRUST",
            description: "Offers a self‑service interface where students enter detailed profile data; an algorithmic eligibility scoring (future capability) narrows results to a concise, high‑relevance list without human guidance.",
            x: 20,
            y: 80,
            valueProposition: "Enables students to generate a concise, eligibility‑focused list on their own by entering detailed profile data, balancing relevance with self‑service speed.",
            tradeoff: "Relies on algorithmic eligibility estimation that may not be fully verified and lacks personal support for application steps."
          }
        ],
        keyPillars: [
          "Comprehensive scholarship inventory sourced from public listings",
          "Eligibility‑focused filtering (future capability) to increase relevance",
          "Guided application workflow to reduce friction",
          "Privacy‑first data handling to earn student trust"
        ],
        xAxis: {
          lowLabel: "SELF‑SERVE",
          highLabel: "GUIDED"
        },
        yAxis: {
          lowLabel: "SPEED",
          highLabel: "TRUST"
        },
        isConfirmed: false
      },
      personality: {
        traits: [
          {
            name: "Pragmatic Rigor",
            whyItFits: "Grounded in facts and verified criteria, avoiding hype or unfounded promises.",
            evidence: "Matches the need for trustworthy, verifiable scholarship discovery."
          },
          {
            name: "Guarded Empathy",
            whyItFits: "Understanding student financial stress without becoming overly sentimental or patronizing.",
            evidence: "Acknowledges tuition stress without condescension."
          },
          {
            name: "Selective Clarity",
            whyItFits: "Presenting only actionable, essential information to reduce cognitive overload.",
            evidence: "Addresses the fragmented, overwhelming landscape."
          },
          {
            name: "Focused Confidence",
            whyItFits: "Reassuring through direct, concise guidance rather than aggressive salesmanship.",
            evidence: "Inspires action without false guarantees."
          }
        ],
        avoidTraits: [
          {
            name: "Corporate Patronizing",
            reasonToAvoid: "Speaking down to students with faux-casual or overly familial language."
          },
          {
            name: "Vaporware Promises",
            reasonToAvoid: "Suggesting absolute guarantees or instant funding without qualification."
          },
          {
            name: "Intimidating Jargon",
            reasonToAvoid: "Using complex bureaucratic financial-aid terminology without immediate, plain-language translation."
          }
        ],
        brandPrinciples: [
          {
            name: "Privacy by Design",
            statement: "Student data is collected minimally, stored securely, and never sold.",
            implication: "Collect only GPA and major; never sell leads."
          },
          {
            name: "Clarity Over Cleverness",
            statement: "Direct, functional instructions always take precedence over playful marketing copy.",
            implication: "Zero puns or ambiguous headlines."
          },
          {
            name: "Speed with Accuracy",
            statement: "Fast discovery is useless if the criteria are wrong; precision comes first.",
            implication: "Never rush matches at the expense of qualification accuracy."
          },
          {
            name: "Iterative Trust Building",
            statement: "Credibility is earned through transparent criteria matching, not lofty slogans.",
            implication: "Show exact matching criteria transparently."
          }
        ],
        dimensions: [
          { dimension: "Information Density", value: 70, lowLabel: "Minimal", highLabel: "Comprehensive", rationale: "High density helps students scan requirements quickly." },
          { dimension: "Tone Energy", value: 60, lowLabel: "Subdued", highLabel: "Vibrant", rationale: "Moderately energetic and encouraging." },
          { dimension: "Formality", value: 30, lowLabel: "Casual", highLabel: "Formal", rationale: "Collegiate peer tone, not bureaucratic." },
          { dimension: "Guidance Level", value: 40, lowLabel: "Self-Serve", highLabel: "Hands-On", rationale: "Balanced guidance." },
          { dimension: "Technical Detail", value: 35, lowLabel: "Accessible", highLabel: "Specialized", rationale: "Accessible language without financial jargon." }
        ],
        voice: {
          summary: "ScholarGuide speaks like a knowledgeable peer who respects a student’s time—direct, data‑grounded, and quietly confident, offering clear pathways without hype.",
          characteristics: [
            { characteristic: "Data-Grounded Directness", explanation: "Communicates using verifiable facts, concise statements, and zero filler." },
            { characteristic: "Empathetic Brevity", explanation: "Acknowledges student stress by being efficient, respectful, and direct." },
            { characteristic: "Guarded Transparency", explanation: "Completely open about how criteria are evaluated and data is used, never claiming impossible certainty." },
            { characteristic: "Focused Optimism", explanation: "Encouraging action without overstating odds or outcomes." }
          ],
          toneRules: [
            { do: "State eligibility odds clearly without guaranteeing acceptance.", avoid: "Using 'guaranteed award' or '100% match'.", example: "Based on your major and GPA, you meet the criteria for this grant." },
            { do: "Present steps as straightforward checklists.", avoid: "Overwhelming users with bureaucratic terminology.", example: "Step 1: Upload transcript. Step 2: Confirm your state residency." },
            { do: "Transparently explain data collection.", avoid: "Vague assurances of 'safe data'.", example: "We keep only your major and GPA to match you with scholarships; you can delete this info anytime." }
          ]
        },
        writingSamples: {
          headline: "Find Scholarships You Qualify For—Without the Guesswork.",
          valueProposition: "A simple, privacy‑focused directory that cuts through dead ends, surfacing awards that match your actual profile.",
          socialMessage: "ScholarGuide is live: No spam, no dead links, just grants and scholarships you actually qualify for.",
          userExplanation: "We compare your criteria with thousands of scholarship guidelines to flag where you have the highest probability of eligibility."
        }
      },
      naming: namingJson.data,
      visual: visualJson.data
    }
  };

  console.log('Sending EXACTLY ONE real Challenge generation request to Groq (openai/gpt-oss-120b) ...');
  const start = Date.now();
  const res = await fetch('http://localhost:3001/api/generate-stage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const duration = Date.now() - start;
  const status = res.status;
  console.log(`Response HTTP Status: ${status} in ${duration}ms`);

  const data = await res.json();
  fs.writeFileSync('C:/Users/sharm/.gemini/antigravity-ide/brain/1cc0f1f4-5b2e-43a7-a72b-11510b754cf9/scratch/challenge_response.json', JSON.stringify(data, null, 2));

  if (!res.ok || !data.success) {
    console.error('ERROR RESPONSE:', data);
    process.exit(1);
  }

  console.log(`SUCCESS! Generated ${data.data.findings?.length} findings. Output written to scratch/challenge_response.json\n`);

  console.log('=== CONSISTENCY SUMMARY ===');
  console.log('Overall State:', data.data.consistencySummary?.overallState);
  console.log('Strengths:', data.data.consistencySummary?.strengthsCount, '| Warnings:', data.data.consistencySummary?.warningsCount, '| Conflicts:', data.data.consistencySummary?.conflictsCount);
  console.log('Editorial Assessment:', data.data.consistencySummary?.editorialAssessment);

  console.log('\n=== ACTUAL FINDINGS AUDIT ===');
  data.data.findings.forEach((f, idx) => {
    console.log(`\n[Finding ${idx + 1}] [${f.severity.toUpperCase()}] [${f.category}] "${f.title}"`);
    console.log(`  Headline: "${f.finding}"`);
    console.log(`  Evidence Cited: "${f.evidence}"`);
    console.log(`  Why It Matters: ${f.whyItMatters}`);
    console.log(`  Suggested Fix: ${f.suggestedFix}`);
    console.log(`  Affected Stage: ${f.stageTarget} (Stages: ${f.affectedStages?.join(', ')})`);
    if (f.proposedChange) {
      console.log(`  PROPOSED CHANGE: Target: ${f.proposedChange.targetStage} → ${f.proposedChange.field}`);
      console.log(`    Current: "${f.proposedChange.currentValue}"`);
      console.log(`    Proposed: "${f.proposedChange.proposedValue}"`);
      if (f.proposedChange.rationale) console.log(`    Rationale: ${f.proposedChange.rationale}`);
    } else {
      console.log('  PROPOSED CHANGE: None provided');
    }
  });

  // Human Decision Verification on one real finding
  console.log('\n=====================================================');
  console.log('HUMAN DECISION VERIFICATION');
  console.log('=====================================================');

  const findingWithChange = data.data.findings.find(f => f.proposedChange && f.proposedChange.proposedValue);
  if (!findingWithChange) {
    console.log('Limitation: No finding contained a structured proposedChange.');
    return;
  }

  console.log(`Selected Finding for Human Decision: "${findingWithChange.title}" (${findingWithChange.id})`);
  const change = findingWithChange.proposedChange;
  console.log(`Target: ${change.targetStage} → ${change.field}`);
  const currentVal = payload.brandMemory[change.targetStage]?.[change.field];
  console.log(`Original Field Value: "${currentVal}"`);
  console.log(`Model Proposed Value: "${change.proposedValue}"`);

  // Simulate applying it
  const updatedBrandMemory = JSON.parse(JSON.stringify(payload.brandMemory));
  updatedBrandMemory[change.targetStage][change.field] = change.proposedValue;
  findingWithChange.accepted = true;
  findingWithChange.findingStatus = 'accepted';

  console.log(`Applied Value in BrandMemory.${change.targetStage}.${change.field}: "${updatedBrandMemory[change.targetStage][change.field]}"`);
  console.log(`Finding status after application: accepted=${findingWithChange.accepted}, findingStatus=${findingWithChange.findingStatus}`);

  // Verify stage isolation
  const discoverySame = JSON.stringify(updatedBrandMemory.discovery) === JSON.stringify(payload.brandMemory.discovery);
  const positioningSame = change.targetStage === 'positioning' ? (updatedBrandMemory.positioning.category === payload.brandMemory.positioning.category) : JSON.stringify(updatedBrandMemory.positioning) === JSON.stringify(payload.brandMemory.positioning);
  const personalitySame = change.targetStage === 'personality' ? true : JSON.stringify(updatedBrandMemory.personality) === JSON.stringify(payload.brandMemory.personality);
  const namingSame = change.targetStage === 'naming' ? true : JSON.stringify(updatedBrandMemory.naming) === JSON.stringify(payload.brandMemory.naming);
  const visualSame = change.targetStage === 'visualize' ? true : JSON.stringify(updatedBrandMemory.visual) === JSON.stringify(payload.brandMemory.visual);

  console.log(`Discovery preserved: ${discoverySame}`);
  console.log(`Personality preserved: ${personalitySame}`);
  console.log(`Naming preserved: ${namingSame}`);
  console.log(`Visual preserved: ${visualSame}`);
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
