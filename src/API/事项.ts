import { E块属性名称 } from "@/constant/系统码";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import { fetchSyncPost } from "siyuan";

export async function 获取指定领域下的事项(领域ID: string): Promise<I事项[]> {
  const sql = `SELECT * FROM attributes WHERE name='${E块属性名称.事项}' AND value LIKE '%${领域ID}%'`;

  const { data: sqlData } = await fetchSyncPost("/api/query/sql", {
    stmt: sql,
  });

  return sqlData.map((item: { value: string }) =>
    JSON.parse(item.value)
  ) as I事项[];
}
