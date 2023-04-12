// import React, { useState } from "react";
// import Hashtag from "../problempages/HashTag";

// const MyComponent = () => {
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState<string[]>([]);
//   const [clickedHashtags, setClickedHashtags] = useState<string[]>([]);

//   const handleHashtagClick = (tag: string) => {
//     setClickedHashtags([...clickedHashtags, tag]);
//   };

//   const handleHashtagDelete = (tag: string) => {
//     setTags(tags.filter((t) => t !== tag));
//     setClickedHashtags(clickedHashtags.filter((t) => t !== tag));
//     const hashtags = tags.filter((t) => t !== tag).join(",");
//     window.history.pushState({}, "", `/list?hashtag=${hashtags}`);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setTags([...tags, content]);
//     setContent("");
//     console.log(`검색어: ${content}`);
//     const hashtags = tags.concat(content).join(",");
//     window.history.pushState({}, "", `/list?hashtag=${hashtags}`);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           className="border-2 border-gray-500 rounded-lg"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Hashtag 검색"
//           style={{ color: "gray" }}
//         />
//         <button
//           type="submit"
//           className="group rounded-lg h-7 w-20 bg-blue-500 font-bold text-10 text-white relative overflow-hidden"
//         >
//           검색
//         </button>
//       </form>

//       {tags.map((tag, index) => (
//         <Hashtag
//           key={index}
//           content={tag}
//           onClick={handleHashtagClick}
//           onClickDelete={handleHashtagDelete}
//         />
//       ))}
//     </div>
//   );
// };

// export default MyComponent;




import React, { useState } from 'react';
import Hashtag from 'components/problem/HashTag';
import { useNavigate } from 'react-router-dom';




interface DropBoxProps {
  selectName: string;
  options: string[];
  paramName?: string;
  onSelect?: (value: string) => void;
}

const DropBox = ({ selectName, options, paramName, onSelect }: DropBoxProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);

    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div>
      <label htmlFor={selectName}>{selectName}</label>
      <select name={paramName} id={selectName} onChange={handleChange}>
        <option value="">전체</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};


interface PopularTag {
  id: number;
  name: string;
}

interface PopularTagsProps {}

const PopularTags = ({}: PopularTagsProps) => {
  const popularTags: PopularTag[] = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'React' },
    { id: 3, name: 'TypeScript' },
    { id: 4, name: 'Node.js' },
    { id: 5, name: 'CSS' },
    { id: 6, name: 'HTML' },
    { id: 7, name: 'Vue.js' },
    { id: 8, name: 'Angular' },
  ];

  const [tags, setTags] = useState<PopularTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [content, setContent] = useState("");
  const navigate = useNavigate();


  const handleDeleteTag = (id: number) => {
    const updatedTags = tags.filter(tag => tag.id !== id);
    setTags(updatedTags);
  
    // URL에서 삭제할 태그를 제거합니다.
    const hashtags = updatedTags.map(tag => tag.name).join(",");
    window.history.pushState({}, "", `/list?hashtag=${hashtags}`);

  };
  const handleSelectTag = (value: string) => {
    const selectedPopularTag = popularTags.find(tag => tag.name === value);
    if (selectedPopularTag) {
      setSelectedTag(selectedPopularTag.name);
      setTags([...tags, selectedPopularTag]);
      setContent("");
      console.log(`검색어: ${content}`);
      const hashtags = tags.concat(selectedPopularTag).map(tag => tag.name).join(",");
      window.history.pushState({}, "", `/list?hashtag=${hashtags}`);
    }
  };
  const handleClick = (content: string) => {
    const hashtags = [content].join(",");
    navigate(`/list?hashtag=${hashtags}`);
  }

  return (
    <div>
      <DropBox
        selectName="인기태그"
        options={popularTags.map(tag => tag.name)}
        onSelect={handleSelectTag}
      />
      {tags.map(tag => (
        <Hashtag
          key={tag.id}
          content={tag.name}
          onClick={() => handleClick(tag.name)}
          onClickDelete={() => handleDeleteTag(tag.id)}
        />
      ))}
    </div>
  );
  
};


export default PopularTags;