import { I18nPath } from "@/constant/i18n/zh";
import NodeWrapper from "..";
import { i18n } from "@/constant/i18n";

export interface IAddSlashCommandNodeProps {}

function AddSlashCommandNode(props: IAddSlashCommandNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <div>{i18n.t(I18nPath.workFlow.syFeature.AddSlashCommandNode.this)}</div>
    </NodeWrapper>
  );
}
export default AddSlashCommandNode;
