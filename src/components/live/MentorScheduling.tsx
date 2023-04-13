import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from './PopUp';

export interface Room {
    mentoringRoomId: Number,
    title: String,
    mentorName: String,
    description: String,
    createdAt: Date
}

const memberId = 1;

const MentorScheduling: React.FC = () => {
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [step, setStep] = useState<number>(1);

    useEffect(() => {
        axios({
            url: `http://localhost:9002/api/room/mentor/${memberId}`,
            method: 'get'
        }).then((res) => {
            setRoomList(res.data['data']);
        })
    }, [])

    console.log(roomList);

    const handleClickRoom = (room: Room) => {
        setSelectedRoom(room);
        setStep(2);
    }

    let num = 1;

    return (
        <div className="flex flex-wrap justify-center" >
            {roomList.map((room, idx) => (
                <div key={num++} className="w-1/3 p-4 flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold mt-2" onClick={() => handleClickRoom(room)}>{idx + 1}{room.title}</h2>
                    <h3 className=''>{room.description}</h3>
                    <h3 className=''>{room.mentorName}</h3>
                </div>
            ))}
            {step == 2 && (
                <Popup>
                    <div>
                        방 수정 및 일정 추가
                    </div>
                    <button onClick={() => setStep(1)}>나가기</button>
                </Popup>
            )}
        </div>
    );
}

export default MentorScheduling;
