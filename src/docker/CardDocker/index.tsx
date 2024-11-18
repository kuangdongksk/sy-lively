import { CopyOutlined } from "@ant-design/icons";
import { useDebounce } from "ahooks";
import { Button, Input, List, message } from "antd";
import { useEffect, useState } from "react";
import { E卡片属性名称, I卡片, 卡片 as 卡片类 } from "../../class/卡片";
import styles from "./index.module.less";
import { 思源协议 } from "@/constant/系统码";

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
      <div>喧嚣卡片</div>
      <Input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full min-w-xs"
        value={关键词}
        onChange={(e) => 令关键词为(e.target.value)}
      />
      <div>
        <List
          dataSource={卡片列表}
          renderItem={(卡片) => (
            <List.Item>
              <div className={styles.cardHeader}>
                <a
                  className={styles.cardTitle}
                  data-type="block-ref"
                  data-id={卡片[E卡片属性名称.ID]}
                  href={思源协议 + 卡片[E卡片属性名称.ID]}
                >
                  {卡片[E卡片属性名称.标题]}
                </a>
                <Button
                  icon={<CopyOutlined />}
                  type="link"
                  onClick={async () => {
                    // ((20241113184100-q4i1fg4 '浙江大华'))
                    await navigator.clipboard.writeText(
                      `((${卡片[E卡片属性名称.ID]} '${
                        卡片[E卡片属性名称.标题]
                      }'))`
                    );

                    message.success("已复制");
                  }}
                />
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default CardDocker;
