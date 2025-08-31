import express from "express";
import { createAuthRouter } from "./auth.routes";
import { createUserRouter } from "./user.routes";
import { createTagRouter } from "./tag.routes";
import { createNoteRouter } from "./note.routes";
import { createDirectoryRouter } from "./directory.routes";
import authenticate from "../middleware/authenticate";
import adminAuthorization from "../middleware/adminAuthorization";
import AuthController from "../api/auth/auth.controller";
import UserController from "../api/account/account.controller";
import DirectoryController from "../api/directory/directory.controller";
import editorAuthorization from "../middleware/editorAuthorization";
import { DependencyManager } from "../classes/dep_manager";
import NoteController from "../api/note/note.controller";
import TagController from "../api/tag/tag.controller";

export function registerAllApplicationRoutes(
  app: express.Application,
  dm: DependencyManager
) {
  const authController = dm.getController<AuthController>("auth");
  const userController = dm.getController<UserController>("user");
  const noteController = dm.getController<NoteController>("note");
  const directoryController =
    dm.getController<DirectoryController>("directory");
  const tagController =
    dm.getController<TagController>("tag");

  const authRouter = createAuthRouter(authController);
  const userRouter = createUserRouter(userController);
  const noteRouter = createNoteRouter(noteController);
  const tagRouter = createTagRouter(tagController);
  const directoryRouter = createDirectoryRouter(directoryController);

  app.use("/auth", authRouter);

  app.use(authenticate);
  //   app.use(editorAuthorization);
  app.use("/notes", noteRouter);
  app.use("/users", userRouter);
  app.use("/tags", tagRouter);
  app.use("/directories", directoryRouter);

  app.use((req, res, next) => {
    res.status(404);
    next();
  });
}
