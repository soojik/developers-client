import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import NaverOauthBtn from "components/buttons/NaverOauthBtn";
import GoogleOauthBtn from "components/buttons/GoogleOauthBtn";
import { useRecoilState } from "recoil";
import { memberInfoState } from "recoil/userState";

interface LoginProps {
  loginEmail: string;
  loginPassword: string;
}

const Login = () => {
  const URL = process.env.REACT_APP_DEV_URL;
  const [memberInfo, setMemberInfo] = useRecoilState(memberInfoState);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginProps>({ mode: "onChange" });

  const handleLoginSubmit: SubmitHandler<LoginProps> = (data) => {
    axios
      .post(`${URL}/api/auth/local`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        let accessToken = res.headers.authorization;
        let refreshToken = res.headers.refresh;

        axios.defaults.headers.common["Authorization"] = `${accessToken}`;

        console.log("로그인 응답", res);
        // const resData = {
        //   memberInfo: { res },
        //   loginEmail: undefined,
        //   isLoggedIn: true,
        // };
        setMemberInfo({ ...memberInfo, ...res });
        // navigate("/");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="w-4/5">
        <div className="flex justify-center text-2xl font-light">로그인</div>
        <form
          className="flex justify-center mt-10"
          onSubmit={handleSubmit(handleLoginSubmit)}
        >
          <div className="flex flex-col w-full max-w-lg">
            <label className="mt-4 text-xs">이메일</label>
            <input
              type="email"
              placeholder="example@developers.com"
              className="sign_input"
              {...register("loginEmail", {
                required: "이메일을 올바르게 입력해주세요.",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "이메일을 올바르게 입력해주세요.",
                },
              })}
            />
            <div className="text-xs text-red-500">
              {errors?.loginEmail?.message}
            </div>

            <label className="mt-4 text-xs">비밀번호</label>
            <input
              type="password"
              placeholder="******"
              className="sign_input"
              {...register("loginPassword", {
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
              {errors?.loginPassword?.message}
            </div>

            <button
              type="submit"
              className="sign_form_submit_btn bg-accent-400"
            >
              로그인
            </button>
            <div className="flex justify-between font-light">
              아직 계정이 없다면?
              <Link
                to="/register"
                className="font-semibold text-accent-300 hover:text-accent-500"
              >
                회원가입
              </Link>
            </div>

            <div className="flex justify-center mt-20 mb-8 font-light">
              소셜 계정으로 로그인
            </div>
            <div className="flex justify-center">
              <NaverOauthBtn />
              <GoogleOauthBtn />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
