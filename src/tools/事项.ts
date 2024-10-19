import { E事项状态 } from "@/constant/状态配置";
import { I事项, T层级 } from "@/pages/主页/components/事项树/components/事项";
import { 生成块ID } from "@/utils/DOM";
import { stringArr2string } from "@/utils/拼接与拆解";
import dayjs from "dayjs";

export function 生成事项(
  参数: {
    层级: T层级;
    领域ID: string;
    父项ID: string;
  } & Partial<I事项>
): I事项 {
  const 名称 = "未命名";
  const ID = 生成块ID();

  return {
    名称,
    重要程度: 5,
    紧急程度: 5,
    开始时间: dayjs().valueOf(),
    结束时间: dayjs().add(1, "hour").valueOf(),
    状态: E事项状态.未开始,
    重复: undefined,

    ID,
    key: stringArr2string([E事项状态.未开始, 名称, ID]),
    标题区ID: 生成块ID(),
    信息区ID: 生成块ID(),
    内容区ID: 生成块ID(),
    嵌入块ID: 生成块ID(),
    创建时间: dayjs().valueOf(),
    更新时间: dayjs().valueOf(),
    ...参数,
  };
}
