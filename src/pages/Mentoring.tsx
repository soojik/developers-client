import React, { useEffect, useState } from 'react';
import ShowSchedule from '../components/live/ShowSchedule';
import LiveList from '../components/live/LiveList';

import axios from 'axios';

interface ScheduleProps {
  scheduleId: number;
  mentoringRoomTitle: string;
  mentorName: string;
  menteeName: string;
  startDate: string;
  endDate: string;
};

interface EventProp {
  title: string;
  startDate: Date;
  endDate: Date;
  type: string;
};

const convertScheduleToEvents = (schedules: ScheduleProps[], isMentor: boolean): EventProp[] => {
  const events: EventProp[] = [];

  if (isMentor) {
    schedules.forEach((schedule) => {
      const event: EventProp = {
        title: `${schedule.mentoringRoomTitle} with ${schedule.mentorName}`,
        startDate: new Date(schedule.startDate),
        endDate: new Date(schedule.endDate),
        type: 'mentor'
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
        type: 'mentee'
      };
      events.push(event);
    });
  }

  return events;
}

const memberId = 1;

const Mentoring = () => {
  const [showScheduler, setShowScheduler] = useState(true); // 보여주는 창 변경
  const [mySchedulesAsMentor, setMySchedulesAsMentor] = useState<ScheduleProps[]>([]);
  const [mySchedulesAsMentee, setMySchedulesAsMentee] = useState<ScheduleProps[]>([]);

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
      setMySchedulesAsMentee(res.data['data']);
    })
  }, [])

  const handleClickScheduler = () => {
    setShowScheduler(true);
  };

  const handleClickRoomList = () => {
    setShowScheduler(false);
  }

  return (
    <div className="container mx-auto">
      <div className="flex mt-5 mb-3 justify-center">
        <button
          className={`flex-1 py-2 px-4 border border-blue-500 text-center ${showScheduler ? 'bg-blue-500' : 'bg-blue-300'
            }`}
          onClick={handleClickScheduler}
        >
          일정 관리
        </button>
        <button
          className={`flex-1 py-2 px-4 border border-blue- text-center ${showScheduler ? 'bg-blue-300' : 'bg-blue-500'
            }`}
          onClick={handleClickRoomList}
        >
          전체 방 목록
        </button>
      </div>
      {showScheduler ? (
        <ShowSchedule events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(convertScheduleToEvents(mySchedulesAsMentee, false))} />
      ) : (
        <LiveList events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(convertScheduleToEvents(mySchedulesAsMentee, false))}></LiveList>
      )}
    </div>
  );
}

export default Mentoring;
