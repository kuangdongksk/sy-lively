import { Graph, GraphOptions } from "@antv/g6";
import { MutableRefObject } from "react";

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

export function 配置图(参数: {
  图: Graph;
  更改的卡片ID列表: MutableRefObject<Set<string>>;
}) {
  const { 图, 更改的卡片ID列表 } = 参数;

  图.setBehaviors((behaviors) => [
    ...behaviors,
    {
      key: "drag-element",
      type: "drag-element",
      dropEffect: "link",
      shadow: true,
      onFinish: (e: string[]) => {
        e.forEach(async (id) => {
          const 递归添加子节点 = (节点ID: string) => {
            if (更改的卡片ID列表.current.has(节点ID)) return;
            更改的卡片ID列表.current.add(节点ID);

            const 子节点数据 = 图.getChildrenData(节点ID);
            if (子节点数据) {
              子节点数据.forEach((子节点) => {
                console.log("🚀 ~ 子节点数据.forEach ~ 子节点:", 子节点);

                if (子节点.data.单开一页) {
                  递归添加子节点(子节点.id);
                }
              });
            }
          };

          递归添加子节点(id);
        });
      },
    },
  ]);
}
