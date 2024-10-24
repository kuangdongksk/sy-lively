import 弹窗, { I弹窗Ref } from "@/components/弹窗";
import { I事项 } from "@/types/喧嚣";
import { useRef } from "react";

export interface I删除事项Props {
  children: React.ReactNode;
  事项: I事项;
  完成回调: () => void | Promise<void>;
}

function 删除事项(props: I删除事项Props) {
  const { children, 事项, 完成回调 } = props;
  const 弹窗ref = useRef<I弹窗Ref<"打开">>(null);

  return (
    <>
      <span
        onClick={() => {
          弹窗ref.current.打开弹窗("打开");
        }}
      >
        {children}
      </span>
      <弹窗<"打开">
        ref={弹窗ref}
        内容={{
          ["打开"]: (
            <div>
              <div>
                如果要删除事项，请将鼠标悬浮在以下内容上，手动删除对应的块，删除完成后关闭弹窗即可
              </div>
              <div>
                <span data-type="block-ref" data-id={事项.ID}>
                  这是源数据所在的块
                </span>
              </div>
              <div>
                <span data-type="block-ref" data-id={事项.嵌入块ID}>
                  这是嵌入块所在的块
                </span>
              </div>
            </div>
          ),
        }}
        确定回调={完成回调}
        zIndex={10}
      />
    </>
  );
}
export default 删除事项;
