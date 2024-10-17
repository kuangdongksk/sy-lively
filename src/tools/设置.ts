import { 设置块属性 } from "@/API/块数据";
import { E块属性名称 } from "@/constant/系统码";
import { I领域 } from "@/pages/领域";
import { 仓库 } from "@/store";
import { 用户设置Atom, 领域设置Atom } from "@/store/用户设置";
import { I用户设置 } from "@/types/喧嚣";

/** 更改日记根文档ID时必填第二个参数，不改时不要填 */
export async function 更新用户设置(
  更改的用户设置: Partial<I用户设置>,
  日记根文档ID?: string
) {
  const 当前用户设置 = 仓库.get(用户设置Atom);
  const 新的用户设置 = {
    ...当前用户设置,
    ...更改的用户设置,
  };

  await 设置块属性({
    id: 日记根文档ID ?? 当前用户设置.日记根文档ID,
    attrs: {
      [E块属性名称.用户设置]: JSON.stringify(新的用户设置),
    },
  }).then(() => {
    仓库.set(用户设置Atom, 新的用户设置);
  });

  return;
}

export async function 更新领域设置(新的领域设置: I领域[]) {
  const 领域文档ID = 仓库.get(用户设置Atom).领域文档ID;

  await 设置块属性({
    id: 领域文档ID,
    attrs: {
      [E块属性名称.领域设置]: JSON.stringify(新的领域设置),
    },
  }).then(() => {
    仓库.set(领域设置Atom, 新的领域设置);
  });
}
