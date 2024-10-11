type KeyValuePair = {
  key: string;
  value: any;
};

export function findObjectsWithKeyValuePair<T>(
  array: T[],
  { key, value }: KeyValuePair
): T[] {
  return array.filter((obj) => obj[key] === value);
}

type TreeNode<T> = T & { 子项?: TreeNode<T>[] };

export function 找到符合条件的对象并进行操作<T>(
  tree: TreeNode<T>[],
  { key, value }: KeyValuePair,
  操作: (node: TreeNode<T>) => void,
  类型: "第一个" | "所有" = "第一个"
): TreeNode<T>[] {
  let result: TreeNode<T>[] = [];

  function traverse(nodes: TreeNode<T>[]) {
    for (const node of nodes) {
      if (node[key] === value) {
        if (类型 === "第一个") {
          操作(node);
          return;
        }
        result.push(node);
      }
      if (node.子项) {
        traverse(node.子项);
      }
    }
  }

  traverse(tree);
  return result;
}
