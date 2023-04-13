interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ConfirmBtn = (props: ButtonProps) => {
  return (
    <button
      className="px-4 py-1.5 text-accent-100 rounded-md border border-accent-100 font-bold  hover:bg-accent-100 hover:text-slate-200 transition"
      {...props}
    />
  );
};
export default ConfirmBtn;
