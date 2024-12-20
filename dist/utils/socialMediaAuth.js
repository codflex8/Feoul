"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwitterUserData = exports.getFacebookUserData = exports.verifyGoogleAuth = exports.SocialMediaUserData = void 0;
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = __importDefault(require("./ApiError"));
const twitter_lite_1 = __importDefault(require("twitter-lite"));
const logger_1 = require("./logger");
class SocialMediaUserData {
    constructor(username, imageUrl, email, userId) {
        this.username = username;
        this.imageUrl = imageUrl;
        this.email = email;
        this.userId = userId;
    }
}
exports.SocialMediaUserData = SocialMediaUserData;
const verifyGoogleAuth = async (token) => {
    try {
        const response = await axios_1.default.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            params: {
                access_token: token,
            },
        });
        logger_1.httpLogger.info("Google user data", { data: response.data });
        return new SocialMediaUserData(response.data.name, response.data.picture, response.data.email, response.data.sub);
    }
    catch (error) {
        logger_1.httpLogger.error("Error verifying Google auth", { error });
        throw new ApiError_1.default("Error verifying Google auth", 500);
    }
};
exports.verifyGoogleAuth = verifyGoogleAuth;
const getFacebookUserData = async (token) => {
    try {
        const response = await axios_1.default.get("https://graph.facebook.com/me", {
            params: {
                access_token: token,
                fields: "id,name,email,picture",
            },
        });
        logger_1.httpLogger.info("Facebook user data", { data: response.data });
        return new SocialMediaUserData(response.data.name, response.data.picture.data.url, response.data.email, response.data.id);
    }
    catch (error) {
        logger_1.httpLogger.error("Error getting Facebook user data", { error });
        throw new ApiError_1.default("Error getting Facebook user data", 500);
    }
};
exports.getFacebookUserData = getFacebookUserData;
const getTwitterUserData = async (token, tokenSecret) => {
    try {
        const client = new twitter_lite_1.default({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: token,
            access_token_secret: tokenSecret,
        });
        const response = await client.get("account/verify_credentials", {
            include_email: true,
        });
        logger_1.httpLogger.info("Twitter user data", { data: response });
        return new SocialMediaUserData(response.name, response.profile_image_url_https, response.email, response.id_str);
    }
    catch (error) {
        logger_1.httpLogger.error("Error getting Twitter user data", { error });
        throw new ApiError_1.default("Error getting Twitter user data", 500);
    }
};
exports.getTwitterUserData = getTwitterUserData;
