// Popup.tsx
import React from 'react';

interface PopupProps {
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({  children }) => {
  return (
    <div className="popup">
      <div className="popup_inner">
        {children}
      </div>
    </div>
  );
};

export default Popup;