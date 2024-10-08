import { TreeNode } from "@/components/TodoTree";
import { stringArr2string } from "@/utils/拼接与拆解";
import { 已完成, 进行中, 重复中, 顶级节点 } from "./状态配置";

export const TodoTree初始值: TreeNode[] = [
  {
    id: "1",
    key: stringArr2string([重复中, 顶级节点]),
    名称: "重复中",
    children: [
      {
        key: stringArr2string([重复中, "1"]),
        名称: "重复中-1",
        checkable: true,
      },
      {
        key: stringArr2string([重复中, "2"]),
        title: "重复中-2",
        checkable: true,
      },
    ],
  },
  {
    id: "2",
    key: stringArr2string([进行中, 顶级节点]),
    名称: "进行中",
    children: [],
  },
  {
    id: "3",
    key: stringArr2string([已完成, 顶级节点]),
    名称: "已完成",
    children: [],
  },
];
