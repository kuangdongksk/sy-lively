import { E块属性名称 } from "@/constant/系统码";
import { fetchSyncPost, IWebSocketData } from "siyuan";

export enum E常用SQL {
  获取用户设置 = `SELECT * FROM attributes WHERE name='${E块属性名称.用户设置}'`,
  获取所有事项 = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}'`, // AND value='task'
}

export function SQL(sql: E常用SQL): Promise<IWebSocketData> {
  return fetchSyncPost("/api/query/sql", {
    stmt: sql,
  });
}
