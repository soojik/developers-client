import { useState } from "react";

interface TitleBoxProps {
    title ?: string;
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const TitleBox = ({title,handleTitleChange}:TitleBoxProps) => {
    // const [title, setTitle] = useState(children);
    // const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setTitle(event.target.value);
    //   };
      return (
        <div>
     <input
        className="border border-gray-300 outline-none rounded-lg py-2 px-4 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        type="text"
        placeholder="제목을 입력하세요."
        value={title}
        onChange={handleTitleChange}
      />
        </div>
      );
}
export default TitleBox;