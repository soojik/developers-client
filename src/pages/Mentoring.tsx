import React, { useEffect, useState } from "react";
import ShowSchedule from "../components/live/ShowSchedule";
import LiveList from "../components/live/LiveList";
import MentorScheduling from "../components/live/MentorScheduling";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { axiosInstance } from "apis/axiosConfig";

export interface ScheduleProps {
  scheduleId: number;
  mentoringRoomTitle: string;
  mentorName: string;
  menteeName: string;
  startDate: string;
  endDate: string;
  mentoringRoomId: number; // 방 id로 조회
}

export interface EventProp {
  title: string;
  startDate: Date;
  endDate: Date;
  type: string;
  mentoringRoomId: number; // 방 id 로 조회
  scheduleId: number; //일정 삭제 필요
  owner: String; // 방 주인 확인
}

const convertScheduleToEvents = (
  schedules: ScheduleProps[],
  isMentor: Boolean
): EventProp[] => {
  const events: EventProp[] = [];

  if (schedules.length) {
    if (isMentor) {
      schedules.forEach((schedule) => {
        const event: EventProp = {
          title: `${schedule.mentoringRoomTitle}`,
          startDate: new Date(schedule.startDate),
          endDate: new Date(schedule.endDate),
          type: "mentor",
          mentoringRoomId: schedule.mentoringRoomId,
          scheduleId: schedule.scheduleId,
          owner: schedule.mentorName,
        };
        events.push(event);
      });
    } else {
      schedules.forEach((schedule) => {
        const event: EventProp = {
          title: `${schedule.mentoringRoomTitle}`,
          startDate: new Date(schedule.startDate),
          endDate: new Date(schedule.endDate),
          type: "mentee",
          mentoringRoomId: schedule.mentoringRoomId,
          scheduleId: schedule.scheduleId,
          owner: schedule.mentorName,
        };
        events.push(event);
      });
    }
  }

  return events;
};

const Mentoring = () => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const [mySchedulesAsMentor, setMySchedulesAsMentor] = useState<
    ScheduleProps[]
  >([]);
  const [mySchedulesAsMentee, setMySchedulesAsMentee] = useState<
    ScheduleProps[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    // API와 통신하여 나의 모든 스케쥴(mySchedule) 가져오고,
    // 비회원의 일정 요청 방지
    if (!isLoggedIn) {
      setMySchedulesAsMentor([]);
      setMySchedulesAsMentee([]);
      return;
    }
    axiosInstance({
      url: `${process.env.REACT_APP_DEV_URL}/api/schedules/mentor/${memberId}`,
      method: "get",
    }).then((res) => {
      setMySchedulesAsMentor(res.data["data"]);
    });
    axiosInstance({
      url: `${process.env.REACT_APP_DEV_URL}/api/schedules/mentee/${memberId}`,
      method: "get",
    }).then((res) => {
      // 멘티 일정 처리
      setMySchedulesAsMentee(res.data["data"]);
    });
  }, []);

  const handleClickScheduler = () => {
    setCurrentPage(1);
  };

  const handleClickRoomList = () => {
    setCurrentPage(2);
  };

  const handleClickMentorSetting = () => {
    setCurrentPage(3);
  };

  return (
    <div className="container mx-auto">
      <div className="flex mt-5 mb-3 justify-center border-b border-gray-200 dark:border-gray-700">
        <nav className="flex w-full space-x-2" aria-label="Tabs" role="tablist">
          <button
            type="button"
            className={`hs-tab-active:font-semibold hs-tab-active:border-blue-900 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-2 border-b-[3px] text-md whitespace-nowrap text-gray-500 hover:text-blue-900 flex-1 justify-center ${
              currentPage === 1
                ? "text-blue-900 border-blue-900"
                : "border-transparent"
            }`}
            id="tabs-with-underline-item-1"
            data-hs-tab="#tabs-with-underline-1"
            aria-controls="tabs-with-underline-1"
            role="tab"
            onClick={() => handleClickScheduler()}
          >
            일정 관리
          </button>
          <button
            type="button"
            className={`hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-2 border-b-[3px] text-md whitespace-nowrap text-gray-500 hover:text-blue-900 flex-1 justify-center ${
              currentPage === 2
                ? "text-blue-900 border-blue-900"
                : "border-transparent"
            }`}
            id="tabs-with-underline-item-2"
            data-hs-tab="#tabs-with-underline-2"
            aria-controls="tabs-with-underline-2"
            role="tab"
            onClick={() => handleClickRoomList()}
          >
            전체 목록
          </button>
          {memberInfo.mentor && (
            <button
              type="button"
              className={`hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-2 border-b-[3px] text-md whitespace-nowrap text-gray-500 hover:text-blue-900 flex-1 justify-center ${
                currentPage === 3
                  ? "text-blue-900 border-blue-900"
                  : "border-transparent"
              }`}
              id="tabs-with-underline-item-3"
              data-hs-tab="#tabs-with-underline-3"
              aria-controls="tabs-with-underline-3"
              role="tab"
              onClick={() => handleClickMentorSetting()}
            >
              멘토 관리
            </button>
          )}
        </nav>
      </div>
      <div>
        {currentPage == 1 && (
          <ShowSchedule
            events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(
              convertScheduleToEvents(mySchedulesAsMentee, false)
            )}
            isMentor={memberInfo.mentor}
          />
        )}

        {currentPage == 2 && (
          <LiveList
            events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(
              convertScheduleToEvents(mySchedulesAsMentee, false)
            )}
          ></LiveList>
        )}
        {currentPage == 3 && (
          <MentorScheduling
            events={convertScheduleToEvents(mySchedulesAsMentor, true).concat(
              convertScheduleToEvents(mySchedulesAsMentee, false)
            )}
          ></MentorScheduling>
        )}
      </div>
    </div>
  );
};

export default Mentoring;
