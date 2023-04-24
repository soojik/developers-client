import axios from "axios";
import React, { useEffect, useState } from "react";
import Popup from "./PopUp";
import ModifyRoomInfo from "./ModifyRoomInfo";
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { EventProp } from "pages/Mentoring";
import { thumbnails } from "./RoomList";

export interface Room {
  mentoringRoomId: number;
  mentorName: string;
  title: string;
  description: string;
  createdAt: Date;
  startTime: string;
}

interface MentorSchedulingProps {
  events: EventProp[];
}

const MentorScheduling: React.FC<MentorSchedulingProps> = ({ events }) => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>(null as any);

  useEffect(() => {
    axiosInstance({
      url: `/api/room/mentor/${memberId}`,
      method: "get",
    })
      .then((res) => {
        setRoomList(res.data["data"]);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClickRoom = (room: Room) => {
    setIsModalOpen(true);
    setSelectedRoom(room);
  };

  const handleRemoveSchedule = (room: Room) => {
    if (window.confirm("멘토링 방을 삭제하시겠습니까?")) {
      console.log("room", room);
      axiosInstance({
        url: `/api/room/${room.mentoringRoomId}`,
        method: "delete",
      })
        .then((res) => {
          window.alert(res.data["msg"]);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {roomList.map((room) => (
        <div
          className="flex flex-col items-center bg-gray-100 p-4 m-4 rounded-lg"
          onClick={() => handleClickRoom(room)}
        >
          <div>
            <img src={thumbnails[room.mentoringRoomId % 6]} alt="Thumbnail" />
          </div>
          <div className="text-lg font-semibold mt-2">{room.title}</div>
          <div className="flex justify-center items-center mt-2">
            <div className="flex items-center text-md text-slate-600">
              {room.mentorName}
            </div>
          </div>
          <button
            className="bg-accent-500 text-white px-4 my-2 rounded-md"
            onClick={() => handleRemoveSchedule(room)}
          >
            삭제
          </button>
        </div>
      ))}
      {isModalOpen && (
        <Popup>
          <ModifyRoomInfo
            room={selectedRoom}
            onClose={() => {
              setIsModalOpen(false);
              window.location.reload();
            }}
            events={events}
          ></ModifyRoomInfo>
        </Popup>
      )}
    </div>
  );
};

export default MentorScheduling;
