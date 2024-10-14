import {
  CalendarOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { E常用SQL, SQL } from "./API/SQL";
import { useAppStyle } from "./App.style";
import { 用户设置Atom } from "./jotai/用户设置";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const { styles } = useAppStyle();
  const 导航到 = useNavigate();
  const [, 设置用户设置] = useAtom(用户设置Atom);

  const [目录, 设置目录] = useState([
    { key: "设置", icon: <SettingOutlined />, label: "设置" },
  ]);

  useEffect(() => {
    SQL(E常用SQL.获取用户设置).then(({ data }) => {
      if (data.length !== 0) {
        const 启用的用户设置 = data.filter(
          (item) => JSON.parse(item.value).是否使用中
        )[0];

        目录.unshift({
          key: "日历",
          icon: <CalendarOutlined />,
          label: "日历",
        });
        目录.unshift({ key: "主页", icon: <HomeOutlined />, label: "主页" });
        设置目录([...目录]);

        设置用户设置(JSON.parse(启用的用户设置.value));
      }
    });
  }, []);

  return (
    <Layout className={styles.App}>
      <Sider className={styles.侧栏}>
        <div className={styles.logo}>
          <h3>喧嚣</h3>
        </div>
        <Menu
          mode="inline"
          inlineCollapsed={true}
          items={目录}
          onSelect={(data) => {
            导航到("/" + data.key);
          }}
        />
      </Sider>
      <Layout className={styles.主体}>
        <Header>又是新的一天！</Header>
        <Content className={styles.内容}>
          <Outlet />
        </Content>
        <Footer>{dayjs().format("YYYY年MM月DD日")}</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
