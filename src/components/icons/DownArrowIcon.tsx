import { SVGProps } from "react";
const DownArrowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path stroke="current" strokeLinecap="round" d="m5 7 4 4 4-4" />
  </svg>
);
export default DownArrowIcon;
