import { 获取日期对应的日记文档, 获取日记根文档 } from "@/API/SQL";
import { 设置块属性 } from "@/API/块数据";
import { 通过Markdown创建文档 } from "@/API/文档";
import { 获取笔记本配置 } from "@/API/笔记本";
import { E块属性名称 } from "@/constant/系统码";
import { I用户设置 } from "@/types/喧嚣";
import dayjs, { Dayjs } from "dayjs";

/**
 * 获取笔记本下的日记文档，如果没有则创建
 * @param 笔记本ID
 * @returns
 */
export async function 获取笔记本下的日记根文档(
  笔记本ID: string
): Promise<{ id: string }> {
  const value = await 获取笔记本配置(笔记本ID);
  const 日记文档名称 = value.data.conf.dailyNoteSavePath.split("/")[1];
  const { data } = await 获取日记根文档(笔记本ID, 日记文档名称);

  if (data.length === 0) {
    return {
      id: (await 通过Markdown创建文档(笔记本ID, `/${日记文档名称}`, "")).data,
    };
  }
  return data[0];
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
    const 文档ID = await 通过Markdown创建文档(笔记本ID, 日期日记路径, "").then(
      async ({ data }) => {
        const 日期字符串 = dayjs(日期).format("YYYYMMDD");
        await 设置块属性({
          id: data,
          attrs: {
            [E块属性名称.日记前缀 + 日期字符串]: 日期字符串,
          },
        });
        return data;
      }
    );
    return {
      id: 文档ID,
    };
  }
  return data[0];
}

/**
 * 更新用户设置
 */
export async function 更新用户设置(
  当前用户设置: I用户设置,
  新的用户设置: Partial<I用户设置>
) {
  await 设置块属性({
    id: 当前用户设置.日记根文档ID,
    attrs: {
      [E块属性名称.用户设置]: JSON.stringify({
        ...当前用户设置,
        ...新的用户设置,
      }),
    },
  });

  return;
}
