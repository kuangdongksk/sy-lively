import { E卡片属性名称, I卡片, 卡片 } from "@/class/卡片";
import {
  ComboEvent,
  ExtensionCategory,
  Graph as G6Graph,
  IPointerEvent,
  NodeEvent,
  register,
} from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import { useEffect, useRef, useState } from "react";
import { 事件配置, 图配置 } from "./配置";
import { SY块 } from "@/class/思源/块";

export interface I关系图Props {
  onDestroy?: () => void;
}

register(ExtensionCategory.NODE, "react", ReactNode);

function 关系图(props: I关系图Props) {
  const { onDestroy } = props;

  const 图Ref = useRef<G6Graph>();
  const 容器Ref = useRef<HTMLDivElement>(null);

  const [所有卡片, 设置所有卡片] = useState<I卡片[]>([]);
  const [点列表, 设置点列表] = useState<I卡片[]>([]);
  const [集合列表, 设置集合列表] = useState<I卡片[]>([]);

  const comboRef = useRef<string | undefined>();

  const 获取所有卡片 = async () => {
    const 所有卡片 = await 卡片.获取所有卡片();
    设置所有卡片(所有卡片);
    设置点列表(所有卡片.filter((卡片) => !卡片.单开一页));
    设置集合列表(所有卡片.filter((卡片) => 卡片.单开一页));
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

    Object.entries(事件配置).forEach(([event, callback]) => {
      图.on(event, (e) => callback(e as any, 图));
    });

    图.on(NodeEvent.DRAG_END, async (e: IPointerEvent) => {
      console.log("🚀 ~ 图.on ~ 当前Combo:", comboRef.current);
      if (comboRef.current) {
        const id = e.target.id;
        await SY块.移动块({
          id,
          parentID: comboRef.current,
        });

        await SY块.设置块属性({
          id,
          attrs: {
            [E卡片属性名称.父项ID]: comboRef.current,
          },
        });

        await 获取所有卡片();
      }
    });
    图.once(NodeEvent.DRAG_END, async (e: IPointerEvent) => {
      console.log("🚀 ~ 图.on ~ 当前Combo:", comboRef.current);
      if (comboRef.current) {
        const id = e.target.id;
        await SY块.移动块({
          id,
          parentID: comboRef.current,
        });

        await SY块.设置块属性({
          id,
          attrs: {
            [E卡片属性名称.父项ID]: comboRef.current,
          },
        });

        await 获取所有卡片();
      }
    });

    图.on(ComboEvent.POINTER_OVER, (e: IPointerEvent) => {
      const { target } = e;
      comboRef.current = target.id;
    });
    图.on(ComboEvent.POINTER_OUT, (e: IPointerEvent) => {
      comboRef.current = undefined;
    });

    图.render();

    return () => {
      const 图 = 图Ref.current;
      if (图) {
        try {
          图.destroy();
        } catch (error) {
          console.log(error);
        }
        onDestroy?.();
        图Ref.current = undefined;
      }
    };
  }, []);

  useEffect(() => {}, [所有卡片]);

  useEffect(() => {
    图Ref.current?.setData({
      nodes: 点列表.map((卡片) => ({
        id: 卡片.ID,
        // data: 卡片 as any,
        type: "circle",
        style: {
          labelText: 卡片.标题,
          x: 卡片.X,
          y: 卡片.Y,
        },
        combo: 卡片.父项ID,
      })),
      combos: 集合列表.map((卡片) => ({
        id: 卡片.ID,
        data: 卡片 as any,
        style: {
          labelText: 卡片.标题,
          x: 卡片.X,
          y: 卡片.Y,
        },
      })),
    });
  }, [所有卡片]);

  return (
    <>
      <div
        ref={容器Ref}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}
export default 关系图;
