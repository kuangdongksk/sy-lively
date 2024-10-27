import { E块属性名称 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { 整理事项, 组合领域分类 } from "@/tools/结构转换";
import {
  I事项,
  I分类,
  I用户设置,
  I领域,
  I领域分类,
  I领域分类事项,
} from "@/types/喧嚣";
import dayjs, { Dayjs } from "dayjs";
import { fetchSyncPost, IWebSocketData } from "siyuan";

export enum E常用SQL {
  获取用户设置 = `SELECT * FROM attributes WHERE name='${E块属性名称.用户设置}'`,
  获取所有事项 = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}'`,
  获取所有事项对应的块 = `SELECT b.* FROM blocks b JOIN attributes a ON b.id = a.block_id
                  WHERE a.name = '${E块属性名称.事项}'`,
}

export default class SQL助手 {
  private static 数据库到分类(data: { value: string }[]): I分类[] {
    return data.map((item: { value: string }) => JSON.parse(item.value));
  }

  public static 常用(sql: E常用SQL) {
    return fetchSyncPost("/api/query/sql", {
      stmt: sql,
    });
  }

  //#region 日记
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
  //#endregion

  //#region 笔记本
  public static 获取笔记本对应的用户设置(
    笔记本ID: string
  ): Promise<IWebSocketData> {
    return fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name='${E块属性名称.用户设置}' AND box LIKE '%${笔记本ID}%'`,
    });
  }

  public static async 获取所有用户设置(): Promise<I用户设置[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name='${E块属性名称.用户设置}'`,
    });
    return data.map((item: { value: string }) => JSON.parse(item.value));
  }

  public static async 获取笔记本下的领域(笔记本ID: string): Promise<I领域[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name = '${E块属性名称.领域}' AND value LIKE '%${笔记本ID}%'`,
    });
    if (!data) return [];

    return data.map((item: { value: string }) => JSON.parse(item.value));
  }
  //#endregion

  public static async 获取笔记本下的所有分类(
    笔记本ID: string
  ): Promise<I分类[]> {
    const 查询结果 = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name = '${E块属性名称.分类}' AND value LIKE '%${笔记本ID}%'`,
    });

    return this.数据库到分类(查询结果.data);
  }

  public static async 获取笔记本下的所有分类按领域(
    笔记本ID: string
  ): Promise<I领域分类[]> {
    const 所有领域 = await this.获取笔记本下的领域(笔记本ID);
    const 所有分类 = await this.获取笔记本下的所有分类(笔记本ID);

    return 组合领域分类(所有领域, 所有分类);
  }

  //#region 分类
  public static async 获取指定领域下的分类(领域ID: string): Promise<I分类[]> {
    const 查询结果 = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name = '${E块属性名称.分类}' AND value LIKE '%${领域ID}%'`,
    });

    return this.数据库到分类(查询结果.data);
  }
  //#endregion

  //#region 事项
  public static async 获取笔记本下的所有事项(
    笔记本ID: string
  ): Promise<I事项[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name='${E块属性名称.事项}' AND value LIKE '%${笔记本ID}%'`,
    });

    return data.map((item: { value: string }) => JSON.parse(item.value));
  }

  public static async 获取笔记本下的所有事项按领域分类组织(
    笔记本ID: string
  ): Promise<I领域分类事项[]> {
    const 所有领域 = await this.获取笔记本下的领域(笔记本ID);
    const 所有分类 = await this.获取笔记本下的所有分类(笔记本ID);
    const 所有事项 = await this.获取笔记本下的所有事项(笔记本ID);

    return 整理事项(所有领域, 所有分类, 所有事项);
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

  public static async 根据开始时间获取当月事项(日期: Dayjs): Promise<I事项[]> {
    const 开始时间 = dayjs(日期).format(E时间格式化.思源时间).slice(0, 6);
    const sql = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}' AND value LIKE '%"开始时间":"${开始时间}%'`;

    return fetchSyncPost("/api/query/sql", {
      stmt: sql,
    }).then(({ data }) => {
      if (!data) {
        return [];
      }
      return data.map((item: { value: string }) =>
        JSON.parse(item.value)
      ) as I事项[];
    });
  }
  //#endregion
}
