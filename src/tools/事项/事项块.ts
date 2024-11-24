import SQLer from "@/class/SQLer";
import Kramdown助手 from "@/class/块/Kramdown助手";
import { SY块 } from "@/class/思源/块";
import SY文档 from "@/class/思源/文档";
import {
  根据事项生成信息块,
  生成事项块Kramdown,
} from "@/components/模板/Kramdown/超级块";
import { E时间格式化 } from "@/constant/配置常量";
import { I事项 } from "@/types/喧嚣/事项";
import { I用户设置 } from "@/types/喧嚣/设置";
import dayjs from "dayjs";
import { 事项转为属性 } from "./事项";

export async function 插入到日记(ID: string, 用户设置: I用户设置) {
  const { id: 日记文档ID } = await SY文档.获取对应日期的日记文档(
    用户设置.笔记本ID,
    dayjs(dayjs(), E时间格式化.思源时间)
  );

  await SY块.插入前置子块({
    dataType: "markdown",
    data: Kramdown助手.生成嵌入块(ID),
    parentID: 日记文档ID,
  });
}

export async function 新建事项块(事项: I事项) {
  const { 父项ID } = 事项;

  await SY块.插入后置子块({
    dataType: "markdown",
    data: 生成事项块Kramdown(事项),
    parentID: 父项ID,
  });

  await SY块.设置块属性({
    id: 事项.ID,
    attrs: 事项转为属性(事项),
  });
}

export async function 新建事项文档(事项: I事项) {
  const { 名称, 父项ID, 笔记本ID } = 事项;
  const 块数据 = await SQLer.根据ID获取块(父项ID);
  const { data: 文档ID } = await SY文档.通过Markdown创建(
    笔记本ID,
    块数据.hpath + "/" + 名称,
    ""
  );
  事项.ID = 文档ID;

  await Promise.all([
    await SY块.插入前置子块({
      dataType: "markdown",
      data: 生成事项块Kramdown(事项),
      parentID: 文档ID,
    }),
    await SY块.设置块属性({
      id: 文档ID,
      attrs: 事项转为属性(事项),
    }),
  ]);
}

export async function 更新事项块(事项: I事项) {
  const { ID, 笔记本ID, 名称, 单开一页 } = 事项;
  const 更新标题 = 单开一页
    ? async () => await SY文档.重命名(笔记本ID, ID, 名称)
    : async () =>
        await SY块.更新块({
          id: 事项.标题区ID,
          data: Kramdown助手.生成标题块({
            标题: 事项.名称,
            层级: 事项.层级,
            id: 事项.标题区ID,
          }),
          dataType: "markdown",
        });

  const 结果 = await Promise.all([
    // 更新块属性
    await SY块.设置块属性({
      id: 事项.ID,
      attrs: 事项转为属性(事项),
    }),
    // 更新标题块、信息快
    更新标题(),
    await SY块.更新块({
      id: 事项.信息区ID,
      data: 根据事项生成信息块(事项),
      dataType: "markdown",
    }),
  ]);
  if (
    结果.some((res) => {
      if (!res) return false;
      return res.code !== 0;
    })
  ) {
    console.error("更新事项块失败", 事项, 结果);
  }
}

export async function 时间格式处理(事项: I事项) {
  if (事项.开始时间.includes(":"))
    事项.开始时间 = dayjs(事项.开始时间).format(E时间格式化.思源时间);
  if (事项.结束时间.includes(":"))
    事项.结束时间 = dayjs(事项.结束时间).format(E时间格式化.思源时间);
}
