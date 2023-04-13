import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

interface MemberInfoProps {
  isLoggedIn: boolean;
}

export const memberInfoState = atom<MemberInfoProps>({
  key: "memberInfo",
  default: { isLoggedIn: false },
  effects_UNSTABLE: [persistAtom],
});
