import { SetStateAction } from "react";

interface TagProps {
  tags: string[];
  setTags: React.Dispatch<SetStateAction<string[]>>;
  placeholder: string;
}

const TagInput = ({ tags, setTags, placeholder }: TagProps) => {
  const removeTags = (indexToRemove: number) => {
    const res = tags.filter((el, idx) => idx !== indexToRemove);
    setTags(res);
  };

  const addTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    let newTag = target.value;
    // 1. 아무것도 입력하지 않은 채 Enter 키 입력시 메소드 실행하지 말기
    // 2. 태그 추가 후 input 창 비우기
    if (e.key === "Enter" && newTag.trim() !== "") {
      // 3. 이미 입력된 태그인지 검사하여 이미 있는 태그면 추가하지 말기
      if (tags.includes(newTag)) {
        window.alert("중복된 태그입니다");
        return null;
      }
      // 태그 개수 10개로 제한
      if (tags.length > 10) {
        window.alert("10개 이상의 태그를 추가할 수 없습니다");
        target.value = "";
      }
      // 새 태그 추가 - 배열 뒤에 추가
      else {
        setTags([...tags, newTag]);
        target.value = "";
      }
    }
  };
  const handelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <>
      <div className="flex items-start flex-wrap min-h-[48px] w-full py-2 ">
        <input
          className="w-full p-2 border border-solid rounded-md outline-none border-slate-300 h-11 text-md placeholder:font-thin placeholder:text-sm"
          type="text"
          onKeyUp={(e) => addTags(e)}
          onKeyDown={(e) => handelKeyDown(e)} // 태그 input에서 엔터시 form 제출 막기
          placeholder={placeholder}
        />
        <ul id="tags" className="flex flex-wrap mt-2">
          {tags.map((tag, index) => (
            <li
              key={index}
              className="flex items-center justify-center w-auto h-8 p-2 mt-2 mr-2 text-sm list-none rounded-md bg-blue-50 tag text-zinc-700"
            >
              <span className="tag-title">{tag}</span>
              <span
                className="flex items-center justify-center w-4 h-4 ml-2 text-lg cursor-pointer tag-close-icon text-zinc-500 font-extralight"
                onClick={() => removeTags(index)}
              >
                &times;
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default TagInput;
