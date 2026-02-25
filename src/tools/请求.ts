import { EAPI } from "@/constant/API路径";
import type {
  AppendBlockRequest,
  AssetUploadResponse,
  BlockOperationResponse,
  BootProgressResponse,
  ChildBlock,
  CreateDocWithMdRequest,
  CreateDocWithMdResponse,
  CreateNotebookResponse,
  CurrentTimeResponse,
  DeleteBlockRequest,
  DirEntry,
  ExportMdResponse,
  FilePathRequest,
  GetBlockAttrsResponse,
  GetBlockKramdownResponse,
  GetHPathByIDRequest,
  GetHPathByPathRequest,
  HPathResponse,
  InsertBlockRequest,
  MoveBlockRequest,
  MoveDocsRequest,
  NotebookConfResponse,
  NotebookRequest,
  NotebooksResponse,
  PandocRequest,
  PrependBlockRequest,
  PushMsgRequest,
  PushMsgResponse,
  RemoveDocRequest,
  RenameDocRequest,
  RenameFileRequest,
  RenameNotebookRequest,
  RenderSprigRequest,
  RenderSprigResponse,
  RenderTemplateRequest,
  RenderTemplateResponse,
  SetBlockAttrsRequest,
  SetNotebookConfRequest,
  SetNotebookConfResponse,
  SqlQueryRequest,
  SqlQueryResponse,
  TransferBlockRefRequest,
  UpdateBlockRequest,
  VersionResponse,
} from "@/types/API";
import { fetchSyncPost } from "siyuan";

/**
 * 通用异步请求
 */
export async function 异步请求<T = any>(
  API: EAPI,
  options: any = {},
): Promise<{
  success: boolean;
  data: T;
}> {
  const 结果 = await fetchSyncPost(API, options);

  return {
    success: 结果.code === 0,
    data: 结果.data as T,
  };
}

/**
 * 资源文件 - 上传资源文件
 */
export async function 上传资源文件(params: { assetsDirPath: string; file: File[] }) {
  return 异步请求<AssetUploadResponse>(EAPI.上传资源文件, params);
}

/**
 * 笔记本 - 列出笔记本
 */
export async function 列出笔记本() {
  return 异步请求<NotebooksResponse["data"]>(EAPI.列出笔记本);
}

/**
 * 笔记本 - 打开笔记本
 */
export async function 打开笔记本(params: NotebookRequest) {
  return 异步请求(EAPI.打开笔记本, params);
}

/**
 * 笔记本 - 关闭笔记本
 */
export async function 关闭笔记本(params: NotebookRequest) {
  return 异步请求(EAPI.关闭笔记本, params);
}

/**
 * 笔记本 - 重命名笔记本
 */
export async function 重命名笔记本(params: RenameNotebookRequest) {
  return 异步请求(EAPI.重命名笔记本, params);
}

/**
 * 笔记本 - 创建笔记本
 */
export async function 创建笔记本(params: { name: string }) {
  return 异步请求<CreateNotebookResponse["data"]>(EAPI.创建笔记本, params);
}

/**
 * 笔记本 - 删除笔记本
 */
export async function 删除笔记本(params: NotebookRequest) {
  return 异步请求(EAPI.删除笔记本, params);
}

/**
 * 笔记本 - 获取笔记本配置
 */
export async function 获取笔记本配置(params: NotebookRequest) {
  return 异步请求<NotebookConfResponse["data"]>(EAPI.获取笔记本配置, params);
}

/**
 * 笔记本 - 保存笔记本配置
 */
export async function 保存笔记本配置(params: SetNotebookConfRequest) {
  return 异步请求<SetNotebookConfResponse["data"]>(EAPI.保存笔记本配置, params);
}

/**
 * 文档 - 通过Markdown创建文档
 */
export async function 通过Markdown创建文档(params: CreateDocWithMdRequest) {
  return 异步请求<CreateDocWithMdResponse["data"]>(EAPI.通过Markdown创建文档, params);
}

/**
 * 文档 - 重命名文档
 */
export async function 重命名文档(params: RenameDocRequest) {
  return 异步请求(EAPI.重命名文档, params);
}

/**
 * 文档 - 删除文档
 */
export async function 删除文档(params: RemoveDocRequest) {
  return 异步请求(EAPI.删除文档, params);
}

/**
 * 文档 - 移动文档
 */
export async function 移动文档(params: MoveDocsRequest) {
  return 异步请求(EAPI.移动文档, params);
}

/**
 * 文档 - 根据路径获取人类可读路径
 */
export async function 根据路径获取人类可读路径(params: GetHPathByPathRequest) {
  return 异步请求<HPathResponse["data"]>(EAPI.根据路径获取人类可读路径, params);
}

/**
 * 文档 - 根据ID获取人类可读路径
 */
export async function 根据ID获取人类可读路径(params: GetHPathByIDRequest) {
  return 异步请求<HPathResponse["data"]>(EAPI.根据ID获取人类可读路径, params);
}

/**
 * 块 - 插入块
 */
