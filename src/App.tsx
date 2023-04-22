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

import { useRecoilValue, useRecoilState } from "recoil";
import { subscriptionState } from "./recoil/subscriptionState";
import { memberInfoState } from "recoil/userState";

const App: React.FC = () => {
  const subscriptions = useRecoilValue(subscriptionState);
  const { memberInfo } = useRecoilValue(memberInfoState);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log(subscriptions);
    if (subscriptions.length > 0) {
      const eventSources = subscriptions.flatMap(
        (subscription: { mentorName: any }) => {
          const pushUrl = `${process.env.REACT_APP_DEV_URL}/api/listen?mentorName=${subscription.mentorName}&userName=${memberInfo.nickname}&email=${memberInfo.email}`;
          const scheduleUrl = `${process.env.REACT_APP_DEV_URL}/api/listen/schedule?mentorName=${subscription.mentorName}&userName=${memberInfo.nickname}&time=&email=${memberInfo.email}`;
          const pushEs = new EventSource(pushUrl);
          const scheduleEs = new EventSource(scheduleUrl);

          pushEs.addEventListener("push", (e) => {
            setModalMessage(e.data);
            setShowModal(true);
            console.log(e.data);
          });
          scheduleEs.addEventListener("schedule", (e) => {
            setModalMessage(e.data);
            setShowModal(true);
            console.log(e.data);
          });

          return [pushEs, scheduleEs];
        }
      );

      // 컴포넌트가 언마운트될 때 이벤트 소싱 요청들을 닫습니다.
      return () => {
        eventSources.forEach((es: { close: () => any }) => es.close());
      };
    }
  }, [subscriptions, memberInfo]);

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
    </div>
  );
};

export default App;
