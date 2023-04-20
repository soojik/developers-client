import { axiosInstance } from "./axiosConfig";

export const MEMBER_API = {
  login: <T>(data: T) => {
    return axiosInstance({
      method: "POST",
      url: `/api/auth/login`,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  getUser: (memberId: number) => {
    return axiosInstance({ method: "GET", url: `/api/member/${memberId}` });
  },
  getResume: (memberId: number) => {
    return axiosInstance({
      method: "GET",
      url: `/api/member/career/${memberId}`,
    });
  },
  patchRsm: <T>(data: T) => {
    return axiosInstance({
      method: "PATCH",
      url: `/api/member/resume`,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
export const ROOMAPI = {
  getRoomTop: () => {
    return axiosInstance({ method: "GET", url: `/api/room/top` });
  },
};
