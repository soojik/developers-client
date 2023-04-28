import MainListTitle from "./MainListTitle";
import { Link } from "react-router-dom";
import ViewIcon from "./icons/ViewIcon";
import LikesIcon from "./icons/LikesIcon";
import RightArrowIcon from "./icons/RightArrowIcon";
import Tags from "./Tags";

interface MainListProps {
  answer: string;
  answerCandidate: string[];
  content: string;
  createdTime: string;
  hashTag: string[];
  level: string;
  likes: number;
  views: number;
  problemId: number;
  pathname?: string | null;
  title: string;
  type: string;
  writer: string;
}
interface RoomsProps {
  createdAt: string;
  description: string;
  mentorName: string;
  mentoringRoomId: number;
  title: string;
}
interface RankingProps {
  nickname: string;
  point: number;
}

type MainListType = {
  sectionHeader: string;
  option: string;
  problems?: MainListProps[];
  rooms?: RoomsProps[];
  ranking?: RankingProps[];
};

const MainList = ({
  sectionHeader,
  option,
  problems,
  rooms,
  ranking,
}: MainListType) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex p-3 justify-between">
          <MainListTitle>{sectionHeader}</MainListTitle>
          <Link
            to={`${option === "problem" ? "/problem" : "/mentoring"}`}
            className="flex"
          >
            <RightArrowIcon stroke="black" width={25} height={25} />
          </Link>
        </div>
        {option === "problem" && (
          <>
            {problems?.length === 0 && (
              <div className="font-thin py-16 flex justify-center">
                최근 등록된 문제가 없습니다.
              </div>
            )}
            {problems!.map((el, idx) => (
              <Link
                to={`/problem/detail`}
                state={el}
                key={idx}
                className="h-[100px] hover:bg-slate-100 hover:bg-opacity-60 p-3 border-b last:border-b-0 flex justify-between"
              >
                <div className="flex flex-col w-[90%] justify-around">
                  <div className="text-md font-semibold">{el.title}</div>
                  <Tags tagList={el.hashTag} />
                  <div className="flex justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <div className="flex text-sm text-slate-600">
                          {el.writer} &nbsp; &nbsp;
                        </div>
                        <div className="flex text-sm mr-4 items-center text-gray-400">
                          <ViewIcon fill="lightGray" width={18} height={18} />
                          &nbsp;{el.views}
                        </div>
                        <div className="flex text-sm mr-4 items-center text-gray-400">
                          <LikesIcon fill="lightGray" width={14} height={14} />
                          &nbsp;{el.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center text-sm min-w-[40px]">
                  {el.type === "answer" ? "주관식" : "객관식"}
                </div>
              </Link>
            ))}
          </>
        )}
        {option === "room" && (
          <>
            {rooms?.length === 0 && (
              <div className="font-thin py-16 flex justify-center">
                최근 개설된 채팅방이 없습니다.
              </div>
            )}
            {rooms?.slice(0, 5).map((el, idx) => (
              <Link
                to={`/mentoring/${el.mentoringRoomId}`} // 멘토링 방 url이 없음
                key={idx}
                className="h-[100px] hover:bg-slate-100 hover:bg-opacity-60 p-3 border-b last:border-b-0"
              >
                <div className="text-md font-semibold">{el.title}</div>
                <div className="text-sm opacity-80">{el.description}</div>
                <div className="flex justify-between opacity-40">
                  <div className="text-sm font-medium">
                    {el.mentorName} &nbsp;
                  </div>
                  <div className="text-sm">{el.createdAt.slice(0, 10)}</div>
                </div>
              </Link>
            ))}
          </>
        )}
        {option === "ranking" && (
          <>
            {ranking?.length === 0 && (
              <div className="font-thin py-16 flex justify-center">
                가입한 사용자가 없습니다.
              </div>
            )}
            {ranking!.map((el, idx) => (
              <div className="flex justify-between">
                <div className="text-sm font-medium">{el.nickname} &nbsp;</div>
                <div className="text-sm">{el.point}점</div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};
export default MainList;
