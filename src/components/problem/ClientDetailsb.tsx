import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProblemPointModal from "components/problem/ProblemPointModal";

import LevelIcon from "components/icons/LevelIcon";
import ViewIcon from "components/icons/ViewIcon";
import LikesIcon from "components/icons/LikesIcon";
import Tags from "components/Tags";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { axiosInstance } from "apis/axiosConfig";

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
  const [isimageOpen, setIsImageOpen] = useState(false);
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
  const [btnVisible, setBtnVisible] = useState(false); //문제 작성자는 문제 풀수없도록 하기 위한 속성===
  const [answerWriter, setAnswerWriter] = useState(""); //문제 작성자를 받아오기 위한값===
  const navigate = useNavigate();
  // const [likes, setLikes] = useState(!detail ? 0 : detail?.likes);
  const [likes, setLikes] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);
  const [solved, setSolved] = useState(detail?.solved);
  
  //세션에 저장되어있는 값을 가져오기
  const sessionAnswer = sessionStorage.getItem("answer") || "";

  const openModal = () => {
    if (window.confirm("답안을 제출 하시겠습니까?")) {
      setModalOpen(true);
      if(modalTitle === "정답입니다!"){
        updatePoint();
        updateSolvedValue();

      }
    }
  };

  const checkAnswer = () => {
    return answer === sessionAnswer;
  };

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/problem/${location.state.problemId}/${memberInfo.nickname}`
        );
        console.log(response?.data?.data);
        setSolved(response.data?.data?.solved);
        setLikes(response.data?.data?.likes);
        setDetail(response.data.data);
        setProblemSolved(response.data.data.solved);
        setAnswer(response.data.data.answer);
        setAnswerWriter(response.data.data.writer);
        console.log(response.data.data.pathname);
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

  const updateSolvedValue = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/problem/${location.state.problemId}/${memberInfo.nickname}`
      );
      console.log(response?.data?.data);
      setSolved(response.data?.data?.solved);
      // 필요한 값을 업데이트하는 코드를 추가합니다.
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message, "Code:", error.code);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  


  return (
    <>
      <div>
        <p
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          문제 번호:{" "}
          <span style={{ color: "#007bff", fontSize: "1.5rem" }}>
            {detail.problemId}
          </span>
        </p>
      </div>
      <div className="flex justify-between items-center mb-3 ">
        <div className="flex justify-center items-center">
          {detail.level === "gold" ? (
            <LevelIcon fill="#D9B600" width={30} height={30} />
          ) : detail.level === "silver" ? (
            <LevelIcon fill="gray" width={30} height={30} />
          ) : (
            <LevelIcon fill="#AD5600" width={30} height={30} />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex justify-center items-center text-m text-bold">
          {detail.type === "answer" ? "주관식" : "객관식"}
          <div className="flex text-xm ml-4 items-center text-black">
            <ViewIcon fill="black" width={18} height={18} />
            &nbsp;{detail.views}
          </div>
        </div>

        <div>
          {" "}
          {isLoggedIn === false ? (
            <div></div>
          ) : (
             <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
            문제 해결 여부:{" "}
            <span
              className={solved ? "solved" : "unsolved"}
              style={{ fontWeight: "bold" }}
            >
              {solved ? "해결" : "미해결"}
            </span>
            </p>
          )}
        </div>
      </div>

      <div className=" bg-gray-200 px-20 py-10 rounded">
        <div className="mt-4">
          <div className="flex-container">
            <h2 className="text-lg font-medium leading-6 text-gray-900 bg-white rounded">
              제목: {detail.title}
            </h2>
          </div>
          <p className="bg-white rounded mt-4 ">작성자: {detail.writer}</p>
          <div className="mt-4">
            <p className="text-lg text-gray-500 bg-white rounded py-9">
              {detail.content}
            </p>
          </div>
        </div>
      </div>
      <div>
        {!detail.pathname ? (
          <div></div>
        ) : (
          <button
            className="py-1 px-2 bg-transparent text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 mt-5"
            onClick={() => {
              setIsImageOpen(!isimageOpen);
            }}
          >
            이미지 미리보기
          </button>
        )}
      </div>
      {isimageOpen && (
        <p className="flex">
          <img src={detail.pathname} alt="이미지를 불러오지 못했습니다." />
        </p>
      )}
      {isLoggedIn === false ? (
        <div></div>
      ) : (
        <div className="mt-4">
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700"
          >
            답변
          </label>
          <div className="mt-1">
            <textarea
              id="answer"
              name="answer"
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-black border-2 rounded-md"
              value={inputAnswer}
              onChange={handleAnswerChange}
              disabled={!isEditing}
            ></textarea>
          </div>
        </div>
      )}

      {detail && (
        <button
          className=" flex py-2 px-4 bg-transparent text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 mt-2"
          onClick={handleLikeButtonClick}
          disabled={isLiked}
        >
          <LikesIcon fill="black" width={14} height={14}></LikesIcon>
          {likes}
        </button>
      )}

      <div className="flex">
        <p className="text-bold text-blue-500"> 해시태그:&nbsp;</p>{" "}
        <Tags tagList={detail?.hashTag ? detail?.hashTag?.split(",") : []} />
      </div>

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
                          onClose={() => setModalOpen(false)}
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
