/**
 * null 返回 "object"
 */
export function isRecord<TK extends string | number | symbol, TV>(
  obj: any,
  值类型:
    | "undefined"
    | "boolean"
    | "number"
    | "string"
    | "symbol"
    | "bigint"
    | "function"
    | "object",
  键列表?: (string | number | symbol)[]
): obj is Record<TK, TV> {
  if (typeof obj !== "object" || obj === null) return false;

  if (键列表 && !Object.keys(obj).every((key) => 键列表.includes(key)))
    return false;

  return Object.values(obj).every((value) => typeof value === 值类型);
}
