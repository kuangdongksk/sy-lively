// 思源笔记 API 类型定义
// 基于 openapi.json 自动生成

// ==================== 标准响应格式 ====================
export interface StandardResponse<T = any> {
  code: number; // 0表示成功，非0表示异常
  msg: string;
  data?: T;
}

// ==================== 请求参数类型 ====================

// 资源文件
export interface AssetUploadRequest {
  assetsDirPath: string;
  file: File[];
}

export interface AssetUploadResponse {
  data: {
    errFiles: string[];
    succMap: Record<string, string>;
  };
}

// 属性
export interface SetBlockAttrsRequest {
  id: string;
  attrs: Record<string, string>;
}

export interface GetBlockAttrsRequest {
  id: string;
}

export interface GetBlockAttrsResponse {
  data: {
    [key: string]: string;
  };
}

// 块
export type DataType = "markdown" | "dom";

export interface InsertBlockRequest {
  dataType: DataType;
  data: string;
  nextID?: string;
  previousID?: string;
  parentID?: string;
}

export interface PrependBlockRequest {
  dataType: DataType;
  data: string;
  parentID: string;
}

export interface AppendBlockRequest {
  dataType: DataType;
  data: string;
  parentID: string;
}

export interface UpdateBlockRequest {
  dataType: DataType;
  data: string;
  id: string;
}

export interface DeleteBlockRequest {
  id: string;
}

export interface MoveBlockRequest {
  id: string;
  previousID?: string;
  parentID?: string;
}

export interface GetBlockRequest {
  id: string;
}

export interface GetBlockKramdownResponse {
  data: {
    id: string;
    kramdown: string;
  };
}

export interface ChildBlock {
  id: string;
  type: string;
  subType: string;
}

export interface GetChildBlocksResponse {
  data: ChildBlock[];
}

export interface TransferBlockRefRequest {
  fromID: string;
  toID: string;
  refIDs?: string[];
}

// 转换
export interface PandocRequest {
  args: string[];
}

// 导出
export interface ExportMdRequest {
  id: string;
}

export interface ExportMdResponse {
  data: {
    hPath: string;
    content: string;
  };
}

// 文件
export interface FilePathRequest {
  path: string;
}

export interface PutFileRequest {
  path: string;
  isDir?: boolean;
  modTime?: number;
  file?: File;
}

export interface RenameFileRequest {
  path: string;
  newPath: string;
}

export interface DirEntry {
  isDir: boolean;
  name: string;
}

export interface ReadDirResponse {
  data: DirEntry[];
}

// 文档
export interface CreateDocWithMdRequest {
  notebook: string;
  path: string;
  markdown: string;
}

export interface CreateDocWithMdResponse {
  data: string;
}

export interface RenameDocRequest {
  notebook: string;
  path: string;
  title: string;
}

export interface RemoveDocRequest {
  notebook: string;
  path: string;
}

export interface MoveDocsRequest {
  fromPaths: string[];
  toNotebook: string;
  toPath: string;
}

export interface GetHPathByPathRequest {
  notebook: string;
  path: string;
}

export interface GetHPathByIDRequest {
  id: string;
}

export interface HPathResponse {
  data: string;
}

// 笔记本
export interface Notebook {
  id: string;
  name: string;
  icon: string;
  sort: number;
  closed: boolean;
}

export interface NotebookRequest {
  notebook: string;
}

export interface RenameNotebookRequest {
  notebook: string;
  name: string;
}

export interface CreateNotebookRequest {
  name: string;
}

export interface CreateNotebookResponse {
  data: {
    notebook: Notebook;
  };
}

export interface NotebookConfData {
  name: string;
  closed: boolean;
  refCreateSavePath: string;
  createDocNameTemplate: string;
  dailyNoteSavePath: string;
  dailyNoteTemplatePath: string;
}

export interface SetNotebookConfRequest {
  notebook: string;
  conf: NotebookConfData;
}

export interface SetNotebookConfResponse {
  data: NotebookConfData;
}

export interface NotebookConfResponse {
  data: {
    box: string;
    conf: NotebookConfData;
    name: string;
  };
}

export interface NotebooksResponse {
  data: {
    notebooks: Notebook[];
  };
}

// 通知
export interface PushMsgRequest {
  msg: string;
  timeout?: number;
}

export interface PushMsgResponse {
  data: {
    id: string;
  };
}

// SQL
export interface SqlQueryRequest {
  stmt: string;
}

export interface SqlQueryResponse {
  data: Array<Record<string, any>>;
}

// 系统
export interface BootProgressResponse {
  data: {
    details: string;
    progress: number;
  };
}

export interface VersionResponse {
  data: string;
}

export interface CurrentTimeResponse {
  data: number;
}

// 模板
export interface RenderTemplateRequest {
  id: string;
  path: string;
}

export interface RenderTemplateResponse {
  data: {
    content: string;
    path: string;
  };
}

export interface RenderSprigRequest {
  template: string;
}

export interface RenderSprigResponse {
  data: string;
}

// 块操作
export interface BlockOperation {
  action: "insert" | "update" | "delete" | "move";
  data?: string;
  id?: string;
  parentID?: string;
  previousID?: string;
  retData?: any;
}

export interface BlockOperations {
  doOperations: BlockOperation[];
  undoOperations: BlockOperation[];
}

export interface BlockOperationResponse {
  data: BlockOperations[];
}
