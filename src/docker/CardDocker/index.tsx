import { 思源协议 } from "@/constant/系统码";
import { E按钮类型 } from "@/基础组件/按钮";
import { CopyOutlined } from "@ant-design/icons";
import { useDebounce } from "ahooks";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { I卡片, 卡片 as 卡片类 } from "../../class/卡片";
import styles from "./index.module.less";

function CardDocker() {
  const [关键词, 令关键词为] = useState("");
  const 关键词的防抖 = useDebounce(关键词, { wait: 500 });

  const [卡片列表, 令卡片列表为] = useState<I卡片[]>([]);

  const 获取卡片 = async () => {
    const data = await 卡片类.获取卡片通过关键词(关键词);
    令卡片列表为(data);
  };

  useEffect(() => {
    获取卡片();
  }, [关键词的防抖]);

  return (
    <div className={styles.cardDocker}>
      <div className={styles.title}>喧嚣卡片</div>
      <Input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full min-w-xs"
        value={关键词}
        onChange={(e) => 令关键词为(e.target.value)}
      />
      <div className={styles.content}>
        {卡片列表.map((卡片) => (
          <div className={styles.cardHeader}>
            <a
              className={styles.cardTitle}
              data-type="block-ref"
              data-id={卡片.ID}
              href={思源协议 + 卡片.ID}
            >
              {卡片.标题}
            </a>
            <Button
              className={E按钮类型.文本}
              icon={<CopyOutlined />}
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `((${卡片.ID} '${卡片.标题}'))`
                );
                message.success("已复制");
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardDocker;
