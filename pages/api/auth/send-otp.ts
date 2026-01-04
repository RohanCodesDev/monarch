import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { sendOTPEmail } from '../../../lib/nodemailer';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, username, name, password } = req.body;

    if (!email || !username || !name || !password) {
      return res.status(400).json({ error: 'Email, username, name and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // Generate OTP and hash password for temporary storage
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const hashedPassword = await bcrypt.hash(password, 10);

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp);
      console.info(`[OTP] Sent OTP email to ${email}`);
    } catch (emailError) {
      // Fallback: Log to console if email fails
      console.log('\n' + '='.repeat(60));
      console.log('📧 OTP EMAIL (Email service unavailable - using console)');
      console.log('='.repeat(60));
      console.log(`To: ${email}`);
      console.log(`OTP Code: ${otp}`);
      console.log(`Expires: ${otpExpiry.toISOString()}`);
      console.log('='.repeat(60) + '\n');
      console.warn('[OTP] Email send failed, OTP logged to console:', emailError.message);
    }

    // Store OTP data and registration info in base64 encoded cookie
    const otpData = { email: email.toLowerCase(), username, name, hashedPassword, otp, otpExpiry: otpExpiry.toISOString() };
    const encodedData = Buffer.from(JSON.stringify(otpData)).toString('base64');
    
    res.setHeader('Set-Cookie', `otp_session=${encodedData}; Path=/; HttpOnly; Max-Age=600; SameSite=Lax`);

    return res.status(200).json({ 
      success: true,
      message: 'OTP sent to your email',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
