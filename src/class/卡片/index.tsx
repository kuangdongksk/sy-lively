import { E块属性名称 } from "@/constant/系统码";
import { 根据枚举的值获取枚举的键 } from "@/utils/枚举";
import { fetchSyncPost } from "siyuan";

export const 卡片属性前缀 = `${E块属性名称.卡片}-`;

export enum E卡片属性名称 {
  ID = `${卡片属性前缀}id`,
  标题 = `${卡片属性前缀}name`,
  标题ID = `${卡片属性前缀}titleId`,
  描述 = `${卡片属性前缀}description`,
  别名 = `${卡片属性前缀}alias`,
  领域分类 = `${卡片属性前缀}domainCategory`,
}

export interface I卡片 {
  ID: string;
  标题: string;
  标题ID: string;
  描述: string;
  别名: string[];
  领域分类: string[];
}

export class 卡片 {
  private static 生成卡片SQL(条件数组?: string[]) {
    const 条件 = 条件数组 ? "WHERE " + 条件数组.join(" AND ") : "";

    return `
      SELECT
        卡片
      FROM
        (
          SELECT
            block_id,
            '{' || GROUP_CONCAT('"' || name || '":"' || value || '"', ',') || '}' AS 卡片
          FROM
            attributes
          WHERE
            name LIKE '%${卡片属性前缀}%'
          GROUP BY
            block_id
        )
      ${条件}
    `;
  }

  public static 卡片转为属性(卡片: I卡片): { [key in E卡片属性名称]: string } {
    const 卡片属性 = {} as { [key in E卡片属性名称]: string };
    Object.keys(卡片).forEach((key) => {
      if (卡片[key] === undefined) {
        return;
      }
      卡片属性[E卡片属性名称[key]] = 卡片[key]?.toString();
    });
    return 卡片属性;
  }

  private static 属性转为卡片(属性: { [key in E卡片属性名称]: string }): I卡片 {
    const 卡片 = {} as I卡片;
    Object.keys(属性).forEach((key) => {
      if (属性[key] === undefined) {
        return;
      }

      卡片[根据枚举的值获取枚举的键(E卡片属性名称, key)] = 属性[key];
    });
    return 卡片;
  }

  public static 原始结果转为卡片(原始结果: { 卡片: string }[]): I卡片[] {
    if (!原始结果) return [];

    return 原始结果.map((item) => this.属性转为卡片(JSON.parse(item.卡片)));
  }

  public static async 获取所有卡片(): Promise<I卡片[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL(),
    });

    return this.原始结果转为卡片(data);
  }

  public static async 获取卡片通过关键词(关键词: string): Promise<I卡片[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL([`卡片 LIKE '%${关键词}%'`]),
    });

    return this.原始结果转为卡片(data);
  }
}
