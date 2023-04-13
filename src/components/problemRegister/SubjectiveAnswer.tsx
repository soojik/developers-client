import { useState } from "react";

interface subjectiveProps {
  children?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const SubjectiveAnswer = ({ children, onChange }: subjectiveProps) => {
  return (
    <div>
      <input
        type="text"
        className="border border-gray-400 p-2 rounded-md w-full"
        placeholder="답안을 입력하세요."
        value={children}
        onChange={onChange}
      />
    </div>
  );
};
export default SubjectiveAnswer;
