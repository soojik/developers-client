import { useState } from "react";

const NicknameInput = ({
  editUserInfo,
}: {
  memberId?: string;
  editUserInfo: (path: string, data: string) => any;
}) => {
  const [nickname, setNickname] = useState("");
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  return (
    <>
      <div className="flex font-bold text-xl justify-center mt-2 mb-8">
        닉네임
      </div>
      <input
        placeholder="닉네임"
        className="sign_input mb-2 w-full"
        defaultValue={`닉네임`}
        onChange={handleNicknameChange}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-1.5 text-accent-100 rounded-md border border-accent-100 font-bold  hover:bg-accent-100 hover:text-slate-200 transition mt-10"
          onClick={() => editUserInfo("nickname", nickname)}
        >
          저장
        </button>
      </div>
    </>
  );
};
export default NicknameInput;
