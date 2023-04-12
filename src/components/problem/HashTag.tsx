import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  content: string;
  onClick: (tag: string) => void;
  onClickDelete: (tag: string) => void;
}

const Hashtag = ({ content, onClick, onClickDelete }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick(content);
    const hashtags = [content].join(",");
    navigate(`/list?hashtag=${hashtags}`);
  };

  const handleDeleteClick = () => {
    onClickDelete(content);
  };

  return (
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mt-3 mr-2 mb-2 cursor-pointer">
      #{content}
      <button className="ml-2 text-gray-500 hover:text-red-500" onClick={handleDeleteClick}>
        X
      </button>
    </span>
  );
};

export default Hashtag;
