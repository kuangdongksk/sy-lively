import { SY块 } from "@/class/思源/块";
import { E块属性名称 } from "@/constant/系统码";
import { I卡片, CardQueryService as 卡片类 } from "./CardQueryService";
import SQLer from "../../class/helper/SQLer";
import { default as KH } from "../../class/helper/Kramdown助手";
import SY文档 from "../../class/思源/文档";

export class CardGenerateService {
  public static generateCardKramdown(
    卡片: Partial<I卡片> & {
      ID: string;
      标题ID: string;
      标题: string;
    }
  ): string {
    const { ID, 标题, 标题ID } = 卡片;

    const 标题块 = KH.生成标题块({
      标题: 标题,
      层级: 6,
      id: 标题ID,
    });
    const 段落块 = KH.生成段落块("");

    return KH.生成超级块带属性([标题块, 段落块], ID);
  }

  public static async createCard(
    卡片: I卡片 & { subContent: string },
    卡片文档ID: string
  ): Promise<string> {
    if (卡片.单开一页) {
      return await this.新建卡片文档(卡片, 卡片文档ID);
    } else {
      return await this.新建卡片块(卡片, 卡片文档ID);
    }
  }

  private static async 新建卡片块(
    卡片: I卡片,
    卡片文档ID: string
  ): Promise<string> {
    const { ID, 标题, 别名 } = 卡片;

    await SY块.设置块属性({
      id: ID,
      attrs: {
        [E块属性名称.名称]: 标题,
        [E块属性名称.别名]: 别名.join(","),
        ...卡片类.卡片转为属性(卡片),
      },
    });

    const { data } = await SY块.获取子块(卡片文档ID);

    await SY块.移动块({
      id: ID,
      parentID: 卡片文档ID,
      previousID: data[data.length - 1]?.id ?? undefined,
    });

    return ID;
  }

  private static async 新建卡片文档(
    卡片: I卡片 & { subContent: string },
    卡片文档ID: string
  ): Promise<string> {
    const { 标题, 别名 } = 卡片;
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
        data: 卡片.subContent,
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
