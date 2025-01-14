import { Resend } from "resend";

const resend = new Resend(process.env.RESENT_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const linkForConfirmation = `http://localhost:3000/auth/new-verification/${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Activation de votre compte - AMS ERP",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Activation de compte</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding: 20px 0;
                background-color: #7C4CE4;
                color: #ffffff;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 20px;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                background-color: #7C4CE4;
                color: #ffffff !important;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                font-size: 16px;
                margin-top: 20px;
              }
              a {
                color: #fff !important;
                text-decoration: none;
              }
              .footer {
                text-align: center;
                padding: 10px 0;
                font-size: 12px;
                color: #777;
              }
              .footer a {
                color: #7C4CE4;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bienvenue chez AMS</h1>
              </div>
              <div class="content">
                <p>Bonjour,</p>
                <p>
                  Merci d'avoir créé un compte sur AMS. Veuillez confirmer votre adresse e-mail pour activer votre compte et accéder à toutes nos fonctionnalités.
                </p>
                <a href="${linkForConfirmation}" class="button">Activer mon compte</a>
                <p>
                  Si vous n'avez pas créé ce compte, vous pouvez ignorer cet e-mail.
                </p>
              </div>
              <div class="footer">
                <p>
                  Cet e-mail vous a été envoyé par Academia Management Sync. Pour toute assistance, veuillez
                  <a href="mailto:support@ams-erp.com">nous contacter</a>.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return { success: "e-mail envoyé" };
  } catch (error: any) {
    return { error: error.message };
  }
};
