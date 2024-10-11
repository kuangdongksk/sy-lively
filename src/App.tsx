import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import { useState } from "react";
import 主页 from "./pages/主页";
import 日历 from "./pages/日历";
import { E数据索引 } from "./constant/系统码";

const { Header, Footer, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

type TNav = "主页" | "日历";

export interface IAppProps {
  loadData: (key: E数据索引) => Promise<any>;
  saveData: (key: E数据索引, value: any) => Promise<void>;
}

function App(props: IAppProps) {
  const { loadData, saveData } = props;
  const navMap = {
    主页: <主页 加载数据={loadData} 保存数据={saveData} />,
    日历: <日历 />,
  };

  const [current, setCurrent] = useState<TNav>("主页");

  const menuList: MenuItem[] = [
    { key: "主页", icon: <PieChartOutlined />, label: "主页" },
    { key: "日历", icon: <DesktopOutlined />, label: "日历" },
  ];

  return (
    <Layout
      style={{
        height: "100%",
      }}
    >
      <Sider style={{ background: "#2f3437", width: "150px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3>喧嚣</h3>
        </div>
        <Menu
          defaultSelectedKeys={["主页"]}
          mode="inline"
          inlineCollapsed={true}
          items={menuList}
          onSelect={(data) => {
            setCurrent(data.key as TNav);
          }}
        />
      </Sider>
      <Layout>
        <Header>又是新的一天！</Header>
        <Content>{navMap[current]}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
