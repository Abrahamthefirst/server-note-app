export default function (username: string, link: string, expiration: string) {
  const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          text-align: center;
        }
        h1 {
          color: #333333;
        }
        p {
          color: #555555;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #ff5722;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        .expiry-info {
          font-size: 14px;
          color: #777777;
          margin-top: 20px;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f5f5f5;">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding: 20px;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <h1 style="margin: 0 0 16px; font-size: 24px; color: #333333;">Password Reset Request</h1>
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #555555;">
                    Hi ${username},
                  </p>
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #555555;">
                    We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
                  </p>
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #555555;">
                    To reset your password, please click the button below.
                  </p>

                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="border-radius: 4px; background-color: #ff5722;">
                        <a href=${link} target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p class="expiry-info" style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #888888;">
                    This password reset link is valid for the next ${expiration} minutes.
                  </p>
                  <p style="margin: 8px 0 0; font-size: 14px; line-height: 20px; color: #888888;">
                    For your security, this link will expire and can only be used once.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return content;
}
