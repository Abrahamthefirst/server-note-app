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
const error_1 = require("../utils/error");
const prisma_1 = require("../generated/prisma");
class DirectoryRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createDirectory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDirectory = yield this.prisma.directory.create({
                    data,
                });
                return newDirectory;
            }
            catch (err) {
                if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                    if ((err === null || err === void 0 ? void 0 : err.code) === "P2002") {
                        throw new error_1.ConflictError("Directory name already exist ");
                    }
                }
                throw err;
            }
        });
    }
    getUserDirectories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const directorites = yield this.prisma.directory.findMany({
                    where: {
                        userId,
                    },
                });
                return directorites;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDirectoryNotesByDirectoryId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notes = yield this.prisma.directory.findMany({
                    where: {
                        id,
                    },
                    include: {
                        notes: true,
                    },
                });
                return notes;
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Come back to understand and rewrite this circular references
    hasCircularReference(potentialChildId, potentialParentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentParentId = potentialParentId;
            while (currentParentId !== null) {
                if (currentParentId === potentialChildId) {
                    return true; // A circular reference is found
                }
                const parent = yield this.prisma.directory.findUnique({
                    where: { id: currentParentId },
                    select: { parentId: true },
                });
                currentParentId = (parent === null || parent === void 0 ? void 0 : parent.parentId) || null;
            }
            return false;
        });
    }
    updateDirectoryById(directoryId, noteIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDirectory = yield this.prisma.directory.update({
                    where: {
                        id: directoryId,
                    },
                    data: {
                        notes: {
                            connect: noteIds.map((id) => ({ id })),
                        },
                    },
                    include: {
                        notes: true,
                    },
                });
                return updatedDirectory;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    deleteDirectoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id, "This is the id");
                const transaction = yield this.prisma.$transaction(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.prisma.note.deleteMany({
                        where: { directoryId: id },
                    });
                    const directory = yield this.prisma.directory.delete({
                        where: { id: id },
                    });
                    return directory;
                }));
                return transaction;
            }
            catch (err) {
                console.log(err, "This might be the error");
                throw err;
            }
        });
    }
    getAllDirectories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notes = yield this.prisma.note.findMany();
                return notes;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDirectoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const note = yield this.prisma.note.findUnique({
                    where: {
                        id,
                    },
                });
                return note;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = DirectoryRepository;
