import { 顶级节点 } from "@/constant/状态配置";
import { I事项, T层级 } from "../components/事项";

export function convertTo树(数据: I事项[]): I事项[] {
  const itemMap: I事项[] = [];

  数据.forEach((事项) => {
    itemMap[事项.id] = 事项;
  });

  const 树: I事项[] = [];

  数据.forEach((事项) => {
    if (!事项.父项.includes(顶级节点)) {
      if (itemMap[事项.父项]) {
        itemMap[事项.父项].子项.push(itemMap[事项.id]);
      }
    } else {
      树.push(itemMap[事项.id]);
    }
  });
  return 树;
}

export function 层级增加(层级: T层级) {
  return (层级 + 1) as T层级;
}
