"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteRouter = createNoteRouter;
const express_1 = __importDefault(require("express"));
function createNoteRouter(noteController) {
    const router = express_1.default.Router();
    router.get("/", noteController.getAllNotes);
    router.get("/me", noteController.getAuthUserNotes);
    router.get("/me/:id", noteController.getNoteById);
    router.delete("/me/:id", noteController.deleteNote);
    router.post("/", noteController.createNote);
    // router.post("/upload", upload.array("files"), userController.uploadDocuments);
    return router;
}
