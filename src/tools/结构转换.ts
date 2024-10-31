import { I事项, I分类, I领域, I领域分类, I领域分类事项 } from "@/types/喧嚣/事项";

export function 组合领域分类(
  领域列表: I领域[],
  分类列表: I分类[]
): I领域分类[] {
  const 组合后的列表 = 领域列表.map((领域) => {
    const 分类 = 分类列表.filter((分类) => 分类.领域ID === 领域.ID);
    return {
      ...领域,
      分类,
    };
  });

  return 组合后的列表;
}

export function 整理事项(
  领域列表: I领域[],
  分类列表: I分类[],
  事项列表: I事项[]
): I领域分类事项[] {
  const 组合后的领域分类 = 组合领域分类(领域列表, 分类列表);
  const 结果 = 组合后的领域分类.map((领域分类) => {
    const 分类 = 领域分类.分类.map((分类) => {
      const 事项 = 事项列表.filter((事项) => 事项.分类ID === 分类.ID);
      return {
        ...分类,
        事项,
      };
    });

    return {
      ...领域分类,
      分类,
    };
  });

  return 结果;
}

export function 为事项添加领域分类(
  领域列表: I领域[],
  分类列表: I分类[],
  事项列表: I事项[]
): (I事项 & {
  领域名称: string;
  分类名称: string;
})[] {
  const 结果 = 事项列表.map((事项) => {
    const 分类 = 分类列表.find((分类) => 分类.ID === 事项.分类ID);
    const 领域 = 领域列表.find((领域) => 领域.ID === 分类?.领域ID);

    return {
      ...事项,
      领域名称: 领域?.名称 || "",
      分类名称: 分类?.名称 || "",
    };
  });

  return 结果;
}
