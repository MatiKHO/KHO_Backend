import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (to, resetLink) => {
  await resend.emails.send({
    from: "Kumiho Esports <noreply@kumiho.gg>",
    to,
    subject: "Recuperación de contraseña",
    html: `
      <p>Hola,</p>
      <p>Sabemos que no eres Ethan Hawke, pero hemos recibido una solicitud para restablecer tu contraseña. Tu misión, si decides aceptarla es hacr click en el siguiente
      enlace:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este mensaje se autodestruirá en 10 minutos.</p>
    `,
  });
};
