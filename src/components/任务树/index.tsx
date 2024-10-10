import { 任务树初始值 } from "@/constant/初始值";
import { 事项状态, 顶级节点 } from "@/constant/状态配置";
import { string2stringArr, stringArr2string } from "@/utils/拼接与拆解";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { TreeDataNode } from "antd";
import { Button, Tree } from "antd";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import 事项, { I事项Props } from "./components/事项";
import { 任务树样式 } from "./index.style";

export type TreeNode = TreeDataNode & {
  id: string;
  key: string;
  子项?: TreeNode[];
} & I事项Props;

export interface ITodoTreeProps {
  data?: TreeNode[];
}

function 任务树(props: ITodoTreeProps) {
  const { data } = props;
  const { styles } = 任务树样式();

  const [数据, 令数据为] = useState(任务树初始值);

  useEffect(() => {
    data && 令数据为(data);
  }, [data]);

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
      draggable
      fieldNames={{ title: "名称", key: "key", children: "子项" }}
      showIcon={false}
      showLine
      treeData={数据}
      onDragEnter={() => {}}
      onDrop={(info) => onDrop(info, 数据, 令数据为)}
      titleRender={(node) => {
        if (node.key.includes(顶级节点)) {
          return (
            <div className={styles.分类标题}>
              <h4>{node.名称}</h4>
              <Button
                icon={<PlusCircleOutlined />}
                size="small"
                type="link"
                onClick={() => {
                  const id = nanoid();
                  const 状态 = string2stringArr(node.key)[0];
                  const 名称 = "未命名";
                  node.子项 = [
                    {
                      id,
                      key: stringArr2string([状态, 名称, id]),
                      checkable: true,
                      名称,
                      重要程度: 1,
                      紧急程度: 1,
                      开始时间: dayjs(),
                      结束时间: dayjs(),
                      状态: 事项状态[状态],
                      重复: undefined,
                      层级: 1,
                    },
                    ...node.子项,
                  ];
                  令数据为([...数据]);
                }}
              />
            </div>
          );
        }
        return <事项 {...node} />;
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
