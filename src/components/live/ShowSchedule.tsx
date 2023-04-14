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
  isMentor: boolean
}

interface CancelEventPopupProps {
  handleClose: () => void;
  event: any;
  isMentor: boolean
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

/**
 * 방 입장 테스트
 * @memberName String으로 본인 여부 확인
 */
const memberName = "테스트";

const CancelEventPopup: React.FC<CancelEventPopupProps> = ({ handleClose, event, isMentor }) => {
  const [roomUrls, setRoomUrls ] = useState<{[key:string ]: string}>({});
  // 일정 취소 이벤트
  const handleCancelEvent = async () => {
    if(!isMentor){
      if (window.confirm('해당 시간을 취소하시겠습니까?')) {
        const url = `http://localhost:9002/api/schedules/mentee/${event.scheduleId}`;
        const res = await axios.delete(url);
        if(res.status === 200){
          alert('취소가 완료되었습니다.');
        }
        handleClose();
      }
    }
  }; 
  
  const handleJoinEvent = async () => {
    if(window.confirm('멘토링 룸에 입장하시겠습니까?')){
      const enterUrl = `http://localhost:8080/api/live-session/enter`
      if(isMentor){
        const enterRes = await axios.post(enterUrl, {
          roomName: event.title,
          userName: memberName,
          time:60
        }) //live-session에 등록
        if(enterRes.status===200){ //정상적으로 등록되었을 경우 url 반환
          const enterUrl = `/v1/rooms`
          const createRes = await axios.post(enterUrl,{
            name:event.title.replace(/방제목 with 멘토/g, "roomtitle-with-mentor"),
            privacy:"public",
            properties:{
              nbf: Math.floor(new Date(event.startDate).getTime()/1000),
              exp:Math.floor(new Date(event.endDate).getTime()/1000),
            }
          },{
            headers: {
              "Content-Type": 'application/json',
              Authorization:"Bearer 17885ccd0a16f1c5e4d642075773a775fc45b46b020cfac4023c3fb88f7aba01" // 이 부분은 바꿔야 할 필요성이 있음
            },
          })
          if(createRes.status === 200){ //url 반환되면 사용자 자동 연결
            alert("방에 입장하셨습니다");
            setRoomUrls(prevRoomUrls => ({...prevRoomUrls, [event.title]: createRes.data.url}));
            console.log(createRes)
            // window.open(createRes.data.url, "_blank");
          }
        }
        handleClose();
      }else{
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
          window.open(roomUrls[event.title], "_blank")
          alert("입장 성공하였습니다");
          handleClose();
        }else{
          alert("멘토가 아직 입장하지 않았습니다");
          handleClose();
        }
      }
    }
  }

  return (
    <Popup>
      <div className="cancelEventPopup">
        <h2><strong>{event.title}</strong></h2>
        {isMentor ? (
          <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleJoinEvent}>입장하기</button>
        ) : (
          roomUrls[event.title] ? (
            <div>
              <h4>{roomUrls[event.title]}</h4>
              <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleJoinEvent}>입장하기</button>
            </div>
          ) : (
            <h4>방 입장이 불가능합니다</h4>
          )
        )}
        {!isMentor && (
          <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleCancelEvent}>취소하기</button>
        )}
        <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleClose}>닫기</button>
      </div>
    </Popup>
  );
};

const ShowSchedule: React.FC<CalendarProps> = ({ events, isMentor }) => {
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
        <CancelEventPopup event={selectedEvent} handleClose={handleClosePopup} isMentor={isMentor}/>
      )}
    </div>
  );
};

export default ShowSchedule;
