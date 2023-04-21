import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { MEMBER_API } from "apis/apis";
import MultiOptions from "components/MultiOptions";
import TagInput from "components/TagInput";
import { positionList } from "libs/options";
import CareerInput from "./CareerInput";
import ConfirmBtn from "components/buttons/CofirmBtn";

export interface CareerProps {
  careerId: number;
  careerStart: string;
  careerEnd: string;
  company: string;
}

const ResumeEdit = ({ active }: { active: any }) => {
  const { memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const [introduce, setIntroduce] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);
  const [prevCareer, setPrevCareer] = useState<CareerProps[]>([]);
  const newSkill = skills.join(",");
  const newPos = position.join(",");
  const reqBody = {
    memberId: Number(memberId),
    introduce,
    positions: newPos,
    skills: newSkill,
  };

  useEffect(() => {
    const loadResume = async () => {
      const { data } = await MEMBER_API.getResume(Number(memberId));

      if (data?.data?.introduce?.length > 0) {
        setIntroduce(data.data.introduce);
      }
      if (data?.data?.skills?.length > 0) {
        const prevSkills = data.data.skills.split(",");
        setSkills(prevSkills);
      }
      if (data?.data?.positions?.length > 0) {
        const prevPos = data.data?.positions.split(",");
        setPosition(prevPos);
      }
      if (data?.data?.careerList?.length > 0) {
        setPrevCareer(data.data.careerList);
      }
    };
    loadResume();
  }, []);

  const handleBtnClick = async () => {
    await MEMBER_API.patchRsm({ ...reqBody })
      .then(({ data }) => {
        // console.log("전체저장 응답", data);
        alert("저장됐습니다.");
      })
      .catch((err) => alert("저장에 실패했습니다"));
  };

  return (
    <div className={`mb-20 sm:px-6 ${active || "hidden"}`}>
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
        defaultValue={introduce}
      />
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
        label={""}
        lists={positionList}
        state={position}
        setState={setPosition}
      />
      <div className="flex justify-end mt-20">
        <ConfirmBtn type="submit" onClick={handleBtnClick}>
          전체 저장
        </ConfirmBtn>
      </div>
      <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        경력
      </div>
      <CareerInput prevCareer={prevCareer} setPrevCareer={setPrevCareer} />
    </div>
  );
};
export default ResumeEdit;
