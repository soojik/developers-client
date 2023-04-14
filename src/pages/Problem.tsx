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

interface ProblemProps {
  nickname: string;
  type: string;
  views: number;
  title: string;
  likes: number;
}

const Problem = () => {
  const URL = process.env.REACT_APP_DEV_URL;
  const section = [
    {
      nickname: "유저1",
      type: "🔢객관식",
      views: 0,
      title: "제목입니다",
      likes: 0,
    },
    {
      nickname: "유저2",
      type: "🔢객관식",
      views: 0,
      title: "제목입니다2",
      likes: 0,
    },
    {
      nickname: "유저3",
      type: "🔢객관식",
      views: 0,
      title: "제목입니다3",
      likes: 0,
    },
    {
      nickname: "유저4",
      type: "🔢객관식",
      views: 0,
      title: "제목입니다4",
      likes: 0,
    },
    {
      nickname: "유저5",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다5",
      likes: 0,
    },
    {
      nickname: "유저6",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다6",
      likes: 0,
    },
    {
      nickname: "유저7",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다7",
      likes: 0,
    },
    {
      nickname: "유저8",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다8",
      likes: 0,
    },
    {
      nickname: "유저9",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다9",
      likes: 0,
    },
    {
      nickname: "유저10",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다10",
      likes: 0,
    },
    {
      nickname: "유저11",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다11",
      likes: 0,
    },
    {
      nickname: "유저12",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다12",
      likes: 0,
    },
  ];

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
      setResData([...section]); // 임시 더미데이터
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
      </div>

      {problemList?.map((el, idx) => (
        <Link to={`/problem/{problemId}/{member}`} key={idx}>
          <div className="bg-gray-100 rounded-lg py-2.5 px-4 mb-2 shadow">
            <div className="flex justify-between">
              <div className="flex text-sm text-slate-600">
                {el.nickname} &nbsp;{el.type}
              </div>
              <div className="flex">
                <div className="text-sm mr-4 font-bold">조회수 {el.views}</div>
                <div className="text-sm mr-4 font-bold">좋아요 {el.likes}</div>
              </div>
            </div>
            <div className="text-xl font-semibold">{el.title}</div>
          </div>
        </Link>
      ))}
      <div ref={target}>{isLoading && <div>Loading...</div>}</div>
    </div>
  );
};

export default Problem;
