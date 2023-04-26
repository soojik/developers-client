import { MEMBER_API } from "apis/apis";
import { SetStateAction, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";

const badgeName = [
  { badge: "초급자", path: "BEGINNER", color: "text-green-500" },
  { badge: "중급자", path: "JUNIOR", color: "text-gray-500" },
  { badge: "고급자", path: "JUNGNIOR", color: "text-orange-400" },
  { badge: "해결사", path: "SENIOR", color: "text-purple-500" },
];

const BadgeList = ({
  setBadge,
}: {
  setBadge: React.Dispatch<SetStateAction<string>>;
}) => {
  const { memberId } = useRecoilValue(memberInfoState);
  const [pickBadges, setPickBadges] = useState(""); // 착용 1개
  const [badgeList, setBadgeList] = useState<{ badge: string }[]>([]); //획득 목록

  useEffect(() => {
    const getBadge = async () => {
      const { data } = await MEMBER_API.getBadge(Number(memberId));
      setBadgeList(data?.data?.myBadgeList);
    };
    const postFirstBadge = async () => {
      const reqData = { memberId, archieveBadge: "BEGINNER" };
      const { data } = await MEMBER_API.postBadge(reqData);
      getBadge();
    };
    const getBadgePick = async () => {
      const { data } = await MEMBER_API.getPickBadge(Number(memberId));
      if (data?.data !== null) setPickBadges(data?.data?.myBadge);
      // console.log("착용 :", data);
    };
    postFirstBadge();
    getBadge();
    getBadgePick();
  }, []);

  const handlePickBadge = async (path: string, name: string) => {
    try {
      const reqData = { memberId, badgeName: path };
      const { data } = await MEMBER_API.patchBadge(reqData);
      if (data.code === "200 OK") {
        setPickBadges(path);
        setBadge(name);
        console.log("착용patch", name, data);
      } else console.log("에러", data);
    } catch (error) {
      alert("착용에 실패했습니다");
    }
  };

  return (
    <div className="h-[310px]">
      <div className="flex font-bold text-xl justify-center mt-2 mb-8">
        칭호 목록
      </div>
      <div className="text-xs m-2 text-slate-400">
        칭호를 획득하고 착용해보세요!
      </div>
      <div className="flex justify-between text-sm font-bold border-b p-2 text-slate-500">
        <div>칭호명</div>
        <div>착용 여부</div>
      </div>
      {badgeName?.map((el) => (
        <div
          className="flex justify-between p-2 items-center border-b last:border-0"
          key={el.badge}
        >
          <div className={`${el.color}`}>{el.badge}</div>

          {badgeList && badgeList?.length > 0 ? (
            badgeList?.map((item) => {
              return item.badge !== el.path ? (
                <button
                  className="min-w-[80px] text-xs font-semibold text-white bg-gray-400 rounded-lg py-2 px-4"
                  key={el.path}
                  disabled
                >
                  착용 불가
                </button>
              ) : pickBadges === el.path ? (
                <button
                  className="min-w-[80px] text-xs font-semibold text-white bg-emerald-500 rounded-lg py-2 px-4"
                  key={el.path}
                >
                  착용 중
                </button>
              ) : (
                <button
                  className="min-w-[80px] text-xs font-semibold text-white bg-[#4e6bf8] rounded-lg py-2 px-4 hover:bg-[#3549ad]"
                  key={el.path}
                  onClick={() => handlePickBadge(el.path, el.badge)}
                >
                  착용
                </button>
              );
            })
          ) : (
            <button
              className="min-w-[80px] text-xs font-semibold text-white bg-gray-400 rounded-lg py-2 px-4"
              key={el.path}
              disabled
            >
              착용 불가
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
export default BadgeList;
