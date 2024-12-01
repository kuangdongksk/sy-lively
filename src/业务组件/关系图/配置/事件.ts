import { ComboEvent, Graph, IPointerEvent, NodeEvent } from "@antv/g6";
import { MutableRefObject } from "react";

export function 配置事件(参数: {
  图: Graph;
  卡片文档ID: string;
  当前节点: MutableRefObject<string>;
  当前组合: MutableRefObject<string>;
  是否穿越: MutableRefObject<number>;
  更改的卡片ID列表: MutableRefObject<Set<string>>;
  选中的节点: string[];
  选中的组合: string[];
  获取所有卡片: () => Promise<void>;
}) {
  const {
    图,
    // 卡片文档ID,
    // 当前节点,
    // 当前组合,
    是否穿越,
    更改的卡片ID列表,
    // 选中的节点,
    // 选中的组合,
    // 获取所有卡片,
  } = 参数;

  const 节点组合拖拽完成 = async (e: IPointerEvent) => {
    const { target, targetType } = e as any;
    const { id } = target;

    if (targetType === "node") {
      更改的卡片ID列表.current.add(id);
    } else {
      const 递归添加子节点 = (节点ID: string) => {
        if (更改的卡片ID列表.current.has(节点ID)) return;
        更改的卡片ID列表.current.add(节点ID);

        const 子节点数据 = 图.getChildrenData(节点ID);
        if (子节点数据) {
          子节点数据.forEach((子节点) => {
            更改的卡片ID列表.current.add(子节点.id);
            if (子节点.data.单开一页) {
              递归添加子节点(子节点.id);
            }
          });
        }
      };

      递归添加子节点(id);
    }
  };

  const 事件配置 = {
    //#region CanvasEvent
    // [CanvasEvent.CLICK]: (e: any) => {},

    //#endregion

    //#region NodeEvent
    // [NodeEvent.DRAG]: (e: IPointerEvent) => {},
    [NodeEvent.DRAG_END]: async (e: IPointerEvent) => {
      节点组合拖拽完成(e);
    },
    // [NodeEvent.DRAG_ENTER]: async (e: IPointerEvent) => {
    // },
    //#endregion

    //#region ComboEvent
    // [ComboEvent.POINTER_OVER]: (e: IPointerEvent) => {},
    // [ComboEvent.POINTER_LEAVE]: (e: IPointerEvent) => {},
    // [ComboEvent.POINTER_ENTER]: (e: IPointerEvent) => {},
    // [ComboEvent.POINTER_OUT]: (e: IPointerEvent) => {},
    // [ComboEvent.POINTER_UP]: (e: IPointerEvent) => {},
    [ComboEvent.DRAG_ENTER]: (e: IPointerEvent) => {
      是否穿越.current -= 1;
    },
    [ComboEvent.DRAG_LEAVE]: (e: IPointerEvent) => {
      是否穿越.current += 1;
    },
    [ComboEvent.DRAG_END]: (e: IPointerEvent) => {
      节点组合拖拽完成(e);
    },
    // [ComboEvent.DROP]: (e: IPointerEvent) => {},
    //#endregion
  };

  Object.entries(事件配置).forEach(([event, callback]) => {
    图.on(event, (e) => callback(e as any));
  });
}
