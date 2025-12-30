import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '🔐 Monarch - Email Verification OTP',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
              .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #333; margin: 0; font-size: 28px; }
              .header p { color: #666; margin: 5px 0 0 0; font-size: 14px; }
              .content { text-align: center; margin: 30px 0; }
              .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin: 20px 0; }
              .otp-box .label { font-size: 14px; opacity: 0.9; margin-bottom: 10px; }
              .otp-box .code { font-size: 48px; font-weight: bold; letter-spacing: 10px; font-family: 'Courier New', monospace; }
              .info { color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0; }
              .expiry { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 12px; border-radius: 4px; font-size: 13px; margin: 20px 0; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏛️ Monarch</h1>
                <p>Historic Artifacts Explorer</p>
              </div>
              
              <div class="content">
                <h2 style="color: #333; margin-bottom: 10px;">Email Verification</h2>
                <p style="color: #666;">Enter this OTP to verify your email address</p>
              </div>

              <div class="otp-box">
                <div class="label">Your Verification Code</div>
                <div class="code">${otp}</div>
              </div>

              <div class="info">
                <p>This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
              </div>

              <div class="expiry">
                ⏱️ If you didn't request this verification, you can safely ignore this email.
              </div>

              <div class="footer">
                <p>© 2025 Monarch. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export async function sendWelcomeEmail(email: string, username: string) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '✨ Welcome to Monarch - Historic Artifacts Explorer',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
              .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #333; margin: 0; font-size: 28px; }
              .header p { color: #666; margin: 5px 0 0 0; font-size: 14px; }
              .content { margin: 30px 0; }
              .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
              .features { margin: 20px 0; }
              .feature { padding: 12px; margin: 10px 0; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; }
              .feature strong { color: #667eea; }
              .cta { text-align: center; margin: 30px 0; }
              .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏛️ Monarch</h1>
                <p>Historic Artifacts Explorer</p>
              </div>
              
              <div class="content">
                <div class="greeting">Welcome, <strong>${username}</strong>! 🎉</div>
                <p style="color: #666;">Your email has been verified. You can now explore historic artifacts and civilizations.</p>
                
                <div class="features">
                  <div class="feature">
                    <strong>📸 Analyze Artifacts</strong> - Upload images and get AI-powered analysis
                  </div>
                  <div class="feature">
                    <strong>🎨 Generate Art</strong> - Create historic-inspired artwork with AI
                  </div>
                  <div class="feature">
                    <strong>📚 Encyclopedia</strong> - Explore curated collection of artifacts
                  </div>
                </div>

                <div class="cta">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/homepg" class="button">Start Exploring</a>
                </div>
              </div>

              <div class="footer">
                <p>© 2025 Monarch. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}
