import NodeWrapper from "..";

export interface IOnUnloadNodeProps {}

function OnUnloadNode(props: IOnUnloadNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <span>当插件卸载时</span>
    </NodeWrapper>
  );
}
export default OnUnloadNode;
