import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || '';
const from = process.env.EMAIL_FROM || 'noreply@cardinalimmersions.com';
const resend = apiKey ? new Resend(apiKey) : null;

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!resend) {
    console.log('[email:dev]', { from, to, subject, text: text || '(no text)', html });
    return { id: 'dev-email-log' };
  }

  return resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });
};
