"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTagDto = exports.createTagsSchema = void 0;
const z = __importStar(require("zod/v4"));
const error_1 = require("../../../utils/error");
exports.createTagsSchema = z.object({
    names: z
        .array(z.string("Tag name is required"))
        .min(1, "You must provide at least one directory name"),
});
class CreateTagDto {
    constructor(name) {
        this.name = name;
    }
    static validate(data) {
        const { success, error, data: result } = exports.createTagsSchema.safeParse(data);
        if (success) {
            return result.names;
        }
        const errMsgs = error.issues.map((response) => {
            return response.message;
        });
        throw new error_1.BadRequestError(errMsgs[0]);
    }
}
exports.CreateTagDto = CreateTagDto;
