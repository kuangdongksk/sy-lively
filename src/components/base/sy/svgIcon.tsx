export enum SyIconEnum {
  Close = "Close",
  CloseRound = "CloseRound",
  Down = "Down",
  Left = "Left",
  More = "More",
  Min = "Min",
  Refresh = "Refresh",
  Right = "Right",
  Search = "Search",
  Up = "Up",
}

export interface ISvgIconProps {
  icon: SyIconEnum;
  className?: string;
  onClick?: () => void;
}

function SvgIcon(props: ISvgIconProps) {
  const { icon, className, onClick } = props;

  return (
    <svg className={className} onClick={onClick}>
      <use xlinkHref={"#icon" + icon}></use>
    </svg>
  );
}
export default SvgIcon;
