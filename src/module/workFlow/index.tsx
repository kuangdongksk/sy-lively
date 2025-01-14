import SYDiaForm from "@/components/base/sy/弹出表单";
import { EBtnClass } from "@/components/base/sy/按钮";
import SYFormItem from "@/components/base/sy/表单/表单项";
import SYInput from "@/components/base/sy/输入";
import { EStoreKey } from "@/constant/系统码";
import { storeAtom } from "@/store";
import "@xyflow/react/dist/style.css";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IWorkFlowProps {}

function WorkFlow(props: IWorkFlowProps) {
  const {} = props;
  const navigate = useNavigate();

  const [{ load, save }] = useAtom(storeAtom);
  const [data, setData] = useState<any>([]);

  const getData = useCallback(async () => {
    const data = await load(EStoreKey.WorkFlow);
    setData(data || []);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <div>
        <button
          className={EBtnClass.默认}
          onClick={() => {
            const form = new SYDiaForm<{
              name: string;
            }>({
              dialogConfig: {
                title: "添加",
                width: "400px",
                height: "200px",
              },
              formItems: [
                new SYFormItem({
                  label: "名称",
                  input: new SYInput({
                    name: "name",
                    type: "text",
                    placeholder: "请输入名称",
                  }),
                }),
              ],
              onConfirm(values) {
                navigate("/工作流/detail", {
                  state: {
                    name: values.name,
                    id: nanoid(),
                  },
                });

                return {
                  success: true,
                };
              },
            });
          }}
        >
          添加
        </button>
      </div>
      {data.map((item: any) => (
        <div key={item.id}>{item}</div>
      ))}
    </div>
  );
}
export default WorkFlow;
