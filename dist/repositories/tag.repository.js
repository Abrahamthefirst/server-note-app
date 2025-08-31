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
class TagRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createTag(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTags = yield this.prisma.tag.createManyAndReturn({
                    data,
                    where: {
                        id: userId,
                    },
                });
                return newTags;
            }
            catch (err) {
                if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                    if ((err === null || err === void 0 ? void 0 : err.code) === "P2002") {
                        throw new error_1.ConflictError("Tag name already exist ");
                    }
                }
                throw err;
            }
        });
    }
    getUserTags(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield this.prisma.tag.findMany({
                    where: {
                        userId,
                    },
                });
                return tags;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateTagById(tagId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTag = yield this.prisma.tag.update({
                    where: {
                        id: tagId,
                    },
                    data,
                });
                return updatedTag;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        });
    }
    deleteTagById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = yield this.prisma.tag.delete({
                    where: { id },
                });
                return tag;
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
exports.default = TagRepository;
