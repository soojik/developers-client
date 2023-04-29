import { useEffect, useState } from "react";
import { POINT_API, PROBLEM_API, ROOM_API } from "apis/apis";
import Carousel from "components/Carousel";
import MainList from "components/MainList";

const Main = () => {
  const [roomTop, setRoomTop] = useState([]);
  const [problemNew, setProblemNew] = useState([]);
  const [problemLikes, setProblemLikes] = useState([]);
  const [pointRanking, setPointRanking] = useState([]);
  useEffect(() => {
    const getRoomNewest = async () => {
      const {
        data: { data },
      } = await ROOM_API.getRoomNew();
      setRoomTop(data);
    };
    const getProblemNewest = async () => {
      const {
        data: { data },
      } = await PROBLEM_API.getProblemNew();
      setProblemNew(data.slice(0, 5));
    };
    const getProblemLike = async () => {
      const {
        data: { data },
      } = await PROBLEM_API.getProblemLikes();
      setProblemLikes(data.slice(0, 5));
    };
    const getPointRanking = async () => {
      const {
        data: { data },
      } = await POINT_API.getPointRanking();
      // console.log("랭킹", data);
      setPointRanking(data.pointRanking);
    };
    getRoomNewest();
    getProblemNewest();
    getProblemLike();
    getPointRanking();
  }, []);

  return (
    <div className="md:w-[90%] md:m-auto">
      <Carousel />
      <div className="flex flex-col w-full md:grid md:grid-cols-2 md:gap-10 ">
        <MainList
          problems={problemNew}
          option="problem"
          sectionHeader={"최근 등록된 문제"}
        />
        <MainList
          rooms={roomTop}
          option="room"
          sectionHeader={"최근 개설된 멘토링룸"}
        />
        <MainList
          problems={problemLikes}
          option="problem"
          sectionHeader={"오늘의 추천 문제"}
        />
        <MainList
          ranking={pointRanking}
          option="ranking"
          sectionHeader={"포인트 랭킹 TOP 10"}
        />
      </div>
    </div>
  );
};

export default Main;
