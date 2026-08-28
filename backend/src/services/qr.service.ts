import QRCode from "qrcode";

export async function generatePassportQrDataUrl(deviceId: string): Promise<string> {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const passportUrl = `${frontendUrl}/passport/${deviceId}`;

  return await QRCode.toDataURL(passportUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    color: {
      dark: "#641F2A", // Burgundy color
      light: "#FFFFFF",
    },
    width: 320,
  });
}

export async function generatePassportQrBuffer(deviceId: string): Promise<Buffer> {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const passportUrl = `${frontendUrl}/passport/${deviceId}`;

  return await QRCode.toBuffer(passportUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    color: {
      dark: "#641F2A",
      light: "#FFFFFF",
    },
    width: 320,
  });
}
