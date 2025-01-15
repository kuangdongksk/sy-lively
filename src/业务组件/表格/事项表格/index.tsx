import { EBtnClass } from "@/components/base/sy/按钮";
import ProcessLine from "@/components/基础/进度条";
import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import { 事项列配置 } from "@/constant/columns/事项";
import { E事项状态 } from "@/constant/syLively";
import 删除事项 from "@/pages/领域/components/删除事项";
import { I事项 } from "@/types/喧嚣/事项";
import 事项表单 from "@/业务组件/表单/事项表单";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { MutableRefObject, useRef, useState } from "react";
import style from "./index.module.less";

export interface I事项表格Props<T事项> {
  标题?: React.ReactNode;
  参数?: any;
  获取事项列表: (
    参数: any & {
      版本: number;
    }
  ) => Promise<T事项[]>;
  新建事项?: (
    事项Ref: MutableRefObject<I增改查弹窗表单Ref>
  ) => Promise<void> | void;
}

function 事项表格<T事项 extends I事项>(props: I事项表格Props<T事项>) {
  const { 标题, 参数, 获取事项列表, 新建事项 } = props;

  const [事项列表, 令事项列表为] = useState([]);

  const 事项Ref = useRef<I增改查弹窗表单Ref>(null);

  const [版本, 令版本为] = useState(0);
  const [被修改的事项, 令被修改的事项为] = useState<I事项>();

  return (
    <>
      <ProcessLine
        process={
          事项列表.filter((事项) => 事项.状态 === E事项状态.已完成).length /
          事项列表.length
        }
      />
      <ProTable<T事项>
        className={style.proTable}
        columns={[
          ...事项列配置,
          {
            title: "操作",
            valueType: "option",
            fixed: "right",
            render: (_text, record) => [
              <button
                className={EBtnClass.文本}
                key="编辑"
                onClick={() => {
                  令被修改的事项为(record);
                  事项Ref.current.令表单状态为("编辑");
                  事项Ref.current.令表单值为({
                    ...record,
                    领域分类: [record.领域ID, record.分类ID],
                    起止时间: [dayjs(record.开始时间), dayjs(record.结束时间)],
                  });
                }}
              >
                <EditOutlined />
              </button>,
              <删除事项 事项={record} 完成回调={() => {}}>
                <button className={EBtnClass.删除} key="delete">
                  <DeleteOutlined />
                </button>
              </删除事项>,
            ],
          },
        ]}
        params={{
          版本,
          ...参数,
        }}
        request={async (params) => {
          const 结果 = await 获取事项列表(params);
          令事项列表为(结果);
          return {
            data: 结果,
          };
        }}
        rowKey="ID"
        search={false}
        headerTitle={标题}
        toolbar={{
          actions: [
            <button
              className={EBtnClass.默认}
              onClick={() => {
                if (新建事项) 新建事项(事项Ref);
                else {
                  事项Ref.current.令表单状态为("添加");
                }
              }}
            >
              新建
            </button>,
          ],
        }}
      />
      <事项表单
        ref={事项Ref}
        事项={被修改的事项}
        完成回调={() => 令版本为((pre) => pre + 1)}
      />
    </>
  );
}
export default 事项表格;
