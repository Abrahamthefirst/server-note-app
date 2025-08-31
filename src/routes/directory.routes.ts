import express from "express";
import DirectoryController from "../api/directory/directory.controller";
export function createDirectoryRouter(directoryController: DirectoryController) {
  const router = express.Router();

//   router.get("/", noteController.getAllNotes);
  router.get("/me", directoryController.getUserDirectories);
  router.get("/:id", directoryController.getDirectory);
  router.post("/", directoryController.createDirectory);
  router.delete("/:id", directoryController.deleteDirectory);
  // router.post("/upload", upload.array("files"), userController.uploadDocuments);

  return router;
}
