import { 事项数据 } from "@/store/事项数据";
import { stringArr2string } from "@/utils/拼接与拆解";
import { green, red } from "@ant-design/colors";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import 数字标签 from "../../../../../../components/基础/数字标签";
import 添加子项 from "../添加子项";
import { use事项样式 } from "./index.style";
import { I事项 } from "@/types/喧嚣/事项";
import { useState } from "react";
import { E按钮类型 } from "@/基础组件/按钮";

const { RangePicker } = DatePicker;
const 程度选项数组 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
  label: i,
  value: i,
}));

export interface I事项Props {
  事项: I事项;
}

function 事项(props: I事项Props) {
  const { 事项 } = props;
  const { ID, 名称, 重要程度, 紧急程度, 开始时间, 结束时间 } = 事项;
  const [数据, 令数据为] = useAtom(事项数据);
  const { styles } = use事项样式();

  const [不可编辑名称, 切换名称编辑状态] = useState(true);

  return (
    <div className={styles.事项}>
      <div className={styles.标题}>
        {不可编辑名称 ? (
          <>
            <Button
              className={E按钮类型.文本}
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(
                  stringArr2string([名称, `#${ID}`])
                );
              }}
            />
            <Button
              className={E按钮类型.文本}
              size="small"
              icon={<EditOutlined />}
              onClick={() => 切换名称编辑状态((pre) => !pre)}
            />
            <span className="">{名称}</span>
          </>
        ) : (
          <Input
            autoFocus
            className=""
            defaultValue={名称}
            variant={"outlined"}
            onChange={(e) => {
              数据.find((item) => item.ID === ID).名称 = e.target.value;
              令数据为([...数据]);
            }}
            onBlur={() => 切换名称编辑状态((pre) => !pre)}
          />
        )}
        <span className={styles.id文本}>#{ID.slice(0, 6)}</span>
        <添加子项 节点={事项} />
      </div>
      <div className={styles.程度}>
        <Select<number>
          className={styles.选择器}
          defaultValue={重要程度}
          options={程度选项数组}
          variant="borderless"
          labelRender={({ value }) => {
            return <数字标签 num={Number(value)} 颜色数组={green} />;
          }}
          optionRender={({ value }) => {
            return <数字标签 num={Number(value)} 颜色数组={green} />;
          }}
          onChange={(value) => {
            数据.find((item) => item.ID === ID).重要程度 = value;
            令数据为([...数据]);
          }}
        />
        <Select<number>
          className={styles.选择器}
          defaultValue={紧急程度}
          options={程度选项数组}
          variant="borderless"
          labelRender={({ value }) => {
            return <数字标签 num={Number(value)} 颜色数组={red} />;
          }}
          optionRender={({ value }) => {
            return <数字标签 num={Number(value)} 颜色数组={red} />;
          }}
          onChange={(value) => {
            数据.find((item) => item.ID === ID).紧急程度 = value;
            令数据为([...数据]);
          }}
        />
      </div>
      <div className={styles.时间}>
        <RangePicker
          allowEmpty
          defaultValue={[dayjs(开始时间), dayjs(结束时间)]}
          placeholder={["开始时间", "结束时间"]}
          showTime
          variant="borderless"
          onChange={(value) => {
            数据.find((item) => item.ID === ID).开始时间 = dayjs(
              value[0]
            ).valueOf();
            数据.find((item) => item.ID === ID).结束时间 = dayjs(
              value[1]
            ).valueOf();
            令数据为([...数据]);
          }}
        />
      </div>
    </div>
  );
}

export default 事项;
