import { 卡片 } from "@/class/卡片";
import SY文档 from "@/class/思源/文档";
import Link from "@/基础组件/link";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export interface IListItemProps {
  id: string;
  index: number;
  isLeaf: boolean;
  title: string;
}

function ListItem(props: IListItemProps) {
  const { id, index, isLeaf, title } = props;

  const [showChildren, setShowChildren] = useState(false);
  const [children, setChildren] = useState([]);

  const 获取卡片 = async () => {
    const 笔记本ID = await SY文档.根据ID获取笔记本ID(id);

    const { files } = await SY文档.根据ID列出文档(笔记本ID, id);
    const data = await 卡片.获取指定文档下的卡片(id);

    setChildren(
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
          index: index + 1,
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
            index: index + 1,
          }))
        )
    );
  };

  useEffect(() => {
    if (!isLeaf) {
      获取卡片();
    }
  }, []);

  return (
    <>
      <li
        className="b3-list-item b3-list-item--hide-action"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", id);
        }}
      >
        <span
          className={
            isLeaf
              ? "fn__hidden"
              : "b3-list-item__toggle b3-list-item__toggle--hl "
          }
          style={{ paddingLeft: `${(index - 1) * 18 + 10}px` }}
          onClick={() => {
            setShowChildren(!showChildren);
          }}
        >
          {showChildren ? <DownOutlined /> : <RightOutlined />}
        </span>
        <span className="b3-list-item__text ariaLabel">{title}</span>
      </li>

      {showChildren && (
        <ul className="b3-list b3-list--background">
          {children.map((item) => {
            return (
              <ListItem
                key={item.key}
                id={item.key}
                title={item.title}
                index={item.index}
                isLeaf={item.isLeaf}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
export default ListItem;
