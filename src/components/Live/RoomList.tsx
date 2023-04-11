import React, { useState } from 'react';

interface Room {
    id: number;
    title: string;
    description: string;
    mentorName: string;
    thumbnailUrl: string;
}

interface RoomListProps {
    rooms: Room[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {

    return (
        <div className="flex flex-wrap justify-center">
            {rooms.map((room) => (
                <div key={room.id} className="w-1/3 p-4 flex flex-col justify-center items-center">
                    <img className="h-50" src={room.thumbnailUrl} alt={room.title} />
                    <h2 className="text-lg font-semibold mt-2">{room.title}</h2>
                    <h3 className=''>{room.description}</h3>
                    <h3 className=''>{room.mentorName}</h3>
                </div>
            ))}
        </div>
    );
}

export default RoomList;
