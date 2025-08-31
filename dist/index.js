"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_2 = require("./middleware/passport");
const config_1 = __importDefault(require("./config/config"));
const dep_manager_1 = require("./classes/dep_manager");
const errorHandler_1 = require("./utils/errorHandler");
const allRoutes_1 = require("./routes/allRoutes");
const winston_log_1 = require("./middleware/winston.log");
dotenv_1.default.config();
const startApp = (dep_man) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const app = (0, express_1.default)();
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)(dep_man.setUpCors()));
    app.use(passport_1.default.initialize());
    (0, passport_2.googleAuthStrategy)();
    app.use(winston_log_1.logRequests);
    (0, allRoutes_1.registerAllApplicationRoutes)(app, dep_man);
    app.use((req, res, next) => {
        req.app_config = dep_man.getConfig();
        req.dependencyManager = dep_man;
    });
    const port = (_a = dep_man.getConfig()) === null || _a === void 0 ? void 0 : _a.port;
    app.listen(port, () => {
        if (port) {
            console.log("Server is running on port ", port);
        }
        else {
            console.log("Server is running");
        }
    });
    app.use(errorHandler_1.errorHandler);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    startApp(yield dep_manager_1.DependencyManager.getInstance((0, config_1.default)())).catch((err) => {
        console.log(err, "This is th eror");
    });
}))();
