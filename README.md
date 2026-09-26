# BrandForge

### The Brand Intelligence Studio

**BrandForge transforms a rough idea into a coherent, challenge-tested brand system through a connected multi-stage AI workflow.**

Most AI branding tools follow a simple pattern:

> **Prompt → Generate → Done**

BrandForge takes a different approach.

It treats branding as a **progressive decision-making system** where each stage builds on the previous one, the accumulated brand context is preserved, and the resulting brand is actively challenged before the final brand system is delivered.

---

## ✦ What is BrandForge?

Starting with nothing more than a rough product, startup, community, or creator idea, BrandForge guides the user through:

```text
Rough Idea
    ↓
Discover
    ↓
Position
    ↓
Shape
    ↓
Naming
    ↓
Visualize
    ↓
Challenge
    ↓
Human Decision
    ↓
Re-Challenge
    ↓
Deliver
```

Instead of generating disconnected pieces of branding, BrandForge maintains a central **BrandMemory** that carries strategic decisions across the entire workflow.

This allows later stages to understand and build upon decisions made earlier.

---

## ✦ The Core Idea

### Build → Challenge → Correct → Re-Challenge → Deliver

The most important part of BrandForge is the **Challenge Engine**.

Once a brand system has been created, BrandForge attempts to break it.

The AI critic examines the accumulated brand system for issues such as:

* Strategic inconsistencies
* Audience misalignment
* Weak differentiation
* Unsupported claims
* Naming risks
* Personality/voice inconsistencies
* Visual inconsistencies
* Cross-stage contradictions
* Unvalidated assumptions

The user remains in control.

For every finding, the user can:

**Accept · Ignore · Edit · Re-run**

Accepted changes modify the underlying BrandMemory rather than creating a disconnected replacement.

BrandForge can then run the challenge again against the **updated state**.

---

# ✦ Workflow

## 01 — Discover

Turn an incomplete idea into a structured understanding of the opportunity.

The Discovery stage identifies:

* Core problem
* Primary audience
* User context
* Existing alternatives
* Core need
* Assumptions
* Open questions

The system is designed to avoid inventing unsupported demographic, geographic, or capability claims.

---

## 02 — Position

Translate the discovery into strategic positioning.

BrandForge generates:

* Positioning statement
* Value proposition
* Primary differentiation
* Target segment
* Key strategic pillars
* Alternative positioning territories
* Strategic rationale

Positioning territories allow the user to explore different strategic directions rather than being locked into the first AI-generated answer.

---

## 03 — Shape

Develop the personality and communication system.

BrandForge establishes:

* Brand traits
* Traits to avoid
* Brand principles
* Voice characteristics
* Voice summary
* Tone rules
* Writing direction

The personality stage consumes the strategic context established by Discovery and Positioning.

---

## 04 — Naming

Explore naming directions through strategic **Naming Worlds**.

Each candidate is evaluated across dimensions such as:

* Strategic fit
* Positioning fit
* Personality fit
* Audience fit
* Distinctiveness
* Memorability
* Pronunciation
* Flexibility
* Risks

BrandForge deliberately avoids pretending to verify trademark or domain availability.

---

## 05 — Visualize

Translate the strategic system into a visual direction.

The Visualize stage generates a structured visual system containing:

* Creative direction
* Visual thesis
* Mood keywords
* Visual principles
* Color system
* Typography
* Imagery direction
* Graphic language
* Logo direction
* UI direction
* Do / Don't rules

The goal is not to produce random AI aesthetics, but to make the visual identity follow from the strategic decisions already made.

---

# 06 — Challenge

### Let's try to break your brand.

The Challenge Engine acts as an adversarial brand critic.

It evaluates the complete accumulated BrandMemory and produces evidence-backed findings.

Each finding includes:

* Severity
* Category
* Evidence
* Why it matters
* Affected stage
* Suggested fix
* Proposed change
* Current status

The critic is not allowed to silently modify the brand.

The human decides what happens next.

---

# 07 — Human Decision

BrandForge keeps the human in the loop.

A user can:

### Accept

Apply the proposed correction to the relevant BrandMemory field.

### Ignore

Keep the current strategy and dismiss the finding.

### Edit

Modify the proposed correction before applying it.

### Re-Challenge

Run the critic again against the updated brand system.

This creates an iterative loop:

```text
Brand System
     ↓
AI Critic
     ↓
Finding
     ↓
Human Decision
     ↓
Updated BrandMemory
     ↓
AI Critic
     ↓
Improved Brand System
```

---

# 08 — Deliver

The final Brand Book is assembled from the **current BrandMemory**.

It brings together:

* Brand name
* Strategic foundation
* Positioning
* Value proposition
* Differentiation
* Personality
* Naming strategy
* Visual identity
* Brand voice
* Messaging
* Challenge findings
* Accepted changes
* Launch checklist

The Deliver stage does not independently regenerate the brand.

It synthesizes the decisions that were actually made throughout the workflow.

---

# ✦ Architecture

BrandForge uses a staged AI architecture with a central state model.

```text
                         ┌───────────────┐
                         │     Groq      │
                         │ GPT-OSS-120B  │
                         └───────▲───────┘
                                 │
                                 │ Structured JSON
                                 │
┌──────────────┐          ┌──────┴───────┐
│    React     │          │  Express API │
│   Frontend   │ ───────► │   /api/...   │
└──────┬───────┘          └──────┬───────┘
       │                         │
       │                         │
       ▼                         ▼
┌──────────────┐          ┌──────────────┐
│ BrandMemory  │ ◄────────│  Validators  │
│              │          │ & Normalizers│
└──────┬───────┘          └──────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│              Brand Stages              │
│                                        │
│ Discover → Position → Shape → Naming   │
│       → Visualize → Challenge          │
│       → Deliver                        │
└────────────────────────────────────────┘
```

