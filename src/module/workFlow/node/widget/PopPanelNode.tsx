import RcSelect from "@/components/base/rc/Select";
import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import NodeWrapper from "..";
import { useState } from "react";

export interface IPopPanelNodeProps {}

function PopPanelNode(props: IPopPanelNodeProps) {
  const {} = props;

  const [position, setPosition] = useState<"mousePosition" | "screenCenter" | "elementPosition">(
    "mousePosition"
  );

  return (
    <NodeWrapper>
      <div>{i18n.t(I18nPath.workFlow.components.PopPanelNode.this)}</div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          打开位置：
          <RcSelect
            options={[
              { value: "mousePosition", label: "鼠标位置" },
              { value: "screenCenter", label: "屏幕中间" },
              { value: "elementPosition", label: "元素位置" },
            ]}
          />
        </div>

        <div>请接入触发元素</div>
      </div>
    </NodeWrapper>
  );
}
export default PopPanelNode;
