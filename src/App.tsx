import React from "react";
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






const App: React.FC = () => {
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
             <Route
            path="/problem/detail" element={<ProblemSolved />} />
            
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
};

export default App;
