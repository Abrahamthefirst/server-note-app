export default function (username: string, link: string, expiration: string) {
  const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Abraham Note app</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                  border-radius: 8px;
                  text-align: center;
              }
              h1 {
                  color: #333;
              }
              p {
                  color: #777;
              }
              .verification-code {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007BFF;
              }
              .expiry-info {
                  font-size: 16px;
                  color: #777;
              }
          </style>
      </head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f4f4f4;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 16px; font-size: 24px; color: #333333;">Welcome to my Note-app, ${username}!</h1>
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #555555;">
                                To ensure the security of your account, we kindly ask you to verify your email address by clicking the button below.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="border-radius: 4px; background-color: #1a73e8;">
                                        <a href=${link} target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">
                                            Verify Email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #888888;">
                                This link is valid for the next ${expiration} minutes.
                            </p>
                            <p style="margin: 8px 0 0; font-size: 14px; line-height: 20px; color: #888888;">
                                If you did not request this verification, please disregard this email.
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
