import { InputHTMLAttributes } from "react";
import SvgIcon, { SyIconEnum } from "../../sy/svgIcon";

export interface ISearchInputProps {
  className?: string;
  htmlAttrs?: Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "onChange">;
  onChange?: (value: string) => void;
}

function SearchInput(props: ISearchInputProps) {
  const { className, htmlAttrs, onChange } = props;

  return (
    <div className="b3-form__icon">
      <SvgIcon icon={SyIconEnum.Search} className="b3-form__icon-icon" />
      <input
        {...htmlAttrs}
        className={`b3-text-field fn__block b3-form__icon-input ${className}`}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        onFocus={(e) => {
          e.target.select();
        }}
      />
    </div>
  );
}
export default SearchInput;
