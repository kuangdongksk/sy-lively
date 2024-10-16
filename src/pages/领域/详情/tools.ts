import { 插入前置子块, 插入后置子块 } from "@/API/块数据";
import { 获取笔记本下的对应日期的日记文档 } from "@/API/文档/获取";
import { 生成嵌入块Kramdown } from "@/components/模板/Kramdown/嵌入快";
import { 更新超级块, 生成超级块 } from "@/components/模板/Kramdown/超级块";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import { I用户设置 } from "@/types/喧嚣";
import dayjs from "dayjs";

export async function 新建事项块(事项: I事项, 用户设置: I用户设置) {
  await 插入后置子块({
    dataType: "markdown",
    data: 生成超级块(事项),
    parentID: 事项.父项ID,
  });

  const { id: 日记文档ID } = await 获取笔记本下的对应日期的日记文档(
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
  const 更新后的Kramdown = await 更新超级块(事项);
  // await 更新块({
  //   id: 事项.ID,
  //   data: 更新后的Kramdown,
  //   dataType: "markdown",
  // });
}
