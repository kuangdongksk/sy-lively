import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import 领域表单 from "@/业务组件/表单/领域表单";
import { useRef } from "react";
import styles from "./index.module.less";
import { message } from "@/components/base/rc/Message";

function 新建领域(props: { 完成回调?: () => void }) {
  const { 完成回调 } = props;

  const 领域表单Ref = useRef<I增改查弹窗表单Ref>(null);

  return (
    <div
      className={styles.卡片}
      onClick={() => 领域表单Ref.current?.令表单状态为("添加")}
    >
      <div className={styles.卡片标题}>
        <div className={styles.卡片标题第一行}>
          <span>新建领域</span>
        </div>
        <span>点击新建一个领域吧！</span>
      </div>
      <div className={styles.卡片内容}>
        <div className={styles.卡片内容中间}></div>
      </div>

      <领域表单
        ref={领域表单Ref}
        完成回调={() => {
          完成回调 && 完成回调();
          message.success("新建成功");
        }}
      />
    </div>
  );
}
export default 新建领域;
