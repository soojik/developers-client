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
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { subscriptionState } from "./recoil/subscriptionState";
import { scheduleSubscriptionState } from "./recoil/scheduleSubscriptionState";
import { memberInfoState } from "recoil/userState";
import { ToastContainer, toast } from "react-toastify";
import { Subscription } from "./components/live/MentorProfile";
import { ScheduleSubscriptions } from "./components/live/CalendarPopUp";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "apis/axiosConfig";

const App: React.FC = () => {
  const subscriptions = useRecoilValue(subscriptionState);
  const setSubscriptions = useSetRecoilState(subscriptionState);
  const scheduleSubscriptions = useRecoilValue(scheduleSubscriptionState);
  const setScheduleSubscriptions = useSetRecoilState(scheduleSubscriptionState);
  const { memberInfo } = useRecoilValue(memberInfoState);
  const [retryCount, setRetryCount] = useState(0);

  const fetchSubscriptions = async (nickname: string) => {
    const response = await axiosInstance.get(
      `/api/subscriptions?userName=${memberInfo.nickname}`
    );
    return response.data;
  };

  const fetchScheduleSubscriptions = async (nickname: string) => {
    const response = await axiosInstance.get(
      `/api/subscriptions/schedule?userName=${memberInfo.nickname}`
    );
    return response.data;
  };

  // useEffect(() => {
  //   if (
  //     memberInfo.nickname &&
  //     memberInfo.nickname !== "undefined" &&
  //     memberInfo.nickname !== "null"
  //   ) {
  //     const fetchData = async () => {
  //       const subData = await fetchSubscriptions(memberInfo.nickname);
  //       const scheduleSubData = await fetchScheduleSubscriptions(
  //         memberInfo.nickname
  //       );
  //       console.log(subData);
  //       setSubscriptions(subData.data);
  //       setScheduleSubscriptions(scheduleSubData.data);
  //     };
  //     fetchData();
  //   }
  // }, [memberInfo.nickname]);

  // useEffect(() => {
  //   if (
  //     memberInfo.nickname &&
  //     memberInfo.nickname !== "undefined" &&
  //     memberInfo.nickname !== "null" &&
  //     subscriptions.length > 0
  //   ) {
  //     const eventSources = subscriptions.map((subscriptions: Subscription) => {
  //       const pushUrl = `${process.env.REACT_APP_DEV_URL}/api/listen?mentorName=${subscriptions.mentorName}&userName=${memberInfo.nickname}&email=${memberInfo.email}`;

  //       let retryCount = 0;

  //       const retry = () => {
  //         if (retryCount < 3) {
  //           retryCount += 1;
  //           setTimeout(() => {
  //             pushEs.close();
  //           }, 1000 * 10); // 10초 후에 재연결 시도
  //         } else {
  //           // 재시도가 3번 실패한 경우, 1시간 후에 재연결 시도
  //           setTimeout(() => {
  //             pushEs.close();
  //             retryCount = 0;
  //           }, 1000 * 60 * 60);
  //         }
  //       };

  //       const pushEs = new EventSource(pushUrl);

  //       pushEs.addEventListener("error", () => {
  //         retry();
  //       });

  //       pushEs.addEventListener("push", (e) => {
  //         // 여기서 알림을 생성합니다.
  //         toast(e.data);
  //         console.log(e.data);
  //       });

  //       return [pushEs];
  //     });

  //     // 컴포넌트가 언마운트될 때 이벤트 소싱 요청들을 닫습니다.
  //     return () => {
  //       eventSources.forEach((es: { close: () => any }) => es.close());
  //     };
  //   }
  // }, [subscriptions, memberInfo]);

  // useEffect(() => {
  //   if (
  //     memberInfo.nickname &&
  //     memberInfo.nickname !== "undefined" &&
  //     memberInfo.nickname !== "null" &&
  //     scheduleSubscriptions.length > 0
  //   ) {
  //     const eventSources = scheduleSubscriptions.map(
  //       (scheduleSubscriptions: ScheduleSubscriptions) => {
  //         const scheduleUrl = `${process.env.REACT_APP_DEV_URL}/api/listen/schedule?mentorName=${scheduleSubscriptions.mentorName}&userName=${memberInfo.nickname}&email=${memberInfo.email}&time=${scheduleSubscriptions.startTime}&roomName=${scheduleSubscriptions.roomName}`;

  //         const scheduleEs = new EventSource(scheduleUrl);

  //         let retryCount = 0;

  //         const retry = () => {
  //           if (retryCount < 3) {
  //             retryCount += 1;
  //             setTimeout(() => {
  //               scheduleEs.close();
  //             }, 1000 * 10); // 10초 후에 재연결 시도
  //           } else {
  //             // 재시도가 3번 실패한 경우, 1시간 후에 재연결 시도
  //             setTimeout(() => {
  //               scheduleEs.close();
  //               retryCount = 0;
  //             }, 1000 * 60 * 60);
  //           }
  //         };

  //         scheduleEs.addEventListener("error", () => {
  //           retry();
  //         });

  //         scheduleEs.addEventListener("schedule", (e) => {
  //           // 여기서 알림을 생성합니다.
  //           toast(e.data);
  //           console.log(e.data);
  //         });

  //         return [scheduleEs];
  //       }
  //     );

  //     // 컴포넌트가 언마운트될 때 이벤트 소싱 요청들을 닫습니다.
  //     return () => {
  //       eventSources.forEach((es: { close: () => any }) => es.close());
  //     };
  //   }
  // }, [scheduleSubscriptions, memberInfo]);

  // // 모든 subscriptions와 scheduleSubscriptions 삭제
  // const resetSubscriptions = () => {
  //    // Recoil 상태를 초기화하는 함수를 호출하세요.
  // const resetSubscriptionState = useResetRecoilState(subscriptionState);
  // const resetScheduleSubscriptionState = useResetRecoilState(scheduleSubscriptionState);

  // resetSubscriptionState();
  // resetScheduleSubscriptionState();
  // };

  return (
    <div className="App">
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
