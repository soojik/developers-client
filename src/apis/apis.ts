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
export const ROOM_API = {
  getRoomNew: () => {
    return axiosInstance({ method: "GET", url: `/api/room/top` });
  },
};
export const PROBLEM_API = {
  getProblemNew: () => {
    return axiosInstance({
      method: "GET",
      url: `api/problem/list?order=createdTime`,
    });
  },
  getProblemLikes: () => {
    return axiosInstance({
      method: "GET",
      url: `api/problem/list?order=likes`,
    });
  },
};
