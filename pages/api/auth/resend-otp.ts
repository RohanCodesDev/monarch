import { NextApiRequest, NextApiResponse } from 'next';
// nodemailer removed: OTPs will be logged to server console for now

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const otpCookie = req.cookies.otp_session;
    if (!otpCookie) {
      return res.status(400).json({ error: 'No OTP session found' });
    }

    const stored = JSON.parse(Buffer.from(otpCookie, 'base64').toString('utf-8'));
    if (!stored || !stored.email) {
      return res.status(400).json({ error: 'Invalid OTP session' });
    }

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Log OTP to server console (no email sending configured)
    console.info(`[OTP] resend-otp for ${stored.email}: ${otp} (expires ${otpExpiry.toISOString()})`);

    // Update cookie
    stored.otp = otp;
    stored.otpExpiry = otpExpiry.toISOString();
    const encoded = Buffer.from(JSON.stringify(stored)).toString('base64');
    res.setHeader('Set-Cookie', `otp_session=${encoded}; Path=/; HttpOnly; Max-Age=600; SameSite=Lax`);

    return res.status(200).json({ success: true, message: 'OTP resent' });
  } catch (err) {
    console.error('Error in resend-otp:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
