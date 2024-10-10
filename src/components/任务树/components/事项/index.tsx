import { stringArr2string } from "@/utils/拼接与拆解";
import { green, red } from "@ant-design/colors";
import { CopyOutlined } from "@ant-design/icons";
import { Button, DatePicker, Select } from "antd";
import { Dayjs } from "dayjs";
import { 事项状态 } from "../../../../constant/状态配置";
import 数字标签 from "../数字标签";
import { use事项样式 } from "./index.style";

const { RangePicker } = DatePicker;
export type TCorn = string;

const 程度选项数组 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
  label: i,
  value: i,
}));
export interface I事项Props {
  id: string;
  名称: string;
  重要程度: number;
  紧急程度: number;
  开始时间: Dayjs;
  结束时间: Dayjs;
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
