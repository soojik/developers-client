import { SVGProps } from "react";
const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m19.3 8.925-4.25-4.2 1.4-1.4a1.92 1.92 0 0 1 1.413-.575c.559 0 1.03.192 1.412.575l1.4 1.4c.383.383.583.846.6 1.388a1.804 1.804 0 0 1-.55 1.387L19.3 8.925ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6 4.25 4.25Z"
    />
  </svg>
);
export default PencilIcon;
