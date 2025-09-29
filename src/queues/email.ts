import { Worker, Queue } from "bullmq";

import EmailService from "../modules/email/email.service";
import IoRedis from "ioredis";

const connection = new IoRedis(process.env.REDIS_URL as string, {

  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("email", { connection });
// emailQueue.on("waiting", ({ jobId }) => {});

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
          
          console.log(err, "Worker err");
        }
      },
      { connection }
    );
  };
}
