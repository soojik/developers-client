import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemPointModal from "components/problem/ProblemPointModal";


const ProblemDetail = () => {
  const { problemId, member } = useParams(); //detail을 클릭하였을때 param에 삽입
  const [detail, setDetail] = useState({
    problemId: 0,
    title: "",
    content: "",
    writer: "",
    answer: "", //답안을 제출할때 비교한다.
    level: "",
    hashTag: "",
    type: "",
    views: 0,
    likes: 0,
    solved: "",
    pathname: ""
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [answer, setAnswer] = useState('');

  //세션에 저장되어있는 값을 가져오기
  const sessionAnswer = sessionStorage.getItem('answer') || '';

  const openModal = () => {
    setModalOpen(true);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(event.target.value);
  }

  const checkAnswer = () => {
    return answer === sessionAnswer;
  }

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const response = await axios.get(`/problem/${problemId}/${member}`);
        setDetail(response.data);
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

  return (
    <>
      <p>문제 해결 여부: {detail.solved ? '해결' : '미해결'}</p>
      <div className="flex items-center justify-center bg-gray-200 px-20 py-10 rounded">

        <div className="mt-4">

          <p>문제 유형: {detail.type}</p>
          <h2 className="text-lg font-medium leading-6 text-gray-900">제목: {detail.title} </h2>
          <p>작성자: {detail.writer}</p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">내용:{detail.content}</p>
          </div>
          <div className="mt-4">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
              답변
            </label>
            <div className="mt-1">
              <textarea
                id="answer"
                name="answer"
                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={answer}
                onChange={handleAnswerChange}
              ></textarea>
            </div>
          </div>

          <p>조회수: {detail.views}</p>
          <p>좋아요: {detail.likes}</p>
          <p>난이도: {detail.level}</p>
          <p>해시태그: {detail.hashTag}</p>
          <p>문제 번호: {detail.problemId}</p>
          {/* 더 필요한 내용 출력 */}
          {/*  */}
        </div>

        {/* 일치 여부 출력 */}
        <div>입력한 값과 일치여부: {checkAnswer() ? '일치' : '불일치'}</div>
      </div>
      <div className="flex flex-col justify-center items-end">
        <div className="h-32 flex items-center">
          <button
            className="py-2 px-4 bg-transparent text-red-600 font-semibold border border-red-600 rounded hover:bg-red-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
            onClick={openModal}
          >
            문제 제출
          </button>

        </div>
        {modalOpen && (
          <ProblemPointModal
            // level = {}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default ProblemDetail;