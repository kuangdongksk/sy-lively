import { OptionsHelper } from "@/class/OptionsHelper";
import SQL助手 from "@/class/SQL助手";
import 增改查弹窗表单, {
  I增改查弹窗表单Ref,
} from "@/components/增改查弹窗表单";
import { E提醒 } from "@/constant/状态配置";
import { E时间格式化 } from "@/constant/配置常量";
import { 新建事项块, 更新事项块 } from "@/pages/领域/详情/tools";
import { 用户设置Atom } from "@/store/用户设置";
import { 生成事项 } from "@/tools/事项";
import { I事项, I领域分类, T层级 } from "@/types/喧嚣/事项";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  message,
  Select,
} from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const { RangePicker } = DatePicker;
export interface I事项表单Props {
  事项?: I事项;
  完成回调?: () => void | Promise<void>;
}

function O事项表单(props: I事项表单Props, ref: Ref<I增改查弹窗表单Ref>) {
  const [用户设置] = useAtom(用户设置Atom);

  const { 事项, 完成回调 } = props;
  const 表单Ref = useRef<I增改查弹窗表单Ref>(null);
  const [领域分类列表, 令领域分类列表为] = useState<I领域分类[]>([]);

  const [展开更多, 令展开更多为] = useState(false);

  const 加载领域分类列表 = async () => {
    await SQL助手.获取笔记本下的所有分类按领域(用户设置.笔记本ID).then(
      (data) => {
        令领域分类列表为(data);
      }
    );
  };

  useImperativeHandle(ref, () => {
    return {
      令表单状态为: 表单Ref.current?.令表单状态为,
      令表单值为: (事项初始值: Partial<I事项>) => {
        表单Ref.current?.令表单值为({
          名称: dayjs().format(E时间格式化.思源时间) + " 未命名事项",
          重要程度: 5,
          紧急程度: 5,
          提醒: E提醒.不提醒,
          ...事项初始值,
        });
      },
    };
  });

  useEffect(() => {
    加载领域分类列表();
  }, [用户设置]);

  return (
    <增改查弹窗表单
      ref={表单Ref}
      弹窗主题="事项"
      表单内容={() => {
        return (
          <>
            <Form.Item name="名称" label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="状态" label="状态">
              <Select options={OptionsHelper.状态} />
            </Form.Item>
            <Form.Item
              name="领域分类"
              label="领域分类"
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
            >
              <Cascader
                expandTrigger="hover"
                options={领域分类列表.map((领域) => ({
                  value: 领域.ID,
                  label: 领域.名称,
                  children: 领域.分类.map((分类) => ({
                    value: 分类.ID,
                    label: 分类.名称,
                  })),
                }))}
              />
            </Form.Item>
            <Form.Item name="提醒" label="提醒">
              <Select options={OptionsHelper.提醒} />
            </Form.Item>
            <Form.Item
              name="起止时间"
              label="起止时间"
              rules={[
                {
                  validator: (_rule, value) => {
                    if (!value || !value[0] || !value[1]) {
                      return Promise.resolve();
                    }
                    if (dayjs(value[0]).isAfter(dayjs(value[1]))) {
                      return Promise.reject("开始时间不能大于结束时间！");
                    }
                    return Promise.resolve();
                  },
                },
                ({ getFieldValue }) => ({
                  validator(_rule, value) {
                    if (
                      (!value || !value[0] || !value[1]) &&
                      getFieldValue("提醒") !== E提醒.不提醒
                    ) {
                      return Promise.reject(
                        "请选择开始时间和结束时间，或者取消提醒"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <RangePicker showTime placeholder={["开始时间", "结束时间"]} />
            </Form.Item>
            <Form.Item name="单开一页" label="单开一页" valuePropName="checked">
              <Checkbox>为该事项创建一个文档</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="link" onClick={() => 令展开更多为(!展开更多)}>
                {展开更多 ? "收起" : "展开更多"}
              </Button>
            </Form.Item>

            <Form.Item name="紧急程度" label="紧急程度" hidden={!展开更多}>
              <Select options={OptionsHelper.程度} />
            </Form.Item>
            <Form.Item name="重要程度" label="重要程度" hidden={!展开更多}>
              <Select options={OptionsHelper.程度} />
            </Form.Item>
          </>
        );
      }}
      提交表单={async (value, 表单状态) => {
        const { 领域分类, 起止时间 } = value;
        const [领域ID, 分类ID] = 领域分类;
        const [开始时间, 结束时间] = 起止时间 ?? [];

        let 新事项 = {
          ...事项,
          ...value,
          层级: 1 as T层级,
          父项ID: 分类ID,
          分类ID,
          领域ID,
          笔记本ID: 用户设置.笔记本ID,
          开始时间: 开始时间
            ? dayjs(开始时间).format(E时间格式化.思源时间)
            : undefined,
          结束时间: 结束时间
            ? dayjs(结束时间).format(E时间格式化.思源时间)
            : undefined,
          更新时间: dayjs().format(E时间格式化.思源时间),
        };

        const 是新建的 = 表单状态 === "添加";
        delete 新事项.领域分类;
        delete 新事项.起止时间;

        if (是新建的) {
          新事项 = 生成事项(新事项);
          await 新建事项块(新事项 as I事项, 用户设置);
          message.success("添加成功");
        } else {
          await 更新事项块(新事项 as I事项);
          message.success("更新成功");
        }
        完成回调 && 完成回调();
      }}
    />
  );
}

const 事项表单 = forwardRef(O事项表单);

export default 事项表单;
