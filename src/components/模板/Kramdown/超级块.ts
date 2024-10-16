import { E时间格式化 } from "@/constant/配置常量";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import dayjs from "dayjs";
import {
  TKramdownAttr,
  生成段落块,
  生成超级块,
  生成超级块带属性,
} from "./基础";

export function 根据事项生成信息块(事项: I事项) {
  return `${事项.名称}[${事项.ID.slice(0, 6)}]()重要程度${
    事项.重要程度
  } 紧急程度${事项.紧急程度} 开始时间${dayjs(事项.开始时间).format(
    E时间格式化.日记格式
  )}结束时间${dayjs(事项.结束时间).format(E时间格式化.日记格式)}`;
}

export function 生成事项块Kramdown(事项: I事项) {
  const 信息块 = 生成段落块(根据事项生成信息块(事项), 事项.标题区ID);

  const 内容区 = 生成超级块带属性(
    [
      生成段落块("从这里开始(这一行内容可以更改"),
      生成段落块("不要写在超级块外边(这一行内容可以更改"),
    ],
    事项.内容区ID
  );

  const 事项块 = 生成超级块([信息块, 内容区]);

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

  return `{: custom-plugin-lively-things="&#123;${属性字符串}&#125;" id="${
    事项.ID
  }" updated="${dayjs().format(E时间格式化.思源时间)}"}`;
}
