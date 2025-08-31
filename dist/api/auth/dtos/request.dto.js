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
exports.BasicLoginRequestDTO = exports.BasicRegistrationRequestDTO = void 0;
const z = __importStar(require("zod/v4"));
const error_1 = require("../../../utils/error");
const libphonenumber_js_1 = require("libphonenumber-js");
const RegistrationSchema = z.strictObject({
    username: z.string("Please enter a valid username").min(3).max(30),
    password: z
        .string("Input a password")
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/[0-9]/, {
        message: "Password must contain at least one number",
    }),
    email: z.email("Please enter a valid email address."),
    phone_number: z.string("Please enter a valid phone number").optional(),
    country_code: z.string("").min(2).max(3).optional(),
    role: z
        .literal(["EDITOR", "VIEWER", "ADMIN"], { error: "No user role" })
        .optional(),
});
class BasicRegistrationRequestDTO {
    constructor(username, password, email, role, phone_number, country_code) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.phone_number = phone_number;
        this.country_code = country_code;
    }
}
exports.BasicRegistrationRequestDTO = BasicRegistrationRequestDTO;
BasicRegistrationRequestDTO.validate = (data) => {
    var _a, _b;
    const result = RegistrationSchema.safeParse(data);
    let phoneNumber;
    if (data.phone_number) {
        phoneNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(data.phone_number, (_a = data.country_code) === null || _a === void 0 ? void 0 : _a.toUpperCase());
        const validPhoneNumber = (0, libphonenumber_js_1.isValidPhoneNumber)(data.phone_number, (_b = data.country_code) === null || _b === void 0 ? void 0 : _b.toUpperCase());
        console.log(validPhoneNumber, "This is the valid phone number result");
        if (!phoneNumber || !validPhoneNumber) {
            throw new error_1.BadRequestError("Phone number or country code is invalid");
        }
    }
    if (result.success) {
        if (result.data && "country_code" in result.data) {
            delete result.data.country_code;
        }
        if (!result.data.phone_number) {
            delete result.data.phone_number;
        }
        return Object.assign(Object.assign({}, result.data), { phone_number: phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.number });
    }
    const errMsgs = result.error.issues.map((response) => {
        return response.message;
    });
    throw new error_1.BadRequestError(errMsgs[0]);
};
class BasicLoginRequestDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
exports.BasicLoginRequestDTO = BasicLoginRequestDTO;
BasicLoginRequestDTO.validate = (data) => {
    const Account = z
        .strictObject({
        email: z.email("Email is required"),
        password: z.string("Password is required"),
    })
        .required();
    const result = Account.safeParse(data);
    if (result.success) {
        return result.data;
    }
    const errMsgs = result.error.issues.map((response) => {
        return response.message;
    });
    throw new error_1.BadRequestError(errMsgs[0]);
};
