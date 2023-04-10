import React, { useState } from 'react';
import Popup from 'components/Live/PopUp';
import MentorProfile from 'components/Live/MentorProfile';
import CalendarPopUp from "components/Live/CalendarPopUp";

const Mentoring = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [showMentorPopup, setShowMentorPopup] = useState(true);

  const handleClose = () => {
    setShowPopup(false);
    setShowMentorPopup(true);
    setShowCalendarPopup(false);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setShowCalendarPopup(false);
    setShowMentorPopup(true);
  };
  const toggleCalendarPopup = () => {
    setShowCalendarPopup(!showCalendarPopup);
  };
  const toggleMentorPopup = () => {
    setShowMentorPopup(!showMentorPopup);
  };
  
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
  return (
    <div>
      <button onClick={togglePopup}>Show Popup</button>
      {showPopup && (
        <Popup>
          {showMentorPopup ? (
            <div className="roomDescription">
              <h2>방 제목</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, ipsum minima soluta iste reiciendis ex, perferendis saepe voluptatem voluptates minus odio deserunt fugiat commodi impedit nemo. Amet neque exercitationem mollitia.</p>
              <MentorProfile imgUrl="https://cdn.pixabay.com/photo/2016/10/09/15/21/business-man-1725976_1280.png" bio="멘토에 대한 소개가 들어가는 페이지" />
              <button onClick={togglePopup}>Cancel</button>
              <button onClick={() => { toggleMentorPopup(); toggleCalendarPopup(); }}>Next</button>
            </div>
          ) : (
            <CalendarPopUp events={events} handleClose={() => { toggleCalendarPopup(); togglePopup(); }} />
          )}
        </Popup>
      )}
    </div>
  );
}

export default Mentoring;
