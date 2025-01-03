import { InputHTMLAttributes } from "react";

export interface IRcInputProps {
  htmlAttrs?: InputHTMLAttributes<HTMLInputElement>;
}

function RcInput(props: IRcInputProps) {
  const { htmlAttrs } = props;
  return <input {...htmlAttrs} />;
}

export default RcInput;
