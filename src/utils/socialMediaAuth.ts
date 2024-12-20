import axios from "axios";
import ApiError from "./ApiError";
import Twitter from "twitter-lite";
import { httpLogger } from "./logger";

export class SocialMediaUserData {
  constructor(
    public username: string,
    public imageUrl: string,
    public email: string,
    public userId?: string
  ) {}
}

// Define interfaces for the expected response data
interface GoogleUserInfoResponse {
  email: string;
  sub: string;
  name: string;
  picture: string;
}

interface FacebookUserInfoResponse {
  email: string;
  id: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

interface TwitterUserInfoResponse {
  id_str: string;
  name: string;
  profile_image_url_https: string;
  email: string;
}

export const verifyGoogleAuth = async (
  token: string
): Promise<SocialMediaUserData> => {
  try {
    const response = await axios.get<GoogleUserInfoResponse>(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        params: {
          access_token: token,
        },
      }
    );
    httpLogger.info("Google user data", { data: response.data });
    return new SocialMediaUserData(
      response.data.name,
      response.data.picture,
      response.data.email,
      response.data.sub
    );
  } catch (error) {
    httpLogger.error("Error verifying Google auth", { error });
    throw new ApiError("Error verifying Google auth", 500);
  }
};

export const getFacebookUserData = async (
  token: string
): Promise<SocialMediaUserData> => {
  try {
    const response = await axios.get<FacebookUserInfoResponse>(
      "https://graph.facebook.com/me",
      {
        params: {
          access_token: token,
          fields: "id,name,email,picture",
        },
      }
    );
    httpLogger.info("Facebook user data", { data: response.data });
    return new SocialMediaUserData(
      response.data.name,
      response.data.picture.data.url,
      response.data.email,
      response.data.id
    );
  } catch (error) {
    httpLogger.error("Error getting Facebook user data", { error });
    throw new ApiError("Error getting Facebook user data", 500);
  }
};

export const getTwitterUserData = async (
  token: string,
  tokenSecret: string
): Promise<SocialMediaUserData> => {
  try {
    const client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY!,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
      access_token_key: token,
      access_token_secret: tokenSecret,
    });

    const response = await client.get<TwitterUserInfoResponse>(
      "account/verify_credentials",
      {
        include_email: true,
      }
    );

    httpLogger.info("Twitter user data", { data: response });
    return new SocialMediaUserData(
      response.name,
      response.profile_image_url_https,
      response.email,
      response.id_str
    );
  } catch (error) {
    httpLogger.error("Error getting Twitter user data", { error });
    throw new ApiError("Error getting Twitter user data", 500);
  }
};
