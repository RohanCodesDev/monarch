import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const otpCookie = req.cookies.otp_session;
    if (!otpCookie) {
      return res.status(404).json({ error: 'No OTP session' });
    }

    const stored = JSON.parse(Buffer.from(otpCookie, 'base64').toString('utf-8'));
    if (!stored || !stored.email) {
      return res.status(404).json({ error: 'Invalid OTP session' });
    }

    const masked = stored.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    return res.status(200).json({ email: masked });
  } catch (err) {
    console.error('Error in otp-session:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
