import { Router, Request, Response } from 'express';
import { groqGateway, classifyGroqError } from './groqGateway.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    provider: 'groq',
    model: 'openai/gpt-oss-120b',
    groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'MY_GROQ_API_KEY'),
  });
});

apiRouter.post('/generate-stage', async (req: Request, res: Response) => {
  try {
    const { stage, brandMemory } = req.body || {};

    if (!stage) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: "stage".',
      });
    }

    if (stage !== 'discover' && stage !== 'position' && stage !== 'personality' && stage !== 'naming' && stage !== 'visualize' && stage !== 'challenge' && stage !== 'launch' && stage !== 'deliver') {
      return res.status(400).json({
        success: false,
        stage,
        error: `Stage "${stage}" is not implemented yet. Currently "discover", "position", "personality", "naming", "visualize", "challenge", and "deliver" ("launch") are supported.`,
      });
    }

    const roughIdea = brandMemory?.roughIdea || '';
    const knownDetails = brandMemory?.knownDetails || '';
    const projectName = brandMemory?.projectName || '';

    if (!roughIdea || !roughIdea.trim()) {
      return res.status(400).json({
        success: false,
        stage,
        error: 'Please enter a rough idea before generating brand strategy.',
      });
    }

    if (stage === 'discover') {
      const discoveryData = await groqGateway.generateDiscovery({
        roughIdea,
        knownDetails,
        projectName,
      });

      return res.json({
        success: true,
        stage: 'discover',
        data: discoveryData,
      });
    }

    if (stage === 'position') {
      const discovery = brandMemory?.discovery;
      if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
        return res.status(400).json({
          success: false,
          stage: 'position',
          error: 'Discovery data is missing or incomplete. The Discovery stage must be completed before Positioning.',
        });
      }

      const positioningData = await groqGateway.generatePositioning({
        roughIdea,
        discovery,
        projectName,
      });

      return res.json({
        success: true,
        stage: 'position',
        data: positioningData,
      });
    }

    if (stage === 'personality') {
      const discovery = brandMemory?.discovery;
      if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
        return res.status(400).json({
          success: false,
          stage: 'personality',
          error: 'Discovery data is missing or incomplete. Discovery and Positioning must be completed before Personality.',
        });
      }

      const positioning = brandMemory?.positioning;
      if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
        return res.status(400).json({
          success: false,
          stage: 'personality',
          error: 'Positioning data is missing or incomplete. Discovery and Positioning must be completed before Personality.',
        });
      }

      const personalityData = await groqGateway.generatePersonality({
        roughIdea,
        discovery,
        positioning,
        projectName,
      });

      return res.json({
        success: true,
        stage: 'personality',
        data: personalityData,
      });
    }

    if (stage === 'naming') {
      const discovery = brandMemory?.discovery;
      if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
        return res.status(400).json({
          success: false,
          stage: 'naming',
          error: 'Discovery data is missing or incomplete. Discovery, Positioning, and Personality must be completed before Naming.',
        });
      }

      const positioning = brandMemory?.positioning;
      if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
        return res.status(400).json({
          success: false,
          stage: 'naming',
          error: 'Positioning data is missing or incomplete. Discovery, Positioning, and Personality must be completed before Naming.',
        });
      }

      const personality = brandMemory?.personality;
      if (!personality || !personality.traits || personality.traits.length === 0) {
        return res.status(400).json({
          success: false,
          stage: 'naming',
          error: 'Personality data is missing or incomplete. Discovery, Positioning, and Personality must be completed before Naming.',
        });
      }

      const namingData = await groqGateway.generateNaming({
        roughIdea,
        discovery,
        positioning,
        personality,
        projectName,
      });

      return res.json({
        success: true,
        stage: 'naming',
        data: namingData,
      });
    }

    if (stage === 'visualize') {
      const discovery = brandMemory?.discovery;
      if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
        return res.status(400).json({
          success: false,
          stage: 'visualize',
          error: 'Discovery data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.',
        });
      }

      const positioning = brandMemory?.positioning;
      if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
        return res.status(400).json({
          success: false,
          stage: 'visualize',
          error: 'Positioning data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.',
        });
      }

      const personality = brandMemory?.personality;
      if (!personality || !personality.traits || personality.traits.length === 0) {
        return res.status(400).json({
          success: false,
          stage: 'visualize',
          error: 'Personality data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.',
        });
      }

      const naming = brandMemory?.naming;
      if (!naming || (!naming.namingStrategy && (!naming.namingWorlds || naming.namingWorlds.length === 0) && (!naming.candidates || naming.candidates.length === 0))) {
        return res.status(400).json({
          success: false,
          stage: 'visualize',
          error: 'Naming data is missing or incomplete. Discovery, Positioning, Personality, and Naming must be completed before Visual identity.',
        });
      }

      const visualData = await groqGateway.generateVisualize({
        roughIdea,
        discovery,
        positioning,
        personality,
        naming,
        projectName,
      });

      return res.json({
        success: true,
        stage: 'visualize',
        data: visualData,
      });
    }

    if (stage === 'challenge') {
      const discovery = brandMemory?.discovery;
      if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
        return res.status(400).json({
          success: false,
          stage: 'challenge',
          error: 'Discovery data is missing or incomplete. Challenge generation requires Discovery, Positioning, Personality, Naming, and Visualize stages to be completed first.',
        });
      }

      const positioning = brandMemory?.positioning;
      if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
        return res.status(400).json({
          success: false,
          stage: 'challenge',
          error: 'Positioning data is missing or incomplete. Challenge generation requires Discovery, Positioning, Personality, Naming, and Visualize stages to be completed first.',
        });
      }

      const personality = brandMemory?.personality;
      if (!personality || !personality.traits || personality.traits.length === 0) {
        return res.status(400).json({
          success: false,
          stage: 'challenge',
          error: 'Personality data is missing or incomplete. Challenge generation requires Discovery, Positioning, Personality, Naming, and Visualize stages to be completed first.',
        });
      }

      const naming = brandMemory?.naming;
      if (!naming || (!naming.namingStrategy && (!naming.namingWorlds || naming.namingWorlds.length === 0) && (!naming.candidates || naming.candidates.length === 0))) {
        return res.status(400).json({
          success: false,
          stage: 'challenge',
          error: 'Naming data is missing or incomplete. Challenge generation requires Discovery, Positioning, Personality, Naming, and Visualize stages to be completed first.',
        });
      }

      const visual = brandMemory?.visual || brandMemory?.visualize;
      if (!visual || (!visual.creativeDirection && (!visual.palette || visual.palette.length === 0) && !visual.colorSystem)) {
        return res.status(400).json({
          success: false,
          stage: 'challenge',
          error: 'Visual data is missing or incomplete. Challenge generation requires Discovery, Positioning, Personality, Naming, and Visualize stages to be completed first.',
        });
      }

      const challengeData = await groqGateway.generateChallenge({
        roughIdea,
        discovery,
        positioning,
        personality,
        naming,
        visual,
        projectName,
      });

      return res.json({
        success: true,
        stage: 'challenge',
        data: challengeData,
      });
    }

    if (stage === 'launch' || stage === 'deliver') {
      const discovery = brandMemory?.discovery;
      if (!discovery || !discovery.coreProblem || !discovery.primaryAudience) {
        return res.status(400).json({
          success: false,
          stage,
          error: 'Discovery data is missing or incomplete. Deliver stage requires Discovery, Positioning, Personality, Naming, Visualize, and Challenge stages.',
        });
      }

      const positioning = brandMemory?.positioning;
      if (!positioning || !positioning.category || (!positioning.positioningStatement && !positioning.valueProposition)) {
        return res.status(400).json({
          success: false,
          stage,
          error: 'Positioning data is missing or incomplete. Deliver stage requires Discovery, Positioning, Personality, Naming, Visualize, and Challenge stages.',
        });
      }

      const personality = brandMemory?.personality;
      if (!personality || !personality.traits || personality.traits.length === 0) {
        return res.status(400).json({
          success: false,
          stage,
          error: 'Personality data is missing or incomplete. Deliver stage requires Discovery, Positioning, Personality, Naming, Visualize, and Challenge stages.',
        });
      }

      const naming = brandMemory?.naming;
      if (!naming || (!naming.namingStrategy && (!naming.namingWorlds || naming.namingWorlds.length === 0) && (!naming.candidates || naming.candidates.length === 0))) {
        return res.status(400).json({
          success: false,
          stage,
          error: 'Naming data is missing or incomplete. Deliver stage requires Discovery, Positioning, Personality, Naming, Visualize, and Challenge stages.',
        });
      }

      const visual = brandMemory?.visual || brandMemory?.visualize;
      if (!visual || (!visual.creativeDirection && (!visual.palette || visual.palette.length === 0) && !visual.colorSystem)) {
        return res.status(400).json({
          success: false,
          stage,
          error: 'Visual data is missing or incomplete. Deliver stage requires Discovery, Positioning, Personality, Naming, Visualize, and Challenge stages.',
        });
      }

      const challenge = brandMemory?.challenge;
      if (!challenge || !challenge.findings || challenge.findings.length === 0) {
        return res.status(400).json({
          success: false,
          stage,
          error: 'Challenge data is missing or incomplete. Deliver stage requires the Adversarial Challenge stage to be completed.',
        });
      }

      const deliverData = await groqGateway.generateDeliver({
        roughIdea,
        discovery,
        positioning,
        personality,
        naming,
        visual,
        challenge,
        projectName,
      });

      return res.json({
        success: true,
        stage: 'launch',
        data: deliverData,
      });
    }
  } catch (err: any) {
    const classified = classifyGroqError(err);
    console.error(`[API /api/generate-stage Error] [${classified.category} - ${classified.statusCode}]:`, classified.message);
    return res.status(classified.statusCode).json({
      success: false,
      stage: req.body?.stage || 'discover',
      error: classified.message,
      category: classified.category,
      retryAfter: classified.retryAfter,
    });
  }
});
