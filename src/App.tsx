import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useAppStyle } from "./App.style";
import 主页 from "./pages/主页";
import 日历 from "./pages/日历";

const { Header, Footer, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

type TNav = "主页" | "日历";

function App() {
  const { styles } = useAppStyle();

  const navMap = {
    主页: <主页 />,
    日历: <日历 />,
  };

  const [current, setCurrent] = useState<TNav>("主页");

  const menuList: MenuItem[] = [
    { key: "主页", icon: <HomeOutlined />, label: "主页" },
    { key: "日历", icon: <CalendarOutlined />, label: "日历" },
  ];

  return (
    <Layout className={styles.App}>
      <Sider className={styles.侧栏}>
        <div className={styles.logo}>
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
      <Layout className={styles.主体}>
        <Header>又是新的一天！</Header>
        <Content className={styles.内容}>{navMap[current]}</Content>
        <Footer>{dayjs().format("YYYY年MM月DD日")}</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
