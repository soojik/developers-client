import React, { useState } from 'react';
import ShowMentoring from './ShowMentoring';
import { EventProp } from 'pages/Mentoring';
export interface Room {
    mentoringRoomId:Number,
    title:String,
    mentorName:String,
    description:String,
    createdAt:Date
}

interface RoomListProps {
    events: EventProp[];
    rooms: Room[];
}

const RoomList: React.FC<RoomListProps> = ({ events, rooms }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [showRoomInfo, setShowRoomInfo] = useState(false);
    
    const handleShowRoomInfo = (room: Room) => {
        setSelectedRoom(room);
        setShowRoomInfo(!showRoomInfo);
      };
      
    let num = 1; // 출력 갯수 확인 변수

    return (
        <div className="flex flex-wrap justify-center" >
            {rooms.map((room) => (
                <div key={room.mentoringRoomId.toString()} className="w-1/3 p-4 flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold mt-2" onClick={()=>handleShowRoomInfo(room)}>{num++}{room.title}</h2>
                    <h3 className=''>{room.description}</h3>
                    <h3 className=''>{room.mentorName}</h3>
                </div>
            ))}
            {showRoomInfo && selectedRoom && (
                <ShowMentoring handleClose={() => setShowRoomInfo(false)} room={selectedRoom} mySchedule={events} />
            ) 
            }
        </div>
    );
}

export default RoomList;
