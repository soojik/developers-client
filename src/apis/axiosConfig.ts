import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_EXP_MESSAGE, CheckJWTExp } from "libs/checkJwtExp";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "libs/localStorage";

axios.defaults.withCredentials = true;

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_DEV_URL,
  timeout: 15000,
});

const logOnDev = (message: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message);
  }
};

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const { method, url } = config;
  logOnDev(`👉 Req [${method?.toUpperCase()}] | URL- ${url}`);

  config.timeout = 15000;

  const accessToken = getLocalStorage("access_token");
  const refreshToken = getLocalStorage("refresh_token");
  if (accessToken) {
    /** 2. access 토큰 있으면 만료됐는지 체크 */
    if (CheckJWTExp(accessToken, refreshToken) === ACCESS_EXP_MESSAGE) {
      /** 3. 만료되면 만료된 access, refresh 같이 헤더 담아서 요청 */
      // console.log('만료됨! refresh 토큰 담기');
      config.headers!.Authorization = `Bearer ${accessToken}`;
      config.headers!.Refresh = `${refreshToken}`;
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }
  }

  return config;
};

const onResponse = async (response: AxiosResponse) => {
  const { method, url } = response.config;
  const { status } = response;
  logOnDev(`👈 Res [${method?.toUpperCase()}] ${status} | URL- ${url}`);

  // 새 access 토큰 받으면 교체하기
  if (response.data.accessToken) {
    const newAccessToken = response?.data?.accessToken;
    removeLocalStorage("access_token"); // 만료된 access토큰 삭제
    setLocalStorage("access_token", `Bearer ${newAccessToken}`); // 새걸로 교체
    // response.config.headers = {
    //   authorization: `${newAccessToken}`,
    // };
  }
  return response;
};

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;

    logOnDev(
      `🚨 Error [${method?.toUpperCase()}] ${status} :${message} | URL- ${url}`
    );
  } else {
    logOnDev(`🚨 Error ${error.message}`);
    console.error(error.message);
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, (err) => Promise.reject(err));
axiosInstance.interceptors.response.use(onResponse, onErrorResponse);
