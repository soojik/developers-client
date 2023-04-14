import { SetStateAction, useState } from "react";
import DownArrowIcon from "./icons/DownArrowIcon";

const MultiOptions = ({
  label,
  lists,
  state,
  setState,
}: {
  label: string;
  lists: string[];
  state: string[];
  setState: React.Dispatch<SetStateAction<string[]>>;
}) => {
  const [labelName, setLabelName] = useState<string[]>([label]);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleOptionClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsClicked(!isClicked);
  };

  const handleClickItem = (e: React.MouseEvent<HTMLElement>, item: string) => {
    const target = e.target as HTMLLIElement;
    if (state.includes(target.textContent!)) {
      const filtered = state.filter((el, idx) => el !== item);
      setLabelName(filtered);
      setState(filtered);
      return null;
    }
    if (state.length >= 5) {
      window.alert("5개 이상 선택할 수 없습니다");
    } else {
      setLabelName([...state, target.textContent!]);
      setState([...state, target.textContent!]);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          className="flex items-center justify-between w-full sign_input"
          onClick={handleOptionClick}
        >
          <span className="leading-4 line_wrap">{labelName.join(",")}</span>
          <DownArrowIcon stroke="black" />
        </button>
        {isClicked && (
          <ul className="absolute z-10 flex flex-wrap h-40 p-2 overflow-scroll bg-white shadow-lg border_base scrollbar_option">
            {lists?.map((item) => (
              <li
                key={item}
                className={`flex items-center justify-center w-auto h-8 p-2 mt-2 mr-2 text-sm list-none rounded-xl cursor-pointer hover:border-accent-300/50 ${
                  state.includes(item)
                    ? "selected_btn"
                    : "bg-blue-50 tag text-zinc-700 border border-blue-50"
                }`}
                onClick={(e) => handleClickItem(e, item)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
export default MultiOptions;
