import { Resend } from "resend";

const resend = new Resend(process.env.RESENT_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const linkForConfirmation = `http://localhost:300/auth/new-verification?token=${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirmation et activation de compte",
      html: `<p>Click <a href="${linkForConfirmation}">activer mon compte</a></p>`,
    });
    return { success: "e-mail envoyé" };
  } catch (error: any) {
    return { error: error.message };
  }
};
