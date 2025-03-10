export type T日子类型 = "倒数日" | "纪念日" | "生日";

// 其实日子是领域，一个日子就是一个分类，用户可以添加事项
// 这样来想的话，创建一个重复就是创建一个分类
// 至于分类和事项的层级，不同层级的事项平铺展开就可以，不需要嵌套
export interface I日子 {
  名称: string;
  日期: string;
  是否为农历: string;
  类型: T日子类型;
  配置: {
    提醒频率: number;
    记录频率: number;
  };
}
