import { TreeNode } from "@/components/TodoTree";
import { stringArr2string } from "@/utils/拼接与拆解";
import { 事项状态, 已完成, 进行中, 重复中, 顶级节点 } from "./状态配置";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { I事项Props } from "@/components/TodoTree/components/事项";

const 顶级节点公共属性 = {
  重要程度: NaN,
  紧急程度: NaN,
  开始时间: dayjs(NaN).format("YYYY-MM-DD"),
  结束时间: dayjs(NaN).format("YYYY-MM-DD"),
  重复: undefined,
};

export const TodoTree初始值: ({
  id: string;
  key: string;
  名称: string;
  子项?: TreeNode[];
} & I事项Props)[] = [
  {
    id: "1",
    key: stringArr2string([重复中, 顶级节点]),
    名称: "重复中",
    状态: 事项状态.重复中,
    ...顶级节点公共属性,
    子项: [
      {
        id: nanoid(),
        key: stringArr2string([重复中, "1", nanoid()]),
        checkable: true,
        名称: "重复中-1",
        重要程度: 1,
        紧急程度: 1,
        开始时间: dayjs().format("YYYY-MM-DD"),
        结束时间: dayjs().format("YYYY-MM-DD"),
        状态: 事项状态.重复中,
        重复: undefined,
      },
      {
        id: nanoid(),
        key: stringArr2string([重复中, "1", nanoid()]),
        checkable: true,
        名称: "重复中-1",
        重要程度: 1,
        紧急程度: 1,
        开始时间: dayjs().format("YYYY-MM-DD"),
        结束时间: dayjs().format("YYYY-MM-DD"),
        状态: 事项状态.重复中,
        重复: undefined,
      },
    ],
  },
  {
    id: "2",
    key: stringArr2string([进行中, 顶级节点]),
    名称: "进行中",
    状态: 事项状态.进行中,
    ...顶级节点公共属性,
  },
  {
    id: "3",
    key: stringArr2string([已完成, 顶级节点]),
    名称: "已完成",
    状态: 事项状态.已完成,
    ...顶级节点公共属性,
  },
];
