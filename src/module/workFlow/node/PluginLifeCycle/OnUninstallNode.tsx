import NodeWrapper from "..";

export interface IOnUninstallNodeProps {}

function OnUninstallNode(props: IOnUninstallNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <span>当插件删除时</span>
    </NodeWrapper>
  );
}
export default OnUninstallNode;
