import { 设置块属性 } from "@/API/块数据";
import CL文档 from "@/API/文档";
import SQL助手 from "@/class/SQL助手";
import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { 更新用户设置 } from "@/tools/设置";
import { I领域 } from "@/types/喧嚣";
import { 睡眠 } from "@/utils/异步";
import { Form, Input } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import 领域卡片 from "./components/领域卡片";
import { 领域页面样式 } from "./index.style";

export const 添加领域 = "添加领域";

function 领域() {
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const { styles } = 领域页面样式();
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);

  const [领域列表, 令领域列表为] = useState<I领域[]>([
    {
      ID: 添加领域,
      笔记本ID: 用户设置.笔记本ID,
      名称: 添加领域,
      描述: 添加领域,
      默认分类: "",
    },
  ]);

  const 获取领域列表 = () => {
    SQL助手.获取笔记本下的领域设置(用户设置.笔记本ID).then((data) => {
      令领域列表为(data);
    });
  };

  useEffect(() => {
    获取领域列表();
  }, [用户设置]);

  return (
    <>
      <div className={styles.领域}>
        {领域列表.map((领域) => {
          return (
            <领域卡片 key={领域.ID} 领域={领域} 令弹窗状态为={令弹窗状态为} />
          );
        })}
      </div>
      <弹窗表单
        弹窗标题={"领域"}
        弹窗状态={弹窗状态}
        表单配置={{
          initialValues: undefined,
        }}
        表单内容={
          <>
            <Form.Item name="领域名称" label="领域名称" required>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="领域描述" label="领域描述">
              <Input.TextArea autoSize={{ minRows: 1 }} />
            </Form.Item>
          </>
        }
        确认按钮文本="添加领域"
        弹窗确认={() => 令弹窗状态为(undefined)}
        弹窗取消={() => 令弹窗状态为(undefined)}
        提交表单={async (value: { 领域名称: string; 领域描述: string }) => {
          const 新建领域 = async () => {
            const { data: 领域文档ID } = await CL文档.通过Markdown创建(
              用户设置.笔记本ID,
              `/领域/${value.领域名称}`,
              ""
            );

            await 更新用户设置({
              当前用户设置: 用户设置,
              更改的用户设置: {
                默认领域: 领域文档ID,
              },
              设置用户设置,
            });

            const { data: 分类文档ID } = await CL文档.通过Markdown创建(
              用户设置.笔记本ID,
              `/领域/${value.领域名称}/杂项`,
              ""
            );

            await 设置块属性({
              id: 领域文档ID,
              attrs: {
                [E块属性名称.领域]: JSON.stringify({
                  名称: value.领域名称,
                  ID: 领域文档ID,
                  描述: value.领域描述,
                  笔记本ID: 用户设置.笔记本ID,
                  默认分类: 分类文档ID,
                }),
              },
            });

            await 设置块属性({
              id: 分类文档ID,
              attrs: {
                [E块属性名称.分类]: JSON.stringify({
                  名称: "杂项",
                  ID: 分类文档ID,
                  描述: "杂项",
                  领域ID: 领域文档ID,
                }),
              },
            });
            await 睡眠(1000);
            获取领域列表();
          };

          await 新建领域();
        }}
      />
    </>
  );
}

export default 领域;
