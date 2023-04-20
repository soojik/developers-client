import { useEffect, useState } from 'react';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { subscriptionState } from '../../recoil/subscriptionState';
import { axiosInstance } from 'apis/axiosConfig';
import { memberInfoState } from "recoil/userState";

interface MentorProfileProps {
  // imgUrl: string;
  bio: string;
  name: String
}

const MentorProfile: React.FC<MentorProfileProps> = ({  bio, name}) => {
  const { memberInfo, memberId } = useRecoilValue(memberInfoState); 
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useRecoilState(subscriptionState);

  const handleSubscription = async () => {
    const endpoint = subscribed 
    ?`${process.env.REACT_APP_DEV_URL}/api/unsubscribe?mentorName=${name}&userName=${memberInfo.nickname}` 
    : `${process.env.REACT_APP_DEV_URL}/api/subscribe?mentorName=${name}&userName=${memberInfo.nickname}&email=${memberInfo.email}`;

    axiosInstance({
      url:`${endpoint}`,
      method: subscribed?'DELETE':'POST'
    })
    .then(()=>{
      setSubscribed(!subscribed);
      setSubscriptions((prevSubscriptions: any[]) => {
        if (subscribed) {
          return prevSubscriptions.filter((sub) => sub.mentorName !== name);
        } else {
          return [
            ...prevSubscriptions, 
            { mentorName:name, userName: memberInfo?.nickname }];
        }
      });
    })
    .catch(err=>console.log(err.data))
  };

  // imgUrl,
  return (
    <div className="mentorProfile">
      <div className='flex items-center mb-2'>
        {/* <img className="border border-black rounded" src={imgUrl} alt="Mentor" width={70} height={70}/> */}
        <h3 className="text-xl pb-1">{name}</h3>
        <button 
        className="ml-2 bg-blue-200 hover:bg-blue-300 px-1 py-2 mr-3 rounded"
        onClick={handleSubscription} >{subscribed ? '구독취소' : '구독'}</button>
      </div>
      <h2>멘토 연혁</h2>
      <p>{bio}</p>
    </div>
  );
};

export default MentorProfile;
