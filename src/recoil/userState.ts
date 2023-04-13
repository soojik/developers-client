import axios from "axios";
import { atom, selector, selectorFamily } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export interface MemberInfoProps {
  memberId: number | undefined;
  isLoggedIn: boolean;
}

const URL = process.env.REACT_APP_DEV_URL;

export const userInfo = selectorFamily({
  key: "userInfo",
  get: (memberId: number) => async () => {
    const { data } = await axios.get(`${URL}/api/member/${memberId}`);
    return data;
  },
});

export const memberInfoState = atom<MemberInfoProps>({
  key: "memberInfo",
  default: {
    memberId: undefined,
    isLoggedIn: false,
  },
  effects_UNSTABLE: [persistAtom],
});
