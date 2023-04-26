interface PopupProps {
  children: React.ReactNode;
}

const Modal = ({ children }: PopupProps) => {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-5 rounded-lg overflow-y-auto">{children}</div>
    </div>
  );
};

export default Modal;
