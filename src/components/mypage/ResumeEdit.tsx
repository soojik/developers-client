import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { MEMBER_API } from "apis/apis";
import MultiOptions from "components/MultiOptions";
import TagInput from "components/TagInput";
import { positionList } from "libs/options";
import CareerInput from "./CareerInput";
import ConfirmBtn from "components/buttons/CofirmBtn";
import Tags from "components/Tags";

export interface CareerProps {
  careerId: number;
  careerStart: string;
  careerEnd: string;
  company: string;
}

const ResumeEdit = ({ active }: { active: any }) => {
  const { memberId } = useParams();
  const loginInfo = useRecoilValue(memberInfoState);
  const [user, setUser] = useRecoilState(memberInfoState);
  const [isMe, setIsMe] = useState(false);

  const [introduce, setIntroduce] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);
  const [prevCareer, setPrevCareer] = useState<CareerProps[]>([]);
  const newSkill = skills.join(",");
  const newPos = position.join(",");
  const reqBody = {
    memberId: loginInfo.memberId,
    introduce,
    positions: newPos,
    skills: newSkill,
  };

  useEffect(() => {
    const loadResume = async () => {
      const { data } = await MEMBER_API.getResume(Number(memberId));
      // console.log("이력조회", data?.data);

      /* 본인일 때  -유저조회*/
      let isMine = Number(memberId) === loginInfo?.memberId;
      if (loginInfo?.isLoggedIn && isMine) {
        setIsMe(isMine);
        if (loginInfo?.memberInfo.introduce?.length > 0) {
          setIntroduce(loginInfo?.memberInfo.introduce);
        } else setIntroduce("");
        if (loginInfo?.memberInfo.skills?.length > 0) {
          const prevSkills = loginInfo?.memberInfo.skills.split(",");
          setSkills(prevSkills);
        } else setSkills([]);
        if (loginInfo?.memberInfo.position?.length > 0) {
          const prevPos = loginInfo?.memberInfo?.position.split(",");
          setPosition(prevPos);
        } else setPosition([]);
        if (data?.data?.careerList?.length > 0) {
          setPrevCareer(data.data.careerList);
        } else setPrevCareer([]);
      } else {
        /* 다른사람일 때 - 이력조회*/
        setIsMe(false);
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
      }
    };
    loadResume();
  }, [memberId]);

  const handleBtnClick = async () => {
    try {
      const { data } = await MEMBER_API.patchRsm({ ...reqBody });
      alert("저장됐습니다.");
      const userData = await MEMBER_API.getUser(Number(memberId));
      setUser({
        ...user,
        memberInfo: userData.data?.data,
      });
    } catch (error) {
      alert("저장에 실패했습니다");
    }
  };

  return (
    <div className={`mb-20 sm:px-6 ${active || "hidden"}`}>
      <div className="font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        소개
      </div>
      {isMe ? (
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
      ) : (
        <div className="text-sm text-slate-700 mb-10">
          {introduce.length > 0 ? introduce : "입력된 자기소개가 없습니다"}
        </div>
      )}
      <div className="font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        기술
      </div>
      {isMe ? (
        <TagInput
          tags={skills}
          setTags={setSkills}
          placeholder="예시) React, Java, Python (보유 기술명 입력)"
        />
      ) : (
        <div className="text-sm text-slate-700 mb-10">
          {skills.length > 0 ? (
            <Tags tagList={skills} />
          ) : (
            "입력된 기술이 없습니다"
          )}
        </div>
      )}

      <div className="font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        직무
      </div>
      {isMe ? (
        <>
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
        </>
      ) : (
        <div className="text-sm text-slate-700 mb-10">
          {position.length > 0 ? position.join(", ") : "입력된 직무가 없습니다"}
        </div>
      )}
      <div className="font-bold mt-5 border-b py-1 mb-2 text-slate-500">
        경력
      </div>
      {isMe ? (
        <CareerInput prevCareer={prevCareer} setPrevCareer={setPrevCareer} />
      ) : (
        <div className="text-sm text-slate-700 mb-10">
          {prevCareer.length > 0 ? (
            <ul>
              {prevCareer?.map((el) => (
                <li className="text-slate-400" key={el.careerId}>
                  {el.careerStart}&nbsp; ~ &nbsp;{el.careerEnd} &nbsp;
                  <span className="text-slate-500 font-bold">{el.company}</span>
                </li>
              ))}
            </ul>
          ) : (
            "아직 경력이 없습니다"
          )}
        </div>
      )}
    </div>
  );
};
export default ResumeEdit;
