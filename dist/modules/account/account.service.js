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
class AccountService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserById(Number(id));
                return user;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAllUsers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserById(Number(id));
                return user;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userRepository.updateUserById(user);
                return updatedUser;
            }
            catch (err) {
                throw err;
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.userRepository.deleteUserById(Number(id));
                return { id: String(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.id) };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = AccountService;
