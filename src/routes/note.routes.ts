import express from "express";
import NoteController from "../api/note/note.controller"
export function createNoteRouter(noteController: NoteController) {
  const router = express.Router();

  router.get("/", noteController.getAllNotes);
  router.get("/me", noteController.getAuthUserNotes);
  router.get("/me/:id", noteController.getNoteById);
  router.post("/me", noteController.createNote);
  // router.post("/upload", upload.array("files"), userController.uploadDocuments);


  return router;
}
