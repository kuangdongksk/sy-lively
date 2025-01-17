import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import NodeWrapper from "..";

export interface ISaveDataNodeProps {}

function SaveDataNode(props: ISaveDataNodeProps) {
  const {} = props;

  return (
    <NodeWrapper>
      <div>
        <span>{i18n.t(I18nPath.workFlow.syFeature.SaveDataNode.this)}</span>
        <span>{i18n.t(I18nPath.workFlow.syFeature.SaveDataNode.des)}</span>
      </div>
    </NodeWrapper>
  );
}
export default SaveDataNode;
