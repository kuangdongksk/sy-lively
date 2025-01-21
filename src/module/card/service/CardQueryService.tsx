import { E块属性名称 } from "@/constant/系统码";
import { 根据枚举的值获取枚举的键 } from "@/utils/枚举";
import { fetchSyncPost } from "siyuan";

export const 卡片属性前缀 = `${E块属性名称.卡片}-`;

export enum E卡片属性名称 {
  name = `name`,
  alias = `alias`,
  标题ID = `${卡片属性前缀}titleId`,
  单开一页 = `${卡片属性前缀}singlePage`,
  // 删除的属性
  // "custom-plugin-lively-card": "",
  // "custom-plugin-lively-card-description": "",
  // "custom-plugin-lively-card-id": "",
  // "custom-plugin-lively-card-parentId": "",
  // "custom-plugin-lively-card-x": "",
  // "custom-plugin-lively-card-y": "",
  // "custom-plugin-lively-card-alias": "",
}

export interface I卡片 {
  ID: string;
  name: string;
  标题ID: string;
  alias: string[];
  单开一页?: boolean;
  父项ID?: string;
}

const 布尔类型属性 = [E卡片属性名称.单开一页];

export class CardQueryService {
  private static 生成卡片SQL(param?: { 条件数组?: string[]; 内层条件数组?: string[] }) {
    const { 条件数组, 内层条件数组 } = param;
    const 条件 = 条件数组 ? "AND " + 条件数组.join(" AND ") : "";
    const 内层条件 = 内层条件数组 ? "AND " + 内层条件数组.join(" AND ") : "";

    return `
      SELECT
        card
      FROM
        (
          SELECT
            a.block_id,
            b.root_id,
            '{' || GROUP_CONCAT('"' || a.name || '":"' || a.value || '"', ',') || ',"父项ID":"' || b.root_id || '","ID":"' || b.id || '"}' as card
          FROM
            attributes as a,
            blocks as b
          WHERE
            (
              a.name LIKE '%custom-plugin-lively-card-%'
              OR a.name = 'name'
              OR a.name = 'alias'
            )
            AND a.block_id = b.id
            ${内层条件}
          GROUP BY
            a.block_id
        )
      WHERE
        card LIKE '%custom-plugin-lively-card-%'
        ${条件}
      LIMIT
        1024
      OFFSET
        0;
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

  private static 属性转为卡片(
    属性: {
      [key in E卡片属性名称]: string;
    } & {
      ID: string;
      父项ID: string;
    }
  ): I卡片 {
    const { ID, 父项ID, alias } = 属性;

    const 卡片 = {
      ID: ID,
      父项ID: 父项ID,
      alias: alias.split(","),
    } as I卡片;
    Object.keys(属性).forEach((key) => {
      if (属性[key] === undefined) {
        return;
      }

      if (布尔类型属性.includes(key as E卡片属性名称)) {
        return (卡片[根据枚举的值获取枚举的键(E卡片属性名称, key)] = 属性[key] === "true");
      }

      卡片[根据枚举的值获取枚举的键(E卡片属性名称, key)] = 属性[key];
    });
    return 卡片;
  }

  public static async 原始结果转为卡片(原始结果: { card: string }[]): Promise<I卡片[]> {
    if (!原始结果) return [];

    const 卡片列表 = 原始结果.map((item) => this.属性转为卡片(JSON.parse(item.card)));

    return 卡片列表;
  }

  public static async getAll(): Promise<I卡片[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL(),
    });

    return this.原始结果转为卡片(data);
  }

  public static async getCardsByKeyword(关键词: string): Promise<I卡片[]> {
    const { data } = (await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL({ 条件数组: [`card LIKE '%${关键词}%'`] }),
    })) as {
      data: { card: string }[];
    };

    return this.原始结果转为卡片(data);
  }

  public static async 获取指定文档下的卡片(文档ID: string): Promise<I卡片[]> {
    const { data } = (await fetchSyncPost("/api/query/sql", {
      stmt: this.生成卡片SQL({ 内层条件数组: [`b.root_id = '${文档ID}'`] }),
    })) as {
      data: { card: string }[];
    };
    console.log("🚀 ~ CardQueryService ~ data:", data);

    const result = (await this.原始结果转为卡片(data)).filter((card) => card.ID !== 文档ID);

    return result;
  }
}
