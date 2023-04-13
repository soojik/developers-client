interface SubmitProps {
  onClick: () => void;
  text: string;
}

const Submit = ({ onClick, text }: SubmitProps) => {
  return (
    <button
      className="fixed right-0 bottom-0 p-4 bg-blue-500 text-white rounded-tl-md cursor-pointer border-2 border-black"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Submit;
