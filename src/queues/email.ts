import { Worker, Queue } from "bullmq";

import EmailService from "../modules/email/email.service";
import IoRedis from "ioredis";

export const emailQueue = new Queue("email");
// emailQueue.on("waiting", ({ jobId }) => {});
const connection = new IoRedis({ maxRetriesPerRequest: null });

export class EmailWorker {
  constructor(private emailService: EmailService) {
    this.addWorker();
  }

  addWorker = () => {
    new Worker(
      "email",
      async (job) => {
        try {
          const { subject, to, html } = job.data;
          await this.emailService.sendMail(
            subject,
            to,
            html,
            "Abraham <abrahamprogramming5@gmail.com>"
          );
        } catch (err) {
          console.log(err);
        }
      },
      { connection }
    );
  };
}
