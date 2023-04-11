import React, { useState } from 'react';
import CreateScheduleModal from './CreateScheduleModal';

type CreateRoomModalProps = {
  onClose: () => void;
};

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleNextClick = () => {
    // axios로 방 데이터 추가
    console.log({ title, description });
    setStep(2);
  };

  return (
    <div>
      {step === 1 && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-gray-200 rounded-lg p-6">
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
        </div>
      )}
      {step === 2 && <CreateScheduleModal onClose={onClose} />}
    </div>
  );
};

export default CreateRoomModal;
