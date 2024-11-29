import { E卡片属性名称, 卡片 } from "@/class/卡片";
import { SY块 } from "@/class/思源/块";
import SY文档 from "@/class/思源/文档";
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
  卡片文档ID: string;
  当前节点: MutableRefObject<string>;
  当前组合: MutableRefObject<string>;
  是否穿越: MutableRefObject<number>;
  选中的节点: string[];
  选中的组合: string[];
  获取所有卡片: () => Promise<void>;
}) {
  const {
    图,
    卡片文档ID,
    // 当前节点,
    是否穿越,
    当前组合,
    // 选中的节点,
    // 选中的组合,
    获取所有卡片,
  } = 参数;

  const 节点组合拖拽完成 = async (e: IPointerEvent) => {
    const { target, targetType } = e as any;
    const { id } = target;

    卡片.更新位置(id, {
      x: target.attributes.x,
      y: target.attributes.y,
    });

    console.log(
      "🚀 ~ const节点组合拖拽完成= ~ 是否穿越.current:",
      是否穿越.current
    );
    if (是否穿越.current !== 0) {
      if (targetType === "node") {
        await SY块.移动块({
          id,
          parentID: 当前组合.current,
        });
      } else {
        await SY文档.移动(id, 当前组合.current);
      }

      await SY块.设置块属性({
        id,
        attrs: {
          [E卡片属性名称.父项ID]: 当前组合.current,
        },
      });

      await 获取所有卡片();
    }
  };

  const 事件配置 = {
    //#region CanvasEvent
    [CanvasEvent.CLICK]: (e: any) => {},

    //#endregion

    //#region NodeEvent
    [NodeEvent.DRAG]: (e: IPointerEvent) => {},
    [NodeEvent.DRAG_END]: async (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.DRAG_END:", e);
      节点组合拖拽完成(e);
    },
    [NodeEvent.DRAG_ENTER]: async (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.DRAG_ENTER:", e);
    },
    //#endregion

    //#region ComboEvent
    [ComboEvent.POINTER_OVER]: (e: IPointerEvent) => {
      // console.log("🚀 ~ ComboEvent.POINTER_OVER:", e);
    },
    [ComboEvent.POINTER_LEAVE]: (e: IPointerEvent) => {
      // console.log("🚀 ~ ComboEvent.POINTER_LEAVE:", e);
    },
    [ComboEvent.POINTER_ENTER]: (e: IPointerEvent) => {
      // console.log("🚀 ~ ComboEvent.POINTER_ENTER:", e);
    },
    [ComboEvent.POINTER_OUT]: (e: IPointerEvent) => {
      // console.log("🚀 ~ ComboEvent.POINTER_OUT:", e);
    },
    [ComboEvent.POINTER_UP]: (e: IPointerEvent) => {
      // // console.log("🚀 ~ ComboEvent.POINTER_UP:", e);
    },
    [ComboEvent.DRAG_ENTER]: (e: IPointerEvent) => {
      console.log("🚀 ~ ComboEvent.DRAG_ENTER:", e);
      const { target } = e as any;
      当前组合.current = target.id;
      是否穿越.current -= 1;
    },
    [ComboEvent.DRAG_LEAVE]: (e: IPointerEvent) => {
      当前组合.current = 卡片文档ID;
      是否穿越.current += 1;
    },
    [ComboEvent.DRAG_END]: (e: IPointerEvent) => {
      // // console.log("🚀 ~ ComboEvent.DRAG_END:", e);
      节点组合拖拽完成(e);
    },
    [ComboEvent.DROP]: (e: IPointerEvent) => {
      // // console.log("🚀 ~ ComboEvent.DROP:", e);
    },
    //#endregion
  };

  Object.entries(事件配置).forEach(([event, callback]) => {
    图.on(event, (e) => callback(e as any));
  });
}
