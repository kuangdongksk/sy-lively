export interface I用户设置 {
  笔记本ID: string;
  是否使用中: boolean;
  日记根文档ID: string;
  领域文档ID: string;
  领域设置: {
    ID: string;
    名称: string;
    描述: string;
    分类: {
      ID: string;
      名称: string;
      描述: string;
    }[];
  }[];
}
