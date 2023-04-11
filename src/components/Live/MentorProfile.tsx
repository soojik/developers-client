// MentorProfile.tsx
import React from 'react';

interface MentorProfileProps {
  imgUrl: string;
  bio: string;
}

const MentorProfile: React.FC<MentorProfileProps> = ({ imgUrl, bio }) => {
  return (
    <div className="mentorProfile">
      <div className='flex items-center'>
        <img className="border border-black rounded" src={imgUrl} alt="Mentor" width={70} height={70}/>
        <button className="ml-2 bg-blue-200 hover:bg-blue-300 px-1 py-2 mr-3 rounded" >Subscribe</button>
      </div>
      <h3 className="text-xl pb-1 border-b border-gray-300">김 멘토</h3>
      <h2>멘토 연혁</h2>
      <p>{bio}</p>
    </div>
  );
};

export default MentorProfile;
