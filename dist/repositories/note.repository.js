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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
class NoteRepo {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createNote(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, body, userId, tagNames, status, directoryId } = data;
                const tagConnectOrCreateOperations = (tagNames === null || tagNames === void 0 ? void 0 : tagNames.map((tagName) => ({
                    where: { name: tagName },
                    create: {
                        name: tagName,
                        user: {
                            connect: {
                                id: userId,
                            },
                        },
                    },
                }))) || [];
                const newNote = yield this.prisma.note.create({
                    data: {
                        title,
                        body,
                        status,
                        user: {
                            connect: {
                                id: userId,
                            },
                        },
                        folder: {
                            connect: {
                                id: directoryId,
                            },
                        },
                        tags: {
                            connectOrCreate: tagConnectOrCreateOperations,
                        },
                    },
                    include: {
                        tags: true,
                    },
                });
                return newNote;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getNotesByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notes = yield this.prisma.note.findMany({
                    where: {
                        userId: id,
                    },
                    select: {
                        id: true,
                        title: true,
                        body: true,
                        status: true,
                        userId: true,
                        createdAt: true,
                        updatedAt: true,
                        directoryId: true,
                        tags: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
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
                const notes = yield this.prisma.note.findMany();
                return notes;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getNoteById(id) {
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
    updateNoteById(note) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = note, data = __rest(note, ["id"]);
                const userData = yield this.prisma.note.update({
                    where: {
                        id,
                    },
                    data,
                });
                return userData;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    deleteNoteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const note = yield this.prisma.note.delete({
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
exports.default = NoteRepo;
function getFirstElement(array) {
    return array[0];
}
const myResponse = {
    data: {
        status: 200,
    },
    isError: true,
};
const name = {
    data: {
        status: 300,
    },
    error: new Error("indome"),
    message: "Fast",
};
