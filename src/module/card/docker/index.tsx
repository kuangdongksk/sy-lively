import SY文档 from "@/class/思源/文档";
import RcInput from "@/components/base/rc/Input";
import { SyIconEnum } from "@/components/base/sy/svgIcon";
import Docker from "@/components/docker";
import { CardQueryService } from "@/module/card/service/CardQueryService";
import { useDebounce } from "ahooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import ListItem, { generateChildren, LeafItem } from "./ListItem";

function CardDocker(props: { 卡片文档ID: string }) {
  const { 卡片文档ID } = props;

  const [树形卡片列表, 设置树形卡片列表] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResultList, setSearchResultList] = useState([]);
  const debouncedSearchValue = useDebounce<string>(searchValue, { wait: 500 });

  const 获取卡片 = async () => {
    const 笔记本ID = await SY文档.根据ID获取笔记本ID(卡片文档ID);

    const { files } = await SY文档.获取指定文档下的子文档(笔记本ID, 卡片文档ID);
    const data = await CardQueryService.获取指定文档下的卡片(卡片文档ID);

    设置树形卡片列表(generateChildren(files, data, 1));
  };

  const handleSearch = useCallback(async (value: string) => {
    const data = await CardQueryService.getCardsByKeyword(value);
    setSearchResultList(data);
  }, []);

  const treeList = useMemo(
    () =>
      树形卡片列表.map((item) => (
        <ListItem key={item.key} id={item.key} title={item.title} index={1} isLeaf={item.isLeaf} />
      )),
    [树形卡片列表]
  );

  useEffect(() => {
    if (debouncedSearchValue) {
      handleSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    获取卡片();
  }, []);

  return (
    <Docker
      customButtons={[
        {
          ariaLabel: "刷新",
          dataType: "refresh",
          icon: SyIconEnum.Refresh,
          onClick: () => {
            获取卡片();
          },
        },
      ]}
      minButton
      title={"喧嚣卡片"}
    >
      <RcInput
        variant="search"
        htmlAttrs={{
          onChange: (e) => {
            setSearchValue(e.target.value);
          },
          value: searchValue,
          placeholder: "搜索",
        }}
      />
      <ul className={"b3-list b3-list--background"}>
        {searchValue ? searchResultList.map((item) => <LeafItem {...item} />) : treeList}
      </ul>
    </Docker>
  );
}

export default CardDocker;
