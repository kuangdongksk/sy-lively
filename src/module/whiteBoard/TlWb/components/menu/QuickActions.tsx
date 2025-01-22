import { SY块 } from "@/class/思源/块";
import {
  DefaultQuickActions,
  DefaultQuickActionsContent,
  TldrawUiMenuItem,
  useEditor,
} from "tldraw";

export interface IQuickActionsProps {}

function QuickActions(props: IQuickActionsProps) {
  const {} = props;

  const editor = useEditor();

  return (
    <DefaultQuickActions>
      <DefaultQuickActionsContent />
      <div style={{ backgroundColor: "thistle" }}>
        <TldrawUiMenuItem
          id="save"
          icon="save"
          onSelect={async () => {
            const str = editor.store.serialize("document");
            // https://tldraw.dev/reference/tldraw/exportToBlob
            // https://tldraw.dev/reference/editor/Editor#getSvgElement
            // https://tldraw.dev/reference/editor/Editor#getSvgString
            const svg = await editor.getSvgElement(Array.from(editor.getCurrentPageShapeIds()));

            const xmlSerializer = new XMLSerializer();
            const svgString = xmlSerializer.serializeToString(svg.svg);

            SY块.更新块({
              id: editor.store.id,
              data: `<div>${svgString}</div>`,
              dataType: "markdown",
            });
          }}
        />
      </div>
    </DefaultQuickActions>
  );
}
export default QuickActions;
