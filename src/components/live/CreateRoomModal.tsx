import React, { useState } from 'react';
import CreateScheduleModal from './CreateScheduleModal';

import axios from 'axios';

type CreateRoomModalProps = {
  onClose: () => void;
  events: EventProp[]
};

interface EventProp {
  title: string;
  startDate: Date;
  endDate: Date;
  type: string;
};

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, events }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);
  const [mentoringRoomId, setMentoringRoomId] = useState<number>();

  const handleNextClick = () => {
    if (title === '' || description === '') {
      window.alert('방 제목과 소개글을 채워주세요.');
    }
    else {
      // axios로 방 데이터 추가
      axios({
        url: `http://localhost:9002/api/room`,
        method: 'post',
        data: {
          title: title,
          description: description,
          // mentor Id 수정 필요
          mentorId: 1
        }
      })
        .then((res) => {
          setMentoringRoomId(res.data['data']);
          console.log(res);
          setStep(2);
        })
        .catch((err) => {
          window.alert('방이 정상적으로 생성되지 못했습니다.');
          console.log(err);
        })
    }
  };

  return (
    <div>
      {step === 1 && (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-5 rounded-lg max-w-4xl h-500 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">방 생성</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2 font-bold">
                  방 제목
                </label>
                <input
                  id="title"
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
                  type="text"
                  className="w-full border-gray-300 rounded-md px-4 py-2"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type='button' className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleNextClick}>
                  스케쥴 추가
                </button>
                <button type="button" className="mr-4" onClick={onClose}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {step === 2 && <CreateScheduleModal onClose={onClose} events={events} mentoringRoomId={mentoringRoomId} />}
    </div>
  );
};

export default CreateRoomModal;
