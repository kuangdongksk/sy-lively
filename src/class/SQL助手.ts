import { E块属性名称 } from "@/constant/系统码";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import { fetchSyncPost, IWebSocketData } from "siyuan";

export enum E常用SQL {
  获取用户设置 = `SELECT * FROM attributes WHERE name='${E块属性名称.用户设置}'`,
  获取所有事项 = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}'`,
  获取所有事项对应的块 = `SELECT b.* FROM blocks b JOIN attributes a ON b.id = a.block_id
                  WHERE a.name = '${E块属性名称.事项}'`,
}

export default class SQL助手 {
  public static 常用(sql: E常用SQL) {
    return fetchSyncPost("/api/query/sql", {
      stmt: sql,
    });
  }

  public static 获取日记根文档(
    笔记本ID: string,
    日记文档名称: string
  ): Promise<IWebSocketData> {
    return fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE box='${笔记本ID}' AND type='d' AND content='${日记文档名称}'`,
    });
  }

  public static 获取日期对应的日记文档(
    笔记本ID: string,
    日期日记路径: string
  ): Promise<IWebSocketData> {
    return fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE box='${笔记本ID}' AND type='d' AND hpath='${日期日记路径}'`,
    });
  }

  public static 获取笔记本下的领域设置(笔记本ID: string): Promise<{
    data: {
      value: string;
    }[];
  }> {
    return fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name = '${E块属性名称.领域}' AND value LIKE '%${笔记本ID}%'`,
    });
  }

  public static 获取指定领域下的分类(领域ID: string): Promise<{
    data: {
      value: string;
    }[];
  }> {
    return fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name = '${E块属性名称.分类}' AND value LIKE '%${领域ID}%'`,
    });
  }

  public static async 获取指定领域下的事项(领域ID: string): Promise<I事项[]> {
    const sql = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}' AND value LIKE '%${领域ID}%'`;

    const { data: sqlData } = await fetchSyncPost("/api/query/sql", {
      stmt: sql,
    });

    return sqlData.map((item: { value: string }) =>
      JSON.parse(item.value)
    ) as I事项[];
  }

  public static async 获取指定分类下的事项(分类ID: string): Promise<I事项[]> {
    const sql = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}' AND value LIKE '%${分类ID}%'`;

    const { data: sqlData } = await fetchSyncPost("/api/query/sql", {
      stmt: sql,
    });

    return sqlData.map((item: { value: string }) =>
      JSON.parse(item.value)
    ) as I事项[];
  }
}
