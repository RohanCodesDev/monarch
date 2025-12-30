import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
// nodemailer removed: welcome emails disabled

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: 'OTP is required' });
    }

    // Get OTP data from cookies
    const otpCookie = req.cookies.otp_session;
    if (!otpCookie) {
      return res.status(400).json({ error: 'OTP expired or not found. Please start over.' });
    }

    let storedOtpData;
    try {
      const decodedData = Buffer.from(otpCookie, 'base64').toString('utf-8');
      storedOtpData = JSON.parse(decodedData);
    } catch (err) {
      console.error('Cookie decode error:', err);
      return res.status(400).json({ error: 'Invalid OTP session' });
    }

    // Normalize stored email
    const storedEmail = storedOtpData.email.toLowerCase().trim();

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check OTP expiry
    if (new Date() > new Date(storedOtpData.otpExpiry)) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: storedEmail }, { username: storedOtpData.username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === storedEmail 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // Create user with verified email using hashed password from session
    const user = await prisma.user.create({
      data: {
        email: storedEmail,
        username: storedOtpData.username,
        name: storedOtpData.name,
        password: storedOtpData.hashedPassword,
        isEmailVerified: true,
      },
    });

    // Welcome email disabled (nodemailer removed). Log a message instead.
    console.info(`[WELCOME] Account created for ${storedEmail} (username: ${storedOtpData.username})`);

    // Clear OTP cookie
    res.setHeader('Set-Cookie', 'otp_session=; Path=/; HttpOnly; Max-Age=0');

    return res.status(201).json({ 
      success: true,
      message: 'Email verified and account created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
