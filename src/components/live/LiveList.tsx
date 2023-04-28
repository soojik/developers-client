import { useEffect, useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import SearchBar from "./SearchBar";
import RoomList, { Room } from "./RoomList";
import React from "react";
import { EventProp } from "../../pages/Mentoring";
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";

interface LiveListProps {
  events: EventProp[]; // 내 기준으로 조회된 모든 스케쥴
}

const LiveList: React.FC<LiveListProps> = ({ events }) => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomList, setRoomList] = useState<Room[]>([]);

  const [currentPage, setCurrentPage] = useState(0); // 페이징
  const [displayedRooms, setDisplayedRooms] = useState<Room[]>([]);
  const PAGE_SIZE = 20;

  const fetchRooms = async (lastTime: Date | null) => {
    const lastDateTimeParam = lastTime ? `/next?lastDateTime=${lastTime}` : "";
    const url = `/api/room${lastDateTimeParam}`;
    const data = await axiosInstance.get(url);
    return data.data.data;
  };

  let flag = false;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRooms(null);
      setRoomList(data);
      setCurrentPage(1);
    };

    if (flag === false) {
      fetchData();
      flag = true;
    }
  }, []);

  useEffect(() => {
    const sliceEndIndex = currentPage * PAGE_SIZE;
    setDisplayedRooms(roomList.slice(0, sliceEndIndex));
  }, [roomList, currentPage]);

  const handleScroll = async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if ((currentPage + 1) * PAGE_SIZE <= roomList.length) {
        setCurrentPage(currentPage + 1);
      } else {
        const lastRoom = roomList[roomList.length - 1];
        const newRooms = await fetchRooms(lastRoom.createdAt);
        setRoomList((prevRooms) => [...prevRooms, ...newRooms]);
        setCurrentPage(currentPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      alert('3글자 이상부터 검색이 가능합니다.');
      return;
    }
    if (query) {
      // 1개 이상의 공백을 1개로 바꿔 보내주도록하고 앞, 뒤 공백 제거
      const url = `/api/room/${query.replace(/\s+/g, ' ').trim()}`;
      const data = await axiosInstance.get(url);
      setRoomList([...data.data.data]);
      setCurrentPage(1);
    }
    // 빈칸 입력하면 모든 데이터 가져오도록
    else {
      const data = await fetchRooms(null);
      setRoomList([...data]);
      setCurrentPage(1);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center">
        <div className="w-3/4 flex justify-center">
          <SearchBar onSearch={handleSearch}></SearchBar>
        </div>
        {memberInfo.mentor && (
          <div className="w-fit ml-4 flex items-center">
            <button
              className="py-2 px-4 rounded-md text-slate-50 bg-accent-400 hover:bg-accent-500 mx-auto"
              onClick={handleOpenModal}
            >
              방 생성
            </button>
          </div>
        )}
      </div>
      <div className="w-full">
        <RoomList events={events} rooms={displayedRooms}></RoomList>
      </div>
      {isModalOpen && (
        <CreateRoomModal
          onClose={() => {
            setIsModalOpen(false);
          }}
          events={events}
        />
      )}
    </div>

  );
};

export default LiveList;
