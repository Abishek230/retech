describe("Unit Test: Sustainability & Environmental Impact Equations", () => {
  const MANUFACTURING_CO2_KG = {
    SMARTPHONE: 70,
    LAPTOP: 300,
    TABLET: 100,
    AUDIO: 25,
  };

  const E_WASTE_KG = {
    SMARTPHONE: 0.15,
    LAPTOP: 2.0,
    TABLET: 0.5,
    AUDIO: 0.25,
  };

  function calculateEnvironmentalImpact(
    category: keyof typeof MANUFACTURING_CO2_KG,
    deviceAgeYears = 1
  ) {
    const ageDecay = Math.min(0.5, (deviceAgeYears - 1) * 0.1);
    const co2SavedKg = Math.round(MANUFACTURING_CO2_KG[category] * (1 - ageDecay) * 100) / 100;
    const eWasteKg = E_WASTE_KG[category];
    const treesEquivalent = Math.round((co2SavedKg / 21) * 10) / 10;
    const waterLiters = Math.round(eWasteKg * 1000);

    return {
      co2SavedKg,
      eWasteKg,
      treesEquivalent,
      waterLiters,
    };
  }

  it("should calculate exact scientific values for Smartphone refurbishing", () => {
    const impact = calculateEnvironmentalImpact("SMARTPHONE", 1);
    expect(impact.co2SavedKg).toBe(70);
    expect(impact.eWasteKg).toBe(0.15);
    expect(impact.treesEquivalent).toBe(3.3); // 70 / 21
    expect(impact.waterLiters).toBe(150); // 0.15 * 1000
  });

  it("should calculate laptop impact of ~300kg CO2 and 2kg e-waste avoided", () => {
    const impact = calculateEnvironmentalImpact("LAPTOP", 1);
    expect(impact.co2SavedKg).toBe(300);
    expect(impact.eWasteKg).toBe(2.0);
    expect(impact.treesEquivalent).toBe(14.3);
    expect(impact.waterLiters).toBe(2000);
  });
});
