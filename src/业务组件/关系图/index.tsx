import { I卡片, 卡片 } from "@/class/卡片";
import { E按钮类型 } from "@/基础组件/按钮";
import { ExtensionCategory, Graph as G6Graph, register } from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { 配置图, 默认配置 } from "./配置";
import { 配置事件 } from "./配置/事件";

export interface I关系图Props {
  卡片文档ID: string;
  onDestroy?: () => void;
}

register(ExtensionCategory.NODE, "react", ReactNode);

function 关系图(props: I关系图Props) {
  const { 卡片文档ID, onDestroy } = props;

  const 图Ref = useRef<G6Graph>();
  const 容器Ref = useRef<HTMLDivElement>(null);

  const [所有卡片, 设置所有卡片] = useState<I卡片[]>([]);
  const [点列表, 设置点列表] = useState<I卡片[]>([]);
  const [集合列表, 设置集合列表] = useState<I卡片[]>([]);

  const 当前节点 = useRef<string | undefined>();
  const 当前组合 = useRef<string | undefined>();
  const 是否穿越 = useRef<number>(0);

  const 获取所有卡片 = async () => {
    const 所有卡片 = await 卡片.获取所有卡片();
    设置所有卡片(所有卡片);
    设置点列表(所有卡片.filter((卡片) => !卡片.单开一页));
    设置集合列表(所有卡片.filter((卡片) => 卡片.单开一页));
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

    配置图(图);

    配置事件({
      图,
      卡片文档ID,
      当前节点,
      当前组合,
      是否穿越,
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
    console.log("🚀 ~ 所有卡片", 所有卡片);

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
    <>
      <div>
        <Button className={E按钮类型.默认} onClick={获取所有卡片}>
          刷新
        </Button>
      </div>
      <div
        ref={容器Ref}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}
export default 关系图;
