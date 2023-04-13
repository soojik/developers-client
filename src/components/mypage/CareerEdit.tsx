import MultiOptions from "components/MultiOptions";
import TagInput from "components/TagInput";
import DownArrowIcon from "components/icons/DownArrowIcon";
import { positionList } from "libs/options";
import { useEffect, useState } from "react";

const CareerEdit = () => {
  const careerInfo = [
    {
      intro: "나는 아무개입니다!",
      skill: "React,Java,Python",
      position: "프론트엔드,iOS",
    },
  ];
  const [skills, setSkills] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);

  useEffect(() => {
    const prevSkills = careerInfo[0].skill.split(",");
    const prevPos = careerInfo[0].position.split(",");
    setSkills(prevSkills);
    setPosition(prevPos);
  }, []);

  return (
    <div className="mb-20">
      <div className="hover:bg-zinc-200 transition-all rounded-md p-2 flex justify-between items-center">
        이력 <DownArrowIcon stroke="black" />
      </div>
      <div className="text-lg font-bold mt-5 border-b py-1 mb-2">소개</div>
      <textarea
        name="contents"
        placeholder="자기소개를 3~5줄로 적어주세요!"
        className="w-full sign_input h-[100px]"
        //   ref={secondRef}
        //   onChange={handleText}
        minLength={1}
        maxLength={1000}
        wrap="hard"
        required
        defaultValue={careerInfo[0].intro}
      />
      <div className="text-lg font-bold mt-5 border-b py-1 mb-2">경력</div>
      <button className="inline-block bg-slate-200 py-1.5 px-3 rounded-md">
        + 추가
      </button>
      <div>
        <input
          type="text"
          className="sign_input h-[30px] w-[120px] mr-3"
          placeholder="YYYY-MM"
          aria-required="true"
          max="2032-12-31"
          //   min={getToday()}
          onBlur={(e) => (e.target.type = "text")}
          onFocus={(e) => (e.target.type = "month")}
          onChange={(e) => {}}
        />
        -
        <input
          type="text"
          className="sign_input h-[30px] w-[120px] m-3"
          placeholder="YYYY-MM"
          aria-required="true"
          max="2032-12-31"
          //   min={'이전날짜 이후'}
          onBlur={(e) => (e.target.type = "text")}
          onFocus={(e) => (e.target.type = "month")}
          onChange={(e) => {}}
        />
        <input
          type="text"
          placeholder="근무처"
          className="sign_input h-[30px] w-[300px]"
        />
      </div>
      <div className="text-lg font-bold mt-5 border-b py-1 mb-2">기술</div>
      <TagInput
        tags={skills}
        setTags={setSkills}
        placeholder="예시) React, Java, Python (보유 기술명 입력)"
      />

      <div className="text-lg font-bold mt-5 border-b py-1 mb-2">직무</div>
      <MultiOptions
        label={careerInfo[0].position}
        lists={positionList}
        state={position}
        setState={setPosition}
      />
    </div>
  );
};
export default CareerEdit;
