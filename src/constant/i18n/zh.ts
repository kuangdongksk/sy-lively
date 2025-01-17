export const I18nPath = {
  hello: "hello",
  base: {
    click: "base.click",
    rightClick: "base.rightClick",
  },
  workFlow: {
    this: "workFlow.this",
    components: {
      this: "workFlow.components.this",
      node: "workFlow.components.node",
      CalendarNode: {
        this: "workFlow.components.CalendarNode.this",
      },
      PopPanelNode: {
        this: "workFlow.components.PopPanelNode.this",
      },
    },
    pluginLifeCycle: {
      this: "workFlow.pluginLifeCycle.this",
      node: "workFlow.pluginLifeCycle.node",
      OnLoadNode: {
        this: "workFlow.pluginLifeCycle.OnLoadNode.this",
      },
      OnLayoutReadyNode: {
        this: "workFlow.pluginLifeCycle.OnLayoutReadyNode.this",
      },
      OnUnloadNode: {
        this: "workFlow.pluginLifeCycle.OnUnloadNode.this",
      },
      OnUninstallNode: {
        this: "workFlow.pluginLifeCycle.OnUninstallNode.this",
      },
    },
    syFeature: {
      this: "workFlow.syFeature.this",
      node: "workFlow.syFeature.node",
      AddCommandNode: {
        this: "workFlow.syFeature.AddCommandNode.this",
      },
      AddSlashCommandNode: {
        this: "workFlow.syFeature.AddSlashCommandNode.this",
      },
      AddStyleNode: {
        this: "workFlow.syFeature.AddStyleNode.this",
      },
      AddTabNode: {
        this: "workFlow.syFeature.AddTabNode.this",
      },
      AddTopBarNode: {
        this: "workFlow.syFeature.AddTopBarNode.this",
      },
      LoadDataNode: {
        this: "workFlow.syFeature.LoadDataNode.this",
        des: "workFlow.syFeature.LoadDataNode.des",
      },
      SaveDataNode: {
        this: "workFlow.syFeature.SaveDataNode.this",
        des: "workFlow.syFeature.SaveDataNode.des",
      },
    },
  },
};

const ZH = {
  hello: "你好",
  base: {
    click: "点击",
    rightClick: "右键点击",
  },
  workFlow: {
    this: "工作流",
    components: {
      this: "组件",
      node: "组件节点",
      CalendarNode: {
        this: "日历",
      },
      PopPanelNode: {
        this: "弹出面板",
      },
    },
    pluginLifeCycle: {
      this: "插件生命周期",
      node: "插件生命周期节点",
      OnLoadNode: {
        this: "加载",
      },
      OnLayoutReadyNode: {
        this: "布局完成",
      },
      OnUnloadNode: {
        this: "卸载",
      },
      OnUninstallNode: {
        this: "删除",
      },
    },
    syFeature: {
      this: "系统功能",
      node: "系统功能节点",
      AddCommandNode: {
        this: "添加快捷键",
      },
      AddSlashCommandNode: {
        this: "添加斜杠命令",
      },
      AddStyleNode: {
        this: "添加样式",
      },
      AddTabNode: {
        this: "添加页签",
      },
      AddTopBarNode: {
        this: "添加顶部栏",
      },
      LoadDataNode: {
        this: "加载数据",
        des: "参数：\n索引：就是保存时传递的参数。\n返回值：就是保存时传递的值。",
      },
      SaveDataNode: {
        this: "保存数据",
        des: "参数：\n索引：加载时要提供的参数，用于标识。\n值：要保存的值。",
      },
    },
  },
};
export default ZH;
