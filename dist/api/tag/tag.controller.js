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
class TagController {
    constructor(tagService) {
        this.tagService = tagService;
        this.getUserTags = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tags = yield this.tagService.getUserTags((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(200).json(tags);
                return;
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
        this.createTag = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const value = request_dto_1.CreateTagDto.validate(req.body);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const note = yield this.tagService.createTags(value, userId);
                res.status(200).json(note);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteTagById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const directoryId = req.params.id;
                const note = yield this.tagService.deleteTagById(directoryId);
                res.status(200).json(note);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        // getTag = async (req: Request, res: Response, next: NextFunction) => {
        //   try {
        //     const directoryId = req.params.directoryId as string;
        //     const getNote = req.query?.note;
        //     const note = await this.tagService.getDirectoryNotes(directoryId);
        //     res.status(200).json(note);
        //     return;
        //   } catch (err) {
        //     next(err);
        //   }
        // };
        this.updateNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = TagController;
