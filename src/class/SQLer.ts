import { E块属性名称 } from "@/constant/系统码";
import { E时间格式化 } from "@/constant/配置常量";
import { 属性转化为事项 } from "@/tools/事项/事项";
import { 为事项添加领域分类, 整理事项, 组合领域分类 } from "@/tools/结构转换";
import {
  I事项,
  I分类,
  I领域,
  I领域分类,
  I领域分类事项,
} from "@/types/喧嚣/事项";
import { I用户设置 } from "@/types/喧嚣/设置";
import { I块 } from "@/types/数据库表";
import dayjs, { Dayjs } from "dayjs";
import { fetchSyncPost, IWebSocketData } from "siyuan";

export default class SQLer {
  private static 数据库到分类(data: { value: string }[]): I分类[] {
    return data.map((item: { value: string }) => JSON.parse(item.value));
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

  //#endregion

  //#region 领域
  public static async 获取笔记本下的领域(笔记本ID: string): Promise<I领域[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name = '${E块属性名称.领域}' AND value LIKE '%${笔记本ID}%'`,
    });
    if (!data) return [];

    return data.map((item: { value: string }) => JSON.parse(item.value));
  }
  //#endregion

  //#region 分类
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

  public static async 获取指定领域下的分类(领域ID: string): Promise<I分类[]> {
    const 查询结果 = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM attributes WHERE name = '${E块属性名称.分类}' AND value LIKE '%${领域ID}%'`,
    });

    return this.数据库到分类(查询结果.data);
  }
  //#endregion

  //#region 事项
  private static 生成事项SQL(条件数组?: string[]): string {
    const 条件 = 条件数组 ? "WHERE " + 条件数组.join(" AND ") : "";

    return `
      SELECT
        事项
      FROM
        (SELECT
          block_id,
          '{' || GROUP_CONCAT('"' || name || '":"' || value || '"', ',') || '}' AS 事项
        FROM
          attributes
        WHERE
          name LIKE '%custom-plugin-lively-thing-%'
        GROUP BY
          block_id)
        ${条件}
    `;
  }

  private static 原始结果转化为事项(data: { 事项: string }[]): I事项[] {
    if (!data) return [];
    return data.map((item: { 事项: string }) => {
      const 原始 = JSON.parse(item.事项);
      return 属性转化为事项(原始);
    });
  }

  public static async 获取所有事项(): Promise<I事项[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      // stmt: 'SELECT * FROM attributes WHERE name = "custom-plugin-lively-things"',
      stmt: this.生成事项SQL(),
    });

    // return data.map((item: { value: string }) => JSON.parse(item.value));
    return this.原始结果转化为事项(data);
  }

  public static async 获取笔记本下的所有事项(
    笔记本ID: string
  ): Promise<I事项[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成事项SQL([`事项 LIKE '%${笔记本ID}%'`]),
    });

    return this.原始结果转化为事项(data);
  }

  public static async 获取笔记本下的所有事项按领域分类组织(
    笔记本ID: string
  ): Promise<I领域分类事项[]> {
    const 所有领域 = await this.获取笔记本下的领域(笔记本ID);
    const 所有分类 = await this.获取笔记本下的所有分类(笔记本ID);
    const 所有事项 = await this.获取笔记本下的所有事项(笔记本ID);

    return 整理事项(所有领域, 所有分类, 所有事项);
  }

  public static async 获取笔记本下的所有事项添加分类(笔记本ID: string): Promise<
    (I事项 & {
      领域名称: string;
      分类名称: string;
    })[]
  > {
    const 所有领域 = await this.获取笔记本下的领域(笔记本ID);
    const 所有分类 = await this.获取笔记本下的所有分类(笔记本ID);
    const 所有事项 = await this.获取笔记本下的所有事项(笔记本ID);

    return 为事项添加领域分类(所有领域, 所有分类, 所有事项);
  }

  public static async 获取指定领域下的事项(领域ID: string): Promise<I事项[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成事项SQL([`事项 LIKE '%${领域ID}%'`]),
    });

    return this.原始结果转化为事项(data);
  }

  public static async 获取指定分类下的事项(分类ID: string): Promise<I事项[]> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: this.生成事项SQL([`事项 LIKE '%${分类ID}%'`]),
    });

    return this.原始结果转化为事项(data);
  }

  public static async 根据开始时间获取当月事项(日期: Dayjs): Promise<I事项[]> {
    const 开始时间 = dayjs(日期).format(E时间格式化.思源时间).slice(0, 6);
    return fetchSyncPost("/api/query/sql", {
      stmt: this.生成事项SQL([`事项 LIKE '%"开始时间":"${开始时间}%'`]),
    }).then(({ data }) => {
      return this.原始结果转化为事项(data);
    });
  }
  //#endregion

  //#region 块
  public static async 根据ID获取块(ID: string): Promise<I块> {
    const sql = `SELECT * FROM blocks WHERE id='${ID}'`;
    return fetchSyncPost("/api/query/sql", {
      stmt: sql,
    }).then(({ data }) => {
      return data[0];
    });
  }
  //#endregion

  //#region 属性
  public static async 根据块ID获取属性(块ID: string): Promise<any> {
    const sql = `SELECT * FROM attributes WHERE block_id='${块ID}'`;

    return fetchSyncPost("/api/query/sql", {
      stmt: sql,
    }).then(({ data }) => {
      return data;
    });
  }
  //#endregion
}
