import RoutePath from "@/components/base/rc/RoutePath";
import { EBtnClass } from "@/components/base/sy/按钮";
import { I增改查弹窗表单Ref } from "@/components/增改查弹窗表单";
import { EStoreKey } from "@/constant/系统码";
import { storeAtom } from "@/store";
import { 用户设置Atom } from "@/store/用户设置";
import { 开启调试, 调试 } from "@/tools/调试";
import 事项表单 from "@/业务组件/表单/事项表单";
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
import styles from "./index.module.less";

const { Sider, Content } = Layout;

const C目录 = [
  { key: "主页", icon: <HomeOutlined />, label: "主页" },
  { key: "领域", icon: <HeatMapOutlined />, label: "领域" },
  { key: "工作流", icon: <HeatMapOutlined />, label: "工作流" },
  { key: "白板", icon: <HeatMapOutlined />, label: "白板" },
  { key: "卡片", icon: <CreditCardOutlined />, label: "卡片" },
  { key: "关系", icon: <ShareAltOutlined />, label: "关系" },
  { key: "日历", icon: <CalendarOutlined />, label: "日历" },
  { key: "设置", icon: <SettingOutlined />, label: "设置" },
];

function App() {
  const 导航到 = useNavigate();
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const [持久化] = useAtom(storeAtom);

  const 事项Ref = useRef<I增改查弹窗表单Ref>();
  const [目录, 设置目录] = useState([C目录[3]]);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    持久化.load(EStoreKey.用户设置).then((启用的用户设置) => {
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
    <AntdApp style={{ backgroundColor: "var(--b3-theme-surface)", height: "100%" }}>
      <Layout className={styles.App}>
        <Sider
          className={styles.slider}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <div className={styles.logo}>
            <Button
              className={EBtnClass.默认}
              icon={<PlusCircleOutlined />}
              onClick={() => 事项Ref.current?.令表单状态为("添加")}
            >
              {collapsed ? null : <h3>喧嚣</h3>}
            </Button>
          </div>
          <Menu
            mode="inline"
            items={目录}
            onSelect={(data) => {
              导航到("/" + data.key);
            }}
          />
        </Sider>
        <Layout className={styles.主体}>
          <div>
            <RoutePath />
          </div>
          <Content className={styles.内容}>
            <Outlet />
          </Content>
          <div>{dayjs().format("YYYY年MM月DD日")}</div>
        </Layout>
      </Layout>
      <事项表单 ref={事项Ref} />
    </AntdApp>
  );
}

export default App;
