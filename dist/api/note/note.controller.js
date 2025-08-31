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
class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
        this.getAuthUserNotes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const notes = yield this.noteService.getUserNotes((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.status(200).json(notes);
                return;
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
        this.createNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const value = request_dto_1.CreateNoteRequestDTO.validate(req.body);
                const noteToCreate = Object.assign(Object.assign({}, value), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
                const note = yield this.noteService.createNote(noteToCreate);
                res.status(200).json(note);
                return;
            }
            catch (err) {
                console.log(err, " This is note error");
                next(err);
            }
        });
        this.getNoteById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const note = yield this.noteService.getNoteById(noteId);
                res.status(200).json(note);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.getAllNotes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const notes = yield this.noteService.getAllNotes();
                res.status(200).json(notes);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const noteId = req.params.id;
                const notes = yield this.noteService.deleteNote(noteId);
                res.status(200).json(notes);
                return;
            }
            catch (err) {
                next(err);
            }
        });
        this.updateNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = NoteController;
