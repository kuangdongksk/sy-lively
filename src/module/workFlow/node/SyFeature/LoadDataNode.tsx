import { i18n, I18nPath } from "@/constant/i18n";
import NodeWrapper from "..";

export interface ILoadDataNodeProps {}

function LoadDataNode(props: ILoadDataNodeProps) {
  const {} = props;
  const t = i18n.t;
  console.log("🚀 ~ LoadDataNode ~ i18n:", i18n)

  return (
    <NodeWrapper>
      <div>
        <span>{t(I18nPath.workFlow.syFeature.LoadDataNode.this)}</span>
        <span>{t(I18nPath.workFlow.syFeature.LoadDataNode.des)}</span>
      </div>
    </NodeWrapper>
  );
}
export default LoadDataNode;
