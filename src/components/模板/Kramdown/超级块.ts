import Kramdown助手, { TKramdownAttr } from "@/class/Kramdown助手";
import { E块属性名称 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { I事项 } from "@/types/喧嚣/事项";
import dayjs from "dayjs";

export function 根据事项生成信息块(事项: I事项) {
  return `#${事项.ID.slice(-6)}  重要程度：${事项.重要程度}  紧急程度：${
    事项.紧急程度
  }  开始时间：${dayjs(事项.开始时间).format(
    E时间格式化.日记格式
  )}  结束时间：${dayjs(事项.结束时间).format(E时间格式化.日记格式)}`;
}

export function 生成事项块Kramdown(事项: I事项) {
  const { 名称, 层级, 标题区ID, 信息区ID, 内容区ID, 单开一页 } = 事项;

  if (单开一页) {
    return Kramdown助手.生成引用块(根据事项生成信息块(事项), 信息区ID);
  }

  const 标题块 = Kramdown助手.生成标题块({
    标题: 名称,
    层级: 层级,
    id: 标题区ID,
  });
  const 信息块 = Kramdown助手.生成引用块(根据事项生成信息块(事项), 信息区ID);

  const 内容区 = Kramdown助手.生成超级块带属性(
    [
      Kramdown助手.生成段落块("从这里开始(这一行内容可以更改"),
      Kramdown助手.生成段落块("不要写在超级块外边(这一行内容可以更改"),
    ],
    内容区ID
  );

  const 事项块 = Kramdown助手.生成超级块([标题块, 信息块, 内容区]);

  return 事项块 + "\n" + 根据事项生成属性(事项);
}

export function 根据事项生成属性(事项: I事项): TKramdownAttr {
  const 属性字符串 = Object.entries(事项)
    .map(([key, value]) => {
      if (typeof value === "number") {
        return `&quot;${key}&quot;:${value}`;
      }
      return `&quot;${key}&quot;:&quot;${value}&quot;`;
    })
    .join(",");

  return `{: ${E块属性名称.事项}="&#123;${属性字符串}&#125;" id="${
    事项.ID
  }" updated="${dayjs().format(E时间格式化.思源时间)}"}`;
}
