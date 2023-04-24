import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { subscriptionState } from "../../recoil/subscriptionState";
import { axiosInstance } from "apis/axiosConfig";
import { memberInfoState } from "recoil/userState";

interface MentorProfileProps {
  bio: string;
  name: string;
  roomName: string;
}

export interface Subscription {
  mentorName: string;
  userName: string;
  email: string;
  roomName: string;
}

const MentorProfile: React.FC<MentorProfileProps> = ({
  bio,
  name,
  roomName,
}) => {
  const { memberInfo, memberId } = useRecoilValue(memberInfoState);
  // const [subscriptions, setSubscriptions] = useRecoilState(subscriptionState);
  const isSelf = memberInfo.nickname === name; // 본인 구독 불가

  // useEffect(() => {
  //   setSubscribed(
  //     subscriptions.some(
  //       (subscription: Subscription) => subscription.mentorName === name
  //     )
  //   );
  // }, [subscriptions]);

  // 구독 여부를 확인하는 변수를 생성하고 recoil에서 구독 목록(subscriptions)에 따라 값을 설정
  // const [subscribed, setSubscribed] = useState(() => {
  //   return subscriptions.some(
  //     (subscription: Subscription) => subscription.mentorName === name
  //   );
  // });

  // 이벤트 처리 함수를 수정하여 구독 및 구독 취소 시 엔드포인트가 정확하게 변경되도록 함
  // const handleSubscription = async () => {
  //   if (isSelf) {
  //     return;
  //   }

  //   // 일반 푸시 엔드포인트
  //   const endpoint = subscribed ? `/api/unsubscribe` : `/api/subscribe`;

  //   const notifybody = subscribed
  //     ? {
  //         mentorName: name,
  //         userName: memberInfo.nickname,
  //         roomName,
  //       }
  //     : {
  //         mentorName: name,
  //         userName: memberInfo.nickname,
  //         email: memberInfo.email,
  //         roomName,
  //       };

  //   // 일반 푸시 알림 요청
  //   axiosInstance({
  //     url: `${endpoint}`,
  //     data: notifybody,
  //     method: subscribed ? "DELETE" : "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       setSubscriptions(res.data.subscriptions);
  //       setSubscribed(!subscribed);
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <div className="mentorProfile">
      <div className="flex items-center mb-2">
        {/* <img className="border border-black rounded" src={imgUrl} alt="Mentor" width={70} height={70}/> */}
        <h3 className="text-xl pb-1">{name}</h3>
        <button
          className="bg-accent-400 text-slate-200 px-3 py-2 mx-2 rounded"
          // onClick={handleSubscription}
        >
          {/* {subscribed ? "구독취소" : "구독"} */}
          구독
        </button>
      </div>
      {/* <h2>멘토 연혁</h2>
      <p>{bio}</p> */}
    </div>
  );
};

export default MentorProfile;
