export enum SyIconEnum {
  Down = "Down",
  Right = "Right",
  Left = "Left",
  Up = "Up",
  More = "More",
  Min = "Min",
  Refresh = "Refresh",
}

export interface ISvgIconProps {
  icon: SyIconEnum;
  className?: string;
}

function SvgIcon(props: ISvgIconProps) {
  const { icon, className } = props;
  return (
    <svg className={className}>
      <use xlinkHref={"#icon" + icon}></use>
    </svg>
  );
}
export default SvgIcon;
