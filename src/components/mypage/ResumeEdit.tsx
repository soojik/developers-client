import MultiOptions from "components/MultiOptions";
import TagInput from "components/TagInput";
import { positionList } from "libs/options";
import { useEffect, useState } from "react";
import CareerInput from "./CareerInput";

const ResumeEdit = ({ active }: { active: any }) => {
  const careerInfo = [
    {
      intro: "나는 아무개입니다!",
      skill: "React,Java,Python",
      position: "프론트엔드,iOS",
    },
  ];
  const [skills, setSkills] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);

  const data = {
    memberId: 1,
    introduce: "간단 소개 ..",
    positions: "Software Engineer,Backend,",
    skills: "Spring,Java",
  };

  useEffect(() => {
    const prevSkills = careerInfo[0].skill.split(",");
    const prevPos = careerInfo[0].position.split(",");
    setSkills(prevSkills);
    setPosition(prevPos);
  }, []);

  return (
    <div className={`mb-20 px-6 ${active || "hidden"}`}>
      <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        소개
      </div>
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
      <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        경력
      </div>
      <CareerInput />
      <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        기술
      </div>
      <TagInput
        tags={skills}
        setTags={setSkills}
        placeholder="예시) React, Java, Python (보유 기술명 입력)"
      />

      <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        직무
      </div>
      <MultiOptions
        label={careerInfo[0].position}
        lists={positionList}
        state={position}
        setState={setPosition}
      />
    </div>
  );
};
export default ResumeEdit;
