import React, { useEffect, useState } from "react";
import Popup from "components/live/PopUp";
import MentorProfile from "components/live/MentorProfile";
import CalendarPopUp from "components/live/CalendarPopUp";
import { Room } from "./RoomList";
import { EventProp, ScheduleProps } from "pages/Mentoring";
import { useRecoilValue } from "recoil";
import { axiosInstance } from "apis/axiosConfig";
import { memberInfoState } from "recoil/userState";

interface ShowMentoringProps {
  mySchedule: EventProp[];
  room: Room;
  handleClose: () => void;
}

const offset = new Date().getTimezoneOffset() * 60000;

const ShowMentoring: React.FC<ShowMentoringProps> = ({
  mySchedule,
  room,
  handleClose,
}) => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false); // 다음 버튼을 누를 때
  const [roomSchedules, setRoomSchedules] = useState<ScheduleProps[]>([]);

  let newSchedule: any[] = [];
  const handleShowSchedule = () => {
    // 방 아이디로 스케쥴 조회
    axiosInstance
      .get(`/api/schedules/${room.mentoringRoomId}`)
      .then((res) => {
        setRoomSchedules(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  if (roomSchedules.length !== 0) {
    newSchedule = roomSchedules.filter(
      // 멘토링 시작 시간이 현재 시간보다 이른 경우 제외
      (roomSchedule) => (
        roomSchedule.startDate > new Date(new Date().getTime() - offset).toISOString()
      ))
      .filter(
        (roomSchedule) => (
          !mySchedule.some(
            (my) =>
              my.startDate.toLocaleString() === new Date(roomSchedule.startDate).toLocaleString()
          )
        ))
  }

  return (
    <div>
      <Popup>
        {!showCalendarPopup ? (
          <div className="mx-4">
            <div className="flex text-sm items-center text-gray-400">제목</div>
            <h2 className="text-2xl pb-1 border-b border-gray-300">
              {room.title}
            </h2>
            <div className="flex text-sm items-center text-gray-400 mt-3">
              소개글
            </div>
            <p className="py-2 border-b border-gray-300 mb-3">
              {room.description}
            </p>
            <div className="flex text-sm items-center text-gray-400 mt-3">
              멘토
            </div>
            <MentorProfile
              roomName={room.title}
              name={room.mentorName}
              bio="멘토에 대한 연혁이 쭉쭉 필요합니다람쥐!"
            />
            {/* imgUrl="https://cdn.pixabay.com/photo/2016/10/09/15/21/business-man-1725976_1280.png" */}
            <div className="flex justify-end">
              <button
                className="bg-slate-200 text-accent-400 px-3 py-2 mr-3 rounded"
                onClick={handleClose}
              >
                닫기
              </button>
              {memberId && (
                <button
                  className="bg-accent-400 text-slate-200 px-3 py-2 rounded"
                  onClick={() => {
                    setShowCalendarPopup(!showCalendarPopup);
                    handleShowSchedule();
                  }}
                >
                  신청
                </button>
              )}
            </div>
          </div>
        ) : (
          <CalendarPopUp
            events={newSchedule}
            handleClose={() => {
              handleClose();
              setShowCalendarPopup(false);
            }}
          />
        )}
      </Popup>
    </div>
  );
};

export default ShowMentoring;
