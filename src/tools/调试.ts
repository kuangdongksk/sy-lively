import SQL助手 from "@/class/SQL助手";

export const 开启调试 = false;

export async function 调试(开启调试: boolean) {
  if (!开启调试) return;
  console.log("🚀 ~ 开启调试:", await SQL助手.根据块ID获取属性('20241106182211-xd3z1yz')); 
  // console.log(
  //   "🚀 ~ ).then ~ 获取块Kramdown源码(用户设置):",
  //   await 获取块Kramdown源码("20241019174714-sksvgji")
  // );
}
