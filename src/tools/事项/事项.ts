import { E事项状态 } from "@/constant/状态配置";
import { E时间格式化 } from "@/constant/配置常量";
import { I事项, T层级 } from "@/types/喧嚣/事项";
import { 生成块ID } from "@/utils/DOM";
import dayjs from "dayjs";

export function 生成事项(
  参数: {
    层级: T层级;
    父项ID: string;
    分类ID: string;
    领域ID: string;
    笔记本ID: string;
  } & Partial<I事项>
): I事项 {
  const 名称 = "未命名";
  const ID = 生成块ID();

  return {
    名称,
    重要程度: 5,
    紧急程度: 5,
    状态: E事项状态.未开始,
    重复: undefined,
    单开一页: false,
    提醒: false,
    逾期不再提醒: false,

    ID,
    标题区ID: 生成块ID(),
    信息区ID: 生成块ID(),
    内容区ID: 生成块ID(),
    嵌入块ID: 生成块ID(),
    创建时间: dayjs().format(E时间格式化.思源时间),
    更新时间: dayjs().format(E时间格式化.思源时间),
    ...参数,
  };
}
