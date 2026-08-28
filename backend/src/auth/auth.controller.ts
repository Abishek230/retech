import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import {
  getDb,
  Role,
  RegisterSchema,
  LoginSchema,
  SendOtpSchema,
  VerifyOtpSchema,
} from "@retech/database";
import {
  generateAuthTokens,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  TokenPayload,
} from "./auth.tokens";
import {
  storeRefreshTokenSession,
  validateRefreshTokenSession,
  revokeRefreshTokenSession,
  storeOtp,
  verifyAndConsumeOtp,
} from "./auth.redis";
import { generate6DigitOtp, sendOtpEmail } from "./auth.email";
import { verifyFirebaseIdToken } from "../config/firebase";

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDb();
    const validatedData = RegisterSchema.parse(req.body);
    const { email, password, name, role, businessName, avatar } = validatedData;

    // Check if user exists
    const existingUser = await db.get("SELECT * FROM User WHERE email = ?", [email.toLowerCase()]);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists.",
      });
    }

    // Hash password with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = uuidv4();
    const sellerProfileId = uuidv4();
    const cartId = uuidv4();

    // Create user and related entities using transaction
    await db.run("BEGIN TRANSACTION");

    try {
      await db.run(
        `INSERT INTO User (id, email, passwordHash, name, role, avatar) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, email.toLowerCase(), passwordHash, name, role, avatar || null]
      );

      await db.run(
        `INSERT INTO Cart (id, userId) VALUES (?, ?)`,
        [cartId, userId]
      );

      if (role === Role.SELLER) {
        await db.run(
          `INSERT INTO SellerProfile (id, userId, businessName, rating) 
           VALUES (?, ?, ?, ?)`,
          [sellerProfileId, userId, businessName || `${name}'s Refurbished Hub`, 5.0]
        );
      }
      await db.run("COMMIT");
    } catch (err) {
      await db.run("ROLLBACK");
      throw err;
    }

    const newUser = await db.get("SELECT * FROM User WHERE id = ?", [userId]);
    const sellerProfile = role === Role.SELLER ? await db.get("SELECT * FROM SellerProfile WHERE userId = ?", [userId]) : null;

    // Send OTP email
    const otp = generate6DigitOtp();
    await storeOtp(email.toLowerCase(), otp, "REGISTRATION");
    await sendOtpEmail(email.toLowerCase(), otp, "REGISTRATION");

    // Generate Tokens & Session
    const tokens = generateAuthTokens({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as Role,
    });

    await storeRefreshTokenSession(newUser.id, tokens.refreshToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Verification OTP dispatched.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role as Role,
        avatar: newUser.avatar ?? null,
        isEmailVerified: false,
        sellerProfile: sellerProfile ?? null,
      },
      tokens: {
        accessToken: tokens.accessToken,
        expiresIn: "15m",
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. POST /auth/login
// ----------------------------------------------------
export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDb();
    const { email, password } = LoginSchema.parse(req.body);

    const user: any = await db.get(`SELECT * FROM User WHERE email = ? LIMIT 1`, [email.toLowerCase()]);

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password credentials.",
      });
    }

    const sellerProfile = await db.get("SELECT * FROM SellerProfile WHERE userId = ?", [user.id]);

    // Generate Tokens & Session
    const tokens = generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    await storeRefreshTokenSession(user.id, tokens.refreshToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        avatar: user.avatar ?? null,
        isEmailVerified: false, // In raw SQL we omitted this column, assuming true or fallback
        sellerProfile: sellerProfile ?? null,
      },
      tokens: {
        accessToken: tokens.accessToken,
        expiresIn: "15m",
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. POST /auth/logout
// ----------------------------------------------------
export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.retech_refresh_token || req.body?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        await revokeRefreshTokenSession(decoded.userId);
      } catch {
        // Token might already be expired
      }
    } else if (req.user?.userId) {
      await revokeRefreshTokenSession(req.user.userId);
    }

    clearRefreshTokenCookie(res);

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. POST /auth/refresh
// ----------------------------------------------------
export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDb();
    const refreshToken = req.cookies?.retech_refresh_token || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token missing. Please log in again.",
      });
    }

    let decoded: TokenPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token.",
      });
    }

    // Verify against Redis session store
    const isValidSession = await validateRefreshTokenSession(decoded.userId, refreshToken);
    if (!isValidSession) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        error: "Session invalidated or expired in Redis. Please log in again.",
      });
    }

    // Fetch user
    const user = await db.get("SELECT * FROM User WHERE id = ?", [decoded.userId]);

    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        success: false,
        error: "User account no longer exists.",
      });
    }
    const sellerProfile = await db.get("SELECT * FROM SellerProfile WHERE userId = ?", [user.id]);

    // Issue new Access Token (and rotate Refresh Token for maximum security)
    const newTokens = generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    await storeRefreshTokenSession(user.id, newTokens.refreshToken);
    setRefreshTokenCookie(res, newTokens.refreshToken);

    return res.json({
      success: true,
      tokens: {
        accessToken: newTokens.accessToken,
        expiresIn: "15m",
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        avatar: user.avatar ?? null,
        isEmailVerified: true,
        sellerProfile: sellerProfile ?? null,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 5. POST /auth/otp/send
// ----------------------------------------------------
export async function sendOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, purpose } = SendOtpSchema.parse(req.body);

    const otp = generate6DigitOtp();
    await storeOtp(email, otp, purpose);
    await sendOtpEmail(email, otp, purpose);

    return res.json({
      success: true,
      message: `Verification OTP dispatched to ${email}.`,
      expiresIn: "5m",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 6. POST /auth/otp/verify
// ----------------------------------------------------
export async function verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDb();
    const { email, otp, purpose } = VerifyOtpSchema.parse(req.body);

    const isValid = await verifyAndConsumeOtp(email, otp, purpose);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP code.",
      });
    }

    // Mark email as verified if user exists
    let user = await db.get("SELECT * FROM User WHERE email = ?", [email.toLowerCase()]);

    if (user) {
      await db.run("UPDATE User SET isEmailVerified = 1 WHERE id = ?", [user.id]);
      user.isEmailVerified = 1;

      const sellerProfile = await db.get("SELECT * FROM SellerProfile WHERE userId = ?", [user.id]);

      // If logging in via OTP, generate tokens
      if (purpose === "LOGIN" || purpose === "REGISTRATION") {
        const tokens = generateAuthTokens({
          userId: user.id,
          email: user.email,
          role: user.role as Role,
        });

        await storeRefreshTokenSession(user.id, tokens.refreshToken);
        setRefreshTokenCookie(res, tokens.refreshToken);

        return res.json({
          success: true,
          message: "OTP verified successfully.",
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
            avatar: user.avatar ?? null,
            isEmailVerified: true,
            sellerProfile: sellerProfile ?? null,
          },
          tokens: {
            accessToken: tokens.accessToken,
            expiresIn: "15m",
          },
        });
      }
    }

    return res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 7. GET /auth/google & GET /auth/google/callback
