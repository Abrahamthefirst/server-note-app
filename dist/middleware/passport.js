"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const googleAuthStrategy = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/api/session/oauth/google",
        passReqToCallback: true,
    }, function (req, accessToken, refreshToken, profile, done) {
        var _a, _b;
        req.user = {
            email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || "No email available",
            username: profile.displayName,
            picture: profile._json.picture,
        };
        return done(null, profile);
    }));
};
exports.googleAuthStrategy = googleAuthStrategy;
