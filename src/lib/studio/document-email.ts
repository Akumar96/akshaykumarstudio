import nodemailer from "nodemailer";
export function emailConfigured() {
  return (
    !!(
      process.env.STUDIO_SMTP_HOST &&
      process.env.STUDIO_SMTP_USER &&
      process.env.STUDIO_SMTP_PASSWORD &&
      process.env.STUDIO_MAIL_FROM
    ) && ["465", "587"].includes(process.env.STUDIO_SMTP_PORT || "587")
  );
}
export function emailTransport() {
  const port = Number(process.env.STUDIO_SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.STUDIO_SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: process.env.STUDIO_SMTP_USER,
      pass: process.env.STUDIO_SMTP_PASSWORD,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}
