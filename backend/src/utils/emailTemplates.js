const wrap = (title, body) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0A1C3A;">
    <h2 style="color: #F71C56;">${title}</h2>
    <div>${body}</div>
  </div>
`;

export const templates = {
  applicationReceived: ({ name, referenceNumber }) =>
    wrap(
      'Application received',
      `<p>Thank you, ${name}.</p><p>Your application reference is <strong>${referenceNumber}</strong>.</p><p>We will respond within 3-5 business days.</p>`
    ),
  inquiryReceived: ({ organizationName, referenceNumber }) =>
    wrap(
      'Inquiry received',
      `<p>Thank you, ${organizationName}.</p><p>Your inquiry reference is <strong>${referenceNumber}</strong>.</p><p>We will respond within 5 business days.</p>`
    ),
  adminInvite: ({ fullName, role, email, temporaryPassword }) =>
    wrap(
      'Admin invitation',
      `<p>Hello ${fullName},</p><p>You have been invited as <strong>${role}</strong> for Cardinal Immersions.</p><p>Login email: ${email}</p>${temporaryPassword ? `<p>Temporary password: <strong>${temporaryPassword}</strong></p>` : ''}`
    ),
  applicationStatusUpdate: ({ name, status }) =>
    wrap(
      'Application status updated',
      `<p>Hello ${name},</p><p>Your application status is now <strong>${status}</strong>.</p>`
    ),
};
