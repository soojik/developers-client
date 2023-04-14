import { useNavigate } from "react-router-dom";
import ProblemListupdate from "components/problem/ProblemListupdate";
import SearchBox from "components/SearchBox";
import DropBoxStack from "components/dropbox/DropBoxCondition";
import DropBoxLevel from "components/dropbox/DropBoxLevel";
import DropBoxType from "components/dropbox/DropBoxType";
import DropBoxSolved from "components/dropbox/DropBoxSolved";
import HashTagComponent from "../components/problem/HashTagComponent";
import ConfirmBtn from "components/buttons/CofirmBtn";

const ProblemMain = () => {
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
      title: "제목입니다5",
      likes: 0,
    },
    {
      nickname: "유저7",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다5",
      likes: 0,
    },
    {
      nickname: "유저8",
      type: "✍️단답형",
      views: 0,
      title: "제목입니다5",
      likes: 0,
    },
  ].slice(0, 5);

  const navigate = useNavigate();

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
        <h2 className="text-accent-500 font-bold text-xl">문제 목록</h2>
        <DropBoxStack
          selectName="조건을 선택하세요"
          options={["최신순", "추천순", "조회순"]}
          paramName=""
        />
      </div>
      <ProblemListupdate section={section} sectionHeader={""} />
    </div>
  );
};

export default ProblemMain;
