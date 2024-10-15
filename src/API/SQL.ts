import { E块属性名称 } from "@/constant/系统码";
import { fetchSyncPost, IWebSocketData } from "siyuan";

export enum E常用SQL {
  获取用户设置 = `SELECT * FROM attributes WHERE name='${E块属性名称.用户设置}'`,
  获取所有事项 = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}'`,
  获取所有事项对应的块 = `SELECT b.* FROM blocks b JOIN attributes a ON b.id = a.block_id
                  WHERE a.name = '${E块属性名称.事项}'`, // AND value='task'
}

export function SQL(sql: E常用SQL): Promise<IWebSocketData> {
  return fetchSyncPost("/api/query/sql", {
    stmt: sql,
  });
}

export function 根据ID获取块(id: string): Promise<IWebSocketData> {
  return fetchSyncPost("/api/query/sql", {
    stmt: `SELECT * FROM blocks WHERE id='${id}'`,
  });
}

export function 获取日记根文档(
  笔记本ID: string,
  日记文档名称: string
): Promise<IWebSocketData> {
  return fetchSyncPost("/api/query/sql", {
    stmt: `SELECT * FROM blocks WHERE box='${笔记本ID}' AND type='d' AND content='${日记文档名称}'`,
  });
}

export function 获取日期对应的日记文档(
  笔记本ID: string,
  日期日记路径: string
): Promise<IWebSocketData> {
  return fetchSyncPost("/api/query/sql", {
    stmt: `SELECT * FROM blocks WHERE box='${笔记本ID}' AND type='d' AND hpath='${日期日记路径}'`,
  });
}
