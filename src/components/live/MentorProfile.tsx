import { useEffect, useState } from 'react';

// MentorProfile.tsx
import React from 'react';

interface MentorProfileProps {
  // imgUrl: string;
  bio: string;
  name: String
  userName: string;
  email: string;
}

const MentorProfile: React.FC<MentorProfileProps> = ({  bio, name,userName, email }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    if (subscribed && !eventSource) {
      const es = new EventSource(`http://localhost:8080/api/listen?mentorName=mentor&userName=mentee&email=${email}`);
      es.addEventListener('push', (e) => {
        new Notification(e.data);
        console.log(e.data);
      });
      setEventSource(es);
    } else if (!subscribed && eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [subscribed, eventSource, name, userName, email]);

  const handleSubscription = async () => {
    const endpoint = subscribed ? `http://localhost:8080/api/unsubscribe?mentorName=mentor&userName=mentee` : `http://localhost:8080/api/subscribe?mentorName=mentor&userName=mentee&email=${email}`;

    const response = await fetch(
      `${endpoint}`,
      {
        method: subscribed ? 'DELETE' : 'POST',
      }
    );
    if (response.ok) {
      setSubscribed(!subscribed);
    }
  };

  // imgUrl,
  return (
    <div className="mentorProfile">
      <div className='flex items-center mb-2'>
        {/* <img className="border border-black rounded" src={imgUrl} alt="Mentor" width={70} height={70}/> */}
        <h3 className="text-xl pb-1">{name}</h3>
        <button 
        className="ml-2 bg-blue-200 hover:bg-blue-300 px-1 py-2 mr-3 rounded"
        onClick={handleSubscription} >{subscribed ? '구독취소' : '구독'}</button>
      </div>
      <h2>멘토 연혁</h2>
      <p>{bio}</p>
    </div>
  );
};

export default MentorProfile;
