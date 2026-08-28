import { Request, Response, NextFunction } from "express";
import { Role } from "@retech/database";
import { verifyAccessToken, TokenPayload } from "./auth.tokens";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Check Authorization Header: Bearer <token>
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.retech_access_token) {
    token = req.cookies.retech_access_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please provide a valid bearer token.",
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Access token expired. Please refresh your session.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      error: "Invalid or malformed access token.",
      code: "INVALID_TOKEN",
    });
  }
}

export function requireRole(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' is not authorized to access this resource. Required: [${allowedRoles.join(", ")}]`,
      });
    }

    return next();
  };
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.retech_access_token) {
    token = req.cookies.retech_access_token;
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch {
      // Ignore errors for optional authentication
    }
  }

  return next();
}
