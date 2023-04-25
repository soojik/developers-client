import { useState } from "react";
import ConfirmBtn from "components/buttons/CofirmBtn";

const NicknameInput = ({
  editUserInfo,
  prevNickname,
}: {
  memberId?: string;
  editUserInfo: (path: string, data: string) => any;
  prevNickname: string;
}) => {
  const [nickname, setNickname] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const handleNicknameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let value = target.value;

    // 공백만 입력 방지 (2~10자 이하/공백 제거)
    if (value.trim() !== "") {
      if (value.length < 2) {
        return setErrMsg("2자 이상의 닉네임을 입력해주세요");
      }
      if (value.length > 10) {
        return setErrMsg("10자 이하의 닉네임을 입력해주세요");
      }
      if (/\s/.exec(value)) {
        value = value.replace(/\s|  /gi, ""); // 빈값, 공백 제거
        setNickname(value);
        return setErrMsg("공백을 입력했으므로 공백을 제거합니다");
      } else {
        setErrMsg("");
        setNickname(value);
      }
    }
  };
  return (
    <>
      <div className="flex font-bold text-xl justify-center mt-2 mb-8">
        닉네임
      </div>
      <input
        placeholder="닉네임"
        className="sign_input mb-2 w-full"
        defaultValue={`${prevNickname}`}
        onKeyUp={handleNicknameChange}
        minLength={2}
        maxLength={10}
      />
      <div className="text-xs text-red-500">{errMsg && errMsg}</div>
      <div className="flex justify-end mt-10">
        <ConfirmBtn
          type="submit"
          onClick={() => editUserInfo("nickname", nickname)}
        >
          저장
        </ConfirmBtn>
      </div>
    </>
  );
};
export default NicknameInput;
