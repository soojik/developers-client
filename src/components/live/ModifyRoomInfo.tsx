import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ModifySchedule from './ModifySchedule';

export interface Room {
    mentoringRoomId: number,
    title: string,
    mentorName: string,
    description: string,
    createdAt: Date
}

interface ModifyRoomInfoProps {
    room: Room;
    onClose: () => void;
}

const ModifyRoomInfo: React.FC<ModifyRoomInfoProps> = ({ room, onClose }) => {
    const [title, setTitle] = useState<string>(room.title);
    const [description, setDescription] = useState<string>(room.description);
    const [step, setStep] = useState<number>(1);

    const handleNextClick = () => {
        if (room.title !== title || room.description !== description) {
            axios({
                url: `http://aea79a87d0af44892b469487337e5f8e-699737871.ap-northeast-2.elb.amazonaws.com/api/room/update`,
                method: 'post',
                data: {
                    mentoringRoomId: room.mentoringRoomId,
                    title: title,
                    description: description
                }
            }).then((res) => {
                console.log(res.data);
            })
        }
        setStep(2);
    }

    return (
        <div>
            <form>
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-2 font-bold">
                        방 제목
                    </label>
                    <input
                        id="title"
                        value={title}
                        type="text"
                        className="w-full border-gray-300 rounded-md px-4 py-2"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2 font-bold">
                        방 소개글
                    </label>
                    <input
                        id="description"
                        value={description}
                        type="text"
                        className="w-full border-gray-300 rounded-md px-4 py-2"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button type='button' className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleNextClick}>
                        다음
                    </button>
                    <button type="button" className="mr-4" onClick={() => onClose()}>
                        취소
                    </button>
                </div>
            </form>
            {step === 2 && (
                <ModifySchedule onClose={onClose} mentoringRoomId={room.mentoringRoomId}></ModifySchedule>
            )}
        </div>
    );
}

export default ModifyRoomInfo;
