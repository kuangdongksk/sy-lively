import { 思源协议 } from "@/constant/系统码";
import {
  ExpandOutlined,
  ExportOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import styles from "./index.module.less";

export interface ITreeItemProps {
  id: string;
  label: string;
}

function TreeItem(props: ITreeItemProps) {
  const { id, label } = props;
  return (
    <span>
      <a data-type="block-ref" data-id={id} href={思源协议 + id}>
        {label}
      </a>
      <span
        className={styles.copy + " b3-tooltips b3-tooltips__sw"}
        aria-label="复制为引用"
        onClick={async (e) => {
          e.stopPropagation();
          await navigator.clipboard.writeText(`((${id} '${label}'))`);
          message.success("已复制");
        }}
      >
        <ExportOutlined />
      </span>
      <span
        className={styles.copy + " b3-tooltips b3-tooltips__sw"}
        aria-label="复制为嵌入"
        onClick={async (e) => {
          e.stopPropagation();
          await navigator.clipboard.writeText(
            `{{select * from blocks where id='${id}'}}`
          );
          message.success("已复制");
        }}
      >
        <ExpandOutlined />
      </span>
      <span
        className={styles.copy + " b3-tooltips b3-tooltips__sw"}
        aria-label="复制块链接"
        onClick={async (e) => {
          e.stopPropagation();
          await navigator.clipboard.writeText(`siyuan://blocks/${id}`);
          message.success("已复制");
        }}
      >
        <LinkOutlined />
      </span>
    </span>
  );
}
export default TreeItem;
