import 领域表单 from "@/业务组件/表单/领域表单";
import { useStyle } from "./index.styles";
import { T弹窗状态 } from "@/components/弹窗表单";
import { useState } from "react";

function 新建领域() {
  const { styles } = useStyle();

  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);

  return (
    <div className={styles.卡片} onClick={() => 令弹窗状态为("添加")}>
      <div className={styles.卡片标题}>
        <div className={styles.卡片标题第一行}>
          <span>新建领域</span>
        </div>
        <span>点击新建一个领域吧！</span>
      </div>
      <div className={styles.卡片内容}>
        <div className={styles.卡片内容中间}></div>
      </div>

      <领域表单 弹窗状态={弹窗状态} 令弹窗状态为={令弹窗状态为} />
    </div>
  );
}
export default 新建领域;
