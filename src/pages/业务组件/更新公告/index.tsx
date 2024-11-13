import { E持久化键 } from "@/constant/系统码";
import { 持久化atom } from "@/store";
import { Collapse, Modal, Typography } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const { Text } = Typography;
export const 版本号 = "P0.1.4";

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
      height={800}
      onClose={() => 设置展示更新公告(false)}
      onCancel={() => 设置展示更新公告(false)}
    >
      <Typography>
        <Collapse
          defaultActiveKey={[版本号]}
          ghost
          items={[
            {
              key: 版本号,
              label: `${版本号}更新公告`,
              children: (
                <>
                  <h4>功能</h4>
                  <ol>
                    <li>添加快捷键shift+alt+x，快速打开喧嚣面板</li>
                    <li>
                      添加快捷键alt+q，快速新建卡片，需要在喧嚣设置内生成卡片文档,并且需要在思源的设置--搜索中打开超级块和别名
                      <img src="https://b3logfile.com/file/2024/11/image-Ut4o21e.png?imageView2/2/interlace/1/format/webp" />
                    </li>
                  </ol>
                </>
              ),
            },
            {
              key: "P0.1.3-2",
              label: `P0.1.3-2更新公告`,
              children: (
                <>
                  <h4>功能</h4>
                  <ol>
                    <li>添加数据修复：单开一页如果不是布尔值会重置为false</li>
                    <li>更新失败添加控制台报错</li>
                  </ol>
                  <h4>优化</h4>
                  <ol>
                    <li>鼠标悬浮到事项和分类名称上出现预览</li>
                    <li>可以查看历史公告</li>
                  </ol>
                  <h4>修复</h4>
                  <ol>
                    <li>修改非单开一页的事项会导致分类文档重命名</li>
                  </ol>
                </>
              ),
            },
            {
              key: "P0.1.3",
              label: `P0.1.3更新公告`,
              children: (
                <>
                  <h4>功能</h4>
                  <ol>
                    <li>
                      对事项中的错误的字段增加判断，目前会将无法识别的提醒和重复重置为不提醒和不重复
                    </li>
                  </ol>
                  <h4>优化</h4>
                  <ol>
                    <li>添加领域后刷新领域界面</li>
                    <li>所有新增事项表单添加初始值</li>
                    <li>增强通知，现在通知还会在桌面提示</li>
                  </ol>
                  <h4>修复</h4>
                  <ol>
                    <li>修复重复不生效问题</li>
                  </ol>
                </>
              ),
            },
          ]}
        />
      </Typography>
    </Modal>
  );
}
export default 更新公告;
