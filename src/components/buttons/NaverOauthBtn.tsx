import NaverIcon from "../../images/NaverIcon.png";

const NaverOauthBtn = () => {
  return (
    <button
      type="button"
      className="flex items-center justify-center w-12 h-12 mr-5 outline-none rounded-3xl color-white"
    >
      <img src={NaverIcon} alt="Naver login" />
    </button>
  );
};
export default NaverOauthBtn;
