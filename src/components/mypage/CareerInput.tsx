import { axiosInstance } from "apis/axiosConfig";
import ConfirmBtn from "components/buttons/CofirmBtn";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";

interface CareerProps {
  id: number;
  careerStart: string;
  careerEnd: string;
  company: string;
}

const CareerInput = ({ careerList }: { careerList: {} }) => {
  const { memberId } = useRecoilValue(memberInfoState);
  const [inputId, setInputId] = useState(0);
  const [career, setCareer] = useState<CareerProps[]>([
    { id: inputId, careerStart: "", careerEnd: "", company: "" },
  ]);

  const addInput = () => {
    const input = {
      id: inputId + 1,
      careerStart: "",
      careerEnd: "",
      company: "",
    };
    setInputId(inputId + 1);
    setCareer([...career, input]);
  };

  const deleteInput = (id: number) => {
    const filtered = career.filter((el) => el.id !== id);
    setCareer([...filtered]);
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const data = {
      [e.target.name]: e.target.value,
    };
    const newItem = career.map((el) =>
      el.id === id ? { ...el, ...data } : el
    );
    setCareer([...newItem]);
  };

  const onSaveBtn = () => {
    const deletedId = career.map((el) => {
      const { id, ...rest } = el;
      return { ...rest };
    });

    axiosInstance
      .post(`/api/member/career`, { memberId, career: deletedId })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (Array.isArray(careerList) && !careerList.length) {
      return;
    } else if (Array.isArray(careerList) && careerList.length) {
      const prevItems = careerList.map((el, idx) => {
        const prevItem = { ...el, id: idx };
        setInputId(idx);
        return prevItem;
      });
      setCareer(prevItems);
    }
  }, []);

  return (
    <div>
      {career?.map((el, idx) => (
        <div key={el.id} className="flex items-center text-slate-500">
          <input
            type="date"
            name="careerStart"
            className="sign_input h-[30px] w-[123px] mr-1 font-light text-sm border-slate-200 "
            placeholder="YYYY-MM-DD"
            min={``}
            max={`${el.careerEnd}`}
            required
            defaultValue={el.careerStart}
            onChange={(e) => onInputChange(e, el.id)}
          />
          -
          <input
            type="date"
            name="careerEnd"
            className="sign_input h-[30px] w-[123px] mx-1 font-light text-sm border-slate-200"
            placeholder="YYYY-MM-DD"
            min={`${el.careerStart}`}
            max={``}
            // required
            defaultValue={el.careerEnd}
            onChange={(e) => onInputChange(e, el.id)}
          />
          <input
            type="text"
            name="company"
            placeholder="회사명"
            className="sign_input h-[30px] min-w-[20px] max-w-[140px] border-slate-200"
            required
            defaultValue={el.company}
            onChange={(e) => onInputChange(e, el.id)}
          />
          {idx === 0 && career.length < 10 && (
            <button
              className="text-[28px] font-light ml-3 flex items-center justify-center text-slate-400 hover:text-accent-300  mb-[3px]"
              onClick={() => addInput()}
            >
              +
            </button>
          )}
          {idx > 0 && career[idx - 1] ? (
            <button
              className="text-[28px] font-light ml-3 flex items-center justify-center text-slate-400 hover:text-accent-300  mb-[3px]"
              onClick={() => deleteInput(el.id)}
            >
              &minus;
            </button>
          ) : (
            ""
          )}
        </div>
      ))}

      <div className="flex justify-end mt-4">
        <ConfirmBtn type="submit" onClick={onSaveBtn}>
          저장
        </ConfirmBtn>
      </div>
    </div>
  );
};
export default CareerInput;
