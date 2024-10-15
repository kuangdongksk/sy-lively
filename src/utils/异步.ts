export function 睡眠(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
