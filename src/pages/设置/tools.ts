import { 获取日期对应的日记文档, 获取日记根文档 } from "@/API/SQL";
import { 通过Markdown创建文档 } from "@/API/文档";
import { 获取笔记本配置 } from "@/API/笔记本";
import { Dayjs } from "dayjs";

/**
 * 获取笔记本下的日记文档，如果没有则创建
 * @param 笔记本ID
 * @returns
 */
export async function 获取笔记本下的日记根文档(
  笔记本ID: string
): Promise<{ id: string }[]> {
  const value = await 获取笔记本配置(笔记本ID);
  const 日记文档名称 = value.data.conf.dailyNoteSavePath.split("/")[1];
  const { data } = await 获取日记根文档(笔记本ID, 日记文档名称);
  if (data.length === 0) {
    return [
      {
        id: (await 通过Markdown创建文档(笔记本ID, `/${日记文档名称}`, "")).data,
      },
    ];
  }
  return data;
}

/**
 * 获取笔记本下的对应日期的日记文档，如果没有则创建
 * @param 笔记本ID
 * @param 日期
 * @returns
 */
export async function 获取笔记本下的对应日期的日记文档(
  笔记本ID: string,
  日期: Dayjs
): Promise<{ id: string }> {
  const value = await 获取笔记本配置(笔记本ID);
  const 日记文档保存路径 = value.data.conf.dailyNoteSavePath;
  const 日记文档名称 = 日记文档保存路径.split("/")[1];
  const 日期日记路径 = `/${日记文档名称}/${日期.format("YYYY/MM/YYYY-MM-DD")}`;

  const { data } = await 获取日期对应的日记文档(笔记本ID, 日期日记路径);
  if (data.length === 0) {
    return {
      id: (await 通过Markdown创建文档(笔记本ID, 日期日记路径, "")).data,
    };
  }
  return data[0];
}
