// Nodemailer
import nodemailer from "nodemailer";
// Mailgen
import mailgen from "mailgen";

export function generate_email_verification_body(username, link) {
  return {
    body: {
      name: username?.toUpperCase(),
      intro:
        "Welcome to Task Management! We're thrilled to have you on board and ready to help you stay organized and productive.",
      action: {
        instructions:
          "To verify your email address and activate your account, please click the button below:",
        button: {
          color: "#22BC66",
          text: "Verify email",
          link: link,
        },
      },
      outro:
        "If you have any questions or need assistance, just reply to this email—we're here to help!",
    },
  };
}

export function generate_forgot_password_body(username, link) {
  return {
    body: {
      name: username?.toUpperCase(),
      intro:
        "We received a request to reset your password. Don’t worry — we’re here to help you get back into your account.",
      action: {
        instructions:
          "To reset your password, please click the button below. This link will expire after a certain period for security purposes:",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: link,
        },
      },
      outro:
        "If you didn’t request a password reset, you can safely ignore this email. If you need any help, feel free to reply to this message.",
    },
  };
}

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const mailGenerator = new mailgen({
  theme: "default",
  product: {
    name: "Task Management",
    link: "https://mailgen.js/",
  },
});

async function send_mail(options) {
  try {
    const html_body = mailGenerator.generate(options.body);
    const text_body = mailGenerator.generatePlaintext(options.body);
    await transporter.sendMail({
      from: "dev.mr@inhousedept.com",
      to: options.email,
      subject: options.subject,
      text: text_body,
      html: html_body,
    });
  } catch (error) {
    throw error;
  }
}

export default send_mail;
