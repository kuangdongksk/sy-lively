// https://docs.siyuan-note.club/zh-Hans/reference/api/kernel/
export enum EAPI {
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
  设置块属性 = "/api/block/setBlockAttrs",
  获取块属性 = "/api/block/getBlockAttrs",
  //#endregion
  获取文件 = "/api/file/getFile",
  上传文件 = "/api/file/putFile",

  推送消息 = "/api/notification/pushMsg",
  推送错误消息 = "/api/notification/pushErrMsg",
}
