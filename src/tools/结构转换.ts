import { I分类, I领域, I领域分类 } from "@/types/喧嚣";

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
