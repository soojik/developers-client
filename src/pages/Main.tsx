import MainList from "components/MainList";

const Main = () => {
  const section = [
    { nickname: "유저1", type: "객관식", views: 0, title: "제목입니다" },
    { nickname: "유저2", type: "객관식", views: 0, title: "제목입니다2" },
    { nickname: "유저3", type: "객관식", views: 0, title: "제목입니다3" },
    { nickname: "유저4", type: "객관식", views: 0, title: "제목입니다4" },
    { nickname: "유저5", type: "객관식", views: 0, title: "제목입니다5" },
  ];

  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden flex flex-col">
        <MainList section={section} sectionHeader={"최근 등록된 문제"} />
        <MainList section={section} sectionHeader={"최근 개설된 채팅방"} />
        <MainList section={section} sectionHeader={"WEEKLY SOLVED BEST"} />
        <MainList section={section} sectionHeader={"WEEKLY ROOM BEST"} />
      </div>
      {/* 데스크탑 */}
      <div className="hidden md:grid grid-cols-2 gap-5 w-full">
        <MainList section={section} sectionHeader={"최근 등록된 문제"} />
        <MainList section={section} sectionHeader={"최근 개설된 채팅방"} />
        <MainList section={section} sectionHeader={"WEEKLY SOLVED BEST"} />
        <MainList section={section} sectionHeader={"WEEKLY ROOM BEST"} />
      </div>
    </>
  );
};

export default Main;