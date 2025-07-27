const nodemailer = require('nodemailer');
const logger = require('./logger');

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Welcome to Kingdom Snacks - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff8c00, #ff6b35); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; background: #ff8c00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏰 Kingdom Snacks</h1>
            <p>Welcome to Rwanda's Finest Snacks & Cakes</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Welcome to Kingdom Snacks! We're excited to have you join our community of snack lovers in Musanze, Kigali.</p>
            <p>To complete your registration and start enjoying our delicious snacks and cakes, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify My Email</a>
            </div>
            <p>This verification link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with Kingdom Snacks, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <h3>Why Choose Kingdom Snacks?</h3>
              <ul>
                <li>🍰 Fresh, hygienic snacks and cakes</li>
                <li>🚚 Fast delivery across Musanze</li>
                <li>💎 Loyalty rewards program</li>
                <li>📱 Easy online ordering</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>Kingdom Snacks - Musanze, Kigali, Rwanda</p>
            <p>📞 +250 788 123 456 | 📧 info@kingdomsnacks.rw</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Kingdom Snacks - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff8c00, #ff6b35); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏰 Kingdom Snacks</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>We received a request to reset your password for your Kingdom Snacks account.</p>
            <p>If you requested this password reset, click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset My Password</a>
            </div>
            <div class="warning">
              <strong>⚠️ Important Security Information:</strong>
              <ul>
                <li>This reset link will expire in 10 minutes</li>
                <li>You can only use this link once</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your current password remains unchanged until you create a new one</li>
              </ul>
            </div>
            <p>For security reasons, if you did not request this password reset, please contact our support team immediately.</p>
          </div>
          <div class="footer">
            <p>Kingdom Snacks - Musanze, Kigali, Rwanda</p>
            <p>📞 +250 788 123 456 | 📧 info@kingdomsnacks.rw</p>
            <p style="font-size: 12px; margin-top: 10px;">If you're having trouble clicking the button, copy and paste this URL into your browser:<br>${data.resetUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmed - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff8c00, #ff6b35); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: #ff8c00; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏰 Kingdom Snacks</h1>
            <p>Order Confirmation</p>
          </div>
          <div class="content">
            <h2>Thank you, ${data.customerName}!</h2>
            <p>Your order has been confirmed and is being prepared with love and care.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Order Date:</strong> ${data.orderDate}</p>
              <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
              
              <h4>Items Ordered:</h4>
              ${data.items.map(item => `
                <div class="item">
                  <strong>${item.name}</strong> x ${item.quantity}
                  <span style="float: right;">${item.price} RWF</span>
                </div>
              `).join('')}
              
              <div style="text-align: right; margin-top: 20px;">
                <p>Subtotal: ${data.subtotal} RWF</p>
                ${data.discount > 0 ? `<p>Discount: -${data.discount} RWF</p>` : ''}
                <p>Delivery Fee: ${data.deliveryFee} RWF</p>
                <p class="total">Total: ${data.total} RWF</p>
              </div>
            </div>
            
            <div class="order-details">
              <h4>Delivery Information</h4>
              <p><strong>Address:</strong> ${data.deliveryAddress}</p>
              <p><strong>Phone:</strong> ${data.customerPhone}</p>
              ${data.deliveryInstructions ? `<p><strong>Instructions:</strong> ${data.deliveryInstructions}</p>` : ''}
            </div>
            
            <p>You can track your order status by logging into your account on our website.</p>
          </div>
          <div class="footer">
            <p>Kingdom Snacks - Musanze, Kigali, Rwanda</p>
            <p>📞 +250 788 123 456 | 📧 info@kingdomsnacks.rw</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderStatusUpdate: (data) => ({
    subject: `Order Update - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff8c00, #ff6b35); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .status-box { background: ${data.statusColor}; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏰 Kingdom Snacks</h1>
            <p>Order Status Update</p>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName}!</h2>
            <p>Your order <strong>${data.orderNumber}</strong> status has been updated.</p>
            
            <div class="status-box">
              <h3>${data.statusEmoji} ${data.status}</h3>
              <p>${data.statusMessage}</p>
            </div>
            
            ${data.estimatedTime ? `<p><strong>Estimated Time:</strong> ${data.estimatedTime}</p>` : ''}
            ${data.trackingInfo ? `<p><strong>Tracking Info:</strong> ${data.trackingInfo}</p>` : ''}
            
            <p>Thank you for choosing Kingdom Snacks!</p>
          </div>
          <div class="footer">
            <p>Kingdom Snacks - Musanze, Kigali, Rwanda</p>
            <p>📞 +250 788 123 456 | 📧 info@kingdomsnacks.rw</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  birthdaySpecial: (data) => ({
    subject: '🎂 Happy Birthday! Special Offer from Kingdom Snacks',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff8c00, #ff6b35); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .birthday-box { background: #fff; border: 3px solid #ff8c00; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; }
          .coupon { background: #ff8c00; color: white; padding: 15px; font-size: 20px; font-weight: bold; border-radius: 5px; margin: 10px 0; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏰 Kingdom Snacks</h1>
            <p>Birthday Special Offer</p>
          </div>
          <div class="content">
            <div class="birthday-box">
              <h2>🎂 Happy Birthday ${data.name}! 🎉</h2>
              <p>Another year sweeter! Celebrate your special day with Kingdom Snacks.</p>
              
              <div class="coupon">
                ${data.discountPercent}% OFF
                <div style="font-size: 14px; font-weight: normal;">Use code: BIRTHDAY${data.discountPercent}</div>
              </div>
              
              <p>Valid for the next 7 days on all our delicious snacks and cakes!</p>
            </div>
            
            <p>May your day be filled with happiness and sweet treats. Thank you for being part of the Kingdom Snacks family!</p>
            
            <p style="text-align: center;">
              <a href="${data.shopUrl}" style="display: inline-block; background: #ff8c00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Shop Now</a>
            </p>
          </div>
          <div class="footer">
            <p>Kingdom Snacks - Musanze, Kigali, Rwanda</p>
            <p>📞 +250 788 123 456 | 📧 info@kingdomsnacks.rw</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Main send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    let emailContent;
    
    // Use template if specified
    if (options.template && emailTemplates[options.template]) {
      emailContent = emailTemplates[options.template](options.data);
    } else {
      emailContent = {
        subject: options.subject,
        html: options.html || options.message
      };
    }

    const mailOptions = {
      from: `Kingdom Snacks <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    // Add attachments if provided
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }

    const result = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully', {
      to: options.email,
      subject: emailContent.subject,
      messageId: result.messageId
    });

    return {
      success: true,
      messageId: result.messageId
    };

  } catch (error) {
    logger.error('Email sending failed', {
      error: error.message,
      to: options.email,
      subject: options.subject
    });

    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Bulk email sending function
const sendBulkEmail = async (emails) => {
  const results = [];
  
  for (const emailData of emails) {
    try {
      const result = await sendEmail(emailData);
      results.push({ ...result, email: emailData.email });
    } catch (error) {
      results.push({ 
        success: false, 
        error: error.message, 
        email: emailData.email 
      });
    }
  }
  
  return results;
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email configuration is valid');
    return true;
  } catch (error) {
    logger.error('Email configuration test failed', { error: error.message });
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  testEmailConfig,
  emailTemplates
};