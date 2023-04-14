import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ProblemDetailProps {
  problemId: number;
  type: string;
  writer: string;
  title: string;
  content: string;
  answer: string;
  level: string;
  hashTag: null | string;
  views: number;
  likes: null | number;
  solved: boolean;
  answerCandidate: string[];
  pathname: string[];
}

const ProblemDetail = () => {
  const URL = ""; // 본인 url 적으세요
  const { problemId, nickname } = useParams();
  //   console.log(problemId, nickname); // params로 받아옴
  const [problemDetail, setProblemDetail] = useState<ProblemDetailProps>({
    problemId: 412,
    type: "answer",
    writer: "hi",
    title: "아",
    content: "에요",
    answer: "정답",
    level: "bronze",
    hashTag: null,
    views: 0,
    likes: null,
    solved: false,
    answerCandidate: ["5", "2", "3", "5"],
    pathname: [],
  }); // 테스트 더미데이터 초기값으로 넣어놓음

  // 1. 문제 1개 조회 api 테스트시 초기 데이터 삭제하기 => 바로 위 useState 주석하고 밑에 주석해제
  // const [problemDetail, setProblemDetail] = useState<ProblemDetailProps>()

  useEffect(() => {
    const getProblemDetail = async () => {
      await axios
        .get(`${URL}/problem/${problemId}/${nickname}`)
        .then(({ data }) => {
          //   setProblemDetail(data); // 3. 주석해제해서 받아온 데이터로 갱신
          console.log("문제 1개 조회 :", data);
        })
        .catch((err) => console.log(err));
    };
    // getProblemDetail(); // 2. 문제 1개 조회 API 테스트 시 주석 해제하기
  });

  return (
    <div>
      문제 상세페이지 pages/ProblemDetail
      {problemDetail && problemDetail.type === "answer" ? (
        <div>주관식 컴포넌트</div>
      ) : (
        <div>객관식 컴포넌트</div>
      )}
    </div>
  );
};
export default ProblemDetail;
