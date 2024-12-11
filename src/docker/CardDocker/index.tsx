import SY文档 from "@/class/思源/文档";
import { Tree } from "antd";
import { DataNode } from "antd/es/tree";
import { useEffect, useState } from "react";
import styles from "./index.module.less";
import TreeItem from "./treeItem";
import { 卡片 } from "@/class/卡片";

function CardDocker(props: { 卡片文档ID: string }) {
  const { 卡片文档ID } = props;

  const [树形卡片列表, 设置树形卡片列表] = useState([]);

  const 获取卡片 = async () => {
    const 笔记本ID = await SY文档.根据ID获取笔记本ID(卡片文档ID);

    const { files } = await SY文档.根据ID列出文档(笔记本ID, 卡片文档ID);
    const data = await 卡片.获取指定文档下的卡片(卡片文档ID);

    设置树形卡片列表(
      files
        .map(({ name1, id }) => ({
          title: <TreeItem id={id} label={name1} />,
          key: id,
          isLeaf: false,
        }))
        .concat(
          data.map((item) => ({
            title: <TreeItem id={item.ID} label={item.标题} />,
            key: item.ID,
            isLeaf: true,
          }))
        )
    );
  };

  const 加载数据 = async (treeNode: DataNode) => {
    const 笔记本ID = await SY文档.根据ID获取笔记本ID(treeNode.key as string);

    const { files } = await SY文档.根据ID列出文档(
      笔记本ID,
      treeNode.key as string
    );
    const data = await 卡片.获取指定文档下的卡片(treeNode.key as string);

    const 子树 = files
      .map(({ name1, id }) => ({
        title: <TreeItem id={id} label={name1} />,
        key: id,
        isLeaf: false,
      }))
      .concat(
        data.map((item) => ({
          title: <TreeItem id={item.ID} label={item.标题} />,
          key: item.ID,
          isLeaf: true,
        }))
      );

    设置树形卡片列表((origin) => updateTreeData(origin, treeNode.key, 子树));
  };

  useEffect(() => {
    获取卡片();
  }, []);

  return (
    <div className={styles.cardDocker}>
      <div className={styles.title}>喧嚣卡片</div>

      <div className={styles.content}>
        <Tree
          defaultExpandAll
          loadData={加载数据}
          selectable={false}
          showLine
          treeData={树形卡片列表}
        />
      </div>
    </div>
  );
}

export default CardDocker;

const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[]
): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
