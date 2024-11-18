import { 插入后置子块, 设置块属性 } from "@/API/块数据";
import { E块属性名称 } from "@/constant/系统码";
import { I卡片, 卡片 as 卡片类 } from ".";
import KH from "../块/Kramdown助手";

export class 卡片块 {
  private static 生成卡片Kramdown(卡片: I卡片): string {
    const { 标题, 标题ID, 描述 } = 卡片;

    const 标题块 = KH.生成标题块({
      标题: 标题,
      层级: 6,
      id: 标题ID,
    });
    const 段落块 = KH.生成段落块(描述);

    return KH.为块添加属性(
      KH.生成超级块([标题块, 段落块]),
      卡片,
      E块属性名称.卡片
    );
  }

  public static async 新建卡片(卡片: I卡片, 父项ID: string): Promise<string> {
    const { ID, 标题, 别名 } = 卡片;
    await 插入后置子块({
      dataType: "markdown",
      data: this.生成卡片Kramdown(卡片),
      parentID: 父项ID,
    });

    await 设置块属性({
      id: ID,
      attrs: {
        [E块属性名称.名称]: 标题,
        [E块属性名称.别名]: 别名.join(","),
        [E块属性名称.卡片]: JSON.stringify(卡片),
        ...卡片类.卡片转为属性(卡片),
      },
    });

    return ID;
  }
}
