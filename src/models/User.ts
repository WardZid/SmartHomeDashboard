import { useNavigate } from "react-router-dom";
import * as dbAPI from "../utils/databaseAPI";
import * as lsAPI from "../utils/localStorage";

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  home_id: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
    // Ensure the error prototype is correctly set when extending built-in classes in TypeScript
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export async function getUserInfo(): Promise<User | null> {
  let userInfo: User | null = lsAPI.getUserInfoFromSessionStorage();
  if (userInfo == null) {
    userInfo = await dbAPI.fetchUserInfo();
    if (userInfo) {
      lsAPI.setUserInfoToSessionStorage(userInfo);
    }
  }
  return userInfo;
}

export async function isLoggedIn(): Promise<boolean> {
  if (lsAPI.isCookieExpired("refreshToken")) {
    logOut();
    return false;
  }

  if (lsAPI.isCookieExpired("accessToken")) {
    await dbAPI.refreshAccessToken();
  }

  // Check again after refreshing access token
  if (lsAPI.isCookieExpired("accessToken")) {
    logOut();
    return false;
  }

  return true;
}

export async function register(username: string, password: string, firstName: string, lastName: string, homeId: string): Promise<boolean> {
  if (await dbAPI.register(username, password)) {
    await logIn(username, password);
    const userID = lsAPI.getUserID();
    if (userID) {
      const response = await dbAPI.insertNewUserInfo(userID, firstName, lastName, homeId);
      return response;
    }
  }
  return false;
}

export async function logIn(username: string, password: string): Promise<boolean> {
  return await dbAPI.login(username, password);
}

export function logOut(): void {
  lsAPI.clear();
}

