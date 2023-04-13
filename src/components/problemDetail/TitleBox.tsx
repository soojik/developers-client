interface TitleProps{
  children: React.ReactNode;
}
const Titlebox = ({children}:TitleProps) =>{
  return <div className="p-4 mb-4 font-bold bg-gray-100">Q. {children} </div>;
}
export default Titlebox;