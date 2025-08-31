import express from "express";
import TagController from "../api/tag/tag.controller";
export function createTagRouter(tagController: TagController) {
  const router = express.Router();

//   router.get("/", tagController.getAllT);
  router.get("/me", tagController.getUserTags);
  router.delete("/me/:id", tagController.deleteTagById);
  router.post("/me", tagController.createTag);
  // router.post("/upload", upload.array("files"), userController.uploadDocuments);

  return router;
}
