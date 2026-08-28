describe("Unit Test: AI Decision Agent Tool Routing & Synthesis", () => {
  const TOOL_REGISTRY = [
    "getSecondLifeScore",
    "getDigitalLifePassport",
    "getMarketPriceRange",
    "getSellerRating",
    "getRepairRiskScore",
    "getSustainabilityImpact",
  ];

  function routeAgentTools(requestedTools: string[]) {
    const valid = requestedTools.filter((t) => TOOL_REGISTRY.includes(t));
    return {
      plannedCount: valid.length,
      allToolsValid: valid.length === requestedTools.length,
      tools: valid,
    };
  }

  function synthesizeVerdict(evidence: {
    slsScore: number;
    price: number;
    marketAverage: number;
    sellerRating: number;
  }): { recommendation: "BUY" | "SELL" | "HOLD"; confidence: number } {
    const discount = (evidence.marketAverage - evidence.price) / evidence.marketAverage;

    if (evidence.slsScore >= 90 && discount >= 0.05 && evidence.sellerRating >= 4.5) {
      return { recommendation: "BUY", confidence: 94 };
    }

    if (evidence.slsScore < 75 || discount < -0.15) {
      return { recommendation: "SELL", confidence: 88 };
    }

    return { recommendation: "HOLD", confidence: 82 };
  }

  it("should successfully route all 6 circular diagnostic tools", () => {
    const routing = routeAgentTools(TOOL_REGISTRY);
    expect(routing.plannedCount).toBe(6);
    expect(routing.allToolsValid).toBe(true);
  });

  it("should output BUY verdict with >=90 confidence when price is below market and SLS is pristine", () => {
    const verdict = synthesizeVerdict({
      slsScore: 98,
      price: 849,
      marketAverage: 950,
      sellerRating: 4.9,
    });
    expect(verdict.recommendation).toBe("BUY");
    expect(verdict.confidence).toBeGreaterThanOrEqual(90);
  });
});
