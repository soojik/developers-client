import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="relative p-4 bg-white rounded shadow-md text-blue-600"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Notification</h2>
        <p>{message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
