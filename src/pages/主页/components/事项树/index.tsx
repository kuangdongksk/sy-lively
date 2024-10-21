import SQL助手, { E常用SQL } from "@/class/SQL助手";
import { 顶级节点 } from "@/constant/状态配置";
import { 事项数据 } from "@/store/事项数据";
import { string2stringArr } from "@/utils/拼接与拆解";
import type { TreeDataNode } from "antd";
import { Tree } from "antd";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import 事项, { I事项 } from "./components/事项";
import 添加子项 from "./components/添加子项";
import { 任务树样式 } from "./index.style";
import { convertTo树 } from "./tools";

export type TreeNode = TreeDataNode & {
  id: string;
  key: string;
  子项?: TreeNode[];
} & I事项;

function 任务树() {
  const { styles } = 任务树样式();

  const [数据, 令数据为] = useAtom(事项数据);

  useEffect(() => {
    SQL助手.常用(E常用SQL.获取所有事项).then(({ data }) => {
      令数据为([
        ...数据,
        ...data.map(({ value }) => JSON.parse(value) as TreeNode),
      ]);
    });
  }, []);

  return (
    <Tree<TreeNode>
      className="draggableTree"
      allowDrop={({ dragNode, dropNode, dropPosition }) => {
        if (dragNode.key.includes(顶级节点)) {
          if (dropPosition === 0) {
            // 顶级节点不允许拖拽到顶级节点内
            return false;
          }
        } else {
          if (dropNode.key.includes(顶级节点) && dropPosition !== 0) {
            // 子节点不允许与顶级节点同级
            return false;
          }
          if (
            string2stringArr(dropNode.key)[0] !==
            string2stringArr(dragNode.key)[0]
          ) {
            // 子节点不允许拖拽到其他顶级节点内
            return false;
          }
        }
        return true;
      }}
      blockNode
      checkable
      defaultExpandParent
      draggable
      fieldNames={{ title: "名称", key: "key", children: "子项" }}
      showIcon={false}
      showLine
      treeData={[...convertTo树(数据)]}
      //
      // onCheck={(checkedKeys, e) => {}}
      onDragEnter={() => {}}
      onDrop={(info) => onDrop(info, 数据, 令数据为)}
      titleRender={(node) => {
        if (node.key.includes(顶级节点)) {
          return (
            <div className={styles.分类标题}>
              <h4>{node.名称}</h4>
              <添加子项 节点={node} key={node.key} />
            </div>
          );
        }
        return <事项 事项={{ ...node }} />;
      }}
    />
  );
}

export default 任务树;

function onDrop(info, 数据, 令数据为) {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos.split("-");
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

  const loop = (
    data: TreeDataNode[],
    key: React.Key,
    callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
  ) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children!, key, callback);
      }
    }
  };
  const data = [...数据];

  // Find dragObject
  let dragObj: TreeDataNode;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
      item.children.unshift(dragObj);
    });
  } else {
    let ar: TreeDataNode[] = [];
    let i: number;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      // Drop on the top of the drop node
      ar.splice(i!, 0, dragObj!);
    } else {
      // Drop on the bottom of the drop node
      ar.splice(i! + 1, 0, dragObj!);
    }
  }
  令数据为(data);
}
