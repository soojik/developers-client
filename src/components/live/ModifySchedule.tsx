import { useState, useEffect } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { TextField, Grid } from "@mui/material";
import {
    Scheduler,
    WeekView,
    Appointments,
    Toolbar,
    TodayButton,
    AppointmentTooltip,
    Resources,
    DateNavigator
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from '@devexpress/dx-react-scheduler';
import Popup from "./PopUp";
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { Room } from "./RoomList";
import { EventProp } from "pages/Mentoring";

interface CalendarProps {
    onClose: () => void;
    room: Room;
    events: EventProp[];
};

interface CancelEventPopupProps {
    handleClose: () => void;
    event: any;
}


const allTimeSlots = [
    '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'
];

const resources = [{
    fieldName: 'type',
    title: 'Type',
    instances: [
        { id: 'mentor', text: 'as mentor', color: '#EC407A' },
        { id: 'mentee', text: 'as mentee', color: '#7E57C2' },
    ],
}];

const today: Date = new Date();
const maxDate: Date = new Date(today.setDate(today.getDate() + 6) - (today.getTimezoneOffset() * 60000));

const ModifySchedule: React.FC<CalendarProps> = ({ onClose, room, events }) => {
    const { memberId, isLoggedIn } = useRecoilValue(memberInfoState);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showCancelEventPopup, setShowCancelEventPopup] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(allTimeSlots);

    useEffect(() => {
        if (selectedDate) {
            // 예약 가능한 시간대 계산
            const reservedTimes = events
                .filter((event) => new Date(event.startDate).toDateString() === selectedDate.toDateString())
                .map((event) => new Date(event.startDate).getHours().toString());
            const availableTimes = allTimeSlots.filter(
                (time) => !reservedTimes.includes(time)
            );
            setAvailableTimeSlots(availableTimes);
        }
    }, [selectedDate, events]);

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setShowCancelEventPopup(true);
    };

    const handleClosePopup = () => {
        setShowCancelEventPopup(false);
    };

    const CustomAppointment = (props: any) => {
        const handleEventClick = () => {
            props.onClick(props.data);
        };

        return (
            <Appointments.Appointment {...props} onClick={handleEventClick} />
        );
    };

    const CancelEventPopup: React.FC<CancelEventPopupProps> = ({ handleClose, event }) => {
        const handleCancelEvent = () => {
            if (window.confirm('해당 시간을 취소하시겠습니까?')) {
                console.log("event", event);
                axiosInstance({
                    url: `${process.env.REACT_APP_DEV_URL}/api/schedules/mentor/${event.scheduleId}`,
                    method: 'delete'
                }).then((res) => {
                    console.log(res.data);
                    alert(res.data.msg)
                    if (res.status === 200) {
                        handleClose();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        };

        return (
            <div>
                {event.mentoringRoomId === room.mentoringRoomId ? (
                    <Popup>
                        <div className="cancelEventPopup">
                            <h2>{event.title}</h2>
                            <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleCancelEvent}>취소하기</button>
                            <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleClose}>닫기</button>
                        </div>
                    </Popup>
                ) : (
                    <Popup>
                        <div className="text-center">
                            <h2>해당 일정은 '{event.title}' 일정관리 창에서 수정하실 수 있습니다.</h2>
                            <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleClose}>닫기</button>
                        </div>
                    </Popup>
                )}
            </div>
        );
    };


    // 예약 가능한 시간대 버튼을 동적으로 생성해주는 함수
    const renderTimeSlotButtons = () => {
        if (availableTimeSlots.length === 0) {
            return <div>No available time slots</div>;
        }

        return availableTimeSlots.map((timeSlot, index) => (
            <Grid item key={index}>
                <button type="button" className="bg-slate-300 border border-accent-500 text-accent-500 px-3 py-2 rounded-md" onClick={() => handleSelectTimeSlot(timeSlot)}>
                    {timeSlot}:00
                </button>
            </Grid>
        ));
    };

    // 예약 가능한 시간대 버튼을 클릭했을 때의 동작
    const handleSelectTimeSlot = (timeSlot: string) => {
        if (selectedDate) {
            if (window.confirm(`${timeSlot}:00 에 멘토링 일정을 추가하시겠습니까?`)) {
                // UTC 시간대로 맞춰주기
                selectedDate.setHours(parseInt(timeSlot));
                const startAt: Date = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
                selectedDate.setHours(parseInt(timeSlot) + 1);
                const endAt: Date = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
                axiosInstance({
                    url: `${process.env.REACT_APP_DEV_URL}/api/schedules`,
                    method: 'post',
                    data: {
                        mentoringRoomId: room.mentoringRoomId,
                        mentorName: room.mentorName,
                        mentorId: memberId,
                        start: startAt,
                        end: endAt
                    }
                }).then((res) => {
                    console.log(`Selected time: ${selectedDate}`);
                    console.log(res);
                    onClose();
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    };

    return (
        <div>
            <div>
                <h2 className="text-lg font-bold mb-4">방 수정</h2>
                <h3 className="italic mb-4">멘토링 일정을 추가해주세요 (한시간 단위)</h3>
                <div>
                    <Scheduler data={events} height={400}>
                        <ViewState defaultCurrentDate={new Date()} />
                        <WeekView startDayHour={7} endDayHour={23} />
                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments appointmentComponent={(props) => <CustomAppointment {...props} onClick={handleEventClick} />} />
                        <AppointmentTooltip />
                        <Resources
                            data={resources} />
                    </Scheduler>
                </div>
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-1/3 px-4 mt-4">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Controlled picker"
                                value={selectedDate}
                                onChange={(newValue: any) => setSelectedDate(newValue)}
                                renderInput={(params: any) => <TextField {...params} />}
                                minDate={new Date()}
                                maxDate={maxDate} />
                        </LocalizationProvider>
                    </div>
                    <div className="w-full md:w-2/3 px-4 mt-4">
                        <Grid container spacing={2}>
                            {renderTimeSlotButtons()}
                        </Grid>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <button type="button" className="bg-accent-400 text-slate-200 px-3 py-2 mr-2 rounded" onClick={onClose}>
                    완료
                </button>
                {showCancelEventPopup && (
                    <CancelEventPopup event={selectedEvent} handleClose={handleClosePopup} />
                )}
            </div>
        </div>
    );
}

export default ModifySchedule;
