import { InputHTMLAttributes } from "react";

export interface IRcInputProps {
  className?: string;
  htmlAttrs?: Omit<InputHTMLAttributes<HTMLInputElement>, "className">;
}

function RcInput(props: IRcInputProps) {
  const { className, htmlAttrs } = props;

  return <input className="" {...htmlAttrs} />;
}

export default RcInput;
