import nodemailer from 'nodemailer';

export async function sendVerificationCode(email: string, code: string) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    console.warn(`[Mail] SMTP_EMAIL and/or SMTP_PASSWORD not set. Code will just be logged in development.`);
    console.log(`[Mail Mock] To: ${email} | Security Code: ${code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Noble Mosaic" <${SMTP_EMAIL}>`,
    to: email,
    subject: 'Your Verification Code - Noble Mosaic',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #171717;">Welcome to Noble Mosaic!</h2>
        <p style="color: #52525b; font-size: 16px;">To access your free gift pages, please enter the following verification code:</p>
        <div style="background-color: #f4f4f5; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
          <h1 style="margin: 0; font-size: 42px; letter-spacing: 8px; color: #6b21a8; font-weight: bold;">${code}</h1>
        </div>
        <p style="color: #52525b; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #71717a; font-size: 14px; margin-top: 40px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
