import { RecoilState, atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

// notify 전역 상태 관리
export const scheduleSubscriptionState = atom({
  key: "scheduleSubscriptionState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const resetScheduleSubscriptionsState = (
  set: (arg0: RecoilState<any>, arg1: never[]) => void
) => {
  set(scheduleSubscriptionState, []);
};
