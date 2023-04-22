import axios from "axios";
import React, { useEffect, useState } from "react";
import ModifySchedule from "./ModifySchedule";
import { axiosInstance } from "apis/axiosConfig";
import { EventProp } from "pages/Mentoring";

export interface Room {
  mentoringRoomId: number;
  title: string;
  mentorName: string;
  description: string;
  createdAt: Date;
  startTime: string;
}

interface ModifyRoomInfoProps {
  room: Room;
  onClose: () => void;
  events: EventProp[];
}

const ModifyRoomInfo: React.FC<ModifyRoomInfoProps> = ({
  room,
  onClose,
  events,
}) => {
  const [title, setTitle] = useState<string>(room.title);
  const [description, setDescription] = useState<string>(room.description);
  const [step, setStep] = useState<number>(1);

  const handleNextClick = () => {
    if (room.title !== title || room.description !== description) {
      axiosInstance({
        url: `${process.env.REACT_APP_DEV_URL}/api/room/update`,
        method: "post",
        data: {
          mentoringRoomId: room.mentoringRoomId,
          title: title,
          description: description,
        },
      }).then((res) => {
        console.log(res.data);
      });
    }
    setStep(2);
  };

  return (
    <div>
      {step === 2 ? (
        <ModifySchedule
          onClose={onClose}
          room={room}
          events={events}
        ></ModifySchedule>
      ) : (
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
            <button
              type="button"
              className="bg-accent-400 text-slate-200 px-3 py-2 mr-2 rounded"
              onClick={handleNextClick}
            >
              다음
            </button>
            <button type="button" className="mr-4" onClick={() => onClose()}>
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModifyRoomInfo;
