describe("Unit Test: Cart Pricing & Escrow Fee Calculation", () => {
  interface CartItem {
    id: string;
    price: number;
    quantity: number;
  }

  function calculateCartBreakdown(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const platformFee = Math.round(subtotal * 0.05 * 100) / 100; // 5%
    const sellerPayout = Math.round(subtotal * 0.95 * 100) / 100; // 95%
    const warrantyCost = 0.0; // Free 12-month guarantee
    const total = subtotal;

    return {
      subtotal,
      platformFee,
      sellerPayout,
      warrantyCost,
      total,
    };
  }

  it("should calculate exact 5% platform fee and 95% seller payout", () => {
    const breakdown = calculateCartBreakdown([
      { id: "item1", price: 849, quantity: 1 },
      { id: "item2", price: 1499, quantity: 1 },
    ]);

    expect(breakdown.subtotal).toBe(2348);
    expect(breakdown.platformFee).toBe(117.4);
    expect(breakdown.sellerPayout).toBe(2230.6);
    expect(breakdown.platformFee + breakdown.sellerPayout).toBe(breakdown.subtotal);
  });
});
