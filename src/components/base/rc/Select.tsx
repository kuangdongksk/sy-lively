import { ReactNode } from "react";

export interface IRcSelectProps<TValue> {
  className?: string;
  options?: { value: TValue; label: ReactNode }[];
  onChange?: (value: TValue) => void;
}

function RcSelect<TValue>(props: IRcSelectProps<TValue>) {
  const { className = "", options, onChange } = props;

  return (
    <select
      className={"b3-select fn__flex-center " + className}
      onChange={(e) => {
        onChange?.(options?.[parseInt(e.target.value)]?.value);
      }}
    >
      {options?.map((option, index) => (
        <option key={index} value={index}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
export default RcSelect;
