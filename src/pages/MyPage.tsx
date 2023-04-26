import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { memberInfoState } from "recoil/userState";
import { removeLocalStorage } from "libs/localStorage";
import { axiosInstance } from "apis/axiosConfig";
import { MEMBER_API } from "apis/apis";
import RightArrowIcon from "components/icons/RightArrowIcon";
import MenuCloseIcon from "components/icons/MenuCloseIcon";
import PwdInput from "components/mypage/PwdInput";
import NicknameInput from "components/mypage/NicknameInput";
import AddressInput from "components/mypage/AddressInput";
import ResumeEdit from "components/mypage/ResumeEdit";
import DownArrowIcon from "components/icons/DownArrowIcon";
import ConfirmBtn from "components/buttons/CofirmBtn";
import PencilIcon from "components/icons/PencilIcon";
import CheckIcon from "components/icons/CheckIcon";
import BadgeList from "components/mypage/BadgeList";
import Modal from "components/Modal";

const MyPage = () => {
  const { memberId } = useParams();
  const [memberInfo, setMemberInfo] = useRecoilState(memberInfoState);
  const resetMemberInfo = useResetRecoilState(memberInfoState);
  const navigate = useNavigate();

  const careerInfoMenu = ["이력", "후기"];
  const userInfoMunu = [
    { menu: "닉네임", url: "nickname" },
    { menu: "거주지", url: "address" },
  ];

  const [nickname, setNickname] = useState("");
  const [badge, setBadge] = useState("");
  const [address, setAddress] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [imgFile, setImgFile] = useState<File>();
  const [avatar, setAvatar] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [imgPreview, setImgPreview] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalOpened, setModalOpened] = useState(false);
  const [pwdEditOpend, setPwdEditOpend] = useState(false);
  const [nicknameEditOpend, setNicknameEditOpend] = useState(false);
  const [adressEditOpend, setAdressEditOpend] = useState(false);
  const [mentorEditOpend, setMentorEditOpend] = useState(false);
  const [avatarEditOpend, setAvatarEditOpend] = useState(false);
  const [badgeEditOpend, setBadgeEditOpend] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userData = await MEMBER_API.getUser(memberInfo.memberId!);
      setMemberInfo({
        ...memberInfo,
        memberInfo: userData.data?.data,
      });
      setIsMentor(userData.data?.data.mentor);
      // console.log("유저조회", userData.data?.data);
      if (userData.data?.data?.profileImageUrl) {
        setAvatar(userData.data?.data?.profileImageUrl);
        setImgPreview(userData.data?.data?.profileImageUrl);
      }
    };
    getUser();
  }, [nickname, address]);

  const [activeIndex, setActiveIndex] = useState(0);
  const onMenuClick = (idx: number): any => {
    setActiveIndex(idx);
  };

  const handelImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files![0] !== undefined) {
      const uploadFiles = e.target.files![0];
      /* 모달 이미지 미리보기 */
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2 && typeof reader.result === "string")
          setImgPreview(reader.result);
      };
      reader.readAsDataURL(uploadFiles);

      /* 이미지 state 저장 */
      const formData = new FormData();
      if (uploadFiles) formData.append("file", uploadFiles);
      setImgFile(uploadFiles);
    }
  };

  const handleImgSave = async () => {
    if (imgFile !== undefined) {
      const formData = new FormData();
      formData.append("file", imgFile);

      /* 이미지 전송 */
      try {
        await axiosInstance.post(`/api/attach/profile`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          params: { memberId },
        });
        /* 프로필 이미지 미리보기 */
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2 && typeof reader.result === "string")
            setAvatar(reader.result);
        };
        reader.readAsDataURL(imgFile);
        alert("이미지가 등록됐습니다");
        setAvatarEditOpend(false);
        setModalOpened(false);
      } catch (err) {
        alert(err || "이미지 등록에 실패했습니다");
      }
    }
  };

  const editUserInfo = async (path: string, data: string) => {
    await axiosInstance
      .patch(
        `/api/member/${path}`,
        { memberId, [path]: data },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then((res) => {
        alert("저장에 성공했습니다");
        setModalOpened(false);
        if (path === "nickname") {
          setNickname(data);
          setNicknameEditOpend(false);
        } else {
          setAddress(data);
          setAdressEditOpend(false);
        }
      })
      .catch((err) => {
        alert("저장에 실패했습니다");
        // console.log(err);
      });
  };

  const handleUserInfoModal = (path: string) => {
    if (path === "nickname") setNicknameEditOpend(true);
    else if (path === "address") setAdressEditOpend(true);
    else if (path === "password") setPwdEditOpend(true);
    else if (path === "mentor") setMentorEditOpend(true);
    else if (path === "avatar") setAvatarEditOpend(true);
    else if (path === "badge") setBadgeEditOpend(true);
    setModalOpened(true);
  };

  const handleUserDelete = () => {
    if (window.confirm("확인을 누르면 회원 정보가 삭제됩니다.")) {
      axiosInstance
        .delete(`/api/auth/${memberId}`)
        .then((res) => {
          removeLocalStorage("access_token");
          removeLocalStorage("refresh_token");
          resetMemberInfo();
          localStorage.clear();
          alert("그동안 이용해주셔서 감사합니다.");
          navigate("/");
        })
        .catch((err) => alert(err));
    } else {
      return;
    }
  };

  const handleLogout = () => {
    resetMemberInfo();
    removeLocalStorage("access_token");
    removeLocalStorage("refresh_token");
    navigate("/");
  };

  const handleMentorBtnClick = async () => {
    try {
      const { data } = await axiosInstance.patch(`/api/member/mentor`, {
        memberId,
      });
      alert("멘토로 등록됐습니다");
      setModalOpened(false);
      setMentorEditOpend(false);
      setIsMentor(true);
    } catch (error) {
      alert(error || "멘토 등록에 실패했습니다");
    }
  };

  return (
    <div className="md:grid grid-cols-3 gap-2 h-auto">
      {/* 왼쪽 - 내정보 관리 */}
      <div className=" sm:bg-zinc-50 sm:rounded-3xl sm:mr-4 sm:shadow-lg md:sticky sm:top-20 sm:h-fit sm:p-4 border-b-2 mb-20 pb-14">
        <div className="flex pb-4 mb-4 border-b ">
          <div className="relative w-[35%] h-[100px]">
            <img
              className="rounded-3xl bg-slate-200 h-[100px] w-full object-cover"
              src={avatar}
              alt="profile image"
            />
            <button
              className="absolute bottom-0 right-[-8px] p-2 rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={() => handleUserInfoModal("avatar")}
            >
              <PencilIcon fill="white" width={18} height={18} />
            </button>
            <input
              className="hidden bg-cover"
              type="file"
              name="profile_img"
              accept="image/jpg,impge/png,image/jpeg"
              ref={fileInputRef}
              onChange={handelImgChange}
            />
          </div>
          <div className="flex flex-col w-[65%] justify-between px-3 text-sm">
            <div>
              <span> {`${memberInfo.memberInfo.nickname} `}</span>
              <button
                className="text-accent-200 font-bold hover:text-accent-500"
                onClick={() => handleUserInfoModal("badge")}
              >{`<${badge}/>`}</button>
            </div>
            <div className="font-light">
              포인트
              <span className="font-bold">
                {` ${memberInfo.memberInfo.point} `}
              </span>
              점
            </div>
            <div className="flex justify-end">
              {isMentor === true ? (
                <div className="flex items-center py-1.5 px-3 w-fit border text-green-700 border-green-600 rounded-md">
                  <CheckIcon stroke="green" width={16} height={16} />
                  &nbsp;등록된 멘토
                </div>
              ) : (
                <button
                  className="py-2 px-4 w-fit bg-slate-200 rounded-md text-accent-400 font-bold hover:bg-slate-300"
                  onClick={() => handleUserInfoModal("mentor")}
                >
                  멘토 등록하기
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="pb-4 mb-4 md:border-b">
          <div className="font-extrabold text-zinc-500 mb-2 flex justify-between">
            내 정보 관리
            <button
              className="p-1.5 text-accent-100 rounded-md border border-accent-100 font-bold  hover:bg-slate-200 text-[10px]"
              onClick={() => handleUserInfoModal("password")}
            >
              비밀번호 변경
            </button>
          </div>
          <div className="transition-all rounded-md p-2 flex justify-between">
            이메일
            <span className=" text-slate-400">{`${memberInfo.memberInfo.email}`}</span>
          </div>
          {userInfoMunu?.map((el) => (
            <div
              className="hover:bg-zinc-200 transition-all rounded-md p-2 flex justify-between cursor-pointer"
              onClick={() => handleUserInfoModal(el.url)}
              key={el.menu}
            >
              {el.menu} <RightArrowIcon />
            </div>
          ))}
        </div>

        <div className="flex justify-around">
          <button
            className="py-2 px-4 text-xs bg-slate-200 rounded-md text-accent-400 font-bold hover:bg-slate-300"
            onClick={handleLogout}
          >
            로그아웃
          </button>
          <button
            className="py-2 px-4 text-xs bg-red-100 rounded-md text-red-500 font-bold hover:bg-opacity-70"
            onClick={handleUserDelete}
          >
            회원탈퇴
          </button>
        </div>
      </div>
      {/* 오른쪽 - 커리어 정보관리 */}
      <div className="sm:bg-zinc-50 sm:rounded-3xl sm:col-span-2 h-auto sm:shadow-lg sm:p-4">
        <div className="font-extrabold text-zinc-500 mb-2">
          커리어 정보 관리
        </div>
        {careerInfoMenu?.map((el, idx) => {
          const active = idx === activeIndex ? true : false;
          return (
            <div key={el}>
              <div
                className={`hover:bg-zinc-200 transition-all rounded-md p-2 flex justify-between font-bold text-xl ${
                  active ? "font-extrabold" : "text-gray-500"
                }
          }`}
                onClick={() => onMenuClick(idx)}
              >
                {el} <DownArrowIcon stroke="black" />
              </div>
              {el === "이력" ? <ResumeEdit active={active} /> : <></>}
            </div>
          );
        })}
      </div>

      {modalOpened ? (
        <Modal>
          <div className="sm:w-[400px] min-w-[250px] h-fit relative">
            <div className="flex justify-end items-end">
              <div />
              <MenuCloseIcon
                className="cursor-pointer absolute top-0"
                fill="black"
                width={36}
                height={36}
                onClick={() => {
                  setModalOpened(false);
                  setNicknameEditOpend(false);
                  setAdressEditOpend(false);
                  setPwdEditOpend(false);
                  setMentorEditOpend(false);
                  setAvatarEditOpend(false);
                  setBadgeEditOpend(false);
                }}
              />
            </div>
            {avatarEditOpend && (
              <div className="h-[350px]">
                <div className="flex font-bold text-xl justify-center mt-2 mb-8">
                  프로필 사진 변경
                </div>
                <img
                  className="rounded-3xl bg-slate-200 h-[200px] w-full bg-cover cursor-pointer flex justify-center items-center text-slate-400 hover:bg-slate-300"
                  src={imgPreview}
                  alt="profile image"
                  onClick={() => fileInputRef.current!.click()}
                />
                <input
                  className="hidden bg-cover"
                  type="file"
                  name="profile_img"
                  accept="image/jpg,impge/png,image/jpeg"
                  ref={fileInputRef}
                  onChange={handelImgChange}
                />
                <div className="flex justify-end mt-6">
                  <ConfirmBtn type="submit" onClick={handleImgSave}>
                    저장
                  </ConfirmBtn>
                </div>
              </div>
            )}
            {badgeEditOpend && <BadgeList setBadge={setBadge} />}
            {mentorEditOpend && (
              <div className="h-[200px]">
                <div className="flex font-bold text-xl justify-center mt-2 mb-8">
                  멘토 등록
                </div>
                <div className="text-sm font-bold mt-5 border-b py-1 mb-2 text-slate-500">
                  나의 멘토 정보
                </div>
                <span className="text-slate-400 text-xs">
                  멘토 미등록 상태입니다. 멘토 역할을 맡고 싶다면 등록해주세요.
                </span>
                <div className="flex justify-end mt-10">
                  <ConfirmBtn type="submit" onClick={handleMentorBtnClick}>
                    저장
                  </ConfirmBtn>
                </div>
              </div>
            )}
            {pwdEditOpend && <PwdInput memberId={memberId} />}
            {nicknameEditOpend && (
              <NicknameInput
                memberId={memberId}
                editUserInfo={editUserInfo}
                prevNickname={memberInfo.memberInfo.nickname}
              />
            )}
            {adressEditOpend && (
              <AddressInput
                memberId={memberId}
                editUserInfo={editUserInfo}
                prevAddress={memberInfo.memberInfo.address}
              />
            )}
          </div>
        </Modal>
      ) : null}
    </div>
  );
};
export default MyPage;
