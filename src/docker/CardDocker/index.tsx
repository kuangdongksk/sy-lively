import { 卡片 } from "@/class/卡片";
import SY文档 from "@/class/思源/文档";
import Link from "@/components/base/rc/Link";
import { useEffect, useState } from "react";
import styles from "./index.module.less";
import ListItem from "./ListItem";

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
          title: (
            <Link
              block={{ id, label: name1 }}
              iconType={["ref", "link", "inset"]}
            />
          ),
          key: id,
          isLeaf: false,
        }))
        .concat(
          data.map((item) => ({
            title: (
              <Link
                block={{ id: item.ID, label: item.标题 }}
                iconType={["ref", "link", "inset"]}
              />
            ),
            key: item.ID,
            isLeaf: true,
          }))
        )
    );
  };

  useEffect(() => {
    获取卡片();
  }, []);

  return (
    <div className={styles.cardDocker}>
      <div className={styles.title}>喧嚣卡片</div>

      <ul className={"b3-list b3-list--background " + styles.content}>
        {树形卡片列表.map((item) => {
          return (
            <ListItem
              key={item.key}
              id={item.key}
              title={item.title}
              index={1}
              isLeaf={item.isLeaf}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default CardDocker;
