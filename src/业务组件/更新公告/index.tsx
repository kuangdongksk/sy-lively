import { E持久化键 } from "@/constant/系统码";
import { 持久化atom } from "@/store";
import { Collapse, Modal, Typography } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { 所有更新公告, latestVersion } from "./配置";

function 更新公告() {
  const [持久化] = useAtom(持久化atom);

  const { 加载, 保存 } = 持久化;
  const [展示更新公告, 设置展示更新公告] = useState(false);

  const 加载版本号 = async () => {
    const 当前版本号 = await 加载(E持久化键.当前版本);
    if (当前版本号 !== latestVersion) {
      设置展示更新公告(true);
      保存(E持久化键.当前版本, latestVersion);
    }
  };

  useEffect(() => {
    加载版本号();
  }, []);

  return (
    <Modal
      open={展示更新公告}
      footer={false}
      maskClosable={false}
      title="更新公告"
      height={800}
      onClose={() => 设置展示更新公告(false)}
      onCancel={() => 设置展示更新公告(false)}
    >
      <Typography>
        <Collapse
          defaultActiveKey={[latestVersion]}
          ghost
          items={所有更新公告.map((公告) => ({
            key: 公告.key,
            label: `${公告.key}更新公告`,
            children: 公告.Children.map(
              (child: { type: string; content: React.ReactNode[] }) => (
                <div>
                  <h4>{child.type}</h4>
                  <ol>
                    {child.content.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ol>
                </div>
              )
            ),
          }))}
        />
      </Typography>
    </Modal>
  );
}
export default 更新公告;
