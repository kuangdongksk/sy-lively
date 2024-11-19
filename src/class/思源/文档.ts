import { SY块 } from "@/class/思源/块";
import { EAPI } from "@/constant/API路径";
import { E块属性名称 } from "@/constant/系统码";
import dayjs, { Dayjs } from "dayjs";
import { fetchSyncPost } from "siyuan";
import SQLer from "../SQLer";
import { SY笔记本 } from "./笔记本";

export default class SY文档 {
  //#region 公共
  public static 通过Markdown创建(
    笔记本ID: string,
    文档路径: string,
    markdown: string
  ): Promise<{ data: string }> {
    return fetchSyncPost(EAPI.通过Markdown创建文档, {
      notebook: 笔记本ID,
      path: 文档路径,
      markdown,
    });
  }

  public static async 检验文档是否存在(文档ID: string): Promise<boolean> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE id=${文档ID}`,
    });
    return Boolean(data);
  }

  public static async 根据ID获取路径(ID: string): Promise<string> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE id='${ID}'`,
    });

    return data[0].path;
  }

  public static async 重命名(笔记本ID: string, ID: string, 新名称: string) {
    const 路径 = await this.根据ID获取路径(ID);

    await fetchSyncPost(EAPI.重命名文档, {
      notebook: 笔记本ID,
      path: 路径,
      title: 新名称,
    });
  }

  public static async 移动(笔记本ID: string, 原父ID: string, 新父ID: string) {
    const 原路径 = await this.根据ID获取路径(原父ID);

    const 新路径 = await this.根据ID获取路径(新父ID);

    await fetchSyncPost(EAPI.移动文档, {
      notebook: 笔记本ID,
      path: 原路径,
      newPath: 新路径,
    });
  }
  //#endregion

  //#region 日记
  public static async 获取日记根文档(
    笔记本ID: string
  ): Promise<{ id: string }> {
    const value = await SY笔记本.获取笔记本配置(笔记本ID);
    const 日记文档名称 = value.data.conf.dailyNoteSavePath.split("/")[1];
    const { data } = await SQLer.获取日记根文档(笔记本ID, 日记文档名称);

    if (data.length === 0) {
      return {
        id: (await this.通过Markdown创建(笔记本ID, `/${日记文档名称}`, ""))
          .data,
      };
    }
    return data[0];
  }

  public static async 获取对应日期的日记文档(
    笔记本ID: string,
    日期: Dayjs
  ): Promise<{ id: string }> {
    const value = await SY笔记本.获取笔记本配置(笔记本ID);
    const 日记文档保存路径 = value.data.conf.dailyNoteSavePath;
    const 日记文档名称 = 日记文档保存路径.split("/")[1];
    const 日期日记路径 = `/${日记文档名称}/${日期.format(
      "YYYY/MM/YYYY-MM-DD"
    )}`;

    const { data } = await SQLer.获取日期对应的日记文档(笔记本ID, 日期日记路径);
    if (data.length === 0) {
      const 文档ID = await this.通过Markdown创建(
        笔记本ID,
        日期日记路径,
        ""
      ).then(async ({ data }) => {
        const 日期字符串 = dayjs(日期).format("YYYYMMDD");
        await SY块.设置块属性({
          id: data,
          attrs: {
            [E块属性名称.日记前缀 + 日期字符串]: 日期字符串,
          },
        });
        return data;
      });
      return {
        id: 文档ID,
      };
    }
    return data[0];
  }
  //#endregion
}
