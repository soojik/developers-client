import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Nav from "components/Nav";
import Layout from "components/Layout";
import Login from "pages/Login";
import SignUp from "pages/SignUp";
import Mentoring from "pages/Mentoring";
import Problem from "pages/Problem";
import MyPage from "pages/MyPage";
import ProblemRegister from "pages/ProblemRegister";
import ProblemSolved from "pages/ProblemSolved";

// 알림 때문에 추가
import { useRecoilValue, useResetRecoilState } from "recoil";
import { subscriptionState } from "./recoil/subscriptionState";
import { scheduleSubscriptionState } from "./recoil/scheduleSubscriptionState";
import { memberInfoState } from "recoil/userState";
import { ToastContainer, toast } from "react-toastify";
import { Subscription } from "./components/live/MentorProfile";
import { ScheduleSubscriptions } from "./components/live/CalendarPopUp";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const subscriptions = useRecoilValue(subscriptionState);
  const scheduleSubscriptions = useRecoilValue(scheduleSubscriptionState);
  const { memberInfo } = useRecoilValue(memberInfoState);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (
      JSON.stringify(memberInfo) !== "{}" &&
      !Object.keys(memberInfo).includes("undefined" || "null") &&
      !Object.values(memberInfo).includes("undefined" || "null") &&
      subscriptions.length > 0
    ) {
      const eventSources = subscriptions
        .map((subscription: Subscription) => {
          const pushUrl = `${process.env.REACT_APP_DEV_URL}/api/listen?mentorName=${subscription.mentorName}&userName=${memberInfo.nickname}&email=${memberInfo.email}`;

          const pushEs = new EventSource(pushUrl);

          pushEs.addEventListener("push", (e) => {
            // 여기서 알림을 생성합니다.
            toast(e.data);
            console.log(e.data);
          });

          pushEs.addEventListener("error", (e) => {
            console.log(e);
            if (retryCount < 3) {
              setRetryCount(retryCount + 1);
              setTimeout(() => {
                pushEs.close();
              }, 1000 * 10); // 10초 후에 재연결 시도
            } else {
              // 재시도가 3번 실패한 경우, 1시간 후에 재연결 시도
              setTimeout(() => {
                pushEs.close();
                setRetryCount(0);
              }, 1000 * 60 * 60);
            }
          });

          return [pushEs];
        })
        .flat();

      // 컴포넌트가 언마운트될 때 이벤트 소싱 요청들을 닫습니다.
      return () => {
        eventSources.forEach((es: { close: () => any }) => es.close());
      };
    }
  }, [subscriptions, memberInfo]);

  useEffect(() => {
    if (
      JSON.stringify(memberInfo) !== "{}" &&
      !Object.keys(memberInfo).includes("undefined" || "null") &&
      !Object.values(memberInfo).includes("undefined" || "null") &&
      scheduleSubscriptions.length > 0
    ) {
      const eventSources = scheduleSubscriptions
        .map((scheduleSubscriptions: ScheduleSubscriptions) => {
          const scheduleUrl = `${process.env.REACT_APP_DEV_URL}/api/listen/schedule?mentorName=${scheduleSubscriptions.mentorName}&userName=${memberInfo.nickname}&email=${memberInfo.email}&time=${scheduleSubscriptions.startTime}&roomName=${scheduleSubscriptions.roomName}`;

          const scheduleEs = new EventSource(scheduleUrl);

          scheduleEs.addEventListener("schedule", (e) => {
            // 여기서 알림을 생성합니다.
            toast(e.data);
            console.log(e.data);
          });

          scheduleEs.addEventListener("error", (e) => {
            console.log(e);
            if (retryCount < 3) {
              setRetryCount(retryCount + 1);
              setTimeout(() => {
                scheduleEs.close();
              }, 1000 * 10); // 10초 후에 재연결 시도
            } else {
              // 재시도가 3번 실패한 경우, 1시간 후에 재연결 시도
              setTimeout(() => {
                scheduleEs.close();
                setRetryCount(0);
              }, 1000 * 60 * 60);
            }
          });

          return [scheduleEs];
        })
        .flat();

      // 컴포넌트가 언마운트될 때 이벤트 소싱 요청들을 닫습니다.
      return () => {
        eventSources.forEach((es: { close: () => any }) => es.close());
      };
    }
  }, [scheduleSubscriptions, memberInfo]);

  // 모든 subscriptions와 scheduleSubscriptions 삭제
  const resetSubscriptions = () => {
    // Recoil 상태를 초기화하는 함수를 호출하세요.
    useResetRecoilState(subscriptions);
    useResetRecoilState(scheduleSubscriptions);
  };

  return (
    <div className="App">
      <button onClick={resetSubscriptions}>Subscriptions 초기화</button>
      <BrowserRouter>
        <Nav />
        <Layout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/profile/:memberId" element={<MyPage />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/mentoring" element={<Mentoring />} />
            <Route path="/problem/register" element={<ProblemRegister />} />

            {/* <Route
              path="/problem/:problemId/:nickname"
              element={<ProblemDetail />}
            /> */}
            <Route path="/problem/detail" element={<ProblemSolved />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} limit={6} />
    </div>
  );
};

export default App;
