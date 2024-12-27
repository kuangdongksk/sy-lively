import { 思源协议 } from "@/constant/系统码";
import { strIsRef } from "@/tools/SY/link";
import { useCallback } from "react";
import {
  BaseBoxShapeUtil,
  Editor,
  HTMLContainer,
  TLBaseShape,
  Tldraw,
} from "tldraw";
import "tldraw/tldraw.css";

export interface ITlWbProps {}

function TlWb(props: ITlWbProps) {
  const {} = props;
  const externalContentHandlerCom = useCallback((info) => {
    console.log("🚀 ~ externalContentHandlerCom ~ info:", info);
  }, []);

  const handleMount = useCallback((editor: Editor) => {
    editor.registerExternalContentHandler("embed", externalContentHandlerCom);
    editor.registerExternalContentHandler("files", externalContentHandlerCom);
    editor.registerExternalContentHandler("text", (info) => {
      const { point, sources, text, type } = info;

      const center = point ?? editor.getViewportPageBounds().center;
      const { id, title } = strIsRef(text) || {};
      console.log(
        "🚀 ~ editor.registerExternalContentHandler ~ id, title:",
        id,
        title
      );
      if (id) {
        editor.createShape({
          type: "html",
          props: {
            html: `
              <a data-type="block-ref" data-id='${id}' href='${思源协议 + id}'>
                ${title}
              </a>
          `,
          },
        });
      }
    });
    editor.registerExternalContentHandler("url", externalContentHandlerCom);
    editor.registerExternalContentHandler(
      "svg-text",
      externalContentHandlerCom
    );
  }, []);

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      onDrop={(e) => {
        e.preventDefault(); 
        e.stopPropagation();
        console.log("🚀 ~ TlWb ~ e:", e);
      }}
      
      onDragOver={(e) => {
        e.preventDefault();
        console.log("🚀 ~ TlWb ~ e:", e);
      }}
    >
      <Tldraw
        shapeUtils={[DangerousHtmlExample]}
        onUiEvent={(e, data) => {
          console.log("🚀 ~ e:", e, data);
        }}
        onMount={handleMount}
      />
    </div>
  );
}
export default TlWb;

type myShape = TLBaseShape<
  "html",
  {
    h: number;
    w: number;
    html: string;
  }
>;

class DangerousHtmlExample extends BaseBoxShapeUtil<myShape> {
  static override type = "html" as const;

  override getDefaultProps() {
    return {
      type: "html",
      w: 500,
      h: 300,
      html: "<div>hello</div>",
    };
  }

  override component(shape: myShape) {
    return (
      <HTMLContainer style={{ overflow: "auto", pointerEvents: "all" }}>
        <div dangerouslySetInnerHTML={{ __html: shape.props.html }}></div>
      </HTMLContainer>
    );
  }

  override indicator(shape: myShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
