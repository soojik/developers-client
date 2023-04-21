import React, { useEffect, useState } from "react";
import ShowSchedule from "../components/live/ShowSchedule";
import LiveList from "../components/live/LiveList";
import MentorScheduling from "../components/live/MentorScheduling";
import { useRecoilState, useRecoilValue } from "recoil";
import { subscriptionState } from "../recoil/subscriptionState";
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
          title: `${schedule.mentoringRoomTitle} with ${schedule.mentorName}`,
          startDate: new Date(schedule.startDate),
          endDate: new Date(schedule.endDate),
          type: "mentor",
          mentoringRoomId: schedule.mentoringRoomId,
          scheduleId: schedule.scheduleId,
          owner: schedule.mentorName,
        };
        events.push(event);
        console.log(event);
      });
    } else {
      schedules.forEach((schedule) => {
        const event: EventProp = {
          title: `${schedule.mentoringRoomTitle} with ${schedule.menteeName}`,
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

  const [subscriptions, setSubscriptions] = useRecoilState(subscriptionState);
  const [sse, setSse] = useState<EventSource[]>([]); //sse 상태 추적

  // 구독 정보 가져오는 함수
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!subscriptions.length) {
          const response = await axiosInstance.get(
            `${process.env.REACT_APP_DEV_URL}/subscriptions?userName=${memberInfo.nickname}`
          );
          setSubscriptions(response.data);
        }
      } catch (error) {
        console.error("구독 정보를 가져오는데 실패했습니다:", error);
      }
    };
    fetchSubscriptions();
  }, [memberInfo.nickname, setSubscriptions]);

  // 푸시 알림 받는 로직
  useEffect(() => {
    const eventSources: EventSource[] = [];

    if (!subscriptions.length) {
      subscriptions.forEach((subscription: { mentorName: any }) => {
        const es = new EventSource(
          `${process.env.REACT_APP_DEV_URL}/api/listen?mentorName=${subscription.mentorName}&userName=${memberInfo.nickname}&email=${memberInfo.email}`
        );
        es.addEventListener("push", (e) => {
          new Notification(e.data);
          console.log(e.data);
        });

        eventSources.push(es);
      });

      setSse(eventSources);

      return () => {
        eventSources.forEach((es) => es.close());
      };
    }
  }, [subscriptions, memberInfo.nickname, memberInfo.email]);

  useEffect(() => {
    // API와 통신하여 나의 모든 스케쥴(mySchedule) 가져오고,
    axiosInstance({
      url: `${process.env.REACT_APP_DEV_URL}/api/schedules/mentor/${memberId}`,
      method: "get",
    }).then((res) => {
      setMySchedulesAsMentor(res.data["data"]);
      console.log(res.data["data"]);
    });
    axiosInstance({
      url: `${process.env.REACT_APP_DEV_URL}/api/schedules/mentee/${memberId}`,
      method: "get",
    }).then((res) => {
      // 멘티 일정 처리
      setMySchedulesAsMentee(res.data["data"]);
      console.log(res.data["data"]);
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
      <div className="flex mt-5 mb-3 justify-center">
        <button
          className={`flex-1 py-2 px-4 border text-center w-32 md:w-40 lg:w-32 rounded ${
            currentPage == 1
              ? "bg-accent-300 text-white border-accent-300"
              : "border-accent-300 text-accent-300"
          }`}
          onClick={handleClickScheduler}
        >
          일정 관리
        </button>
        <button
          className={`flex-1 py-2 px-4 border text-center w-32 md:w-40 lg:w-32 rounded ${
            currentPage == 2
              ? "bg-accent-300 text-white border-accent-300"
              : "border-accent-300 text-accent-300"
          }`}
          onClick={handleClickRoomList}
        >
          전체 방 목록
        </button>
        {memberInfo.mentor && (
          <button
            className={`flex-1 py-2 px-4 border text-center w-32 md:w-40 lg:w-32 rounded ${
              currentPage == 3
                ? "bg-accent-300 text-white border-accent-300"
                : "border-accent-300 text-accent-300"
            }`}
            onClick={handleClickMentorSetting}
          >
            멘토 관리
          </button>
        )}
      </div>
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
  );
};

export default Mentoring;
