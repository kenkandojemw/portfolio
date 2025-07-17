# EmailJS Setup Guide

To enable the contact form to send emails to your inbox, you need to set up EmailJS. Follow these steps:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Save the template and note down your **Template ID**

## Step 4: Get Your Public Key

1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)

## Step 5: Update Your Code

In `src/App.jsx`, find these lines around line 175-177:

```javascript
const serviceId = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const templateId = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
```

Replace them with your actual values:

```javascript
const serviceId = 'service_xxxxxxx'; // Your actual service ID
const templateId = 'template_xxxxxxx'; // Your actual template ID
const publicKey = 'xxxxxxxxxxxxxxx'; // Your actual public key
```

## Step 6: Test the Form

1. Save your changes
2. Start your development server: `npm start`
3. Fill out the contact form and submit
4. Check your email inbox for the message

## Template Variables

The following variables are available in your email template:
- `{{from_name}}` - The sender's name
- `{{from_email}}` - The sender's email
- `{{subject}}` - The message subject
- `{{message}}` - The message content
- `{{to_email}}` - Your email (kenkandojemw@gmail.com)

## Troubleshooting

### Common Issues:

1. **"User ID is required"** - Make sure you've set the correct public key
2. **"Service is not found"** - Check your service ID
3. **"Template is not found"** - Check your template ID
4. **Emails not arriving** - Check your spam folder

### Rate Limits:

EmailJS free plan includes:
- 200 emails per month
- 50 emails per day
- Basic support

For higher limits, consider upgrading to a paid plan.

## Security Note

The EmailJS keys used in frontend code are meant to be public. However, you can:
1. Set up domain restrictions in EmailJS dashboard
2. Enable reCAPTCHA to prevent spam
3. Set up email filters in your inbox

## Alternative Setup (Environment Variables)

For better security, you can use environment variables:

1. Create a `.env` file in your project root:
```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

2. Update the code to use environment variables:
```javascript
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
```

3. Add `.env` to your `.gitignore` file to keep keys private

## Support

If you need help with setup, you can:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Contact EmailJS support
3. Test the integration using their online debugger