import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import NodeWrapper from "..";

export interface IAddTabNodeProps {}

function AddTabNode(props: IAddTabNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <div>{i18n.t(I18nPath.workFlow.syFeature.AddTabNode.this)}</div>
    </NodeWrapper>
  );
}
export default AddTabNode;
