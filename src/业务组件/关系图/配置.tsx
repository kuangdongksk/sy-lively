import {
  CanvasEvent,
  GraphOptions,
  IPointerEvent,
  NodeData,
  NodeEvent,
} from "@antv/g6";
import 节点, { I节点Props } from "./节点";
import { 卡片 } from "@/class/卡片";

export const 图配置: GraphOptions = {
  behaviors: ["drag-element", "zoom-canvas", "drag-canvas"],
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
  plugins: [
    {
      key: "minimap",
      type: "minimap",
      position: "right-top",
    },
    "snapLine",
    {
      border: false,
      follow: true,
      key: "grid-line",
      type: "grid-line",
      stock: "#88888888",
    },
  ],
};

export const 事件配置 = {
  [CanvasEvent.CLICK]: (e: any) => {
    console.log(e);
  },
  [NodeEvent.DRAG_END]: (e: IPointerEvent) => {
    console.log("这是dragEnd");
    const { target } = e;
    卡片.更新位置(target.id, e.canvas);
  },
  [NodeEvent.DROP]: (e: IPointerEvent) => {
    console.log("这是drop");
    const { target } = e;
    卡片.更新位置(target.id, e.canvas);
  },
};
