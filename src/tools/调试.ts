export const 开启调试 = false;

export async function 调试(开启调试: boolean) {
  if (!开启调试) return;
  // console.log(
  //   "🚀 ~ ).then ~ 获取块Kramdown源码(用户设置):",
  //   await 获取块Kramdown源码("20241019174714-sksvgji")
  // );

  // fetchSyncPost("/api/query/sql", {
  //   stmt: `CREATE TABLE IF NOT EXISTS things (
  //   id INTEGER PRIMARY KEY,
  //   name TEXT NOT NULL,
  //   age INTEGER
  //   )`,
  // }).then((res) => {
  //   console.log("🚀 ~ res:", res);
  //   fetchSyncPost("/api/query/sql", {
  //     stmt: `SELECT * FROM things`,
  //   }).then((res) => {
  //     console.log("🚀 ~ res:", res);
  //   });
  // });
}
