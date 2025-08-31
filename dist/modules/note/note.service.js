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
class NoteService {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
        this.createNote = (dto) => __awaiter(this, void 0, void 0, function* () {
            try {
                const note = yield this.noteRepository.createNote(dto);
                return note;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getNoteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const note = yield this.noteRepository.getNoteById(id);
                return note;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getUserNotes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notes = yield this.noteRepository.getNotesByUserId(id);
                return notes;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAllNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notes = yield this.noteRepository.getAllNotes();
                return notes;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateNote(note) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedNote = yield this.noteRepository.updateNoteById(note);
                return updatedNote;
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteNote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedNote = yield this.noteRepository.deleteNoteById(id);
                return { id: String(deletedNote === null || deletedNote === void 0 ? void 0 : deletedNote.id) };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = NoteService;
