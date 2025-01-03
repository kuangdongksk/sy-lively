import SQLer from "@/class/helper/SQLer";
import SY文档 from "@/class/思源/文档";
import { 思源协议 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { E按钮类型 } from "@/components/base/sy/按钮";
import { Badge, Button, Calendar, List, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import styles from "./index.module.less";

function 日历() {
  const [用户设置] = useAtom(用户设置Atom);

  const [当月事项, 令当月事项为] = useState([]);

  const 获取当月事项 = (日期: Dayjs) => {
    SQLer.根据开始时间获取当月事项(日期).then((data) => {
      令当月事项为(data);
    });
  };

  useEffect(() => {
    获取当月事项(dayjs());
  }, []);

  return (
    <Calendar
      className={styles.日历}
      fullCellRender={(value) => {
        const 当天事项 = 当月事项.filter(({ 开始时间 }) =>
          dayjs(开始时间).isSame(value, "day")
        );

        return (
          <div className={styles.天}>
            <div className={styles.天头部}>
              <Tooltip title="跳转到日记">
                <Button
                  className={E按钮类型.文本}
                  onClick={() => {
                    SY文档.创建日记文档(用户设置.笔记本ID).then((id) =>
                      window.open(思源协议 + id)
                    );
                  }}
                >
                  {value.format("DD")}
                </Button>
              </Tooltip>
            </div>

            <Tooltip
              title={
                <List
                  dataSource={当天事项}
                  renderItem={({ ID, 名称 }) => (
                    <List.Item>
                      <span key={ID} data-type="block-ref" data-id={ID}>
                        {名称}
                      </span>
                    </List.Item>
                  )}
                />
              }
            >
              <Badge
                style={{
                  background: "var(--b3-theme-error)",
                }}
                count={当天事项.length}
              />
            </Tooltip>
          </div>
        );
      }}
      onPanelChange={获取当月事项}
      onChange={获取当月事项}
    />
  );
}

export default 日历;
