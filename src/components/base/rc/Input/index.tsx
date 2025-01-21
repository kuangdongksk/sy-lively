import { InputHTMLAttributes } from "react";
import SvgIcon, { SyIconEnum } from "../../sy/svgIcon";

export interface IRcInputProps {
  className?: string;
  htmlAttrs?: Omit<InputHTMLAttributes<HTMLInputElement>, "className">;
  variant?: "search";
}

function RcInput(props: IRcInputProps) {
  const { className, htmlAttrs, variant = "default" } = props;

  const searchInput = (
    <div className="b3-form__icon">
      <SvgIcon icon={SyIconEnum.Search} className="b3-form__icon-icon" />
      <input
        {...htmlAttrs}
        className={`b3-text-field fn__block b3-form__icon-input ${className}`}
      />
    </div>
  );

  switch (variant) {
    case "search":
      return searchInput;
    default:
      return <input className="" {...htmlAttrs} />;
  }
}

export default RcInput;
