import { PrismaClient } from "../generated/prisma";
import UserRepository from "../repositories/user.respository";
import NoteRepository from "../repositories/note.repository";
import TagRepository from "../repositories/tag.repository";
import EmailService from "../modules/email/email.service";
import UserService from "../modules/account/account.service";
import AuthService from "../modules/auth/auth.service";
import TagService from "../modules/tag/tag.service";
import NoteService from "../modules/note/note.service";
import cloudinary from "cloudinary";
import { v2 } from "cloudinary";
import { IAppConfig } from "../utils/interface";
import { MailClient, NodemailerClient } from "../config/emailConfig";
import AuthController from "../api/auth/auth.controller";
import AccountController from "../api/account/account.controller";
import TagController from "../api/tag/tag.controller";
import DirectoryService from "../modules/directory/directory.service";
import DirectoryController from "../api/directory/directory.controller";
import DirectoryRepository from "../repositories/directory.repository";
import NoteController from "../api/note/note.controller";
import { EmailWorker } from "../queues/email";
type Repository =
  | UserRepository
  | NoteRepository
  | DirectoryRepository
  | TagRepository;
type RepositoryKey = "user" | "note" | "directory" | "tag";
type Repositories = Record<RepositoryKey, Repository>;

type Service =
  | UserService
  | NoteService
  | EmailService
  | AuthService
  | DirectoryService
  | TagService;
type ServiceKey = "user" | "email" | "auth" | "note" | "directory" | "tag";
type Services = Record<ServiceKey, Service>;

type QueueWorker = EmailWorker;
type QueueKey = "email";
type Queues = Record<QueueKey, QueueWorker>;

type Controller =
  | AuthController
  | AccountController
  | NoteController
  | DirectoryController
  | TagController;
type Controllerkey = "user" | "auth" | "note" | "directory" | "tag";
type Controllers = Record<Controllerkey, Controller>;
export class DependencyManager {
  prisma: PrismaClient | null = null;
  mail: MailClient | null = null;
  cloudinary: typeof v2 | null = null;
  private services: Services | null = null;
  private controllers: Controllers | null = null;
  queueWorker: Queues | null = null;
  private repositories: Repositories | null = null;
  private static instance: DependencyManager | null = null;

  public constructor(private cfg: IAppConfig) {}

  setupPrisma() {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
  }

  setUpCors() {
    const whitelist = this.cfg.whitelist;
    return {
      origin: function (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) {
        if ((origin && whitelist.indexOf(origin) !== -1) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    };
  }

  nodeMailerClient() {
    if (!this.mail) {
      this.mail = new NodemailerClient(
        this.cfg.email.address,
        this.cfg.email.password
      );
      return this.mail;
    }
    return this.mail;
  }

  cloudinaryInstance() {
    if (!this.cloudinary) {
      const cloudinaryV2 = cloudinary.v2;
      cloudinaryV2.config({
        cloud_name: this.cfg.cloudinary.cloud_name,
        api_key: this.cfg.cloudinary.api_key,
        api_secret: this.cfg.cloudinary.api_secret,
      });
      this.cloudinary = cloudinaryV2;
    }
    return this.cloudinary;
  }
  public static async getInstance(config: IAppConfig) {
    if (!DependencyManager.instance) {
      DependencyManager.instance = new DependencyManager(config);
      await DependencyManager.instance.init();
    }

    return DependencyManager.instance;
  }

  async init() {
    this.setupPrisma();
    this.nodeMailerClient();
    this.cloudinaryInstance();
    this.repositories = {
      note: new NoteRepository(this.prisma!),
      user: new UserRepository(this.prisma!),
      tag: new TagRepository(this.prisma!),
      directory: new DirectoryRepository(this.prisma),
    };
    this.services = {
      auth: new AuthService(this.getRepository<UserRepository>("user")),
      tag: new TagService(this.getRepository<TagRepository>("tag")),
      note: new NoteService(this.getRepository<NoteRepository>("note")),
      email: new EmailService(this.nodeMailerClient()),
      user: new UserService(this.getRepository<UserRepository>("user")),
      directory: new DirectoryService(
        this.getRepository<DirectoryRepository>("directory")
      ),
    };
    this.queueWorker = {
      email: new EmailWorker(this.services.email as EmailService),
    };
    this.controllers = {
      auth: new AuthController(this.getService<AuthService>("auth")),
      user: new AccountController(this.getService<UserService>("user")),
      note: new NoteController(this.getService<NoteService>("note")),
      tag: new TagController(this.getService<TagService>("tag")),
      directory: new DirectoryController(
        this.getService<DirectoryService>("directory")
      ),
    };
  }

  async destroy() {
    this.repositories = null;
    await this.prisma?.$disconnect();
    this.prisma = null;
    this.services = null;
  }

  getRepository<T>(val: RepositoryKey) {
    if (!this.repositories) {
      throw new Error("Repositories not yet initialized");
    }
    return this.repositories[val] as T;
  }

  getService<T = any>(val: ServiceKey) {
    if (!this.services) {
      throw new Error("Services not yet initialized");
    }
    return this.services[val] as T;
  }
  getController<T>(val: Controllerkey) {
    if (!this.controllers) {
      throw new Error("Repositories not yet initialized");
    }
    return this.controllers[val] as T;
  }

  getConfig() {
    return this.cfg;
  }
}
