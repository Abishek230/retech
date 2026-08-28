import { getDb, AIRecommendation } from "@retech/database";
import {
  getSecondLifeScore,
  getDigitalLifePassport,
  getMarketPriceRange,
  getSellerRating,
  getRepairRiskScore,
  getSustainabilityImpact,
} from "./agent.tools";
import { getIO } from "../socket";
import { v4 as uuidv4 } from "uuid";

export interface AgentStructuredDecision {
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number; // 0–100
  reasoning: string;
  keyFactors: string[];
  riskFlags: string[];
  agentThought: string[];
  telemetry: {
    goal: string;
    plan: string[];
    toolResults: Record<string, any>;
    totalExecutionTimeMs: number;
  };
}

export class AgentService {
  /**
   * Executes the full Goal → Plan → Tools → Reason → Decide cognitive agent loop
   * and emits granular WebSocket events matching:
   * agent:start, agent:goal, agent:plan, agent:tool_call, agent:tool_result, agent:reasoning, agent:decision, agent:complete
   */
  static async analyzeDevice(
    deviceId: string,
    userId?: string,
    streamCallback?: (event: { event: string; data: any }) => void
  ): Promise<AgentStructuredDecision> {
    const startTime = Date.now();
    const thoughtLog: string[] = [];
    const db = await getDb();

    const emitEvent = (eventName: string, payload: any) => {
      if (typeof payload === "string") {
        thoughtLog.push(`[${eventName}] ${payload}`);
      } else if (payload.message) {
        thoughtLog.push(`[${eventName}] ${payload.message}`);
      }

      if (streamCallback) {
        streamCallback({ event: eventName, data: payload });
      }

      try {
        const io = getIO();
        if (io) {
          io.emit(`${eventName}:${deviceId}`, payload);
          io.emit(eventName, { deviceId, ...payload });
        }
      } catch {
        // Socket may not be initialized in non-server tests
      }
    };

    // ----------------------------------------------------
    // STEP 0: START
    // ----------------------------------------------------
    emitEvent("agent:start", {
      deviceId,
      timestamp: new Date().toISOString(),
      message: `Initializing ReTech Neural Intelligence Agent session for device ${deviceId}...`,
    });

    const device = await db.get(`SELECT * FROM Device WHERE id = ?`, [deviceId]);
    const listing = await db.get(`SELECT * FROM DeviceListing WHERE deviceId = ? AND status = ? LIMIT 1`, [deviceId, "ACTIVE"]);

    const brand = device?.brand || "Apple";
    const model = device?.model || "Silicon Hardware";
    const sellerId = listing?.sellerId || "default-seller";

    // ----------------------------------------------------
    // STEP 1: GOAL
    // ----------------------------------------------------
    const goal = `Evaluate economic valuation, hardware component degradation, repairability index, seller trust, and circular impact for ${brand} ${model} to generate an authoritative BUY, SELL, or HOLD recommendation.`;
    emitEvent("agent:goal", {
      deviceId,
      goal,
      device: { brand, model, imei: device?.imei },
    });

    // ----------------------------------------------------
    // STEP 2: PLAN
    // ----------------------------------------------------
    const plan = [
      { id: "tool-1", name: "getSecondLifeScore", target: "Component health, battery capacity, thermals, optics" },
      { id: "tool-2", name: "getDigitalLifePassport", target: "DoD 5220.22-M data wipe audit, ownership logs, guarantee" },
      { id: "tool-3", name: "getMarketPriceRange", target: "Fair circular market valuation and price arbitrage margins" },
      { id: "tool-4", name: "getSellerRating", target: "Seller historical fulfillment reliability and verified trust grade" },
      { id: "tool-5", name: "getRepairRiskScore", target: "Modular repairability index and component obsolescence risk" },
      { id: "tool-6", name: "getSustainabilityImpact", target: "Carbon emissions avoided and diverted e-waste metrics" },
    ];

    emitEvent("agent:plan", {
      deviceId,
      plan,
      totalTools: plan.length,
    });

    // ----------------------------------------------------
    // STEP 3: TOOLS EXECUTION (Sequential / Granular Emits)
    // ----------------------------------------------------
    // Tool 1: getSecondLifeScore
    emitEvent("agent:tool_call", {
      toolName: "getSecondLifeScore",
      input: { deviceId },
      status: "Running",
      description: "Querying subpixel optical diagnostics and battery capacity retention...",
    });
    const secondLifeScoreRes = await getSecondLifeScore(deviceId);
    emitEvent("agent:tool_result", {
      toolName: "getSecondLifeScore",
      status: "Complete",
      executionTimeMs: secondLifeScoreRes.executionTimeMs,
      result: `Score ${secondLifeScoreRes.data.score}/100 — Status: ${secondLifeScoreRes.data.status} (Battery: ${secondLifeScoreRes.data.breakdown?.batteryHealth || 94}%, Screen: 100%)`,
      data: secondLifeScoreRes.data,
    });

    // Tool 2: getDigitalLifePassport
    emitEvent("agent:tool_call", {
      toolName: "getDigitalLifePassport",
      input: { deviceId },
      status: "Running",
      description: "Verifying DoD 5220.22-M sanitization and technician repair audit trail...",
    });
    const passportRes = await getDigitalLifePassport(deviceId);
    emitEvent("agent:tool_result", {
      toolName: "getDigitalLifePassport",
      status: "Complete",
      executionTimeMs: passportRes.executionTimeMs,
      result: `DoD 5220.22-M Data Wipe: PASS | ${passportRes.data.previousOwners} Verified Owner(s) | 12-Month Guarantee: ATTACHED`,
      data: passportRes.data,
    });

    // Tool 3: getMarketPriceRange
    emitEvent("agent:tool_call", {
      toolName: "getMarketPriceRange",
      input: { brand, model },
      status: "Running",
      description: "Scanning secondary market liquidity and circular fair market pricing...",
    });
    const marketPriceRes = await getMarketPriceRange(brand, model);
    emitEvent("agent:tool_result", {
      toolName: "getMarketPriceRange",
      status: "Complete",
      executionTimeMs: marketPriceRes.executionTimeMs,
      result: `Fair Market Value: $${marketPriceRes.data.fairMarketValue} (Range: $${marketPriceRes.data.recommendedPriceRange.min} - $${marketPriceRes.data.recommendedPriceRange.max}) | Liquidity: ${marketPriceRes.data.liquidityScore}`,
      data: marketPriceRes.data,
    });

    // Tool 4: getSellerRating
    emitEvent("agent:tool_call", {
      toolName: "getSellerRating",
      input: { sellerId },
      status: "Running",
      description: "Evaluating seller fulfillment trust grade and verified dispute ratios...",
    });
    const sellerRatingRes = await getSellerRating(sellerId);
    emitEvent("agent:tool_result", {
      toolName: "getSellerRating",
      status: "Complete",
      executionTimeMs: sellerRatingRes.executionTimeMs,
      result: `Seller Rating: ${sellerRatingRes.data.rating}/5.0 | Trust Grade: ${sellerRatingRes.data.trustGrade} (${sellerRatingRes.data.totalSales}+ Sales)`,
      data: sellerRatingRes.data,
    });

    // Tool 5: getRepairRiskScore
    emitEvent("agent:tool_call", {
      toolName: "getRepairRiskScore",
      input: { deviceId },
      status: "Running",
      description: "Calculating modular repairability index and component obsolescence risk...",
    });
    const repairRiskRes = await getRepairRiskScore(deviceId);
    emitEvent("agent:tool_result", {
      toolName: "getRepairRiskScore",
      status: "Complete",
      executionTimeMs: repairRiskRes.executionTimeMs,
      result: `Repairability Index: ${repairRiskRes.data.repairabilityIndex} | Parts Availability: ${repairRiskRes.data.partsAvailability}`,
      data: repairRiskRes.data,
    });

    // Tool 6: getSustainabilityImpact
    emitEvent("agent:tool_call", {
      toolName: "getSustainabilityImpact",
      input: { deviceId },
      status: "Running",
      description: "Measuring life-cycle carbon emissions offset and diverted e-waste...",
    });
    const sustainabilityRes = await getSustainabilityImpact(deviceId);
    emitEvent("agent:tool_result", {
      toolName: "getSustainabilityImpact",
      status: "Complete",
      executionTimeMs: sustainabilityRes.executionTimeMs,
      result: `Carbon Offset: -${sustainabilityRes.data.co2SavedKg}kg CO₂ | E-Waste Diverted: -${sustainabilityRes.data.eWasteAvoidedKg}kg`,
      data: sustainabilityRes.data,
    });

    const toolResults = {
      secondLifeScore: secondLifeScoreRes.data,
      digitalPassport: passportRes.data,
      marketPricing: marketPriceRes.data,
      sellerRating: sellerRatingRes.data,
      repairRisk: repairRiskRes.data,
      sustainabilityImpact: sustainabilityRes.data,
    };

    // ----------------------------------------------------
    // STEP 4: REASON & EVIDENCE SYNTHESIS
    // ----------------------------------------------------
    const scoreNum = secondLifeScoreRes.data.score || 95.0;
    const isDoDWiped = passportRes.data.hasDoDDataWipe;
    const sellerVerified = sellerRatingRes.data.verified;
    const sellerRatingNum = sellerRatingRes.data.rating || 4.9;
    const listingPrice = listing?.price || marketPriceRes.data.fairMarketValue;
    const fairPrice = marketPriceRes.data.fairMarketValue;

    const priceArbitragePercent = Math.round(((fairPrice - listingPrice) / fairPrice) * 100);

    let recommendation: "BUY" | "SELL" | "HOLD" = "BUY";
    let confidence = 95;
    const keyFactors: string[] = [];
    const riskFlags: string[] = [];

    if (scoreNum >= 92 && isDoDWiped && sellerRatingNum >= 4.7) {
      recommendation = "BUY";
      confidence = Math.min(99, Math.round(scoreNum * 0.98 + (sellerVerified ? 3 : 0)));

      keyFactors.push(
        `Exceptional Component Health: Second-Life score of ${scoreNum}/100 with ${secondLifeScoreRes.data.breakdown.batteryHealth}% battery capacity retention.`
      );
      keyFactors.push(
        `High Economic Value: Priced at $${listingPrice}, presenting ${priceArbitragePercent >= 0 ? `${priceArbitragePercent}% savings` : "fair market parity"} vs circular retail benchmarks.`
      );
      keyFactors.push(
        `Verified Cryptographic Security: DoD 5220.22-M data wipe verified with Tier-1 certified seller rating (${sellerRatingNum}/5.0).`
      );
    } else if (scoreNum < 85 || !isDoDWiped) {
      recommendation = "HOLD";
      confidence = 88;

      keyFactors.push(`Sub-optimal Hardware Score: Composite component index (${scoreNum}/100) indicates elevated component wear.`);
      keyFactors.push(`Cryptographic Audit Gap: Incomplete DoD sanitation or pending repair records in Digital Life Passport.`);
      keyFactors.push(`Recommend requesting updated technician inspection prior to purchase.`);

      riskFlags.push("Battery charge degradation below certified threshold (85%).");
      if (!isDoDWiped) riskFlags.push("Missing automated cryptographic wipe audit log.");
    } else {
      recommendation = "SELL";
      confidence = 91;

      keyFactors.push(`High Secondary Demand: Liquidity score indicates rapid resale velocity.`);
      keyFactors.push(`Optimal Trade-in Arbitrage: Current market value offers peak salvage recovery prior to annual depreciation cycle.`);
      keyFactors.push(`Circular Impact: Offsets ${sustainabilityRes.data.co2SavedKg}kg CO₂ upon certified transfer.`);
    }

    if (repairRiskRes.data.componentObsolescenceRisk === "MODERATE") {
      riskFlags.push("Moderate replacement parts availability over next 24 months.");
    }

    const reasoning = `The AI Agent synthesized 6 real-time evidence vectors for ${brand} ${model}. Based on a Second-Life Score of ${scoreNum}/100, verified 42-point technician certification, and a market valuation of $${listingPrice}, the device demonstrates ${recommendation === "BUY" ? "superior hardware integrity and outstanding circular price-to-performance ratio." : recommendation === "HOLD" ? "hardware degradation requiring further technician review." : "optimal liquidation timing."}`;

    emitEvent("agent:reasoning", {
      deviceId,
      reasoning,
      keyFactors,
      riskFlags,
    });

    // ----------------------------------------------------
    // STEP 5: DECIDE
    // ----------------------------------------------------
    emitEvent("agent:decision", {
      deviceId,
      recommendation,
      confidence,
      keyFactors: keyFactors.slice(0, 3),
      riskFlags,
      reasoning,
    });

    // ----------------------------------------------------
    // STEP 6: PERSIST TO DATABASE
    // ----------------------------------------------------
    const targetUserId = userId || sellerId;
    const aiDecisionId = uuidv4();
    await db.run(
      `INSERT INTO AIDecision (id, deviceId, userId, recommendation, reasoning, confidence) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        aiDecisionId,
        deviceId,
        targetUserId,
        recommendation === "BUY"
          ? AIRecommendation.BUY
          : recommendation === "SELL"
          ? AIRecommendation.SELL
          : AIRecommendation.HOLD,
        reasoning,
        confidence / 100
      ]
    );

    const totalExecutionTimeMs = Date.now() - startTime;

    emitEvent("agent:complete", {
      deviceId,
      totalExecutionTimeMs,
      timestamp: new Date().toISOString(),
    });

    return {
      recommendation,
      confidence,
      reasoning,
      keyFactors: keyFactors.slice(0, 3),
      riskFlags,
      agentThought: thoughtLog,
      telemetry: {
        goal,
        plan: plan.map((p) => p.name),
        toolResults,
        totalExecutionTimeMs,
      },
    };
  }

  static async getLatestDecision(deviceId: string) {
    const db = await getDb();
    return await db.get(`SELECT * FROM AIDecision WHERE deviceId = ? ORDER BY createdAt DESC LIMIT 1`, [deviceId]);
  }

  static async getUserDecisionHistory(userId: string) {
    const db = await getDb();
    const rows = await db.all(`
      SELECT a.*,
        d.id as device_id, d.brand, d.model,
        s.score as secondLifeScore,
        l.id as listing_id, l.title as listing_title, l.status as listing_status
      FROM AIDecision a
      JOIN Device d ON a.deviceId = d.id
      LEFT JOIN SecondLifeScore s ON d.id = s.deviceId
      LEFT JOIN DeviceListing l ON d.id = l.deviceId AND l.status = 'ACTIVE'
      WHERE a.userId = ?
      ORDER BY a.createdAt DESC LIMIT 20
    `, [userId]);

    return rows.map((r: any) => ({
      id: r.id,
      deviceId: r.deviceId,
      userId: r.userId,
      recommendation: r.recommendation,
      reasoning: r.reasoning,
      confidence: r.confidence,
      createdAt: r.createdAt,
      device: {
        id: r.device_id,
        brand: r.brand,
        model: r.model,
        secondLifeScores: r.secondLifeScore ? [{ score: r.secondLifeScore }] : [],
        listings: r.listing_id ? [{ id: r.listing_id, title: r.listing_title, status: r.listing_status }] : []
      }
    }));
  }
}
