import {
  DefaultActionsMenu,
  DefaultActionsMenuContent,
  TldrawUiMenuItem,
  useEditor,
} from "tldraw";

function ActionsMenu() {
  const editor = useEditor();

  return (
    <div>
      <DefaultActionsMenu>
        <div>
          <TldrawUiMenuItem
            id="save"
            label="保存"
            icon="save"
            readonlyOk
            onSelect={() => {
              editor.store.serialize("document");
            }}
          />
        </div>
        <DefaultActionsMenuContent />
      </DefaultActionsMenu>
    </div>
  );
}

export default ActionsMenu;
