import GoogleIcon from "components/icons/GoogleIcon";

const GoogleOauthBtn = () => {
  return (
    <button
      type="button"
      className="flex items-center justify-center w-12 h-12 shadow-md outline-none rounded-3xl color-white"
    >
      <GoogleIcon />
    </button>
  );
};
export default GoogleOauthBtn;
