import { E块属性名称 } from "@/constant/系统码";
import { 根据枚举的值获取枚举的键 } from "@/utils/枚举";
import { fetchSyncPost } from "siyuan";
import SY文档 from "../思源/文档";

export const 卡片属性前缀 = `${E块属性名称.卡片}-`;

export enum E卡片属性名称 {
  ID = `${卡片属性前缀}id`,
  标题 = `${卡片属性前缀}name`,
  标题ID = `${卡片属性前缀}titleId`,
  父项ID = `${卡片属性前缀}parentID`,
  别名 = `${卡片属性前缀}alias`,
  单开一页 = `${卡片属性前缀}singlePage`,
}

export interface I卡片 {
  ID: string;
  标题: string;
  标题ID: string;
  别名: string[];
  单开一页?: boolean;
  父项ID?: string;
  关系?: {
    目标ID: string;
    内容: string;
    类型: string;
  }[];
}

const 布尔类型属性 = [E卡片属性名称.单开一页];

export class 卡片 {
  private static 生成卡片SQL(条件数组?: string[]) {
    const 条件 = 条件数组 ? "AND " + 条件数组.join(" AND ") : "";

    return `
      SELECT
        卡片
      FROM
        (
          SELECT
            a.block_id,
            b.root_id,
                  '{' || GROUP_CONCAT('"' || a.name || '":"' || a.value || '"', ',') || '
                  ,"${E卡片属性名称.父项ID}":"' || b.root_id || '"
                  }' AS 卡片
          FROM
            attributes as a,
            blocks as b
          WHERE
            a.name LIKE '%custom-plugin-lively-card-%'
            AND a.block_id = b.id
            ${条件}
          GROUP BY
            a.block_id
        )        
      LIMIT 1024
      OFFSET 0
    `;
    //
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

      if (布尔类型属性.includes(key as E卡片属性名称)) {
        return (卡片[根据枚举的值获取枚举的键(E卡片属性名称, key)] =
          属性[key] === "true");
      }

      卡片[根据枚举的值获取枚举的键(E卡片属性名称, key)] = 属性[key];
    });
    return 卡片;
  }

  public static async 原始结果转为卡片(
    原始结果: { 卡片: string }[]
  ): Promise<I卡片[]> {
    if (!原始结果) return [];

    const 卡片列表 = 原始结果.map((item) =>
      this.属性转为卡片(JSON.parse(item.卡片))
    );

    return 卡片列表;
  }

  public static async 获取所有卡片(): Promise<I卡片[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL(),
    });

    return this.原始结果转为卡片(data);
  }

  public static async 获取卡片通过关键词(关键词: string): Promise<I卡片[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL([`b.root_id LIKE '%${关键词}%'`]),
    });

    return this.原始结果转为卡片(data);
  }

  public static async 获取指定文档下的卡片(文档ID: string): Promise<I卡片[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL([`b.root_id = '${文档ID}'`]),
    });

    const result = (await this.原始结果转为卡片(data)).filter(
      (卡片) => 卡片.ID !== 文档ID
    );

    return result;
  }
}
