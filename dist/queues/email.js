"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailWorker = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
exports.emailQueue = new bullmq_1.Queue("email");
// emailQueue.on("waiting", ({ jobId }) => {});
const connection = new ioredis_1.default({ maxRetriesPerRequest: null });
class EmailWorker {
    constructor(emailService) {
        this.emailService = emailService;
        this.addWorker = () => {
            new bullmq_1.Worker("email", (job) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { subject, to, html } = job.data;
                    yield this.emailService.sendMail(subject, to, html, "Abraham <abrahamprogramming5@gmail.com>");
                }
                catch (err) {
                    console.log(err);
                }
            }), { connection });
        };
        this.addWorker();
    }
}
exports.EmailWorker = EmailWorker;
