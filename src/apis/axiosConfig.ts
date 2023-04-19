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

const accessToken = getLocalStorage("access_token");
const refreshToken = getLocalStorage("refresh_token");

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

/* 새로고침 시 토큰 재발급 - 적용 예정 */
export const onSlientRefersh = () => {
  // console.log("새로고침 - 토큰 재발급");
  if (accessToken && refreshToken) {
    axiosInstance.post(`/api/auth/refresh`, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
};

const onRequest = async (config: InternalAxiosRequestConfig) => {
  const { method, url } = config;
  logOnDev(`👉 Req [${method?.toUpperCase()}] | URL- ${url}`);

  config.timeout = 15000;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
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
    setLocalStorage("access_token", `${newAccessToken}`); // 새걸로 교체
    axios.defaults.headers!.common[
      "Authorization"
    ] = `Bearer ${newAccessToken}`;

    /* refresh 임시 */
    const newRefreshToken = response?.data?.refreshToken;
    removeLocalStorage("refresh_token");
    setLocalStorage("refresh_token", `${newRefreshToken}`);
  }
  return response;
};

const onErrorResponse = async (
  error: AxiosError | Error
): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;
    const originRequest = error.config!;

    logOnDev(
      `🚨 Error [${method?.toUpperCase()}] ${status} :${message} | URL- ${url}`
    );

    /* 토큰 만료 응답 시 재발급 */
    if (error.response?.status === 403) {
      if (error.response?.data?.msg === "Expired Token") {
        const { data } = await axiosInstance.post(`/api/auth/refresh`, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        axios.defaults.headers!.common.Authorization = `Bearer ${data.accessToken}`;
        originRequest!.headers.Authorization = `Bearer ${data.accessToken}`;
        removeLocalStorage("access_token");
        setLocalStorage("access_token", `${data.accessToken}`);
        return await axios(originRequest);
      }
    }
  } else {
    logOnDev(`🚨 Error ${error.message}`);
    console.error(error.message);
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, (err) => Promise.reject(err));
axiosInstance.interceptors.response.use(onResponse, onErrorResponse);
