import { 插入前置子块, 插入后置子块, 更新块, 设置块属性 } from "@/API/块数据";
import CL文档 from "@/API/文档";
import Kramdown助手 from "@/class/Kramdown助手";
import { 生成嵌入块Kramdown } from "@/components/模板/Kramdown/嵌入快";
import {
  根据事项生成信息块,
  生成事项块Kramdown,
} from "@/components/模板/Kramdown/超级块";
import { E块属性名称 } from "@/constant/系统码";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import { I用户设置 } from "@/types/喧嚣";
import dayjs from "dayjs";

export async function 新建事项块(事项: I事项, 用户设置: I用户设置) {
  await 插入后置子块({
    dataType: "markdown",
    data: 生成事项块Kramdown(事项),
    parentID: 事项.父项ID,
  });

  const { id: 日记文档ID } = await CL文档.获取对应日期的日记文档(
    用户设置.笔记本ID,
    dayjs(事项.开始时间)
  );

  await 插入前置子块({
    dataType: "markdown",
    data: 生成嵌入块Kramdown(事项),
    parentID: 日记文档ID,
  });
}

export async function 更新事项块(事项: I事项) {
  await Promise.all([
    // 更新块属性
    设置块属性({
      id: 事项.ID,
      attrs: {
        [E块属性名称.事项]: JSON.stringify(事项),
      },
    }),
    // 更新标题块、信息快
    更新块({
      id: 事项.标题区ID,
      data: Kramdown助手.生成标题块({
        标题: 事项.名称,
        层级: 事项.层级,
        id: 事项.标题区ID,
      }),
      dataType: "markdown",
    }),

    更新块({
      id: 事项.信息区ID,
      data: 根据事项生成信息块(事项),
      dataType: "markdown",
    }),
  ]);
}
