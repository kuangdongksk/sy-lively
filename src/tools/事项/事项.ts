import { E事项状态, E提醒 } from "@/constant/状态配置";
import { E事项属性名称 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { I事项, T层级 } from "@/types/喧嚣/事项";
import { 生成块ID } from "@/utils/DOM";
import { 根据枚举的值获取枚举的键 } from "@/utils/枚举";
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
    提醒: E提醒.不提醒,
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

export function 事项转为属性(事项: I事项) {
  const 事项属性 = {};
  Object.keys(事项).forEach((key) => {
    if (事项[key] === undefined) {
      return;
    }
    事项属性[E事项属性名称[key]] = 事项[key]?.toString();
  });
  return 事项属性;
}

const 布尔型属性 = [E事项属性名称.单开一页, E事项属性名称.逾期不再提醒];
const 数字型属性 = [
  E事项属性名称.重要程度,
  E事项属性名称.紧急程度,
  E事项属性名称.层级,
];

export function 属性转化为事项(属性: { [key: string]: string }): I事项 {
  const 事项 = {} as I事项;

  Object.keys(属性).forEach((key) => {
    let 值: number | string | boolean = 属性[key];

    if (数字型属性.includes(key as E事项属性名称)) {
      值 = parseInt(值);
    }
    if (布尔型属性.includes(key as E事项属性名称)) {
      值 = 值 === "true";
    }

    事项[根据枚举的值获取枚举的键(E事项属性名称, key)] = 值;
  });
  return 事项;
}
