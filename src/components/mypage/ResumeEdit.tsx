import axios from "axios";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import MultiOptions from "components/MultiOptions";
import TagInput from "components/TagInput";
import { positionList } from "libs/options";
import { useEffect, useState } from "react";
import CareerInput from "./CareerInput";
import ConfirmBtn from "components/buttons/CofirmBtn";

const ResumeEdit = ({ active }: { active: any }) => {
  const URL = process.env.REACT_APP_DEV_URL;
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const [introduce, setIntroduce] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);
  const newSkill = skills.join(",");
  const newPos = position.join(",");

  const reqBody = {
    memberId: Number(memberId),
    introduce,
    position: newPos,
    skills: newSkill,
  };

  useEffect(() => {
    if (memberInfo.skills.length > 0) {
      const prevSkills = memberInfo.skills.split(",");
      setSkills(prevSkills);
    }
    if (memberInfo.position.length > 0) {
      const prevPos = memberInfo.position.split(",");
      setPosition(prevPos);
    }
  }, []);

  const handleBtnClick = () => {
    // console.log(reqBody);
    axios
      .patch(
        `/api/member/resume`,
        { ...reqBody },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log("전체저장 응답", res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={`mb-20 px-6 ${active || "hidden"}`}>
      <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        소개
      </div>
      <textarea
        name="contents"
        placeholder="자기소개를 3~5줄로 적어주세요!"
        className="w-full sign_input h-[100px]"
        onChange={(e) => setIntroduce(e.target.value)}
        minLength={1}
        maxLength={1000}
        wrap="hard"
        required
        defaultValue={memberInfo.introduce!}
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
        label={memberInfo.position.length > 0 ? memberInfo.position : "직무"}
        lists={positionList}
        state={position}
        setState={setPosition}
      />
      <div className="flex justify-end mt-20">
        <ConfirmBtn type="submit" onClick={handleBtnClick}>
          전체 저장
        </ConfirmBtn>
      </div>
    </div>
  );
};
export default ResumeEdit;
