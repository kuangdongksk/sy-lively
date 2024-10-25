import SQL助手 from "@/class/SQL助手";
import { 用户设置Atom } from "@/store/用户设置";
import { I领域分类 } from "@/types/喧嚣";
import {
  ModalForm,
  ProFormCascader,
  ProFormDateTimeRangePicker,
  ProFormText,
} from "@ant-design/pro-components";
import { useAtom } from "jotai";
import { ReactElement, useEffect, useState } from "react";
import { useStyle } from "./index.style";
import { 生成事项 } from "@/tools/事项";
import { E时间格式化 } from "@/constant/配置常量";
import { 新建事项块 } from "@/pages/领域/详情/tools";
import dayjs from "dayjs";

export interface I事项表单Props {
  触发器: ReactElement;
}

function 事项表单(props: I事项表单Props) {
  const [用户设置] = useAtom(用户设置Atom);

  const { 触发器 } = props;
  const { styles } = useStyle();

  const [领域分类列表, 令领域分类列表为] = useState<I领域分类[]>([]);

  const 加载领域分类列表 = async () => {
    await SQL助手.获取笔记本下的所有分类按领域(用户设置.笔记本ID).then(
      (data) => {
        令领域分类列表为(data);
      }
    );
  };

  useEffect(() => {
    加载领域分类列表();
  }, [用户设置]);

  return (
    <ModalForm
      className={styles.弹窗}
      layout="horizontal"
      labelCol={{ span: 4 }}
      trigger={触发器}
      validateTrigger="onBlur"
      onFinish={async (value) => {
        const [领域ID, 分类ID] = value["领域分类"];
        const [开始时间, 结束时间] = value["起止时间"];

        const 新事项 = 生成事项({
          层级: 1,
          父项ID: 分类ID,
          分类ID,
          领域ID,
          笔记本ID: 用户设置.笔记本ID,
          名称: value["名称"],
          开始时间: dayjs(开始时间).format(E时间格式化.思源时间),
          结束时间: dayjs(结束时间).format(E时间格式化.思源时间),
        });

        await 新建事项块(新事项, 用户设置);
        return true;
      }}
    >
      <ProFormCascader
        name="领域分类"
        label="领域分类"
        fieldProps={{
          expandTrigger: "hover",
          options: 领域分类列表.map((领域) => ({
            value: 领域.ID,
            label: 领域.名称,
            children: 领域.分类.map((分类) => ({
              value: 分类.ID,
              label: 分类.名称,
            })),
          })),
        }}
        rules={[
          { required: true, message: "请选择领域分类" },
          {
            type: "array",
            min: 2,
            message: (
              <>
                请选择分类，P002：有分类未展示？ 查看
                <a
                  href="https://github.com/kuangdongksk/sy-lively/wiki/%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF#p002%E6%9C%89%E5%88%86%E7%B1%BB%E6%9C%AA%E5%B1%95%E7%A4%BA"
                  target="_blank"
                >
                  解决方案
                </a>
              </>
            ),
          },
        ]}
      />

      <ProFormText name="名称" label="名称" rules={[{ required: true }]} />
      <ProFormDateTimeRangePicker
        name="起止时间"
        label="起止时间"
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
}
export default 事项表单;
