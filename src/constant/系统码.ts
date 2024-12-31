export const 自定义 = "custom";
export const 思源协议 = "siyuan://blocks/";
export const 思源插件协议 = "siyuan://plugins/sy-lively/";

export enum EPluginPath {
  SYLively = "SYLively",
  EditWhiteBoard = "EditWhiteBoard",
}

export const 喧嚣 = "lively";
export const C领域 = "domain";
export const C分类 = "category";
export const 属性前缀 = `${自定义}-plugin-${喧嚣}-`;

export enum E块属性名称 {
  //
  名称 = "name",
  别名 = "alias",
  //
  用户设置 = `${属性前缀}userSettings`,
  领域设置 = `${属性前缀}${C领域}Settings`,
  分类设置 = `${属性前缀}${C分类}Settings`,
  领域 = `${属性前缀}${C领域}`,
  分类 = `${属性前缀}${C分类}`,
  事项 = `${属性前缀}things`,
  日记前缀 = `${自定义}-dailynote-`,
  卡片 = `${属性前缀}card`,
}

export const 事项属性前缀 = `${属性前缀}thing-`;

export enum E事项属性名称 {
  名称 = `${事项属性前缀}name`,
  重要程度 = `${事项属性前缀}importance`,
  紧急程度 = `${事项属性前缀}urgency`,
  开始时间 = `${事项属性前缀}startTime`,
  结束时间 = `${事项属性前缀}endTime`,
  状态 = `${事项属性前缀}status`,
  重复 = `${事项属性前缀}repeat`,
  单开一页 = `${事项属性前缀}singlePage`,
  提醒 = `${事项属性前缀}remind`,
  逾期不再提醒 = `${事项属性前缀}noRemind`,

  // ID就是超级块ID
  ID = `${事项属性前缀}ID`,
  层级 = `${事项属性前缀}level`,
  // 对于顶级（0级）父项ID就是分类ID
  父项ID = `${事项属性前缀}parentID`,
  分类ID = `${事项属性前缀}categoryID`,
  领域ID = `${事项属性前缀}domainID`,
  笔记本ID = `${事项属性前缀}notebookID`,
  标题区ID = `${事项属性前缀}titleID`,
  信息区ID = `${事项属性前缀}infoID`,
  内容区ID = `${事项属性前缀}contentID`,
  嵌入块ID = `${事项属性前缀}embedID`,
  创建时间 = `${事项属性前缀}createTime`,
  更新时间 = `${事项属性前缀}updateTime`,
}

const EVeil属性前缀 = `${属性前缀}veil-`;

export enum EVeil属性名称 {
  pwdHash = EVeil属性前缀 + "pwdHash",
}

export enum E持久化键 {
  用户设置 = "用户设置",
  当前版本 = "当前版本",
  数据版本 = "数据版本",
  卡片文档ID = "卡片文档ID",
  上锁的笔记 = "上锁的笔记",
}

export enum E数据索引 {
  事项数据 = "事项数据",
}
