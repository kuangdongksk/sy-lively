// 思源笔记 API 路径定义
// 基于 openapi.json 自动生成
// 文档: https://docs.siyuan-note.club/zh-Hans/reference/api/kernel/

export enum EAPI {
  //#region 资源文件
  上传资源文件 = "/api/asset/upload",
  //#endregion

  //#region 笔记本
  列出笔记本 = "/api/notebook/lsNotebooks",
  打开笔记本 = "/api/notebook/openNotebook",
  关闭笔记本 = "/api/notebook/closeNotebook",
  重命名笔记本 = "/api/notebook/renameNotebook",
  创建笔记本 = "/api/notebook/createNotebook",
  删除笔记本 = "/api/notebook/removeNotebook",
  获取笔记本配置 = "/api/notebook/getNotebookConf",
  保存笔记本配置 = "/api/notebook/setNotebookConf",
  //#endregion

  //#region 文档
  通过Markdown创建文档 = "/api/filetree/createDocWithMd",
  创建日记文档 = "/api/filetree/createDailyNote",
  重命名文档 = "/api/filetree/renameDoc",
  删除文档 = "/api/filetree/removeDoc",
  移动文档 = "/api/filetree/moveDocs",
  根据ID移动文档 = "/api/filetree/moveDocsById",
  根据路径列出文档 = "/api/filetree/listDocsByPath",
  根据路径获取人类可读路径 = "/api/filetree/getHPathByPath",
  根据ID获取人类可读路径 = "/api/filetree/getHPathByID",
  //#endregion

  //#region 块 https://docs.siyuan-note.club/zh-Hans/reference/api/kernel/#%E5%9D%97
  插入块 = "/api/block/insertBlock",
  插入前置子块 = "/api/block/prependBlock",
  插入后置子块 = "/api/block/appendBlock",
  更新块 = "/api/block/updateBlock",
  删除块 = "/api/block/deleteBlock",
  移动块 = "/api/block/moveBlock",
  获取块kramdown源码 = "/api/block/getBlockKramdown",
  获取子块 = "/api/block/getChildBlocks",
  转移块引用 = "/api/block/transferBlockRef",
  设置块属性 = "/api/attr/setBlockAttrs",
  获取块属性 = "/api/attr/getBlockAttrs",
  //#endregion

  //#region 文件
  获取文件 = "/api/file/getFile",
  写入文件 = "/api/file/putFile",
  删除文件 = "/api/file/removeFile",
  重命名文件 = "/api/file/renameFile",
  列出文件 = "/api/file/readDir",
  //#endregion

  //#region 通知
  推送消息 = "/api/notification/pushMsg",
  推送错误消息 = "/api/notification/pushErrMsg",
  //#endregion

  //#region 查询
  查询SQL = "/api/query/sql",
  //#endregion

  //#region 系统
  获取启动进度 = "/api/system/bootProgress",
  获取系统版本 = "/api/system/version",
  获取系统当前时间 = "/api/system/currentTime",
  //#endregion

  //#region 转换
  Pandoc转换 = "/api/convert/pandoc",
  //#endregion

  //#region 导出
  导出Markdown文本 = "/api/export/exportMdContent",
  //#endregion

  //#region 模板
  渲染模板 = "/api/template/render",
  渲染Sprig模板 = "/api/template/renderSprig",
  //#endregion
}
