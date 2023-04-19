type LayoutProps = {
  children: React.ReactNode;
};

const MainListTitle = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="text-center text-xl font-bold">{children}</div>
    </>
  );
};

export default MainListTitle;
