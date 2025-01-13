import { ReactNode } from "react";
import SvgIcon, { SyIconEnum } from "../base/sy/svgIcon";

export interface IDockerProps {
  customButtons?: {
    dataType: string;
    ariaLabel: string;
    icon: SyIconEnum;
    onClick: () => void;
  }[];
  children?: ReactNode;
  minButton?: boolean;
  title?: ReactNode;
  onClickMore?: () => void;
}

function Docker(props: IDockerProps) {
  const { children, customButtons = [], minButton, title, onClickMore } = props;

  return (
    <div className="fn__flex-1 fn__flex-column">
      <div className="block__icons">
        <span className="block__logo">{title}</span>
        <span className="fn__flex-1 fn__space"></span>

        {customButtons.map((item) => (
          <>
            <IconButton
              key={item.dataType}
              ariaLabel={item.ariaLabel}
              dataType={item.dataType}
              icon={item.icon}
              onClick={item.onClick}
            />
            <span className="fn__space"></span>
          </>
        ))}

        {onClickMore && (
          <>
            <IconButton
              ariaLabel="更多"
              dataType="more"
              icon={SyIconEnum.More}
              onClick={onClickMore}
            />
            {minButton && <span className="fn__space"></span>}
          </>
        )}
        {minButton && (
          <IconButton
            ariaLabel={"最小化 Ctrl+W"}
            dataType={"min"}
            icon={SyIconEnum.Min}
          />
        )}
      </div>
      <div className="fn__flex-1">{children}</div>
    </div>
  );
}

export default Docker;

function IconButton(props: {
  ariaLabel: string;
  dataType: string;
  icon: SyIconEnum;
  onClick?: () => void;
}) {
  const { ariaLabel, dataType, icon, onClick } = props;

  return (
    <div
      data-type={dataType}
      className="b3-tooltips b3-tooltips__sw block__icon"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <SvgIcon icon={icon} />
    </div>
  );
}
