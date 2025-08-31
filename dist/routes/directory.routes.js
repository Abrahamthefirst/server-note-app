"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectoryRouter = createDirectoryRouter;
const express_1 = __importDefault(require("express"));
function createDirectoryRouter(directoryController) {
    const router = express_1.default.Router();
    //   router.get("/", noteController.getAllNotes);
    router.get("/me", directoryController.getUserDirectories);
    router.get("/:id", directoryController.getDirectory);
    router.post("/", directoryController.createDirectory);
    router.delete("/:id", directoryController.deleteDirectory);
    // router.post("/upload", upload.array("files"), userController.uploadDocuments);
    return router;
}
