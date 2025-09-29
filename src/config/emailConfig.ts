import nodemailer from "nodemailer";
export interface MailClient {
  sendMail(mailOptions: {
    to: string;
    from: string;
    subject: string;
    html: string;
  }): Promise<void>;
}

export class NodemailerClient implements MailClient {
  private transporter;
  constructor(private user: string, private pass: string) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, 
      secure: true, 
      service: "gmail",
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  async sendMail(mailOptions: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail(mailOptions);
  }
}
