export const 分隔符 = "$分$";

//#region 用户状态

export const 未开始 = "u未开始";
export const 重复中 = "u重复中";
export const 进行中 = "u进行中";
export const 已完成 = "u已完成";
export enum 事项状态 {
  未开始 = "u未开始",
  重复中 = "u重复中",
  进行中 = "u进行中",
  已完成 = "u已完成",
}

//#endregion
//#region 交互状态
/** 顶级节点不允许放置其他顶级节点 */
export const 顶级节点 = "$顶级节点";
export const 允许拖动 = "$允许拖动";
export const 禁止拖动 = "$禁止拖动";

export const 允许编辑 = "$允许编辑";
export const 禁止编辑 = "$禁止编辑";
//#endregion
