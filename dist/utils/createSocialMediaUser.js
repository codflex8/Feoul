"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocialMediaUser = void 0;
const User_model_1 = require("../entities/User.model");
const createSocialMediaUser = async ({ email, username, imageUrl, googleId, facebookId, twitterId, }) => {
    const newUser = User_model_1.User.create({
        email,
        username,
        imageUrl,
        googleId,
        facebookId,
        twitterId,
        verifyEmail: true,
    });
    await newUser.save();
    return newUser;
};
exports.createSocialMediaUser = createSocialMediaUser;
