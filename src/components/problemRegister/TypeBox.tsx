import { useState } from "react";

interface CheckboxProps {
  setIsSubjective: (value: boolean) => void;
  isSubjective: boolean | undefined;
  onChange: (value: boolean) => void;
}

const Checkbox = ({
  isSubjective,
  setIsSubjective,
  onChange,
}: CheckboxProps) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "subjective";
    setIsSubjective(value);
    onChange(value); // onChange 함수 호출
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <div className="flex justify-end">
      </div>
      <div className="flex items-center justify-end space-x-4 flex-1">
        <label className="inline-flex items-center justify-end">
          <input
            type="radio"
            className="form-radio"
            value="objective"
            checked={!isSubjective}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2">객관식</span>
        </label>
        <label className="inline-flex items-center justify-end  ">
          <input
            type="radio"
            className="form-radio"
            value="subjective"
            checked={isSubjective}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2">주관식</span>
        </label>
      </div>
      <div></div>
    </div>
  );
};

export default Checkbox;
