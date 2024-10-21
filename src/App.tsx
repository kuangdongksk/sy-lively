import {
  CalendarOutlined,
  HeatMapOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SQL助手, { E常用SQL } from "./API/SQL";
import { useAppStyle } from "./App.style";
import { 用户设置Atom } from "./store/用户设置";
import { 开启调试, 调试 } from "./tools/调试";

const { Header, Footer, Sider, Content } = Layout;

const C目录 = [
  { key: "主页", icon: <HomeOutlined />, label: "主页" },
  { key: "领域", icon: <HeatMapOutlined />, label: "领域" },
  { key: "日历", icon: <CalendarOutlined />, label: "日历" },
  { key: "设置", icon: <SettingOutlined />, label: "设置" },
];

function App() {
  const 当前位置 = useLocation();
  const 导航到 = useNavigate();
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);

  const { styles } = useAppStyle();
  const [目录, 设置目录] = useState([C目录[3]]);

  useEffect(() => {
    SQL助手.常用(E常用SQL.获取用户设置).then(({ data }) => {
      if (data.length !== 0) {
        const 启用的用户设置 = data.filter(
          (item: { value: string }) => JSON.parse(item.value).是否使用中
        )[0];
        设置用户设置(JSON.parse(启用的用户设置.value));
        导航到("/领域");
      } else {
        导航到("/设置");
      }
    });
  }, []);

  useEffect(() => {
    if (用户设置.是否使用中) {
      设置目录(C目录);
    }
  }, [用户设置]);

  useEffect(() => {
    调试(开启调试);
  });

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
        <Header>
          <Breadcrumb
            items={decodeURI(当前位置.pathname)
              .split("/")
              .map((item) => ({
                title: item,
              }))}
          />
        </Header>
        <Content className={styles.内容}>
          <Outlet />
        </Content>
        <Footer>{dayjs().format("YYYY年MM月DD日")}</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
