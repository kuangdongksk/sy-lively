import { 设置块属性 } from "@/API/块数据";
import { E块属性名称 } from "@/constant/系统码";
import { I用户设置 } from "@/types/喧嚣/事项";

/** 更改日记根文档ID时必填第二个参数，不改时不要填 */
export async function 更新用户设置(
  配置: {
    当前用户设置: I用户设置;
    更改的用户设置: Partial<I用户设置>;
    设置用户设置: (新的用户设置: I用户设置) => void;
  },
  日记根文档ID?: string
) {
  const { 当前用户设置, 更改的用户设置, 设置用户设置 } = 配置;
  const 新的用户设置 = {
    ...当前用户设置,
    ...更改的用户设置,
  };

  await 设置块属性({
    id: 日记根文档ID ?? 当前用户设置.日记根文档ID,
    attrs: {
      [E块属性名称.用户设置]: JSON.stringify(新的用户设置),
    },
  });
  设置用户设置(新的用户设置);

  return;
}
