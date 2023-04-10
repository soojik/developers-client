import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Live from "./pages/Live/Live";
import Nav from "components/Nav";
import Layout from "components/Layout";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Layout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/live" element={<Live />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
};

export default App;
