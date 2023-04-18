import { useState } from "react";
import axios from "./axiosInstance";
import { isAxiosError } from "axios";


interface SearchProps {
  // paramName: (value: string) => void
  searchFn: (value: string) => void;


}

const SearchBox:React.FC<SearchProps>= ({
  searchFn,

}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    searchFn(searchTerm);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/problem", {
        params: {
          search: searchTerm,
        },
        
      });
      console.log(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.message, "Code:", error.code);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        className="flex rounded-lg sign_input h-[40px] w-full"
        onSubmit={handleFormSubmit}
      >
        <button className="cursor-pointer flex items-center">
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="pointer-events-none absolute w-5 fill-gray-500 transition"
          >
            <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
          </svg>
        </button>
        <input
          type="text"
          className="w-full pl-8 outline-0 placeholder:text-slate-500 placeholder:font-semibold"
          placeholder="검색어를 입력해주세요"
          id=""
          value={searchTerm}
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};
export default SearchBox;
