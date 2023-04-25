import React, { useState, useEffect } from "react";
import TitleBox from "./TitleBox";
import ContentBox from "./ContentBox";
import LevelDropdown from "./LevelDropdown";
import Checkbox from "./TypeBox";
import ObjectiveAnswer from "./ObjectiveAnswer";
import SubjectiveAnswer from "./SubjectiveAnswer";
import SubmitButton from "./SubmitButton";
import HashTagBox from "./HashTagBox";
// import axios, { AxiosError } from "axios";
import { axiosInstance } from "apis/axiosConfig";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import S3Box from "components/S3Box";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";

const ProblemRegisterBox = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isimageOpen,setIsImageOpen] = useState(false); 
  const [inputTitle, setInputTitle] = useState(
    location?.state ? location?.state?.title : ""
  );
  const [inputContent, setContent] = useState(
    location?.state ? location?.state?.content : ""
  );
  const [isObjective, setIsObjective] = useState(false);
  const [isSubjective, setIsSubjective] = useState(false);
  const [point, setInputPoint] = useState("10 Point");
  const [files, setFiles] = useState<File[]>(
    location?.state ? location?.state?.pathname : []
  );
  const [selectedValue, setSelectedValue] = useState(
    location?.state ? location?.state?.level : "bronze"
  );
  const [hashTag, setHashTag] = useState<string[]>(
    location?.state && location?.state?.hashTag.length > 0 ? location?.state?.hashTag : null
  );
  const [selectedCheckBoxValue, setSelectedCheckBoxValue] = useState("");
  const [isValue, setIsValue] = useState(false);
  const [s3File, setS3File] = useState("");

  const [isHashTag, setIsHashTag] = useState(false);
  const [subjectiveValue, SetSubjectiveValue] = useState(
    location?.state ? location?.state?.answer : ""
  );
  const [answers, setAnswers] = useState<string[]>(
    location?.state ? location?.state?.answerCandidate : Array(4).fill("")
  );

  const [realAnswer, setRealAnswer] = useState<string>(
    location?.state ? location?.state?.answer : ""
  );
  const [selectedDropDownValue, setSelectedDropDownValue] = useState("");
  const [s3Upload, setS3Upload] = useState(false);
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const handleHashTagClick = (index: Number, item: string) => {
    if (hashTag.includes(item)) {
      return alert("이미 해쉬태그가 등록이되어있습니다.");
    } else {
      setHashTag([...hashTag, item]);
      setIsHashTag(true);
    }
  };
  const handleDeleteHashTagClick = (i: Number, item: string) => {
    setHashTag(hashTag.filter((data, index) => data !== item));

    // 10보다 큰 요소의 위치를 찾은 경우 해당 요소를 제거합니다.
    console.log(hashTag);
  };

  const handlePointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPoint(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleRealAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRealAnswer(event.target.value);
  };

  const handleDropDownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(event.target.value);
  };

  const handleCheckboxChange = (value: boolean) => {
    setIsObjective(!value);
  };

  const handleSubmit = async () => {
    if (s3Upload) {
      window.alert("파일 업로드를 먼저 눌러주세요");
      return;
      
    }

    const answerArray = ["1", "2", "3", "4"];
    if (!isSubjective) {
      if (!answerArray.includes(realAnswer)) {
        window.alert("정답 형식을 맞춰주세요.(1,2,3,4) 중 하나만 선택하세요.");
        return;
      }
    }
    let subjectiveData = {
      type: isSubjective ? "answer" : "choice",
      writer: memberInfo.nickname,
      title: inputTitle,
      content: inputContent,
      answer: !isSubjective ? realAnswer : subjectiveValue,
      views: 0,
      likes: 0,
      level: selectedValue,
      answerCandidate: !isSubjective ? answers : [],
      hashTag: hashTag.join(","),
      pathname: s3File,
      // subjectiveAnswer: subjectiveValue,
      // objectiveAnswer: answers
      // objectiveAnswer: isObjective ? ObjectiveAnswer : []/
    };

    try {
      const response = await axiosInstance
        .post(`/api/problem`, subjectiveData, {
          headers: { "Content-Type": "application/json" },
        })
        .then();
      window.alert("문제 등록이 완료되었습니다.");
      navigate(`/problem`);
      console.log(`response`, response);
    } catch (error: any) {
      console.log(typeof error, error.response.data.detail);
      window.alert(error.response.data.detail);
    }

    console.log(subjectiveData);
  };

  const updateSubmit = async () => {
    if (answers.length !== 4){
      window.alert("객관식은 꼭 4개의 답안 후보를 등록하셔야합니다.")
      return
    }
    if (s3Upload) {
      window.alert("파일 업로드를 먼저 눌러주세요");
      return;
    }

    const answerArray = ["1", "2", "3", "4"];
    if (!isSubjective) {
      if (!answerArray.includes(realAnswer)) {
        window.alert("정답 형식을 맞춰주세요.(1,2,3,4) 중 하나만 선택하세요.");
        return;
      }
    }

    let updatedata = {
      problemId: location.state.problemId,
      type: isSubjective ? "answer" : "choice",
      writer: memberInfo.nickname,
      title: inputTitle,
      content: inputContent,
      answer: !isSubjective ? realAnswer : subjectiveValue,
      level: selectedValue,
      answerCandidate: !isSubjective ? answers : [],
      hashTag: hashTag.join(","),
      pathname: s3File,
    };

    try {
      const update = await axiosInstance.patch("/api/problem", updatedata);
      if (update.status === 200) {
        window.alert("수정이 완료되었습니다.");
        navigate(`/problem`);
      } else {
        window.alert("수정 실패");
        navigate(`/problem`);
      }
      console.log(update);
    } catch (error: any) {
      window.alert(error.response.data.detail);
    }
  };
  const deleteSubmit = async () => {
    try {
      const deleted = await axiosInstance.delete(
        `/api/problem/${location.state.problemId}`
      );
      window.alert("삭제가 완료되었습니다.");
      navigate(`/problem`);
      console.log("삭제");
    } catch (error) {
      window.alert("삭제 권한이 없습니다. 로그인을 다시 시도해주세요.");
    }
  };
  useEffect(() => {
    if (location?.state?.type === "answer") {
      setIsSubjective(true);
    } else {
      setIsSubjective(false);
    }
  }, [location]);

  const s3upload = (s3select: string) => {
    setS3File(s3select);
  };
  const fileSelect = (uploadCheck: boolean) => {
    setS3Upload(uploadCheck);
  };

  return (
    <>
      <div className="flex justify-between items-center ">
        <div className="flex flex -row ">
          <LevelDropdown
            options={selectedValue}
            handleDropDownChange={handleDropDownChange}
          />
          <Checkbox
            isSubjective={isSubjective}
            setIsSubjective={setIsSubjective}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
      <div className=" bg-gray-200 px-20 py-10 rounded">
        <TitleBox title={inputTitle} handleTitleChange={handleTitleChange} />
        {/* {isHashTag && ( */}
        <div className="flex ">
          {!location.state.hashTag.length ? null : hashTag.map((item, index) => (
            <div>
              <div className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">
                {item}
                <button
                  onClick={() => {
                    handleDeleteHashTagClick(index + 1, item);
                  }}
                  className="ml-5"
                >
                </button>
              </div>
            </div>
          ))}
        </div>
        <div></div>
        <ContentBox
          content={inputContent}
          handleContentChange={handleContentChange}
        />
      </div>
      {isSubjective ? (
        <SubjectiveAnswer
          children={subjectiveValue}
          onChange={(e) => {
            SetSubjectiveValue(e.target.value);
          }}
        />
      ) : (
        <div>
          <ObjectiveAnswer
            answers={answers}
            setAnswers={setAnswers}
            Count={4}
            onChange={() => {}}
          />
          정답 :
          <input
            placeholder="번호를 입력하세요.(1,2,3,4)"
            type="text"
            className="border border-gray-300 px-2 py-1"
            value={realAnswer}
            onChange={(e) => handleRealAnswerChange(e)}
          />
        </div>
      )}
      <div>
        <S3Box s3select={s3upload} uploadCheck={fileSelect} />
      </div>
      <div>
        {!location.state.pathname ? (
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
          <img src={location.state.pathname} alt="이미지를 불러오지 못했습니다." />
        </p>
      )}
      {!location.state && (
        <SubmitButton text={"제출하기"} onClick={handleSubmit} />
      )}

      <div className="gap-2 flex">
        {location.state && (
          <SubmitButton text={"수정"} onClick={updateSubmit} />
        )}
        {location.state && (
          <SubmitButton text={"삭제"} onClick={deleteSubmit} />
        )}
      </div>
      <HashTagBox handleHashTagClick={handleHashTagClick} />
    </>
  );
};

export default ProblemRegisterBox;
