import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.ethereal.email";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (user && pass) {
    if (host.includes("gmail") || process.env.SMTP_SERVICE === "gmail") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
  } else {
    // Development / Test transporter
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "retech.dev@ethereal.email",
        pass: "retech_dev_pass_2026",
      },
    });
  }

  return transporter;
}

export function generate6DigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(
  toEmail: string,
  otp: string,
  purpose: string
): Promise<{ success: boolean; previewUrl?: string }> {
  try {
    const mailClient = getEmailTransporter();

    const subjectMap: Record<string, string> = {
      REGISTRATION: "Verify your ReTech Account — Your One-Time Passcode",
      LOGIN: "ReTech Login Authentication Code",
      PASSWORD_RESET: "ReTech Password Reset Verification Code",
      VERIFICATION: "ReTech Email Verification Code",
    };

    const titleMap: Record<string, string> = {
      REGISTRATION: "Welcome to ReTech Circular Marketplace",
      LOGIN: "ReTech Security Verification",
      PASSWORD_RESET: "Reset Your Account Password",
      VERIFICATION: "Verify Your Email Address",
    };

    const subject = subjectMap[purpose] || "Your ReTech Authentication Code";
    const title = titleMap[purpose] || "Authentication Verification";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F3EA; margin: 0; padding: 20px; color: #3D2B22; }
    .container { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EFE5D3; overflow: hidden; box-shadow: 0 4px 20px rgba(138, 102, 82, 0.08); }
    .header { background-color: #641F2A; padding: 24px; text-align: center; color: #F8F3EA; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
    .content { padding: 32px 24px; text-align: center; }
    .otp-box { margin: 24px auto; background-color: #F8F3EA; border: 2px dashed #8A6652; border-radius: 12px; padding: 18px; max-width: 260px; }
    .otp-code { font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #641F2A; margin: 0; }
    .footer { background-color: #EDE5E1; padding: 16px; text-align: center; font-size: 11px; color: #755442; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ReTech</h1>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #F8F3EA; opacity: 0.9;">AI-Powered Circular Electronics</p>
    </div>
    <div class="content">
      <h2 style="color: #3D2B22; font-size: 20px; margin-top: 0;">${title}</h2>
      <p style="color: #755442; font-size: 14px; line-height: 1.6;">
        Use the single-use 6-digit passcode below to authenticate your request. This code expires in <strong>5 minutes</strong>.
      </p>
      <div class="otp-box">
        <p class="otp-code">${otp}</p>
      </div>
      <p style="color: #8A6652; font-size: 12px; margin-bottom: 0;">
        If you did not request this verification code, please ignore this email or contact support@retech.eco.
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} ReTech Inc. Circular Electronics Marketplace. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    console.log(`\n======================================================`);
    console.log(`✉️  [Nodemailer Dispatch] Sending OTP to: ${toEmail}`);
    console.log(`🔑  [OTP Code]: >>> ${otp} <<< (Purpose: ${purpose})`);
    console.log(`======================================================\n`);

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await mailClient.sendMail({
        from: process.env.SMTP_FROM || `"ReTech Security" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✅ [Nodemailer] OTP email successfully delivered to ${toEmail}`);
    } else {
      console.log(`ℹ️  [Nodemailer] No SMTP credentials configured. Check console above for OTP code.`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("❌ Failed to dispatch OTP email:", error.message);
    return { success: false };
  }
}
