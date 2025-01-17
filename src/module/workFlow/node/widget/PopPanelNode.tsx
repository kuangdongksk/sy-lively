import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import { nanoid } from "nanoid";
import NodeWrapper from "..";

export interface IPopPanelNodeProps {}

function PopPanelNode(props: IPopPanelNodeProps) {
  const {} = props;

  const positionSelectId = nanoid();

  return (
    <NodeWrapper>
      <div>{i18n.t(I18nPath.workFlow.components.PopPanelNode.this)}</div>
      <div className="flex items-center justify-center">
        <label htmlFor={positionSelectId}>打开位置：</label>
        <select className="b3-select fn__flex-center" id={positionSelectId}>
          <option value="0" selected={true}>
            居中
          </option>
          <option value="1">触发元素</option>
          <option value="2">鼠标处</option>
        </select>
      </div>
    </NodeWrapper>
  );
}
export default PopPanelNode;
