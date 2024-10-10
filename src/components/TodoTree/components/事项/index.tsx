import { CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { 事项状态 } from "../../../../constant/状态配置";
import 数字标签 from "../数字标签";
import { use事项样式 } from "./index.style";

import { green, red } from "@ant-design/colors";
import { stringArr2string } from "@/utils/拼接与拆解";

export type TCorn = string;

export interface I事项Props {
  id: string;
  名称: string;
  重要程度: number;
  紧急程度: number;
  开始时间: string;
  结束时间: string;
  状态: 事项状态;
  重复: TCorn | false;
}

function 事项(props: I事项Props) {
  const { id, 名称, 重要程度, 紧急程度, 开始时间, 结束时间 } = props;

  const { styles } = use事项样式();

  return (
    <div className={styles.事项}>
      <div className={styles.标题}>
        <Button
          size="small"
          type="link"
          icon={<CopyOutlined />}
          onClick={() => {
            navigator.clipboard.writeText(stringArr2string([名称, `#${id}`]));
          }}
        >
          <span className="">{名称}</span>
          <span className={styles.id文本}>#{id.slice(0, 6)}</span>
        </Button>
      </div>
      <div>
        起止时间：{开始时间}-{结束时间}
      </div>
      <div>
        <数字标签 num={重要程度} 颜色数组={green} />
        <数字标签 num={紧急程度} 颜色数组={red} />
      </div>
    </div>
  );
}

export default 事项;
