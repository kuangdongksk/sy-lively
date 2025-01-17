import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";
import { WidgetNode, EWidgetNode } from "./node/widget";
import { EPluginLifeCycleNode, PluginLifeCycleNode } from "./node/PluginLifeCycle/OnLoadNode";
import { ESyFeatureNode, SyFeatureNode } from "./node/SyFeature";

export const nodeTypes = {
  // Components
  [EWidgetNode.CalendarNode]: WidgetNode.CalendarNode,
  [EWidgetNode.PopPanelNode]: WidgetNode.PopPanelNode,
  // PluginLifeCycle
  [EPluginLifeCycleNode.OnLoadNode]: PluginLifeCycleNode.OnLoadNode,
  [EPluginLifeCycleNode.OnLayoutReadyNode]: PluginLifeCycleNode.OnLayoutReadyNode,
  [EPluginLifeCycleNode.OnUnloadNode]: PluginLifeCycleNode.OnUnloadNode,
  [EPluginLifeCycleNode.OnUninstallNode]: PluginLifeCycleNode.OnUninstallNode,
  // SyFeature
  [ESyFeatureNode.AddCommandNode]: SyFeatureNode.AddCommandNode,
  [ESyFeatureNode.AddSlashCommandNode]: SyFeatureNode.AddSlashCommandNode,
  [ESyFeatureNode.AddStyleNode]: SyFeatureNode.AddStyleNode,
  [ESyFeatureNode.AddTabNode]: SyFeatureNode.AddTabNode,
  [ESyFeatureNode.AddTopBarNode]: SyFeatureNode.AddTopBarNode,
  [ESyFeatureNode.LoadDataNode]: SyFeatureNode.LoadDataNode,
  [ESyFeatureNode.SaveDataNode]: SyFeatureNode.SaveDataNode,
};

export const ContextMenuConfig = [
  {
    label: i18n.t(I18nPath.workFlow.components.node),
    submenu: Object.values(EWidgetNode).map((node) => ({
      label: i18n.t("workFlow.components." + node + ".this"),
      node,
    })),
  },
  {
    label: i18n.t(I18nPath.workFlow.pluginLifeCycle.node),
    submenu: Object.values(EPluginLifeCycleNode).map((node) => ({
      label: i18n.t("workFlow.pluginLifeCycle." + node + ".this"),
      node,
    })),
  },
  {
    label: i18n.t(I18nPath.workFlow.syFeature.node),
    submenu: Object.values(ESyFeatureNode).map((node) => ({
      label: i18n.t("workFlow.syFeature." + node + ".this"),
      node,
    })),
  },
];
