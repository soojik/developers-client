import { useState } from "react";
import DownArrowIcon from "./icons/DownArrowIcon";

const Options = ({
  label,
  lists,
  setState,
}: {
  label: string;
  lists: string[];
  setState: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [labelName, setLabelName] = useState<string>(label);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleOptionClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsClicked(!isClicked);
  };
  const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
    setLabelName((e.target as any).textContent);
    setIsClicked(!isClicked);
    setState((e.target as any).textContent);
  };
  return (
    <>
      <div className="relative">
        <button
          className="flex items-center justify-between w-full sign_input"
          onClick={handleOptionClick}
        >
          {labelName}
          <DownArrowIcon fill="black" />
        </button>
        {isClicked && (
          <ul className="absolute z-10 w-full overflow-scroll bg-white border_base scrollbar_option h-52">
            {lists.map((el) => (
              <li
                key={el}
                className="flex items-center w-full h-8 pl-2 hover:cursor-pointer hover:bg-slate-200"
                onClick={handleClickItem}
              >
                {el}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
export default Options;
