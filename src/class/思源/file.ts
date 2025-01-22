import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";

export default class SYFile {
  private static basePath = "/data/storage/petal/";
  private static pluginPath = "sy-lively/";

  public static async getFile(path: string) {
    const prePath = this.basePath + this.pluginPath;

    const data = await fetchSyncPost(EAPI.获取文件, {
      path: `${prePath}${path}`,
    });
    return data as any;
  }

  public static async putFile(param: { path: string; file?: BlobPart | File; isDir: boolean }) {
    const { path, file, isDir } = param;

    return await fetchSyncPost(EAPI.写入文件, {
      path,
      isDir,
      file,
    });
  }
}
