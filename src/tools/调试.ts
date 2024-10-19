import { 获取块Kramdown源码 } from "@/API/块数据";

export async function 调试(开启调试: boolean) {
  if (!开启调试) return;
  console.log(
    "🚀 ~ ).then ~ 获取块Kramdown源码(用户设置.领域文档ID):",
    await 获取块Kramdown源码("20241019174714-sksvgji")
  );
}
