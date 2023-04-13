import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface PwdCofirmProps {
  prevPassword: string;
  nextPassword: string;
  pwdConfirm?: string;
}

const PwdInput = ({ memberId }: { memberId?: string }) => {
  const URL = process.env.REACT_APP_DEV_URL;
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<PwdCofirmProps>({ mode: "onChange" });

  const onValid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwdConfirm = e.target.value;
    if (pwd !== pwdConfirm) {
      setError(
        "pwdConfirm",
        { message: "비밀번호가 일치하지 않습니다." },
        { shouldFocus: true }
      );
    } else clearErrors("pwdConfirm");
  };

  const handleSignSubmit: SubmitHandler<PwdCofirmProps> = (data) => {
    if (data.nextPassword !== data.pwdConfirm) {
      return setError(
        "pwdConfirm",
        { message: "비밀번호가 일치하지 않습니다." },
        { shouldFocus: true }
      );
    }
    delete data.pwdConfirm;
    // console.log('전달값',data, data.prevPassword, data.nextPassword);
    axios
      .patch(
        `${URL}/api/password`,
        { memberId, password: data.nextPassword },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then((res) => {
        alert("저장에 성공했습니다");
        console.log("비밀번호 응답", res);
        // navigate("/login");
      })
      .catch((err) => {
        alert("저장에 실패했습니다");
        console.log(err);
      });
  };

  return (
    <>
      <div className="flex font-bold text-xl justify-center mt-2 mb-8">
        비밀번호 변경
      </div>
      <form onSubmit={handleSubmit(handleSignSubmit)}>
        <label className="block text-gray-400 text-sm font-bold">
          현재 비밀번호
        </label>
        <input
          type="password"
          placeholder="현재 비밀번호를 입력해주세요"
          className="sign_input mb-2 w-full"
          {...register("prevPassword", {
            required: "비밀번호를 입력해주세요.",
            minLength: {
              value: 6,
              message: "6자 이상 18자 이하의 비밀번호를 입력해주세요.",
            },
            maxLength: {
              value: 18,
              message: "18자 이하의 비밀번호를 입력해주세요",
            },
          })}
        />
        <div className="text-xs text-red-500">
          {errors?.pwdConfirm && errors?.prevPassword?.message}
        </div>
        <div className="flex justify-between mt-4 items-center">
          <label className="block text-gray-400 text-sm font-bold ">
            새 비밀번호
          </label>
          <div className="text-gray-400 text-xs">비밀번호 최소 6~18자</div>
        </div>
        <input
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
          className="sign_input mb-2 w-full"
          {...register("nextPassword", {
            required: "비밀번호를 입력해주세요.",
            minLength: {
              value: 6,
              message: "6자 이상 18자 이하의 비밀번호를 입력해주세요.",
            },
            maxLength: {
              value: 18,
              message: "18자 이하의 비밀번호를 입력해주세요",
            },
          })}
          onChange={(e) => setPwd(e.target.value)}
        />
        <div className="text-xs text-red-500">
          {errors?.nextPassword?.message}
        </div>
        <input
          type="password"
          placeholder="새 비밀번호를 다시 한번 입력해주세요"
          className="sign_input w-full"
          {...register("pwdConfirm", {
            required: "비밀번호를 입력해주세요.",
            minLength: {
              value: 6,
              message: "6자 이상 18자 이하의 비밀번호를 입력해주세요.",
            },
          })}
          onChange={onValid}
        />
        <div className="text-xs text-red-500">
          {errors?.pwdConfirm && errors?.pwdConfirm?.message}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-1.5 text-accent-100 rounded-md border border-accent-100 font-bold  hover:bg-accent-100 hover:text-slate-200 transition mt-10"
          >
            저장
          </button>
        </div>
      </form>
    </>
  );
};
export default PwdInput;
