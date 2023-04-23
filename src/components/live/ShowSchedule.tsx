import React, { useEffect, useState } from "react";
import Popup from "./PopUp";
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";

interface CalendarProps {
  events: any[];
  isMentor: boolean;
}

interface CancelEventPopupProps {
  handleClose: () => void;
  event: any;
  isMentor: boolean;
}

const resources = [
  {
    fieldName: "type",
    title: "Type",
    instances: [
      { id: "mentor", text: "as mentor", color: "#EC407A" },
      { id: "mentee", text: "as mentee", color: "#7E57C2" },
    ],
  },
];

const CustomAppointment = (props: any) => {
  const handleEventClick = () => {
    props.onClick(props.data);
  };

  return <Appointments.Appointment {...props} onClick={handleEventClick} />;
};

const CancelEventPopup: React.FC<CancelEventPopupProps> = ({
  handleClose,
  event,
  isMentor,
}) => {
  const { memberInfo, memberId } = useRecoilValue(memberInfoState);
  const [roomUrls, setRoomUrls] = useState<{ [key: string]: string }>({}); // 방과 url 매핑

  useEffect(() => {
    const fetchRoomUrls = async () => {
      try {
        const res = await axiosInstance.get(
          `${process.env.REACT_APP_DEV_URL}/api/live-session/list`
        );
        const sessionData = res.data;
        const parsedData: { [key: string]: string } = Object.entries(
          sessionData
        ).reduce((acc, [roomName, url]) => {
          acc[roomName] = url as string;
          return acc;
        }, {} as { [key: string]: string });
        setRoomUrls(JSON.parse(parsedData.urls));
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoomUrls();
  }, []);

  // 일정 취소 이벤트
  const handleCancelEvent = async () => {
    if (!isMentor) {
      if (window.confirm("해당 시간을 취소하시겠습니까?")) {
        const res = await axiosInstance.delete(
          `${process.env.REACT_APP_DEV_URL}/api/schedules/mentee/${event.scheduleId}`
        );
        if (res.status === 200) {
          alert("취소가 완료되었습니다.");
          handleClose();
        } else {
          alert(res.data.msg);
        }
      }
    }
  };

  const handleJoinEvent = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_DEV_URL}/api/live-session/enter`,
        {
          roomName: event.title,
          userName: event.owner,
          userId: memberId,
          time: 60,
          scheduleId: event.scheduleId,
        }
      );
      if (res.status === 200) {
        if (!Object.keys(roomUrls).includes(event.title)) {
          setRoomUrls((prevRoomUrls) => ({
            ...prevRoomUrls,
            [event.title]: res.data.url,
          }));
        }
        window.open(res.data.url, "_blank");
        handleClose();
      } else {
        alert("멘토가 아직 방을 만들지 않았습니다!");
        handleClose();
      }
    } catch (err) {
      alert("멘토가 아직 방을 만들지 않았습니다!");
      handleClose();
      console.log(err);
    }
  };

  const handleRemoveEvent = async () => {
    try {
      const removeUrl = Object.keys(roomUrls).filter(
        (el) => el === event.title
      );
      axiosInstance
        .delete(`${process.env.REACT_APP_DEV_URL}/api/live-session/exit`, {
          data: {
            roomName: event.title,
            roomUUID: roomUrls[removeUrl[0]].split("daily.co/")[1],
            userId: memberId,
            scheduleId: event.scheduleId,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            alert("방을 종료했습니다.");
            handleClose();
          } else {
            alert("오류가 발생했습니다. 다시 시도해주세요.");
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Popup>
      <div className="cancelEventPopup">
        <h2>
          <strong>{event.title}</strong>
        </h2>
        <button
          className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded"
          onClick={handleJoinEvent}
        >
          입장하기
        </button>
        {isMentor && (
          <button
            className="bg-red-200 hover:bg-red-300 px-3 py-2 mr-3 rounded"
            onClick={handleRemoveEvent}
          >
            종료하기
          </button>
        )}
        {!isMentor && (
          <button
            className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded"
            onClick={handleCancelEvent}
          >
            취소하기
          </button>
        )}
        <button
          className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded"
          onClick={handleClose}
        >
          닫기
        </button>
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
    window.location.reload();
  };

  return (
    <div className="calendar">
      <Scheduler data={events} height={window.innerHeight - 250}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={currentDateChange}
        />
        <WeekView startDayHour={7} endDayHour={23} cellDuration={60} />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments
          appointmentComponent={(props) => (
            <CustomAppointment {...props} onClick={handleEventClick} />
          )}
        />
        <Resources data={resources} />
      </Scheduler>
      {showCancelEventPopup && (
        <CancelEventPopup
          event={selectedEvent}
          handleClose={handleClosePopup}
          isMentor={isMentor}
        />
      )}
    </div>
  );
};

export default ShowSchedule;
