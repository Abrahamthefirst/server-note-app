"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = createUserRouter;
const express_1 = __importDefault(require("express"));
function createUserRouter(userController) {
    const router = express_1.default.Router();
    router.get("/", userController.getAllUsers);
    router.get("/me", userController.getUserById);
    router.get("/me", userController.getUserById);
    // router.post("/upload", upload.array("files"), userController.uploadDocuments);
    return router;
}
