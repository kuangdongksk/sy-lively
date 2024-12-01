import { E卡片属性名称, I卡片, 卡片 } from "@/class/卡片";
import { SY块 } from "@/class/思源/块";
import { E按钮类型 } from "@/基础组件/按钮";
import { ExtensionCategory, Graph as G6Graph, register } from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import { Button, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { 配置图, 默认配置 } from "./配置";
import { 配置事件 } from "./配置/事件";
import SY文档 from "@/class/思源/文档";

export interface I关系图Props {
  卡片文档ID: string;
  onDestroy?: () => void;
}

register(ExtensionCategory.NODE, "react", ReactNode);

function 关系图(props: I关系图Props) {
  const { 卡片文档ID, onDestroy } = props;

  const 图Ref = useRef<G6Graph>();
  const 容器Ref = useRef<HTMLDivElement>(null);

  const 当前节点 = useRef<string | undefined>();
  const 当前组合 = useRef<string | undefined>();
  const 是否穿越 = useRef<number>(0);
  const 更改的卡片ID列表 = useRef<Set<string>>(new Set());

  const [加载中, 令加载中为] = useState(false);

  const [所有卡片, 设置所有卡片] = useState<I卡片[]>([]);
  const [点列表, 设置点列表] = useState<I卡片[]>([]);
  const [集合列表, 设置集合列表] = useState<I卡片[]>([]);

  const 获取所有卡片 = async () => {
    令加载中为(true);
    const 所有卡片 = await 卡片.获取所有卡片();

    设置所有卡片(所有卡片);
    设置点列表(所有卡片.filter((卡片) => !卡片.单开一页));
    设置集合列表(所有卡片.filter((卡片) => 卡片.单开一页));
    令加载中为(false);
  };

  const 保存 = async () => {
    if (!图Ref.current || !更改的卡片ID列表.current.size) return;
    令加载中为(true);
    const {
      nodes: 点数据,
      combos: 组合数据,
      // edges: 边数据,
    } = 图Ref.current?.getData();

    const promiseList = [];

    点数据.forEach((点) => {
      const { id, combo, style } = 点;
      const 父项ID = combo ?? 卡片文档ID;
      if (更改的卡片ID列表.current.has(id)) {
        promiseList.push(() =>
          SY块.设置块属性({
            id,
            attrs: {
              [E卡片属性名称.X]: (Math.round(style.x / 10) * 10).toString(),
              [E卡片属性名称.Y]: (Math.round(style.y / 10) * 10).toString(),
              [E卡片属性名称.父项ID]: 父项ID,
            },
          })
        );

        promiseList.push(() =>
          SY块.移动块({
            id,
            parentID: 父项ID,
          })
        );
      }
    });

    组合数据.forEach((组合) => {
      const { id, combo, style } = 组合;
      const 父项ID = combo ?? 卡片文档ID;
      if (更改的卡片ID列表.current.has(id)) {
        promiseList.push(() =>
          SY块.设置块属性({
            id,
            attrs: {
              [E卡片属性名称.X]: (Math.round(style.x / 10) * 10).toString(),
              [E卡片属性名称.Y]: (Math.round(style.y / 10) * 10).toString(),
              [E卡片属性名称.父项ID]: 父项ID,
            },
          })
        );

        promiseList.push(() => SY文档.移动(id, 父项ID));
      }
    });

    await Promise.all(promiseList.map((fn) => fn()));

    更改的卡片ID列表.current.clear();
    await 获取所有卡片();
    令加载中为(false);
  };

  useEffect(() => {
    获取所有卡片();
  }, []);

  useEffect(() => {
    const 图 = new G6Graph({
      ...默认配置,
      container: 容器Ref.current!,
      data: {},
    });
    图Ref.current = 图;

    配置图({
      图,
      更改的卡片ID列表,
    });

    配置事件({
      图,
      卡片文档ID,
      当前节点,
      当前组合,
      是否穿越,
      更改的卡片ID列表,
      选中的节点: [],
      选中的组合: [],
      获取所有卡片,
    });

    图.render();

    return () => {
      const 图 = 图Ref.current;
      if (图) {
        try {
          图.destroy();
        } catch (error) {
          console.log(error);
        }
        onDestroy?.();
        图Ref.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (!图Ref.current) return;

    const 边数据 = [];

    所有卡片.forEach((卡片) => {
      if (卡片.关系) {
        卡片.关系.forEach((关系) => {
          边数据.push({
            source: 卡片.ID,
            target: 关系.目标ID,
          });
        });
      }
    });

    图Ref.current.setData({
      nodes: 点列表.map((点) => {
        const { 标题, 父项ID, ID, X, Y } = 点;

        return {
          id: ID,
          data: 点 as any,
          type: "circle",
          style: {
            labelText: 标题,
            x: X,
            y: Y,
          },
          combo: 所有卡片.some((card) => card.ID == 父项ID)
            ? 父项ID
            : undefined,
        };
      }),
      combos: 集合列表.map((组合) => {
        const { 标题, 父项ID, ID, X, Y } = 组合;

        return {
          id: ID,
          data: 组合 as any,
          style: {
            labelText: 标题,
            x: X,
            y: Y,
          },
          combo: 所有卡片.some((card) => card.ID == 父项ID)
            ? 父项ID
            : undefined,
        };
      }),
      edges: 边数据,
    });

    图Ref.current.render();
  }, [图Ref.current, 所有卡片, 点列表, 集合列表]);

  return (
    <Spin
      spinning={加载中}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div>
        <Button className={E按钮类型.默认} onClick={保存}>
          保存
        </Button>
      </div>
      <div
        ref={容器Ref}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </Spin>
  );
}
export default 关系图;
