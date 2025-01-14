import { Position } from "@xyflow/react";
import NodeWrapper from "..";
import OnUninstallNode from "./OnUninstallNode";
import OnUnloadNode from "./onUnloadNode";
import OnLayoutReadyNode from "./OnLayoutReadyNode";

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
  OnLoadNode = "PluginLifeCycle_onLoad",
  OnLayoutReadyNode = "PluginLifeCycle_onLayoutReady",
  OnUninstallNode = "PluginLifeCycle_onUninstall",
  OnUnloadNode = "PluginLifeCycle_onUnload",
}

export const PluginLifeCycleNode = {
  OnLoadNode,
  OnLayoutReadyNode,
  OnUninstallNode,
  OnUnloadNode,
};
