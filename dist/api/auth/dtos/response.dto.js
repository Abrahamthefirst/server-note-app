"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicLoginResponseDTO = exports.BasicRegistrationResponseDTO = void 0;
class BasicRegistrationResponseDTO {
    constructor(username, email, password, phone_number, role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.role = role;
    }
}
exports.BasicRegistrationResponseDTO = BasicRegistrationResponseDTO;
class BasicLoginResponseDTO {
    constructor(email, id, username, email_verified, picture, phone_number, role, access_token, createdAt, updatedAt) {
        this.email = email;
        this.id = id;
        this.username = username;
        this.email_verified = email_verified;
        this.picture = picture;
        this.phone_number = phone_number;
        this.role = role;
        this.access_token = access_token;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.BasicLoginResponseDTO = BasicLoginResponseDTO;
