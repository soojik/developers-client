import ConfirmBtn from "components/buttons/CofirmBtn";
import { useEffect, useState } from "react";

interface CareerProps {
  careerStart: string;
  careerEnd: string;
  company: string;
}

const CareerInput = ({}: {}) => {
  const [career, setCareer] = useState<CareerProps[]>([
    {
      careerStart: "2022-10-12",
      careerEnd: "2023-10-12",
      company: "(주)애플",
    },
    {
      careerStart: "2021-5-12",
      careerEnd: "2022-7-12",
      company: "(주)카카오",
    },
  ]);
  const [newCareer, setNewCareer] = useState([{ ...career }]);
  const [prevDate, setPrevDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [company, setCompany] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    name: string
  ) => {
    const target = e.target as HTMLInputElement;
    const keyname = name;
    const obj = { [keyname]: target.value };
    const newObj = (career[idx] = { ...career[idx], ...obj });
    // const newDate = (career[idx][keyname] = target.value);
    // setCareer([newDate]);
    setCareer([{ ...career[idx], ...obj }]);
    // console.log(" /// ", { ...career[idx], ...obj }); //매개변수 name이 아닌 객체의 키'name'으로 인식해서 안됨;;
    // console.log(target.value, idx, career[idx]);

    // setNewCareer([newCareer[idx]]);
  };
  const handleBtnClick = () => {
    // console.log("저장 career : ", career);
  };

  useEffect(() => {
    // console.log("저장후", career);
  }, [career]);

  return (
    <>
      <button className="inline-block opacity-90 text-accent-300 font-bold py-1.5 rounded-md hover:opacity-100">
        + 추가
      </button>
      {career?.map((el, idx) => (
        <div key={el.company}>
          <input
            type="date"
            name="careerStart"
            className="sign_input h-[30px] w-[120px] mr-1 font-light text-sm"
            placeholder="YYYY-MM-DD"
            max={``}
            min={``}
            // required
            defaultValue={el.careerStart}
            onChange={(e) => handleInputChange(e, idx, "careerStart")}
          />
          -
          <input
            type="date"
            name="careerEnd"
            className="sign_input h-[30px] w-[120px] mx-1 font-light text-sm"
            placeholder="YYYY-MM-DD"
            max={``}
            min={``}
            // required
            defaultValue={el.careerEnd}
            onChange={(e) => handleInputChange(e, idx, "careerEnd")}
          />
          <input
            type="text"
            name="company"
            placeholder="근무처"
            className="sign_input h-[30px] w-[140px]"
            // required
            defaultValue={el.company}
            onChange={(e) => handleInputChange(e, idx, "company")}
          />
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <ConfirmBtn type="submit" onClick={handleBtnClick}>
          저장
        </ConfirmBtn>
      </div>
    </>
  );
};
export default CareerInput;
