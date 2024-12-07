import { SY块 } from "@/class/思源/块";
import { E块属性名称 } from "@/constant/系统码";
import { I卡片, 卡片 as 卡片类 } from ".";
import SQLer from "../SQLer";
import { default as KH, default as Kramdown助手 } from "../块/Kramdown助手";
import SY文档 from "../思源/文档";

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

  public static async 新建卡片(
    卡片: I卡片,
    卡片文档ID: string
  ): Promise<string> {
    if (卡片.单开一页) {
      return await this.新建卡片文档(卡片, 卡片文档ID);
    } else {
      return await this.新建卡片块(卡片, 卡片文档ID);
    }
  }

  public static async 新建卡片块(
    卡片: I卡片,
    卡片文档ID: string
  ): Promise<string> {
    const { ID, 标题, 别名 } = 卡片;
    await SY块.插入后置子块({
      dataType: "markdown",
      data: this.生成卡片Kramdown(卡片),
      parentID: 卡片文档ID,
    });

    await SY块.设置块属性({
      id: ID,
      attrs: {
        [E块属性名称.名称]: 标题,
        [E块属性名称.别名]: 别名.join(","),
        ...卡片类.卡片转为属性(卡片),
      },
    });

    return ID;
  }

  public static async 新建卡片文档(
    卡片: I卡片,
    卡片文档ID: string
  ): Promise<string> {
    const { 标题, 描述, 别名 } = 卡片;
    const 块数据 = await SQLer.根据ID获取块(卡片文档ID);

    const { data: 文档ID } = await SY文档.通过Markdown创建(
      块数据.box,
      块数据.hpath + "/" + 标题,
      ""
    );

    卡片.ID = 文档ID;

    await Promise.all([
      await SY块.插入前置子块({
        dataType: "markdown",
        data: Kramdown助手.生成段落块(描述),
        parentID: 文档ID,
      }),
      await SY块.设置块属性({
        id: 文档ID,
        attrs: {
          [E块属性名称.名称]: 标题,
          [E块属性名称.别名]: 别名.join(","),
          ...卡片类.卡片转为属性(卡片),
        },
      }),
    ]);
    return 文档ID;
  }
}