// ----------------------------------------------------
export function googleAuthHandler(req: Request, res: Response) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "retech_mock_google_client_id.apps.googleusercontent.com";
  const redirectUri = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google/callback`;
  const role = (req.query.role as string) || "BUYER";

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid%20email%20profile&state=${encodeURIComponent(
    JSON.stringify({ role })
  )}&access_type=offline&prompt=consent`;

  return res.redirect(googleAuthUrl);
}

export async function googleCallbackHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDb();
    const { code, state } = req.query;

    let role: Role = Role.BUYER;
    if (state && typeof state === "string") {
      try {
        const parsedState = JSON.parse(state);
        if (parsedState.role && Object.values(Role).includes(parsedState.role)) {
          role = parsedState.role as Role;
        }
      } catch {
        // Fallback default role
      }
    }

    // Mock/Simulate Google Profile or exchange with Google API
    const mockEmail = `google.user.${Date.now().toString().slice(-4)}@retech.eco`;
    const mockName = "Google Verified User";
    const mockAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";

    // Upsert User manually
    let user = await db.get("SELECT * FROM User WHERE email = ?", [mockEmail]);
    if (!user) {
      const userId = uuidv4();
      await db.run(
        `INSERT INTO User (id, email, passwordHash, name, role, avatar) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, mockEmail, "google_auth", mockName, role, mockAvatar]
      );
      user = await db.get("SELECT * FROM User WHERE id = ?", [userId]);

      await db.run(`INSERT INTO Cart (id, userId) VALUES (?, ?)`, [uuidv4(), userId]);

      if (role === Role.SELLER) {
        await db.run(
          `INSERT INTO SellerProfile (id, userId, businessName, rating) VALUES (?, ?, ?, ?)`,
          [uuidv4(), userId, mockName + "'s Circular Store", 5.0]
        );
      }
    }

    const tokens = generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    await storeRefreshTokenSession(user.id, tokens.refreshToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontendUrl}/login?token=${tokens.accessToken}&success=google_auth`);
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 8. GET /auth/me (Protected)
// ----------------------------------------------------
export async function getMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDb();
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const user = await db.get("SELECT * FROM User WHERE id = ?", [req.user.userId]);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const sellerProfile = await db.get("SELECT * FROM SellerProfile WHERE userId = ?", [user.id]);
    const cart = await db.get("SELECT * FROM Cart WHERE userId = ?", [user.id]);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        avatar: user.avatar ?? null,
        isEmailVerified: true,
        sellerProfile: sellerProfile ?? null,
        cart: cart ?? null,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 10. POST /auth/firebase (Firebase Auth Exchange)
// ----------------------------------------------------
export async function firebaseAuthHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await getDb();
    const { idToken, role: selectedRole, businessName } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: "Firebase idToken is required.",
      });
    }

    const decoded = await verifyFirebaseIdToken(idToken);
    if (!decoded || !decoded.email) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired Firebase ID token.",
      });
    }

    const role: Role =
      selectedRole && Object.values(Role).includes(selectedRole)
        ? (selectedRole as Role)
        : Role.BUYER;
    const name = decoded.name || decoded.displayName || "ReTech User";
    const avatar = decoded.picture || decoded.photoURL || null;

    let user = await db.get("SELECT * FROM User WHERE email = ?", [decoded.email.toLowerCase()]);

    if (!user) {
      const userId = uuidv4();
      await db.run(
        `INSERT INTO User (id, email, passwordHash, name, role, avatar) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, decoded.email.toLowerCase(), "firebase_auth", name, role, avatar || null]
      );
      user = await db.get("SELECT * FROM User WHERE id = ?", [userId]);

      await db.run(`INSERT INTO Cart (id, userId) VALUES (?, ?)`, [uuidv4(), userId]);

      if (role === Role.SELLER) {
        await db.run(
          `INSERT INTO SellerProfile (id, userId, businessName, rating) VALUES (?, ?, ?, ?)`,
          [uuidv4(), userId, businessName || `${name}'s Circular Store`, 5.0]
        );
      }
    } else if (avatar && !user.avatar) {
      await db.run(`UPDATE User SET avatar = ? WHERE id = ?`, [avatar, user.id]);
      user.avatar = avatar;
    }

    const sellerProfile = await db.get("SELECT * FROM SellerProfile WHERE userId = ?", [user.id]);

    const tokens = generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    await storeRefreshTokenSession(user.id, tokens.refreshToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.json({
      success: true,
      message: "Firebase authentication successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        avatar: user.avatar ?? null,
        isEmailVerified: true,
        sellerProfile: sellerProfile ?? null,
      },
      tokens: {
        accessToken: tokens.accessToken,
        expiresIn: "15m",
      },
    });
  } catch (error) {
    next(error);
  }
}
