interface SolutionBoxProps {
    children: React.ReactNode;
}
const SolutionBox = ({children}: SolutionBoxProps) => {
    return <div className="p-2 border border-gray-300 rounded-md shadow-sm">{children}</div>
}
export default SolutionBox;