import { E事项状态 } from "@/constant/状态配置";

export interface I用户设置 {
  笔记本ID: string;
  是否使用中: boolean;
  日记根文档ID: string;
  默认领域: string;
}
export interface I领域 {
  ID: string;
  笔记本ID: string;
  名称: string;
  描述: string;
  默认分类: string;
}
export interface I分类 {
  ID: string;
  领域ID: string;
  笔记本ID: string;
  名称: string;
  描述: string;
}

export interface I领域分类 extends I领域 {
  分类: I分类[];
}

export type TCorn = string;
export type T层级 = 0 | 1 | 2 | 3 | 4 | 5;
export interface I事项 {
  名称: string;
  重要程度: number;
  紧急程度: number;
  开始时间: string;
  结束时间: string;
  状态: E事项状态;
  重复: TCorn | false;

  // ID就是超级块ID
  ID: string;
  key: string;
  层级: T层级;
  // 对于顶级（0级）父项ID就是分类ID
  父项ID: string;
  分类ID: string;
  领域ID: string;
  笔记本ID: string;
  标题区ID: string;
  信息区ID: string;
  内容区ID: string;
  嵌入块ID: string;
  创建时间: string;
  更新时间: string;
}
