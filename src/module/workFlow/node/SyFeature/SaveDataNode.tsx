import { i18n, I18nPath } from "@/constant/i18n";
import NodeWrapper from "..";

export interface ISaveDataNodeProps {}

function SaveDataNode(props: ISaveDataNodeProps) {
  const {} = props;

  const t = i18n.t;

  return (
    <NodeWrapper>
      <div>
        <span>{t(I18nPath.workFlow.syFeature.SaveDataNode.this)}</span>
        <span>{t(I18nPath.workFlow.syFeature.SaveDataNode.des)}</span>
      </div>
    </NodeWrapper>
  );
}
export default SaveDataNode;
