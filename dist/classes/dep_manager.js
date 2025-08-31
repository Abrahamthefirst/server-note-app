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
exports.DependencyManager = void 0;
const prisma_1 = require("../generated/prisma");
const user_respository_1 = __importDefault(require("../repositories/user.respository"));
const note_repository_1 = __importDefault(require("../repositories/note.repository"));
const tag_repository_1 = __importDefault(require("../repositories/tag.repository"));
const email_service_1 = __importDefault(require("../modules/email/email.service"));
const account_service_1 = __importDefault(require("../modules/account/account.service"));
const auth_service_1 = __importDefault(require("../modules/auth/auth.service"));
const tag_service_1 = __importDefault(require("../modules/tag/tag.service"));
const note_service_1 = __importDefault(require("../modules/note/note.service"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const emailConfig_1 = require("../config/emailConfig");
const auth_controller_1 = __importDefault(require("../api/auth/auth.controller"));
const account_controller_1 = __importDefault(require("../api/account/account.controller"));
const tag_controller_1 = __importDefault(require("../api/tag/tag.controller"));
const directory_service_1 = __importDefault(require("../modules/directory/directory.service"));
const directory_controller_1 = __importDefault(require("../api/directory/directory.controller"));
const directory_repository_1 = __importDefault(require("../repositories/directory.repository"));
const note_controller_1 = __importDefault(require("../api/note/note.controller"));
const email_1 = require("../queues/email");
class DependencyManager {
    constructor(cfg) {
        this.cfg = cfg;
        this.prisma = null;
        this.mail = null;
        this.cloudinary = null;
        this.services = null;
        this.controllers = null;
        this.queueWorker = null;
        this.repositories = null;
    }
    setupPrisma() {
        if (!this.prisma) {
            this.prisma = new prisma_1.PrismaClient();
        }
    }
    setUpCors() {
        const whitelist = this.cfg.whitelist;
        return {
            origin: function (origin, callback) {
                if ((origin && whitelist.indexOf(origin) !== -1) || !origin) {
                    callback(null, true);
                }
                else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
        };
    }
    nodeMailerClient() {
        if (!this.mail) {
            this.mail = new emailConfig_1.NodemailerClient(this.cfg.email.address, this.cfg.email.password);
            return this.mail;
        }
        return this.mail;
    }
    cloudinaryInstance() {
        if (!this.cloudinary) {
            const cloudinaryV2 = cloudinary_1.default.v2;
            cloudinaryV2.config({
                cloud_name: this.cfg.cloudinary.cloud_name,
                api_key: this.cfg.cloudinary.api_key,
                api_secret: this.cfg.cloudinary.api_secret,
            });
            this.cloudinary = cloudinaryV2;
        }
        return this.cloudinary;
    }
    static getInstance(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!DependencyManager.instance) {
                DependencyManager.instance = new DependencyManager(config);
                yield DependencyManager.instance.init();
            }
            return DependencyManager.instance;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setupPrisma();
            this.nodeMailerClient();
            this.cloudinaryInstance();
            this.repositories = {
                note: new note_repository_1.default(this.prisma),
                user: new user_respository_1.default(this.prisma),
                tag: new tag_repository_1.default(this.prisma),
                directory: new directory_repository_1.default(this.prisma),
            };
            this.services = {
                auth: new auth_service_1.default(this.getRepository("user")),
                tag: new tag_service_1.default(this.getRepository("tag")),
                note: new note_service_1.default(this.getRepository("note")),
                email: new email_service_1.default(this.nodeMailerClient()),
                user: new account_service_1.default(this.getRepository("user")),
                directory: new directory_service_1.default(this.getRepository("directory")),
            };
            this.queueWorker = {
                email: new email_1.EmailWorker(this.services.email),
            };
            this.controllers = {
                auth: new auth_controller_1.default(this.getService("auth")),
                user: new account_controller_1.default(this.getService("user")),
                note: new note_controller_1.default(this.getService("note")),
                tag: new tag_controller_1.default(this.getService("tag")),
                directory: new directory_controller_1.default(this.getService("directory")),
            };
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.repositories = null;
            yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.$disconnect());
            this.prisma = null;
            this.services = null;
        });
    }
    getRepository(val) {
        if (!this.repositories) {
            throw new Error("Repositories not yet initialized");
        }
        return this.repositories[val];
    }
    getService(val) {
        if (!this.services) {
            throw new Error("Services not yet initialized");
        }
        return this.services[val];
    }
    getController(val) {
        if (!this.controllers) {
            throw new Error("Repositories not yet initialized");
        }
        return this.controllers[val];
    }
    getConfig() {
        return this.cfg;
    }
}
exports.DependencyManager = DependencyManager;
DependencyManager.instance = null;