export async function 插入块(params: InsertBlockRequest) {
  return 异步请求<BlockOperationResponse["data"]>(EAPI.插入块, params);
}

/**
 * 块 - 插入前置子块
 */
export async function 插入前置子块(params: PrependBlockRequest) {
  return 异步请求<BlockOperationResponse["data"]>(EAPI.插入前置子块, params);
}

/**
 * 块 - 插入后置子块
 */
export async function 插入后置子块(params: AppendBlockRequest) {
  return 异步请求<BlockOperationResponse["data"]>(EAPI.插入后置子块, params);
}

/**
 * 块 - 更新块
 */
export async function 更新块(params: UpdateBlockRequest) {
  return 异步请求<BlockOperationResponse["data"]>(EAPI.更新块, params);
}

/**
 * 块 - 删除块
 */
export async function 删除块(params: DeleteBlockRequest) {
  return 异步请求<BlockOperationResponse["data"]>(EAPI.删除块, params);
}

/**
 * 块 - 移动块
 */
export async function 移动块(params: MoveBlockRequest) {
  return 异步请求<BlockOperationResponse["data"]>(EAPI.移动块, params);
}

/**
 * 块 - 获取块kramdown源码
 */
export async function 获取块kramdown源码(params: { id: string }) {
  return 异步请求<GetBlockKramdownResponse["data"]>(EAPI.获取块kramdown源码, params);
}

/**
 * 块 - 获取子块
 */
export async function 获取子块(params: { id: string }) {
  return 异步请求<ChildBlock[]>(EAPI.获取子块, params);
}

/**
 * 块 - 转移块引用
 */
export async function 转移块引用(params: TransferBlockRefRequest) {
  return 异步请求(EAPI.转移块引用, params);
}

/**
 * 属性 - 设置块属性
 */
export async function 设置块属性(params: SetBlockAttrsRequest) {
  return 异步请求(EAPI.设置块属性, params);
}

/**
 * 属性 - 获取块属性
 */
export async function 获取块属性(params: { id: string }) {
  return 异步请求<GetBlockAttrsResponse["data"]>(EAPI.获取块属性, params);
}

/**
 * 文件 - 获取文件
 */
export async function 获取文件(params: FilePathRequest) {
  return 异步请求<string>(EAPI.获取文件, params);
}

/**
 * 文件 - 写入文件
 */
export async function 写入文件(params: {
  path: string;
  file?: File;
  isDir?: boolean;
  modTime?: number;
}) {
  return 异步请求(EAPI.写入文件, params);
}

/**
 * 文件 - 删除文件
 */
export async function 删除文件(params: FilePathRequest) {
  return 异步请求(EAPI.删除文件, params);
}

/**
 * 文件 - 重命名文件
 */
export async function 重命名文件(params: RenameFileRequest) {
  return 异步请求(EAPI.重命名文件, params);
}

/**
 * 文件 - 列出文件
 */
export async function 列出文件(params: FilePathRequest) {
  return 异步请求<DirEntry[]>(EAPI.列出文件, params);
}

/**
 * 通知 - 推送消息
 */
export async function 推送消息(params: PushMsgRequest) {
  return 异步请求<PushMsgResponse["data"]>(EAPI.推送消息, params);
}

/**
 * 通知 - 推送错误消息
 */
export async function 推送错误消息(params: PushMsgRequest) {
  return 异步请求<PushMsgResponse["data"]>(EAPI.推送错误消息, params);
}

/**
 * SQL - 查询SQL
 */
export async function 查询SQL(params: SqlQueryRequest) {
  return 异步请求<SqlQueryResponse["data"]>(EAPI.查询SQL, params);
}

/**
 * 系统 - 获取启动进度
 */
export async function 获取启动进度() {
  return 异步请求<BootProgressResponse["data"]>(EAPI.获取启动进度);
}

/**
 * 系统 - 获取系统版本
 */
export async function 获取系统版本() {
  return 异步请求<VersionResponse["data"]>(EAPI.获取系统版本);
}

/**
 * 系统 - 获取系统当前时间
 */
export async function 获取系统当前时间() {
  return 异步请求<CurrentTimeResponse["data"]>(EAPI.获取系统当前时间);
}

/**
 * 转换 - Pandoc转换
 */
export async function Pandoc转换(params: PandocRequest) {
  return 异步请求(EAPI.Pandoc转换, params);
}

/**
 * 导出 - 导出Markdown文本
 */
export async function 导出Markdown文本(params: { id: string }) {
  return 异步请求<ExportMdResponse["data"]>(EAPI.导出Markdown文本, params);
}

/**
 * 模板 - 渲染模板
 */
export async function 渲染模板(params: RenderTemplateRequest) {
  return 异步请求<RenderTemplateResponse["data"]>(EAPI.渲染模板, params);
}

/**
 * 模板 - 渲染Sprig模板
 */
export async function 渲染Sprig模板(params: RenderSprigRequest) {
  return 异步请求<RenderSprigResponse["data"]>(EAPI.渲染Sprig模板, params);
}
