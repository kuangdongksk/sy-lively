import { E事项状态 } from "@/constant/状态配置";
import { ProColumns } from "@ant-design/pro-components";
import { ColumnsType } from "antd/es/table";
import { I事项 } from "../事项树/components/事项";

export const 分类列配置: ColumnsType = [
  {
    title: "分类名称",
    key: "名称",
    dataIndex: "名称",
  },
];

export const 列配置: ProColumns<I事项>[] = [
  {
    title: "名称",
    key: "名称",
    dataIndex: "名称",
    formItemProps: () => {
      return {
        rules: [{ required: true, message: "此项为必填项" }],
      };
    },
  },
  {
    title: "重要程度",
    key: "重要程度",
    dataIndex: "重要程度",
  },
  {
    title: "紧急程度",
    key: "紧急程度",
    dataIndex: "紧急程度",
  },
  {
    title: "开始时间",
    key: "开始时间",
    dataIndex: "开始时间",
  },
  {
    title: "结束时间",
    key: "结束时间",
    dataIndex: "结束时间",
  },
  {
    title: "状态",
    key: "状态",
    dataIndex: "状态",
    valueType: "select",
    valueEnum: {
      未开始: { text: "未开始", status: E事项状态.未开始 },
      open: {
        text: "未解决",
        status: "Error",
      },
      closed: {
        text: "已解决",
        status: "Success",
      },
    },
  },
  {
    title: "重复",
    key: "重复",
    dataIndex: "重复",
  },
  // {
  //   title: "层级",
  //   key: "层级",
  //   dataIndex: "层级",
  // },
  // {
  //   title: "父项",
  //   key: "父项",
  //   dataIndex: "父项",
  // },
  // {
  //   title: "子项",
  //   key: "子项",
  //   dataIndex: "子项",
  // },
];
