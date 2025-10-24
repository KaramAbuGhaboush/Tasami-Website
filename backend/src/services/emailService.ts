import nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Contact message interface
interface ContactMessage {
  name: string;
  email: string;
  company?: string;
  message: string;
  service: string;
  budget: string;
  createdAt: Date;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize SMTP transporter only if credentials are provided
    const hasCredentials = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (hasCredentials) {
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      };

      this.transporter = nodemailer.createTransport(config);
    } else {
      console.warn('Email service not configured: Missing SMTP credentials');
      this.transporter = null as any;
    }
  }

  /**
   * Send contact form notification to admin emails
   */
  async sendContactNotification(contactMessage: ContactMessage): Promise<void> {
    if (!this.transporter) {
      console.warn('Email service not configured: Skipping email notification');
      return;
    }

    try {
      const adminEmails = ['admin@tasami.co', 'osayd@tasami.co'];
      
      const mailOptions = {
        from: `"Tasami Website" <${process.env.SMTP_USER}>`,
        to: adminEmails.join(', '),
        subject: `New Contact Form Submission - ${contactMessage.name}`,
        html: this.generateContactEmailHTML(contactMessage),
        text: this.generateContactEmailText(contactMessage)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Contact notification email sent:', info.messageId);
    } catch (error) {
      console.error('Error sending contact notification email:', error);
      throw error;
    }
  }

  /**
   * Generate HTML email content for contact form
   */
  private generateContactEmailHTML(contactMessage: ContactMessage): string {
    const { name, email, company, message, service, budget, createdAt } = contactMessage;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #495057; }
          .value { margin-top: 5px; padding: 8px; background-color: #f8f9fa; border-radius: 4px; }
          .message-content { white-space: pre-wrap; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 New Contact Form Submission</h2>
            <p>A new message has been received through the Tasami website contact form.</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">👤 Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            
            ${company ? `
            <div class="field">
              <div class="label">🏢 Company:</div>
              <div class="value">${company}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">🛠️ Service Interested In:</div>
              <div class="value">${service}</div>
            </div>
            
            <div class="field">
              <div class="label">💰 Budget Range:</div>
              <div class="value">${budget}</div>
            </div>
            
            <div class="field">
              <div class="label">💬 Message:</div>
              <div class="value message-content">${message}</div>
            </div>
            
            <div class="field">
              <div class="label">⏰ Submitted At:</div>
              <div class="value">${new Date(createdAt).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was automatically generated by the Tasami website contact form system.</p>
            <p>Please respond directly to the customer's email address: <a href="mailto:${email}">${email}</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate plain text email content for contact form
   */
  private generateContactEmailText(contactMessage: ContactMessage): string {
    const { name, email, company, message, service, budget, createdAt } = contactMessage;
    
    return `
New Contact Form Submission - Tasami Website

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
Service Interested In: ${service}
Budget Range: ${budget}

Message:
${message}

Submitted At: ${new Date(createdAt).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}

---
This email was automatically generated by the Tasami website contact form system.
Please respond directly to the customer's email address: ${email}
    `.trim();
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email service not configured: Cannot test connection');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default EmailService;
