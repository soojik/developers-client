import { useState } from "react";
import Options from "components/Options";
import ConfirmBtn from "components/buttons/CofirmBtn";
import { addressList } from "libs/options";

const AddressInput = ({
  editUserInfo,
  prevAddress,
}: {
  editUserInfo: (path: string, data: string) => any;
  prevAddress: string;
}) => {
  const [adress, setAdress] = useState("");
  return (
    <div className="overflow-hidden h-[340px] flex flex-col justify-between">
      <div>
        <span className="flex font-bold text-xl justify-center mt-2 mb-8">
          거주지
        </span>
        <Options
          label={prevAddress.length > 0 ? prevAddress : "거주지"}
          lists={addressList}
          setState={setAdress}
        />
      </div>
      <div className="flex justify-end mt-10">
        <ConfirmBtn
          type="submit"
          onClick={() => editUserInfo("address", adress)}
        >
          저장
        </ConfirmBtn>
      </div>
    </div>
  );
};
export default AddressInput;
