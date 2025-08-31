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
Object.defineProperty(exports, "__esModule", { value: true });
const request_dto_1 = require("./dtos/request.dto");
class DirectoryController {
    constructor(directoryService) {
        this.directoryService = directoryService;
        this.getUserDirectories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const directorites = yield this.directoryService.getUserDirectories((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(200).json(directorites);
                return;
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
        this.createDirectory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const value = request_dto_1.CreateDirectoryDto.validate(req.body);
                const directoryRequestData = Object.assign(Object.assign({}, value), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
                const note = yield this.directoryService.createDirectory(directoryRequestData);
                res.status(200).json(note);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.getDirectory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const directoryId = req.params.directoryId;
                const getNote = (_a = req.query) === null || _a === void 0 ? void 0 : _a.note;
                const note = yield this.directoryService.getDirectoryNotes(directoryId);
                res.status(200).json(note);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteDirectory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const directoryId = req.params.id;
                const note = yield this.directoryService.deleteDirectory(directoryId);
                res.status(200).json(note);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.updateNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = DirectoryController;
