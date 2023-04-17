import { parseJwt } from "./parseJwt";

export const ACCESS_EXP_MESSAGE = "Access Token Expired";
export const REFRESH_EXP_MESSAGE = "Refresh Token Expired";

export const CheckJWTExp = (access: string, refresh: string) => {
  const decodedAccess = parseJwt(access);
  const decodedRefresh = parseJwt(refresh);
  // console.log(decodedAccess, decodedRefresh); // 해부된 토큰내부 확인

  if (decodedAccess?.exp * 1000 < Date.now()) {
    return ACCESS_EXP_MESSAGE;
  }
  if (decodedRefresh?.exp * 1000 < Date.now()) {
    return REFRESH_EXP_MESSAGE;
  }
  return true;
};
