import { Form, Input } from "antd";
import CronParser from "cron-parser";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

export interface ICron输入Props {}

function Cron输入(props: ICron输入Props) {
  const {} = props;

  const [下次执行时间, 令下次执行时间为] = useState<string | null>(null);

  const formItem = useMemo(() => {
    return (
      <Form.Item
        name="重复"
        label="重复"
        rules={[
          {
            validator: (_rule, value) => {
              if (!value) {
                令下次执行时间为(null);
                return Promise.resolve();
              }
              try {
                const interval = CronParser.parseExpression(value, {
                  currentDate: new Date(),
                  tz: "Asia/Shanghai",
                });
                令下次执行时间为(
                  dayjs(interval.next().toDate()).format(
                    "YYYY-MM-DD HH:mm:ss ddd"
                  )
                );
                return Promise.resolve();
              } catch (error) {
                令下次执行时间为(null);
                return Promise.reject("Cron表达式格式错误");
              }
            },
          },
        ]}
        tooltip={"请使用AI帮你生成标准的Cron表达式，不填则不重复"}
      >
        <Input />
      </Form.Item>
    );
  }, []);

  return (
    <>
      {formItem}
      <span>下次执行时间：{下次执行时间}</span>
    </>
  );
}
export default Cron输入;
