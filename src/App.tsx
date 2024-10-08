import {
  AppstoreOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import { useState } from "react";
import 主页 from "./pages/主页";
import 日历 from "./pages/日历";

const { Header, Footer, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

type TNav = "主页" | "日历";
function App() {
  const navMap = {
    主页: <主页 />,
    日历: <日历 />,
  };
  const [current, setCurrent] = useState<TNav>("主页");

  const menuList: MenuItem[] = [
    { key: "主页", icon: <PieChartOutlined />, label: "主页" },
    { key: "日历", icon: <DesktopOutlined />, label: "日历" },
    {
      key: "sub1",
      label: "Navigation One",
      icon: <MailOutlined />,
      children: [
        { key: "5", label: "Option 5" },
        { key: "6", label: "Option 6" },
        { key: "7", label: "Option 7" },
        { key: "8", label: "Option 8" },
      ],
    },
    {
      key: "sub2",
      label: "Navigation Two",
      icon: <AppstoreOutlined />,
      children: [
        { key: "9", label: "Option 9" },
        { key: "10", label: "Option 10" },
        {
          key: "sub3",
          label: "Submenu",
          children: [
            { key: "11", label: "Option 11" },
            { key: "12", label: "Option 12" },
          ],
        },
      ],
    },
  ];

  return (
    <Layout
      style={{
        height: "100%",
      }}
    >
      <Sider>
        <h3>喧嚣</h3>

        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={false}
          items={menuList}
          onSelect={(data) => {
            setCurrent(data.key as TNav);
          }}
        />
      </Sider>
      <Layout>
        <Header></Header>
        <Content>{navMap[current]}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
