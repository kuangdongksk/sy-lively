import { E持久化键 } from "@/constant/系统码";
import { 持久化atom } from "@/store";
import { Modal, Typography } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const { Text } = Typography;
export const 版本号 = "P0.1.2";

function 更新公告() {
  const [持久化] = useAtom(持久化atom);

  const { 加载, 保存 } = 持久化;
  const [展示更新公告, 设置展示更新公告] = useState(false);

  const 加载版本号 = async () => {
    const 当前版本号 = await 加载(E持久化键.当前版本);
    if (当前版本号 !== 版本号) {
      设置展示更新公告(true);
      保存(E持久化键.当前版本, 版本号);
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
      onClose={() => 设置展示更新公告(false)}
      onCancel={() => 设置展示更新公告(false)}
    >
      <Typography>
        <h3>{版本号}更新公告</h3>
        <h4>功能</h4>
        <ol>
          <li>
            支持通过Cron表达式设置重复，重复的事项会在
            <Text mark>本次任务完成</Text>且
            <Text mark>时间在本次开始时间之后</Text>
            打开插件时将开始时间更新为下次开始时间，并将状态设置为未完成。
          </li>
          <li>添加更新公告</li>
        </ol>
        {/* <h2>优化</h2>
        <ol></ol>
        <h2>修复</h2>
        <ol></ol> */}
      </Typography>
    </Modal>
  );
}
export default 更新公告;
