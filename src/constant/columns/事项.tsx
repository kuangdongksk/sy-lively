import 数字标签 from "@/components/数字标签";
import { green, red } from "@ant-design/colors";
import { ProColumns } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { E事项状态 } from "../状态配置";
import { 思源协议 } from "../系统码";
import { E时间格式化 } from "../配置常量";

const 程度 = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};

export const 事项列配置: ProColumns[] = [
  {
    dataIndex: "名称",
    key: "名称",
    title: "名称",
    render: (_dom, record) => {
      return <a href={思源协议 + record.ID}>{record.名称}</a>;
    },
  },
  {
    dataIndex: "重要程度",
    key: "重要程度",
    title: "重要程度",
    valueEnum: 程度,
    valueType: "select",
    width: 100,
    render: (_dom, record) => {
      return <数字标签 num={record.重要程度} 颜色数组={red} />;
    },
    sorter: (a, b) => a.重要程度 - b.重要程度,
  },
  {
    dataIndex: "紧急程度",
    key: "紧急程度",
    title: "紧急程度",
    valueType: "select",
    valueEnum: 程度,
    width: 100,
    render: (_dom, record) => {
      return <数字标签 num={record.紧急程度} 颜色数组={green} />;
    },
    sorter: (a, b) => a.紧急程度 - b.紧急程度,
  },
  {
    dataIndex: "开始时间",
    defaultSortOrder: "ascend",
    fieldProps: {
      format: E时间格式化.日记格式,
    },
    key: "开始时间",
    title: "开始时间",
    valueType: "dateTime",
    render: (_dom, record) => {
      return (
        <span>
          {dayjs(record.开始时间, E时间格式化.思源时间).format(
            E时间格式化.日记格式
          )}
        </span>
      );
    },
    sorter: (a, b) => {
      return (
        dayjs(a.开始时间, E时间格式化.思源时间).valueOf() -
        dayjs(b.开始时间, E时间格式化.思源时间).valueOf()
      );
    },
  },
  {
    dataIndex: "结束时间",
    defaultSortOrder: "ascend",
    fieldProps: {
      format: E时间格式化.日记格式,
    },
    key: "结束时间",
    title: "结束时间",
    valueType: "dateTime",
    // width: 150,
    render: (_dom, record) => {
      return (
        <span>
          {dayjs(record.结束时间, E时间格式化.思源时间).format(
            E时间格式化.日记格式
          )}
        </span>
      );
    },
    sorter: (a, b) => {
      return (
        dayjs(a.结束时间, E时间格式化.思源时间).valueOf() -
        dayjs(b.结束时间, E时间格式化.思源时间).valueOf()
      );
    },
  },
  {
    title: "状态",
    key: "状态",
    dataIndex: "状态",
    defaultSortOrder: "ascend",
    defaultFilteredValue: [E事项状态.未开始],
    filters: [
      {
        text: "未开始",
        value: E事项状态.未开始,
      },
      {
        text: "已完成",
        value: E事项状态.已完成,
      },
    ],
    valueType: "select",
    valueEnum: {
      [E事项状态.未开始]: { text: "未开始", status: "Default" },
      [E事项状态.已完成]: { text: "已完成", status: "Success" },
    },
    onFilter: (value, record) => {
      return record.状态 === value;
    },
    render: (_dom, record) => {
      const 映射 = {
        [E事项状态.未开始]: "未开始",
        [E事项状态.已完成]: "已完成",
      };
      return <span>{映射[record.状态]}</span>;
    },
    sorter: (a, b) => {
      const 映射 = {
        [E事项状态.未开始]: 0,
        [E事项状态.已完成]: 3,
      };
      return 映射[a.状态] - 映射[b.状态];
    },
  },
  // {
  //   title: "重复",
  //   key: "重复",
  //   dataIndex: "重复",
  // },
  {
    title: "层级",
    key: "层级",
    dataIndex: "层级",
  },
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
