import { 生成块ID } from "@/utils/DOM";
import KH from "../块/Kramdown助手";
import { E块属性名称 } from "@/constant/系统码";
import { 插入后置子块 } from "@/API/块数据";

export class 卡片块 {
  private static 生成卡片Kramdown(id: string): string {
    const 标题区ID = 生成块ID();

    const 标题块 = KH.生成标题块({
      标题: "卡片",
      层级: 6,
      id: 标题区ID,
    });
    const 段落块 = KH.生成段落块(
      "请保持外层的超级块存在，即该块和标题块同时存在"
    );

    return KH.为块添加属性(
      KH.生成超级块([标题块, 段落块]),
      {
        ID: id,
      },
      E块属性名称.卡片
    );
  }

  public static async 新建卡片(父项ID: string): Promise<string> {
    const 卡片块ID = 生成块ID();

    await 插入后置子块({
      dataType: "markdown",
      data: this.生成卡片Kramdown(卡片块ID),
      parentID: 父项ID,
    });

    this.生成卡片Kramdown(卡片块ID);

    return 卡片块ID;
  }
}
