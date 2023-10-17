import nodemailer, { SentMessageInfo, SendMailOptions } from "nodemailer";
import { mailerData } from "../secrets/mailerData";

interface MailerResponse {
  error: Error | null;
  info: SentMessageInfo;
}

const transporter = nodemailer.createTransport(
  {
    host: mailerData.host,
    port: 465,
    secure: true,
    auth: {
      user: mailerData.auth.user,
      pass: mailerData.auth.pass,
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
