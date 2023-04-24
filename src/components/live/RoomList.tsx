import React, { useState } from "react";
import ShowMentoring from "./ShowMentoring";
import { EventProp } from "pages/Mentoring";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
export interface Room {
  mentoringRoomId: number;
  title: string;
  mentorName: string;
  description: String;
  createdAt: Date;
}

interface RoomListProps {
  events: EventProp[];
  rooms: Room[];
}

export const thumbnails = [
  "https://picsum.photos/id/0/300/200",
  "https://picsum.photos/id/1/300/200",
  "https://picsum.photos/id/2/300/200",
  "https://picsum.photos/id/3/300/200",
  "https://picsum.photos/id/4/300/200",
  "https://picsum.photos/id/5/300/200",
];

const RoomList: React.FC<RoomListProps> = ({ events, rooms }) => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const handleShowRoomInfo = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomInfo(!showRoomInfo);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {rooms.map((room, key = room.mentoringRoomId) => (
        <div
          className="flex flex-col items-center bg-gray-100 p-4 m-4 rounded-lg"
          onClick={() => handleShowRoomInfo(room)}
        >
          <div>
            <img src={thumbnails[key % 6]} alt="Thumbnail" />
          </div>
          <div className="text-lg font-semibold mt-2">{room.title}</div>
          <div className="flex justify-center items-center mt-2">
            <div className="flex items-center text-md text-slate-600">
              {room.mentorName}
            </div>
          </div>
        </div>
      ))}
      {showRoomInfo && selectedRoom && (
        <ShowMentoring
          handleClose={() => setShowRoomInfo(false)}
          room={selectedRoom}
          mySchedule={events}
        />
      )}
    </div>
  );
};

export default RoomList;
