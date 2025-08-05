import express from "express";
import UserController from "../api/account/account.controller";
import upload from "../config/multer";

export function createUserRouter(userController: UserController) {
  const router = express.Router();

  router.get("/", userController.getAllUsers);
  router.get("/me", userController.getUserById);
  router.get("/me", userController.getUserById);
  // router.post("/upload", upload.array("files"), userController.uploadDocuments);


  return router;
}
