import { XYPosition } from "@xyflow/react";
import { EPluginLifeCycleNode } from "./node/PluginLifeCycle/OnLoadNode";
import { ESyFeatureNode } from "./node/SyFeature";
import { EWidgetNode } from "./node/widget";

export interface NodeType {
  id: string;
  type: EWidgetNode | EPluginLifeCycleNode | ESyFeatureNode;
  position: XYPosition;
  data: any;
}
