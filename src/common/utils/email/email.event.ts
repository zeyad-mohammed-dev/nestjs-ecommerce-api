import { EventEmitter } from "node:events";
import { sendEmail } from "./send.email";
import { EmailTemplate } from "./email.template";
import Mail from "nodemailer/lib/mailer";
import { OtpEnum } from "src/common/enums";

export interface IEmail extends Mail.Options {
  otp: string;
  name: string;
}
export const emailEvent = new EventEmitter();

emailEvent.on(OtpEnum.ConfirmEmail, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.ConfirmEmail;
    data.html = EmailTemplate({
      otp: data.otp,
      name: data.name,
      title: "Email Confirmation",
    });
    await sendEmail(data);
  } catch (error) {
    console.log("Fail to send email ❌", error);
  }
});

emailEvent.on(OtpEnum.ResetPassword, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.ResetPassword;
    data.html = EmailTemplate({
      otp: data.otp,
      name: data.name,
      title: "Reset Code",
    });
    await sendEmail(data);
  } catch (error) {
    console.log("Fail to send email ❌", error);
  }
});
