# Email Notification Setup

## Overview
The contact form now sends email notifications to `admin@tasami.co` and `osayd@tasami.co` whenever someone submits a contact message.

## Setup Instructions

### 1. Create Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-jwt-secret-here"

# Server Port
PORT=3002

# Email Configuration (SMTP)
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="system@tasami.co"
SMTP_PASS="your-email-password-here"
```

### 2. Email Provider Configuration

#### For Custom SMTP (Recommended for system@tasami.co):
```env
SMTP_HOST="mail.tasami.co"  # or your SMTP server
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="system@tasami.co"
SMTP_PASS="your-password"
```

#### For Gmail (if using Gmail):
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="system@tasami.co"
SMTP_PASS="your-app-password"  # Use App Password, not regular password
```

#### For Outlook/Hotmail:
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="system@tasami.co"
SMTP_PASS="your-password"
```

### 3. Test Email Configuration
After setting up the environment variables, test the email configuration:

```bash
# Start the backend server
npm run dev

# Test email configuration (requires authentication)
POST /contact/test-email
```

### 4. How It Works

1. **Contact Form Submission**: When someone submits the contact form via `POST /contact/messages`
2. **Database Save**: The message is saved to the database
3. **Email Notification**: An email is automatically sent to both:
   - `admin@tasami.co`
   - `osayd@tasami.co`
4. **Error Handling**: If email fails, the contact form still works (non-blocking)

### 5. Email Content

The email includes:
- Contact person's name and email
- Company (if provided)
- Service they're interested in
- Budget range
- Their message
- Submission timestamp
- Direct reply link to customer's email

### 6. Features

- **HTML & Text Emails**: Both HTML and plain text versions
- **Professional Styling**: Clean, branded email template
- **Error Handling**: Contact form works even if email fails
- **Logging**: Email success/failure is logged to console
- **Test Endpoint**: `/contact/test-email` to verify configuration

### 7. Security Notes

- Store email credentials in environment variables only
- Use App Passwords for Gmail (not regular passwords)
- Consider using a dedicated email service for production
- Monitor email logs for delivery issues

## Troubleshooting

### Common Issues:

1. **Authentication Failed**: Check SMTP credentials
2. **Connection Timeout**: Verify SMTP host and port
3. **SSL/TLS Issues**: Try different `SMTP_SECURE` values (true/false)
4. **Gmail Issues**: Use App Password, not regular password

### Testing:

```bash
# Test SMTP connection
curl -X POST http://localhost:3002/contact/test-email \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

The email system is now ready to use! 🎉
