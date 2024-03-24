import * as dbAPI from "../utils/databaseAPI";
import * as lsAPI from "../utils/localStorage";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
}

export async function getUserInfo(): Promise<User | null> {
  let userInfo: User| null = lsAPI.getUserInfoFromSessionStorage();
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
    signOut();
    return false;
  }

  if (lsAPI.isCookieExpired("accessToken")) {
    await dbAPI.refreshAccessToken();
  }

  // Check again after refreshing access token
  if (lsAPI.isCookieExpired("accessToken")) {
    signOut();
    return false;
  }

  return true;
}

export function signOut(): void {
  lsAPI.clear();
}
