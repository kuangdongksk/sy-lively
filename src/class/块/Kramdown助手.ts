import { E块属性名称 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { 生成块ID } from "@/utils/DOM";
import dayjs from "dayjs";

/** 开头结尾没有\n */
export type TKramdown块 = string;
/** 开头结尾没有\n */
export type TKramdownAttr = string;
/** 开头结尾没有\n
 * 由  TKramdown块\nTKramdownAttr  组成
 */
export type TKramdown = `${TKramdown块}\n${TKramdownAttr}`;

export default class Kramdown助手 {
  //#region 属性
  public static 生成基本属性(id?: string): TKramdownAttr {
    return `{: id="${id ?? 生成块ID()}" updated="${dayjs().format(
      E时间格式化.思源时间
    )}"}`;
  }

  //#endregion

  public static 生成标题块(参数: {
    标题: string;
    层级: number;
    id?: string;
  }): TKramdown {
    const { 标题, 层级, id } = 参数;

    return `${"#".repeat(层级)} ${标题}\n${this.生成基本属性(id)}`;
  }

  public static 生成引用块(内容: string, id?: string): TKramdown {
    return `> ${内容}\n> ${this.生成基本属性(id)}`;
  }

  public static 生成段落块(内容: string, id?: string): TKramdown {
    return `${内容}\n${this.生成基本属性(id)}`;
  }

  public static 生成超级块(Kramdown内容数组: string[]): TKramdown块 {
    return `{{{row\n${Kramdown内容数组.join("\n\n")}\n\n}}}`;
  }

  public static 生成超级块带属性(Kramdown内容数组: TKramdown[], id?: string) {
    return `${this.生成超级块(Kramdown内容数组)}\n${this.生成基本属性(id)}`;
  }

  private static 根据对象生成属性(
    对象: {
      [key: string]: string | number | boolean;
      ID: string;
    },
    属性名称: E块属性名称
  ): TKramdownAttr {
    const 属性字符串 = Object.entries(对象)
      .map(([key, value]) => {
        if (typeof value === "number") {
          return `&quot;${key}&quot;:${value}`;
        }
        return `&quot;${key}&quot;:&quot;${value}&quot;`;
      })
      .join(",");

    return `{: ${属性名称}="&#123;${属性字符串}&#125;" id="${
      对象.ID
    }" updated="${dayjs().format(E时间格式化.思源时间)}"}`;
  }

  public static 为块添加属性(
    Kramdown块: TKramdown块,
    对象: {
      ID: string;
      [key: string]: any;
    },
    属性名称: E块属性名称
  ): TKramdown {
    return `${Kramdown块}\n${this.根据对象生成属性(对象, 属性名称)}`;
  }

  public static 生成嵌入块(ID: string, 嵌入块ID?: string): TKramdown {
    return `{{select * from blocks where id='${ID}'}}\n{: id="${
      嵌入块ID ?? 生成块ID()
    }" updated="${dayjs().format(E时间格式化.思源时间)}"}`;
  }
}
