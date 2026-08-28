describe("Unit Test: Second-Life Score (SLS) Engine", () => {
  function calculateSLS(metrics: {
    batteryHealth: number; // 0-100
    cosmeticGrade: "Pristine" | "Excellent" | "Good";
    oemPartsRatio: number; // 0-1
    thermalEfficiency: number; // 0-1
    chargeCycles: number;
  }): number {
    let cosmeticFactor = 1.0;
    if (metrics.cosmeticGrade === "Excellent") cosmeticFactor = 0.92;
    if (metrics.cosmeticGrade === "Good") cosmeticFactor = 0.82;

    const cyclePenalty = Math.min(15, (metrics.chargeCycles / 500) * 10);
    const score =
      metrics.batteryHealth * 0.4 +
      metrics.oemPartsRatio * 100 * 0.25 +
      metrics.thermalEfficiency * 100 * 0.15 +
      100 * cosmeticFactor * 0.2 -
      cyclePenalty;

    return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
  }

  it("should calculate pristine grade score above 95/100", () => {
    const score = calculateSLS({
      batteryHealth: 98,
      cosmeticGrade: "Pristine",
      oemPartsRatio: 1.0,
      thermalEfficiency: 0.96,
      chargeCycles: 42,
    });
    expect(score).toBeGreaterThanOrEqual(95);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should penalize high charge cycles and good cosmetic grade", () => {
    const pristine = calculateSLS({
      batteryHealth: 90,
      cosmeticGrade: "Pristine",
      oemPartsRatio: 1.0,
      thermalEfficiency: 0.9,
      chargeCycles: 50,
    });

    const worn = calculateSLS({
      batteryHealth: 80,
      cosmeticGrade: "Good",
      oemPartsRatio: 0.85,
      thermalEfficiency: 0.8,
      chargeCycles: 650,
    });

    expect(worn).toBeLessThan(pristine);
    expect(worn).toBeGreaterThan(60);
  });
});
