import Options from "components/Options";
import { addressList } from "libs/options";
import { useState } from "react";

const AddressInput = ({
  memberId,
  editUserInfo,
}: {
  memberId?: string;
  editUserInfo: (path: string, data: string) => any;
}) => {
  const [adress, setAdress] = useState("");
  return (
    <div className="overflow-hidden h-[340px] flex flex-col justify-between">
      <div>
        <span className="flex font-bold text-xl justify-center mt-2 mb-8">
          거주지
        </span>
        <Options label="거주지" lists={addressList} setState={setAdress} />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-1.5 text-accent-100 rounded-md border border-accent-100 font-bold  hover:bg-accent-100 hover:text-slate-200 transition"
          onClick={() => editUserInfo("address", adress)}
        >
          저장
        </button>
      </div>
    </div>
  );
};
export default AddressInput;
