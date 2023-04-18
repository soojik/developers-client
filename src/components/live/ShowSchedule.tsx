import React, { useEffect, useState } from 'react';
import Popup from './PopUp';
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
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";

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

const CancelEventPopup: React.FC<CancelEventPopupProps> = ({ handleClose, event, isMentor }) => {
  const { memberInfo, memberId } = useRecoilValue(memberInfoState); 
  const [roomUrls, setRoomUrls ] = useState<{[key:string ]: string}>({});
  // 일정 취소 이벤트
  const handleCancelEvent = async () => {
    if(!isMentor){
      if (window.confirm('해당 시간을 취소하시겠습니까?')) {
        const res = await axiosInstance.delete(`${process.env.REACT_APP_LIVE_URL}/api/schedules/mentee/${event.scheduleId}`);
        if(res.status === 200){
          alert('취소가 완료되었습니다.');
        }
        handleClose();
      }
    }
  }; 
  
  const handleJoinEvent = async () => {
    // 전체 방 리스트 조회
    const lives = await axiosInstance.get(`${process.env.REACT_APP_LIVE_URL}/api/live-session/list`,{
      validateStatus: function (status) {
        return status <= 500; // 상태 코드가 500 미만인 경우에만 해결
      }
    });
    // 방 리스트의 데이터가 있다면 무조건 조회
    if(window.confirm('멘토링 룸에 입장하시겠습니까?')){
      if(lives.status === 400){
        // 방이 없는데 멘토면?
        if(isMentor){
            // 방 생성 로직
          const enterRes = await axiosInstance.post(`${process.env.REACT_APP_LIVE_URL}/api/live-session/enter`, {
            roomName: event.title,
            userName: event.owner,
            userId:memberInfo.memberId,
            time:60,
            scheduleId:event.scheduleId
          },
          {
            validateStatus: function (status) {
              return status <= 500; // 상태 코드가 500 미만인 경우에만 해결
            }
          }) //live-session에 등록
          console.log(enterRes.data)
          if(enterRes.status===200){ //정상적으로 등록되었을 경우 url 반환
            const createRes = await axiosInstance.post(`${process.env.REACT_APP_LIVE_URL}/api/dailyco`,{
              scheduleId:event.scheduleId,
              userId:memberInfo.memberId,
              privacy:"public",
              properties:{
                // nbf: Math.floor(new Date(event.startDate).getTime()/1000),
                // exp:Math.floor(new Date(event.endDate).getTime()/1000),
              }
            },
            {
              validateStatus: function (status) {
                return status <= 500; // 상태 코드가 500 미만인 경우에만 해결
              }
            })
            if(createRes.status === 200){ //url 반환되면 사용자 자동 연결
              alert("방에 입장하셨습니다");
              setRoomUrls(prevRoomUrls => ({...prevRoomUrls, [event.title]: createRes.data.data.url}));
              console.log(createRes.data.data.url)
              window.open(createRes.data.data.url,"_blank");
            }
          }
          handleClose();
          }else{
            // 방이 없는데 멘토가 아니라면?
              alert("멘토가 아직 방을 만들지 않았습니다!");
              handleClose();
          }
      }else if(lives.status===200){
        // 방 리스트의 데이터가 있다면 변환
        const sessionRooms = JSON.parse(lives.data.data)
        const sessionRoomsArray = Object.keys(sessionRooms);
        // 방이 있다면?
        if(sessionRoomsArray.includes(event.title)){
          window.open(roomUrls[event.title], "_blank")
          alert("입장 성공하였습니다");
          handleClose();
        }
      }else{
        console.log(lives)
        const err = `${lives.status}:${lives.data.msg}`
        console.log(err)
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
