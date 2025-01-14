import NodeWrapper from "..";

export interface IOnLayoutReadyNodeProps {}

function OnLayoutReadyNode(props: IOnLayoutReadyNodeProps) {
  const {} = props;
  return (
    <NodeWrapper>
      <span>当布局完成时</span>
    </NodeWrapper>
  );
}
export default OnLayoutReadyNode;
