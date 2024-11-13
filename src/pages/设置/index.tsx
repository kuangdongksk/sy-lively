import { Tabs } from "antd";
import 基础设置 from "./基础设置";

function 设置() {
  return (
    <Tabs
      items={[
        {
          key: "基础设置",
          label: "基础设置",
          children: <基础设置 />,
        },
      ]}
    />
  );
}
export default 设置;
