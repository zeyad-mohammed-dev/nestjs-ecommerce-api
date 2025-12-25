export const EmailTemplate = ({
  otp,
  name,
  title,
}: {
  otp: string;
  name: string;
  title: string;
}): string => {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
    }
    .email-container {
      max-width: 620px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0,0,0,0.06);
      border: 1px solid #e1e4e8;
    }
    .email-header {
      background: linear-gradient(135deg, #1e90ff, #00b894);
      color: #ffffff;
      text-align: center;
      padding: 35px 25px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .email-body {
      padding: 28px;
      color: #2d3436;
      line-height: 1.7;
      font-size: 16px;
    }
    .email-body h2 {
      margin-top: 0;
      color: #1e90ff;
      font-size: 22px;
      font-weight: 600;
    }
    .activation-code {
      display: inline-block;
      background: #1e90ff;
      color: #ffffff !important;
      padding: 14px 30px;
      border-radius: 10px;
      font-size: 22px;
      margin: 25px 0;
      font-weight: bold;
      letter-spacing: 3px;
      box-shadow: 0 4px 12px rgba(30, 144, 255, 0.25);
    }
    .email-footer {
      text-align: center;
      padding: 22px;
      background-color: #f8f9fb;
      font-size: 14px;
      color: #8d99ae;
    }
    .email-footer a {
      color: #1e90ff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${title}</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${name}, 👋</h2>

      <p>Welcome to <strong>Your E-Commerce Store</strong> — we're excited to have you with us!</p>

      <p>Please use the verification code below to complete your action:</p>

      <div class="activation-code">${otp}</div>

      <p>This code is valid for a limited time. If you didn’t request this, please ignore this email.</p>

      <p>Best regards,<br>
      <strong>Your E-Commerce Store Team</strong></p>
    </div>

    <div class="email-footer">
      <p>&copy; ${currentYear} Your E-Commerce Store. All rights reserved.</p>
      <p><a href="#">Customer Support</a> • <a href="#">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`;
};
