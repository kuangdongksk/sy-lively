import {
  GraphOptions
} from "@antv/g6";

export const 图配置: GraphOptions = {
  behaviors: ["drag-element", "zoom-canvas", "drag-canvas"],
  node: {
    type: "circle",
    // type: "react",
    // style: {
    //   size: [240, 50],
    //   component: (data: NodeData) => (
    //     <节点 data={data as unknown as I节点Props["data"]} />
    //   ),
    // },
  },
  layout: {
    type: "d3-force",
    collide: {
      strength: 0.5,
    },
  },
  plugins: [
    {
      key: "minimap",
      type: "minimap",
      position: "right-top",
    },
    {
      type: "snapline",
      key: "snapline",
      verticalLineStyle: { stroke: "#AAAAAA", lineWidth: 2 },
      horizontalLineStyle: { stroke: "#AAAAAA", lineWidth: 2 },
      offset: Infinity,
      autoSnap: true,
      tolerance: 20,
      shape: "key",
    },
    {
      border: false,
      follow: true,
      key: "grid-line",
      type: "grid-line",
      stroke: "#88888888",
    },
  ],
};
