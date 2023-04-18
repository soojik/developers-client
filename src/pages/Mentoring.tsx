import React, { useEffect, useState } from 'react';
import ShowSchedule from '../components/live/ShowSchedule';
import LiveList from '../components/live/LiveList';
import MentorScheduling from '../components/live/MentorScheduling';
import { useRecoilState, useRecoilValue} from 'recoil';
import { subscriptionState } from '../recoil/subscriptionState';
import { memberInfoState } from "recoil/userState";
import { axiosInstance } from "apis/axiosConfig";

import axios from 'axios';

export interface ScheduleProps {
  scheduleId: number;
  mentoringRoomTitle: string;
  mentorName: string;
  menteeName: string;
  startDate: string;
  endDate: string;
  roomId:Number; // 방 id로 조회
};

export interface EventProp {
  title: string;
  startDate: Date;
  endDate: Date;
  type: string;
  roomId: Number; // 방 id 로 조회
  scheduleId:Number; //일정 삭제 필요
  owner: String; // 방 주인 확인
};

/**
 * 테스트를 위한 상태값
 */
const email ="" //테스트 이메일 계정

const convertScheduleToEvents = (schedules: ScheduleProps[], isMentor:Boolean): EventProp[] => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState); 
  const events: EventProp[] = [];
  const [subscriptions, setSubscriptions] = useRecoilState(subscriptionState);
 
  // 구독 정보 가져오는 함수
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_NOTIFY_URL}/subscriptions?userName=${memberInfo.nickname}`);
        setSubscriptions(response.data);
      } catch (error) {
        console.error('구독 정보를 가져오는데 실패했습니다:', error);
      }
    };
    fetchSubscriptions();
  }, [memberInfo.nickname, setSubscriptions]);

  // 푸시 알림 받는 로직
  useEffect(() => {
    const eventSources: EventSource[] = [];

    subscriptions.forEach((subscription: { mentorName: any; }) => {
      const es = new EventSource(`${process.env.REACT_APP_NOTIFY_URL}/api/listen?mentorName=${subscription.mentorName}&userName=${memberInfo.nickname}&email=${email}`);
      es.addEventListener('push', (e) => {
        new Notification(e.data);
        console.log(e.data);
      });

      eventSources.push(es);
    });

    return () => {
      eventSources.forEach((es) => es.close());
    };
  }, [subscriptions, memberInfo.nickname, email]);

  if (memberInfo.mentor) {
    schedules.forEach((schedule) => {
      const event: EventProp = {
        title: `${schedule.mentoringRoomTitle} with ${schedule.mentorName}`,
        startDate: new Date(schedule.startDate),
        endDate: new Date(schedule.endDate),
        type: 'mentor',
        roomId:schedule.roomId,
        scheduleId: schedule.scheduleId,
        owner: schedule.mentorName
      };
      events.push(event);
    });
  }
  else {
    schedules.forEach((schedule) => {
      const event: EventProp = {
        title: `Mentoring with ${schedule.menteeName}`,
        startDate: new Date(schedule.startDate),
        endDate: new Date(schedule.endDate),
        type: 'mentee',
        roomId:schedule.roomId,
        scheduleId: schedule.scheduleId,
        owner: schedule.mentorName
      };
      events.push(event);
    });
  }

  return events;
}

const Mentoring = () => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState); 

  const [mySchedulesAsMentor, setMySchedulesAsMentor] = useState<ScheduleProps[]>([]);
  const [mySchedulesAsMentee, setMySchedulesAsMentee] = useState<ScheduleProps[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sse, setSse] = useState<EventSource | null>(null);

  useEffect(() => {
    // API와 통신하여 나의 모든 스케쥴(mySchedule) 가져오고,
    axiosInstance({
      url: `${process.env.REACT_APP_LIVE_URL}/api/schedules/mentor/${memberId}`,
      method: 'get',
    }).then((res) => {
      setMySchedulesAsMentor(res.data['data']);
    })
    axios({
      url: `${process.env.REACT_APP_LIVE_URL}/api/schedules/mentee/${memberId}`,
      method: 'get',
    }).then((res) => {
      // 멘티 일정 처리
      setMySchedulesAsMentee(res.data['data']);
    })
  }, [])

  const handleClickScheduler = () => {
    setCurrentPage(1);
  };

  const handleClickRoomList = () => {
    setCurrentPage(2);
  }

  const handleClickMentorSetting = () => {
    setCurrentPage(3);
  }

  return (
    <div className="container mx-auto">
      <div className="flex mt-5 mb-3 justify-center">
        <button
          className={`flex-1 py-2 px-4 border text-center ${currentPage == 1 ? 'bg-blue-500 border-blue-500' : 'bg-blue-300'
            }`}
          onClick={handleClickScheduler}
        >
          일정 관리
        </button>
        <button
          className={`flex-1 py-2 px-4 border text-center ${currentPage == 2 ? 'bg-blue-500 border-blue-500' : 'bg-blue-300'
            }`}
          onClick={handleClickRoomList}
        >
          전체 방 목록
        </button>
        {memberInfo.mentor &&
          <button
          className={`flex-1 py-2 px-4 border text-center ${currentPage == 3 ? 'bg-blue-500 border-blue-500' : 'bg-blue-300'
            }`}
            onClick={handleClickMentorSetting}
          >
            멘토 관리
          </button>
        }
      </div>
      {currentPage == 1 && (
        <ShowSchedule events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(convertScheduleToEvents(mySchedulesAsMentee, false))} isMentor={memberInfo.mentor} />
      )}

      {currentPage == 2 && (
        <LiveList events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(convertScheduleToEvents(mySchedulesAsMentee, false))}></LiveList>
      )}

      {currentPage == 3 && (
        <MentorScheduling events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(convertScheduleToEvents(mySchedulesAsMentee, false))}></MentorScheduling>
      )}
    </div>
  );
}

export default Mentoring;
