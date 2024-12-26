import 面包屑 from "@/components/基础/面包屑";
import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import { E持久化键 } from "@/constant/系统码";
import { 持久化atom } from "@/store";
import { 用户设置Atom } from "@/store/用户设置";
import { 开启调试, 调试 } from "@/tools/调试";
import 事项表单 from "@/业务组件/表单/事项表单";
import { E按钮类型 } from "@/基础组件/按钮";
import {
  CalendarOutlined,
  CreditCardOutlined,
  HeatMapOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { App as AntdApp, Button, Layout, Menu } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import 更新公告 from "../业务组件/更新公告";
import styles from "./index.module.less";

const { Header, Footer, Sider, Content } = Layout;

const C目录 = [
  { key: "主页", icon: <HomeOutlined />, label: "主页" },
  { key: "领域", icon: <HeatMapOutlined />, label: "领域" },
  { key: "Excalidraw", icon: <HeatMapOutlined />, label: "Excalidraw" },
  { key: "日历", icon: <CalendarOutlined />, label: "日历" },
  { key: "卡片", icon: <CreditCardOutlined />, label: "卡片" },
  { key: "关系", icon: <ShareAltOutlined />, label: "关系" },
  { key: "设置", icon: <SettingOutlined />, label: "设置" },
];

function App() {
  const 导航到 = useNavigate();
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const [持久化] = useAtom(持久化atom);

  const 事项Ref = useRef<I增改查弹窗表单Ref>();
  const [目录, 设置目录] = useState([C目录[3]]);

  useEffect(() => {
    持久化.加载(E持久化键.用户设置).then((启用的用户设置) => {
      if (启用的用户设置) {
        设置用户设置(启用的用户设置);
        导航到("/领域");
      } else {
        导航到("/设置");
      }
    });
  }, []);

  useEffect(() => {
    if (用户设置) {
      设置目录(C目录);
    }
  }, [用户设置]);

  useEffect(() => {
    调试(开启调试);
  });

  return (
    <AntdApp
      style={{ backgroundColor: "var(--b3-theme-surface)", height: "100%" }}
    >
      <Layout className={styles.App}>
        <Sider className={styles.侧栏}>
          <div className={styles.logo}>
            <Button
              className={E按钮类型.默认}
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
          </Header>
          <Content className={styles.内容}>
            <Outlet />
          </Content>
          <Footer>{dayjs().format("YYYY年MM月DD日")}</Footer>
        </Layout>
      </Layout>
      <事项表单 ref={事项Ref} />
      <更新公告 />
    </AntdApp>
  );
}

export default App;
