import { useState } from "react";
import NodeWrapper from "../..";
import { Dialog } from "siyuan";

export interface IAddStyleNodeProps {}

function AddStyleNode(props: IAddStyleNodeProps) {
  const {} = props;

  const [styleStr, setStyleStr] = useState("");

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
              textArea.remove();
            },
          });

          dialog.element.querySelector(".b3-dialog__body").append(textArea);
        }}
      >
        添加样式
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
