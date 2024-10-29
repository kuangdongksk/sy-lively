import {
  CalendarOutlined,
  HeatMapOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Segmented } from "antd";
import { useThemeMode } from "antd-style";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStyle } from "./App.style";
import SQL助手, { E常用SQL } from "./class/SQL助手";
import { I增改查弹窗表单Ref } from "./components/增改查弹窗表单";
import 面包屑 from "./components/面包屑";
import { 用户设置Atom } from "./store/用户设置";
import { 开启调试, 调试 } from "./tools/调试";
import 事项表单 from "./业务组件/表单/事项表单";

const { Header, Footer, Sider, Content } = Layout;

const C主题 = [
  { label: "自动", value: "auto" },
  { label: "亮色", value: "light" },
  { label: "暗色", value: "dark" },
];

const C目录 = [
  { key: "主页", icon: <HomeOutlined />, label: "主页" },
  { key: "领域", icon: <HeatMapOutlined />, label: "领域" },
  { key: "日历", icon: <CalendarOutlined />, label: "日历" },
  { key: "设置", icon: <SettingOutlined />, label: "设置" },
];

function App() {
  const 导航到 = useNavigate();
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);

  const { themeMode, setThemeMode } = useThemeMode();

  const { styles } = useAppStyle();
  const 事项Ref = useRef<I增改查弹窗表单Ref>();
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
    <>
      <Layout className={styles.App}>
        <Sider className={styles.侧栏}>
          <div className={styles.logo}>
            <Button
              icon={<PlusCircleOutlined />}
              onClick={() => 事项Ref.current?.令表单状态为("添加")}
            >
              <h3>喧嚣</h3>
            </Button>
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
          <Header className={styles.顶栏}>
            <面包屑 />
            <Segmented
              value={themeMode}
              onChange={setThemeMode}
              options={C主题}
            />
          </Header>
          <Content className={styles.内容}>
            <Outlet />
          </Content>
          <Footer>{dayjs().format("YYYY年MM月DD日")}</Footer>
        </Layout>
      </Layout>
      <事项表单 ref={事项Ref} />
    </>
  );
}

export default App;
