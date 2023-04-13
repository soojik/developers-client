interface PointBoxProps {
    point ?: string;
    handlePointChange : (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const PointBox = ({point, handlePointChange} : PointBoxProps) => {
    return (
        <div >
        <input className="p-2  mb-2 border border-gray-300 rounded-lg pr-4" type = "text" placeholder="Point를 입력해주세요!(최대 100 Point)" value= {point} onChange={handlePointChange} />
        </div>
    )

}
export default PointBox;