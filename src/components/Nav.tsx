import { Link, useNavigate } from "react-router-dom";
import NotificationIcon from "./icons/NotificationIcon";
import PersonIcon from "./icons/PersonIcon";
import MenuBarIcon from "./icons/MenuBarIcon";
import { useState } from "react";
import MenuCloseIcon from "./icons/MenuCloseIcon";

const Nav = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = false;

  const handleOpenMenuBar = () => {
    setIsOpenMenu(!isOpenMenu);
  };
  return (
    <nav className="px-4 py-3 bg-gray-800">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="w-auto h-8"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
            alt="로고 이미지"
          />
          <div className="ml-4 font-bold text-white">Developers</div>
        </Link>
        <div className="hidden md:block">
          <div className="flex items-center">
            <Link
              to="/problem"
              className="px-3 py-2 text-sm font-medium text-white rounded-md hover:text-gray-300 hover:bg-gray-700"
            >
              문제 풀이
            </Link>
            <Link
              to="/mentoring"
              className="px-3 py-2 ml-4 text-sm font-medium text-white rounded-md hover:text-gray-300 hover:bg-gray-700"
            >
              멘토링
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          <button className="p-2 mr-1">
            <NotificationIcon fill="white" />
          </button>
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button>로그인한 유저이미지</button>
            ) : (
              <button className="p-2" onClick={() => navigate("/login")}>
                <PersonIcon fill="white" />
              </button>
            )}
          </div>
          {/* 모바일 화면에서 햄버거 메뉴 표시 */}
          <div className="md:hidden">
            <button className={`p-2 ${isOpenMenu ? "hidden" : "block"}`}>
              <MenuBarIcon fill="white" />
            </button>

            {/* <div
              className={`${
                isOpenMenu
                  ? "absolute left-0 w-full h-screen bg-neutral-700"
                  : ""
              }`}
            >
              <div
                className={`bg-white fixed top-0 right-0 h-full w-48 z-10 ${
                  isOpenMenu ? "" : "translate-x-0"
                }`}
                onBlur={() => setIsOpenMenu(false)}
              >
                <button
                  className={`absolute top-0 p-1 -left-20 translate-x-full bg-transparent border-none ${
                    isOpenMenu ? "hidden" : "block"
                  }`}
                  onClick={handleOpenMenuBar}
                >
                  <MenuCloseIcon fill="white" />
                </button>
                <div
                  className="text-xl hover:font-bold"
                  onClick={() => setIsOpenMenu(false)}
                >
                  <Link to="/">홈</Link>
                </div>
                <div
                  className="text-xl hover:font-bold"
                  onClick={() => setIsOpenMenu(false)}
                >
                  <Link to="/problem">문제 풀이</Link>
                </div>
                <div
                  className="text-xl hover:font-bold"
                  onClick={() => setIsOpenMenu(false)}
                >
                  <Link to="/mentoring">멘토링</Link>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
