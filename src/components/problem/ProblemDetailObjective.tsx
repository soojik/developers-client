import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemPointModal from "components/problem/ProblemPointModal";


const ProblemDetail = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const { problemId, member } = useParams(); //detail을 클릭하였을때 param에 삽입
  const [detail, setDetail] = useState({
    problemId:0,
    title: "",
    content: "",
    writer: "",
    answer:"", //답안을 제출할때 비교한다.
    level:"",
    hashTag:"",
    type:"",
    views: 0,
    likes: 0,
    solved:"",
    pathname:""
  });

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
    <div>
    <h1>{detail.title}</h1>
    <p>{detail.content}</p>
    <p>작성자: {detail.writer}</p>
    <p>조회수: {detail.views}</p>
    <p>좋아요: {detail.likes}</p>
    <p>난이도: {detail.level}</p>
    <p>문제 유형: {detail.type}</p>
    <p>해시태그: {detail.hashTag}</p>
    <p>문제 번호: {detail.problemId}</p>
    <p>문제 해결 여부: {detail.solved ? '해결' : '미해결'}</p>
    {/* 더 필요한 내용 출력 */}
    {/*  */}
  </div>
    
  
  </>
  );
};

export default ProblemDetail;