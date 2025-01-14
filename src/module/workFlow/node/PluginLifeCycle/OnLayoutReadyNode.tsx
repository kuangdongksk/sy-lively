import { Position } from "@xyflow/react";
import NodeWrapper from "..";

export interface IOnLayoutReadyNodeProps {}

function OnLayoutReadyNode(props: IOnLayoutReadyNodeProps) {
  const {} = props;

  return (
    <NodeWrapper
      handle={[
        {
          type: "target",
          position: Position.Left,
        },
        {
          type: "source",
          position: Position.Right,
        },
      ]}
    >
      <span>当布局完成时</span>
    </NodeWrapper>
  );
}
export default OnLayoutReadyNode;
