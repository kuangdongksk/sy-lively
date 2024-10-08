import { TreeDataNode } from "antd";
import { 已完成, 进行中, 重复中, 顶级节点 } from "./状态配置";
import { stringArr2string } from "@/utils/拼接与拆解";

export const TodoTree初始值: (TreeDataNode & { key: string })[] = [
  {
    key: stringArr2string([重复中, 顶级节点]),
    title: "重复中",
    children: [
      {
        key: stringArr2string([重复中, "1"]),
        title: "重复中-1",
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
    key: stringArr2string([进行中, 顶级节点]),
    title: "进行中",
    children: [],
  },
  {
    key: stringArr2string([已完成, 顶级节点]),
    title: "已完成",
    children: [],
  },
];
