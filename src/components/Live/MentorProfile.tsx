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
        <img src={imgUrl} alt="Mentor" width={70} height={70}/>
        <button>Subscribe</button>
      </div>
      <h2>멘토 연혁</h2>
      <p>{bio}</p>
    </div>
  );
};

export default MentorProfile;
