import { 思源协议 } from "@/constant/系统码";
import {
  ExpandOutlined,
  ExportOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import styles from "./index.module.less";

export interface IBlockLinkProps {
  block: {
    id: string;
    label: string;
  };
  iconType?: ("ref" | "link" | "inset")[];
}

function BlockLink(props: IBlockLinkProps) {
  const { block, iconType } = props;
  const { id, label } = block;

  const iconMap = {
    ref: <ExportOutlined />,
    link: <LinkOutlined />,
    inset: <ExpandOutlined />,
  };

  const copyMap = {
    ref: `((${id} '${label}'))`,
    link: `siyuan://blocks/${id}`,
    inset: `{{select * from blocks where id='${id}'}}`,
  };

  return (
    <>
      <a data-type="block-ref" data-id={id} href={思源协议 + id}>
        {label}
      </a>
      {iconType.map((type) => {
        return (
          <span
            className={styles.copy + " b3-tooltips b3-tooltips__sw"}
            aria-label="复制为引用"
            onClick={async (e) => {
              e.stopPropagation();
              await navigator.clipboard.writeText(copyMap[type]);
              message.success("已复制");
            }}
          >
            {iconMap[type]}
          </span>
        );
      })}
    </>
  );
}
export default BlockLink;
