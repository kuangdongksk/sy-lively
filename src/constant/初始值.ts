import { TreeNode } from "@/components/任务树";
import { I事项, T层级 } from "@/components/任务树/components/事项";
import { stringArr2string } from "@/utils/拼接与拆解";
import dayjs from "dayjs";
import { 事项状态, 已完成, 进行中, 重复中, 顶级节点 } from "./状态配置";
import { nanoid } from "nanoid";

export const 任务树初始值: ({
  id: string;
  key: string;
  名称: string;
  子项?: TreeNode[];
} & I事项)[] = [
  {
    id: nanoid(),
    key: stringArr2string([重复中, 顶级节点]),
    名称: "重复中",
    状态: 事项状态.重复中,
    父项: stringArr2string([重复中, 顶级节点]),
  },
  {
    id: nanoid(),
    key: stringArr2string([进行中, 顶级节点]),
    名称: "进行中",
    状态: 事项状态.进行中,
    父项: stringArr2string([进行中, 顶级节点]),
  },
  {
    id: nanoid(),
    key: stringArr2string([已完成, 顶级节点]),
    名称: "已完成",
    状态: 事项状态.已完成,
    父项: stringArr2string([已完成, 顶级节点]),
  },
].map((item) => ({
  ...item,
  重要程度: NaN,
  紧急程度: NaN,
  开始时间: dayjs(NaN),
  结束时间: dayjs(NaN),
  重复: undefined,
  checkable: false,
  子项: [],
  层级: 0 as T层级,
}));

export const 各层级数量初始值 = [3, 2, 0, 0, 0, 0];
