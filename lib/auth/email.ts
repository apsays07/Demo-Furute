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

/**
 * Sends a real-time security alert email notification on a successful login.
 * If SMTP credentials are not configured, it logs the alert details to the console.
 */
export async function sendLoginAlertEmail(toEmail: string, ip: string): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "admin@furute.in";
  const timeString = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "medium",
  });

  console.log(`[Security Alert] Initiated login alert email for ${toEmail} from IP ${ip}`);

  if (!host || !user || !pass) {
    console.log(
      `\n============================================================\n` +
      `[DEV ONLY] SMTP is not configured in .env.local.\n` +
      `[SECURITY ALERT] Successful admin login detected!\n` +
      `User: ${toEmail}\n` +
      `IP Address: ${ip}\n` +
      `Time (IST): ${timeString}\n` +
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
      from: `"Furute Security" <${from}>`,
      to: toEmail,
      subject: "Security Alert: Successful Admin Login Detected",
      text: `Hello,\n\nThis is a security notification to inform you that your Furute Admin Portal account was successfully accessed.\n\nLogin Details:\n- Email: ${toEmail}\n- IP Address: ${ip}\n- Date/Time: ${timeString} (IST)\n\nIf this was you, no action is needed. If you did not log in, please reset your password immediately.\n\nBest regards,\nFurute Security Team`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; border: 1px solid #f1f5f9; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 50%; padding: 12px; margin-bottom: 12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 800; tracking-tight: -0.025em;">Security Login Alert</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Furute Administrative Portal</p>
          </div>
          
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">Hello,</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">This email confirms a new successful login into the Furute Admin Portal with your credentials:</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #475569;">
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b; width: 100px;">Account:</td>
                <td style="padding: 6px 0;">${toEmail}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">IP Address:</td>
                <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #0f172a;">${ip}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">Time (IST):</td>
                <td style="padding: 6px 0;">${timeString}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0;">
            If this was you, you can safely ignore this alert. If you do not recognize this activity, please change your password immediately and contact your system administrator.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Furute. All rights reserved.</p>
        </div>
      `,
    });

    console.log(`Successfully dispatched Login Alert email to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("Failed to send Login Alert email via SMTP:", error);
    return false;
  }
}

