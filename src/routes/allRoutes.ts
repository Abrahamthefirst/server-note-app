import express from "express";
import { createAuthRouter } from "./auth.routes";
import { createUserRouter } from "./user.routes";
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

export function registerAllApplicationRoutes(
  app: express.Application,
  dm: DependencyManager
) {
  const authController = dm.getController<AuthController>("auth");
  const userController = dm.getController<UserController>("user");
  const noteController = dm.getController<NoteController>("note");
  const directoryController =
    dm.getController<DirectoryController>("directory");

  const authRouter = createAuthRouter(authController);
  const userRouter = createUserRouter(userController);
  const noteRouter = createNoteRouter(noteController);
  const directoryRouter = createDirectoryRouter(directoryController);

  app.use("/auth", authRouter);

  app.use(authenticate);
  //   app.use(editorAuthorization);
  app.use("/notes", noteRouter);
  app.use("/users", userRouter);
  app.use("/directories", directoryRouter);

  app.use((req, res, next) => {
    res.status(404);
    next();
  });
}
