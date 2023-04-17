import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export interface MemberInfoProps {
  memberInfo: any;
  memberId: number | undefined;
  isLoggedIn: boolean;

}

export const memberInfoState = atom<MemberInfoProps>({
  key: "memberInfo",
  default: {
    memberInfo: {},
    memberId: undefined,
    isLoggedIn: false,

  },
  effects_UNSTABLE: [persistAtom],
});
