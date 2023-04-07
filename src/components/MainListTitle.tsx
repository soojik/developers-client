type LayoutProps = {
  children: React.ReactNode;
};

const MainListTitle = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="text-center bg-slate-300 text-xl font-bold p-3 rounded-md ">
        {children}
      </div>
    </>
  );
};

export default MainListTitle;
