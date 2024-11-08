import { Tabs } from "antd";
import 基础设置 from "./基础设置";
import Cron设置 from "./Cron设置";

function 设置() {
  return (
    <Tabs
      items={[
        {
          key: "基础设置",
          label: "基础设置",
          children: <基础设置 />,
        },
        {
          key: "Cron设置",
          label: "Cron设置",
          children: <Cron设置 />,
        },
      ]}
    />
  );
}
export default 设置;
