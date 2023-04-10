import React from 'react';
import Popup from '../../components/Live/PopUp';
import {
  Scheduler,
  WeekView,
  Appointments
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from '@devexpress/dx-react-scheduler';

interface CalendarPopupProps {
  events: any[];
  handleClose: () => void;
}

const CustomAppointment = (props: any) => {
    const handleEventClick = () => {
      if (window.confirm('해당 시간에 입장하시겠습니까?')) {
        alert('입장이 완료되었습니다.');
      }
    };
  
    return (
      <Appointments.Appointment {...props} onClick={handleEventClick} />
    );
  };

const CalendarPopup: React.FC<CalendarPopupProps> = ({ events, handleClose }) => {

  return (
    <Popup>
      <div className="calendarPopup">
        <Scheduler data={events} height={600}>
          <ViewState defaultCurrentDate={new Date()} />
          <WeekView startDayHour={9} endDayHour={22} />
          <Appointments appointmentComponent={CustomAppointment} />
        </Scheduler>
        <button onClick={handleClose}>닫기</button>
      </div>
    </Popup>
  );
};

export default CalendarPopup;
