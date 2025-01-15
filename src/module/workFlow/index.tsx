import SYDiaForm from "@/components/base/sy/弹出表单";
import { EBtnClass } from "@/components/base/sy/按钮";
import SYFormItem from "@/components/base/sy/表单/表单项";
import SYInput from "@/components/base/sy/输入";
import { EStoreKey } from "@/constant/系统码";
import { storeAtom } from "@/store";
import { ReactFlowJsonObject } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NodeType } from "./types";
import Card from "@/components/base/rc/Card";

export interface IWorkFlowProps {}

export interface IWorkFlowData {
  checkPasses: boolean;
  data: ReactFlowJsonObject<NodeType>;
  enabled: boolean;
  id: string;
  name: string;
}

function WorkFlow(props: IWorkFlowProps) {
  const {} = props;
  const navigate = useNavigate();

  const [{ load }] = useAtom(storeAtom);
  const [data, setData] = useState<Map<string, IWorkFlowData>>(new Map());

  const getData = useCallback(async () => {
    const data = new Map<string, IWorkFlowData>(
      Object.entries((await load(EStoreKey.WorkFlow)) || {})
    );
    setData(data);
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
            new SYDiaForm<{
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
                    enabled: false,
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
      <div>
        {Array.from(data.values()).map((item) => (
          <Card
            title={item.name}
            action={
              <input
                className="b3-switch"
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => {}}
                disabled={!item.checkPasses}
                onClick={(e) => e.stopPropagation()}
              />
            }
            onClick={() => {
              navigate("/工作流/detail", { state: item });
              console.log("🚀 ~ WorkFlow ~ item:", item);
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default WorkFlow;
