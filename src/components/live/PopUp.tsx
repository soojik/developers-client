import React from 'react';

interface PopupProps {
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-5 rounded-lg max-w-4xl w-3/4 h-120 overflow-y-auto">
        {children}
      </div>
    </div>

  );
};

export default Popup;