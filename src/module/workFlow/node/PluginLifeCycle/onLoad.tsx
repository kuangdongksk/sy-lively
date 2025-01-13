import { Handle, Position } from "@xyflow/react";
import styles from "./index.module.less";

export interface IOnLoadProps {}

function OnLoad(props: IOnLoadProps) {
  const {} = props;
  return (
    <div className={styles.onLoad}>
      <div>当插件加载时</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
export default OnLoad;

export enum EPluginLifeCycle {
  onLoad = "PluginLifeCycle_onLoad",
}

export const PluginLifeCycle = {
  OnLoad,
};
