import { I卡片 } from "@/class/卡片";
import NodeCanvas from "@/业务组件/关系图/Pixi";
import { useEffect, useState } from "react";
import { 卡片 as 卡片类 } from "@/class/卡片";

export interface I卡片Props {}

function 卡片(props: I卡片Props) {
  const {} = props;

  const [加载中, 令加载中为] = useState(false);

  const [所有卡片, 设置所有卡片] = useState<I卡片[]>([]);

  const 获取所有卡片 = async () => {
    令加载中为(true);
    const 所有卡片 = await 卡片类.获取所有卡片();

    设置所有卡片(所有卡片);
    令加载中为(false);
  };

  useEffect(() => {
    获取所有卡片();
  }, []);

  return (
    <>
      <NodeCanvas nodes={所有卡片} />
    </>
  );
}
export default 卡片;
