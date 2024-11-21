import { I卡片, 卡片 } from "@/class/卡片";
import {
  CanvasEvent,
  ExtensionCategory,
  Graph as G6Graph,
  NodeEvent,
  register,
} from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import { useEffect, useRef, useState } from "react";
import { 事件配置, 图配置 } from "./配置";

export interface I关系图Props {
  onDestroy?: () => void;
}

register(ExtensionCategory.NODE, "react", ReactNode);

function 关系图(props: I关系图Props) {
  const { onDestroy } = props;

  const 图Ref = useRef<G6Graph>();
  const 容器Ref = useRef<HTMLDivElement>(null);

  const [所有卡片, 设置所有卡片] = useState<I卡片[]>([]);

  const 获取所有卡片 = async () => {
    const 所有卡片 = await 卡片.获取所有卡片();
    设置所有卡片(所有卡片);
  };

  useEffect(() => {
    获取所有卡片();
  }, []);

  useEffect(() => {
    const 图 = new G6Graph({
      ...图配置,
      container: 容器Ref.current!,
      data: {},
    });
    图Ref.current = 图;

    图.on(NodeEvent.DRAG_END, 事件配置[NodeEvent.DRAG_END]);
    图.on(NodeEvent.DROP, 事件配置[NodeEvent.DROP]);

    图.render();

    return () => {
      const 图 = 图Ref.current;
      if (图) {
        图.destroy();
        onDestroy?.();
        图Ref.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    图Ref.current?.setData({
      nodes: 所有卡片.map((卡片) => ({
        id: 卡片.ID,
        data: 卡片 as any,
        style: {
          x: 卡片.X,
          y: 卡片.Y,
        },
      })),
    });
  }, [所有卡片]);

  return (
    <div
      ref={容器Ref}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
export default 关系图;
