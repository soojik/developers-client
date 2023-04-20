import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from './PopUp';
import ModifyRoomInfo from './ModifyRoomInfo';
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { EventProp } from 'pages/Mentoring';

export interface Room {
    mentoringRoomId: number,
    mentorName: string,
    title: string,
    description: string,
    createdAt: Date
}

interface MentorSchedulingProps {
    events: EventProp[]
}

const MentorScheduling: React.FC<MentorSchedulingProps> = ({ events }) => {
    const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>(null as any);

    useEffect(() => {
        axiosInstance({
            url: `${process.env.REACT_APP_DEV_URL}/api/room/mentor/${memberId}`,
            method: 'get'
        }).then((res) => {
            setRoomList(res.data['data']);
        }).catch(err=>console.log(err))
    }, [])

    const handleClickRoom = (room: Room) => {
        setIsModalOpen(true);
        setSelectedRoom(room);
    }

    const handleRemoveSchedule = (room: Room) => {
        if (window.confirm('멘토링 방을 삭제하시겠습니까?')) {
            console.log("room", room);
            axiosInstance({
                url: `${process.env.REACT_APP_DEV_URL}/api/room/${room.mentoringRoomId}`,
                method: 'delete'
            }).then((res) => {
                window.alert(res.data['msg']);
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    let num = 1;

    return (
        <div className="flex flex-wrap justify-center" >
            {roomList.map((room, idx) => (
                <div key={num++} className="w-1/3 p-4 flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold mt-2" onClick={() => handleClickRoom(room)}>{idx + 1}{room.title}</h2>
                    <h3 className=''>{room.description}</h3>
                    <h3 className=''>{room.mentorName}</h3>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => handleRemoveSchedule(room)}>삭제</button>
                </div>
            ))}
            {isModalOpen && (
                <Popup>
                    <ModifyRoomInfo room={selectedRoom} onClose={() => {setIsModalOpen(false);window.location.reload();}} events={events}></ModifyRoomInfo>
                </Popup>
            )}
        </div>
    );
}

export default MentorScheduling;
