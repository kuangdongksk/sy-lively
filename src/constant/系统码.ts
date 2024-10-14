export const 自定义 = "custom";
export const 喧嚣 = "lively";
export const 领域 = "domain";
export const 属性前缀 = `${自定义}-plugin-${喧嚣}-`;

export enum E块属性名称 {
  用户设置 = `${属性前缀}userSettings`,
  领域设置 = `${属性前缀}${领域}`,
  事项 = `${属性前缀}things`,
}

export enum E数据索引 {
  事项数据 = "事项数据",
}
