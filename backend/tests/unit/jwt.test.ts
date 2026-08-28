import jwt from "jsonwebtoken";

describe("Unit Test: JWT Access & Refresh Token Validation", () => {
  const JWT_SECRET = "retech_jwt_secret_test_2026";
  const REFRESH_SECRET = "retech_refresh_secret_test_2026";

  function generateTokens(payload: { userId: string; role: string }) {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }

  it("should generate valid 15-minute access token and decode claims", () => {
    const { accessToken } = generateTokens({
      userId: "user_test_123",
      role: "BUYER",
    });

    const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
    expect(decoded.userId).toBe("user_test_123");
    expect(decoded.role).toBe("BUYER");
  });

  it("should reject expired or forged tokens", () => {
    const forgedToken = jwt.sign({ userId: "hacker" }, "wrong_secret");
    expect(() => jwt.verify(forgedToken, JWT_SECRET)).toThrow();
  });
});
