// MentorProfile.tsx
import React from 'react';

interface MentorProfileProps {
  // imgUrl: string;
  bio: string;
  name: String
}

const MentorProfile: React.FC<MentorProfileProps> = ({  bio, name }) => {
  // imgUrl,
  return (
    <div className="mentorProfile">
      <div className='flex items-center mb-2'>
        {/* <img className="border border-black rounded" src={imgUrl} alt="Mentor" width={70} height={70}/> */}
        <h3 className="text-xl pb-1">{name}</h3>
        <button className="ml-2 bg-blue-200 hover:bg-blue-300 px-1 py-2 mr-3 rounded" >Subscribe</button>
      </div>
      <h2>멘토 연혁</h2>
      <p>{bio}</p>
    </div>
  );
};

export default MentorProfile;
