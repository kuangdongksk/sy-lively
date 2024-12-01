import { Graph, GraphOptions } from "@antv/g6";

export const 默认配置: GraphOptions = {
  animation: false,
  autoResize: true,
  behaviors: ["zoom-canvas", "drag-canvas"],
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
  combo: {},
  // layout: {
  //   type: "d3-force",
  //   collide: {
  //     strength: 0.5,
  //   },
  // },
  plugins: [
    {
      key: "minimap",
      type: "minimap",
      position: "right-top",
    },
    // {
    //   type: "snapline",
    //   key: "snapline",
    //   verticalLineStyle: { stroke: "#AAAAAA", lineWidth: 2 },
    //   horizontalLineStyle: { stroke: "#AAAAAA", lineWidth: 2 },
    //   offset: Infinity,
    //   autoSnap: true,
    //   tolerance: 20,
    //   shape: "key",
    // },
    {
      border: false,
      follow: true,
      key: "grid-line",
      type: "grid-line",
      stroke: "#88888888",
    },
  ],
};

export function 配置图(图: Graph) {
  图.setBehaviors((behaviors) => [
    ...behaviors,
    {
      key: "drag-element",
      type: "drag-element",
      dropEffect: "link",
      shadow: true,
      // onFinish: (e: string[]) => {
      //   e.forEach(async (id) => {
      //     const 数据 = 图.getElementData(id) as NodeData | ComboData;

      //     await 卡片.更新位置(id, {
      //       x: Math.round(数据.style.x / 10) * 10,
      //       y: Math.round(数据.style.y / 10) * 10,
      //     });
      //   });
      // },
    },
  ]);
}
