import express from "express";
import { createAuthRouter } from "./auth.routes";
import { createUserRouter } from "./user.routes";
import { createNoteRouter } from "./note.routes";
import authenticate from "../middleware/authenticate";
import adminAuthorization from "../middleware/adminAuthorization";
import AuthController from "../api/auth/auth.controller";
import UserController from "../api/account/account.controller";
import editorAuthorization from "../middleware/editorAuthorization";
import { DependencyManager } from "../classes/dep_manager";
import NoteController from "../api/note/note.controller";

export function registerAllApplicationRoutes(
  app: express.Application,
  dm: DependencyManager
) {

  const authController = dm.getController<AuthController>("auth");
  const userController = dm.getController<UserController>("user");
  const noteController = dm.getController<NoteController>("note")

  const authRouter = createAuthRouter(authController);
  const userRouter = createUserRouter(userController);
  const noteRouter = createNoteRouter(noteController)

  app.use("/auth", authRouter);

    app.use(authenticate);
  //   app.use(editorAuthorization);
  app.use("/notes", noteRouter);
  app.use("/users", userRouter);

  app.use((req, res, next) => {
    res.status(404);
    next();
  });
}
