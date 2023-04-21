import { useState } from "react";
import "tailwindcss/tailwind.css";

interface Props {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="m-2">
      <form onSubmit={handleFormSubmit} className="w-full flex justify-center">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          value={query}
          onChange={handleInputChange}
          className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 flex-1"
        />
        <button
          type="submit"
          className="py-2 px-4 ml-2 rounded-md bg-slate-200 text-accent-400 hover:bg-accent-500 hover:text-white duration-200"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
