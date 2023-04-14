import React, { useEffect, useState } from 'react';
import Popup from 'components/live/PopUp';
import MentorProfile from 'components/live/MentorProfile';
import CalendarPopUp from "components/live/CalendarPopUp";
import { Room } from './RoomList';
import { EventProp, ScheduleProps } from 'pages/Mentoring';
import axios from 'axios';

interface ShowMentoringProps {
  mySchedule: EventProp[];
  room: Room;
  handleClose : () => void,
}

const ShowMentoring: React.FC<ShowMentoringProps> = ({mySchedule, room, handleClose}) => {
  const [showCalendarPopup, setShowCalendarPopup] = useState(false); // 다음 버튼을 누를 때
  const [roomSchedules, setRoomSchedules] = useState<ScheduleProps[]>([]);

  let newSchedule: any[] = [];
  const handleShowSchedule = () => {
    const url = `http://localhost:9002/api/schedules/${room.mentoringRoomId}`;
  // 방 아이디로 스케쥴 조회
  axios.get(url)
  .then(res=>{
    setRoomSchedules(res.data.data)
  })
  .catch(err=>console.log(err));
  }

  if(roomSchedules.length !== 0){
    newSchedule = roomSchedules.filter(roomSchedule => 
      !mySchedule.some(my => my.startDate.toString() === roomSchedule.startDate)
    );  
  }

  return (
    <div>
        <Popup>
          {!showCalendarPopup ? (
            <div className="roomDescription">
                <h2 className="text-2xl pb-1 border-b border-gray-300"> {room.title}</h2>
              <p className='py-3'>{room.description}</p>
              <MentorProfile  name={room.mentorName} bio="멘토에 대한 연혁이 쭉쭉 필요합니다람쥐!" />
              {/* imgUrl="https://cdn.pixabay.com/photo/2016/10/09/15/21/business-man-1725976_1280.png" */}
              <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleClose}>닫기</button>
              <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 rounded" onClick={() => {setShowCalendarPopup(!showCalendarPopup); handleShowSchedule()}}>Next</button>
            </div>
          ) : (
            <CalendarPopUp events={newSchedule} handleClose={ handleClose } />
          )}
        </Popup>
    </div>
  );
}

export default ShowMentoring;
