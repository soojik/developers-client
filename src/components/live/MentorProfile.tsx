import { useEffect, useState } from "react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { subscriptionState } from "../../recoil/subscriptionState";
import { axiosInstance } from "apis/axiosConfig";
import { memberInfoState } from "recoil/userState";

interface MentorProfileProps {
  // imgUrl: string;
  bio: string;
  name: string;
  roomName: string;
  startTime: string;
}

const MentorProfile: React.FC<MentorProfileProps> = ({
  bio,
  name,
  roomName,
  startTime,
}) => {
  const { memberInfo, memberId } = useRecoilValue(memberInfoState);
  const [mentors, setMentors] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useRecoilState(subscriptionState);
  const isSelf = memberInfo.nickname === name; // 본인 구독 불가

  const subscribed = mentors.includes(name); // 멘토 여부 판별

  // 중복 여부 판별
  const isMentorExists = (mentorName: string) => {
    if (Array.isArray(mentors)) {
      return mentors.some((name) => name === mentorName);
    }
    return false;
  };

  // 서버에서 구독 목록을 가져와 사용자가 이미 구독한 멘토인지 확인하고 구독 상태를 설정
  useEffect(() => {
    const getSub = async () => {
      await axiosInstance
        .get(
          `${process.env.REACT_APP_DEV_URL}/api/subscriptions?userName=${memberInfo.nickname}`
        )
        .then((res) => {
          for (let subscribe of subscriptions) {
            setMentors(subscribe.mentorName);
          }
        })
        .catch((err) => console.log(err.data));
    };

    getSub();
  });

  const handleSubscription = async () => {
    if (isSelf) {
      return;
    }

    const endpoint = subscribed
      ? `${process.env.REACT_APP_DEV_URL}/api/unsubscribe`
      : `${process.env.REACT_APP_DEV_URL}/api/subscribe`;

    const scheduleEndopint = subscribed
      ? `${process.env.REACT_APP_DEV_URL}/api/unsubscribe/schedule`
      : `${process.env.REACT_APP_DEV_URL}/api/subscribe/schedule`;

    const notifybody = subscribed
      ? {
          mentorName: name,
          userName: memberInfo.nickname,
        }
      : {
          mentorName: name,
          userName: memberInfo.nickname,
          email: memberInfo.email,
        };

    const scheduleNotifyBody = subscribed
      ? {
          mentorName: name,
          userName: memberInfo.nickname,
          roomName: roomName,
        }
      : {
          mentorName: name,
          userName: memberInfo.nickname,
          email: memberInfo.email,
          roomName: roomName,
          startTime: startTime,
        };

    if (isMentorExists(name) && subscribed) {
      alert("이미 구독한 멘토입니다.");
      return;
    }

    // 일반 푸시
    axiosInstance({
      url: `${endpoint}`,
      data: notifybody,
      method: subscribed ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (subscribed) {
          setMentors(mentors.filter((el) => el !== name));
        } else {
          if (!isMentorExists(name)) {
            setMentors([...mentors, name]);
          }
        }
        setSubscriptions(res.data);
      })
      .catch((err) => console.log(err));

    //스케쥴 푸시
    axiosInstance({
      url: `${scheduleEndopint}`,
      data: scheduleNotifyBody,
      method: subscribed ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (subscribed) {
          setMentors(mentors.filter((el) => el !== name));
        } else {
          if (!isMentorExists(name)) {
            setMentors([...mentors, name]);
          }
        }
        setSubscriptions(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mentorProfile">
      <div className="flex items-center mb-2">
        {/* <img className="border border-black rounded" src={imgUrl} alt="Mentor" width={70} height={70}/> */}
        <h3 className="text-xl pb-1">{name}</h3>
        <button
          className="bg-accent-400 text-slate-200 px-3 py-2 mx-2 rounded"
          onClick={handleSubscription}
        >
          {subscribed ? "구독취소" : "구독"}
        </button>
      </div>
      {/* <h2>멘토 연혁</h2>
      <p>{bio}</p> */}
    </div>
  );
};

export default MentorProfile;
