import React, { useState } from 'react';

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
    let num = 1;

    return (
        <div className="flex flex-wrap justify-center">
            {rooms.map((room, idx) => (
                <div key={num++} className="w-1/3 p-4 flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold mt-2">{idx+1}{room.title}</h2>
                    <h3 className=''>{room.description}</h3>
                    <h3 className=''>{room.mentorName}</h3>
                </div>
            ))}
        </div>
    );
}

export default RoomList;
