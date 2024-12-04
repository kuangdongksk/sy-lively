import { 思源协议 } from "@/constant/系统码";
import { E按钮类型 } from "@/基础组件/按钮";
import { CopyOutlined } from "@ant-design/icons";
import { useDebounce } from "ahooks";
import { Button, Input, message, Tree } from "antd";
import { DataNode } from "antd/es/tree";
import { useEffect, useMemo, useState } from "react";
import { I卡片, 卡片 as 卡片类 } from "../../class/卡片";
import styles from "./index.module.less";

function CardDocker() {
  const [关键词, 令关键词为] = useState("");
  const 关键词的防抖 = useDebounce(关键词, { wait: 200 });
  const [树形卡片列表, 设置树形卡片列表] = useState<DataNode[]>([]);

  const 构建卡片节点 = (卡片: I卡片): DataNode => ({
    key: 卡片.ID,
    title: (
      <div className={styles.cardHeader}>
        <a
          className={styles.cardTitle}
          data-type="block-ref"
          data-id={卡片.ID}
          href={思源协议 + 卡片.ID}
        >
          {卡片.标题}
        </a>
        <Button
          className={E按钮类型.文本}
          icon={<CopyOutlined />}
          onClick={async (e) => {
            e.stopPropagation();
            await navigator.clipboard.writeText(
              `((${卡片.ID} '${卡片.标题}'))`
            );
            message.success("已复制");
          }}
        />
      </div>
    ),
    children: [],
  });

  const 转换为树形结构 = (卡片数组: I卡片[]): DataNode[] => {
    const 节点映射 = new Map<string, DataNode>();
    const 根节点列表: DataNode[] = [];

    // 创建所有节点
    卡片数组.forEach((卡片) => {
      节点映射.set(卡片.ID, 构建卡片节点(卡片));
    });

    // 构建树形结构
    卡片数组.forEach((卡片) => {
      const 当前节点 = 节点映射.get(卡片.ID);
      if (当前节点) {
        if (卡片.父项ID && 节点映射.has(卡片.父项ID)) {
          const 父节点 = 节点映射.get(卡片.父项ID);
          父节点?.children?.push(当前节点);
        } else {
          根节点列表.push(当前节点);
        }
      }
    });

    return 根节点列表;
  };

  const 获取卡片 = async () => {
    const 原始卡片数据 = await 卡片类.获取所有卡片();
    const 树形数据 = 转换为树形结构(原始卡片数据);
    设置树形卡片列表(树形数据);
  };

  useEffect(() => {
    获取卡片();
  }, []);

  const 过滤后的树形卡片 = useMemo(() => {
    if (!关键词的防抖) return 树形卡片列表;

    const 递归过滤节点 = (节点: DataNode): DataNode | null => {
      const 标题文本 =
        (节点.title as React.ReactElement)?.props?.children?.[0]?.props
          ?.children || "";
      const 匹配当前节点 = 标题文本
        .toLowerCase()
        .includes(关键词的防抖.toLowerCase());

      if (节点.children && 节点.children.length > 0) {
        const 过滤后子节点 = 节点.children
          .map((子节点) => 递归过滤节点(子节点))
          .filter((节点): 节点 is DataNode => 节点 !== null);

        if (匹配当前节点 || 过滤后子节点.length > 0) {
          return {
            ...节点,
            children: 过滤后子节点,
          };
        }
      } else if (匹配当前节点) {
        return 节点;
      }

      return null;
    };

    return 树形卡片列表
      .map((节点) => 递归过滤节点(节点))
      .filter((节点): 节点 is DataNode => 节点 !== null);
  }, [树形卡片列表, 关键词的防抖]);

  return (
    <div className={styles.cardDocker}>
      <div className={styles.title}>喧嚣卡片</div>
      <Input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full min-w-xs"
        value={关键词}
        onChange={(e) => 令关键词为(e.target.value)}
      />
      <div className={styles.content}>
        <Tree
          treeData={过滤后的树形卡片}
          defaultExpandAll
          selectable={false}
          showLine
        />
      </div>
    </div>
  );
}

export default CardDocker;
