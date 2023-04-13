import React, { useEffect, useState } from 'react';
import ShowSchedule from '../components/live/ShowSchedule';
import LiveList from '../components/live/LiveList';
import MentorScheduling from '../components/live/MentorScheduling';

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
};

const isMentor: boolean = true;

const convertScheduleToEvents = (schedules: ScheduleProps[], isMentor: boolean): EventProp[] => {
  const events: EventProp[] = [];

  if (isMentor) {
    schedules.forEach((schedule) => {
      const event: EventProp = {
        title: `${schedule.mentoringRoomTitle} with ${schedule.mentorName}`,
        startDate: new Date(schedule.startDate),
        endDate: new Date(schedule.endDate),
        type: 'mentor',
        roomId:schedule.roomId
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
        roomId:schedule.roomId
      };
      events.push(event);
    });
  }

  return events;
}

const memberId = 2

const Mentoring = () => {
  const [showScheduler, setShowScheduler] = useState(true); // 보여주는 창 변경
  const [mySchedulesAsMentor, setMySchedulesAsMentor] = useState<ScheduleProps[]>([]);
  const [mySchedulesAsMentee, setMySchedulesAsMentee] = useState<ScheduleProps[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    // API와 통신하여 나의 모든 스케쥴(mySchedule) 가져오고,
    axios({
      url: `http://localhost:9002/api/schedules/mentor/${memberId}`,
      method: 'get'
    }).then((res) => {
      setMySchedulesAsMentor(res.data['data']);
    })
    axios({
      url: `http://localhost:9002/api/schedules/mentee/${memberId}`,
      method: 'get'
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
        {isMentor &&
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
        <ShowSchedule events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(convertScheduleToEvents(mySchedulesAsMentee, false))} />
      )}

      {currentPage == 2 && (
        <LiveList events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(convertScheduleToEvents(mySchedulesAsMentee, false))}></LiveList>
      )}

      {currentPage == 3 && (
        <MentorScheduling></MentorScheduling>
      )}
    </div>
  );
}

export default Mentoring;
