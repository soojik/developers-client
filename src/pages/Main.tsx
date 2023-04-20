import { ROOMAPI } from "apis/apis";
import Carousel from "components/Carousel";
import MainList from "components/MainList";
import { useEffect, useState } from "react";

const Main = () => {
  const [roomTop, setRoomTop] = useState([]);
  useEffect(() => {
    const getRoom = async () => {
      const {
        data: { data },
      } = await ROOMAPI.getRoomTop();
      setRoomTop(data);
    };
    getRoom();
  }, []);

  // 최근 등록된 문제 더미데이터
  const problems = [
    {
      problemId: 1,
      writer: "유저1",
      type: "answer",
      views: 0,
      likes: 0,
      title: "제목입니다",
    },
    {
      problemId: 2,
      writer: "유저2",
      type: "choice",
      views: 0,
      likes: 0,
      title: "제목입니다2",
    },
    {
      problemId: 3,
      writer: "유저3",
      type: "answer",
      views: 0,
      likes: 0,
      title: "제목입니다3",
    },
    {
      problemId: 4,
      writer: "유저4",
      type: "answer",
      views: 0,
      likes: 0,
      title: "제목입니다4",
    },
    {
      problemId: 5,
      writer: "유저5",
      type: "choice",
      views: 0,
      likes: 0,
      title: "제목입니다5",
    },
  ];

  return (
    <div className="md:w-[90%] md:m-auto">
      <Carousel />
      <div className="flex flex-col w-full md:grid md:grid-cols-2 md:gap-10 ">
        <MainList
          problems={problems}
          option="problem"
          sectionHeader={"최근 등록된 문제"}
        />
        <MainList
          rooms={roomTop}
          option="room"
          sectionHeader={"최근 개설된 채팅방"}
        />
        <MainList
          problems={problems}
          option="problem"
          sectionHeader={"WEEKLY SOLVED BEST"}
        />
        <MainList
          rooms={roomTop}
          option="room"
          sectionHeader={"WEEKLY ROOM BEST"}
        />
      </div>
    </div>
  );
};

export default Main;
