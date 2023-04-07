const Nav = () => {
  return (
    <nav className="bg-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
            alt="Workflow"
          />
          <div className="ml-4 text-white font-bold">Developers</div>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center">
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-700"
            >
              문제 풀이
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-700 ml-4"
            >
              화상 채팅
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-700 ml-4"
            >
              커뮤니티
            </a>
          </div>
        </div>

        <div className="ml-4 flex-shrink-0 flex">
          <button className="bg-gray-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 17.7V9a7 7 0 00-14 0v8.7l-2 2v.3h18v-.3l-2-2z"
              />
            </svg>
          </button>
          {/* 모바일 화면에서만 햄버거 메뉴 표시 */}
          <div className="md:hidden">
            <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:block">
            <button className="bg-gray-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src="https://avatars.githubusercontent.com/u/4357284?v=4"
                alt="Profile"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
