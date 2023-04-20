import { axiosInstance } from "apis/axiosConfig";
import MenuCloseIcon from "components/icons/MenuCloseIcon";
import { SetStateAction, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import { CareerProps } from "./ResumeEdit";

interface CareerItemProps {
  careerId: number;
  careerStart: string;
  careerEnd: string;
  company: string;
}

interface CarrerInput {
  prevCareer: CareerProps[];
  setPrevCareer: React.Dispatch<SetStateAction<CareerProps[]>>;
}

const CareerInput = ({ prevCareer, setPrevCareer }: CarrerInput) => {
  const { memberId } = useRecoilValue(memberInfoState);
  const [inputId, setInputId] = useState(0);
  const [editIdx, setEditIdx] = useState<number[]>([]);
  const [career, setCareer] = useState<CareerItemProps[]>([
    {
      careerId: inputId,
      careerStart: "",
      careerEnd: "",
      company: "",
    },
  ]);
  const [reqCareer, setReqCareer] = useState({
    careerStart: "",
    careerEnd: "",
    company: "",
  });
  const [initCareerId, setInitCareerId] = useState(0);

  useEffect(() => {
    /* 초기 경력 있을 때 prevCareer */
    if (Array.isArray(prevCareer) && prevCareer.length > 0) {
      prevCareer.map((el) => setEditIdx([...editIdx, el.careerId]));
    } else {
      /* 초기 경력 없고 첫 등록일 때 career - id 추가 로직 */
      const prevItems = career.map((el, idx) => {
        const prevItem = { ...el, careerId: idx };
        setInputId(idx);
        return prevItem;
      });
      setCareer(prevItems && prevItems!);
    }
  }, []);

  const addInput = () => {
    const lastItem = career[career.length - 1];
    // 추가한 input에 입력값 있고 등록해야지 추가됨
    if (
      editIdx.length > 0 &&
      lastItem.careerStart.length > 0 &&
      lastItem.careerEnd.length > 0 &&
      lastItem.company.length > 0
    ) {
      const input = {
        careerId: inputId + 1,
        careerStart: "",
        careerEnd: "",
        company: "",
      };
      setInputId(inputId + 1);
      setCareer([...career, input]);
    }
  };

  const onDelete = (id: number, initCareerId?: number) => {
    /* 화면 UI */
    const filtered = career.filter((el) => el.careerId !== id);
    setCareer([...filtered]);
    const filteredPrev = prevCareer.filter((el) => el.careerId !== id);
    setPrevCareer([...filteredPrev]);
    const filterId = editIdx.filter((el) => el !== id);
    setEditIdx(filterId);

    let careerId;
    if (initCareerId) {
      careerId = initCareerId;
    } else careerId = id;

    axiosInstance.delete(`/api/member/career/${careerId}`);
    // .then((res) => console.log("삭제", res));
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const data = {
      [e.target.name]: e.target.value,
    };
    setReqCareer({ ...reqCareer, ...data }); // 보낼 1개 데이터
    /* 화면 UI */
    const newItem = career.map((el) =>
      el.careerId === id ? { ...el, ...data } : el
    );
    setCareer([...newItem]);
  };

  const onPostBtn = async (index: number) => {
    /* 초기 등록 시 - 1개만 변하면 안되고 중복 가능해야함*/
    if (!editIdx.includes(index)) {
      setEditIdx([...editIdx, index]);
    }
    const { data } = await axiosInstance.post(`/api/member/career`, {
      memberId,
      ...reqCareer,
    });
    setInitCareerId(data.data.careerId); // 등록 후 바로 수정가능하게 id값 세팅
    // console.log("등록함", data);
  };

  const onPatchBtn = async (
    prevCareerId?: number,
    careerStart?: string,
    careerEnd?: string,
    company?: string
  ) => {
    let careerId;
    if (prevCareerId) careerId = prevCareerId;
    else careerId = initCareerId;

    let reqBody = {};
    if (careerStart && careerEnd && company) {
      // 기존 값 있고 -> 아무것도 입력 안할 시 기존 값으로 세팅
      for (const [key, value] of Object.entries(reqCareer)) {
        if (value.length === 0) {
          if (key === "careerStart") reqBody = { ...reqBody, careerStart };
          if (key === "careerEnd") reqBody = { ...reqBody, careerEnd };
          if (key === "company") reqBody = { ...reqBody, company };
        }
      }
    } else reqBody = reqCareer;

    const { data } = await axiosInstance.patch(`/api/member/career`, {
      careerId,
      ...reqCareer,
      ...reqBody,
    });
    // console.log("수정함", data);
  };

  return (
    <div>
      {career.length < 10 && (
        <button
          className="inline-block opacity-90 text-accent-300 font-bold py-1.5 rounded-md hover:opacity-100"
          onClick={() => addInput()}
        >
          + 추가
        </button>
      )}
      {/* 이전경력 있을때 */}
      {prevCareer?.map((el, idx) => {
        return (
          <div key={el.careerId} className="flex items-center text-slate-500">
            <input
              type="date"
              name="careerStart"
              className="sign_input h-[30px] w-[123px] mr-1 font-light text-sm border-slate-200 "
              placeholder="YYYY-MM-DD"
              min={``}
              max={`${el.careerEnd}`}
              required
              defaultValue={el.careerStart}
              onChange={(e) => onInputChange(e, el.careerId)}
            />
            -
            <input
              type="date"
              name="careerEnd"
              className="sign_input h-[30px] w-[123px] mx-1 font-light text-sm border-slate-200"
              placeholder="YYYY-MM-DD"
              min={`${el.careerStart}`}
              max={``}
              defaultValue={el.careerEnd}
              onChange={(e) => onInputChange(e, el.careerId)}
            />
            <input
              type="text"
              name="company"
              placeholder="회사명"
              className="sign_input h-[30px] min-w-[20px] max-w-[140px] border-slate-200"
              required
              defaultValue={el.company}
              onChange={(e) => onInputChange(e, el.careerId)}
            />
            <button
              type="submit"
              className="ml-3 px-2.5 py-0.5 min-w-[50px] text-emerald-500 rounded-md border border-emerald-500 font-bold  hover:bg-emerald-500 hover:text-slate-200 transition"
              onClick={() =>
                onPatchBtn(
                  el.careerId,
                  el.careerStart,
                  el.careerEnd,
                  el.company
                )
              }
            >
              수정
            </button>
            <button
              className="ml-3 mb-[3px]"
              onClick={() => onDelete(el.careerId)}
            >
              <MenuCloseIcon fill="gray" width={23} height={23} />
            </button>
          </div>
        );
      })}
      {/* 이전경력 없을때 */}
      {career?.map((el, idx) => {
        const isEdited = editIdx.includes(idx) ? true : false;
        // console.log(isEdited, editIdx, "idx :", idx);

        return (
          <div key={el.careerId} className="flex items-center text-slate-500">
            <input
              type="date"
              name="careerStart"
              className="sign_input h-[30px] w-[123px] mr-1 font-light text-sm border-slate-200 "
              placeholder="YYYY-MM-DD"
              min={``}
              max={`${el.careerEnd}`}
              required
              defaultValue={el.careerStart}
              onChange={(e) => onInputChange(e, el.careerId)}
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
              onChange={(e) => onInputChange(e, el.careerId)}
            />
            <input
              type="text"
              name="company"
              placeholder="회사명"
              className="sign_input h-[30px] min-w-[20px] max-w-[140px] border-slate-200"
              required
              defaultValue={el.company}
              onChange={(e) => onInputChange(e, el.careerId)}
            />
            {isEdited || ( // false - 등록 / true - 수정
              <button
                type="submit"
                className="ml-3 px-2.5 py-0.5 min-w-[50px] text-accent-100 rounded-md border border-accent-100 font-bold  hover:bg-accent-100 hover:text-slate-200 transition"
                onClick={() => onPostBtn(idx)}
              >
                등록
              </button>
            )}
            {isEdited && (
              <>
                <button
                  type="submit"
                  className="ml-3 px-2.5 py-0.5 min-w-[50px] text-emerald-500 rounded-md border border-emerald-500 font-bold  hover:bg-emerald-500 hover:text-slate-200 transition"
                  onClick={() => onPatchBtn(el.careerId)}
                >
                  수정
                </button>
                <button
                  className="ml-3 mb-[3px]"
                  onClick={() => onDelete(el.careerId, initCareerId)}
                >
                  <MenuCloseIcon fill="gray" width={23} height={23} />
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default CareerInput;
