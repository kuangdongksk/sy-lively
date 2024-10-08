import { stringArr2string } from "@/utils/拼接与拆解";
import { green, red } from "@ant-design/colors";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select } from "antd";
import { Dayjs } from "dayjs";
import { 事项状态 } from "../../../../constant/状态配置";
import 数字标签 from "../数字标签";
import { use事项样式 } from "./index.style";
import { useState } from "react";
import { useBoolean } from "ahooks";

const { RangePicker } = DatePicker;
const 程度选项数组 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
  label: i,
  value: i,
}));

export type TCorn = string;
export type T层级 = 0 | 1 | 2 | 3 | 4 | 5;

export interface I事项Props {
  id: string;
  名称: string;
  重要程度: number;
  紧急程度: number;
  开始时间: Dayjs;
  结束时间: Dayjs;
  状态: 事项状态;
  重复: TCorn | false;
  层级: T层级;
}

function 事项(props: I事项Props) {
  const { id, 名称, 重要程度, 紧急程度, 开始时间, 结束时间 } = props;

  const { styles } = use事项样式();

  const [不可编辑名称, { toggle: 切换名称编辑状态 }] = useBoolean(true);

  return (
    <div className={styles.事项}>
      <div className={styles.标题}>
        <Button size="small" type="link">
          {不可编辑名称 ? (
            <>
              <Button
                size="small"
                type="link"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    stringArr2string([名称, `#${id}`])
                  );
                }}
              />
              <Button
                size="small"
                type="link"
                icon={<EditOutlined />}
                onClick={切换名称编辑状态}
              />
              <span className="">{名称}</span>
            </>
          ) : (
            <Input
              className=""
              defaultValue={名称}
              variant={"outlined"}
              onChange={(e) => {
                console.log(e.target.value);
              }}
              onBlur={切换名称编辑状态}
            />
          )}

          <span className={styles.id文本}>#{id.slice(0, 6)}</span>
        </Button>
      </div>
      <div>
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
        />
      </div>
      <div>
        <RangePicker
          allowEmpty
          defaultValue={[开始时间, 结束时间]}
          placeholder={["开始时间", "结束时间"]}
          showTime
          variant="borderless"
        />
      </div>
    </div>
  );
}

export default 事项;
