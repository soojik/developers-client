import React, { useState } from 'react';
import ShowMentoring from './ShowMentoring';
import { EventProp } from 'pages/Mentoring';
import { useRecoilState, useRecoilValue } from 'recoil';
import { memberInfoState } from "recoil/userState";
export interface Room {
    mentoringRoomId: number,
    title: String,
    mentorName: String,
    description: String,
    createdAt: Date
}

interface RoomListProps {
    events: EventProp[];
    rooms: Room[];
}

export const thumbnails = ["https://picsum.photos/id/237/200/300", "https://picsum.photos/id/238/200/300", "https://picsum.photos/id/239/200/300", "https://picsum.photos/id/240/200/300", "https://picsum.photos/id/241/200/300", "https://picsum.photos/id/242/200/300"];

const RoomList: React.FC<RoomListProps> = ({ events, rooms }) => {
    const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [showRoomInfo, setShowRoomInfo] = useState(false);

    const handleShowRoomInfo = (room: Room) => {
        if (memberId) {
            setSelectedRoom(room);
            setShowRoomInfo(!showRoomInfo);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms.map((room) => (
                <div
                    className="flex flex-col items-center bg-gray-100 p-4 m-4 rounded-lg"
                    onClick={() => handleShowRoomInfo(room)}
                >
                    <div>
                        <img src={thumbnails[room.mentoringRoomId % 6]} alt="Thumbnail" />
                    </div>
                    <div className="text-lg font-semibold mt-2">
                        {room.title}
                    </div>
                    <div className="flex justify-center items-center mt-2">
                        <div className="flex items-center text-md text-slate-600">{room.mentorName}</div>
                    </div>
                </div>
            ))}
            {showRoomInfo && selectedRoom && (
                <ShowMentoring handleClose={() => setShowRoomInfo(false)} room={selectedRoom} mySchedule={events} />
            )}
        </div>
    );
}

export default RoomList;
