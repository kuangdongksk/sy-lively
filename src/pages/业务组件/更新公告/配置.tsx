export const 最新版本号 = "P0.2.0";

export enum E功能类型 {
  功能 = "功能",
  优化 = "优化",
  修复 = "修复",
  移除 = "移除",
}

export const 所有更新公告: {
  key: string;
  Children: {
    type: string;
    content: React.ReactNode[];
  }[];
}[] = [
  {
    key: 最新版本号,
    Children: [
      {
        type: E功能类型.功能,
        content: [
          <>
            优化了拖拽的交互，可以通过拖拽改变文档的层级结构
            <a href="https://ld246.com/article/1733056485439">关系图的使用</a>
          </>,
        ],
      },
    ],
  },
  {
    key: "P0.1.6",
    Children: [
      {
        type: E功能类型.功能,
        content: [
          "关系页面可以对卡片进行操作，可以将卡片移入单开一页的卡片中",
          "再次添加卡片文档功能",
        ],
      },
    ],
  },
  {
    key: "P0.1.5-3",
    Children: [
      {
        type: E功能类型.功能,
        content: ["添加关系页面，在导航中可以看见，尚无实际功能"],
      },
    ],
  },
  {
    key: "P0.1.5-2",
    Children: [
      {
        type: E功能类型.功能,
        content: ["卡片新建时必须选择领域分类"],
      },
      {
        type: E功能类型.移除,
        content: ["移除创建卡片文档功能，卡片与事项存储在一起"],
      },
    ],
  },
  {
    key: "P0.1.5",
    Children: [
      {
        type: "功能",
        content: [
          "右上Dock添加卡片侧栏 （alt+q 可以新增卡片）",
          "添加数据升级逻辑",
        ],
      },
    ],
  },
  {
    key: "P0.1.4-3",
    Children: [
      {
        type: "优化",
        content: ["主题色跟随思源颜色"],
      },
    ],
  },
  {
    key: "P0.1.4-2",
    Children: [
      {
        type: "修复",
        content: ["修复卡片无法添加别名问题"],
      },
      {
        type: "移除",
        content: ["移除更换主题功能"],
      },
    ],
  },
  {
    key: "P0.1.4",
    Children: [
      {
        type: "功能",
        content: [
          <>
            添加快捷键alt+q，快速新建卡片，需要在喧嚣设置内生成卡片文档,并且需要在思源的设置--搜索中打开超级块和别名
            <img src="https://b3logfile.com/file/2024/11/image-Ut4o21e.png?imageView2/2/interlace/1/format/webp" />
          </>,
          "添加快捷键shift+alt+x，快速打开喧嚣面板",
        ],
      },
    ],
  },
  {
    key: "P0.1.3-2",
    Children: [
      {
        type: "功能",
        content: [
          "添加数据修复：单开一页如果不是布尔值会重置为false",
          "更新失败添加控制台报错",
        ],
      },
      {
        type: "优化",
        content: ["鼠标悬浮到事项和分类名称上出现预览", "可以查看历史公告"],
      },
      {
        type: "修复",
        content: ["修改非单开一页的事项会导致分类文档重命名"],
      },
    ],
  },
  {
    key: "P0.1.3",
    Children: [
      {
        type: "功能",
        content: [
          "对事项中的错误的字段增加判断，目前会将无法识别的提醒和重复重置为不提醒和不重复",
        ],
      },
      {
        type: "优化",
        content: [
          "添加领域后刷新领域界面",
          "所有新增事项表单添加初始值",
          "增强通知，现在通知还会在桌面提示",
        ],
      },
      {
        type: "修复",
        content: ["修复重复不生效问题"],
      },
    ],
  },
];
