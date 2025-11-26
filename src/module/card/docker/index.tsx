import SY文档 from "@/class/思源/文档";
import SearchInput from "@/components/base/rc/Input/SearchInput";
import { SyIconEnum } from "@/components/base/sy/svgIcon";
import Docker from "@/components/docker";
import { CardQueryService, I卡片 } from "@/module/card/service/CardQueryService";
import { useDebounce, useDebounceFn } from "ahooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import ListItem, { generateChildren, LeafItem } from "./ListItem";

function CardDocker(props: { 卡片文档ID: string }) {
  const { 卡片文档ID } = props;

  // const [是否仅搜索卡片文档内的卡片, 设置是否仅搜索卡片文档内的卡片] = useState(false);
  const [树形卡片列表, 设置树形卡片列表] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResultList, setSearchResultList] = useState<I卡片[]>([]);
  const debouncedSearchValue = useDebounce<string>(searchValue, { wait: 500 });

  const { run: 获取卡片 } = useDebounceFn(
    async () => {
      const 笔记本ID = await SY文档.根据ID获取笔记本ID(卡片文档ID);

      const { files } = await SY文档.获取指定文档下的子文档(笔记本ID, 卡片文档ID);
      const data = await CardQueryService.获取指定文档下的卡片(卡片文档ID);

      设置树形卡片列表(generateChildren(files, data, 1));
    },
    {
      wait: 500,
    }
  );

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
      title={<span>喧嚣卡片</span>}
    >
      <div style={{ padding: "0 12px" }}>
        <SearchInput
          htmlAttrs={{
            value: searchValue,
            placeholder: "搜索",
          }}
          onChange={setSearchValue}
        />
        {/* <div>
        <Checkbox
          type="checkbox"
          checked={是否仅搜索卡片文档内的卡片}
          onChange={(e) => {
            设置是否仅搜索卡片文档内的卡片(e.target.checked);
          }}
        >
          仅搜索卡片文档内的卡片
        </Checkbox>
      </div> */}
        <div style={{ marginBottom: "12px" }}>
          {/* <div style={{ marginBottom: "6px" }}>卡片文档内的</div> */}
          <ul className={"b3-list b3-list--background"}>
            {searchValue ? searchResultList.map((item) => <LeafItem {...item} />) : treeList}
          </ul>
        </div>
        {/* {searchValue && (
          <div>
            <div style={{ marginBottom: "6px" }}>卡片文档外的</div>
            <ul className={"b3-list b3-list--background"}>
              {searchResultList.map((item) => (
                <LeafItem {...item} />
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </Docker>
  );
}

export default CardDocker;
