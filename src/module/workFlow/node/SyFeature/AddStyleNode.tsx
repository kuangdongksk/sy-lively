import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import { useNodeId, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { Dialog } from "siyuan";
import NodeWrapper from "..";

export interface IAddStyleNodeProps {}

function AddStyleNode(props: IAddStyleNodeProps) {
  const {} = props;

  const [styleStr, setStyleStr] = useState("");

  const nodeId = useNodeId();
  const { updateNodeData } = useReactFlow();

  return (
    <NodeWrapper>
      <div
        onClick={() => {
          const textArea = document.createElement("textarea");
          textArea.className = "b3-text-field";
          textArea.placeholder = "请输入样式，就是在style标签里面的内容";
          textArea.innerText = styleStr;
          textArea.style.margin = "12px";

          const dialog = new Dialog({
            title: "添加样式",
            width: "400px",
            height: "300px",
            content: "",
            destroyCallback() {
              setStyleStr(textArea.value);
              updateNodeData(nodeId, { style: textArea.value });
              textArea.remove();
            },
          });

          dialog.element.querySelector(".b3-dialog__body").append(textArea);
        }}
      >
        {i18n.t(I18nPath.workFlow.syFeature.AddStyleNode.this)}
        <div
          style={{
            maxWidth: "200px",
            wordWrap: "break-word",
          }}
        >
          {styleStr}
        </div>
      </div>
    </NodeWrapper>
  );
}
export default AddStyleNode;
