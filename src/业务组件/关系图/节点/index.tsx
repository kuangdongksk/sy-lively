import { I卡片 } from "@/class/卡片";
import 块链接 from "@/components/块链接";
import { Flex } from "antd";
import styles from "./index.module.less";

export interface I节点Props {
  data: {
    id: string;
    data: I卡片;
  };
}

function 节点(props: I节点Props) {
  const { data } = props;

  return (
    <Flex className={styles.节点} vertical>
      <Flex align="center" justify="space-between">
        <块链接 id={data.id} 标题={data.data.标题} />
      </Flex>
    </Flex>
  );
}
export default 节点;
