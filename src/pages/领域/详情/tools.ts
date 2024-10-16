import { 插入前置子块, 插入后置子块, 更新块 } from "@/API/块数据";
import { 生成嵌入块Kramdown } from "@/components/模板/Kramdown/嵌入快";
import { 更新超级块, 生成超级块 } from "@/components/模板/Kramdown/超级块";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";

export async function 新建事项块(事项: I事项) {
  await 插入后置子块({
    dataType: "markdown",
    data: 生成超级块(事项),
    parentID: 事项.父项ID,
  });

  await 插入前置子块({
    dataType: "markdown",
    data: 生成嵌入块Kramdown(事项),
    parentID: 事项.父项ID,
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
