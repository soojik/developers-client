import React, { useState } from 'react';
import ShowMentoring from './ShowMentoring';
import { EventProp } from 'pages/Mentoring';
import { useRecoilState, useRecoilValue } from 'recoil';
import { memberInfoState } from "recoil/userState";
export interface Room {
    mentoringRoomId: Number,
    title: String,
    mentorName: String,
    description: String,
    createdAt: Date
}

interface RoomListProps {
    events: EventProp[];
    rooms: Room[];
}

const RoomList: React.FC<RoomListProps> = ({ events, rooms }) => {
    const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [showRoomInfo, setShowRoomInfo] = useState(false);

    const handleShowRoomInfo = (room: Room) => {
        // if (memberId) {
            setSelectedRoom(room);
            setShowRoomInfo(!showRoomInfo);
        // }
    };

    return (
        <div className="flex flex-wrap">
            {rooms.map((room) => (
                <div
                    className="w-1/3 p-4 flex flex-col justify-center items-center"
                >
                    <div
                        className="text-md font-semibold"
                        onClick={() => handleShowRoomInfo(room)}
                    >{room.title}</div>
                    <div className="flex justify-center items-center mt-2">
                        <div className="flex items-center text-sm text-slate-600">
                            {room.description}
                        </div>
                    </div>
                    <div className="flex justify-center items-center mt-2">
                        <div className="flex items-center text-sm text-slate-600">
                            {room.mentorName}
                        </div>
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
