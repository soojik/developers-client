import React, { useState } from 'react';
import ShowMentoring from './ShowMentoring';
export interface Room {
    mentoringRoomId:Number,
    title:String,
    mentorName:String,
    description:String,
    point:Number,
    createdAt:Date
}

interface RoomListProps {
    rooms: Room[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [showRoomInfo, setShowRoomInfo] = useState(false);

    const handleShowRoomInfo = (room: Room) => {
        setSelectedRoom(room);
        setShowRoomInfo(!showRoomInfo);
      };
      

    let num = 1;

    return (
        <div className="flex flex-wrap justify-center" >
            {rooms.map((room, idx) => (
                <div key={num++} className="w-1/3 p-4 flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold mt-2" onClick={()=>handleShowRoomInfo(room)}>{idx+1}{room.title}</h2>
                    <h3 className=''>{room.description}</h3>
                    <h3 className=''>{room.mentorName}</h3>
                </div>
            ))}
            {showRoomInfo && selectedRoom && (
                <ShowMentoring handleClose={() => setShowRoomInfo(false)} room={selectedRoom} />
            )}
        </div>
    );
}

export default RoomList;
