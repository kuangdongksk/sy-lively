import {
  CalendarOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useAppStyle } from "./App.style";
import { 用户设置Atom } from "./jotai/用户设置";
import 主页 from "./pages/主页";
import 日历 from "./pages/日历";
import 设置 from "./pages/设置";
import { E常用SQL, SQL } from "./API/SQL";

const { Header, Footer, Sider, Content } = Layout;

type TNav = "主页" | "日历" | "设置";

function App() {
  const { styles } = useAppStyle();
  const [, 设置用户设置] = useAtom(用户设置Atom);
  const navMap = {
    主页: <主页 />,
    日历: <日历 />,
    设置: <设置 />,
  };

  const [current, setCurrent] = useState<TNav>("设置");
  const [目录, 设置目录] = useState([
    { key: "设置", icon: <SettingOutlined />, label: "设置" },
  ]);

  useEffect(() => {
    SQL(E常用SQL.获取用户设置).then(({ data }) => {
      if (data.length !== 0) {
        目录.unshift({
          key: "日历",
          icon: <CalendarOutlined />,
          label: "日历",
        });
        目录.unshift({ key: "主页", icon: <HomeOutlined />, label: "主页" });
        设置目录([...目录]);
        设置用户设置(data);
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
          defaultValue={current}
          mode="inline"
          inlineCollapsed={true}
          items={目录}
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
