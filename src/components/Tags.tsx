const Tags = ({ tagList }: { tagList: string[] }) => {
  // const tagList = ["c++", "arrays", "java", "react", "javascript"]; // 임시데이터
  return (
    <div className="mb-8">
      {tagList?.map((tag) => (
        <span
          key={tag}
          className="p-2 mr-1 rounded-md bg-blue-50 text-zinc-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
export default Tags;
