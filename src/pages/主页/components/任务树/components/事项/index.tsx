import { 事项数据 } from "@/jotai/事项数据";
import { stringArr2string } from "@/utils/拼接与拆解";
import { green, red } from "@ant-design/colors";
import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { Button, DatePicker, Input, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useAtom } from "jotai";
import { 事项状态 } from "../../../../../../constant/状态配置";
import 数字标签 from "../数字标签";
import 添加子项 from "../添加子项";
import { use事项样式 } from "./index.style";

const { RangePicker } = DatePicker;
const 程度选项数组 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
  label: i,
  value: i,
}));

export type TCorn = string;
export type T层级 = 0 | 1 | 2 | 3 | 4 | 5;
export interface I事项 {
  id: string;
  key: string;
  checkable: boolean;
  名称: string;
  重要程度: number;
  紧急程度: number;
  开始时间: number;
  结束时间: number;
  状态: 事项状态;
  重复: TCorn | false;
  层级: T层级;
  父项: string;
  子项: I事项[];
}

export interface I事项Props {
  事项: I事项;
}

function 事项(props: I事项Props) {
  const { 事项 } = props;
  const { id, 名称, 重要程度, 紧急程度, 开始时间, 结束时间 } = 事项;
  const [数据, 令数据为] = useAtom(事项数据);
  const { styles } = use事项样式();

  const [不可编辑名称, { toggle: 切换名称编辑状态 }] = useBoolean(true);

  return (
    <div className={styles.事项}>
      <div className={styles.标题}>
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
            autoFocus
            className=""
            defaultValue={名称}
            variant={"outlined"}
            onChange={(e) => {
              数据.find((item) => item.id === id).名称 = e.target.value;
              令数据为([...数据]);
            }}
            onBlur={切换名称编辑状态}
          />
        )}
        <span className={styles.id文本}>#{id.slice(0, 6)}</span>
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
            数据.find((item) => item.id === id).重要程度 = value;
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
            数据.find((item) => item.id === id).紧急程度 = value;
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
            数据.find((item) => item.id === id).开始时间 = dayjs(
              value[0]
            ).valueOf();
            数据.find((item) => item.id === id).结束时间 = dayjs(
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
