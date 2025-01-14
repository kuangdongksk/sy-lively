import { XYPosition } from "@xyflow/react";
import { EPluginLifeCycleNode } from "./node/PluginLifeCycle/OnLoadNode";
import { ESyFeatureNode } from "./node/SyFeature";

export interface NodeType {
  id: string;
  type: EPluginLifeCycleNode | ESyFeatureNode;
  position: XYPosition;
  data: any;
}
