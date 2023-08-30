import nodemailer, { SentMessageInfo, SendMailOptions } from "nodemailer";

const transporter = nodemailer.createTransport(
  {
    host: "hostname",
    port: 465,
    secure: true,
    auth: {
      user: "mail@mail.com",
      pass: "pass",
    },
  },
  {
    from: "Mail Test <hookahdb@mail.ru>",
  }
);

export const mailer = (message: SendMailOptions): void => {
  transporter.sendMail(
    message,
    (error: Error | null, info: SentMessageInfo): void => {
      if (error) {
        return console.log(error);
      }

      console.log("Email send: ", info);
    }
  );
};
