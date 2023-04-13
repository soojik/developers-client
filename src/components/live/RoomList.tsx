import React, { useState } from 'react';
import ShowMentoring from './ShowMentoring';
import ShowMentorOption from './ShowMentorOption';
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
    const [isMentor, setIsMentor] = useState(false) //멘토 멘티 상태값
    const [showMentorOption, setShowMentorOption] = useState(false); //멘토 설정

    const handleShowRoomInfo = (room: Room) => {
        setSelectedRoom(room);
        setShowRoomInfo(!showRoomInfo);
      };

      const handleShowMentorOption = (room:Room)=>{
        setSelectedRoom(room);
        setShowMentorOption(!showMentorOption);
      }
      
    let num = 1; // 출력 갯수 확인 변수

    return (
        <div className="flex flex-wrap justify-center" >
            {rooms.map((room) => (
                <div key={room.mentoringRoomId.toString()} className="w-1/3 p-4 flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold mt-2" onClick={isMentor?()=>handleShowMentorOption(room):()=>handleShowRoomInfo(room)}>{num++}{room.title}</h2>
                    <h3 className=''>{room.description}</h3>
                    <h3 className=''>{room.mentorName}</h3>
                </div>
            ))}
            {showRoomInfo && selectedRoom && (
                <ShowMentoring handleClose={() => setShowRoomInfo(false)} room={selectedRoom} />
            ) || showMentorOption && selectedRoom && (
                <ShowMentorOption handleClose={()=> setShowMentorOption(false)} room={selectedRoom} />
            )}
        </div>
    );
}

export default RoomList;
