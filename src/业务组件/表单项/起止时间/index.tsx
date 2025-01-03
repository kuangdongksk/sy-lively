import { E提醒 } from "@/constant/syLively";
import { DatePicker, Form } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export interface I起止时间Props {}

function 起止时间(props: I起止时间Props) {
  const {} = props;
  return (
    <Form.Item
      name="起止时间"
      label="起止时间"
      rules={[
        {
          validator: (_rule, value) => {
            if (!value || !value[0] || !value[1]) {
              return Promise.resolve();
            }
            if (dayjs(value[0]).isAfter(dayjs(value[1]))) {
              return Promise.reject("开始时间不能大于结束时间！");
            }
            return Promise.resolve();
          },
        },
        ({ getFieldValue }) => ({
          validator(_rule, value) {
            if (
              (!value || !value[0] || !value[1]) &&
              getFieldValue("提醒") !== E提醒.不提醒
            ) {
              return Promise.reject("请选择开始时间和结束时间，或者取消提醒");
            }
            return Promise.resolve();
          },
        }),
      ]}
    >
      <RangePicker
        showTime={{
          defaultValue: [
            dayjs().startOf("day").add(8, "hour"),
            dayjs().startOf("day").add(12, "hour"),
          ],
        }}
        presets={[
          {
            label: "明天08-12点",
            value: [
              dayjs().add(1, "day").startOf("day").add(8, "hour"),
              dayjs().add(1, "day").startOf("day").add(12, "hour"),
            ],
          },
        ]}
        placeholder={["开始时间", "结束时间"]}
      />
    </Form.Item>
  );
}
export default 起止时间;
