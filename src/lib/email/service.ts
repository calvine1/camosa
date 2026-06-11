
interface EmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // Development: Log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('[EMAIL SERVICE] Sending email:');
      console.log(`   To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`\n${options.htmlBody}\n`);
      return { success: true };
    }

    
    const emailService = process.env.EMAIL_SERVICE || 'console';

    switch (emailService) {
      case 'resend':
        return await sendViaResend(options);
      case 'sendgrid':
        return await sendViaSendGrid(options);
      default:
        // Fallback: console logging
        console.log('[EMAIL SERVICE] Email (no provider configured):', options);
        return { success: true };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(' Email service error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}


async function sendViaResend(options: EmailOptions) {
  try {
    // Try to dynamically import Resend
    let Resend;
    try {
      const resendModule = await import('resend');
      Resend = resendModule.Resend;
    } catch (importError) {
      return {
        success: false,
        error: 'Resend package not installed. Run: npm install resend',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@camosa.dev',
      to: options.to,
      subject: options.subject,
      html: options.htmlBody,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Resend error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Send via SendGrid (https://sendgrid.com)
 * Set EMAIL_SERVICE=sendgrid and SENDGRID_API_KEY in .env
 * Install: npm install @sendgrid/mail
 */
async function sendViaSendGrid(options: EmailOptions) {
  try {
    // Try to dynamically import SendGrid
    let sgMail;
    try {
      // Optional dependency — only required when EMAIL_SERVICE=sendgrid
      sgMail = await import('@sendgrid/mail' as string);
    } catch (importError) {
      return {
        success: false,
        error: 'SendGrid package not installed. Run: npm install @sendgrid/mail',
      };
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    await sgMail.send({
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@camosa.dev',
      subject: options.subject,
      html: options.htmlBody,
      text: options.textBody,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'SendGrid error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Generate welcome email template for new tutors
 */
export function generateTutorWelcomeEmail(options: {
  tutorName: string;
  email: string;
  tempPassword: string;
  role: string;
}): { subject: string; htmlBody: string; textBody: string } {
  const subject = `Welcome to Camosa Medtech - Your Account is Ready`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .card { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .credentials { background: #f3f4f6; padding: 15px; border-radius: 6px; font-family: 'Courier New', monospace; margin: 15px 0; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; border-radius: 4px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Camosa Medtech</h1>
      <p>Your tutor account has been created</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${options.tutorName}</strong>,</p>
      
      <p>Your account as a <strong>${options.role}</strong> on Camosa Medtech has been successfully created. Below are your login credentials:</p>
      
      <div class="card">
        <h3 style="margin-top: 0;">Login Credentials</h3>
        <div class="credentials">
          <p><strong>Email:</strong><br>${options.email}</p>
          <p><strong>Temporary Password:</strong><br>${options.tempPassword}</p>
        </div>
      </div>

      <div class="warning">
        <p><strong>Important Security Notice:</strong></p>
        <p>
          This is a temporary password. You must change it immediately upon your first login. 
          Do not share this password with anyone.
        </p>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://tutor.camosa.dev'}/login" class="button">
          Go to Login
        </a>
      </p>

      <div class="card">
        <h3 style="margin-top: 0;">Next Steps:</h3>
        <ol>
          <li>Go to the login page and sign in with your email and temporary password</li>
          <li>You will be prompted to change your password immediately</li>
          <li>Create a strong, unique password that you'll remember</li>
          <li>Start managing your courses on the tutor portal</li>
        </ol>
      </div>

      <p style="color: #6b7280; font-size: 14px;">
        If you did not request this account or have any questions, please contact the Camosa Medtech administrator.
      </p>
    </div>

    <div class="footer">
      <p>© 2026 Camosa Medtech. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textBody = `
Welcome to Camosa Medtech

Your account as a ${options.role} has been successfully created.

LOGIN CREDENTIALS:
Email: ${options.email}
Temporary Password: ${options.tempPassword}

 IMPORTANT: This is a temporary password. You must change it immediately upon your first login.

NEXT STEPS:
1. Go to ${process.env.NEXT_PUBLIC_APP_URL || 'https://tutor.camosa.dev'}/login
2. Sign in with your email and temporary password
3. Change your password immediately
4. Start managing your courses

If you did not request this account, please contact support.

© 2026 Camosa Medtech
  `;

  return { subject, htmlBody, textBody };
}
