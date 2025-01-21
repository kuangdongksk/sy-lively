import SY文档 from "@/class/思源/文档";
import BlockLink from "@/components/base/rc/BlockLink";
import SvgIcon, { SyIconEnum } from "@/components/base/sy/svgIcon";
import { CardQueryService } from "@/module/card/service/CardQueryService";
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

    const { files } = await SY文档.获取指定文档下的子文档(笔记本ID, id);
    const data = await CardQueryService.获取指定文档下的卡片(id);

    setChildren(generateChildren(files, data, index));
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
          className={isLeaf ? "fn__hidden" : "b3-list-item__toggle b3-list-item__toggle--hl "}
          style={{ paddingLeft: `${(index - 1) * 18 + 10}px` }}
          onClick={() => {
            setShowChildren(!showChildren);
          }}
        >
          {showChildren ? (
            <SvgIcon
              className="b3-list-item__arrow b3-list-item__arrow--open"
              icon={SyIconEnum.Right}
            />
          ) : (
            <SvgIcon className="b3-list-item__arrow" icon={SyIconEnum.Right} />
          )}
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

export function generateChildren(
  files: { name1: string; id: string }[],
  data: {
    ID: string;
    name: string;
  }[],
  index: number
) {
  return files
    .map(({ name1, id }) => ({
      title: <BlockLink block={{ id, label: name1 }} iconType={["ref", "link", "inset"]} />,
      key: id,
      isLeaf: false,
      index: index + 1,
    }))
    .concat(
      data.map((item) => ({
        title: (
          <BlockLink
            block={{ id: item.ID, label: item.name }}
            iconType={["ref", "link", "inset"]}
          />
        ),
        key: item.ID,
        isLeaf: true,
        index: index + 1,
      }))
    );
}

export function LeafItem({ id, name }: { id: string; name: string }) {
  return (
    <li
      className="b3-list-item b3-list-item--hide-action"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", id);
      }}
    >
      <span className={"fn__hidden"} style={{ paddingLeft: `${1 * 18 + 10}px` }}></span>
      <span className="b3-list-item__text ariaLabel">
        <BlockLink block={{ id, label: name }} iconType={["ref", "link", "inset"]} />
      </span>
    </li>
  );
}
