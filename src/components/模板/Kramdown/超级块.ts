import { E时间格式化 } from "@/constant/配置常量";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import { 生成块ID } from "@/utils/DOM";
import dayjs from "dayjs";

export function 生成超级块(事项: I事项) {
  const 第一行 = `${事项.名称}[${事项.id.slice(0, 6)}]()重要程度${
    事项.重要程度
  } 紧急程度${事项.紧急程度} 开始时间${dayjs(事项.开始时间).format(
    E时间格式化.日记格式
  )}结束时间${dayjs(事项.结束时间).format(
    E时间格式化.日记格式
  )}\n{: id="${生成块ID()}" updated="${dayjs().format(E时间格式化.思源时间)}"}`;

  const 内容区 = `事项详情...\n{: updated="${dayjs().format(
    E时间格式化.思源时间
  )}" id="${生成块ID()}"}`;

  const 超级块 = `{{{row\n${第一行}\n\n${内容区}\n\n}}}\n`;
  const 超级块的属性 = `{: custom-plugin-lively-things="&#123;&quot;名称&quot;:&quot;${
    事项.名称
  }&quot;,&quot;重要程度&quot;:${事项.重要程度},&quot;紧急程度&quot;:${
    事项.紧急程度
  },&quot;开始时间&quot;:${事项.开始时间},&quot;结束时间&quot;:${
    事项.结束时间
  },&quot;状态&quot;:&quot;${事项.状态}&quot;,&quot;层级&quot;:${
    事项.层级
  },&quot;id&quot;:&quot;${事项.id}&quot;,&quot;key&quot;:&quot;${
    事项.key
  }&quot;,&quot;子项&quot;:[],&quot;父项&quot;:&quot;${
    事项.父项
  }&quot;,&quot;领域&quot;:&quot;${事项.领域}&quot;,&quot;创建时间&quot;:${
    事项.创建时间
  },&quot;更新时间&quot;:${事项.更新时间},&quot;index&quot;:0&#125;" id="${
    事项.id
  }" updated="${dayjs().format(E时间格式化.思源时间)}"}`;

  return 超级块 + 超级块的属性;
}
