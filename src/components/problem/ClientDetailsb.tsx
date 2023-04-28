import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProblemPointModal from "components/problem/ProblemPointModal";
import LevelIcon from "components/icons/LevelIcon";
import ViewIcon from "components/icons/ViewIcon";
import LikesIcon from "components/icons/LikesIcon";
import Tags from "components/Tags";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { axiosInstance } from "apis/axiosConfig";
import CheckIcon from "components/icons/CheckIcon";

interface ProblemBoxProps {
  problemId: number;
  nickname: string;
  writer: string;
  type: string;
  views: number;
  title: string;
  level: string;
  likes: number;
  content: string;
  hashTag: string;
  answer: string;
  solved: boolean;
  pathname: string;
}

const ProblemDetail = () => {
  const location = useLocation();
  const { problemId, member } = useParams(); //detail을 클릭하였을때 param에 삽입
  const [detail, setDetail] = useState<ProblemBoxProps | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputAnswer, setInputAnswer] = useState(""); //풀이자가 답 입력 값
  const [answer, setAnswer] = useState(""); //정답 저장
  const [modalTitle, setModalTitle] = useState(""); //모달 타이틀 전송
  const [pointAdd, setPointAdd] = useState(0); // 포인트
  const [isEditing, setIsEditing] = useState(true); // 수정 모드인지 여부를 true로 변경

  const [problemSolved, setProblemSolved] = useState(false);
  const [originalAnswer, setOriginalAnswer] = useState(""); // 수정 모드 진입 시 기존 답변 저장
  const [answerWriter, setAnswerWriter] = useState(""); //문제 작성자를 받아오기 위한값===
  const navigate = useNavigate();
  // const [likes, setLikes] = useState(!detail ? 0 : detail?.likes);
  const [likes, setLikes] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);
  const [solved, setSolved] = useState(detail?.solved);

  //세션에 저장되어있는 값을 가져오기
  const sessionAnswer = sessionStorage.getItem("answer") || "";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (window.confirm("답안을 제출 하시겠습니까?")) {
      setModalOpen(true);
      if (modalTitle === "정답입니다!") {
        updatePoint();
      }
    }
  };

  const handleModalClose = () => {
    if (modalTitle === "정답입니다!") {
      setProblemSolved(true);
      setSolved(true);
    }

    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/problem/${location.state.problemId}/${memberInfo.nickname}`
        );
        // console.log(response?.data?.data);
        setSolved(response.data?.data?.solved);
        setLikes(response.data?.data?.likes);
        setDetail(response.data.data);
        setProblemSolved(response.data.data.solved);
        setAnswer(response.data.data.answer);
        setAnswerWriter(response.data.data.writer);
        // console.log(response.data.data.pathname);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.message, "Code:", error.code);
        } else {
          console.error("Unknown error:", error);
        }
      }
    };
    fetchProblemDetail();
  }, [problemId, member]);

  if (!detail) {
    return <div>Loading...</div>;
  }
  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputAnswer(event.target.value);
    console.log(answer);
    console.log(inputAnswer);
    console.log(event.target.value.trim().toLowerCase());
    if (
      detail.answer.trim().toLowerCase() ===
      event.target.value.trim().toLowerCase()
    ) {
      console.log("정답처리");
      setModalTitle("정답입니다!");
      setPointAdd(10);
    } else {
      console.log("오답처리");
      setModalTitle("오답입니다!");
      setPointAdd(0);
    }
  };

  const handleEditing = () => {
    if (window.confirm("수정 하시겠습니까?")) {
      setIsEditing(true);
      setOriginalAnswer(inputAnswer);
      setInputAnswer(detail.answer);
      setInputAnswer(""); // 이전 값으로 복원
    }
  };

  const handleSave = () => {
    if (inputAnswer.trim() === "") {
      window.alert("답변을 작성해주세요!");
    } else {
      setIsEditing(false);
    }
  };

  const handleLikeButtonClick = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/problem/${location.state.problemId}`
      );
      setIsLiked(true);
      setLikes(likes + 1);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message, "Code:", error.code);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const updatePoint = async () => {
    try {
      const point = {
        memberId: memberId,
      };
      await axiosInstance
        .patch(`/api/member/point/increase`, point)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="font-bold text-xl mb-4">
        {detail.problemId}. {detail.title}
      </div>
      <div className="flex justify-between items-center mb-5 pb-5 border-b">
        <div className="flex flex-col text-slate-400 text-xs sm:text-sm">
          <div className="flex mb-4 items-center">
            <div className="mr-4">
              {detail.level === "gold" ? (
                <LevelIcon fill="#D9B600" width={18} height={18} />
              ) : detail.level === "silver" ? (
                <LevelIcon fill="gray" width={18} height={18} />
              ) : (
                <LevelIcon fill="#AD5600" width={18} height={18} />
              )}
            </div>
            <span className="mr-4">
              {detail.type === "answer" ? "주관식" : "객관식"}
            </span>
            <span className="mr-4">{detail.writer}</span>
            <div className="flex items-center mr-4">
              <ViewIcon fill="rgb(148 163 184)" width={20} height={20} />
              &nbsp;{detail.views}
            </div>
          </div>
          <Tags tagList={detail?.hashTag ? detail?.hashTag?.split(",") : []} />
        </div>
        {isLoggedIn === false ? null : (
          <span
            className={`${solved ? "solved" : "unsolved"} font-bold text-sm`}
          >
            {solved ? (
              <div className="flex items-center py-1 p-2 border rounded-lg border-green-600 text-green-600">
                <CheckIcon stroke="rgb(22 163 74)" width={18} height={18} />
                &nbsp;해결
              </div>
            ) : (
              <div className="flex items-center py-1 p-2 border rounded-lg border-slate-400 text-slate-400">
                <CheckIcon stroke="lightGray" width={18} height={18} />
                &nbsp;미해결
              </div>
            )}
          </span>
        )}
      </div>

      <div className="flex justify-between pb-20">
        <div className="text-sm text-gray-500">{detail.content}</div>
        {detail && (
          <button
            className="flex  items-center ml-3 cursor-pointer w-[70px]"
            disabled={isLiked}
            onClick={handleLikeButtonClick}
          >
            <LikesIcon
              fill={`${isLiked ? "rgb(37 99 235)" : "rgb(148 163 184)"}`}
              width={25}
              height={25}
            />
            &nbsp; {likes}
          </button>
        )}
      </div>
      {!detail.pathname ? (
        <div></div>
      ) : (
        <img
          src={detail.pathname}
          alt="problem-img"
          className="max-w-[340px] mb-10"
        />
      )}

      {isLoggedIn === false ? (
        <div></div>
      ) : (
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-3">
            답변
          </div>
          <textarea
            id="answer"
            name="answer"
            className="sm:text-sm outline-none border focus:border-blue-500 w-full border-slate-400 rounded-md p-2"
            value={inputAnswer}
            onChange={handleAnswerChange}
            disabled={!isEditing}
          />
        </div>
      )}

      {isLoggedIn === false ? (
        <div></div>
      ) : (
        <div>
          {problemSolved === true ? (
            <div></div>
          ) : (
            <div>
              <>
                <div className="flex flex-col justify-center items-end">
                  {isEditing ? (
                    <div className="h-32 flex items-center">
                      <button
                        className="py-2 px-4 bg-transparent text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                        onClick={handleSave}
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-end">
                      <div className="h-32 flex items-center">
                        {/* <div>입력한 값과 일치여부: {checkAnswer() ? '일치' : '불일치'}</div> */}
                        <button
                          className="py-2 px-4 bg-transparent text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                          onClick={handleEditing}
                        >
                          수정
                        </button>
                        <button
                          className="py-2 px-4 bg-transparent text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                          onClick={openModal}
                        >
                          문제 제출
                        </button>
                      </div>
                      {modalOpen && (
                        <ProblemPointModal
                          title={modalTitle}
                          point={pointAdd}
                          isOpen={modalOpen}
                          onClose={handleModalClose} // onClose 함수 전달
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProblemDetail;
