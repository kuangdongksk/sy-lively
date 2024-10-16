import { 设置块属性 } from "@/API/块数据";
import { E块属性名称 } from "@/constant/系统码";
import { I用户设置 } from "@/types/喧嚣";

/**
 * 更新用户设置
 */
export async function 更新用户设置(
  当前用户设置: I用户设置,
  新的用户设置: Partial<I用户设置>
) {
  await 设置块属性({
    id: 当前用户设置.日记根文档ID,
    attrs: {
      [E块属性名称.用户设置]: JSON.stringify({
        ...当前用户设置,
        ...新的用户设置,
      }),
    },
  });

  return;
}


