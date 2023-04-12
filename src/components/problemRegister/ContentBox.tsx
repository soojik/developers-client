import { useState } from "react";

interface ContentProps {
    content ?: string;
    handleContentChange : (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
const ContentBox = ({content,handleContentChange}:ContentProps) => {
    // const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setcontent(event.target.value);
    // };
    return (
        <div  className="mt-5 mb-5">
            <textarea onChange={handleContentChange} value={content} className="h-48 resize-none w-full border border-gray-300 outline-none  form-orm-textarea rounded-md border-gray-400 p-4 sm:p-8" placeholder="내용을 입력하세요." 
            />
        </div>
    );
}
export default ContentBox;