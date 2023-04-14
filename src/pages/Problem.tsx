import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useIntersect from "hooks/useIntersect";
import SearchBox from "components/SearchBox";
import DropBoxStack from "components/dropbox/DropBoxCondition";
import DropBoxLevel from "components/dropbox/DropBoxLevel";
import DropBoxType from "components/dropbox/DropBoxType";
import DropBoxSolved from "components/dropbox/DropBoxSolved";
import HashTagComponent from "../components/problem/HashTagComponent";
import ConfirmBtn from "components/buttons/CofirmBtn";
import ViewIcon from "components/icons/ViewIcon";
import LikesIcon from "components/icons/LikesIcon";
import { testData } from "libs/options";
import LevelIcon from "components/icons/LevelIcon";
import Tags from "components/Tags";
import CheckIcon from "components/icons/CheckIcon";

interface ProblemProps {
  problemId: number;
  type: string;
  writer: string;
  title: string;
  content: string;
  answer: string;
  level: string;
  views: number;
  likes: number;
  createdTime: string;
  hashTag: string;
  tag?: null | string;
}

const Problem = () => {
  const URL = process.env.REACT_APP_DEV_URL;

  const navigate = useNavigate();
  const [resData, setResData] = useState<ProblemProps[]>([]);
  const [problemList, setProblemList] = useState<ProblemProps[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const SIZE = 5;

  const loadedData = async () => {
    setIsLoading(true);
    const totalCount = resData.length;
    const totalPages = Math.round(totalCount / SIZE);
    if (totalPages >= page) {
      setPage(page + 1);
      const nextList = resData.slice(page * SIZE, (page + 1) * SIZE);
      setProblemList([...problemList, ...nextList]);
    }
    setIsLoading(false);
  };

  const target = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (!isLoading) {
      loadedData();
    }
  });

  useEffect(() => {
    const getProblemList = async () => {
      setResData([...testData]); // 임시 더미데이터
      /* await axios
      .get(`${URL}/api/problem/list/{sortcondition}`)
      .then(({ data }) => {
        console.log(data);
        setResData(data); // 초기 100개 받기
      })
      .catch((err) => console.log(err)); */
    };
    getProblemList();
  }, []);

  const navigateToRegister = () => {
    navigate("/problem/register");
  };

  const navigatorToDetail = () => {
    navigate("/problem/detail/sb");
  };

  return (
    <div className="md:m-auto w-full md:w-4/5">
      <div className="flex justify-end mt-5 mb-10">
        <ConfirmBtn type="submit" onClick={() => navigate("/problem/register")}>
          문제 등록
        </ConfirmBtn>
      </div>
      <div className="flex justify-center mb-10">
        <div className="flex flex-col w-full">
          <SearchBox />
          <div className="flex w-full justify-between">
            <DropBoxLevel
              selectName="Level을 선택하세요"
              options={["Gold", "Silver", "Bronze"]}
              paramName="level"
            />
            <DropBoxSolved
              selectName="solved를 선택하세요"
              options={["Solved", "Solve"]}
              paramName="solved"
            />
            <DropBoxType
              selectName="Type을 선택하세요"
              options={["Choice", "Answer"]}
              paramName="type"
            />
          </div>
          <HashTagComponent />
        </div>
      </div>
      <div className="flex justify-between items-center my-4">
        <h2 className="text-accent-500 font-bold text-xl">
          총 {resData.length} 문제
        </h2>
        <DropBoxStack
          selectName="조건을 선택하세요"
          options={["최신순", "추천순", "조회순"]}
          paramName=""
        />
        {/* <div className="w-[90px]">
          <Options label="조건" lists={conditionList} setState={setCondition} />
        </div> */}
      </div>
      <div className="grid grid-cols-10 text-slate-400 font-bold text-sm border-b pb-3 my-2">
        <div className="flex justify-center">상태</div>
        <div className="col-span-7 flex justify-center">제목</div>
        <div className="flex justify-center">난이도</div>
        <div className="flex justify-center">문제 유형</div>
      </div>

      {problemList?.map((el, idx) => (
        <Link to={`/problem/${el.problemId}/{member}`} key={idx}>
          <div className="grid grid-cols-10 bg-gray-100 rounded-lg py-2.5 mb-2 shadow">
            <div className="flex justify-center items-center">
              {el.answer.length >= 1 ? (
                <CheckIcon fill="blue" width={25} height={25} />
              ) : null}
            </div>
            <div className="col-span-7 text-xl ">
              <h1 className="font-semibold">{el.title}</h1>

              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="flex text-sm text-slate-600">
                    {el.writer} &nbsp;
                  </div>
                  <div className="flex text-sm mr-4 items-center text-gray-400">
                    <ViewIcon fill="lightGray" width={18} height={18} />
                    &nbsp;{el.views}
                  </div>
                  <div className="flex text-sm mr-4 items-center text-gray-400">
                    <LikesIcon fill="lightGray" width={14} height={14} />
                    &nbsp;{el.likes}
                  </div>
                </div>
                <Tags tagList={el.hashTag.split(",")} />
              </div>
            </div>
            <div className="flex justify-center items-center">
              {el.level === "gold" ? (
                <LevelIcon fill="#D9B600" width={22} height={22} />
              ) : el.level === "silver" ? (
                <LevelIcon fill="gray" width={22} height={22} />
              ) : (
                <LevelIcon fill="#AD5600" width={22} height={22} />
              )}
            </div>
            <div className="flex justify-center items-center text-sm">
              {el.type === "answer" ? "주관식" : "객관식"}
            </div>
          </div>
        </Link>
      ))}
      <div ref={target}>{isLoading && <div>Loading...</div>}</div>
    </div>
  );
};

export default Problem;
