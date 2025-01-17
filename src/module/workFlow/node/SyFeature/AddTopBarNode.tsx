import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import { Handle, Position } from "@xyflow/react";

export interface IAddTopBarNodeProps {}

function AddTopBarNode(props: IAddTopBarNodeProps) {
  const {} = props;

  return (
    <div>
      <div>{i18n.t(I18nPath.workFlow.syFeature.AddTopBarNode.this)}</div>
      <div style={{ position: "relative" }}>
        {i18n.t(I18nPath.base.click)}
        <Handle id="r1" position={Position.Right} type="source" />
      </div>
      <div style={{ position: "relative" }}>
        {i18n.t(I18nPath.base.rightClick)}
        <Handle id="r2" position={Position.Right} type="source" />
      </div>
    </div>
  );
}
export default AddTopBarNode;
