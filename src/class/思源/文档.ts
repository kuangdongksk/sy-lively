import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";
import SQLer from "../helper/SQLer";
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
      stmt: `SELECT * FROM blocks WHERE id='${文档ID}'`,
    });
    return Boolean(data?.length);
  }

  public static async 根据ID获取笔记本ID(ID: string): Promise<string> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE id='${ID}'`,
    });

    return data[0].box;
  }

  public static async 根据ID获取路径(ID: string): Promise<string> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE id='${ID}'`,
    });

    return data[0].path;
  }

  public static async 根据ID获取文档的父文档ID(ID: string): Promise<string> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE id='${ID}'`,
    });

    return data[0].path.slice(1, 23);
  }

  public static async 重命名(笔记本ID: string, ID: string, 新名称: string) {
    const 路径 = await this.根据ID获取路径(ID);

    await fetchSyncPost(EAPI.重命名文档, {
      notebook: 笔记本ID,
      path: 路径,
      title: 新名称,
    });
  }

  public static async 移动(文档ID: string, 新父ID: string) {
    const 笔记本ID = await this.根据ID获取笔记本ID(新父ID);

    await fetchSyncPost(EAPI.根据ID移动文档, {
      toNotebook: 笔记本ID,
      fromPaths: [文档ID],
      toPath: 新父ID,
    });
  }

  public static async 根据ID列出文档(
    笔记本ID: string,
    ID: string
  ): Promise<{
    box: string;
    path: string;
    files: { name1: string; id: string }[];
  }> {
    const 路径 = await this.根据ID获取路径(ID);

    const { data } = await fetchSyncPost(EAPI.根据路径列出文档, {
      notebook: 笔记本ID,
      path: 路径,
    });
    return data;
  }

  //#endregion

  //#region 日记

  public static async 创建日记文档(笔记本ID: string): Promise<string> {
    const { data } = await fetchSyncPost("/api/filetree/createDailyNote", {
      notebook: 笔记本ID,
    });

    return data.id;
  }

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

  //#endregion

  //#region 卡片
  public static async 创建卡片文档(笔记本ID: string): Promise<{ id: string }> {
    const { data } = await this.通过Markdown创建(笔记本ID, "/卡片", "");
    return {
      id: data,
    };
  }
  //#endregion
}
