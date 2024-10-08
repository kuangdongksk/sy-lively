import { TodoTree初始值 } from "@/constant/初始值";
import { 顶级节点 } from "@/constant/状态配置";
import { string2stringArr } from "@/utils/拼接与拆解";
import type { TreeDataNode, TreeProps } from "antd";
import { Tree } from "antd";
import React, { useState } from "react";

export interface ITodoTreeProps {
  data: (TreeDataNode & { key: string })[];
}
function TodoTree(props: ITodoTreeProps) {
  const [gData, setGData] = useState(TodoTree初始值);

  const onDragEnter: TreeProps["onDragEnter"] = (info) => {
    console.log("🚀 ~ TodoTree ~ info:", info);
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log("🚀 ~ TodoTree ~ info:", info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

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
    const data = [...gData];

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
    setGData(data);
  };

  return (
    <Tree<{ key: string }>
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
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      treeData={gData}
    />
  );
}

export default TodoTree;
