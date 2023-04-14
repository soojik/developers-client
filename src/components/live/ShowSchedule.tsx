import React, { useEffect, useState } from 'react';
import Popup from './PopUp';
import axios from 'axios';
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator,
  Resources
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from '@devexpress/dx-react-scheduler';

interface CalendarProps {
  events: any[];
}

interface CancelEventPopupProps {
  handleClose: () => void;
  event: any;
}

const resources = [{
  fieldName: 'type',
  title: 'Type',
  instances: [
      { id: 'mentor', text: 'as mentor', color: '#EC407A' },
      { id: 'mentee', text: 'as mentee', color: '#7E57C2' },
  ],
}];

const CustomAppointment = (props: any) => {
  const handleEventClick = () => {
    props.onClick(props.data);
  };

  return (
    <Appointments.Appointment {...props} onClick={handleEventClick} />
  );
};

const CancelEventPopup: React.FC<CancelEventPopupProps> = ({ handleClose, event }) => {
  // 일정 취소 이벤트
  const handleCancelEvent = async () => {
    if (window.confirm('해당 시간을 취소하시겠습니까?')) {
      const url = `http://localhost:9002/api/schedules/mentee/${event.scheduleId}`;
      const res = await axios.delete(url);
      if(res.status === 200){
        alert('취소가 완료되었습니다.');
      }
      handleClose();
    }
  }; 
  // 방 입장 이벤트
  const handleJoinEvent = async () => {
    // 멘토링 룸 입장 시 세션이 만들어져있는지 확인(멘토 우선 입장)
    // 멘토 입장 시 dailyco 와 세션 저장
    // 멘티 입장 시 dailyco url 반환 및 세션 저장2
    if(window.confirm('멘토링 룸에 입장하시겠습니까?')){
      const sessionUrl = `http://localhost:8080/api/live-session/list`;
      const lives = await axios.get(sessionUrl);
      if(lives.status === 400){
        alert("멘토가 아직 입장하지 않았습니다");
        handleClose();
      }
      
      const sessionRooms = JSON.parse(lives.data.data)
      const sessionRoomsArray = Object.keys(sessionRooms);
      console.log(sessionRoomsArray)
      if(sessionRoomsArray.includes(event.title)){
        alert("멘티 입장 성공");
        handleClose();
      }else{
        alert("멘토가 아직 입장하지 않았습니다");
        handleClose();
      }
    }
  }

  return (
    <Popup>
      <div className="cancelEventPopup">
        <h2><strong>{event.title}</strong></h2>
        <div>
          <button  className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleJoinEvent}>입장하기</button>
          <button  className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleCancelEvent}>취소하기</button>
        </div>
        <button  className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleClose}>닫기</button>
      </div>
    </Popup>
  );
};

const ShowSchedule: React.FC<CalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCancelEventPopup, setShowCancelEventPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const currentDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowCancelEventPopup(true);
  };

  const handleClosePopup = () => {
    setShowCancelEventPopup(false);
  };

  return (
    <div className="calendar">
      <Scheduler data={events} height={window.innerHeight-250}>
        <ViewState currentDate={currentDate} onCurrentDateChange={currentDateChange} />
        <WeekView startDayHour={7} endDayHour={23} cellDuration={60} />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments appointmentComponent={(props) => <CustomAppointment {...props} onClick={handleEventClick} />} />
        <Resources
                                data={resources}
                            />
      </Scheduler>
      {showCancelEventPopup && (
        <CancelEventPopup event={selectedEvent} handleClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ShowSchedule;
