import { Position } from "@xyflow/react";
import NodeWrapper from "..";
import OnLayoutReadyNode from "./OnLayoutReadyNode";
import OnUninstallNode from "./OnUninstallNode";
import OnUnloadNode from "./OnUnloadNode";

export interface IOnLoadNodeProps {}

function OnLoadNode(props: IOnLoadNodeProps) {
  const {} = props;

  return (
    <NodeWrapper
      handle={[
        {
          type: "source",
          position: Position.Right,
        },
      ]}
    >
      <span>当插件加载时</span>
    </NodeWrapper>
  );
}
export default OnLoadNode;

export enum EPluginLifeCycleNode {
  OnLoadNode = "OnLoadNode",
  OnLayoutReadyNode = "OnLayoutReadyNode",
  OnUninstallNode = "OnUninstallNode",
  OnUnloadNode = "OnUnloadNode",
}

export const PluginLifeCycleNode = {
  OnLoadNode,
  OnLayoutReadyNode,
  OnUninstallNode,
  OnUnloadNode,
};
