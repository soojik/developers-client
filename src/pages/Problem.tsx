import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "apis/axiosConfig";
import useIntersect from "hooks/useIntersect";
import SearchBox from "components/SearchBox";
import DropBoxCondition from "components/dropbox/DropBoxCondition";
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
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { useAsync } from "react-use";
import ScrollButton from "components/ScrollButton";

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
  hashTag: string[];
  tag?: null | string;
}

const Problem = () => {
  const URL = process.env.REACT_APP_DEV_URL;

  const navigate = useNavigate();
  const { memberInfo } = useRecoilValue(memberInfoState); // nickname 받기
  // const nickname = "alibaba"; // 테스트: 임시로 nickname 설정해둠
  const nickname = memberInfo.nickname;
  const [resData, setResData] = useState<ProblemProps[]>([]);
  const [problemList, setProblemList] = useState<ProblemProps[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectTemp, setSelectTemp] = useState<string[]>([]);
  const [searchTemp, setSearchTemp] = useState<string>("");
  const [filteredProblemList, setFilteredProblemList] = useState<
    ProblemProps[]
  >([]);
  const [isLastPage, setIsLastPage] = useState(false);

  const SIZE = 20;
  const totalCount = filteredProblemList.length;
  const totalPages = Math.ceil(totalCount / SIZE); // 여기서 totalPages를 계산하고 선언합니다.

  const target = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (!isLoading && !isLastPage && totalPages > page) {
      loadedData();
    }
  });

  const loadedData = async () => {
    const totalCount = filteredProblemList.length;
    const totalPages = Math.round(totalCount / SIZE);

    // 페이지 번호가 totalPages보다 크거나 같으면 요청을 중지
    if (page >= totalPages) {
      setIsLastPage(true);
      return;
    }

    setIsLoading(true);
    setPage(page + 1);
    const nextList = filteredProblemList.slice(page * SIZE, (page + 1) * SIZE);
    setProblemList((prevList) => {
      const newList = [...prevList, ...nextList];
      // 중복 데이터를 제거합니다.
      const uniqueList = newList.filter((item, index, arr) => {
        return arr.findIndex((i) => i.problemId === item.problemId) === index;
      });
      return uniqueList;
    });
    setIsLoading(false);
  };

  useEffect(() => {
    loadedData();
  }, [page]);

  const list = useAsync(async () => {
    const params = selectTemp.join("&");
    const response = await axiosInstance.get(`api/problem/list?${params}`);
    // const response = await axios.get(`${URL}/api/problem/list?${params}`);
    const url = `api/problem/list?${params}`;
    console.log(url);

    return response.data; // 수정: data 프로퍼티에 접근
  }, [selectTemp]);

  useEffect(() => {
    if (list.value) {
      setPage(0); // 페이지 번호를 0으로 설정
      setProblemList(list.value.data); // 문제 목록을 list.value.data로 설정
    }
  }, [list.value]);

  const handleChangeTemp = (value: string) => {
    const prefix = value.split("=")[0];
    const existingIndex = selectTemp.findIndex((e) => e.startsWith(prefix));

    // Remove elements with 'likes', 'views', or 'order' prefixes, except the current prefix
    const newSelectTemp = selectTemp.filter((e) => {
      const otherPrefix = e.split("=")[0];
      return (
        (otherPrefix !== "likes" &&
          otherPrefix !== "views" &&
          otherPrefix !== "order") ||
        otherPrefix === prefix
      );
    });

    // Update or add the new value
    if (existingIndex !== -1) {
      if (value.split("=")[1] === "") {
        // Check if the value is empty
        newSelectTemp.splice(existingIndex, 1); // Remove the existing value
      } else {
        newSelectTemp[existingIndex] = value;
      }
    } else if (value.split("=")[1] !== "") {
      // Add the new value only if it's not empty
      newSelectTemp.push(value);
    }

    setSelectTemp(newSelectTemp);
  };

  const handleResetTemp = (type: string) => {
    setSelectTemp(selectTemp.filter((e) => !e.startsWith(type)));
  };

  const resetListData = () => {
    setSelectTemp([]);
    navigate("/problem"); // 이동 경로를 '/problem'으로 설정
    window.location.reload(); // 페이지 새로고침
  };

  const searchList = async (searchTemp: string) => {
    try {
      const url = `api/problem?search=${searchTemp}`;
      // const url = `${URL}/api/problem?search=${params}`;
      console.log(`요청시작전`, url); // axios 요청 전에 url 값을 출력

      const response = await axiosInstance.get(url); // url 변수를 바로 사용
      setPage(0); // 페이지 번호를 0으로 설정
      setProblemList(response.data);
    } catch (error) {
      console.log("데이터를 찾아오지 못했습니다.");
    }
  };

  const searchSubmit = (value: string) => {
    setSearchTemp(value); // 검색어 상태 업데이트
    searchList(value);
  };

  useEffect(() => {
    const hashTags = selectTemp
      .filter((value) => value.startsWith("hashtag="))
      .map((value) => value.substring(8).split(",")) // 콤마로 구분된 해시태그 배열로 변환
      .flat(); // 하위 배열을 합치기

    if (hashTags.length > 0) {
      const filtered = problemList.filter((problem) => {
        if (!problem.hashTag) return false;

        const problemHashTags = problem?.hashTag; // 콤마로 구분된 해시태그 배열로 변환
        return hashTags.every((hashTag) => problemHashTags.includes(hashTag));
      });
      setFilteredProblemList(filtered);
    } else {
      setFilteredProblemList(problemList);
    }
  }, [selectTemp, problemList]);

  return (
    <>
      <div className="md:m-auto w-full md:w-4/5">
        <div className="flex justify-end mt-5 mb-10">
          {memberInfo.isLoggedIn === false ? (
            <div></div>
          ) : (
            <div className="flex">
              <ConfirmBtn
                type="submit"
                onClick={() => navigate("/problem/register")}
              >
                문제 등록
              </ConfirmBtn>
            </div>
          )}
          <ConfirmBtn onClick={resetListData}>데이터 초기화</ConfirmBtn>{" "}
          {/* 버튼 수정 */}
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col w-full">
            <SearchBox onSearch={searchSubmit} />
            <div className="flex w-full justify-between">
              <DropBoxLevel
                selectFn={handleChangeTemp}
                handleResetTemp={handleResetTemp}
              />
              <DropBoxSolved
                selectFn={handleChangeTemp}
                handleResetTemp={handleResetTemp}
              />
              <DropBoxType
                selectFn={handleChangeTemp}
                handleResetTemp={handleResetTemp}
              />
            </div>
            <HashTagComponent
              selectFn={handleChangeTemp}
              handleResetTemp={handleResetTemp}
            />
          </div>
        </div>
        <div className="flex justify-between items-center my-4">
          <h2 className="text-accent-500 font-bold text-xl">
            {/* 총 {filteredProblemList.length} 문제 */}
          </h2>
          <DropBoxCondition
            selectFn={handleChangeTemp}
            handleResetTemp={handleResetTemp}
          />

          {/* <div className="w-[90px]">
          <Options label="조건" lists={conditionList} setState={setCondition} />
        </div> */}
        </div>
        <div className="grid grid-cols-10 text-slate-400 font-bold text-sm border-b pb-3 my-2">
          {/* <div className="flex justify-center">상태</div> */}
          <div className="flex justify-center">문제번호</div>
          <div className="col-span-7 flex justify-center">제목</div>
          <div className="flex justify-center">난이도</div>
          <div className="flex justify-center">문제 유형</div>
        </div>

        {filteredProblemList.length === 0 &&
        (selectTemp.length > 0 || searchTemp.length > 0) ? (
          <div className="text-center mt-5">검색 결과가 없습니다.</div>
        ) : (
          <div
            className="problemListContainer"
            style={{ height: "500px", overflowY: "auto" }}
          >
            {filteredProblemList?.map((el, idx) => (
              // <Link to={`/problem/${el.problemId}/${nickname}`} key={idx}>
              <div
                onClick={() => {
                  // navigate(el.writer!== "Taeho"? "/problem/detail":"/problem/register",{state:el});
                  navigate(
                    el.writer !== memberInfo.nickname
                      ? "/problem/detail"
                      : "/problem/register",
                    { state: el }
                  );
                }}
                className="grid grid-cols-10 bg-gray-100 rounded-lg py-2.5 mb-2 shadow"
              >
                <div className="flex justify-center items-center">
                  {/* {el.answer.length >= 1 ? (
              <CheckIcon fill="blue" width={25} height={25} />
            ) : null} */}
                  {el.problemId}
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
                    <Tags tagList={el?.hashTag} />
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
            ))}
          </div>
        )}
        <div ref={target}>{isLoading && <div>Loading...</div>}</div>
        <ScrollButton />
      </div>
    </>
  );
};

export default Problem;
