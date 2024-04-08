import nodemailer, { SentMessageInfo, SendMailOptions } from "nodemailer";
import { config } from "dotenv";
config();

interface MailerResponse {
  error: Error | null;
  info: SentMessageInfo;
}

const transporter = nodemailer.createTransport(
  {
    host: process.env.MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER_NAME,
      pass: process.env.MAILER_PASSWORD,
    },
  },
  { from: "HookahDB <hookahdb@mail.ru>" }
);

export const mailer = (message: SendMailOptions): MailerResponse => {
  let response: MailerResponse = { error: null, info: "" };
  transporter.sendMail(
    message,
    (error: Error | null, info: SentMessageInfo) => (response = { error, info })
  );

  return response;
};
