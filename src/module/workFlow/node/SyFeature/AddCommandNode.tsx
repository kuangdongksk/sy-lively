import { i18n } from "@/constant/i18n";
import NodeWrapper from "..";
import { I18nPath } from "@/constant/i18n/zh";

export interface IAddCommandNodeProps {}

function AddCommandNode(props: IAddCommandNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <div>{i18n.t(I18nPath.workFlow.syFeature.AddCommandNode.this)}</div>
    </NodeWrapper>
  );
}
export default AddCommandNode;
