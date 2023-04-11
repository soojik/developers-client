import React, { useState } from 'react';

import Paper from '@mui/material/Paper';
import {
    Scheduler,
    WeekView,
    Appointments
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from '@devexpress/dx-react-scheduler';

interface CreateScheduleModalProps {
    onClose: () => void;
}

interface Schedule {
    start: Date;
    end: Date;
}

const CustomAppointment: React.FC = (props: any) => {
    const handleEventClick = () => {
        if (window.confirm('해당 시간에 추가하시겠습니까?')) {
            alert('스케줄이 완료되었습니다.');
        }
    };

    return (
        <Appointments.Appointment {...props} onClick={handleEventClick} />
    );
};

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({ onClose }) => {
    const [schedule, setSchedule] = useState<Schedule>({ start: new Date(), end: new Date() });

    const events = [
        {
            title: '예약 가능한 시간',
            startDate: new Date(),
            endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        },
        {
            title: '예약 가능한 시간',
            startDate: new Date(new Date().setHours(new Date().getHours() + 2)),
            endDate: new Date(new Date().setHours(new Date().getHours() + 3)),
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(schedule);
        // 날짜 데이터 axios
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchedule(prev => ({ ...prev, [name]: value }));
    };

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setSchedule(prev => ({ ...prev, start: date }));
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setSchedule(prev => ({ ...prev, end: date }));
        }
    };

    return (
        <Paper>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4">방 생성</h2>
                        <form>
                            <div className="calendar">
                                <Scheduler data={events} height={600}>
                                    <ViewState defaultCurrentDate={new Date()} />
                                    <WeekView startDayHour={9} endDayHour={22} />
                                    <Appointments appointmentComponent={CustomAppointment} />
                                </Scheduler>
                                <div className="flex justify-end">
                                    <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={(e) => handleSubmit}>
                                        완료
                                    </button>
                                    <button type="button" className="mr-4" onClick={onClose}>
                                        취소
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Paper>
    )
}

export default CreateScheduleModal;
