import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  answerCandidate: string[]; // answerCandidate 추가
  solved: boolean;
  pathname: string;
}
const ProblemDetail = () => {
  const location = useLocation();
  const { problemId, member } = useParams();
  const [detail, setDetail] = useState<ProblemBoxProps>();
  const [modalOpen, setModalOpen] = useState(false); //모달 오픈
  const [answer, setAnswer] = useState(""); //정답 저장
  const [answerCandidate, setAnswerCandidate] = useState<string[]>([]); //문제 답안 목록 저장
  const [modalTitle, setModalTitle] = useState(""); //모달 타이틀 전송
  const [pointAdd, setPointAdd] = useState(0); // 포인트 -> 연산값이 실제로 연산된 후 보내져야한다.
  const [isEditing, setIsEditing] = useState(true); // 수정 모드인지 여부를 true로 변경
  const [radioDisabled, setRadioDisabled] = useState(false);
  const [radioCheckedIdx, setRadioCheckedIdx] = useState(0);
  const [selectedNumberState, setSelectedNumberState] = useState<number | null>(
    null
  );
  const [problemSolved, setProblemSolved] = useState(false); // 문제 풀이 유무 DB저장을 위해서 만듦
  const [answerWriter, setAnswerWriter] = useState(""); //문제 작성자를 받아오기 위한값===
  const [likes, setLikes] = useState(detail?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);
  const [solved, setSolved] = useState(detail?.solved);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sessionAnswer = sessionStorage.getItem("answer") || ""; // 값 null처리

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
        // console.log(response);
        const answerCandidateString = response.data.data.answerCandidate;
        setLikes(response.data?.data?.likes);
        setAnswer(response.data.data.answer);
        setProblemSolved(response.data.data.solved);
        if (response.data.data.answer && response.data.data.solved) {
          setRadioCheckedIdx(Number(response.data.data.answer));
        }
        setSolved(response.data?.data?.solved);
        const answerCandidateArray = answerCandidateString;
        setAnswerCandidate(answerCandidateArray);
        setDetail(response.data.data);
        setAnswerWriter(response.data.data.writer);
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

  const handleRadioClick = (selectedNumber: number) => {
    setSelectedNumberState(selectedNumber);
    // console.log("Selected Num:", selectedNumber, "Answer Num:", detail.answer);
    // 여기에서 번호를 전송하거나 다른 작업을 수행할 수 있습니다.
    const answerNumber = selectedNumber.toString(); // 문자열을 숫자로 변환
    if (answerNumber === detail.answer) {
      setModalTitle("정답입니다!");
      setPointAdd(10);
    } else {
      setModalTitle("오답입니다");
      setPointAdd(0);
    }
  };

  const handleEditing = () => {
    if (window.confirm("수정 하시겠습니까?")) {
      setIsEditing(true);
      setRadioDisabled(false);
      // setOriginalAnswer(inputAnswer);
      // setInputAnswer(detail.answer);
    }
  };

  const handleSave = () => {
    if (selectedNumberState === null) {
      window.alert("값이 필요합니다.");
      return;
    }
    setIsEditing(false);
    setRadioDisabled(true);
  };

  const handleLikeButtonClick = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/problem/${location.state.problemId}`
      );
      setLikes(response.data?.data?.likes);
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
        <ul className="flex flex-col space-y-2">
          {detail.answerCandidate.map((candidate: string, index: number) => (
            <li key={candidate}>
              <input
                type="radio"
                id={`option${index + 1}`}
                name="answerCandidate"
                value={index + 1}
                className={`mr-2 w-5 h-5 hidden`}
                disabled={radioDisabled}
              />
              <label
                htmlFor={`option${index + 1}`}
                className={`flex items-center text-sm cursor-pointer max-w-[420px] rounded-lg p-3 hover:bg-opacity-80 ${
                  radioCheckedIdx === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 bg-opacity-50"
                }
                ${
                  solved || radioDisabled
                    ? "pointer-events-none text-slate-400 bg-opacity-60"
                    : null
                }`}
                onClick={() => {
                  setRadioCheckedIdx(index + 1);
                  handleRadioClick(index + 1);
                }}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 text-xs border border-slate-600 rounded-full ${
                    radioCheckedIdx === index + 1
                      ? "border-0 bg-white text-blue-500"
                      : null
                  }
                  ${
                    solved || radioDisabled
                      ? "border-slate-400 text-slate-400"
                      : null
                  }`}
                >
                  {index + 1}
                </div>
                <span>&nbsp; {candidate}</span>
              </label>
            </li>
          ))}
        </ul>
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
