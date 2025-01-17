import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import NodeWrapper from "..";

export interface ILoadDataNodeProps {}

function LoadDataNode(props: ILoadDataNodeProps) {
  const {} = props;

  return (
    <NodeWrapper>
      <div>
        <span>{i18n.t(I18nPath.workFlow.syFeature.LoadDataNode.this)}</span>
        <span>{i18n.t(I18nPath.workFlow.syFeature.LoadDataNode.des)}</span>
      </div>
    </NodeWrapper>
  );
}
export default LoadDataNode;
