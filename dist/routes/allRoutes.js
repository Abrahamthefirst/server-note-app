"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllApplicationRoutes = registerAllApplicationRoutes;
const auth_routes_1 = require("./auth.routes");
const user_routes_1 = require("./user.routes");
const tag_routes_1 = require("./tag.routes");
const note_routes_1 = require("./note.routes");
const directory_routes_1 = require("./directory.routes");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
function registerAllApplicationRoutes(app, dm) {
    const authController = dm.getController("auth");
    const userController = dm.getController("user");
    const noteController = dm.getController("note");
    const directoryController = dm.getController("directory");
    const tagController = dm.getController("tag");
    const authRouter = (0, auth_routes_1.createAuthRouter)(authController);
    const userRouter = (0, user_routes_1.createUserRouter)(userController);
    const noteRouter = (0, note_routes_1.createNoteRouter)(noteController);
    const tagRouter = (0, tag_routes_1.createTagRouter)(tagController);
    const directoryRouter = (0, directory_routes_1.createDirectoryRouter)(directoryController);
    app.use("/auth", authRouter);
    app.use(authenticate_1.default);
    //   app.use(editorAuthorization);
    app.use("/notes", noteRouter);
    app.use("/users", userRouter);
    app.use("/tags", tagRouter);
    app.use("/directories", directoryRouter);
    app.use((req, res, next) => {
        res.status(404);
        next();
    });
}
