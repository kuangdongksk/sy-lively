export function 根据枚举的值获取枚举的键(枚举: any, value: any) {
  return Object.keys(枚举).find((key) => 枚举[key] === value);
}
