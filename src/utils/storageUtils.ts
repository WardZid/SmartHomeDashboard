// Function to set cookies
export function setCookie(name: string, value: string, expirySeconds: number) {
    const d = new Date();
    d.setTime(d.getTime() + expirySeconds * 1000); // Convert seconds to milliseconds
    const expires = "expires=" + d.toUTCString();
    document.cookie =
      name + "=" + value + ";" + expires + ";path=/;SameSite=Strict;Secure;";
  }
  
  // Function to get cookie value by name
  export function getCookie(name: string): string {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  }
  
  // Function to clear all cookies
  export function clearAllCookies() {
    const cookies = document.cookie.split(";");
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict;`;
    }
  }
  
  // Function to set access token cookie
  export function setAccessToken(accessToken: string, expiry: number) {
    setCookie("accessToken", accessToken, expiry);
  }
  
  // Function to set refresh token cookie
  export function setRefreshToken(refreshToken: string, expiry: number) {
    setCookie("refreshToken", refreshToken, expiry);
  }
  
  // Function to set user ID cookie
  export function setUserID(userID: string, expiry: number) {
    setCookie("userID", userID, expiry);
  }
  
  // Function to get access token cookie
  export function getAccessToken(): string {
    return getCookie("accessToken");
  }
  
  // Function to get refresh token cookie
  export function getRefreshToken(): string {
    return getCookie("refreshToken");
  }
  
  // Function to get user ID cookie
  export function getUserID(): string {
    return getCookie("userID");
  }
  
  // Function to set user info to session storage
  export function setUserInfoToSessionStorage(userInfo: any) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }
  
  // Function to get user info from session storage
  export function getUserInfoFromSessionStorage(): any {
    const userInfoString = sessionStorage.getItem('userInfo');
    return JSON.parse(userInfoString || "");
  }
  
  // Function to clear session storage and all cookies
  export function clear() {
    sessionStorage.clear();
    clearAllCookies();
  }
  
  // Function to check if a cookie has expired
  export function isCookieExpired(cookieName: string): boolean {
    const cookieValue = getCookie(cookieName);
    if (!cookieValue) {
      // Cookie doesn't exist
      return true;
    }
  
    const cookiePairs = cookieValue.split(';');
    for (let i = 0; i < cookiePairs.length; i++) {
      const pair = cookiePairs[i].trim().split('=');
      if (pair[0] === 'expires') {
        const expirationDate = new Date(pair[1]);
        const currentDate = new Date();
        return expirationDate < currentDate;
      }
    }
  
    // If there's no 'expires' attribute, the cookie doesn't have an expiration date
    return false;
  }
  