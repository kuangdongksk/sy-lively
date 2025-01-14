import styles from "./index.module.less";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { storeAtom } from "@/store";
import { useAtom } from "jotai";
import { EStoreKey } from "@/constant/系统码";

export interface I关系Props {}

function 关系(props: I关系Props) {
  const {} = props;
  const [{ load: 加载 }] = useAtom(storeAtom);

  const [加载中, 设置加载中] = useState(true);
  const [卡片文档ID, 设置卡片文档ID] = useState<string>();

  useEffect(() => {
    加载(EStoreKey.卡片文档ID).then((id) => {
      设置卡片文档ID(id);
      设置加载中(false);
    });
  }, []);

  return (
    <div className={styles.撑满}>
      <Spin spinning={加载中}>
        {卡片文档ID ? <></> : <div>请先到设置中生成卡片文档</div>}
      </Spin>
    </div>
  );
}
export default 关系;
