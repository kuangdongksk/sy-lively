import { E卡片属性名称, 卡片 } from "@/class/卡片";
import { SY块 } from "@/class/思源/块";
import {
  CanvasEvent,
  ComboEvent,
  Graph,
  IPointerEvent,
  NodeEvent,
} from "@antv/g6";
import { MutableRefObject } from "react";

export function 配置事件(参数: {
  图: Graph;
  当前节点: MutableRefObject<string>;
  当前组合: MutableRefObject<string>;
  选中的节点: string[];
  选中的组合: string[];
  获取所有卡片: () => Promise<void>;
}) {
  const {
    图,
    // 当前节点,
    当前组合,
    // 选中的节点,
    // 选中的组合,
    获取所有卡片,
  } = 参数;

  const 事件配置 = {
    [CanvasEvent.CLICK]: (e: any) => {},

    [NodeEvent.DRAG]: (e: IPointerEvent) => {},
    [NodeEvent.DRAG_END]: async (e: IPointerEvent) => {
      const { target } = e as any;
      const { id } = target;

      卡片.更新位置(id, {
        x: target.attributes.x,
        y: target.attributes.y,
      });

      if (当前组合.current) {
        await SY块.移动块({
          id,
          parentID: 当前组合.current,
        });

        await SY块.设置块属性({
          id,
          attrs: {
            [E卡片属性名称.父项ID]: 当前组合.current,
          },
        });

        await 获取所有卡片();
      }
    },

    //#region ComboEvent
    [ComboEvent.POINTER_OVER]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.POINTER_OVER:", e);
      const { target } = e as any;
      当前组合.current = target.id;
    },
    [ComboEvent.POINTER_LEAVE]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.POINTER_LEAVE:", e);
    },
    [ComboEvent.POINTER_OUT]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.POINTER_OUT:", e);
      当前组合.current = undefined;
    },
    [ComboEvent.POINTER_ENTER]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.POINTER_ENTER:", e);
    },
    [ComboEvent.POINTER_UP]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.POINTER_UP:", e);
    },
    [ComboEvent.DRAG_ENTER]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.DRAG_ENTER:", e);
    },
    [ComboEvent.DRAG_LEAVE]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.DRAG_LEAVE:", e);
    },
    [ComboEvent.DRAG_END]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.DRAG_END:", e);
    },
    [ComboEvent.DROP]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.DROP:", e);
    },
    //#endregion
  };

  Object.entries(事件配置).forEach(([event, callback]) => {
    图.on(event, (e) => callback(e as any));
  });
}