### Central BrandMemory

The workflow is built around a shared structured state:

```text
BrandMemory
├── idea
├── discovery
├── positioning
├── personality
├── naming
├── visualize
├── challenge
└── launch
```

Every stage reads the relevant accumulated context and writes validated output back into the shared state.

This prevents the stages from becoming isolated AI prompts.

---

# ✦ AI Workflow

BrandForge uses **Groq + `openai/gpt-oss-120b`** for the live AI workflow.

Each stage uses structured generation and validation rather than relying on free-form text alone.

The backend:

1. Receives the current stage request.
2. Validates prerequisites.
3. Builds the stage-specific prompt using accumulated BrandMemory.
4. Sends the request to Groq.
5. Parses the structured response.
6. Validates and normalizes the result.
7. Updates BrandMemory only after successful validation.
8. Returns the result to the frontend.

Failed generation does not overwrite valid existing stage data.

---

# ✦ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Context
* Responsive CSS / utility-based styling
* Three.js / React Three Fiber for selective spatial experiences

### Backend

* Node.js
* Express
* TypeScript
* Groq API

### AI

* Groq
* `openai/gpt-oss-120b`
* Structured JSON generation
* Stage-specific prompting
* Validation and normalization
* Adversarial critique workflow

### State

* React Context
* Structured `BrandMemory`
* Session-based persistence
* Deterministic demo state

---

# ✦ Demo Mode

BrandForge includes a deterministic offline demonstration project:

### SprintForge

The demo contains pre-populated data across the complete workflow.

This means the core product demonstration does **not require an AI API request**.

```text
Explore Example
      ↓
SprintForge
      ↓
Complete Brand System
      ↓
Challenge Findings
      ↓
Brand Book
```

The demo state is isolated from real user sessions.

---

# ✦ Reliability & Validation

The project includes stage-specific tests and an end-to-end judge simulation.

Latest verification:

```text
TypeScript                 0 errors
Production build           PASS

End-to-End Judge           81 / 81
Deliver                    56 / 56
Challenge                  59 / 59
Visualize                  50 / 50
Naming                     51 / 51
Personality                36 / 36
────────────────────────────────────
Total                      333 / 333
```

The end-to-end simulation verified:

* Real Groq generation
* Cross-stage BrandMemory propagation
* Structured outputs
* Grounding controls
* Human decision loop
* Challenge → correction → re-challenge
* Deliver freshness
* Export generation
* Demo isolation
* Error handling
* State integrity

---

# ✦ Example

A user can start with an idea as simple as:

> “I want to build a platform that helps college students discover scholarships, grants, and other funding opportunities they are actually eligible for.”

BrandForge progressively transforms that rough concept into:

```text
Idea
 ↓
Problem & Audience
 ↓
Strategic Positioning
 ↓
Brand Personality
 ↓
Naming Worlds
 ↓
Visual Identity
 ↓
Adversarial Critique
 ↓
Human Refinement
 ↓
Final Brand Book
```

The important part is that the final output is not generated independently from the original prompt.

It reflects the decisions made throughout the entire journey.

---

# ✦ Design Philosophy

BrandForge is intentionally designed as a **creative intelligence studio**, rather than a conventional AI dashboard.

The interface combines:

* Editorial design
* Spatial interaction
* Strategic maps
* Brand visualization
* Progressive disclosure
* Human decision points
* Selective 3D interaction

The visual experience is built around the idea of a **living brand system** rather than a collection of disconnected forms and cards.

---

# ✦ Project Structure

```text
BrandForge/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── stages/
│   ├── types/
│   └── ...
│
├── server/
│   ├── apiRouter.ts
│   ├── groqGateway.ts
│   ├── discoveryPrompt.ts
│   ├── positioningPrompt.ts
│   ├── personalityPrompt.ts
│   ├── namingPrompt.ts
│   └── challengePrompt.ts
│
├── server.ts
├── vite.config.ts
├── package.json
└── README.md
```

---

# ✦ Getting Started

## Prerequisites

* Node.js
* npm
* A Groq API key

## Installation

```bash
git clone <your-repository-url>
cd BrandForge
npm install
```

Create an environment file containing:

```env
GROQ_API_KEY=your_groq_api_key
```

Then start the development environment using the project's configured development command.

The backend exposes:

```text
GET /api/health
```

which can be used to verify that the API server is running and the Groq configuration is available.

---

# ✦ Environment & Security

The Groq API key is kept on the server side.

The frontend does **not** directly expose the API key.

AI requests follow:

```text
Browser
  ↓
BrandForge API
  ↓
Groq
```

rather than:

```text
Browser
  ↓
Groq
```

This keeps the provider credential outside the client application.

---

# ✦ Hackathon Context

BrandForge was built as a hackathon project around the challenge of creating an AI-powered product that can transform an incomplete idea into a coherent, useful, launch-ready brand system.

The project focuses on demonstrating:

* Multi-stage AI workflows
* Structured outputs
* Context preservation
* AI critique
* Human-in-the-loop refinement
* Cross-stage consistency
* Practical final deliverables

Rather than treating AI as a single generation step, BrandForge uses AI as a collaborative creative system.

---

# ✦ The Vision

Branding shouldn't begin with:

> **“Give me a logo.”**

It should begin with:

> **“What are we actually building, who is it for, why should it exist, and what should it stand for?”**

BrandForge is built around that idea.

### Build the brand.

### Challenge the brand.

### Refine the brand.

### Deliver the brand.

---

## License

This project is currently developed as a hackathon project.

See the repository for the applicable project license and usage terms.
