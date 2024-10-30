import { 思源协议 } from "@/constant/系统码";
import { ColumnsType } from "antd/es/table";


export const 分类列配置: ColumnsType = [
  {
    dataIndex: "名称",
    key: "名称",
    title: "分类名称",
    render: (_dom, record) => {
      return <a href={思源协议 + record.id}>{record.名称}</a>;
    },
  },
];


