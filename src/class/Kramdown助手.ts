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
}
