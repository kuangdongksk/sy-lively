export const 自定义 = "custom";
export const 思源协议 = "siyuan://blocks/";

export const 喧嚣 = "lively";
export const C领域 = "domain";
export const C分类 = "category";
export const 属性前缀 = `${自定义}-plugin-${喧嚣}-`;

export enum E块属性名称 {
  用户设置 = `${属性前缀}userSettings`,
  领域设置 = `${属性前缀}${C领域}Settings`,
  分类设置 = `${属性前缀}${C分类}Settings`,
  领域 = `${属性前缀}${C领域}`,
  分类 = `${属性前缀}${C分类}`,
  事项 = `${属性前缀}things`,
  日记前缀 = `${自定义}-dailynote-`,
}

export enum E持久化键 {
  用户设置 = "用户设置",
  更新公告是否发布 = "更新公告是否发布",
}

export enum E数据索引 {
  事项数据 = "事项数据",
}
