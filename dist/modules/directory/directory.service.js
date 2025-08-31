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
class DirectoryService {
    constructor(directoryRepository) {
        this.directoryRepository = directoryRepository;
        this.createDirectory = (dto) => __awaiter(this, void 0, void 0, function* () {
            try {
                const note = yield this.directoryRepository.createDirectory(dto);
                return note;
            }
            catch (err) {
                throw err;
            }
        });
        this.getUserDirectories = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const directorites = yield this.directoryRepository.getUserDirectories(userId);
                return directorites;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDirectoryNotes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const directoryResponse = yield this.directoryRepository.getDirectoryNotesByDirectoryId(id);
                return directoryResponse;
            }
            catch (err) {
                throw err;
            }
        });
    }
    //    async getNoteById(id: string): Promise<Directory | null> {
    //     try {
    //       const note = await this.directoryRepository.getNoteById(Number(id));
    //       return note;
    //     } catch (err) {
    //       throw err;
    //     }
    //   }
    //   async getAllDirectories(): Promise<Directory[] | null> {
    //     try {
    //       const notes = await this.directoryRepository.getAllNotes();
    //       return notes;
    //     } catch (err) {
    //       throw err;
    //     }
    //   }
    //   async updateDirectory(note: Partial<Note>): Promise<Note | null> {
    //     try {
    //       const updatedNote = await this.directoryRepository.updateNoteById(note);
    //       return updatedNote;
    //     } catch (err) {
    //       throw err;
    //     }
    //   }
    deleteDirectory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedNote = yield this.directoryRepository.deleteDirectoryById(id);
                return { id: String(deletedNote === null || deletedNote === void 0 ? void 0 : deletedNote.id) };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = DirectoryService;
