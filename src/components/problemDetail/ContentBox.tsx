interface ContentProps{
    children: React.ReactNode;
}
const ContentBox = ({children}:ContentProps) => {
    return <div className="p-4 border border-gray-300 rounded-md shadow-sm">Problem. {children} </div>
}

export default ContentBox;