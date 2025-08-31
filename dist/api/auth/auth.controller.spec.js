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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFibbonaciSum = (n) => {
    if (n == 1)
        return 0;
    if (n == 2) {
        return 1;
    }
    else {
        return getFibbonaciSum(n - 1) + getFibbonaciSum(n - 2);
    }
};
const auth_controller_1 = __importDefault(require("./auth.controller"));
const config_1 = __importDefault(require("../../config/config"));
const dep_manager_1 = require("../../classes/dep_manager");
//
// describe("Test for the fibonnaci sequence series", () => {
//   it("Test fibonnaci series of 5", () => {
//     const expectedResult = 3;
//     expect(getFibbonaciSum(5)).toBe(expectedResult);
//   });
//   it("Test fibonnaci series of 7", () => {
//     const expectedResult = 8;
//     expect(getFibbonaciSum(7)).toBe(expectedResult);
//   });
//   it("Test fibonnaci series of 9", () => {
//     const expectedResult = 21;
//     expect(getFibbonaciSum(9)).toBe(expectedResult);
//   });
// });
let mockRequest;
let mockResponse;
let mockNext;
let authController;
let depMan;
// let authServiceMock: DeepMockProxy<AuthService>;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // basically we are to trying to test the login controller now
    // Arrange variables, act, asset
    // we need to an authservice that will be mocked to create a controller, so we perform that through dependency injection
    // the parameters for the login then includes a request, a response and a next function
    // authServiceMock = mockDeep<AuthService>();
    depMan = yield dep_manager_1.DependencyManager.getInstance((0, config_1.default)());
    authController = new auth_controller_1.default(depMan.getService("auth"));
    mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
    };
    mockRequest = {
        body: {},
    };
    mockNext = jest.fn();
}));
describe("user login test", () => {
    it("should return with a 200 as the status code and a User data without the hashed_password as the json response when a the right details are inputed", () => __awaiter(void 0, void 0, void 0, function* () {
        const userDetails = {
            email: "abrahamodusegun36@gmail.com",
            password: "Maximus108",
        };
        mockRequest.body = Object.assign({}, userDetails);
        const authService = depMan.getService("auth");
        let mockJsonResult;
        mockJsonResult = {
            id: "asdf",
            email: "abrahamodusegun36@gmail.com",
            username: "Brahmsz",
            email_verified: false,
            picture: null,
            phone_number: "09013908081",
            role: "ADMIN",
            createdAt: new Date("2025-07-07T12:55:13.137Z"),
            updatedAt: new Date("2025-07-11T11:19:22.544Z"),
        };
        yield authController.login(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        const { refresh_token } = mockJsonResult, mockApiResponse = __rest(mockJsonResult, ["refresh_token"]);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(mockApiResponse));
        expect(mockNext).not.toHaveBeenCalled();
    }));
    it("should return with a 400 status code and message that shows some type of validation failed for email missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const reqBody = {
            password: "indomie",
        };
        mockRequest.body = Object.assign({}, reqBody);
        const jsonResponse = {
            message: ["Email is required"],
        };
        // we are not mocking any service because we belive that the function should have returned before calling any service
        yield authController.login(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(jsonResponse);
    }));
});
