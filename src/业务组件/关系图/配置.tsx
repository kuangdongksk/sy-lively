import { GraphOptions, NodeData } from "@antv/g6";
import 节点, { I节点Props } from "./节点";

export const 图配置: GraphOptions = {
  node: {
    type: "react",
    style: {
      size: [240, 50],
      component: (data: NodeData) => (
        <节点 data={data as unknown as I节点Props["data"]} />
      ),
    },
  },
  layout: {
    type: "d3-force",
    collide: {
      strength: 0.5,
    },
  },
  behaviors: ["drag-element", "zoom-canvas", "drag-canvas"],
};
