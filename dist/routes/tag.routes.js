"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTagRouter = createTagRouter;
const express_1 = __importDefault(require("express"));
function createTagRouter(tagController) {
    const router = express_1.default.Router();
    //   router.get("/", tagController.getAllT);
    router.get("/me", tagController.getUserTags);
    router.delete("/me/:id", tagController.deleteTagById);
    router.post("/me", tagController.createTag);
    // router.post("/upload", upload.array("files"), userController.uploadDocuments);
    return router;
}
