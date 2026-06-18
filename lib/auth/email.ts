import nodemailer from "nodemailer";

/**
 * Sends a One-Time Password (OTP) to the specified email address.
 * If SMTP credentials are not configured in the environment, it logs the OTP
 * to the console for development.
 */
export async function sendOtpEmail(toEmail: string, otp: string): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "admin@furute.in";

  console.log(`[OTP Verification] Initiated OTP generation: ${otp} for ${toEmail}`);

  if (!host || !user || !pass) {
    console.log(
      `\n============================================================\n` +
      `[DEV ONLY] SMTP is not configured in .env.local.\n` +
      `Your login OTP for ${toEmail} is: ${otp}\n` +
      `============================================================\n`
    );
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: port === "465",
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"Furute Control Center" <${from}>`,
      to: toEmail,
      subject: "Verification Code: Furute Admin Login",
      text: `Hello,\n\nYour verification code (OTP) for logging into the Furute Admin Portal is: ${otp}\n\nThis OTP is valid for 15 minutes. If you did not attempt to sign in, please disregard this email.\n\nBest regards,\nFurute Support`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0d9488; margin: 0; font-size: 22px; font-weight: 800; tracking-tight: -0.025em;">FURUTE CONTROL CENTER</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Two-Factor Authentication</p>
          </div>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">Hello,</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">Your verification code to access the Furute administrative workspace is:</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-family: Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f172a; border: 2px dashed #cbd5e1; padding: 12px 28px; background-color: #f8fafc; border-radius: 12px; display: inline-block;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0 0 24px 0;">This OTP code is temporary and will expire in <strong>15 minutes</strong>. If you did not initiate this login request, please secure your credentials immediately.</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Furute. All rights reserved.</p>
        </div>
      `,
    });

    console.log(`Successfully dispatched OTP email to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("Failed to send OTP email via SMTP:", error);
    return false;
  }
}
