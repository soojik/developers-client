interface TypeProps{
    emoji : string;
    text : string;
}
const Type = ({emoji,text}:TypeProps) => {
    return <div className="w-4 h-4 opacity-0">
        <span>{emoji}</span>
        <span>{text}</span>
    </div>
}
export default Type;