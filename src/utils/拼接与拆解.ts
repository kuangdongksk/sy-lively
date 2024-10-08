import { 分隔符 } from "@/constant/状态配置";

export function stringArr2string(arr: string[]): string {
  return arr.join(分隔符);
}

export function string2stringArr(str: string): string[] {
  return str.split(分隔符);
}