import SQLer from "@/class/helper/SQLer";
import { SY块 } from "@/class/思源/块";

export const 开启调试 = false;

export async function 调试(开启调试: boolean) {
  if (!开启调试) return;
  console.log(
    "🚀 ~ 开启调试:",
    await SQLer.根据块ID获取属性("20241106182211-xd3z1yz")
  );
  console.log(
    "🚀 ~ 获取块Kramdown源码",
    await SY块.获取块Kramdown源码("20241230162149-uioa3r7")
  );
}
