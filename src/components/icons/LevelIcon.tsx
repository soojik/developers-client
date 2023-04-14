import { SVGProps } from "react";
const LevelIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="current"
    height="current"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="current"
      d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm3.08 15L12 14.15 8.93 16l.81-3.5-2.71-2.34 3.58-.31L12 6.55l1.39 3.29 3.58.31-2.71 2.35.82 3.5Z"
    />
  </svg>
);
export default LevelIcon;
