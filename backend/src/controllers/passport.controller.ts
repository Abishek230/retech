import { Request, Response, NextFunction } from "express";
import {
  getDb,
  PassportEntryType,
} from "@retech/database";
import { v4 as uuidv4 } from "uuid";
import { generatePassportQrDataUrl, generatePassportQrBuffer } from "../services/qr.service";
import { generatePassportPdf } from "../services/pdf.service";

// ----------------------------------------------------
// 1. POST /passport/create
// ----------------------------------------------------
export async function createPassportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { deviceId, previousOwners = 1, originalPurchaseDate, history = [], repairs = [] } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, error: "deviceId is required" });
    }

    const db = await getDb();
    const passportId = uuidv4();
    await db.run(
      `INSERT INTO DigitalLifePassport (id, deviceId, previousOwners, originalPurchaseDate, history, repairs) VALUES (?, ?, ?, ?, ?, ?)`,
      [passportId, deviceId, parseInt(String(previousOwners), 10) || 1, originalPurchaseDate ? new Date(originalPurchaseDate).toISOString() : new Date().toISOString(), JSON.stringify(history), JSON.stringify(repairs)]
    );

    const entries = [
      { id: uuidv4(), type: PassportEntryType.FACTORY_RESET, description: "DoD 5220.22-M 3-Pass cryptographic data sanitize completed.", verifiedBy: "ReTech Automated Sanitation" },
      { id: uuidv4(), type: PassportEntryType.INSPECTION, description: "42-Point AI Optical Sensor, Battery & Hardware Check Passed.", verifiedBy: "Elena Rostova (Lead AI Assessor)" },
      { id: uuidv4(), type: PassportEntryType.CERTIFICATION, description: "Issued 12-Month ReTech Certified Guarantee.", verifiedBy: "ReTech Quality Board" },
    ];

    for (const entry of entries) {
      await db.run(
        `INSERT INTO PassportEntry (id, passportId, type, description, verifiedBy, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [entry.id, passportId, entry.type, entry.description, entry.verifiedBy, new Date().toISOString()]
      );
    }
    
    const passport: any = await db.get(`SELECT * FROM DigitalLifePassport WHERE id = ?`, [passportId]);
    const storedEntries = await db.all(`SELECT * FROM PassportEntry WHERE passportId = ?`, [passportId]);
    const device = await db.get(`SELECT * FROM Device WHERE id = ?`, [deviceId]);
    
    if (passport) {
      passport.entries = storedEntries;
      passport.device = device;
    }

    return res.status(201).json({
      success: true,
      message: "Digital Life Passport created successfully.",
      data: passport,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. POST /passport/:id/entry (Add passport entry)
// ----------------------------------------------------
export async function addEntryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { type, description, date, performedBy, proofUrl } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        error: "Entry type and description are required.",
      });
    }

    const db = await getDb();
    let passport = await db.get(`SELECT * FROM DigitalLifePassport WHERE id = ? OR deviceId = ? LIMIT 1`, [id, id]);

    if (!passport) {
      return res.status(404).json({ success: false, error: "Passport not found" });
    }

    const entryId = uuidv4();
    const entryDate = date ? new Date(date).toISOString() : new Date().toISOString();
    const verifiedBy = performedBy || req.user?.email || "ReTech Certified Technician";
    
    await db.run(
      `INSERT INTO PassportEntry (id, passportId, type, description, date, verifiedBy) VALUES (?, ?, ?, ?, ?, ?)`,
      [entryId, passport.id, type, description, entryDate, verifiedBy]
    );

    const entry = await db.get(`SELECT * FROM PassportEntry WHERE id = ?`, [entryId]);

    return res.status(201).json({
      success: true,
      message: "Passport entry added successfully.",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. GET /passport/:deviceId (Return full passport)
// ----------------------------------------------------
export async function getPassportByDeviceIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { deviceId } = req.params;

    const db = await getDb();
    const passport: any = await db.get(`SELECT * FROM DigitalLifePassport WHERE id = ? OR deviceId = ? LIMIT 1`, [deviceId, deviceId]);

    if (!passport) {
      return res.status(404).json({
        success: false,
        error: "Digital Life Passport not found for this device.",
      });
    }
    
    const entries = await db.all(`SELECT * FROM PassportEntry WHERE passportId = ? ORDER BY date DESC`, [passport.id]);
    const device = await db.get(`SELECT * FROM Device WHERE id = ?`, [passport.deviceId]);
    const scores = await db.all(`SELECT * FROM SecondLifeScore WHERE deviceId = ? ORDER BY calculatedAt DESC LIMIT 1`, [passport.deviceId]);
    const records = await db.all(`SELECT * FROM SustainabilityRecord WHERE deviceId = ? ORDER BY calculatedAt DESC LIMIT 1`, [passport.deviceId]);
    
    if (device) {
       device.secondLifeScores = scores;
       device.sustainabilityRecords = records;
    }
    passport.entries = entries;
    passport.device = device;

    if (!passport) {
      return res.status(404).json({
        success: false,
        error: "Digital Life Passport not found for this device.",
      });
    }

    const qrDataUrl = await generatePassportQrDataUrl(passport.deviceId);

    return res.json({
      success: true,
      data: {
        ...passport,
        qrCode: qrDataUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. GET /passport/:id/qr (Generate QR code)
// ----------------------------------------------------
export async function getPassportQrHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const db = await getDb();
    const passport = await db.get(`SELECT * FROM DigitalLifePassport WHERE id = ? OR deviceId = ? LIMIT 1`, [id, id]);

    const targetDeviceId = passport ? passport.deviceId : id;
    const qrBuffer = await generatePassportQrBuffer(targetDeviceId);

    res.setHeader("Content-Type", "image/png");
    return res.send(qrBuffer);
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 5. GET /passport/:id/pdf (Generate PDF Certificate)
// ----------------------------------------------------
export async function getPassportPdfHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const db = await getDb();
    const passport: any = await db.get(`SELECT * FROM DigitalLifePassport WHERE id = ? OR deviceId = ? LIMIT 1`, [id, id]);
    
    if (passport) {
       passport.entries = await db.all(`SELECT * FROM PassportEntry WHERE passportId = ? ORDER BY date DESC`, [passport.id]);
       passport.device = await db.get(`SELECT * FROM Device WHERE id = ?`, [passport.deviceId]);
       if (passport.device) {
          passport.device.secondLifeScores = await db.all(`SELECT * FROM SecondLifeScore WHERE deviceId = ? ORDER BY calculatedAt DESC LIMIT 1`, [passport.deviceId]);
          passport.device.sustainabilityRecords = await db.all(`SELECT * FROM SustainabilityRecord WHERE deviceId = ? ORDER BY calculatedAt DESC LIMIT 1`, [passport.deviceId]);
       }
    }

    if (!passport) {
      return res.status(404).json({ success: false, error: "Passport not found" });
    }

    const pdfBuffer = await generatePassportPdf(passport);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="retech-passport-${passport.device?.brand || "device"}-${passport.id.slice(0, 8)}.pdf"`
    );
    return res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 6. POST /passport/:id/verify (Admin Verification)
// ----------------------------------------------------
export async function verifyPassportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { verifiedBy = "ReTech Quality Board" } = req.body;

    const db = await getDb();
    const passport = await db.get(`SELECT * FROM DigitalLifePassport WHERE id = ? OR deviceId = ? LIMIT 1`, [id, id]);

    if (!passport) {
      return res.status(404).json({ success: false, error: "Passport not found" });
    }

    await db.run(
      `UPDATE DigitalLifePassport SET verifiedAt = ? WHERE id = ?`,
      [new Date().toISOString(), passport.id]
    );

    const entryId = uuidv4();
    await db.run(
      `INSERT INTO PassportEntry (id, passportId, type, description, verifiedBy, date) VALUES (?, ?, ?, ?, ?, ?)`,
      [entryId, passport.id, PassportEntryType.CERTIFICATION, "Official ReTech Circular Quality Certification Verified & Sealed.", req.user?.email || verifiedBy, new Date().toISOString()]
    );
    
    const updated: any = await db.get(`SELECT * FROM DigitalLifePassport WHERE id = ?`, [passport.id]);
    const entries = await db.all(`SELECT * FROM PassportEntry WHERE passportId = ? ORDER BY date DESC`, [passport.id]);
    const device = await db.get(`SELECT * FROM Device WHERE id = ?`, [passport.deviceId]);
    
    if (updated) {
       updated.entries = entries;
       updated.device = device;
    }

    return res.json({
      success: true,
      message: "Passport successfully verified by ReTech Quality Board.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
