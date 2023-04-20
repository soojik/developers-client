import MainListTitle from "./MainListTitle";
import { Link } from "react-router-dom";
import ViewIcon from "./icons/ViewIcon";
import LikesIcon from "./icons/LikesIcon";
import RightArrowIcon from "./icons/RightArrowIcon";

interface MainListProps {
  problemId: number;
  writer: string;
  type: string;
  views: number;
  likes: number;
  title: string;
  hashTag?: string;
}
interface RoomsProps {
  createdAt: string;
  description: string;
  mentorName: string;
  mentoringRoomId: number;
  title: string;
}

type MainListType = {
  sectionHeader: string;
  option: string;
  problems?: MainListProps[];
  rooms?: RoomsProps[];
};

const MainList = ({ sectionHeader, option, problems, rooms }: MainListType) => {
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
                to={`/problem/${el.problemId}`}
                key={idx}
                className="h-[100px] hover:bg-slate-100 hover:bg-opacity-60 p-3 border-b last:border-b-0 flex justify-between"
              >
                <div className="flex flex-col justify-between">
                  <div className="text-md font-semibold">{el.title}</div>
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
                <div className="flex justify-center items-center text-sm">
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
            {rooms!.slice(5, rooms!.length).map((el, idx) => (
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
      </div>
    </>
  );
};
export default MainList;
