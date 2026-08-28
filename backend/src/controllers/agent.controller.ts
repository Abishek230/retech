import { Request, Response, NextFunction } from "express";
import { AgentService } from "../ai-agent/agent.service";

// ----------------------------------------------------
// 1. POST /agent/analyze/:deviceId
// ----------------------------------------------------
export async function analyzeDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { deviceId } = req.params;
    const userId = req.user?.userId || req.body?.userId;

    const decision = await AgentService.analyzeDevice(deviceId, userId);

    return res.json({
      success: true,
      message: "AI Agent completed autonomous Goal-to-Decision diagnostic loop.",
      data: decision,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. GET /agent/decision/:deviceId
// ----------------------------------------------------
export async function getLatestDecisionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { deviceId } = req.params;

    const decision = await AgentService.getLatestDecision(deviceId);

    if (!decision) {
      return res.status(404).json({
        success: false,
        error: "No AI Decision found for this device. Run analysis first.",
      });
    }

    return res.json({
      success: true,
      data: decision,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. GET /agent/history/:userId
// ----------------------------------------------------
export async function getUserDecisionHistoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    const history = await AgentService.getUserDecisionHistory(userId);

    return res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}
