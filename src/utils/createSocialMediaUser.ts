import { User } from "../entities/User.model";

export const createSocialMediaUser = async ({
  email,
  username,
  imageUrl,
  googleId,
  facebookId,
  twitterId,
}: {
  email: string;
  username: string;
  imageUrl: string;
  googleId?: string;
  facebookId?: string;
  twitterId?: string;
}) => {
  const newUser = User.create({
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
